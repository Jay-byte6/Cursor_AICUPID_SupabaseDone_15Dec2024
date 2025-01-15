import React, { useState } from 'react';
import { testPersonaGeneration } from '../services/testPersonaGeneration';
import { useAuth } from '../contexts/AuthContext';

const TestPersonaGeneration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleTest = async () => {
    if (!user?.id) {
      setError('Please log in first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Testing with user ID:', user.id);
      const testResult = await testPersonaGeneration(user.id);
      setResult(testResult);
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Persona Generation Test</h2>
      
      {!user && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          Please log in to test persona generation
        </div>
      )}
      
      <button
        onClick={handleTest}
        disabled={isLoading || !user}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {isLoading ? 'Generating...' : 'Generate Test Persona'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Test Results:</h3>
          
          {result.success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                Persona generated and stored successfully!
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Generated Persona:</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(result.generatedPersona, null, 2)}
                </pre>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Stored Persona:</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(result.storedPersona, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              Failed to generate persona: {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestPersonaGeneration; 