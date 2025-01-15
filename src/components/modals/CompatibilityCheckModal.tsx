import React, { useState } from 'react';
import { profileService } from '../../services/supabaseService';
import { toast } from 'react-hot-toast';
import { User, Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import DetailedCompatibilityView from '../compatibility/DetailedCompatibilityView';
import { SmartMatchProfile, CompatibilityScore } from '../../types';

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CompatibilityCheckModal: React.FC<CompatibilityCheckModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupidId, setCupidId] = useState('');
  const [matchProfile, setMatchProfile] = useState<SmartMatchProfile | null>(null);
  const [compatibilityDetails, setCompatibilityDetails] = useState<CompatibilityScore | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSearch = async () => {
    if (!cupidId.trim()) {
      setError('Please enter a valid CUPID ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting compatibility check for CUPID ID:', cupidId);
      
      // Get profile and compatibility details
      const [profile, compatibility] = await Promise.all([
        profileService.getUserProfileByCupidId(cupidId),
        profileService.getCompatibilityAnalysis(userId, cupidId)
      ]);

      console.log('Profile data:', profile);
      console.log('Raw compatibility data:', compatibility);

      if (!profile || !compatibility) {
        console.log('Missing data - Profile:', !!profile, 'Compatibility:', !!compatibility);
        throw new Error('Failed to fetch profile or compatibility data');
      }

      // Transform compatibility data to ensure correct format
      const formattedCompatibility = {
        ...compatibility,
        overall: Number(compatibility.overall) || 0,
        emotional: Number(compatibility.emotional) || 0,
        intellectual: Number(compatibility.intellectual) || 0,
        lifestyle: Number(compatibility.lifestyle) || 0
      };

      console.log('Formatted compatibility data:', formattedCompatibility);

      // Check if profile is favorited
      const favorites = await profileService.getFavoriteProfiles(userId);
      const isFav = favorites.some(f => f.profile.user_id === profile.user_id);

      setMatchProfile(profile);
      setCompatibilityDetails(formattedCompatibility);
      setIsFavorite(isFav);

      // Log state updates
      console.log('Updated state - Profile:', profile);
      console.log('Updated state - Compatibility:', formattedCompatibility);
    } catch (err: any) {
      console.error('Error fetching compatibility data:', err);
      setError(err.message || 'Failed to fetch compatibility data');
      toast.error('Failed to fetch compatibility data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!matchProfile) return;
    
    try {
      const success = await profileService.toggleFavorite(userId, matchProfile.user_id, !isFavorite);
      if (success) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    }
  };

  const handleClose = () => {
    setCupidId('');
    setMatchProfile(null);
    setCompatibilityDetails(null);
    setShowDetailedView(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  if (showDetailedView && matchProfile && compatibilityDetails) {
    return (
      <DetailedCompatibilityView
        isOpen={true}
        onClose={handleClose}
        onBack={() => setShowDetailedView(false)}
        profile={matchProfile}
        compatibility_details={compatibilityDetails}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compatibility Check</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="cupidId" className="block text-sm font-medium text-gray-700 mb-2">
            Enter CUPID ID
          </label>
          <div className="flex gap-2">
            <input
              id="cupidId"
              type="text"
              value={cupidId}
              onChange={(e) => setCupidId(e.target.value)}
              placeholder="e.g., CUPID-123"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !cupidId.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              Check
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Calculating compatibility...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {!loading && !error && matchProfile && compatibilityDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  {matchProfile.profile_image ? (
                    <img
                      src={matchProfile.profile_image}
                      alt={matchProfile.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <User className="w-6 h-6 text-indigo-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{matchProfile.fullname}</h3>
                  <p className="text-sm text-gray-600">CUPID ID: {matchProfile.cupid_id}</p>
                  <div className="flex gap-2 mt-1 text-sm text-gray-600">
                    {matchProfile.age && <span>{matchProfile.age} years</span>}
                    {matchProfile.location && <span>• {matchProfile.location}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 bg-gray-50'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="inline-block relative">
                  <svg className="w-24 h-24" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray={`${(compatibilityDetails.overall || 0) * 0.95}, 100`}
                    />
                    <text x="18" y="20.35" className="text-3xl font-bold" textAnchor="middle" fill="#4F46E5">
                      {compatibilityDetails.overall || 0}%
                    </text>
                  </svg>
                </div>
                <p className="text-gray-600 mt-2">Compatibility Score</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Emotional</h4>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${compatibilityDetails.emotional || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{compatibilityDetails.emotional || 0}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Intellectual</h4>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${compatibilityDetails.intellectual || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{compatibilityDetails.intellectual || 0}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Lifestyle</h4>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${compatibilityDetails.lifestyle || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{compatibilityDetails.lifestyle || 0}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {compatibilityDetails.strengths.slice(0, 2).map((strength, index) => (
                    <li key={index} className="text-gray-600">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Potential Challenges</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {compatibilityDetails.challenges.slice(0, 2).map((challenge, index) => (
                    <li key={index} className="text-gray-600">{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => setShowDetailedView(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Detailed Insights
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityCheckModal; 