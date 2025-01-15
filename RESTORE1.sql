-- RESTORE POINT 1 - Database Schema
-- Run this script to restore the database to this point

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.ai_personas;
DROP TABLE IF EXISTS public.personality_analysis;
DROP TABLE IF EXISTS public.user_profiles;

-- Create user_profiles table with correct column names
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    fullname TEXT,
    age INTEGER,
    gender TEXT,
    location TEXT,
    occupation TEXT,
    relationship_history TEXT,
    lifestyle TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    cupid_id VARCHAR(6) UNIQUE DEFAULT NULL
);

-- Create personality_analysis table
CREATE TABLE public.personality_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}'::jsonb,
    psychological_profile JSONB DEFAULT '{}'::jsonb,
    relationship_goals JSONB DEFAULT '{}'::jsonb,
    behavioral_insights JSONB DEFAULT '{}'::jsonb,
    dealbreakers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Enable insert for service role"
    ON public.user_profiles FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for personality_analysis
CREATE POLICY "Enable insert for authenticated users"
    ON public.personality_analysis FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users"
    ON public.personality_analysis FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
    ON public.personality_analysis FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.personality_analysis TO authenticated;
  