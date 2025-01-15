import { isUsernameAvailable } from '../services/profileStorage';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateUsername = async (username: string): Promise<string | null> => {
  if (!username?.trim()) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 30) return 'Username must be less than 30 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  if (!isUsernameAvailable(username)) {
    return 'Username is already taken';
  }
  return null;
};

export const validateSection = (section: any, sectionName: string): string | null => {
  if (!section || Object.keys(section).length === 0) {
    return `Please complete all fields in ${sectionName}`;
  }

  const requiredFields: { [key: string]: string[] } = {
    'Personal Information': ['username', 'fullName', 'age', 'gender', 'location', 'occupation'],
    'Preferences': ['interests'],
    'Psychological Profile': ['communicationStyle', 'conflictResolution'],
    'Relationship Goals': ['relationshipType', 'familyPlans'],
    'Behavioral Insights': ['loveLanguage', 'socialBattery'],
    'Dealbreakers': ['dealbreakers', 'dealbreakersFlexibility']
  };

  const fields = requiredFields[sectionName];
  if (!fields) return null;

  for (const field of fields) {
    const value = section[field];
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      return `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} in ${sectionName}`;
    }
  }

  return null;
};

export const validateAge = (age: number): string | null => {
  if (!age) return 'Age is required';
  if (age < 18) return 'You must be 18 or older';
  if (age > 120) return 'Please enter a valid age';
  return null;
};