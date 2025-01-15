import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import { SmartMatch } from '../../types';
import { toast } from 'react-hot-toast';

const SmartMatching: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const matchResults = await profileService.findTopMatches(user.id);
      console.log('Loaded matches:', matchResults);
      setMatches(matchResults);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (matchId: string, isFavorite: boolean) => {
    if (!user) return;
    try {
      const success = await profileService.toggleFavorite(user.id, matchId, isFavorite);
      if (success) {
        toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
        setMatches(prevMatches => 
          prevMatches.map(match => 
            match.profile.user_id === matchId 
              ? { ...match, is_favorite: isFavorite }
              : match
          )
        );
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error(err.message || 'Failed to update favorites');
    }
  };

  const handleViewProfile = (match: SmartMatch) => {
    setSelectedProfile(match);
    setShowDetailedView(true);
  };

  const handleRefreshCompatibility = async (userId: string) => {
    if (!user) return;
    try {
      setRefreshing(userId);
      const compatibilityScore = await profileService.getCompatibilityAnalysis(user.id, userId);
      if (compatibilityScore) {
        setMatches(prevMatches =>
          prevMatches.map(match =>
            match.profile.user_id === userId
              ? {
                  ...match,
                  compatibility_score: compatibilityScore.overall,
                  compatibility_details: {
                    summary: compatibilityScore.summary,
                    strengths: compatibilityScore.strengths,
                    challenges: compatibilityScore.challenges,
                    tips: compatibilityScore.tips,
                    long_term_prediction: compatibilityScore.long_term_prediction
                  },
                  last_updated: new Date().toISOString()
                }
              : match
          )
        );
        toast.success('Compatibility insights updated');
      }
    } catch (err) {
      console.error('Error refreshing compatibility:', err);
      toast.error('Failed to refresh compatibility insights');
    } finally {
      setRefreshing(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Smart Matches</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.profile.user_id} className="relative">
            {/* Match card content */}
            <button
              onClick={() => handleToggleFavorite(match.profile.user_id, !match.is_favorite)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-rose-500 hover:text-white transition-colors"
            >
              <span className={`heart-icon ${match.is_favorite ? 'favorite' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartMatching; 