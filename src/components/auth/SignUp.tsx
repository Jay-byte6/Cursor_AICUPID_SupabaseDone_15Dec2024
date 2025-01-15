import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { profileService } from '../../services/supabaseService';
import { UserProfile } from '../../types';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart, FiArrowRight } from 'react-icons/fi';

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate arrow across the header
    const interval = setInterval(() => {
      setArrowPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      const defaultProfile: Partial<UserProfile> = {
        id: '',
        user_id: authData.user.id,
        name: '',
        email: authData.user.email || '',
        gender: '',
        age: 18,
        location: '',
        bio: '',
        occupation: '',
        profile_image: '',
        interests: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cupid_id: '',
        visibility_settings: {
          smart_matching_visible: true,
          profile_image_visible: true,
          occupation_visible: true,
          contact_visible: true,
          master_visibility: true
        }
      };

      await profileService.updateUserProfile(authData.user.id, defaultProfile);
      navigate('/registration');
    } catch (error) {
      console.error('Error in signup:', error);
      setError(error instanceof Error ? error.message : 'Database error saving new user');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Error in signin:', error);
      setError(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      // Google OAuth will handle the redirect automatically
    } catch (error) {
      console.error('Error with Google auth:', error);
      setError('Failed to authenticate with Google');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        {/* Floating arrow animation */}
        <motion.div 
          className="absolute top-12 left-0 right-0"
          style={{ left: `${arrowPosition}%` }}
          animate={{ x: [-10, 10], rotate: 45 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <FiArrowRight className="text-purple-400" size={24} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            className="text-center mb-8"
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">
              Welcome to AI Cupid
            </h1>
            <p className="text-xl text-gray-600 mb-2 font-nunito">
              Your Partner in Finding your DREAM PARTNER!
            </p>
            <p className="text-sm text-gray-500 font-roboto">
              Let AI Cupid find the love of your life with advanced AI-powered compatibility analysis
            </p>
          </motion.div>

          <div className="flex justify-center space-x-4 mb-8">
            <motion.button
              onClick={() => setIsSignUp(false)}
              className={`px-6 py-2 rounded-full transition-all ${!isSignUp 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => setIsSignUp(true)}
              className={`px-6 py-2 rounded-full transition-all ${isSignUp 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>

        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              className="space-y-4"
            >
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiMail size={20} color="#9CA3AF" />
                </div>
          <Input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
            required
          />
              </motion.div>
              
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiLock size={20} color="#9CA3AF" />
                </div>
          <Input
                  type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
            required
          />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <FiEye size={20} color="#9CA3AF" />
                  )}
                </button>
              </motion.div>

              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <FiLock size={20} color="#9CA3AF" />
                  </div>
          <Input
                    type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
            required
          />
                </motion.div>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Forgot your password?
                  </a>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
          <Button
            type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all transform shadow-md hover:shadow-lg"
            disabled={loading}
                >
                  {loading 
                    ? (isSignUp ? 'Creating your account...' : 'Signing in...') 
                    : (isSignUp ? 'Sign up' : 'Sign in')}
                </Button>
              </motion.div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
          </div>
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 to-pink-500 items-center justify-center p-16 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-[800px] h-[800px] bg-white/5 rounded-full absolute"
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-[600px] h-[600px] bg-white/10 rounded-full absolute"
            animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-[400px] h-[400px] bg-white/15 rounded-full absolute"
            animate={{ scale: [1, 1.3, 1], rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Cupid Logo */}
        <motion.div
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          className="relative z-10"
        >
          <motion.div
            animate={pulseAnimation}
            className="relative"
          >
            <div className="w-48 h-48 bg-white/20 rounded-full absolute top-0 left-0 filter blur-xl" />
            <svg
              className="w-48 h-48 text-white relative z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            
            {/* AI Halo Effect */}
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-white/30 rounded-full"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Gear Wings */}
            <motion.div
              className="absolute top-1/2 -left-8 transform -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-12 h-12 text-white/40" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-14C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </motion.div>
            <motion.div
              className="absolute top-1/2 -right-8 transform -translate-y-1/2"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-12 h-12 text-white/40" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-14C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.p
            className="text-white/90 text-xl font-light mt-8 text-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Excited to have you onboard!
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
} 