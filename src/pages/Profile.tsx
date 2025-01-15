import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Heart, Brain, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/supabaseService';
import PersonaInsights from '../components/profile/PersonaInsights';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import type { AIPersona, NegativePersona, UserProfile, CompatibilityDetails, PersonaAnalysis, PersonaAspect } from '../types';
import { useParams } from 'react-router-dom';
import GeneratePersonaButton from '../components/profile/GeneratePersonaButton';

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [positivePersona, setPositivePersona] = useState<AIPersona | null>(null);
  const [negativePersona, setNegativePersona] = useState<NegativePersona | null>(null);
  const [compatibilityDetails, setCompatibilityDetails] = useState<CompatibilityDetails | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [personaAnalysis, setPersonaAnalysis] = useState<PersonaAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user, userId]);

  useEffect(() => {
    if (userProfile?.id) {
      loadPersonaAnalysis();
    }
  }, [userProfile]);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let profile;
      if (isOwnProfile) {
        profile = await profileService.getUserProfile(user.id);
      } else {
        const rawProfile = await profileService.getUserProfile(userId!);
        profile = profileService.getVisibleProfileData(rawProfile);
      }
      setUserProfile(profile);

      if (profile) {
        // Load additional data only if viewing own profile or if persona is visible
        if (isOwnProfile || (profile.visibility_settings?.persona_visible ?? true)) {
          const [positiveData, negativeData] = await Promise.all([
            profileService.getPositivePersona(userId || user.id),
            profileService.getNegativePersona(userId || user.id)
          ]);
          setPositivePersona(positiveData);
          setNegativePersona(negativeData);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadPersonaAnalysis = async () => {
    if (!userProfile?.id) return;

    setIsLoadingAnalysis(true);
    setAnalysisError(null);

    try {
      console.log('Starting persona analysis for user:', userProfile.id);
      console.log('OpenAI Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);
      
      const analysis = await profileService.getPersonaAnalysis(userProfile.id);
      console.log('Persona analysis result:', analysis);
      
      if (analysis) {
        setPersonaAnalysis(analysis);
      } else {
        setAnalysisError('Unable to generate persona analysis. Please try again later.');
      }
    } catch (error: any) {
      console.error('Error in persona analysis:', error);
      setAnalysisError(error?.message || 'Error generating persona analysis');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const renderPersonaSection = (title: string, aspect: PersonaAspect | undefined) => {
    if (!aspect) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
        {aspect.traits.length > 0 ? (
          <div className="space-y-3">
            {aspect.traits.map((trait, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{trait}</span>
                  {aspect.intensity && (
                    <span className="text-sm text-indigo-600 font-medium">
                      {aspect.intensity}%
                    </span>
                  )}
                </div>
                {aspect.examples[index] && (
                  <p className="text-sm text-gray-600">
                    Example: {aspect.examples[index]}
                  </p>
                )}
              </div>
            ))}
            {aspect.summary && (
              <p className="text-sm text-gray-600 mt-2 italic">
                {aspect.summary}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">No traits available</p>
        )}
      </div>
    );
  };

  // Helper function to validate persona data structure
  const validatePersonaData = (positive: any, negative: any): boolean => {
    try {
      console.log('Validating positive persona:', JSON.stringify(positive, null, 2));
      console.log('Validating negative persona:', JSON.stringify(negative, null, 2));

      // Check if both personas exist
      if (!positive || !negative) {
        console.error('Missing persona data');
        return false;
      }

      // Helper function to ensure array structure
      const ensureArrayStructure = (obj: any, mainKey: string, subKey: string) => {
        if (!obj[mainKey]) {
          obj[mainKey] = { [subKey]: [] };
        } else if (Array.isArray(obj[mainKey])) {
          // If the main key is directly an array, transform it
          obj[mainKey] = { [subKey]: obj[mainKey] };
        } else if (!obj[mainKey][subKey]) {
          obj[mainKey][subKey] = [];
        } else if (!Array.isArray(obj[mainKey][subKey])) {
          obj[mainKey][subKey] = [];
        }
      };

      // Transform positive persona structure if needed
      ensureArrayStructure(positive, 'personality_traits', 'examples');
      ensureArrayStructure(positive, 'core_values', 'examples');
      ensureArrayStructure(positive, 'behavioral_traits', 'examples');
      ensureArrayStructure(positive, 'hobbies_interests', 'examples');

      // Transform negative persona structure if needed
      ensureArrayStructure(negative, 'emotional_weaknesses', 'traits');
      ensureArrayStructure(negative, 'social_weaknesses', 'traits');
      ensureArrayStructure(negative, 'lifestyle_weaknesses', 'traits');
      ensureArrayStructure(negative, 'relational_weaknesses', 'traits');

      // Ensure summaries exist
      if (typeof positive.summary !== 'string') positive.summary = '';
      if (typeof negative.summary !== 'string') negative.summary = '';

      // Log transformed data
      console.log('Transformed positive persona:', JSON.stringify(positive, null, 2));
      console.log('Transformed negative persona:', JSON.stringify(negative, null, 2));

      return true;
    } catch (error) {
      console.error('Error validating persona data:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Please complete your personality analysis first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start space-x-6">
          {isOwnProfile ? (
            <ProfileImageUpload
              userId={user?.id || ''}
              currentImage={userProfile?.profile_image || null}
              onImageUpdate={(newImageUrl) => {
                setUserProfile(prev => prev ? { ...prev, profile_image: newImageUrl } : null);
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {userProfile?.profile_image ? (
                <img
                  src={userProfile.profile_image}
                  alt={userProfile.fullname || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userProfile?.fullname || 'Anonymous User'}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userProfile?.location || 'Location hidden'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">CUPID ID</div>
                <div className="font-mono text-lg font-semibold text-indigo-600">
                  {userProfile?.cupid_id || 'Not Generated'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {isOwnProfile ? user?.email : 'Email hidden'}
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {userProfile?.occupation || 'Occupation hidden'}
                </div>
              </div>
              <div>
                <div className="flex items-center text-gray-600">
                  <Heart className="w-4 h-4 mr-2" />
                  {userProfile?.relationship_history || 'Relationship history hidden'}
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Brain className="w-4 h-4 mr-2" />
                  {userProfile?.lifestyle || 'Lifestyle hidden'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GeneratePersonaButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Positive Traits & Characteristics */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-green-600 mb-6">
            Positive Traits & Characteristics
          </h3>
          {isLoadingAnalysis ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : analysisError ? (
            <div className="text-red-500 text-center">{analysisError}</div>
          ) : personaAnalysis?.positivePersona ? (
            <>
              {renderPersonaSection('Personality Traits', personaAnalysis.positivePersona.personality_traits)}
              {renderPersonaSection('Core Values', personaAnalysis.positivePersona.core_values)}
              {renderPersonaSection('Behavioral Traits', personaAnalysis.positivePersona.behavioral_traits)}
              {renderPersonaSection('Hobbies & Interests', personaAnalysis.positivePersona.hobbies_interests)}
            </>
          ) : (
            <div className="text-gray-500 text-center">No analysis available</div>
          )}
        </div>

        {/* Growth Areas & Challenges */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-red-600 mb-6">
            Growth Areas & Challenges
          </h3>
          {isLoadingAnalysis ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : analysisError ? (
            <div className="text-red-500 text-center">{analysisError}</div>
          ) : personaAnalysis?.negativePersona ? (
            <>
              {renderPersonaSection('Emotional Aspects', personaAnalysis.negativePersona.emotional_aspects)}
              {renderPersonaSection('Social Aspects', personaAnalysis.negativePersona.social_aspects)}
              {renderPersonaSection('Lifestyle Aspects', personaAnalysis.negativePersona.lifestyle_aspects)}
              {renderPersonaSection('Relational Aspects', personaAnalysis.negativePersona.relational_aspects)}
            </>
          ) : (
            <div className="text-gray-500 text-center">No analysis available</div>
          )}
        </div>
      </div>

      {/* Only show persona insights if viewing own profile or if persona is visible */}
      {(isOwnProfile || (userProfile?.visibility_settings?.smart_matching_visible ?? true)) && positivePersona && (
        <PersonaInsights
          positivePersona={positivePersona}
          negativePersona={negativePersona!}
        />
      )}

      {/* Compatibility Insights - for other profiles */}
      {!isOwnProfile && compatibilityDetails && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Compatibility Analysis</h2>
            {compatibilityScore !== null && (
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold">
                {Math.round(compatibilityScore)}% Match
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h3>
              <div className="space-y-2">
                {compatibilityDetails.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Challenges</h3>
              <div className="space-y-2">
                {compatibilityDetails.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Tips */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Better Connection</h3>
              <div className="space-y-2">
                {compatibilityDetails.tips.map((tip, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Prediction */}
            {compatibilityDetails.long_term_prediction && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Long-term Outlook</h3>
                <p className="text-gray-600">{compatibilityDetails.long_term_prediction}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 