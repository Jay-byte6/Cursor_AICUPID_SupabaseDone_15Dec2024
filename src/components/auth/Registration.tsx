import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createProfile = async () => {
      try {
        const userId = user?.id || location.state?.userId;
        const email = user?.email || location.state?.email;

        if (!userId || !email) {
          navigate('/login');
          return;
        }

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingProfile) {
          // Profile exists, continue with registration
          setIsLoading(false);
          return;
        }

        // Create profile using stored procedure or function
        const { data, error: fnError } = await supabase
          .rpc('create_user_profile', {
            p_user_id: userId,
            p_email: email,
            p_cupid_id: `CUPID${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          });

        if (fnError) {
          console.error('Error creating profile:', fnError);
          setError('Error creating profile. Please try again.');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Registration error:', err);
        setError('An error occurred during registration');
        setIsLoading(false);
      }
    };

    createProfile();
  }, [user, location.state, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Setting up your profile...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Your existing registration form JSX here
  return (
    <div>
      {/* Registration form content */}
    </div>
  );
};

export default Registration; 