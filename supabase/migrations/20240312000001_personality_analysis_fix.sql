-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.ai_personas;
DROP TABLE IF EXISTS public.personality_analysis;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create user_profiles table first
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT,
    fullname TEXT,
    age INTEGER,
    gender TEXT,
    location TEXT,
    occupation TEXT,
    relationship_history TEXT,
    lifestyle TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    cupid_id VARCHAR(12) UNIQUE DEFAULT NULL
);

-- Create personality_analysis table with proper foreign key
CREATE TABLE IF NOT EXISTS public.personality_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb,
    psychological_profile JSONB DEFAULT '{}'::jsonb,
    relationship_goals JSONB DEFAULT '{}'::jsonb,
    behavioral_insights JSONB DEFAULT '{}'::jsonb,
    dealbreakers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create ai_personas table
CREATE TABLE public.ai_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    persona_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_personas ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Enable all operations for own profile"
    ON public.user_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for personality_analysis
CREATE POLICY "Enable all operations for own analysis"
    ON public.personality_analysis
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for ai_personas
CREATE POLICY "Enable all operations for own persona"
    ON public.ai_personas
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.personality_analysis TO authenticated;
GRANT ALL ON public.personality_analysis TO service_role;
GRANT ALL ON public.ai_personas TO authenticated;
GRANT ALL ON public.ai_personas TO service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_analysis_user_id ON public.personality_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_analysis_profile_id ON public.personality_analysis(profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_personas_user_id ON public.ai_personas(user_id);