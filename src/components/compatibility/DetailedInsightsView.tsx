import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  MessageCircle,
  Brain,
  Zap,
  BarChart,
  Sparkles,
  Compass,
  ArrowLeft,
  Heart,
  Users,
  Star,
  AlertTriangle,
  Target,
  BookOpen,
  Lightbulb,
  Settings,
  CheckCircle,
  XCircle,
  UserCircle,
  Smile,
  Frown
} from 'lucide-react';
import { CompatibilityScore } from '../../types';

interface Props {
  compatibility_details: CompatibilityScore;
  onBack: () => void;
}

const DetailedInsightsView: React.FC<Props> = ({
  compatibility_details,
  onBack
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const strengthCategories = [
    {
      title: 'Shared Values',
      description: 'Both value honesty, loyalty, and family deeply, forming a strong foundation for trust and mutual respect.'
    },
    {
      title: 'Emotional Support',
      description: 'High emotional intelligence and mutual understanding create a supportive environment for both partners.'
    },
    {
      title: 'Complementary Lifestyle',
      description: 'Balanced approach to work-life harmony and shared interests in nature and travel.'
    },
    {
      title: 'Growth Mindset',
      description: 'Both partners are open to trying new experiences, making their relationship dynamic and engaging.'
    }
  ];

  const challengeCategories = [
    {
      title: 'Conflict Styles',
      description: 'Different approaches to handling disagreements may require attention and adaptation.'
    },
    {
      title: 'Idealism vs Reality',
      description: 'Balancing idealistic relationship views with practical day-to-day aspects.'
    },
    {
      title: 'Social Preferences',
      description: 'Varying comfort levels with social gatherings and activities.'
    },
    {
      title: 'Sensitivity to Feedback',
      description: 'Both partners may need to work on receiving and giving constructive criticism.'
    }
  ];

  const individualChallenges = {
    partner1: [
      'Adjusting to spontaneous decisions and changes',
      'Stepping out of comfort zone in social settings',
      'Being more flexible with routines and plans'
    ],
    partner2: [
      'Managing expectations in the relationship',
      'Addressing conflicts more proactively',
      'Finding balance between independence and togetherness'
    ]
  };

  const improvementTips = [
    {
      category: 'Enhance Communication',
      tips: [
        'Express emotional needs openly while respecting boundaries',
        'Share thoughts and feelings promptly to avoid misunderstandings',
        'Practice active listening and validation techniques'
      ]
    },
    {
      category: 'Balance Social Life',
      tips: [
        'Find compromise in social activities and gatherings',
        'Respect each other\'s social preferences and limits',
        'Create shared social experiences that both enjoy'
      ]
    },
    {
      category: 'Foster Mutual Growth',
      tips: [
        'Explore shared hobbies and interests together',
        'Support individual growth while maintaining connection',
        'Practice constructive conflict resolution methods'
      ]
    }
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="space-y-8"
    >
      {/* Executive Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
          <Heart className="w-6 h-6 mr-2" />
          Compatibility Analysis Summary
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-full">
                <span className="text-2xl font-bold text-indigo-600">{compatibility_details.overall}%</span>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-indigo-900">Overall Compatibility</h4>
                <p className="text-sm text-indigo-700">Strong potential for a lasting connection</p>
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-gray-700 leading-relaxed">
            {compatibility_details.summary}
          </p>
        </div>
      </div>

      {/* Strengths */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-yellow-600">
          <Star className="w-6 h-6 mr-2" />
          Strengths in Their Relationship
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengthCategories.map((strength, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-yellow-600" />
                {strength.title}
              </h4>
              <p className="text-sm text-yellow-800">
                {strength.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-600">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Potential Challenges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challengeCategories.map((challenge, index) => (
            <div key={index} className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-amber-600" />
                {challenge.title}
              </h4>
              <p className="text-sm text-amber-800">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Growth Areas */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
          <Users className="w-6 h-6 mr-2" />
          Individual Growth Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3 flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-purple-600" />
              Partner 1
            </h4>
            <ul className="space-y-2">
              {individualChallenges.partner1.map((challenge, index) => (
                <li key={index} className="flex items-start text-purple-800">
                  <Target className="w-4 h-4 mr-2 mt-1 text-purple-600" />
                  <span className="text-sm">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3 flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-purple-600" />
              Partner 2
            </h4>
            <ul className="space-y-2">
              {individualChallenges.partner2.map((challenge, index) => (
                <li key={index} className="flex items-start text-purple-800">
                  <Target className="w-4 h-4 mr-2 mt-1 text-purple-600" />
                  <span className="text-sm">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tips for Success */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips to Improve Compatibility
        </h3>
        <div className="space-y-6">
          {improvementTips.map((section, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-green-600" />
                {section.category}
              </h4>
              <ul className="space-y-2 ml-6">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start text-green-800">
                    <Sparkles className="w-4 h-4 mr-2 mt-1 text-green-600" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Long-term Prediction */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
          <Compass className="w-6 h-6 mr-2" />
          Long-term Relationship Prediction
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {compatibility_details.long_term_prediction}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
                <Smile className="w-4 h-4 mr-2 text-indigo-600" />
                Relationship Strengths
              </h4>
              <p className="text-sm text-indigo-800">
                Strong emotional bond, shared values, and mutual respect will make their relationship fulfilling and supportive.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
                <Frown className="w-4 h-4 mr-2 text-indigo-600" />
                Areas for Attention
              </h4>
              <p className="text-sm text-indigo-800">
                Managing differences in social preferences and communication styles will be key to long-term success.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
              Key Takeaway
            </h4>
            <p className="text-sm text-indigo-800">
              This relationship shows exceptional potential for a lasting and fulfilling partnership. With continued focus on communication, mutual growth, and understanding, both partners can build a strong foundation for a harmonious future together.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </button>
      </div>
    </motion.div>
  );
};

export default DetailedInsightsView; 