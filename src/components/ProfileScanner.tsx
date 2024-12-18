import React, { useState } from 'react';
import { Search, Scan, ArrowRight, Loader2 } from 'lucide-react';
import type { SmartMatch } from '../types';

interface ProfileScannerProps {
  onProfileScanned: (profile: SmartMatch) => void;
}

const ProfileScanner: React.FC<ProfileScannerProps> = ({ onProfileScanned }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    try {
      // Simulated scan result
      const mockProfile: SmartMatch = {
        profile: {
          id: '123',
          user_id: '456',
          cupid_id: 'CUPID123',
          fullname: 'John Doe',
          age: 30,
          location: 'New York',
          gender: 'Male',
          occupation: 'Software Engineer',
          relationship_history: 'Single',
          lifestyle: 'Active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          matching_preferences: null,
          notification_preferences: null,
          profile_image: null
        },
        compatibility_score: 85,
        compatibility_details: {
          strengths: ['Communication', 'Values'],
          challenges: ['Distance'],
          tips: ['Focus on building trust'],
          long_term_prediction: 'Positive outlook'
        },
        request_status: {
          persona_view: 'PENDING',
          chat: 'NONE'
        },
        is_favorite: false
      };

      onProfileScanned(mockProfile);
    } catch (error) {
      console.error('Error scanning profile:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Scan className="w-8 h-8 text-indigo-500 mr-2" />
          <h2 className="text-2xl font-bold">Profile Scanner</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-8">
          Scan any profile to get instant compatibility insights and personalized relationship advice
        </p>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter profile name or ID..."
            value={scanning ? 'Scanning...' : 'Scan Profile'}
            onChange={(e) => setScanning(e.target.value === 'Scan Profile')}
            disabled={scanning}
          />
          <button 
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg disabled:bg-indigo-400"
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Scan Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileScanner;