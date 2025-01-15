import React from 'react';
import { SmartMatch } from '../../types';

interface CompatibilityInsightsProps {
  profile: SmartMatch;
  onClose: () => void;
}

export const CompatibilityInsights: React.FC<CompatibilityInsightsProps> = ({ profile, onClose }) => {
  const details = profile.compatibility_details;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Compatibility Insights</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Compatibility Score */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-indigo-100 rounded-full p-4">
              <div className="text-3xl font-bold text-indigo-600">
                {Math.round(profile.compatibility_score)}%
              </div>
              <div className="text-sm text-indigo-800">Compatibility</div>
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-green-600">
              Relationship Strengths
            </h3>
            <ul className="space-y-2">
              {details.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-600">
              Potential Challenges
            </h3>
            <ul className="space-y-2">
              {details.challenges.map((challenge: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-500 mr-2">!</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">
              Relationship Tips
            </h3>
            <ul className="space-y-2">
              {details.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term Prediction */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-purple-600">
              Long-term Potential
            </h3>
            <p className="text-gray-700">
              {details.long_term_prediction}
            </p>
          </div>

          {/* View Detailed Analysis */}
          <div className="mt-6">
            <button
              className="text-blue-500 hover:text-blue-700"
            >
              View Detailed Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityInsights;