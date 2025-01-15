import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { UserProfile, CompatibilityScore } from '../../types';

interface Props {
  profile: UserProfile;
  compatibility: CompatibilityScore;
  onViewDetails: () => void;
}

const CompatibilityOverview: React.FC<Props> = ({ profile, compatibility, onViewDetails }) => {
  const metrics = [
    {
      label: "Emotional",
      value: compatibility.emotional,
      insights: [
        "Communication style alignment",
        "Emotional intelligence match",
        "Empathy and understanding",
        "Emotional support compatibility"
      ]
    },
    {
      label: "Intellectual",
      value: compatibility.intellectual,
      insights: [
        "Shared interests and hobbies",
        "Problem-solving approach",
        "Decision-making style",
        "Intellectual curiosity match"
      ]
    },
    {
      label: "Lifestyle",
      value: compatibility.lifestyle,
      insights: [
        "Daily routine compatibility",
        "Work-life balance alignment",
        "Social preferences match",
        "Future goals alignment"
      ]
    }
  ];

  // Optional chaining and fallbacks for profile properties
  const profileName = profile?.fullname || 'your match';
  const profileImage = profile?.profile_image || null;
  const profileInterests = profile?.interests || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header with Enhanced Info */}
      <div className="flex items-start space-x-6 bg-white rounded-xl p-6 shadow-lg">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-600">
              {profileName[0]}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{profileName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="mb-1"><span className="font-medium">Age:</span> {profile.age} years</p>
              <p className="mb-1"><span className="font-medium">Location:</span> {profile.location}</p>
              <p className="mb-1"><span className="font-medium">Occupation:</span> {profile.occupation}</p>
              <p className="text-indigo-600 font-medium">CUPID ID: {profile.cupid_id}</p>
            </div>
            <div>
              <p className="mb-1"><span className="font-medium">Interests:</span> {profileInterests.join(', ') || 'Not specified'}</p>
              <p className="mb-1"><span className="font-medium">Looking for:</span> Long-term relationship</p>
              <p><span className="font-medium">Languages:</span> English</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Compatibility with Detailed Insights */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="w-48 h-48">
              <CircularProgressbar
                value={compatibility.overall}
                text={`${Math.round(compatibility.overall)}%`}
                styles={buildStyles({
                  pathColor: `rgba(99, 102, 241, ${compatibility.overall / 100})`,
                  textColor: '#4F46E5',
                  trailColor: '#F3F4F6',
                  textSize: '16px'
                })}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Overall Compatibility</h4>
            <p className="text-gray-600 mb-4">{compatibility.summary}</p>
            <div className="text-sm text-gray-600">
              <p className="mb-2">• Based on personality analysis</p>
              <p className="mb-2">• Analyzed core values</p>
              <p>• Considered lifestyle preferences and goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics with Insights */}
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">{metric.label} Compatibility</h4>
            <span className="text-2xl font-bold text-indigo-600">{Math.round(metric.value)}%</span>
          </div>
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">
              <h5 className="font-medium text-gray-900 mb-2">Key Factors:</h5>
              <ul className="space-y-1">
                {metric.insights.map((insight, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-gray-600">
              <h5 className="font-medium text-gray-900 mb-2">Recommendations:</h5>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                  Focus on shared {metric.label.toLowerCase()} aspects
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                  Discuss {metric.label.toLowerCase()} expectations
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Strengths & Challenges with Context */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Relationship Strengths</h4>
          <ul className="space-y-3">
            {compatibility.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-green-500 rounded-full mr-3" />
                <div>
                  <p className="text-gray-900 font-medium">{strength}</p>
                  <p className="text-sm text-gray-600">This strength contributes positively to your compatibility.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Growth Opportunities</h4>
          <ul className="space-y-3">
            {compatibility.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-orange-500 rounded-full mr-3" />
                <div>
                  <p className="text-gray-900 font-medium">{challenge}</p>
                  <p className="text-sm text-gray-600">Working on this area can strengthen your connection.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
      >
        <span>View In-Depth Analysis</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  );
};

export default CompatibilityOverview; 