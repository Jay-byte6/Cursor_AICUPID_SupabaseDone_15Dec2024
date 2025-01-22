import React, { useState, useEffect } from 'react';
import { SmartMatch } from '../../types';
import { Heart, Users, MapPin, Calendar, Clock, Star, MessageCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import aiProfileService from '../../services/aiProfileService';

interface Props {
  matches: SmartMatch[];
  onToggleFavorite: (matchId: string, isFavorite: boolean) => void;
  onRefreshCompatibility: (userId: string) => void;
  onViewProfile: (match: SmartMatch) => void;
  refreshing: string | null;
}

const MatchGrid: React.FC<Props> = ({
  matches,
  onToggleFavorite,
  onRefreshCompatibility,
  onViewProfile,
  refreshing
}) => {
  const [aiGeneratedImages, setAiGeneratedImages] = useState<Record<string, string>>({});
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const generateMissingProfileImages = async () => {
      for (const match of matches) {
        if (!match.profile.profile_image && !aiGeneratedImages[match.profile.id]) {
          try {
            setGeneratingImages(prev => ({ ...prev, [match.profile.id]: true }));
            
            const imageUrl = await aiProfileService.generateAIProfileImage({
              gender: match.profile.gender || 'male',
              age: match.profile.age || 25,
              style: 'professional'
            });
            
            setAiGeneratedImages(prev => ({ ...prev, [match.profile.id]: imageUrl }));
          } catch (error) {
            console.error('Error generating profile image:', error);
          } finally {
            setGeneratingImages(prev => ({ ...prev, [match.profile.id]: false }));
          }
        }
      }
    };

    generateMissingProfileImages();
  }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-pink-500" />
          </div>
        </div>
        <p className="text-gray-600 text-lg">No matches found yet. Complete your profile to start matching!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {matches.map((match) => (
        <div 
          key={match.profile.id} 
          className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
          <div className="relative">
            {match.profile.profile_image || aiGeneratedImages[match.profile.id] ? (
              <img
                src={match.profile.profile_image || aiGeneratedImages[match.profile.id]}
                alt={match.profile.fullname || 'Profile'}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-72 bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {generatingImages[match.profile.id] ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mb-2"></div>
                    <p className="text-white text-sm">Generating...</p>
                  </div>
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {(match.profile.fullname || 'Anonymous').charAt(0)}
                  </span>
                )}
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(match.profile.user_id, !match.is_favorite);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                match.is_favorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-rose-500 hover:text-white'
              } transition-all duration-300`}
            >
              <Heart
                className={`w-5 h-5 ${match.is_favorite ? 'fill-current' : ''}`}
              />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {match.profile.fullname || 'Anonymous'}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {match.profile.cupid_id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRefreshCompatibility(match.profile.user_id)}
                    disabled={refreshing === match.profile.user_id}
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 
                      ${refreshing === match.profile.user_id 
                        ? 'bg-gray-400/90 cursor-not-allowed' 
                        : 'bg-white/90 backdrop-blur-sm text-pink-500 hover:bg-pink-100'} 
                      shadow-lg`}
                    title="Refresh compatibility analysis"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 ${refreshing === match.profile.user_id ? 'animate-spin' : ''}`} 
                    />
                  </button>
                  <span className="px-5 py-2.5 bg-pink-500/90 backdrop-blur-sm text-white rounded-full font-bold text-lg">
                    {Math.round(match.compatibility_score)}% Match
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {match.profile.location && (
                <div className="flex items-center text-gray-600 group-hover:text-pink-500 transition-colors">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm">{match.profile.location}</span>
                </div>
              )}
              {match.profile.age && (
                <div className="flex items-center text-gray-600 group-hover:text-pink-500 transition-colors">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm">{match.profile.age} years</span>
                </div>
              )}
            </div>

            {match.profile.occupation && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Occupation</h4>
                <p className="text-gray-600">{match.profile.occupation}</p>
              </div>
            )}

            {match.profile.interests && match.profile.interests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Interests & Hobbies</h4>
                <div className="flex flex-wrap gap-2">
                  {match.profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Compatibility Insights</h4>
                {match.last_updated && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated {formatDistanceToNow(new Date(match.last_updated), { addSuffix: true })}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {match.compatibility_details.strengths.slice(0, 2).map((strength, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 group-hover:text-pink-500 transition-colors">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => onViewProfile(match)}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <Users className="w-4 h-4 mr-2" />
                View Insights
              </button>
              <button
                onClick={() => {/* Handle start chat */}}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                title="Start Chat"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchGrid; 