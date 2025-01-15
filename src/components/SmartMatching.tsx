import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, AlertCircle, Loader2 } from 'lucide-react';
import { matchingService } from '../services/matchingService';
import { isProfileComplete, getCurrentProfile } from '../services/profileStorage';
import { CompatibilityInsights } from './compatibility/CompatibilityInsights';
import ErrorAlert from './ErrorAlert';
import { SmartMatch } from '../types';

const SmartMatching = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLowMatches, setShowLowMatches] = useState(false);
  const [showCupidIdSearch, setShowCupidIdSearch] = useState(false);
  const [cupidId, setCupidId] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);
  const [compatibleProfiles, setCompatibleProfiles] = useState<SmartMatch[]>([]);

  useEffect(() => {
    const profile = getCurrentProfile();
    if (!profile) {
      setError('Please complete your personality analysis first');
      setTimeout(() => {
        navigate('/personality-analysis');
      }, 2000);
    }
  }, [navigate]);

  const findMatches = async (includeLowMatches = false) => {
    const profile = getCurrentProfile();
    if (!profile) {
      setError('Please complete your personality analysis first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const matches = await matchingService.findCompatibleMatches(profile.cupidId);
      setCompatibleProfiles(matches);
      setShowLowMatches(includeLowMatches);
    } catch (error: any) {
      console.error('Error finding matches:', error);
      if (error.message?.includes('75%+ compatibility') && !includeLowMatches) {
        setError('No matches found with 75%+ compatibility. Would you like to see profiles with lower compatibility scores?');
      } else {
        setError(error.message || 'Failed to find matches. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCupidIdSearch = async () => {
    if (!cupidId.trim()) {
      setError('Please enter a valid CUPID ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = getCurrentProfile();
      if (!profile) {
        throw new Error('Please complete your profile first');
      }

      const match = await matchingService.findMatchByCupidId(profile.cupidId, cupidId);
      if (match) {
        setSelectedProfile(match);
      } else {
        setError('No profile found with this CUPID ID');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to find profile');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllMatches = () => {
    setShowLowMatches(true);
    findMatches(true);
  };

  const handleShowCupidIdSearch = () => {
    setShowCupidIdSearch(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Smart Matching</h1>
          <p className="text-gray-600">
            Find your perfect match using our advanced AI-powered compatibility analysis
          </p>
        </div>

        {error?.includes('75%+ compatibility') ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">No High Compatibility Matches Found</h2>
            <p className="text-gray-600 mb-6">
              Would you like to see profiles with lower compatibility scores or search for a specific CUPID ID?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShowAllMatches}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Show All Matches
              </button>
              <button
                onClick={handleShowCupidIdSearch}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Search CUPID ID
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            {showCupidIdSearch ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Search className="w-6 h-6 text-rose-500 mr-2" />
                  <h2 className="text-xl font-semibold">Search by CUPID ID</h2>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter CUPID ID..."
                    value={cupidId}
                    onChange={(e) => setCupidId(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleCupidIdSearch}
                    disabled={loading || !cupidId.trim()}
                    className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 disabled:bg-rose-400"
                  >
                    Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold">Find Compatible Matches</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Discover profiles that match your personality and preferences
                </p>
                <button
                  onClick={() => findMatches(false)}
                  disabled={loading || !isProfileComplete()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Finding matches...
                    </>
                  ) : (
                    'Find Matches'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => {
            setSelectedProfile(null);
            setCupidId('');
          }}
        />
      )}
    </div>
  );
};

export default SmartMatching;