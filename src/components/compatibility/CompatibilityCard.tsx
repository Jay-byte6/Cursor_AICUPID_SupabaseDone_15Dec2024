import React from 'react';
import { Heart, ArrowRight, ThumbsUp } from 'lucide-react';
import { MatchedProfile } from '../../types/profile';
import CompatibilityScore from './CompatibilityScore';

interface Props {
  profile: MatchedProfile;
  onViewInsights: () => void;
  isLiked?: boolean;
  onLike?: (liked: boolean) => void;
}

const CompatibilityCard: React.FC<Props> = ({ profile, onViewInsights, isLiked, onLike }) => {
  const { personalInfo, preferences, compatibility } = profile;
  const traits = preferences.interests || [];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={profile.image}
          alt={personalInfo.fullName}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-rose-500 mr-1" fill="currentColor" />
            <span className="font-semibold">{Math.round(compatibility.overall * 100)}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          {personalInfo.fullName}, {personalInfo.age}
        </h3>
        
        {/* Compatibility Summary */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-2">Compatibility Summary</h4>
          <p className="text-indigo-700">{compatibility.summary || 'No summary available'}</p>
        </div>

        {/* Strengths */}
        {compatibility.strengths && compatibility.strengths.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-green-900 mb-2">Key Strengths</h4>
            <ul className="space-y-2">
              {compatibility.strengths.slice(0, 3).map((strength: string, index: number) => (
                <li key={index} className="flex items-center text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {compatibility.challenges && compatibility.challenges.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-amber-900 mb-2">Potential Challenges</h4>
            <ul className="space-y-2">
              {compatibility.challenges.slice(0, 2).map((challenge: string, index: number) => (
                <li key={index} className="flex items-center text-amber-700">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {traits.map((trait: string, index: number) => (
              <span
                key={`${trait}-${index}`}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <CompatibilityScore
          emotional={compatibility.emotional}
          intellectual={compatibility.intellectual}
          lifestyle={compatibility.lifestyle}
        />
        
        <div className="flex items-center justify-between mt-4">
          {onLike && (
            <button
              onClick={() => onLike(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <ThumbsUp className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
          <button
            onClick={onViewInsights}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            View Detailed Insights
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCard;