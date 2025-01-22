import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import PersonalInfo from '../components/analysis/PersonalInfo';
import Preferences from '../components/analysis/Preferences';
import PsychologicalProfile from '../components/analysis/PsychologicalProfile';
import RelationshipGoals from '../components/analysis/RelationshipGoals';
import BehavioralInsights from '../components/analysis/BehavioralInsights';
import Dealbreakers from '../components/analysis/Dealbreakers';
import AssessmentSummary from '../components/assessment/AssessmentSummary';
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 ml-[240px]">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            {SECTION_TITLES[currentSection]}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Complete this assessment to find your perfect match
          </p>
        </motion.div>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Assessment Summary */}
        <AssessmentSummary data={profile} currentSection={currentSection} />

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-4 border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
          {renderAssessment()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackToAssessments}
            className="px-8 py-4 border-2 border-pink-500/30 text-pink-500 rounded-xl font-semibold text-lg hover:bg-pink-500 hover:text-white transition-all duration-300"
          >
            Back to Assessments
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & Continue'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityAnalysis;