import { supabase } from '../lib/supabase';
import { 
  UserProfile, 
  PersonaAnalysis, 
  PersonaAspect, 
  AspectType, 
  CompatibilityScore,
  CompatibilityDetails,
  PositivePersona,
  NegativePersona,
  SmartMatch,
  NotificationData,
  SmartMatchProfile
} from '../types';
import { generateDetailedPersonaAnalysis, analyzeDetailedCompatibility } from './openai';

interface StoredCompatibility {
  compatibility_score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  improvement_tips: string[];
  long_term_prediction: string;
  emotional_score: number;
  intellectual_score: number;
  lifestyle_score: number;
  last_generated_at: string;
}

interface GeneratedCompatibility {
  overall: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
  emotional: number;
  intellectual: number;
  lifestyle: number;
}

interface StoredCompatibilityScore {
  overall_score: number;
  emotional_score: number;
  intellectual_score: number;
  lifestyle_score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
}

interface PersonaVersion {
  id: string;
  user_id: string;
  version: number;
  positive_aspects: any[];
  negative_aspects: any[];
  trigger_type: 'AUTO' | 'MANUAL' | 'PROFILE_UPDATE' | 'PERSONALITY_TEST';
  created_at: string;
  profile_snapshot: Partial<UserProfile>;
  personality_snapshot: any;
}

