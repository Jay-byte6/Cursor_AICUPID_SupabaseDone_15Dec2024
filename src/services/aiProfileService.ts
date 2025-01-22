import axios from 'axios';

interface AIProfileImageOptions {
  gender?: 'male' | 'female';
  age?: number;
  style?: 'professional' | 'casual' | 'artistic';
}

const generateAIProfileImage = async (options: AIProfileImageOptions = {}): Promise<string> => {
  try {
    // Using Leonardo.ai API for realistic profile pictures
    const API_KEY = import.meta.env.VITE_LEONARDO_API_KEY;
    const API_URL = 'https://cloud.leonardo.ai/api/rest/v1/generations';

    const prompt = constructImagePrompt(options);
    
    const response = await axios.post(API_URL, {
      prompt,
      modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo Creative
      width: 512,
      height: 512,
      num_images: 1,
      promptMagic: true,
      photoReal: true,
      guidance_scale: 7,
      negative_prompt: "cartoon, anime, illustration, deformed, distorted, disfigured, watermark"
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.generations?.[0]?.url) {
      return response.data.generations[0].url;
    }
    
    throw new Error('Failed to generate image');
  } catch (error) {
    console.error('Error generating AI profile image:', error);
    return getDefaultProfileImage(options);
  }
};

const constructImagePrompt = (options: AIProfileImageOptions): string => {
  const { gender = 'male', age = 25, style = 'professional' } = options;
  
  const basePrompt = `A professional headshot portrait of a ${age} year old ${gender}, `;
  
  const stylePrompts = {
    professional: "wearing business attire, confident pose, studio lighting, high-end photography, linkedin style",
    casual: "casual attire, natural smile, outdoor lighting, friendly appearance",
    artistic: "creative lighting, artistic composition, modern setting, fashionable appearance"
  };
  
  return basePrompt + stylePrompts[style];
};

const getDefaultProfileImage = (options: AIProfileImageOptions): string => {
  // Return a URL to a default profile image based on gender
  const { gender = 'male' } = options;
  return gender === 'male' 
    ? 'https://your-cdn.com/default-male-profile.jpg'
    : 'https://your-cdn.com/default-female-profile.jpg';
};

export const aiProfileService = {
  generateAIProfileImage
};

export default aiProfileService; 