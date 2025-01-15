-- Drop the column if it exists to ensure clean migration
ALTER TABLE user_profiles DROP COLUMN IF EXISTS visibility_settings;

-- Add visibility_settings column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN visibility_settings JSONB DEFAULT jsonb_build_object(
  'profile_visible', true,
  'profile_image_visible', true,
  'persona_visible', true,
  'location_visible', true,
  'occupation_visible', true,
  'age_visible', true,
  'interests_visible', true
);

-- Update existing rows with default visibility settings
UPDATE user_profiles
SET visibility_settings = jsonb_build_object(
  'profile_visible', true,
  'profile_image_visible', true,
  'persona_visible', true,
  'location_visible', true,
  'occupation_visible', true,
  'age_visible', true,
  'interests_visible', true
)
WHERE visibility_settings IS NULL; 