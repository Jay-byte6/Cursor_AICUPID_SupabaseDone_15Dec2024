import React from 'react';
import type { SmartMatch } from '../../types';

interface ProfileScannerProps {
  onScanComplete: (result: SmartMatch) => void;
}

const ProfileScanner: React.FC<ProfileScannerProps> = ({ onScanComplete }) => {
  const handleScan = () => {
    // Simulate scanning a profile
    const dummyMatch: SmartMatch = {
      id: 'dummy-id',
      user_id: 'dummy-user',
      profile: {
        id: 'profile-id',
        user_id: 'user-id',
        fullname: 'John Doe',
        age: 28,
        gender: 'male',
        location: 'New York',
        occupation: 'Software Engineer',
        relationship_history: 'Single',
        lifestyle: 'Active',
        profile_image: null,
        cupid_id: 'CUPID-123',
        interests: ['Technology', 'Travel']
      },
      compatibility_score: 85,
      compatibility_details: {
        summary: 'Strong overall compatibility with shared interests and values.',
        strengths: ['Similar interests', 'Compatible life goals'],
        challenges: ['Different communication styles'],
        tips: ['Practice active listening'],
        long_term_prediction: 'High potential for long-term compatibility'
      },
      request_status: {
        persona_view: 'NONE',
        chat: 'NONE'
      },
      is_favorite: false,
      last_updated: new Date().toISOString()
    };

    onScanComplete(dummyMatch);
  };

  return (
    <div className="text-center">
      <button
        onClick={handleScan}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Scan Profile
      </button>
    </div>
  );
};

export default ProfileScanner;