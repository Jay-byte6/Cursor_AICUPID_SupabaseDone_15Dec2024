import React from 'react';

interface Props {
  data: any;
  updateData: (data: any) => void;
}

const Preferences: React.FC<Props> = ({ data, updateData }) => {
  const interests = [
    "Reading", "Travel", "Music", "Sports", "Art",
    "Cooking", "Photography", "Gaming", "Nature", "Technology"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Preferences</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Range Preference
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Min Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={data.minAge || ''}
              onChange={(e) => updateData({ minAge: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Max Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={data.maxAge || ''}
              onChange={(e) => updateData({ maxAge: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={data.interests?.includes(interest) || false}
                onChange={(e) => {
                  const currentInterests = data.interests || [];
                  if (e.target.checked) {
                    updateData({ interests: [...currentInterests, interest] });
                  } else {
                    updateData({
                      interests: currentInterests.filter((i: string) => i !== interest)
                    });
                  }
                }}
              />
              <span className="text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Distance
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.preferredDistance || ''}
          onChange={(e) => updateData({ preferredDistance: e.target.value })}
        >
          <option value="">Select distance</option>
          <option value="5">Within 5 miles</option>
          <option value="10">Within 10 miles</option>
          <option value="25">Within 25 miles</option>
          <option value="50">Within 50 miles</option>
          <option value="100">Within 100 miles</option>
          <option value="any">Any distance</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education Level Preference
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.educationPreference || ''}
          onChange={(e) => updateData({ educationPreference: e.target.value })}
        >
          <option value="">Select education level</option>
          <option value="high-school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="doctorate">Doctorate</option>
          <option value="any">Any Education Level</option>
        </select>
      </div>
    </div>
  );
};

export default Preferences;