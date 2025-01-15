import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import { SmartMatch } from '../types';
import toast from 'react-hot-toast';
import DetailedCompatibilityView from '../components/compatibility/DetailedCompatibilityView';
import MatchGrid from '../components/matching/MatchGrid';

const SmartMatching = () => {
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
    try {
      setLoading(true);
      setError(null);
      const matchResults = await profileService.findTopMatches(user!.id);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Smart Matches</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <MatchGrid
        matches={matches}
        onToggleFavorite={handleToggleFavorite}
        onRefreshCompatibility={handleRefreshCompatibility}
        onViewProfile={handleViewProfile}
        refreshing={refreshing}
      />

      {selectedProfile && showDetailedView && (
        <DetailedCompatibilityView
          isOpen={showDetailedView}
          onClose={() => setShowDetailedView(false)}
          onBack={() => setShowDetailedView(false)}
          profile={selectedProfile.profile}
          compatibility_details={{
            overall: selectedProfile.compatibility_score,
            emotional: Math.round(selectedProfile.compatibility_score * 0.9),
            intellectual: Math.round(selectedProfile.compatibility_score * 0.95),
            lifestyle: Math.round(selectedProfile.compatibility_score * 0.85),
            summary: selectedProfile.compatibility_details.long_term_prediction,
            strengths: selectedProfile.compatibility_details.strengths,
            challenges: selectedProfile.compatibility_details.challenges,
            tips: selectedProfile.compatibility_details.tips,
            long_term_prediction: selectedProfile.compatibility_details.long_term_prediction
          }}
        />
      )}
    </div>
  );
};

export default SmartMatching; 