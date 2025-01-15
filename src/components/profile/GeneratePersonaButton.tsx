import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';

const GeneratePersonaButton: React.FC = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if regeneration is needed
    const checkRegenerationNeeded = async () => {
      const shouldRegenerate = await profileService.shouldRegeneratePersona(user.id);
      setIsEnabled(shouldRegenerate);
    };

    checkRegenerationNeeded();

    // Listen for profile changes
    const handleProfileChange = () => {
      checkRegenerationNeeded();
    };

    // Listen for persona generation status
    const handleGenerationStatus = (event: CustomEvent) => {
      const { status, message } = event.detail;
      switch (status) {
        case 'start':
          setIsGenerating(true);
          break;
        case 'complete':
          setIsGenerating(false);
          setIsEnabled(false);
          // Show success notification
          break;
        case 'error':
          setIsGenerating(false);
          // Show error notification with message
          break;
      }
    };

    window.addEventListener('profileChange', handleProfileChange);
    window.addEventListener('personaGenerationStatus', handleGenerationStatus as EventListener);

    return () => {
      window.removeEventListener('profileChange', handleProfileChange);
      window.removeEventListener('personaGenerationStatus', handleGenerationStatus as EventListener);
    };
  }, [user]);

  const handleGenerateClick = async () => {
    if (!user || isGenerating || !isEnabled) return;

    try {
      await profileService.generateAndStorePersonaAnalysis(user.id, true, 'MANUAL');
    } catch (error) {
      console.error('Error generating persona:', error);
      // Show error notification
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-6">
      <button
        onClick={handleGenerateClick}
        disabled={!isEnabled || isGenerating}
        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
          isEnabled
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isGenerating && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <span>
          {isGenerating ? 'Generating Persona...' : 'Generate Persona'}
        </span>
      </button>
    </div>
  );
};

export default GeneratePersonaButton; 