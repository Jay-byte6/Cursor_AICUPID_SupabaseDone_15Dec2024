import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const createProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          // Profile already exists, redirect to profile page
          navigate('/profile');
          return;
        }

        // Create new profile with minimal data
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: user.id,
            cupid_id: `CUPID${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            fullname: '',
            age: 0,
            gender: '',
            location: '',
            occupation: '',
            relationship_history: '',
            lifestyle: '',
            profile_image: null,
            interests: [],
            notification_preferences: {
              new_match: true,
              new_message: true,
              profile_view: true,
              email_notifications: true
            },
            visibility_settings: {
              smart_matching_visible: true,
              profile_image_visible: true,
              occupation_visible: true,
              contact_visible: true,
              master_visibility: true
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        // Redirect to registration to complete profile
        navigate('/registration');
      } catch (err: any) {
        console.error('Error in onboarding:', err);
        setError(err.message || 'Failed to create profile');
      } finally {
        setLoading(false);
      }
    };

    createProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Setting up your profile...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding; 