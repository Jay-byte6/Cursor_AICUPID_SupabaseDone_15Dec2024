import React from 'react';
import { SmartMatch } from '../../types';
import { Heart, AlertTriangle, Lightbulb, Compass } from 'lucide-react';

interface CompatibilityDetailsProps {
  match: SmartMatch;
  onClose: () => void;
}

const CompatibilityDetails: React.FC<CompatibilityDetailsProps> = ({ match, onClose }) => {
  const { compatibility_score, compatibility_details, profile } = match;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Compatibility Analysis
              </h2>
              <p className="text-gray-600">
                with {profile.fullname || 'Anonymous'} ({profile.cupid_id})
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">
                {Math.round(compatibility_score)}%
              </div>
              <div className="text-sm text-gray-500">Overall Match</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Relationship Strengths</h3>
            </div>
            <ul className="space-y-2">
              {compatibility_details.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">Potential Challenges</h3>
            </div>
            <ul className="space-y-2">
              {compatibility_details.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Relationship Tips</h3>
            </div>
            <ul className="space-y-2">
              {compatibility_details.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term Prediction */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Long-term Potential</h3>
            </div>
            <p className="text-gray-700">
              {compatibility_details.long_term_prediction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityDetails; 