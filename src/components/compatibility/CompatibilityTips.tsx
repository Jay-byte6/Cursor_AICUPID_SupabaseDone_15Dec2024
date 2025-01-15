import React from 'react';
import { Lightbulb, MessageCircle, Heart, Users } from 'lucide-react';

interface Props {
  recommendations: {
    communication: string[];
    activities: string[];
    bonding: string[];
  };
}

const CompatibilityTips: React.FC<Props> = ({ recommendations }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
        Compatibility Enhancement Tips
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-800">Communication</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.communication.map((tip, index) => (
              <li key={index} className="text-purple-700 text-sm">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <Heart className="w-5 h-5 text-rose-600 mr-2" />
            <h4 className="font-medium text-rose-800">Activities</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.activities.map((tip, index) => (
              <li key={index} className="text-rose-700 text-sm">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-800">Bonding</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.bonding.map((tip, index) => (
              <li key={index} className="text-blue-700 text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityTips;