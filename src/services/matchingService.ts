import { SmartMatch, SmartMatchProfile, Profile } from '../types';
import { supabase } from '../lib/supabase';
import { analyzeCompatibility } from './openai';

interface UserData {
  profile: Profile;
  analysis?: any;
}

export const matchingService = {
  async findCompatibleMatches(userId: string): Promise<SmartMatch[]> {
    try {
      // Get all profiles except the current user
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', userId);

      if (profilesError) throw profilesError;

      // Get compatibility scores
      const { data: matches, error: matchesError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId);

      if (matchesError) throw matchesError;

      // Get favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorite_profiles')
        .select('favorite_user_id')
        .eq('user_id', userId);

      if (favoritesError) throw favoritesError;

      const favoriteIds = (favorites || []).map(f => f.favorite_user_id);
      const matchesMap = new Map(matches?.map(m => [m.target_user_id, m]));

      // Transform profiles into SmartMatch format
      return (profiles || []).map(profile => {
        const match = matchesMap.get(profile.user_id) || {};
        const smartMatchProfile: SmartMatchProfile = {
          id: profile.id,
          user_id: profile.user_id,
          cupid_id: profile.cupid_id,
          fullname: profile.fullname || '',
          age: profile.age,
          location: profile.location,
          occupation: profile.occupation,
          profile_image: profile.profile_image,
          interests: profile.interests || []
        };

        const smartMatch: SmartMatch = {
          id: profile.id,
          user_id: profile.user_id,
          profile: smartMatchProfile,
          compatibility_score: match.compatibility_score || 0,
          compatibility_details: {
            strengths: match.strengths || [],
            challenges: match.challenges || [],
            tips: match.tips || [],
            long_term_prediction: match.long_term_prediction || ''
          },
          request_status: {
            persona_view: 'NONE',
            chat: 'NONE'
          },
          is_favorite: favoriteIds.includes(profile.user_id),
          last_updated: match.last_updated
        };
        return smartMatch;
      });
    } catch (error) {
      console.error('Error finding compatible matches:', error);
      throw error;
    }
  },

  async findMatchByCupidId(userId: string, cupidId: string): Promise<SmartMatch | null> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('cupid_id', cupidId)
        .single();

      if (profileError) throw profileError;
      if (!profile) return null;

      const compatibility = await analyzeCompatibility({
        user1: { profile, analysis: {} },
        user2: { profile, analysis: {} }
      });

      const smartMatchProfile: SmartMatchProfile = {
        id: profile.id,
        user_id: profile.user_id,
        cupid_id: profile.cupid_id,
        fullname: profile.fullname || '',
        age: profile.age,
        location: profile.location,
        occupation: profile.occupation,
        profile_image: profile.profile_image,
        interests: profile.interests || []
      };

      const smartMatch: SmartMatch = {
        id: profile.id,
        user_id: profile.user_id,
        profile: smartMatchProfile,
        compatibility_score: compatibility.compatibility_score || 0,
        compatibility_details: {
          strengths: compatibility.strengths || [],
          challenges: compatibility.challenges || [],
          tips: compatibility.improvement_tips || [],
          long_term_prediction: compatibility.long_term_prediction || ''
        },
        request_status: {
          persona_view: 'NONE',
          chat: 'NONE'
        },
        is_favorite: false,
        last_updated: new Date().toISOString()
      };
      return smartMatch;
    } catch (error) {
      console.error('Error finding match by CUPID ID:', error);
      throw error;
    }
  }
};