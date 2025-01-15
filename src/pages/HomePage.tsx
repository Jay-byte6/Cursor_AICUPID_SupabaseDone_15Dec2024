import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Users, Brain, ChevronRight, ArrowRight, MessageCircleHeart, Crown } from 'lucide-react';
import CompatibilityCard from '../components/CompatibilityCard';
import CompatibilityInsights from '../components/compatibility/CompatibilityInsights';
import ProfileScanner from '../components/ProfileScanner';
import { useAuth } from '../contexts/AuthContext';
import { SmartMatch } from '../types';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);

  const handleViewInsights = (profile: SmartMatch) => {
    setSelectedProfile(profile);
    setShowCompatibilityModal(false);
  };

  const handleProfileScanned = (profile: SmartMatch) => {
    setSelectedProfile(profile);
    setShowCompatibilityModal(true);
  };

  const topMatches = [
    {
      id: 1,
      name: "Sarah Chen",
      age: 28,
      compatibility: 95,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      traits: ["Creative", "Ambitious", "Empathetic"],
      loveLanguage: "Quality Time"
    },
    {
      id: 2,
      name: "Emily Parker",
      age: 26,
      compatibility: 92,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      traits: ["Adventurous", "Intellectual", "Caring"],
      loveLanguage: "Words of Affirmation"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-rose-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">AI Cupid</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find your perfect match with our advanced AI-powered compatibility analysis
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div 
          onClick={() => navigate('/personality-analysis')}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-200"
        >
          <Brain className="w-10 h-10 text-indigo-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Personality Analysis</h3>
          <p className="text-gray-600">Advanced AI assessment of personality traits and compatibility factors</p>
        </div>
        <div 
          onClick={() => navigate('/smart-matching')}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-200"
        >
          <Sparkles className="w-10 h-10 text-rose-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
          <p className="text-gray-600">Find your most compatible matches with our AI algorithm</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <MessageCircleHeart className="w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Relationship Insights</h3>
          <p className="text-gray-600">Detailed compatibility insights and relationship guidance</p>
        </div>
      </div>

      {/* Profile Scanner */}
      <ProfileScanner onScanComplete={handleProfileScanned} />

      {/* Compatibility Insights Modal */}
      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

export default Home;