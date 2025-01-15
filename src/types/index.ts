export interface CompatibilityDetails {
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
  emotional: number;
  intellectual: number;
  lifestyle: number;
}

export interface CompatibilityScore {
  overall: number;
  emotional: number;
  intellectual: number;
  lifestyle: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
}

export interface SmartMatchProfile {
  id: string;
  user_id: string;
  cupid_id?: string;
  fullname: string;
  age?: number;
  location?: string;
  occupation?: string;
  profile_image?: string | null;
  interests?: string[];
  bio?: string;
  education?: string;
  personality_traits?: string[];
}

export interface SmartMatch {
  id: string;
  user_id: string;
  profile: SmartMatchProfile;
  compatibility_score: number;
  compatibility_details: CompatibilityDetails;
  is_favorite?: boolean;
  last_updated?: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender?: {
    fullname: string;
    profile_image: string | null;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  location: string;
  bio: string;
  occupation: string;
  profile_image: string | null;
  interests: string[];
  created_at: string;
  updated_at: string;
  cupid_id: string;
  fullname: string;
  relationship_history?: string;
  lifestyle?: string;
  visibility_settings: {
    smart_matching_visible: boolean;
    profile_image_visible: boolean;
    occupation_visible: boolean;
    contact_visible: boolean;
    master_visibility: boolean;
  };
  notification_preferences?: {
    email_notifications: boolean;
    push_notifications: boolean;
    match_notifications: boolean;
    message_notifications: boolean;
  };
  personalInfo: {
    fullName: string;
    age: number;
    gender: string;
    location: string;
    occupation: string;
    relationshipHistory: string;
    lifestyle: string;
  };
  preferences: {
    interests: string[];
    minAge?: number;
    maxAge?: number;
    preferredDistance?: string;
    educationPreference?: string;
  };
  psychologicalProfile: {
    extroversion: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    emotionalStability: number;
    communicationStyle: string;
    conflictResolution: string;
  };
  relationshipGoals: {
    relationshipType: string;
    timeline: string;
    familyPlans: string;
    relationshipValues: string;
  };
  behavioralInsights: {
    loveLanguage: string;
    socialBattery: string;
    stressResponse: string;
    decisionMaking: string;
  };
  dealbreakers: {
    dealbreakers: string[];
    customDealbreakers?: string;
    dealbreakersFlexibility: string;
  };
}

export interface AIPersona {
  id?: string;
  user_id: string;
  personality_traits: PersonaAspect;
  core_values: PersonaAspect;
  behavioral_traits: PersonaAspect;
  hobbies_interests: PersonaAspect;
  summary: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonaAspect {
  traits: string[];
  examples: string[];
  summary: string | null;
  intensity?: number;
}

export interface NegativePersona {
  emotional_aspects: PersonaAspect;
  social_aspects: PersonaAspect;
  lifestyle_aspects: PersonaAspect;
  relational_aspects: PersonaAspect;
}

export interface PersonaAnalysis {
  positivePersona: AIPersona;
  negativePersona: NegativePersona;
  preferences?: Record<string, any>;
  psychological_profile?: Record<string, any>;
  relationship_goals?: Record<string, any>;
  behavioral_insights?: Record<string, any>;
  dealbreakers?: Record<string, any>;
}

export type AspectType = 
  | 'personality_traits'
  | 'core_values'
  | 'behavioral_traits'
  | 'hobbies_interests'
  | 'emotional_aspects'
  | 'social_aspects'
  | 'lifestyle_aspects'
  | 'relational_aspects';

export interface NotificationData {
  user_id: string;
  type: 'MATCH_REQUEST' | 'CHAT_REQUEST' | 'PROFILE_VIEW' | 'SYSTEM' | 'NEW_MATCH' | 'NEW_MESSAGE';
  title: string;
  message: string;
  data?: Record<string, unknown>;
} 