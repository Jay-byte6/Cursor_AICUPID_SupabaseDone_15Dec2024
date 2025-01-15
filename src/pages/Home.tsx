import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Star, User, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import { SmartMatch } from '../types';
import DetailedCompatibilityView from '../components/compatibility/DetailedCompatibilityView';
import { toast } from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topMatches, setTopMatches] = useState<SmartMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SmartMatch | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showCupidSearch, setShowCupidSearch] = useState(false);
  const [cupidId, setCupidId] = useState('');
  const [cupidSearchResult, setCupidSearchResult] = useState<SmartMatch | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadTopMatches = async () => {
      if (!user?.id) return;
      try {
        const matches = await profileService.findTopMatches(user.id);
        setTopMatches(matches.slice(0, 3)); // Take top 3 matches
      } catch (error) {
        console.error('Error loading top matches:', error);
      }
    };

    loadTopMatches();
  }, [user?.id]);

  const handleViewProfile = (match: SmartMatch) => {
    setSelectedMatch(match);
    setShowDetailedView(true);
  };

  const popularActivities = [
    'Sports & Fitness',
    'Career Growth',
    'Adventure Travel',
    'Technology',
    'Gaming'
  ];

  const handleAssessmentClick = (section: string) => {
    // Map the section names to the correct keys
    const sectionMap = {
      'personality': 'personalInfo',
      'preferences': 'preferences',
      'psychological': 'psychologicalProfile',
      'goals': 'relationshipGoals',
      'behavioral': 'behavioralInsights',
      'dealbreakers': 'dealbreakers'
    };
    
    // Store the selected section in localStorage
    localStorage.setItem('selectedSection', sectionMap[section as keyof typeof sectionMap]);
    navigate('/personality-analysis');
  };

  const handleCupidSearch = async () => {
    if (!cupidId.trim() || !user?.id) {
      toast.error('Please enter a valid CUPID ID');
      return;
    }
    
    setIsSearching(true);
    setCupidSearchResult(null); // Clear previous results
    
    try {
      const match = await profileService.findMatchByCupidId(user.id, cupidId);
      if (match) {
        setCupidSearchResult(match);
        toast.success('Profile found!');
      } else {
        toast.error('No profile found with this CUPID ID');
      }
    } catch (error) {
      console.error('Error searching by CUPID ID:', error);
      toast.error('Failed to search for profile. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pink-600 mb-2">Find Your Perfect Match</h1>
        <p className="text-gray-600">Discover compatible women who share your values and interests</p>
      </div>

      {/* Looking For Section */}
      <div className="bg-pink-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Looking For</h2>
        <p className="text-pink-500">Women looking for meaningful connections</p>
      </div>

      {/* Popular Activities */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Popular Activities</h2>
        <div className="flex flex-wrap gap-3">
          {popularActivities.map((activity, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm hover:bg-pink-100 cursor-pointer"
            >
              {activity}
            </span>
          ))}
        </div>
      </div>

      {/* Discover Your Soulmate Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Discover Your Soulmate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personality Analysis Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🧠</span>
                  Personality Analysis
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">85%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Openness</span>
                      <span>88%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conscientiousness</span>
                      <span>82%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Extraversion</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• High emotional intelligence</li>
                    <li>• Strong communication skills</li>
                    <li>• Balanced decision-making style</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('personality')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>❤️</span>
                  Preferences
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">92%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Values Match</span>
                      <span>90%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lifestyle Sync</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Interest Overlap</span>
                      <span>78%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Clear relationship goals</li>
                    <li>• Well-defined partner criteria</li>
                    <li>• Lifestyle compatibility focus</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('preferences')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>

          {/* Psychological Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🎯</span>
                  Psychological Profile
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">88%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Emotional Stability</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Self-Awareness</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Relationship Readiness</span>
                      <span>88%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Secure attachment style</li>
                    <li>• Healthy boundaries</li>
                    <li>• Growth mindset</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('psychological')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>

          {/* Relationship Goals Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🎯</span>
                  Relationship Goals
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">90%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Goal Clarity</span>
                      <span>95%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Timeline Alignment</span>
                      <span>88%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Value Consistency</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Long-term commitment oriented</li>
                    <li>• Family-focused values</li>
                    <li>• Career-life balance</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('goals')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>

          {/* Behavioral Insights Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🛡️</span>
                  Behavioral Insights
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">87%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Communication</span>
                      <span>90%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Empathy</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Adaptability</span>
                      <span>82%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Consistent communication patterns</li>
                    <li>• Positive conflict resolution</li>
                    <li>• Active listening skills</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('behavioral')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>

          {/* Deal Breakers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>⛔</span>
                  Deal Breakers
                </h3>
                <div className="text-2xl font-bold text-pink-500 mb-4">94%</div>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Boundary Clarity</span>
                      <span>95%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Value Alignment</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Standard Consistency</span>
                      <span>88%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Clear boundaries established</li>
                    <li>• Value-based criteria</li>
                    <li>• Lifestyle compatibility requirements</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleAssessmentClick('dealbreakers')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take Assessment Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CUPID ID Search Section - Now below Discover Your Soulmate */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Search by CUPID ID</h2>
            </div>
            <p className="text-white/90 text-lg mb-8">
              Looking for someone specific? Enter their CUPID ID to view their profile and compatibility analysis.
              This feature helps you find profiles even if they're not in your top matches.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                value={cupidId}
                onChange={(e) => setCupidId(e.target.value)}
                placeholder="Enter CUPID ID (e.g., CUPID-123456)"
                className="flex-1 px-6 py-4 text-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleCupidSearch}
                disabled={isSearching || !cupidId.trim()}
                className="px-8 py-4 bg-white text-pink-600 text-lg font-semibold rounded-xl hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CUPID Search Result */}
        {cupidSearchResult && (
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold">Search Result</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-pink-100">
              <div className="flex">
                {/* Profile Image */}
                <div className="w-48 h-48 flex-shrink-0">
                  {cupidSearchResult.profile.profile_image ? (
                    <img
                      src={cupidSearchResult.profile.profile_image}
                      alt={cupidSearchResult.profile.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{cupidSearchResult.profile.fullname}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <span>{cupidSearchResult.profile.age} years</span>
                        <span>•</span>
                        <span>{cupidSearchResult.profile.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm">
                          {cupidSearchResult.profile.occupation || 'Professional'}
                        </span>
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm">
                          {cupidSearchResult.profile.education || 'Graduate'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {Math.round(cupidSearchResult.compatibility_score)}% Match
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">About Me</h4>
                    <p className="text-gray-600">{cupidSearchResult.profile.bio || 'No bio available'}</p>
                  </div>

                  {/* Key Personality Traits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Personality Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {(cupidSearchResult.profile.personality_traits || ['Ambitious', 'Creative', 'Empathetic']).map((trait, index) => (
                        <span key={index} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests/Hobbies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Interests & Hobbies</h4>
                    <div className="flex flex-wrap gap-2">
                      {(cupidSearchResult.profile.interests || ['Reading', 'Traveling', 'Photography']).map((interest, index) => (
                        <span key={index} className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compatibility Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Personality Sync</div>
                      <div className="text-pink-500 font-semibold">92%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Values Alignment</div>
                      <div className="text-pink-500 font-semibold">88%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Lifestyle</div>
                      <div className="text-pink-500 font-semibold">85%</div>
                    </div>
                  </div>

                  {/* View Full Profile Button */}
                  <button
                    onClick={() => handleViewProfile(cupidSearchResult)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Your Top Matches Section */}
      {topMatches.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Your Top Matches</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Match Cards - Now in vertical layout */}
            <div className="lg:col-span-2 space-y-6">
              {topMatches.map((match) => (
                <div 
                  key={match.profile.id} 
                  className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedMatch?.profile.id === match.profile.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex">
                    {/* Profile Image */}
                    <div className="w-48 h-48 flex-shrink-0">
                      {match.profile.profile_image ? (
                        <img
                          src={match.profile.profile_image}
                          alt={match.profile.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{match.profile.fullname}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <span>{match.profile.age} years</span>
                            <span>•</span>
                            <span>{match.profile.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm">
                              {match.profile.occupation || 'Professional'}
                            </span>
                            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm">
                              {match.profile.education || 'Graduate'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {Math.round(match.compatibility_score)}% Match
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About Me</h4>
                        <p className="text-gray-600">{match.profile.bio}</p>
                      </div>

                      {/* Key Personality Traits */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Personality Traits</h4>
                        <div className="flex flex-wrap gap-2">
                          {(match.profile.personality_traits || ['Ambitious', 'Creative', 'Empathetic']).map((trait, index) => (
                            <span key={index} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interests/Hobbies */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Interests & Hobbies</h4>
                        <div className="flex flex-wrap gap-2">
                          {(match.profile.interests || ['Reading', 'Traveling', 'Photography']).map((interest, index) => (
                            <span key={index} className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compatibility Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Personality Sync</div>
                          <div className="text-pink-500 font-semibold">92%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Values Alignment</div>
                          <div className="text-pink-500 font-semibold">88%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lifestyle</div>
                          <div className="text-pink-500 font-semibold">85%</div>
                        </div>
                      </div>

                      {/* View Full Profile Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(match);
                        }}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compatibility Analysis */}
            {selectedMatch && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Match Analysis</h3>
                
                {/* Overall Match */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-pink-50 rounded-full p-4 mb-2">
                    <div className="text-3xl font-bold text-pink-500">
                      {Math.round(selectedMatch.compatibility_score)}%
                    </div>
                    <div className="text-sm text-pink-700">Overall Match</div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="space-y-4">
                  {[
                    { label: 'Personality Sync', value: 92 },
                    { label: 'Values Alignment', value: 88 },
                    { label: 'Lifestyle Compatibility', value: 85 },
                    { label: 'Communication Style', value: 90 },
                    { label: 'Emotional Intelligence', value: 87 },
                    { label: 'Intellectual Connection', value: 89 },
                    { label: 'Growth Mindset', value: 86 }
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">{metric.label}</span>
                        <span className="text-pink-500 font-semibold">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-pink-500 rounded-full" 
                          style={{ width: `${metric.value}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shared Activities */}
                {selectedMatch.profile.interests && selectedMatch.profile.interests.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Shared Activities</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedMatch.profile.interests.map((interest, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-2">
                            <Star className="w-6 h-6 text-pink-500" />
                          </div>
                          <span className="text-sm text-gray-600">{interest}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Compatibility View Modal */}
      {selectedMatch && showDetailedView && (
        <DetailedCompatibilityView
          isOpen={showDetailedView}
          onClose={() => setShowDetailedView(false)}
          onBack={() => setShowDetailedView(false)}
          profile={selectedMatch.profile}
          compatibility_details={{
            overall: selectedMatch.compatibility_score,
            emotional: Math.round(selectedMatch.compatibility_score * 0.9),
            intellectual: Math.round(selectedMatch.compatibility_score * 0.95),
            lifestyle: Math.round(selectedMatch.compatibility_score * 0.85),
            summary: selectedMatch.compatibility_details.long_term_prediction,
            strengths: selectedMatch.compatibility_details.strengths,
            challenges: selectedMatch.compatibility_details.challenges,
            tips: selectedMatch.compatibility_details.tips,
            long_term_prediction: selectedMatch.compatibility_details.long_term_prediction
          }}
        />
      )}
    </div>
  );
};

export default Home; 