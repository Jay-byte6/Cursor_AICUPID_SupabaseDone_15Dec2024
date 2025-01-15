import React, { useState } from 'react';
import { SmartMatch } from '../../types';
import CompatibilityInsights from './CompatibilityInsights';

interface CompatibleProfilesProps {
  profiles: SmartMatch[];
}

export const CompatibleProfiles: React.FC<CompatibleProfilesProps> = ({ profiles }) => {
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((matchedProfile) => (
        <div
          key={matchedProfile.profile.cupid_id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {matchedProfile.profile.fullname}
                </h3>
                <p className="text-gray-600">
                  {matchedProfile.profile.age} • {matchedProfile.profile.location}
                </p>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{Math.round(matchedProfile.compatibility_score)}%</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProfile(matchedProfile)}
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              View Compatibility
            </button>
          </div>
        </div>
      ))}

      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

export default CompatibleProfiles;