export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  profile_image?: string;
  interests: string[];
  // New fields
  education?: string;
  occupation?: string;
  personality_traits?: string[];
  // ... existing fields ...
} 