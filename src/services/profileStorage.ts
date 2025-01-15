import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const PROFILES_KEY = 'ai_cupid_profiles';
const CURRENT_PROFILE_KEY = 'ai_cupid_current_profile';
const USERNAME_INDEX_KEY = 'ai_cupid_username_index';

export interface Profile {
  cupidId: string;
  personalInfo: {
    username: string;
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

export const generateCupidId = (): string => {
  return `CUPID-${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const getStoredProfiles = (): { [key: string]: Profile } => {
  try {
    const storedProfiles = localStorage.getItem(PROFILES_KEY);
    return storedProfiles ? JSON.parse(storedProfiles) : {};
  } catch (error) {
    console.error('Error reading profiles:', error);
    return {};
  }
};

export const findProfileByUsername = (username: string): Profile | null => {
  const profiles = getStoredProfiles();
  return Object.values(profiles).find(
    profile => profile.personalInfo.username.toLowerCase() === username.toLowerCase()
  ) || null;
};

export const findProfileByCupidId = (cupidId: string): Profile | null => {
  const profiles = getStoredProfiles();
  return profiles[cupidId] || null;
};

export const isUsernameAvailable = (username: string): boolean => {
  return !findProfileByUsername(username);
};

export const storeProfile = (profileData: Omit<Profile, 'cupidId' | 'createdAt' | 'lastUpdated'>): Profile => {
  try {
    if (!isUsernameAvailable(profileData.personalInfo.username)) {
      throw new Error('Username is already taken');
    }

    const cupidId = generateCupidId();
    const timestamp = new Date().toISOString();
    
    const profile: Profile = {
      ...profileData,
      cupidId,
      createdAt: timestamp,
      lastUpdated: timestamp
    };

    const profiles = getStoredProfiles();
    profiles[cupidId] = profile;
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));

    return profile;
  } catch (error: any) {
    console.error('Error storing profile:', error);
    throw new Error(error.message || 'Failed to save profile data');
  }
};

export const getCurrentProfile = (): Profile | null => {
  try {
    const storedProfile = localStorage.getItem(CURRENT_PROFILE_KEY);
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error getting current profile:', error);
    return null;
  }
};

export const clearProfileData = (): void => {
  localStorage.removeItem(CURRENT_PROFILE_KEY);
};

export const isProfileComplete = (): boolean => {
  return !!getCurrentProfile();
};

export const getAllRegisteredProfiles = (): Profile[] => {
  const profiles = getStoredProfiles();
  return Object.values(profiles);
};