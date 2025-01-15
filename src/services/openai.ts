import OpenAI from 'openai';
import { UserProfile, PersonaAnalysis, PersonaAspect, CompatibilityScore } from '../types';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Get API key from environment variable with Vite prefix
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const DEBUG = true; // Enable debug mode

// Debug logging
if (DEBUG) {
  console.log('OpenAI Configuration:', {
    apiKeyAvailable: !!OPENAI_API_KEY,
    apiKeyLength: OPENAI_API_KEY?.length || 0
  });
}

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key is not set. Persona analysis features will not work.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const COMPATIBILITY_WEIGHTS = {
  values_alignment: 0.30,
  personality_compatibility: 0.25,
  emotional_intelligence: 0.20,
  lifestyle_match: 0.15,
  goals_alignment: 0.10
};

// Keep existing function for backward compatibility
export const generatePersonaAnalysis = async (data: { user1: any, user2: any }) => {
  try {
    const prompt = `Analyze the compatibility between these two individuals:
    Person 1: ${JSON.stringify(data.user1)}
    Person 2: ${JSON.stringify(data.user2)}
    
    Provide:
    1. Overall compatibility score (0-100)
    2. Key strengths
    3. Potential challenges
    4. Tips for better understanding
    5. Long-term relationship prediction`;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are an expert relationship counselor." },
      { role: "user", content: prompt }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    return transformAIResponseToCompatibilityScore(analysis);
  } catch (error) {
    console.error('Error generating compatibility analysis:', error);
    throw error;
  }
};

interface ChatHistory {
  messages: string[];
  aiChat: string[];
  personalityData?: any;
}

export async function generateDetailedPersonaAnalysis(userData: any): Promise<PersonaAnalysis | null> {
  try {
    console.log('Generating persona analysis for profile:', userData);

    // Ensure we have required data
    if (!userData.personalInfo) {
      throw new Error('Personal information is required for analysis');
    }

    // Create analysis prompt
    const messages: ChatCompletionMessageParam[] = [{
      role: 'system',
      content: `Generate a detailed persona analysis for a dating profile. Return the analysis in the following exact JSON structure:
{
  "positive": {
    "personality_traits": ["trait1", "trait2", "trait3"],
    "personality_examples": ["example1", "example2"],
    "personality_summary": "Summary text",
    "core_values": ["value1", "value2", "value3"],
    "value_examples": ["example1", "example2"],
    "values_summary": "Summary text",
    "behavioral_traits": ["trait1", "trait2", "trait3"],
    "behavior_examples": ["example1", "example2"],
    "behavior_summary": "Summary text",
    "hobbies": ["hobby1", "hobby2", "hobby3"],
    "hobby_examples": ["example1", "example2"],
    "hobbies_summary": "Summary text"
  },
  "negative": {
    "emotional_aspects": ["aspect1", "aspect2", "aspect3"],
    "emotional_examples": ["example1", "example2"],
    "emotional_summary": "Summary text",
    "social_aspects": ["aspect1", "aspect2", "aspect3"],
    "social_examples": ["example1", "example2"],
    "social_summary": "Summary text",
    "lifestyle_aspects": ["aspect1", "aspect2", "aspect3"],
    "lifestyle_examples": ["example1", "example2"],
    "lifestyle_summary": "Summary text",
    "relational_aspects": ["aspect1", "aspect2", "aspect3"],
    "relational_examples": ["example1", "example2"],
    "relational_summary": "Summary text"
  }
}

Profile Information:
- Name: ${userData.personalInfo.name}
- Age: ${userData.personalInfo.age}
- Location: ${userData.personalInfo.location}
- Occupation: ${userData.personalInfo.occupation}
- Relationship History: ${userData.personalInfo.relationshipHistory}
- Lifestyle: ${userData.personalInfo.lifestyle}

Generate a comprehensive analysis based on this information. Ensure all arrays have at least 2-3 items and all summaries are concise but meaningful.`
    }];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse the response
    const analysis = JSON.parse(analysisText);

    // Validate the structure
    if (!analysis.positive || !analysis.negative) {
      throw new Error('Invalid analysis structure');
    }

    // Format the response into PersonaAnalysis structure
    const personaAnalysis: PersonaAnalysis = {
      positivePersona: {
        id: undefined,
        user_id: userData.user_id || '',
        personality_traits: {
          traits: analysis.positive.personality_traits || [],
          examples: analysis.positive.personality_examples || [],
          summary: analysis.positive.personality_summary || null,
          intensity: 0.8
        },
        core_values: {
          traits: analysis.positive.core_values || [],
          examples: analysis.positive.value_examples || [],
          summary: analysis.positive.values_summary || null,
          intensity: 0.8
        },
        behavioral_traits: {
          traits: analysis.positive.behavioral_traits || [],
          examples: analysis.positive.behavior_examples || [],
          summary: analysis.positive.behavior_summary || null,
          intensity: 0.8
        },
        hobbies_interests: {
          traits: analysis.positive.hobbies || [],
          examples: analysis.positive.hobby_examples || [],
          summary: analysis.positive.hobbies_summary || null,
          intensity: 0.8
        },
        summary: '',
        created_at: undefined,
        updated_at: undefined
      },
      negativePersona: {
        emotional_aspects: {
          traits: analysis.negative.emotional_aspects || [],
          examples: analysis.negative.emotional_examples || [],
          summary: analysis.negative.emotional_summary || null,
          intensity: 0.6
        },
        social_aspects: {
          traits: analysis.negative.social_aspects || [],
          examples: analysis.negative.social_examples || [],
          summary: analysis.negative.social_summary || null,
          intensity: 0.6
        },
        lifestyle_aspects: {
          traits: analysis.negative.lifestyle_aspects || [],
          examples: analysis.negative.lifestyle_examples || [],
          summary: analysis.negative.lifestyle_summary || null,
          intensity: 0.6
        },
        relational_aspects: {
          traits: analysis.negative.relational_aspects || [],
          examples: analysis.negative.relational_examples || [],
          summary: analysis.negative.relational_summary || null,
          intensity: 0.6
        }
      }
    };

    return personaAnalysis;
  } catch (error) {
    console.error('Error generating detailed persona analysis:', error);
    return null;
  }
}

