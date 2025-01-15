import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import PersonalInfo from '../components/analysis/PersonalInfo';
import Preferences from '../components/analysis/Preferences';
import PsychologicalProfile from '../components/analysis/PsychologicalProfile';
import RelationshipGoals from '../components/analysis/RelationshipGoals';
import BehavioralInsights from '../components/analysis/BehavioralInsights';
import Dealbreakers from '../components/analysis/Dealbreakers';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';

type SectionKey = 'personalInfo' | 'preferences' | 'psychologicalProfile' | 'relationshipGoals' | 'behavioralInsights' | 'dealbreakers';

const ASSESSMENT_ORDER: SectionKey[] = [
  'personalInfo',
  'preferences',
  'psychologicalProfile',
  'relationshipGoals',
  'behavioralInsights',
  'dealbreakers'
];

const SECTION_TITLES: Record<SectionKey, string> = {
  personalInfo: 'Personality Analysis',
  preferences: 'Preferences',
  psychologicalProfile: 'Psychological Profile',
  relationshipGoals: 'Relationship Goals',
  behavioralInsights: 'Behavioral Insights',
  dealbreakers: 'Deal Breakers'
};

interface ProfileSections {
  personalInfo: Record<string, any>;
  preferences: Record<string, any>;
  psychologicalProfile: Record<string, any>;
  relationshipGoals: Record<string, any>;
  behavioralInsights: Record<string, any>;
  dealbreakers: Record<string, any>;
}

const PersonalityAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionKey>(() => {
    const selectedSection = localStorage.getItem('selectedSection');
    return (selectedSection as SectionKey) || 'personalInfo';
  });
  const [profile, setProfile] = useState<ProfileSections>({
    personalInfo: {},
    preferences: {},
    psychologicalProfile: {},
    relationshipGoals: {},
    behavioralInsights: {},
    dealbreakers: {}
  });

  // Get next section in sequence
  const getNextSection = (currentSection: SectionKey): SectionKey | null => {
    const currentIndex = ASSESSMENT_ORDER.indexOf(currentSection);
    return currentIndex < ASSESSMENT_ORDER.length - 1 ? ASSESSMENT_ORDER[currentIndex + 1] : null;
  };

  // Load user profile data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const userProfile = await profileService.getUserProfile(user.id);
        if (userProfile) {
          // Ensure all sections are initialized even if some data is missing
          setProfile(prev => ({
            personalInfo: userProfile.personalInfo || {},
            preferences: userProfile.preferences || {},
            psychologicalProfile: userProfile.psychologicalProfile || {},
            relationshipGoals: userProfile.relationshipGoals || {},
            behavioralInsights: userProfile.behavioralInsights || {},
            dealbreakers: userProfile.dealbreakers || {}
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleBackToAssessments = () => {
    navigate('/home'); // Navigate to home page instead of landing page
  };

  const handleSaveAndContinue = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      await profileService.saveUserProfile(user.id, profile);
      
      // Get next section
      const nextSection = getNextSection(currentSection);
      if (nextSection) {
        setCurrentSection(nextSection);
        localStorage.setItem('selectedSection', nextSection);
      } else {
        // If no next section, go back to home
        navigate('/home');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile data');
    } finally {
      setIsSaving(false);
    }
  };

  const validateCurrentSection = () => {
    const currentSectionData = profile[currentSection];
    
    if (!currentSectionData || Object.keys(currentSectionData).length === 0) {
      setError(`Please complete all fields in ${SECTION_TITLES[currentSection]}`);
      return false;
    }
    return true;
  };

  const saveCurrentSection = async () => {
    if (!user) return false;

    try {
      setIsSaving(true);
      setError(null);

      if (currentSection === 'personalInfo') {
        await profileService.updateUserProfile(user.id, {
          ...profile.personalInfo,
          updated_at: new Date().toISOString()
        });
      } else {
        const analysisData: any = {
          user_id: user.id,
          updated_at: new Date().toISOString()
        };

        const sectionMapping: Record<string, string> = {
          psychologicalProfile: 'psychological_profile',
          relationshipGoals: 'relationship_goals',
          behavioralInsights: 'behavioral_insights'
        };

        const dbKey = sectionMapping[currentSection] || currentSection;
        analysisData[dbKey] = profile[currentSection];

        await profileService.savePersonalityAnalysis(user.id, analysisData);
      }

      return true;
    } catch (err: any) {
      console.error('Error saving section:', err);
      setError(err.message || 'Failed to save your data. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit your profile');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      // Validate current section
      if (!validateCurrentSection()) {
        return;
      }

      // Save current section
      const saved = await saveCurrentSection();
      if (!saved) return;

      // Get next section
      const nextSection = getNextSection(currentSection);
      
      if (nextSection) {
        // If there's a next section, store it and navigate to it
        localStorage.setItem('selectedSection', nextSection);
        setCurrentSection(nextSection);
        window.scrollTo(0, 0);
      } else {
        // If this was the last section, go back to home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Error saving profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (section: SectionKey, data: Record<string, any>) => {
    setProfile(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setError(null);
  };

  const renderAssessment = () => {
    switch (currentSection) {
      case 'personalInfo':
        return <PersonalInfo data={profile.personalInfo} updateData={(data) => updateFormData('personalInfo', data)} />;
      case 'preferences':
        return <Preferences data={profile.preferences} updateData={(data) => updateFormData('preferences', data)} />;
      case 'psychologicalProfile':
        return <PsychologicalProfile data={profile.psychologicalProfile} updateData={(data) => updateFormData('psychologicalProfile', data)} />;
      case 'relationshipGoals':
        return <RelationshipGoals data={profile.relationshipGoals} updateData={(data) => updateFormData('relationshipGoals', data)} />;
      case 'behavioralInsights':
        return <BehavioralInsights data={profile.behavioralInsights} updateData={(data) => updateFormData('behavioralInsights', data)} />;
      case 'dealbreakers':
        return <Dealbreakers data={profile.dealbreakers} updateData={(data) => updateFormData('dealbreakers', data)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {SECTION_TITLES[currentSection]}
        </h1>
        <p className="text-gray-600">Complete this assessment to find your perfect match</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {renderAssessment()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBackToAssessments}
          className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Assessments
        </button>
        
        <button
          onClick={handleSaveAndContinue}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-400"
        >
          {isSaving ? 'Saving...' : 'Save & Continue'}
          <Check className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PersonalityAnalysis;