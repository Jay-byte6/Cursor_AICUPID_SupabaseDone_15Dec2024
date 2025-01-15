import React from 'react';
import { AIPersona, NegativePersona } from '../../types';

interface PersonaInsightsProps {
  positivePersona: AIPersona;
  negativePersona: NegativePersona;
}

const PersonaInsights: React.FC<PersonaInsightsProps> = ({ positivePersona, negativePersona }) => {
  // Helper function to safely get array data
  const getSafeArray = (data: any, path: string[]): string[] => {
    try {
      let current = data;
      for (const key of path) {
        if (!current?.[key]) return [];
        current = current[key];
      }
      return Array.isArray(current) ? current : [];
    } catch (error) {
      console.error('Error accessing array data:', error);
      return [];
    }
  };

  // Helper function to safely get string data
  const getSafeString = (data: any, key: string): string => {
    return typeof data?.[key] === 'string' ? data[key] : '';
  };

  // Get arrays safely
  const personalityTraits = getSafeArray(positivePersona, ['personality_traits', 'traits']);
  const coreValues = getSafeArray(positivePersona, ['core_values', 'traits']);
  const behavioralTraits = getSafeArray(positivePersona, ['behavioral_traits', 'traits']);
  const hobbiesInterests = getSafeArray(positivePersona, ['hobbies_interests', 'traits']);

  const emotionalAspects = getSafeArray(negativePersona, ['emotional_aspects', 'traits']);
  const socialAspects = getSafeArray(negativePersona, ['social_aspects', 'traits']);
  const lifestyleAspects = getSafeArray(negativePersona, ['lifestyle_aspects', 'traits']);
  const relationalAspects = getSafeArray(negativePersona, ['relational_aspects', 'traits']);

  // Get examples safely
  const personalityExamples = getSafeArray(positivePersona, ['personality_traits', 'examples']);
  const coreValuesExamples = getSafeArray(positivePersona, ['core_values', 'examples']);
  const behavioralExamples = getSafeArray(positivePersona, ['behavioral_traits', 'examples']);
  const hobbiesExamples = getSafeArray(positivePersona, ['hobbies_interests', 'examples']);

  const emotionalExamples = getSafeArray(negativePersona, ['emotional_aspects', 'examples']);
  const socialExamples = getSafeArray(negativePersona, ['social_aspects', 'examples']);
  const lifestyleExamples = getSafeArray(negativePersona, ['lifestyle_aspects', 'examples']);
  const relationalExamples = getSafeArray(negativePersona, ['relational_aspects', 'examples']);

  // Get summaries safely for all aspect types
  const positiveSummaries = {
    personality: getSafeString(positivePersona?.personality_traits || {}, 'summary'),
    core: getSafeString(positivePersona?.core_values || {}, 'summary'),
    behavioral: getSafeString(positivePersona?.behavioral_traits || {}, 'summary'),
    hobbies: getSafeString(positivePersona?.hobbies_interests || {}, 'summary')
  };

  const negativeSummaries = {
    emotional: getSafeString(negativePersona?.emotional_aspects || {}, 'summary'),
    social: getSafeString(negativePersona?.social_aspects || {}, 'summary'),
    lifestyle: getSafeString(negativePersona?.lifestyle_aspects || {}, 'summary'),
    relational: getSafeString(negativePersona?.relational_aspects || {}, 'summary')
  };

  console.log('Rendering PersonaInsights with data:', {
    positivePersona,
    negativePersona,
    personalityTraits,
    coreValues,
    behavioralTraits,
    hobbiesInterests,
    emotionalAspects,
    socialAspects,
    lifestyleAspects,
    relationalAspects,
    positiveSummaries,
    negativeSummaries
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Positive Persona */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-green-600 mb-4">Positive Traits & Characteristics</h3>
        
        {/* Personality Traits */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Personality Traits</h4>
          <ul className="list-disc list-inside text-gray-600">
            {personalityTraits.map((trait, index) => (
              <li key={index} className="mb-1">
                {trait}
                {personalityExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {personalityExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {positiveSummaries.personality && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">{positiveSummaries.personality}</p>
            </div>
          )}
        </div>

        {/* Core Values */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Core Values</h4>
          <ul className="list-disc list-inside text-gray-600">
            {coreValues.map((value, index) => (
              <li key={index} className="mb-1">
                {value}
                {coreValuesExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {coreValuesExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {positiveSummaries.core && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">{positiveSummaries.core}</p>
            </div>
          )}
        </div>

        {/* Behavioral Traits */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Behavioral Traits</h4>
          <ul className="list-disc list-inside text-gray-600">
            {behavioralTraits.map((trait, index) => (
              <li key={index} className="mb-1">
                {trait}
                {behavioralExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {behavioralExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {positiveSummaries.behavioral && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">{positiveSummaries.behavioral}</p>
            </div>
          )}
        </div>

        {/* Hobbies & Interests */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Hobbies & Interests</h4>
          <ul className="list-disc list-inside text-gray-600">
            {hobbiesInterests.map((hobby, index) => (
              <li key={index} className="mb-1">
                {hobby}
                {hobbiesExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {hobbiesExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {positiveSummaries.hobbies && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">{positiveSummaries.hobbies}</p>
            </div>
          )}
        </div>
      </div>

      {/* Negative Persona */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Growth Areas & Challenges</h3>

        {/* Emotional Aspects */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Emotional Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {emotionalAspects.map((aspect, index) => (
              <li key={index} className="mb-1">
                {aspect}
                {emotionalExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {emotionalExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {negativeSummaries.emotional && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">{negativeSummaries.emotional}</p>
            </div>
          )}
        </div>

        {/* Social Aspects */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Social Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {socialAspects.map((aspect, index) => (
              <li key={index} className="mb-1">
                {aspect}
                {socialExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {socialExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {negativeSummaries.social && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">{negativeSummaries.social}</p>
            </div>
          )}
        </div>

        {/* Lifestyle Aspects */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Lifestyle Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {lifestyleAspects.map((aspect, index) => (
              <li key={index} className="mb-1">
                {aspect}
                {lifestyleExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {lifestyleExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {negativeSummaries.lifestyle && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">{negativeSummaries.lifestyle}</p>
            </div>
          )}
        </div>

        {/* Relational Aspects */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Relational Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {relationalAspects.map((aspect, index) => (
              <li key={index} className="mb-1">
                {aspect}
                {relationalExamples[index] && (
                  <p className="ml-6 text-sm text-gray-500">Example: {relationalExamples[index]}</p>
                )}
              </li>
            ))}
          </ul>
          {negativeSummaries.relational && (
            <div className="mt-2 p-3 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">{negativeSummaries.relational}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaInsights; 