import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';

const TestPersonalityAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const testData = {
    preferences: {
      interests: ["Technology", "Travel", "Music"],
      minAge: 25,
      maxAge: 35,
      preferredDistance: "50km",
      educationPreference: "Bachelor's or higher"
    },
    psychological_profile: {
      extroversion: 7,
      openness: 8,
      agreeableness: 6,
      conscientiousness: 7,
      emotionalStability: 8,
      communicationStyle: "Direct and honest",
      conflictResolution: "Collaborative"
    },
    relationship_goals: {
      relationshipType: "Long-term",
      timeline: "Within 1-2 years",
      familyPlans: "Want children",
      relationshipValues: "Trust, communication, growth"
    },
    behavioral_insights: {
      loveLanguage: "Quality Time",
      socialBattery: "Ambivert",
      stressResponse: "Problem-solving focused",
      decisionMaking: "Balanced logical and emotional"
    },
    dealbreakers: {
      dealbreakers: ["Dishonesty", "Lack of ambition", "Poor communication"],
      dealbreakersFlexibility: "Moderate",
      customDealbreakers: "Smoking"
    }
  };

  const runTest = async () => {
    if (!user) {
      setError('Please log in first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // First ensure user profile exists
      const userProfile = await profileService.getUserProfile(user.id);
      if (!userProfile) {
        await profileService.updateUserProfile(user.id, {
          fullname: "Test User",
          age: 28,
          gender: "Other",
          location: "Test City",
          occupation: "Software Developer",
          relationship_history: "Single",
          lifestyle: "Active"
        });
      }

      // Step 1: Save personality analysis
      console.log('Saving personality analysis...');
      const savedAnalysis = await profileService.savePersonalityAnalysis(user.id, testData);
      
      // Step 2: Get generated personas
      console.log('Fetching generated personas...');
      const [positivePersona, negativePersona] = await Promise.all([
        profileService.getPositivePersona(user.id),
        profileService.getNegativePersona(user.id)
      ]);

      setResult({
        success: true,
        savedAnalysis,
        positivePersona,
        negativePersona
      });
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || 'Test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Personality Analysis Test</h2>

      <button
        onClick={runTest}
        disabled={loading || !user}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? 'Running Test...' : 'Run Test'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            Test completed successfully!
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Saved Analysis</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(result.savedAnalysis, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Positive Persona</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(result.positivePersona, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Negative Persona</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(result.negativePersona, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPersonalityAnalysis; 