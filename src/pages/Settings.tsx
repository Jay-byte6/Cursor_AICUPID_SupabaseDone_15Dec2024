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
  const [notificationSettings, setNotificationSettings] = useState({
    new_matches: true,
    messages: true,
    profile_views: true,
    email_notifications: true
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
        setNotificationSettings({
          new_matches: profile.notification_preferences.new_match ?? true,
          messages: profile.notification_preferences.new_message ?? true,
          profile_views: profile.notification_preferences.profile_view ?? true,
          email_notifications: profile.notification_preferences.email_notifications ?? true
        });
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError('Failed to load your settings');
    }
  };

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
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
        new_match: notificationSettings.new_matches,
        new_message: notificationSettings.messages,
        profile_view: notificationSettings.profile_views,
        email_notifications: notificationSettings.email_notifications
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
      if (notificationSettings.messages) {
        notificationType = 'NEW_MESSAGE';
      } else if (notificationSettings.profile_views) {
        notificationType = 'PROFILE_VIEW';
      } else if (notificationSettings.new_matches) {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your account settings and preferences</p>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="space-y-8">
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">New Matches</div>
                <div className="text-sm text-gray-500">Get notified when you have new compatible matches</div>
              </div>
              <button
                onClick={() => handleToggle('new_matches')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.new_matches ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.new_matches ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Messages</div>
                <div className="text-sm text-gray-500">Receive notifications for new messages</div>
              </div>
              <button
                onClick={() => handleToggle('messages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.messages ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.messages ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Profile Views</div>
                <div className="text-sm text-gray-500">Get notified when someone views your profile</div>
              </div>
              <button
                onClick={() => handleToggle('profile_views')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.profile_views ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.profile_views ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive email notifications for important updates</div>
              </div>
              <button
                onClick={() => handleToggle('email_notifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.email_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className={`px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={testNotification}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Test Notification
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visibility Section */}
        <VisibilitySettings
          userProfile={userProfile}
          onUpdate={(updatedProfile) => setUserProfile(updatedProfile)}
        />

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
          <p className="text-gray-500">Privacy settings coming soon...</p>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-6">Delete Account</h2>
          <p className="text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 