import React from 'react';
import { motion } from 'framer-motion';

interface AssessmentSummaryProps {
  data: {
    personalInfo?: Record<string, any>;
    preferences?: Record<string, any>;
    psychologicalProfile?: Record<string, any>;
    relationshipGoals?: Record<string, any>;
    behavioralInsights?: Record<string, any>;
    dealbreakers?: Record<string, any>;
  };
  currentSection: string;
}

const formatValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value === null || value === undefined) {
    return 'Not specified';
  }
  return value.toString();
};

const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ data, currentSection }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const renderSectionSummary = (sectionData: Record<string, any>, sectionName: string) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg mb-4 ${
          currentSection === sectionName ? 'bg-pink-50 border-2 border-pink-200' : 'bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {formatKey(sectionName)}
          </h3>
          {currentSection === sectionName && (
            <span className="text-sm text-pink-600 font-medium">Current Section</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">
                {formatKey(key)}
              </div>
              <div className="text-base text-gray-900">
                {formatValue(value)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Assessment Data</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <div className="space-y-6">
        {Object.entries(data).map(([section, sectionData]) => 
          renderSectionSummary(sectionData as Record<string, any>, section)
        )}
      </div>
    </div>
  );
};

export default AssessmentSummary; 