// Helper function to create default error response
function createDefaultErrorResponse(errorMessage: string): PersonaAnalysis {
  const defaultAspect = {
    traits: [],
    examples: [],
    summary: errorMessage,
    intensity: 0
  };

  return {
    positivePersona: {
      personality_traits: defaultAspect,
      core_values: defaultAspect,
      behavioral_traits: defaultAspect,
      hobbies_interests: defaultAspect
    },
    negativePersona: {
      emotional_aspects: defaultAspect,
      social_aspects: defaultAspect,
      lifestyle_aspects: defaultAspect,
      relational_aspects: defaultAspect
    }
  };
}

// Helper function to validate analysis structure
function isValidAnalysis(analysis: any): boolean {
  const hasPositivePersona = analysis?.positivePersona && 
    analysis.positivePersona.personality_traits?.traits?.length > 0 &&
    analysis.positivePersona.core_values?.traits?.length > 0 &&
    analysis.positivePersona.behavioral_traits?.traits?.length > 0 &&
    analysis.positivePersona.hobbies_interests?.traits?.length > 0;

  const hasNegativePersona = analysis?.negativePersona &&
    analysis.negativePersona.emotional_aspects?.traits?.length > 0 &&
    analysis.negativePersona.social_aspects?.traits?.length > 0 &&
    analysis.negativePersona.lifestyle_aspects?.traits?.length > 0 &&
    analysis.negativePersona.relational_aspects?.traits?.length > 0;

  if (!hasPositivePersona || !hasNegativePersona) {
    console.warn('Invalid analysis structure:', {
      hasPositivePersona,
      hasNegativePersona,
      analysis: JSON.stringify(analysis, null, 2)
    });
    return false;
  }

  return true;
}

