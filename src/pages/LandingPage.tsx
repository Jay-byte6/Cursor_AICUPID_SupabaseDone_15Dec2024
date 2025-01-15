import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Brain, Target, Users, Star, Shield, Sparkles, MessageCircle, UserCheck } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-pink-500 mb-2">98%</div>
              <div className="text-gray-600">Match Accuracy</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-pink-500 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-pink-500 mb-2">94%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-pink-500 mb-2">97%</div>
              <div className="text-gray-600">Long-term Success</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How AI CUPID Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How AI CUPID Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold">1</div>
              <div className="bg-pink-50 rounded-xl p-6 h-full">
                <div className="mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
                  >
                    <Brain className="w-8 h-8 text-pink-500" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Personality Analysis</h3>
                <p className="text-gray-600">Our advanced AI analyzes your personality traits, values, and relationship preferences through interactive questions.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold">2</div>
              <div className="bg-pink-50 rounded-xl p-6 h-full">
                <div className="mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-pink-500" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
                <p className="text-gray-600">Our AI algorithms find your most compatible matches based on deep personality insights and relationship goals.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold">3</div>
              <div className="bg-pink-50 rounded-xl p-6 h-full">
                <div className="mb-4">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
                  >
                    <MessageCircle className="w-8 h-8 text-pink-500" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect & Communicate</h3>
                <p className="text-gray-600">Get detailed compatibility insights and start meaningful conversations with your matches.</p>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-pink-100 px-6 py-3 rounded-full"
            >
              <UserCheck className="w-5 h-5 text-pink-500" />
              <span className="text-pink-700 font-medium">Join thousands of happy couples who found love through AI CUPID</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose AI Cupid?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <Brain className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">Advanced algorithms analyze personality traits and preferences for optimal compatibility.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <Shield className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
              <p className="text-gray-600">All profiles are thoroughly verified to ensure a safe and authentic dating experience.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <Target className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Compatibility</h3>
              <p className="text-gray-600">Get detailed compatibility insights and relationship predictions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4">"AI Cupid's matching algorithm is incredible! I found my soulmate within weeks."</p>
              <div className="font-semibold">Sarah & Mike</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4">"The compatibility insights were spot on. We're now happily married!"</p>
              <div className="font-semibold">David & Emma</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-600 mb-4">"Finally, a dating app that understands what real compatibility means!"</p>
              <div className="font-semibold">Lisa & John</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl text-gray-600 mb-12">Join thousands of happy couples who found love through AI Cupid</p>
          <button 
            onClick={handleGetStarted}
            className="inline-block px-8 py-4 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-all transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;