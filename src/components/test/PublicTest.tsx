import React, { useState } from 'react';
import { generatePersonaAnalysis } from '../../services/openai';

interface TestFormData {
  fullName: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  interests: string[];
  personalityTraits: {
    extroversion: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    emotionalStability: number;
  };
  communicationStyle: string;
  relationshipGoals: string;
}

const PublicTest: React.FC = () => {
  const [formData, setFormData] = useState<TestFormData>({
    fullName: '',
    age: 25,
    gender: '',
    location: '',
    occupation: '',
    interests: [],
    personalityTraits: {
      extroversion: 50,
      openness: 50,
      agreeableness: 50,
      conscientiousness: 50,
      emotionalStability: 50
    },
    communicationStyle: '',
    relationshipGoals: ''
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('personalityTraits.')) {
      const trait = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalityTraits: {
          ...prev.personalityTraits,
          [trait]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(i => i.trim());
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const analysis = await generatePersonaAnalysis({
        user1: formData,
        user2: formData
      });
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">AI CUPID - Personality Analysis Test</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Interests</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Interests (comma-separated)
              </label>
              <input
                type="text"
                value={formData.interests.join(', ')}
                onChange={handleInterestsChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., reading, traveling, music"
                required
              />
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personality Traits</h2>
            <div className="space-y-4">
              {Object.entries(formData.personalityTraits).map(([trait, value]) => (
                <div key={trait}>
                  <label className="block text-sm font-medium mb-1">
                    {trait.charAt(0).toUpperCase() + trait.slice(1)} (0-100)
                  </label>
                  <input
                    type="range"
                    name={`personalityTraits.${trait}`}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full"
                    min="0"
                    max="100"
                  />
                  <div className="text-sm text-gray-500 text-right">{value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Communication Style</h2>
            <select
              name="communicationStyle"
              value={formData.communicationStyle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Communication Style</option>
              <option value="direct">Direct</option>
              <option value="indirect">Indirect</option>
              <option value="analytical">Analytical</option>
              <option value="intuitive">Intuitive</option>
              <option value="functional">Functional</option>
            </select>
          </div>

          {/* Relationship Goals */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Relationship Goals</h2>
            <select
              name="relationshipGoals"
              value={formData.relationshipGoals}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Relationship Goals</option>
              <option value="casual">Casual Dating</option>
              <option value="serious">Serious Relationship</option>
              <option value="marriage">Marriage-Minded</option>
              <option value="friendship">Friendship First</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Analyzing...' : 'Generate Analysis'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            
            {/* Positive Persona */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Positive Traits</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Personality Traits</h4>
                  <ul className="list-disc pl-5">
                    {Object.entries(result.positive_persona.personality_traits).map(([key, value]) => (
                      <li key={key}>{value as string}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Core Values</h4>
                  <ul className="list-disc pl-5">
                    {Object.entries(result.positive_persona.core_values).map(([key, value]) => (
                      <li key={key}>{value as string}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Summary</p>
                  <p>{result.positive_persona.summary}</p>
                </div>
              </div>
            </div>

            {/* Negative Persona */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Growth Areas</h3>
              <div className="space-y-4">
                {Object.entries(result.negative_persona).map(([key, value]) => {
                  if (key !== 'summary') {
                    return (
                      <div key={key}>
                        <h4 className="font-medium">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
                        <ul className="list-disc pl-5">
                          {Object.entries(value as object).map(([subKey, subValue]) => (
                            <li key={subKey}>{subValue as string}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}
                <div>
                  <p className="font-medium">Summary</p>
                  <p>{result.negative_persona.summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicTest;
