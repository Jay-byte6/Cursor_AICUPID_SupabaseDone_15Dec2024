import { generateAIPersona, generateNegativePersona } from './openai';
import { profileService } from './supabaseService';

export async function testPersonaGeneration(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('Starting test persona generation for user:', userId);

  // Sample user profile data
  const sampleProfile = {
    fullname: "Jay Smith",
    age: 28,
    gender: "Male",
    location: "New York",
    occupation: "Software Engineer",
    relationship_history: "Previously in a long-term relationship",
    lifestyle: "Active, health-conscious",
    user_id: userId
  };

  // Sample personality analysis data
  const sampleAnalysis = {
    preferences: {
      interests: ["Technology", "Fitness", "Travel", "Reading"],
      minAge: 25,
      maxAge: 35,
      preferredDistance: "Within 30 miles",
      educationPreference: "Bachelor's degree or higher"
    },
    psychological_profile: {
      extroversion: 0.7,
      openness: 0.85,
      agreeableness: 0.75,
      conscientiousness: 0.8,
      emotionalStability: 0.75,
      communicationStyle: "Direct and honest",
      conflictResolution: "Collaborative problem-solving"
    },
    relationship_goals: {
      relationshipType: "Long-term partnership",
      timeline: "Ready for commitment",
      familyPlans: "Wants children in the future",
      relationshipValues: "Trust, growth, and mutual support"
    },
    behavioral_insights: {
      loveLanguage: "Quality Time",
      socialBattery: "Balanced introvert/extrovert",
      stressResponse: "Seeks solutions through communication",
      decisionMaking: "Analytical but considers emotions"
    },
    dealbreakers: {
      dealbreakers: [
        "Dishonesty",
        "Lack of ambition",
        "Poor communication"
      ],
      dealbreakersFlexibility: "Moderate"
    }
  };

  try {
    console.log("Starting AI persona generation test...");
    
    // Generate positive AI persona
    console.log("Generating positive AI persona...");
    const aiPersona = await generateAIPersona(sampleProfile);
    
    if (!aiPersona) {
      throw new Error('Generated AI persona is empty');
    }

    console.log("AI Persona generated successfully:", aiPersona);

    // Generate negative AI persona
    console.log("Generating negative AI persona...");
    const negativePersona = await generateNegativePersona(sampleProfile);

    if (!negativePersona) {
      throw new Error('Generated negative persona is empty');
    }

    console.log("Negative persona generated successfully:", negativePersona);

    // Store both personas in Supabase
    console.log("Storing personas in Supabase...");
    
    const [storedPositivePersona, storedNegativePersona] = await Promise.all([
      profileService.savePositivePersona(userId, {
        ...aiPersona,
        user_id: userId,
        updated_at: new Date().toISOString()
      }),
      profileService.saveNegativePersona(userId, {
        ...negativePersona,
        user_id: userId,
        updated_at: new Date().toISOString()
      })
    ]);
    
    if (!storedPositivePersona || !storedNegativePersona) {
      throw new Error('Failed to store personas in database');
    }

    console.log("Personas stored successfully");
    
    return {
      success: true,
      generatedPersona: aiPersona,
      storedPersona: storedPositivePersona,
      generatedNegativePersona: negativePersona,
      storedNegativePersona: storedNegativePersona
    };
  } catch (error) {
    console.error("Error in persona generation test:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Detailed error:", errorMessage);
    return {
      success: false,
      error: errorMessage
    };
  }
} 