import React, { useEffect } from 'react';

interface Props {
  data: any;
  updateData: (data: any) => void;
}

const PersonalInfo: React.FC<Props> = ({ data, updateData }) => {
  useEffect(() => {
    // Check for pre-selected gender in localStorage
    const selectedGender = localStorage.getItem('selectedGender');
    if (selectedGender && !data.gender) {
      updateData({ gender: selectedGender });
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.fullname || ''}
          onChange={(e) => updateData({ fullname: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || '' })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={data.gender || ''}
            onChange={(e) => updateData({ gender: e.target.value })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={data.location || ''}
            onChange={(e) => updateData({ location: e.target.value })}
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={data.occupation || ''}
            onChange={(e) => updateData({ occupation: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship History
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.relationship_history || ''}
          onChange={(e) => updateData({ relationship_history: e.target.value })}
        >
          <option value="">Select status</option>
          <option value="never-married">Never Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
          <option value="separated">Separated</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lifestyle
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={4}
          value={data.lifestyle || ''}
          onChange={(e) => updateData({ lifestyle: e.target.value })}
          placeholder="Describe your lifestyle, daily routines, and interests..."
        />
      </div>
    </div>
  );
};

export default PersonalInfo;