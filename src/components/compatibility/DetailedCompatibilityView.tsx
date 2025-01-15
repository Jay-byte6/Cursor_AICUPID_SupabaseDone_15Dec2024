import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  ArrowLeft, 
  Star, 
  AlertTriangle,
  Target,
  Sparkles,
  X,
  Lightbulb,
  Compass,
  Clock,
  Smile,
  Frown,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SmartMatchProfile, CompatibilityScore, UserProfile } from '../../types';
import DetailedInsightsView from './DetailedInsightsView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  profile: SmartMatchProfile | UserProfile;
  compatibility_details: CompatibilityScore;
}

const DetailedCompatibilityView: React.FC<Props> = ({
  isOpen,
  onClose,
  onBack,
  profile,
  compatibility_details
}) => {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4F46E5';
    if (score >= 60) return '#059669';
    if (score >= 40) return '#D97706';
    return '#DC2626';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const metrics = [
    { 
      label: 'Emotional', 
      value: compatibility_details.emotional,
      description: 'Measures how well you connect on an emotional level'
    },
    { 
      label: 'Intellectual', 
      value: compatibility_details.intellectual,
      description: 'Indicates alignment in thinking and communication styles'
    },
    { 
      label: 'Lifestyle', 
      value: compatibility_details.lifestyle,
      description: 'Shows compatibility in daily routines and life goals'
    }
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative bg-white rounded-xl max-w-6xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Summary
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Header */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 mb-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{profile.fullname}</h2>
              <p className="text-gray-600 mt-1">
                CUPID ID: {('cupid_id' in profile) ? profile.cupid_id : ''}
              </p>
              <div className="flex gap-4 mt-2">
                {profile.age && <span className="text-sm text-gray-600">{profile.age} years</span>}
                {profile.location && <span className="text-sm text-gray-600">{profile.location}</span>}
                {profile.occupation && <span className="text-sm text-gray-600">{profile.occupation}</span>}
              </div>
            </div>
          </motion.div>

          {!showDetailedInsights ? (
            <>
              {/* Overall Compatibility Score */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 flex items-center justify-center text-indigo-600">
                    <Heart className="w-6 h-6 mr-2" />
                    Overall Compatibility
                  </h3>
                  <div className="w-40 mx-auto">
                    <CircularProgressbar
                      value={compatibility_details.overall}
                      text={`${compatibility_details.overall}%`}
                      styles={buildStyles({
                        textSize: '16px',
                        pathColor: getScoreColor(compatibility_details.overall),
                        textColor: getScoreColor(compatibility_details.overall),
                        trailColor: '#E5E7EB',
                        pathTransitionDuration: 1,
                        strokeLinecap: 'round'
                      })}
                    />
                  </div>
                  <p className="text-gray-600 mt-4 max-w-lg mx-auto">
                    {compatibility_details.summary}
                  </p>
                  <button
                    onClick={() => setShowDetailedInsights(true)}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Detailed Insights
                  </button>
                </div>
              </motion.div>

              {/* Compatibility Metrics */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                  <Target className="w-6 h-6 mr-2" />
                  Compatibility Metrics
                </h3>
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-32 h-32">
                    <CircularProgressbar
                      value={compatibility_details.overall}
                      text={`${compatibility_details.overall}%`}
                      styles={buildStyles({
                        textSize: '20px',
                        pathColor: '#4F46E5',
                        textColor: '#4F46E5',
                        trailColor: '#E2E8F0'
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Emotional</h3>
                    <div className="h-2 bg-gray-200 rounded-full mb-1">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${compatibility_details.emotional}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{compatibility_details.emotional}%</p>
                    <p className="text-sm text-gray-500 mt-1">Measures how well you connect on an emotional level</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Intellectual</h3>
                    <div className="h-2 bg-gray-200 rounded-full mb-1">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${compatibility_details.intellectual}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{compatibility_details.intellectual}%</p>
                    <p className="text-sm text-gray-500 mt-1">Indicates alignment in thinking and communication styles</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lifestyle</h3>
                    <div className="h-2 bg-gray-200 rounded-full mb-1">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${compatibility_details.lifestyle}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{compatibility_details.lifestyle}%</p>
                    <p className="text-sm text-gray-500 mt-1">Shows compatibility in daily routines and life goals</p>
                  </div>
                </div>
              </motion.section>

              {/* Compatibility Insights */}
              <motion.section 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {/* Strengths */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600">
                    <Smile className="w-6 h-6 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {compatibility_details.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-600">
                    <Frown className="w-6 h-6 mr-2" />
                    Challenges
                  </h3>
                  <ul className="space-y-3">
                    {compatibility_details.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              {/* Tips and Long-term Prediction */}
              <motion.section 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Tips */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                    <Lightbulb className="w-6 h-6 mr-2" />
                    Tips for Success
                  </h3>
                  <ul className="space-y-3">
                    {compatibility_details.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <Sparkles className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long-term Prediction */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
                    <Compass className="w-6 h-6 mr-2" />
                    Long-term Potential
                  </h3>
                  <p className="text-gray-700">
                    {compatibility_details.long_term_prediction}
                  </p>
                </div>
              </motion.section>
            </>
          ) : (
            <DetailedInsightsView
              compatibility_details={compatibility_details}
              onBack={() => setShowDetailedInsights(false)}
            />
          )}
        </motion.div>
      </div>
    </Dialog>
  );
};

export default DetailedCompatibilityView; 