export const profileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      // Also get personality analysis data
      const { data: analysis, error: analysisError } = await supabase
        .from('personality_analysis')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (analysisError && analysisError.code !== 'PGRST116') throw analysisError;

      return {
        ...profile,
        personalInfo: profile || {},
        preferences: analysis?.preferences || {},
        psychologicalProfile: analysis?.psychological_profile || {},
        relationshipGoals: analysis?.relationship_goals || {},
        behavioralInsights: analysis?.behavioral_insights || {},
        dealbreakers: analysis?.dealbreakers || {}
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async saveUserProfile(userId: string, profile: any): Promise<void> {
    try {
      // First, get or create the user profile to ensure we have a profile_id
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      let profileId;
      if (!existingProfile) {
        // Create new profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: userId,
            ...profile.personalInfo,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('id')
          .single();

        if (createError) throw createError;
        profileId = newProfile.id;
      } else {
        profileId = existingProfile.id;
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            ...profile.personalInfo,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      }

      // Now save/update personality analysis with the profile_id
      const { error: analysisError } = await supabase
        .from('personality_analysis')
        .upsert({
          user_id: userId,
          profile_id: profileId,
          preferences: profile.preferences || {},
          psychological_profile: profile.psychologicalProfile || {},
          relationship_goals: profile.relationshipGoals || {},
          behavioral_insights: profile.behavioralInsights || {},
          dealbreakers: profile.dealbreakers || {},
          updated_at: new Date().toISOString()
        });

      if (analysisError) throw analysisError;

    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            ...profile,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: userId,
            name: profile.name || '',
            email: profile.email || '',
            age: profile.age || 18,
            location: profile.location || '',
            bio: profile.bio || '',
            occupation: profile.occupation || '',
            profile_image: profile.profile_image || '',
            interests: profile.interests || [],
            visibility_settings: profile.visibility_settings || {
              smart_matching_visible: true,
              profile_image_visible: true,
              occupation_visible: true,
              contact_visible: true,
              master_visibility: true
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;

        // Create initial personality analysis record
        const { error: analysisError } = await supabase
          .from('personality_analysis')
          .insert([{
            user_id: userId,
            profile_id: result.id, // Use the newly created profile's ID
            preferences: {},
            psychological_profile: {},
            relationship_goals: {},
            behavioral_insights: {},
            dealbreakers: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (analysisError) {
          console.error('Error creating personality analysis:', analysisError);
          // Delete the profile if analysis creation fails
          await supabase
            .from('user_profiles')
            .delete()
            .eq('id', result.id);
          throw analysisError;
        }
      }

      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async generateAndStorePersonaAnalysis(userId: string, forceRegenerate: boolean = false, triggerType: 'AUTO' | 'MANUAL' | 'PROFILE_UPDATE' | 'PERSONALITY_TEST' = 'AUTO'): Promise<PersonaAnalysis | null> {
    try {
      // Show loading indicator
      this.notifyPersonaGenerationStatus('start');
      
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        console.warn('Profile not found for user:', userId);
        this.notifyPersonaGenerationStatus('error', 'Profile not found');
        return null;
      }

      // Generate new persona analysis using OpenAI
      console.log('Generating new persona analysis using OpenAI');
      let personaAnalysis = await generateDetailedPersonaAnalysis(
        userProfile,
        {
          messages: [],
          aiChat: [],
          personalityData: null
        }
      );

      if (!personaAnalysis || !personaAnalysis.positivePersona || !personaAnalysis.negativePersona) {
        console.warn('Failed to generate complete persona analysis');
        this.notifyPersonaGenerationStatus('error', 'Failed to generate analysis');
        return null;
      }

      // Delete existing aspects first
      const { error: deleteError } = await supabase
        .from('persona_aspects')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting existing aspects:', deleteError);
        this.notifyPersonaGenerationStatus('error', 'Failed to update persona');
        return null;
      }

      // Generate unique IDs for each aspect
      const timestamp = new Date().toISOString();
      
      // Helper function to ensure arrays are properly formatted for JSONB
      const formatArrayField = (field: any[]): any[] => {
        if (!Array.isArray(field)) return [];
        return field.map(item => {
          if (typeof item === 'string') return item;
          return String(item);
        });
      };

      // Prepare aspects with proper data formatting
      const aspects = [
        // Positive aspects
        {
          user_id: userId,
          aspect_type: 'personality_traits',
          traits: formatArrayField(personaAnalysis.positivePersona.personality_traits.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.personality_traits.examples),
          summary: personaAnalysis.positivePersona.personality_traits.summary || '',
          intensity: personaAnalysis.positivePersona.personality_traits.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'core_values',
          traits: formatArrayField(personaAnalysis.positivePersona.core_values.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.core_values.examples),
          summary: personaAnalysis.positivePersona.core_values.summary || '',
          intensity: personaAnalysis.positivePersona.core_values.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'behavioral_traits',
          traits: formatArrayField(personaAnalysis.positivePersona.behavioral_traits.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.behavioral_traits.examples),
          summary: personaAnalysis.positivePersona.behavioral_traits.summary || '',
          intensity: personaAnalysis.positivePersona.behavioral_traits.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'hobbies_interests',
          traits: formatArrayField(personaAnalysis.positivePersona.hobbies_interests.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.hobbies_interests.examples),
          summary: personaAnalysis.positivePersona.hobbies_interests.summary || '',
          intensity: personaAnalysis.positivePersona.hobbies_interests.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        // Negative aspects
        {
          user_id: userId,
          aspect_type: 'emotional_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.emotional_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.emotional_aspects.examples),
          summary: personaAnalysis.negativePersona.emotional_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.emotional_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'social_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.social_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.social_aspects.examples),
          summary: personaAnalysis.negativePersona.social_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.social_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'lifestyle_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.lifestyle_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.lifestyle_aspects.examples),
          summary: personaAnalysis.negativePersona.lifestyle_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.lifestyle_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'relational_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.relational_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.relational_aspects.examples),
          summary: personaAnalysis.negativePersona.relational_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.relational_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        }
      ];

      // Log the data being stored
      console.log('Storing persona aspects:', JSON.stringify(aspects, null, 2));

      // Store all aspects
      const { error: insertError } = await supabase
        .from('persona_aspects')
        .insert(aspects);

      if (insertError) {
        console.error('Error storing persona aspects:', insertError);
        this.notifyPersonaGenerationStatus('error', 'Failed to store persona');
        return null;
      }

      // Notify completion
      this.notifyPersonaGenerationStatus('complete');
      return personaAnalysis;
    } catch (error) {
      console.error('Error generating and storing persona analysis:', error);
      this.notifyPersonaGenerationStatus('error', 'Generation failed');
      return null;
    }
  },

  notifyPersonaGenerationStatus(status: 'start' | 'complete' | 'error', message?: string) {
    // Dispatch custom event for UI updates
    const event = new CustomEvent('personaGenerationStatus', {
      detail: { status, message }
    });
    window.dispatchEvent(event);
  },

  async shouldRegeneratePersona(userId: string): Promise<boolean> {
    try {
      // Get latest persona version
      const { data: latestVersion } = await supabase
        .from('persona_versions')
        .select('created_at, profile_snapshot, personality_snapshot')
        .eq('user_id', userId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (!latestVersion) return true;

      // Get current profile and personality data
      const [profile, personalityData] = await Promise.all([
        this.getUserProfile(userId),
        supabase
          .from('user_profiles')
          .select('personality_data')
          .eq('user_id', userId)
          .single()
      ]);

      if (!profile) return true;

      // Compare relevant fields
      const relevantFieldsChanged = this.haveRelevantFieldsChanged(
        latestVersion.profile_snapshot,
        profile,
        latestVersion.personality_snapshot,
        personalityData?.data?.personality_data
      );

      return relevantFieldsChanged;
    } catch (error) {
      console.error('Error checking persona regeneration:', error);
      return false;
    }
  },

  haveRelevantFieldsChanged(oldProfile: any, newProfile: any, oldPersonality: any, newPersonality: any): boolean {
    const relevantFields = [
      'fullname',
      'age',
      'location',
      'occupation',
      'relationship_history',
      'lifestyle',
      'interests'
    ];

    // Check profile changes
    const profileChanged = relevantFields.some(field => 
      JSON.stringify(oldProfile?.[field]) !== JSON.stringify(newProfile?.[field])
    );

    // Check personality data changes
    const personalityChanged = JSON.stringify(oldPersonality) !== JSON.stringify(newPersonality);

    return profileChanged || personalityChanged;
  },

  createDefaultPersonaAspect(): PersonaAspect {
    return {
      traits: [],
      examples: [],
      summary: null,
      intensity: 0
    };
  },

  async getPersonaAnalysis(userId: string): Promise<PersonaAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('personality_analysis')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (!data) return null;

      // Get positive and negative personas from separate tables
      const [positivePersona, negativePersona] = await Promise.all([
        this.getPositivePersona(userId),
        this.getNegativePersona(userId)
      ]);

      return {
        positivePersona: positivePersona || {
          personality_traits: this.createDefaultPersonaAspect(),
          core_values: this.createDefaultPersonaAspect(),
          behavioral_traits: this.createDefaultPersonaAspect(),
          hobbies_interests: this.createDefaultPersonaAspect()
        },
        negativePersona: negativePersona || {
          emotional_aspects: this.createDefaultPersonaAspect(),
          social_aspects: this.createDefaultPersonaAspect(),
          lifestyle_aspects: this.createDefaultPersonaAspect(),
          relational_aspects: this.createDefaultPersonaAspect()
        },
        preferences: data.preferences,
        psychological_profile: data.psychological_profile,
        relationship_goals: data.relationship_goals,
        behavioral_insights: data.behavioral_insights,
        dealbreakers: data.dealbreakers
      };
    } catch (error) {
      console.error('Error getting persona analysis:', error);
      return null;
    }
  },

  transformStoredAspect(aspect: any): PersonaAspect {
    if (!aspect) {
      return {
        traits: [],
        examples: [],
        summary: null,
        intensity: 0
      };
    }

    return {
      traits: Array.isArray(aspect.traits) ? aspect.traits : [],
      examples: Array.isArray(aspect.examples) ? aspect.examples : [],
      summary: aspect.summary || null,
      intensity: typeof aspect.intensity === 'number' ? aspect.intensity : 0
    };
  },

  createPersonaAspect(userId: string, aspectType: AspectType, aspect: PersonaAspect, isPositive: boolean) {
    return {
      user_id: userId,
      aspect_type: aspectType,
      traits: aspect.traits,
      examples: aspect.examples,
      summary: aspect.summary,
      intensity: aspect.intensity,
      is_positive: isPositive
    };
  },

  async getCompatibilityAnalysis(userId: string, targetCupidId: string): Promise<CompatibilityScore | null> {
    try {
      // First get the target user's profile using their CUPID ID
      const { data: targetProfile, error: targetError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('cupid_id', targetCupidId)
        .single();

      if (targetError || !targetProfile) {
        console.warn('Target profile not found for CUPID ID:', targetCupidId);
        return null;
      }

      const targetUserId = targetProfile.user_id;

      // Check if we have a stored compatibility score
      const { data: storedMatch, error: matchError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .single();

      if (storedMatch) {
        console.log('Found stored match:', storedMatch);
        const compatibilityScore = {
          overall: Math.round(Number(storedMatch.compatibility_score)) || 0,
          emotional: Math.round(Number(storedMatch.emotional_score)) || 0,
          intellectual: Math.round(Number(storedMatch.intellectual_score)) || 0,
          lifestyle: Math.round(Number(storedMatch.lifestyle_score)) || 0,
          summary: storedMatch.summary || '',
          strengths: storedMatch.strengths || [],
          challenges: storedMatch.challenges || [],
          tips: storedMatch.tips || [],
          long_term_prediction: storedMatch.long_term_prediction || ''
        };
        console.log('Transformed compatibility score:', compatibilityScore);
        return compatibilityScore;
      }

      // If no stored score, generate a new one
      const [userProfile, fullTargetProfile] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserProfile(targetUserId)
      ]);

      if (!userProfile || !fullTargetProfile) {
        console.warn('One or both profiles not found');
        return null;
      }

      const [userPersona, targetPersona] = await Promise.all([
        this.getPersonaAnalysis(userId),
        this.getPersonaAnalysis(targetUserId)
      ]);

      const compatibilityScore = await analyzeDetailedCompatibility(
        userProfile,
        fullTargetProfile,
        userPersona && targetPersona ? {
          persona1: userPersona,
          persona2: targetPersona
        } : undefined
      );

      // Store the new compatibility score in smart_matches
      if (compatibilityScore) {
        const { error: storeError } = await supabase
          .from('smart_matches')
          .upsert({
            user_id: userId,
            target_user_id: targetUserId,
            compatibility_score: Math.round(Number(compatibilityScore.overall)),
            emotional_score: Math.round(Number(compatibilityScore.emotional)),
            intellectual_score: Math.round(Number(compatibilityScore.intellectual)),
            lifestyle_score: Math.round(Number(compatibilityScore.lifestyle)),
            summary: compatibilityScore.summary,
            strengths: compatibilityScore.strengths,
            challenges: compatibilityScore.challenges,
            tips: compatibilityScore.tips,
            long_term_prediction: compatibilityScore.long_term_prediction,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          });

        if (storeError) {
          console.error('Error storing compatibility score:', storeError);
        }
      }

      return compatibilityScore;
    } catch (error) {
      console.error('Error getting compatibility analysis:', error);
      return null;
    }
  },

  async findTopMatches(userId: string): Promise<SmartMatch[]> {
    try {
      // First try to get stored matches
      const { data: storedMatches, error: storedError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId)
        .order('compatibility_score', { ascending: false })
        .limit(20);

      if (storedError) {
        console.error('Error fetching stored matches:', storedError);
      }

      // Get all profiles except the user's own profile
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          cupid_id,
          fullname,
          age,
          gender,
          location,
          occupation,
          relationship_history,
          lifestyle,
          profile_image,
          visibility_settings
        `)
        .neq('user_id', userId);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Filter out profiles where visibility is turned off
      const visibleProfiles = (profiles || []).filter(profile => {
        if (!profile.visibility_settings) return true;
        return profile.visibility_settings.master_visibility !== false && 
               profile.visibility_settings.smart_matching_visible !== false;
      });

      // Get favorites
      const { data: favorites } = await supabase
        .from('favorite_profiles')
        .select('favorite_user_id')
        .eq('user_id', userId);

      const favoriteIds = new Set(favorites?.map(f => f.favorite_user_id) || []);

      // If we have stored matches and they're not too old, use them
      if (storedMatches && storedMatches.length > 0) {
        // Transform stored matches into SmartMatch format
        const transformedMatches: SmartMatch[] = storedMatches
          .map(match => {
            const profile = visibleProfiles.find(p => p.user_id === match.target_user_id);
            if (!profile) return null;

            const smartMatch: SmartMatch = {
              id: match.id,
              user_id: match.user_id,
              profile: {
                id: profile.id,
                user_id: profile.user_id,
                cupid_id: profile.cupid_id,
                fullname: profile.fullname,
                age: profile.age,
                gender: profile.gender,
                location: profile.location,
                occupation: profile.occupation,
                relationship_history: profile.relationship_history,
                lifestyle: profile.lifestyle,
                profile_image: profile.profile_image,
                interests: []
              },
              compatibility_score: match.compatibility_score,
              compatibility_details: {
                summary: match.summary || '',
                strengths: match.strengths || [],
                challenges: match.challenges || [],
                tips: match.tips || [],
                long_term_prediction: match.long_term_prediction || ''
              },
              is_favorite: favoriteIds.has(profile.user_id),
              last_updated: match.last_updated,
              created_at: match.created_at
            };
            return smartMatch;
          })
          .filter((match): match is SmartMatch => match !== null);

        if (transformedMatches.length > 0) {
          return transformedMatches;
        }
      }

      // Generate new matches
      const matchPromises = visibleProfiles.map(async (profile) => {
        try {
          const compatibilityScore = await this.getCompatibilityAnalysis(userId, profile.user_id);
          if (!compatibilityScore) return null;

          const match: SmartMatch = {
            id: `${userId}-${profile.user_id}`,
            user_id: userId,
            profile: {
              id: profile.id,
              user_id: profile.user_id,
              cupid_id: profile.cupid_id,
              fullname: profile.fullname,
              age: profile.age,
              gender: profile.gender,
              location: profile.location,
              occupation: profile.occupation,
              relationship_history: profile.relationship_history,
              lifestyle: profile.lifestyle,
              profile_image: profile.profile_image,
              interests: []
            },
            compatibility_score: compatibilityScore.overall,
            compatibility_details: {
              summary: compatibilityScore.summary,
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction
            },
            is_favorite: favoriteIds.has(profile.user_id),
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          };
          return match;
        } catch (error) {
          console.error(`Error getting compatibility for profile ${profile.id}:`, error);
          return null;
        }
      });

      const matches = await Promise.all(matchPromises);

      // Filter out null results, sort by compatibility score, and take top 20
      return matches
        .filter((match): match is SmartMatch => match !== null)
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, 20);
    } catch (error) {
      console.error('Error finding top matches:', error);
      return [];
    }
  },

  async toggleFavorite(userId: string, targetUserId: string, isFavorite: boolean): Promise<boolean> {
    try {
      if (isFavorite) {
        // Add to favorites
        const { error: insertError } = await supabase
        .from('favorite_profiles')
        .insert({
          user_id: userId,
            favorite_user_id: targetUserId,
          created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }

        // Ensure compatibility analysis is stored
        const compatibilityScore = await this.getCompatibilityAnalysis(userId, targetUserId);
        if (compatibilityScore) {
          await supabase
            .from('smart_matches')
            .upsert({
              user_id: userId,
              target_user_id: targetUserId,
              compatibility_score: compatibilityScore.overall,
              summary: compatibilityScore.summary,
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction,
              last_updated: new Date().toISOString()
            });
        }
      } else {
        // Remove from favorites
        const { error: deleteError } = await supabase
        .from('favorite_profiles')
        .delete()
        .eq('user_id', userId)
          .eq('favorite_user_id', targetUserId);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  async getNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async createNotification(notification: NotificationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  async markNotificationAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        console.error('Error marking notification as read:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },

  async updateNotificationPreferences(userId: string, preferences: Record<string, boolean>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          notification_preferences: preferences
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
      console.error('Error updating notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return null;
    }
  },

  async getFavoriteProfiles(userId: string): Promise<SmartMatch[]> {
    try {
      // Get favorite profile IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorite_profiles')
        .select('favorite_user_id')
        .eq('user_id', userId);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return [];
      }

      if (!favorites || favorites.length === 0) {
        return [];
      }

      // Get profiles for favorites
      const favoriteIds = favorites.map(f => f.favorite_user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          cupid_id,
          fullname,
          age,
          location,
          occupation,
          profile_image
        `)
        .in('user_id', favoriteIds);

      if (profilesError) {
        console.error('Error fetching favorite profiles:', profilesError);
        return [];
      }

      // Get stored compatibility scores
      const { data: storedMatches, error: matchesError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId)
        .in('target_user_id', favoriteIds);

      if (matchesError) {
        console.error('Error fetching stored matches:', matchesError);
      }

      // Create a map of stored matches for quick lookup
      const matchesMap = new Map(storedMatches?.map(m => [m.target_user_id, m]) || []);

      // Transform profiles into SmartMatch format
      const matchPromises = profiles.map(async (profile) => {
        try {
          // Check for stored compatibility data first
          const storedMatch = matchesMap.get(profile.user_id);
          let compatibilityScore;

          if (storedMatch) {
            compatibilityScore = {
              overall: storedMatch.compatibility_score,
              summary: storedMatch.summary,
              strengths: storedMatch.strengths,
              challenges: storedMatch.challenges,
              tips: storedMatch.tips,
              long_term_prediction: storedMatch.long_term_prediction
            };
          } else {
            // Generate and store new compatibility data
            compatibilityScore = await this.getCompatibilityAnalysis(userId, profile.user_id);
            if (compatibilityScore) {
              await supabase
                .from('smart_matches')
                .upsert({
                  user_id: userId,
                  target_user_id: profile.user_id,
                  compatibility_score: compatibilityScore.overall,
                  summary: compatibilityScore.summary,
                  strengths: compatibilityScore.strengths,
                  challenges: compatibilityScore.challenges,
                  tips: compatibilityScore.tips,
                  long_term_prediction: compatibilityScore.long_term_prediction,
                  last_updated: new Date().toISOString()
                });
            }
          }

          if (!compatibilityScore) return null;

          const match: SmartMatch = {
            profile: {
              id: profile.id,
              user_id: profile.user_id,
              cupid_id: profile.cupid_id,
              fullname: profile.fullname,
              age: profile.age,
              location: profile.location,
              occupation: profile.occupation,
              profile_image: profile.profile_image,
              gender: '',
              relationship_history: '',
              lifestyle: ''
            },
            compatibility_score: compatibilityScore.overall,
            compatibility_details: {
              summary: compatibilityScore.summary,
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction
            },
            is_favorite: true,
            last_updated: storedMatch?.last_updated || new Date().toISOString()
          };
          return match;
        } catch (error) {
          console.error(`Error getting compatibility for profile ${profile.id}:`, error);
          return null;
        }
      });

      const matches = await Promise.all(matchPromises);

      // Filter out null results and sort by compatibility score
      return matches
        .filter((match): match is SmartMatch => match !== null)
        .sort((a, b) => b.compatibility_score - a.compatibility_score);
    } catch (error) {
      console.error('Error getting favorite profiles:', error);
      return [];
    }
  },

  async getPositivePersona(userId: string): Promise<PositivePersona | null> {
    try {
      console.log('Fetching positive persona for user:', userId);
      const { data: aspects, error } = await supabase
        .from('persona_aspects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_positive', true);

      if (error) {
        console.error('Error fetching positive persona:', error);
        return null;
      }

      if (!aspects || aspects.length === 0) {
        console.log('No positive persona found');
        return null;
      }

      return {
        personality_traits: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'personality_traits')),
        core_values: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'core_values')),
        behavioral_traits: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'behavioral_traits')),
        hobbies_interests: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'hobbies_interests'))
      };
    } catch (error) {
      console.error('Error getting positive persona:', error);
      return null;
    }
  },

  async getNegativePersona(userId: string): Promise<NegativePersona | null> {
    try {
      console.log('Fetching negative persona for user:', userId);
      const { data: aspects, error } = await supabase
        .from('persona_aspects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_positive', false);

      if (error) {
        console.error('Error fetching negative persona:', error);
        return null;
      }

      if (!aspects || aspects.length === 0) {
        console.log('No negative persona found');
        return null;
      }

      return {
        emotional_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'emotional_aspects')),
        social_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'social_aspects')),
        lifestyle_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'lifestyle_aspects')),
        relational_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'relational_aspects'))
      };
    } catch (error) {
      console.error('Error getting negative persona:', error);
      return null;
    }
  },

  async savePersonalityAnalysis(userId: string, data: Partial<PersonaAnalysis>) {
    try {
      const { error } = await supabase
        .from('personality_analysis')
        .upsert({
          user_id: userId,
          preferences: data.preferences,
          psychological_profile: data.psychological_profile,
          relationship_goals: data.relationship_goals,
          behavioral_insights: data.behavioral_insights,
          dealbreakers: data.dealbreakers,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving personality analysis:', error);
      throw error;
    }
  },

  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile-image.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update user profile with new image URL
      await this.updateUserProfile(userId, { profile_image: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  async removeProfileImage(userId: string): Promise<void> {
    try {
      // Remove file from storage
      const { error: deleteError } = await supabase.storage
        .from('profile-images')
        .remove([`${userId}/profile-image.*`]);

      if (deleteError) throw deleteError;

      // Update user profile to remove image URL
      await this.updateUserProfile(userId, { profile_image: null });
    } catch (error) {
      console.error('Error removing profile image:', error);
      throw error;
    }
  },

  async getUserProfileByCupidId(cupidId: string): Promise<SmartMatchProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          cupid_id,
          fullname,
          age,
          location,
          occupation,
          profile_image,
          gender,
          relationship_history,
          lifestyle
        `)
        .eq('cupid_id', cupidId)
        .single();

      if (error || !data) {
        console.error('Error getting user profile by CUPID ID:', error);
        return null;
      }

      return {
        id: data.id,
        user_id: data.user_id,
        cupid_id: data.cupid_id,
        fullname: data.fullname,
        age: data.age,
        location: data.location,
        occupation: data.occupation,
        profile_image: data.profile_image,
        gender: data.gender || '',
        relationship_history: data.relationship_history || '',
        lifestyle: data.lifestyle || ''
      };
    } catch (error) {
      console.error('Error getting user profile by CUPID ID:', error);
      return null;
    }
  },

  async savePositivePersona(userId: string, persona: PositivePersona): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('persona_aspects')
        .upsert([
          {
            user_id: userId,
            aspect_type: 'personality_traits',
            ...persona.personality_traits,
            is_positive: true
          },
          {
            user_id: userId,
            aspect_type: 'core_values',
            ...persona.core_values,
            is_positive: true
          },
          {
            user_id: userId,
            aspect_type: 'behavioral_traits',
            ...persona.behavioral_traits,
            is_positive: true
          },
          {
            user_id: userId,
            aspect_type: 'hobbies_interests',
            ...persona.hobbies_interests,
            is_positive: true
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving positive persona:', error);
      return false;
    }
  },

  async saveNegativePersona(userId: string, persona: NegativePersona): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('persona_aspects')
        .upsert([
          {
            user_id: userId,
            aspect_type: 'emotional_aspects',
            ...persona.emotional_aspects,
            is_positive: false
          },
          {
            user_id: userId,
            aspect_type: 'social_aspects',
            ...persona.social_aspects,
            is_positive: false
          },
          {
            user_id: userId,
            aspect_type: 'lifestyle_aspects',
            ...persona.lifestyle_aspects,
            is_positive: false
          },
          {
            user_id: userId,
            aspect_type: 'relational_aspects',
            ...persona.relational_aspects,
            is_positive: false
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving negative persona:', error);
      return false;
    }
  },

  getVisibleProfileData(profile: UserProfile): UserProfile {
    if (!profile.visibility_settings) {
      return profile;
    }

    const visibleProfile = { ...profile };
    const settings = profile.visibility_settings;

    if (!settings.master_visibility) {
      visibleProfile.profile_image = null;
      visibleProfile.occupation = '';
      return visibleProfile;
    }

    if (!settings.profile_image_visible) {
      visibleProfile.profile_image = null;
    }

    if (!settings.occupation_visible) {
      visibleProfile.occupation = '';
    }

    return visibleProfile;
  },

  async getPersonalityAnalysis(userId: string): Promise<PersonaAnalysis | null> {
    return this.getPersonaAnalysis(userId);
  },

  async findMatchByCupidId(userId: string, cupidId: string): Promise<SmartMatch | null> {
    try {
      console.log('Searching for CUPID ID:', cupidId);
      
      // First get the target user's profile using their CUPID ID
      const { data: targetProfile, error: targetError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('cupid_id', cupidId)
        .single();

      if (targetError) {
        console.error('Database error finding target profile:', targetError);
        return null;
      }

      if (!targetProfile) {
        console.warn('No profile found with CUPID ID:', cupidId);
        return null;
      }

      console.log('Found profile:', targetProfile);

      // Get stored compatibility data from smart_matches table
      const { data: matches, error: matchError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('target_user_id', targetProfile.user_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (matchError) {
        console.error('Error fetching smart match:', matchError);
      }

      const smartMatch = matches?.[0];
      let compatibilityDetails: CompatibilityDetails;
      let compatibilityScore: number;

      if (smartMatch) {
        console.log('Using existing smart match data:', smartMatch);
        compatibilityDetails = {
          summary: smartMatch.summary || '',
          strengths: smartMatch.strengths || [],
          challenges: smartMatch.challenges || [],
          tips: smartMatch.tips || [],
          long_term_prediction: smartMatch.long_term_prediction || '',
          emotional: smartMatch.emotional_score || 85,
          intellectual: smartMatch.intellectual_score || 88,
          lifestyle: smartMatch.lifestyle_score || 82
        };
        compatibilityScore = smartMatch.compatibility_score || 85;
      } else {
        // Get compatibility from compatibility_insights table as fallback
        const { data: insights, error: insightError } = await supabase
          .from('compatibility_insights')
          .select('*')
          .eq('target_user_id', targetProfile.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (insightError) {
          console.error('Error fetching compatibility insights:', insightError);
        }

        const storedCompatibility = insights?.[0];
        if (storedCompatibility) {
          console.log('Using stored compatibility data:', storedCompatibility);
          compatibilityDetails = {
            summary: storedCompatibility.summary || '',
            strengths: storedCompatibility.strengths || [],
            challenges: storedCompatibility.challenges || [],
            tips: storedCompatibility.improvement_tips || [],
            long_term_prediction: storedCompatibility.long_term_prediction || '',
            emotional: storedCompatibility.emotional_score || 85,
            intellectual: storedCompatibility.intellectual_score || 88,
            lifestyle: storedCompatibility.lifestyle_score || 82
          };
          compatibilityScore = storedCompatibility.compatibility_score || 85;
        } else {
          console.warn('No compatibility data found, returning profile without compatibility');
          return null;
        }
      }
      
      // Create the smart match object with compatibility data
      const matchData: SmartMatch = {
        id: `${userId}-${targetProfile.user_id}`,
        user_id: userId,
        profile: {
          id: targetProfile.id,
          user_id: targetProfile.user_id,
          cupid_id: targetProfile.cupid_id,
          fullname: targetProfile.fullname || targetProfile.name || '',  // Try fullname first, then fall back to name
          age: targetProfile.age,
          location: targetProfile.location,
          occupation: targetProfile.occupation,
          education: targetProfile.education,
          profile_image: targetProfile.profile_image,
          interests: targetProfile.interests || [],
          bio: targetProfile.bio || '',
          personality_traits: targetProfile.personality_traits || []
        },
        compatibility_score: compatibilityScore,
        compatibility_details: compatibilityDetails,
        is_favorite: false,
        last_updated: new Date().toISOString()
      };

      console.log('Returning match data:', matchData);
      return matchData;

    } catch (error) {
      console.error('Error in findMatchByCupidId:', error);
      return null;
    }
  },

  async generatePersona(userId: string): Promise<PersonaAnalysis | null> {
    try {
      // First get the user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Get personality analysis data
      const { data: analysis, error: analysisError } = await supabase
        .from('personality_analysis')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (analysisError && analysisError.code !== 'PGRST116') {
        console.error('Error fetching analysis:', analysisError);
        throw analysisError;
      }

      // Combine profile and analysis data
      const userData = {
        personalInfo: profile,
        preferences: analysis?.preferences || {},
        psychologicalProfile: analysis?.psychological_profile || {},
        relationshipGoals: analysis?.relationship_goals || {},
        behavioralInsights: analysis?.behavioral_insights || {},
        dealbreakers: analysis?.dealbreakers || {}
      };

      // Generate detailed persona analysis using OpenAI
      const personaAnalysis = await generateDetailedPersonaAnalysis(userData);

      if (!personaAnalysis) {
        throw new Error('Failed to generate persona analysis');
      }

      // Save positive aspects
      const positiveAspects = [
        {
          user_id: userId,
          aspect_type: 'personality_traits',
          ...personaAnalysis.positivePersona.personality_traits,
          is_positive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'core_values',
          ...personaAnalysis.positivePersona.core_values,
          is_positive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'behavioral_traits',
          ...personaAnalysis.positivePersona.behavioral_traits,
          is_positive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'hobbies_interests',
          ...personaAnalysis.positivePersona.hobbies_interests,
          is_positive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Save negative aspects
      const negativeAspects = [
        {
          user_id: userId,
          aspect_type: 'emotional_aspects',
          ...personaAnalysis.negativePersona.emotional_aspects,
          is_positive: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'social_aspects',
          ...personaAnalysis.negativePersona.social_aspects,
          is_positive: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'lifestyle_aspects',
          ...personaAnalysis.negativePersona.lifestyle_aspects,
          is_positive: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: userId,
          aspect_type: 'relational_aspects',
          ...personaAnalysis.negativePersona.relational_aspects,
          is_positive: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Save all aspects to database
      const { error: aspectError } = await supabase
        .from('persona_aspects')
        .upsert([...positiveAspects, ...negativeAspects]);

      if (aspectError) {
        console.error('Error saving persona aspects:', aspectError);
        throw aspectError;
      }

      return personaAnalysis;
    } catch (error) {
      console.error('Error generating persona:', error);
      return null;
    }
  }
};

export default profileService; 