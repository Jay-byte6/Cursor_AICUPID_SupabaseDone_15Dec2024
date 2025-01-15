import React from 'react';

interface Props {
  data: any;
  updateData: (data: any) => void;
}

const PsychologicalProfile: React.FC<Props> = ({ data, updateData }) => {
  const personalityTraits = [
    { trait: "Extroversion", description: "Preference for social interaction and external stimulation" },
    { trait: "Openness", description: "Appreciation for new experiences and ideas" },
    { trait: "Agreeableness", description: "Tendency to be compassionate and cooperative" },
    { trait: "Conscientiousness", description: "Level of organization and responsibility" },
    { trait: "Emotional Stability", description: "Ability to handle stress and maintain emotional balance" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Psychological Profile</h2>

      {personalityTraits.map(({ trait, description }) => (
        <div key={trait}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {trait}
            <span className="text-sm text-gray-500 ml-2">({description})</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={data[trait.toLowerCase()] || 5}
              onChange={(e) => updateData({ [trait.toLowerCase()]: e.target.value })}
            />
            <span className="text-sm text-gray-600 w-8">
              {data[trait.toLowerCase()] || 5}/10
            </span>
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Communication Style
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.communicationStyle || ''}
          onChange={(e) => updateData({ communicationStyle: e.target.value })}
        >
          <option value="">Select style</option>
          <option value="direct">Direct and Straightforward</option>
          <option value="diplomatic">Diplomatic and Tactful</option>
          <option value="expressive">Expressive and Emotional</option>
          <option value="analytical">Analytical and Logical</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conflict Resolution Approach
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.conflictResolution || ''}
          onChange={(e) => updateData({ conflictResolution: e.target.value })}
        >
          <option value="">Select approach</option>
          <option value="collaborative">Collaborative Problem-Solving</option>
          <option value="compromising">Compromising</option>
          <option value="accommodating">Accommodating</option>
          <option value="avoiding">Avoiding</option>
        </select>
      </div>
    </div>
  );
};

export default PsychologicalProfile;