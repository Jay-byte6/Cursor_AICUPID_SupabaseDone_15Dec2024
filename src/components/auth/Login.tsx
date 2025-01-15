import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import AICupidLogo from '../../assets/AICupidLogo';

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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleGoogleAuth = async () => {
    // Implement Google auth here
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
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
            <motion.h2
              className="text-2xl font-bold text-pink-500 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Hey There! 👋
            </motion.h2>
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Welcome to AI Cupid
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your Partner in Finding your DREAM PARTNER!
            </p>
            <p className="text-sm text-gray-500">
            </p>
          </motion.div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiMail size={20} color="#9CA3AF" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiLock size={20} color="#9CA3AF" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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
            </div>

            {isSignUp && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiLock size={20} color="#9CA3AF" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required={isSignUp}
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-lg transition-all hover:opacity-90"
            >
              {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>

            <div className="relative my-6 text-center">
              <p className="text-sm text-gray-500">Or continue with</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="text-center mt-8 text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>

            <div className="mt-8 text-center text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-purple-600 hover:text-purple-700">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-purple-600 hover:text-purple-700">Privacy Policy</Link>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 to-pink-500 items-center justify-center relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>

        {/* AI Cupid Logo */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <motion.div
            className="relative z-10"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <AICupidLogo size={350} />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative z-10 mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl font-bold text-white mb-2 text-shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Finding Love with AI Intelligence
            </motion.h2>
            <motion.p
              className="text-white/90 text-xl font-light"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Let AI Cupid guide you to your perfect match
            </motion.p>
          </motion.div>
        </div>

        {/* Floating hearts */}
        <motion.div
          className="absolute top-20 right-32"
          animate={{ y: [-20, 0, -20], rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-4xl">💘</span>
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-40"
          animate={{ y: [0, -20, 0], rotate: [360, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <span className="text-4xl">💝</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 