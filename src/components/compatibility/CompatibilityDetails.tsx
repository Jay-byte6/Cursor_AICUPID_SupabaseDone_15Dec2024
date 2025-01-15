import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { UserProfile, CompatibilityScore } from '../../types';

interface Props {
  profile: UserProfile;
  compatibility: CompatibilityScore;
  onBack: () => void;
}

const CompatibilityDetails: React.FC<Props> = ({ profile, compatibility, onBack }) => {
  // Get current user's name from localStorage or context, with fallback
  const currentUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'You' : 'You';

  // Optional chaining for profile properties
  const profileName = profile?.fullname || 'your match';
  const profileInterests = profile?.interests || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-indigo-600 hover:text-indigo-700"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Overview
      </button>

      {/* Header with Names and Overall Score */}
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {currentUserName} & {profileName}
        </h2>
        <div className="w-32 h-32 mx-auto mb-6">
          <CircularProgressbar
            value={compatibility.overall}
            text={`${Math.round(compatibility.overall)}%`}
            styles={buildStyles({
              pathColor: `rgba(99, 102, 241, ${compatibility.overall / 100})`,
              textColor: '#4F46E5',
              trailColor: '#F3F4F6',
              textSize: '20px'
            })}
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {compatibility.summary}
        </p>
      </div>

      {/* Key Relationship Insights */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Relationship Insights</h3>
        
        {/* Strengths Section */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-green-600 mb-4">Strengths in Your Relationship</h4>
          <div className="bg-green-50 rounded-lg p-6">
            <ul className="space-y-4">
              {compatibility.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-gray-900 font-medium">{strength}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      This strength indicates a strong foundation for your relationship.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-orange-600 mb-4">Areas for Growth</h4>
          <div className="bg-orange-50 rounded-lg p-6">
            <ul className="space-y-4">
              {compatibility.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-gray-900 font-medium">{challenge}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Working together on this area will strengthen your bond.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-indigo-600 mb-4">Compatibility Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emotional Compatibility */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold text-gray-900">Emotional</h5>
                <span className="text-2xl font-bold text-indigo-600">{compatibility.emotional}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your emotional connection with {profileName} shows strong potential for deep understanding and support.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Strong emotional resonance
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Mutual empathy
                </li>
              </ul>
            </div>

            {/* Intellectual Compatibility */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold text-gray-900">Intellectual</h5>
                <span className="text-2xl font-bold text-indigo-600">{compatibility.intellectual}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You and {profileName} share stimulating conversations and mental compatibility.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Similar interests
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Complementary thinking styles
                </li>
              </ul>
            </div>

            {/* Lifestyle Compatibility */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold text-gray-900">Lifestyle</h5>
                <span className="text-2xl font-bold text-indigo-600">{compatibility.lifestyle}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your daily routines and life goals align well with {profileName}'s preferences.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Compatible routines
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                  Shared life vision
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Long Term Potential */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-purple-600 mb-4">Long Term Potential</h4>
          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-gray-900 mb-6">{compatibility.long_term_prediction}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Key Success Factors</h5>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                    Strong foundation of trust and respect
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                    Shared values and life goals
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Areas to Focus On</h5>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                    Open communication
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                    Understanding each other's needs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Relationship Enhancement Tips */}
        <div>
          <h4 className="text-xl font-semibold text-blue-600 mb-4">Tips for a Stronger Connection</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compatibility.tips.map((tip, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-2">{tip}</p>
                    <p className="text-sm text-blue-600">
                      Focus on this to deepen your connection with {profileName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompatibilityDetails; 