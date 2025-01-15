import React from 'react';

interface Props {
  data: any;
  updateData: (data: any) => void;
}

const RelationshipGoals: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Relationship Goals</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are you looking for?
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.relationshipType || ''}
          onChange={(e) => updateData({ relationshipType: e.target.value })}
        >
          <option value="">Select relationship type</option>
          <option value="long-term">Long-term Relationship</option>
          <option value="marriage">Marriage</option>
          <option value="casual">Casual Dating</option>
          <option value="friendship">Friendship First</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeline
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.timeline || ''}
          onChange={(e) => updateData({ timeline: e.target.value })}
        >
          <option value="">Select timeline</option>
          <option value="immediate">Ready to date immediately</option>
          <option value="few-weeks">Within a few weeks</option>
          <option value="few-months">Within a few months</option>
          <option value="no-rush">No specific timeline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Family Plans
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={data.familyPlans || ''}
          onChange={(e) => updateData({ familyPlans: e.target.value })}
        >
          <option value="">Select family plans</option>
          <option value="want-children">Want children</option>
          <option value="dont-want-children">Don't want children</option>
          <option value="open">Open to either</option>
          <option value="have-children">Already have children</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship Values
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={4}
          value={data.relationshipValues || ''}
          onChange={(e) => updateData({ relationshipValues: e.target.value })}
          placeholder="Describe your core values and what matters most to you in a relationship..."
        />
      </div>
    </div>
  );
};

export default RelationshipGoals;