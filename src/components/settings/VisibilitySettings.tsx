import { UserProfile } from '../../types';

interface VisibilitySettingsProps {
  userProfile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
} 