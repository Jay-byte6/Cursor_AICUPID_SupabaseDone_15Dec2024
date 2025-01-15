import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/supabaseService';
import { SmartMatch } from '../../types';
import { toast } from 'react-hot-toast';
import CompatibilityCheckModal from '../CompatibilityCheckModal';

interface FavoriteProfilesProps {
  userId: string;
}

interface FavoriteProfile {
  user_id: string;
  fullname: string;
  age: number;
  location: string;
  profile_image: string | null;
  compatibility_score: number;
  occupation: string;
  relationship_history: string;
  lifestyle: string;
  cupid_id: string;
}

const FavoriteProfiles: React.FC<FavoriteProfilesProps> = ({ userId }) => {
  const [favorites, setFavorites] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const favoriteProfiles = await profileService.getFavoriteProfiles(userId);
      if (favoriteProfiles) {
        const formattedProfiles = favoriteProfiles.map((match: SmartMatch) => {
          const { profile, compatibility_score } = match;
          return {
            user_id: profile.user_id,
            fullname: profile.fullname,
            age: profile.age,
            location: profile.location,
            profile_image: profile.profile_image,
            compatibility_score,
            occupation: profile.occupation,
            relationship_history: profile.relationship_history,
            lifestyle: profile.lifestyle,
            cupid_id: profile.cupid_id
          };
        });
        setFavorites(formattedProfiles);
      } else {
        setFavorites([]);
      }
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Failed to fetch favorite profiles');
      toast.error('Failed to fetch favorite profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (profileId: string) => {
    try {
      await profileService.toggleFavorite(userId, profileId, false);
      toast.success('Profile removed from favorites');
      fetchFavorites(); // Refresh the list
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove profile from favorites');
    }
  };

  const handleCheckCompatibility = (profileId: string) => {
    setSelectedProfile(profileId);
    setShowCompatibilityModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No favorite profiles yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((profile) => (
        <div
          key={profile.user_id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl">
                  {profile.fullname[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{profile.fullname}</h3>
              <p className="text-sm text-gray-600">
                {profile.age} • {profile.location}
              </p>
              <p className="text-sm text-primary">
                {Math.round(profile.compatibility_score)}% Compatible
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleCheckCompatibility(profile.user_id)}
              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
            >
              Check Compatibility
            </button>
            <button
              onClick={() => handleRemoveFavorite(profile.user_id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {selectedProfile && (
        <CompatibilityCheckModal
          isOpen={showCompatibilityModal}
          onClose={() => {
            setShowCompatibilityModal(false);
            setSelectedProfile(null);
          }}
          userId={userId}
          matchId={selectedProfile}
        />
      )}
    </div>
  );
};

export default FavoriteProfiles; 