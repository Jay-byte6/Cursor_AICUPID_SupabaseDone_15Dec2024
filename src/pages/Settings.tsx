import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import profileService from '../services/supabaseService';
import VisibilitySettings from '../components/profile/VisibilitySettings';
import ErrorAlert from '../components/ErrorAlert';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    newMatches: true,
    messages: true,
    profileViews: true,
    emailNotifications: true,
    profileVisibility: true,
    smartMatching: true,
    profilePicture: true,
    occupation: true,
    contactInformation: true
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadSettings();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const profile = await profileService.getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    if (!user) return;
    try {
      const profile = await profileService.getUserProfile(user.id);
      if (profile?.notification_preferences) {
        setSettings({
          newMatches: profile.notification_preferences.new_match ?? true,
          messages: profile.notification_preferences.new_message ?? true,
          profileViews: profile.notification_preferences.profile_view ?? true,
          emailNotifications: profile.notification_preferences.email_notifications ?? true,
          profileVisibility: profile.notification_preferences.profile_visibility ?? true,
          smartMatching: profile.notification_preferences.smart_matching ?? true,
          profilePicture: profile.notification_preferences.profile_picture ?? true,
          occupation: profile.notification_preferences.occupation ?? true,
          contactInformation: profile.notification_preferences.contact_information ?? true
        });
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError('Failed to load your settings');
    }
  };

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveSettings = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      setError(null);

      await profileService.updateNotificationPreferences(user.id, {
        new_match: settings.newMatches,
        new_message: settings.messages,
        profile_view: settings.profileViews,
        email_notifications: settings.emailNotifications,
        profile_visibility: settings.profileVisibility,
        smart_matching: settings.smartMatching,
        profile_picture: settings.profilePicture,
        occupation: settings.occupation,
        contact_information: settings.contactInformation
      });

      // Show success message or toast
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError('Failed to save your settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getNotificationContent = (type: string) => {
    switch (type) {
      case 'NEW_MATCH':
        return {
          title: 'New Match',
          content: 'You have a new match!'
        };
      case 'NEW_MESSAGE':
        return {
          title: 'New Message',
          content: 'You have received a new message.'
        };
      case 'PROFILE_VIEW':
        return {
          title: 'Profile View',
          content: 'Someone viewed your profile.'
        };
      default:
        return {
          title: 'Notification',
          content: 'You have a new notification.'
        };
    }
  };

  const testNotification = async () => {
    if (!user) return;
    try {
      setError(null);

      // Determine which type of notification to send based on settings
      let notificationType = 'NEW_MATCH';
      if (settings.messages) {
        notificationType = 'NEW_MESSAGE';
      } else if (settings.profileViews) {
        notificationType = 'PROFILE_VIEW';
      } else if (settings.newMatches) {
        notificationType = 'NEW_MATCH';
      }

      const { title, content } = getNotificationContent(notificationType);

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          type: notificationType,
          title,
          content,
          read: false,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Notification error:', error);
        throw error;
      }
      alert('Test notification sent! Check your notifications bell.');
    } catch (err: any) {
      console.error('Error sending test notification:', err);
      setError('Failed to send test notification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Please complete your profile first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-12 ml-[260px] relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your account settings and preferences
          </p>

          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

          <div className="space-y-8">
            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative z-20">
              <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">New Matches</h3>
                    <p className="text-gray-500">Get notified when you have new compatible matches</p>
                  </div>
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.newMatches}
                        onChange={(e) => handleToggle('newMatches')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                    <p className="text-gray-500">Receive notifications for new messages</p>
                  </div>
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.messages}
                        onChange={(e) => handleToggle('messages')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Views</h3>
                    <p className="text-gray-500">Get notified when someone views your profile</p>
                  </div>
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.profileViews}
                        onChange={(e) => handleToggle('profileViews')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleToggle('emailNotifications')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative z-20">
              <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
                    <p className="text-gray-500">Control who can see your profile and what information is visible</p>
                  </div>
                  <div className="relative z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.profileVisibility}
                        onChange={(e) => handleToggle('profileVisibility')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Smart Matching</h3>
                    <p className="text-gray-500">Allow others to find you through smart matching</p>
                  </div>
                  <div className="relative z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.smartMatching}
                        onChange={(e) => handleToggle('smartMatching')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                    <p className="text-gray-500">Show your profile picture to other users</p>
                  </div>
                  <div className="relative z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.profilePicture}
                        onChange={(e) => handleToggle('profilePicture')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Occupation</h3>
                    <p className="text-gray-500">Display your occupation on your profile</p>
                  </div>
                  <div className="relative z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.occupation}
                        onChange={(e) => handleToggle('occupation')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    <p className="text-gray-500">Allow others to see your contact information</p>
                  </div>
                  <div className="relative z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.contactInformation}
                        onChange={(e) => handleToggle('contactInformation')}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4 relative z-20">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={testNotification}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
            >
              Test Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get setting descriptions
const getSettingDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    profileVisibility: 'Control who can see your profile and what information is visible',
    smartMatching: 'Allow others to find you through smart matching',
    profilePicture: 'Show your profile picture to other users',
    occupation: 'Display your occupation on your profile',
    contactInformation: 'Allow others to see your contact information'
  };
  return descriptions[key] || '';
};

export default Settings; 