import React, { useState } from 'react';
import { Heart, Gift, Clock } from 'lucide-react';
import { SmartMatch } from '../types';

interface CompatibilityInsightsProps {
  profile: SmartMatch;
  onClose: () => void;
}

const CompatibilityInsights: React.FC<CompatibilityInsightsProps> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState('strengths');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">
          Compatibility Insights
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('strengths')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'strengths'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Strengths
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'challenges'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Challenges
        </button>
      </div>

      {/* Strengths Tab */}
      {activeTab === 'strengths' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Relationship Strengths
          </h3>
          <ul className="space-y-3">
            {profile?.compatibility_details?.strengths?.map((strength: string, index: number) => (
              <li
                key={index}
                className="flex items-start"
              >
                <span className="w-2 h-2 mt-2 bg-green-500 rounded-full mr-3" />
                <span className="text-gray-600">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Potential Challenges
          </h3>
          <ul className="space-y-3">
            {profile?.compatibility_details?.challenges?.map((challenge: string, index: number) => (
              <li
                key={index}
                className="flex items-start"
              >
                <span className="w-2 h-2 mt-2 bg-orange-500 rounded-full mr-3" />
                <span className="text-gray-600">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompatibilityInsights;