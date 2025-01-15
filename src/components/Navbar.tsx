import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './notifications/NotificationCenter';
import { UserCircle, Heart, X } from 'lucide-react';
import FavoriteProfiles from './profile/FavoriteProfiles';
import AICupidLogo from '../assets/AICupidLogo';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle Smart Matching click
  const handleSmartMatchingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoAnimation(true);
    
    // After animation completes, navigate to smart matching
    setTimeout(() => {
      setShowLogoAnimation(false);
      navigate('/smart-matching');
    }, 3000);
  };

  // Hide navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/home" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                <div className="w-12 h-12 relative">
                  <AICupidLogo className="transform hover:scale-100 transition-transform" size={55} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  AI CUPID
                </span>
              </Link>
              {user && (
                <div className="hidden md:ml-6 md:flex md:space-x-4">
                  <Link
                    to="/personality-analysis"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Personality Analysis
                  </Link>
                  <Link
                    to="/smart-matching"
                    onClick={handleSmartMatchingClick}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Smart Matching
                  </Link>
                  <Link
                    to="/relationship-insights"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Relationship Insights
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setShowFavorites(true)}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Heart className="w-5 h-5" />
                  </button>

                  <NotificationCenter />

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2"
                    >
                      <UserCircle className="w-6 h-6" />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleSignOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logo Animation Portal */}
      <AnimatePresence>
        {showLogoAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600/90 to-pink-500/90"
          >
            <motion.div
              initial={{ x: -100, y: -100, scale: 0.1 }}
              animate={{ 
                x: 0, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
              className="relative"
            >
              <AICupidLogo size={300} />
              
              {/* Heart Shower */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white"
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: -50,
                      scale: 0.5 + Math.random() * 1
                    }}
                    animate={{
                      y: window.innerHeight + 50,
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    style={{
                      left: `${Math.random() * 100}%`
                    }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>

              {/* Loading Text */}
              <motion.p
                className="text-white text-2xl mt-8 text-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                Finding Your Perfect Matches...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Sidebar */}
      {showFavorites && user && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 bg-indigo-600">
                  <h2 className="text-lg font-medium text-white">Favorites</h2>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <FavoriteProfiles userId={user.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;