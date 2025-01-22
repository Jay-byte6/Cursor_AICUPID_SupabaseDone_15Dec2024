import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Shield } from 'lucide-react';
import couple1 from '../assets/images/couple1.jpg';
import couple2 from '../assets/images/couple2.jpg';
import couple3 from '../assets/images/couple3.jpg';
import { useTheme } from '../contexts/ThemeContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setTheme(gender);
    localStorage.setItem('gender-theme', gender);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
        {/* Left side - Original Content */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Find your soulmate
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">with AI precision</div>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Our AI-powered matchmaking analyzes personality traits, behaviors, and compatibility patterns to find
            your perfect match with unprecedented accuracy.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <button 
              onClick={() => handleGenderSelect('male')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              I am a Man →
            </button>
            <button 
              onClick={() => handleGenderSelect('female')}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              I am a Woman →
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-pink-500" />
                </motion.div>
              </div>
              <div>
                <h3 className="font-semibold">Advanced AI Matching</h3>
                <p className="text-gray-600">Our AI understands what makes relationships work</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Brain className="w-6 h-6 text-pink-500" />
                </motion.div>
              </div>
              <div>
                <h3 className="font-semibold">Personality Analysis</h3>
                <p className="text-gray-600">Deep understanding of compatibility factors</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-6 h-6 text-pink-500" />
                </motion.div>
              </div>
              <div>
                <h3 className="font-semibold">Safe & Secure</h3>
                <p className="text-gray-600">Your privacy is our top priority</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a href="#features" className="text-pink-500 hover:text-pink-600 transition-all flex items-center gap-2">
              Learn more about how it works →
            </a>
          </div>
        </div>

        {/* Right side - Image Gallery */}
        <div className="lg:w-1/2 relative h-[600px] hidden lg:block">
          {/* Floating images with hover effects */}
          <motion.div 
            className="absolute top-0 right-0 w-72 h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={couple1} alt="Happy Couple 1" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div 
            className="absolute top-32 left-0 w-64 h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={couple2} alt="Happy Couple 2" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <motion.div 
            className="absolute bottom-0 right-20 w-80 h-72 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={couple3} alt="Happy Couple 3" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Decorative elements */}
          <motion.div 
            className="absolute -z-10 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 