// New enhanced compatibility analysis
export const analyzeDetailedCompatibility = async (
  profile1: UserProfile,
  profile2: UserProfile,
  personas?: { persona1: PersonaAnalysis, persona2: PersonaAnalysis }
): Promise<CompatibilityScore> => {
  try {
    const prompt = `As an expert relationship counselor, analyze the compatibility between these two individuals considering these weights:
- Values Alignment (30%): Core values, beliefs, and principles
- Personality Compatibility (25%): Character traits and behavioral patterns
- Emotional Intelligence (20%): Emotional understanding and support
- Lifestyle Match (15%): Daily routines and habits
- Goals Alignment (10%): Future aspirations and plans

Person 1:
${JSON.stringify(profile1, null, 2)}

Person 2:
${JSON.stringify(profile2, null, 2)}

${personas ? `Detailed Personas:
${JSON.stringify(personas, null, 2)}` : ''}

Provide analysis in the following format:
{
  "overall_score": 85,
  "emotional_score": 80,
  "intellectual_score": 90,
  "lifestyle_score": 75,
  "summary": "Overall compatibility summary",
  "strengths": ["strength1", "strength2"],
  "challenges": ["challenge1", "challenge2"],
  "tips": ["tip1", "tip2"],
  "long_term_prediction": "Detailed prediction of relationship potential"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an expert relationship counselor specializing in compatibility analysis. Provide analysis in valid JSON format only. Do not include any additional text or explanations outside the JSON object."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content in OpenAI response');
    }

    const analysis = JSON.parse(completion.choices[0].message.content);
    return transformAIResponseToCompatibilityScore(analysis);
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    return {
      overall: 0,
      emotional: 0,
      intellectual: 0,
      lifestyle: 0,
      summary: 'Unable to analyze compatibility at this time',
      strengths: [],
      challenges: [],
      tips: [],
      long_term_prediction: ''
    };
  }
};

function transformAIResponseToPersonaAnalysis(aiResponse: any): PersonaAnalysis {
  // Add debug logging
  console.log('Transforming AI response:', JSON.stringify(aiResponse, null, 2));

  const defaultAspect = {
    traits: [],
    examples: [],
    summary: 'Not available',
    intensity: 50
  };

  const result = {
    positivePersona: {
      personality_traits: transformAspect(aiResponse?.positivePersona?.personality_traits || defaultAspect),
      core_values: transformAspect(aiResponse?.positivePersona?.core_values || defaultAspect),
      behavioral_traits: transformAspect(aiResponse?.positivePersona?.behavioral_traits || defaultAspect),
      hobbies_interests: transformAspect(aiResponse?.positivePersona?.hobbies_interests || defaultAspect)
    },
    negativePersona: {
      emotional_aspects: transformAspect(aiResponse?.negativePersona?.emotional_aspects || defaultAspect),
      social_aspects: transformAspect(aiResponse?.negativePersona?.social_aspects || defaultAspect),
      lifestyle_aspects: transformAspect(aiResponse?.negativePersona?.lifestyle_aspects || defaultAspect),
      relational_aspects: transformAspect(aiResponse?.negativePersona?.relational_aspects || defaultAspect)
    }
  };

  // Add debug logging for the result
  console.log('Transformed result:', JSON.stringify(result, null, 2));

  return result;
}

function transformAIResponseToCompatibilityScore(aiResponse: any): CompatibilityScore {
  console.log('Raw AI response:', aiResponse);
  const score = {
    overall: Math.round(Number(aiResponse.overall_score)) || 0,
    emotional: Math.round(Number(aiResponse.emotional_score)) || 0,
    intellectual: Math.round(Number(aiResponse.intellectual_score)) || 0,
    lifestyle: Math.round(Number(aiResponse.lifestyle_score)) || 0,
    summary: aiResponse.summary || '',
    strengths: aiResponse.strengths || [],
    challenges: aiResponse.challenges || [],
    tips: aiResponse.tips || [],
    long_term_prediction: aiResponse.long_term_prediction || ''
  };
  console.log('Transformed compatibility score:', score);
  return score;
}

function transformAspect(aspect: any): PersonaAspect {
  return {
    traits: aspect?.traits || [],
    examples: aspect?.examples || [],
    summary: aspect?.summary || null,
    intensity: aspect?.intensity
  };
}

export const generateAIPersona = generateDetailedPersonaAnalysis;
export const generateNegativePersona = async (profile: UserProfile): Promise<PersonaAnalysis | null> => {
  return generateDetailedPersonaAnalysis(profile, { messages: [], aiChat: [] });
};
export const analyzeCompatibility = analyzeDetailedCompatibility;

export default {
  generatePersonaAnalysis,
  generateDetailedPersonaAnalysis,
  analyzeDetailedCompatibility
};