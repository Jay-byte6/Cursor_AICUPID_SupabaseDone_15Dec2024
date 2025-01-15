import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, History, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import { UserProfile } from '../types';

type TabType = 'favorites' | 'chats' | 'compatibility' | 'search';

interface InsightItem {
  id: string;
  fullname: string;
  timestamp: string;
  type: TabType;
  details: {
    compatibility_score: number;
    last_interaction?: string;
    message_count?: number;
    compatibility_insights?: string[];
  };
  profile?: UserProfile;
  compatibility_insights?: {
    compatibility_score: number;
    strengths: string[];
    challenges: string[];
    tips: string[];
    long_term_prediction: string;
  };
}

const RelationshipInsights = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightItem[]>([]);

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'chats', label: 'Chat History', icon: MessageCircle },
    { id: 'compatibility', label: 'Compatibility History', icon: History },
    { id: 'search', label: 'Search History', icon: Search }
  ];

  useEffect(() => {
    const loadInsights = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        if (activeTab === 'favorites') {
          // Load actual favorite profiles
          const favorites = await profileService.getFavoriteProfiles(user.id);
          const formattedFavorites = favorites.map(favorite => ({
            id: favorite.id || '',
            fullname: favorite.profile?.fullname || 'Anonymous',
            timestamp: favorite.last_updated || new Date().toISOString(),
            type: 'favorites' as TabType,
            details: {
              compatibility_score: favorite.compatibility_score || 0,
              compatibility_insights: favorite.compatibility_details?.strengths || []
            },
            profile: favorite.profile,
            compatibility_insights: {
              compatibility_score: favorite.compatibility_score || 0,
              strengths: favorite.compatibility_details?.strengths || [],
              challenges: favorite.compatibility_details?.challenges || [],
              tips: favorite.compatibility_details?.tips || [],
              long_term_prediction: favorite.compatibility_details?.long_term_prediction || ''
            }
          }));
          setInsights(formattedFavorites);
        } else {
          // Handle other tabs with existing logic
          const dummyData: InsightItem[] = Array.from({ length: 5 }, (_, i) => ({
            id: `dummy-${i}`,
            fullname: `User ${i + 1}`,
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
            type: activeTab,
            details: {
              compatibility_score: 75 + Math.random() * 20,
              last_interaction: new Date(Date.now() - i * 3600000).toISOString(),
              message_count: Math.floor(Math.random() * 100),
              compatibility_insights: [
                'Similar interests in music and art',
                'Complementary communication styles',
                'Shared life goals'
              ]
            }
          }));
          setInsights(dummyData);
        }
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [user, activeTab]);

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relationship Insights
        </h1>
        <p className="text-gray-600">
          Track your connections and interactions
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  flex items-center px-1 py-4 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  {item.profile?.profile_image ? (
                    <img
                      src={item.profile.profile_image}
                      alt={item.fullname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.timestamp)}
                  </p>
                </div>
              </div>

              {activeTab === 'favorites' && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(item.details.compatibility_score)}%
                  </div>
                  <div className="text-sm text-gray-500">Compatibility</div>
                </div>
              )}

              {activeTab === 'chats' && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Last message at {formatTime(item.details.last_interaction)}
                  </div>
                  <div className="text-sm font-medium text-indigo-600">
                    {item.details.message_count} messages
                  </div>
                </div>
              )}
            </div>

            {(activeTab === 'compatibility' || activeTab === 'search' || activeTab === 'favorites') && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Compatibility Insights
                </h4>
                <ul className="space-y-2">
                  {(item.compatibility_insights?.strengths || item.details.compatibility_insights || []).map((insight: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </button>
              <button className="flex items-center px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                <Heart className="w-5 h-5 mr-2" />
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelationshipInsights; 