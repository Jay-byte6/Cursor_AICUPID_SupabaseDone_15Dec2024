import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;

export const supabase = createClient(formattedUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          age: number | null;
          gender: string | null;
          location: string | null;
          occupation: string | null;
          relationship_history: string | null;
          lifestyle: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      personality_analysis: {
        Row: {
          id: string;
          user_id: string;
          preferences: any;
          psychological_profile: any;
          relationship_goals: any;
          behavioral_insights: any;
          dealbreakers: any;
          created_at: string;
          updated_at: string;
        };
      };
      ai_personas: {
        Row: {
          id: string;
          user_id: string;
          personality_type: string | null;
          compatibility_factors: any;
          relationship_style: string | null;
          communication_style: string | null;
          emotional_patterns: any;
          core_values: any;
          ai_insights: string | null;
          matching_preferences: any;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}; 