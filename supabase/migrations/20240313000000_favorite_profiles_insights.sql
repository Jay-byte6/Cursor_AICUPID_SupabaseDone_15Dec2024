-- Create favorite_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.favorite_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, favorite_user_id)
);

-- Add RLS policies for favorite_profiles
ALTER TABLE public.favorite_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorite profiles"
  ON public.favorite_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorite profiles"
  ON public.favorite_profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Create function to check favorites limit
CREATE OR REPLACE FUNCTION check_favorites_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM favorite_profiles WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum limit of 5 favorite profiles reached';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for favorites limit
DROP TRIGGER IF EXISTS check_favorites_limit_trigger ON favorite_profiles;
CREATE TRIGGER check_favorites_limit_trigger
  BEFORE INSERT ON favorite_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_favorites_limit();

-- Create table for storing detailed compatibility insights
CREATE TABLE IF NOT EXISTS public.compatibility_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL,
  summary TEXT NOT NULL,
  long_term_prediction TEXT NOT NULL,
  strengths JSONB NOT NULL,
  challenges JSONB NOT NULL,
  individual_challenges JSONB NOT NULL,
  improvement_tips JSONB NOT NULL,
  last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  needs_update BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, target_user_id)
);

-- Create function to update last_generated_at
CREATE OR REPLACE FUNCTION update_compatibility_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_compatibility_timestamp_trigger ON compatibility_insights;
CREATE TRIGGER update_compatibility_timestamp_trigger
  BEFORE UPDATE ON compatibility_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_compatibility_timestamp();

-- Add RLS policies for compatibility_insights
ALTER TABLE public.compatibility_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own compatibility insights"
  ON public.compatibility_insights
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can insert their own compatibility insights"
  ON public.compatibility_insights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compatibility insights"
  ON public.compatibility_insights
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create notification type for compatibility updates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'notification_type' 
  ) THEN
    CREATE TYPE notification_type AS ENUM (
      'MATCH_REQUEST',
      'CHAT_INVITE',
      'COMPATIBILITY_UPDATE',
      'PROFILE_VIEW'
    );
  ELSE
    ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'COMPATIBILITY_UPDATE';
  END IF;
END $$; 