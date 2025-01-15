export interface Profile {
  cupidId: string;
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
  createdAt: string;
  lastUpdated: string;
}

export interface CompatibilityScore {
  overall: number;
  emotional: number;
  intellectual: number;
  lifestyle: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips?: string[];
  long_term_prediction?: string;
}

export interface MatchedProfile extends Profile {
  compatibility: CompatibilityScore;
  image: string;
  strengths?: string[];
  challenges?: string[];
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
}

export interface SmartMatch {
  id?: string;
  user_id?: string;
  profile: SmartMatchProfile;
  compatibility_score: number;
  compatibility_details: {
    strengths: string[];
    challenges: string[];
    tips: string[];
    long_term_prediction: string;
  };
  request_status?: {
    persona_view: string;
    chat: string;
  };
  is_favorite?: boolean;
  last_updated?: string;
}

export interface CompatibilityInsightsProps {
  profile: SmartMatch;
  onClose: () => void;
}