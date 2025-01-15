import React from 'react';
import { Heart, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  compatibility: number;
  image: string;
  traits: string[];
  loveLanguage: string;
}

interface Props {
  profile: Profile;
  onViewInsights: () => void;
  isLiked?: boolean;
  onLike?: (liked: boolean) => void;
}

const CompatibilityCard = ({ profile, onViewInsights, isLiked, onLike }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-rose-500 mr-1" fill="currentColor" />
            <span className="font-semibold">{profile.compatibility}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{profile.name}, {profile.age}</h3>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike?.(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {isLiked ? (
                <ThumbsUp className="w-5 h-5" fill="currentColor" />
              ) : (
                <ThumbsUp className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            onClick={onViewInsights}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            View Insights
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCard;