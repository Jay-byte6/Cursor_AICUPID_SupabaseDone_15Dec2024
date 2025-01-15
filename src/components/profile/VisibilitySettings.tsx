import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/supabaseService';
import { toast } from 'react-hot-toast';
import { UserProfile } from '../../types';

interface VisibilitySettings {
  smart_matching_visible: boolean;
  profile_image_visible: boolean;
  occupation_visible: boolean;
  contact_visible: boolean;
  master_visibility: boolean;
}

interface VisibilitySettingsProps {
  userId: string;
  userProfile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ userId, userProfile, onUpdate }) => {
  const [settings, setSettings] = useState<VisibilitySettings>({
    smart_matching_visible: true,
    profile_image_visible: true,
    occupation_visible: true,
    contact_visible: true,
    master_visibility: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getUserProfile(userId);
      if (profile?.visibility_settings) {
        setSettings(profile.visibility_settings);
      }
    } catch (err: any) {
      console.error('Error loading visibility settings:', err);
      toast.error('Failed to load visibility settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (setting: keyof VisibilitySettings) => {
    try {
      setLoading(true);
      const newSettings = {
        ...settings,
        [setting]: !settings[setting]
      };

      await profileService.updateUserProfile(userId, {
        visibility_settings: newSettings
      });

      setSettings(newSettings);
      toast.success('Visibility settings updated');
    } catch (err: any) {
      console.error('Error updating visibility settings:', err);
      toast.error('Failed to update visibility settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleMasterVisibility = async () => {
    try {
      setLoading(true);
      const newSettings = {
        ...settings,
        master_visibility: !settings.master_visibility
      };

      await profileService.updateUserProfile(userId, {
        visibility_settings: newSettings
      });

      setSettings(newSettings);
      toast.success('Profile visibility updated');
    } catch (err: any) {
      console.error('Error updating master visibility:', err);
      toast.error('Failed to update profile visibility');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Profile Visibility</h3>
          <p className="text-sm text-gray-600">
            Control who can see your profile and what information is visible
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleMasterVisibility}
            disabled={loading}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${settings.master_visibility ? 'bg-primary' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${settings.master_visibility ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <span className="ml-3 text-sm font-medium">
            {settings.master_visibility ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Smart Matching</h4>
            <p className="text-sm text-gray-600">
              Allow others to find you through smart matching
            </p>
          </div>
          <button
            onClick={() => handleToggle('smart_matching_visible')}
            disabled={loading || !settings.master_visibility}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                settings.smart_matching_visible && settings.master_visibility
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }
              ${!settings.master_visibility ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${settings.smart_matching_visible ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Profile Picture</h4>
            <p className="text-sm text-gray-600">
              Show your profile picture to other users
            </p>
          </div>
          <button
            onClick={() => handleToggle('profile_image_visible')}
            disabled={loading || !settings.master_visibility}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                settings.profile_image_visible && settings.master_visibility
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }
              ${!settings.master_visibility ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${settings.profile_image_visible ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Occupation</h4>
            <p className="text-sm text-gray-600">
              Display your occupation on your profile
            </p>
          </div>
          <button
            onClick={() => handleToggle('occupation_visible')}
            disabled={loading || !settings.master_visibility}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                settings.occupation_visible && settings.master_visibility
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }
              ${!settings.master_visibility ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${settings.occupation_visible ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Contact Information</h4>
            <p className="text-sm text-gray-600">
              Allow others to see your contact information
            </p>
          </div>
          <button
            onClick={() => handleToggle('contact_visible')}
            disabled={loading || !settings.master_visibility}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                settings.contact_visible && settings.master_visibility
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }
              ${!settings.master_visibility ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${settings.contact_visible ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings; 