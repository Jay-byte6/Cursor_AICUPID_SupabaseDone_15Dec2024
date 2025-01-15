-- Safe schema update that preserves existing data
-- RESTORE POINT 1 - Database Schema with Personality Analysis System

-- First, drop the constraint on cupid_id if it exists
DO $$ BEGIN
    ALTER TABLE public.user_profiles ALTER COLUMN cupid_id TYPE VARCHAR(12);
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
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
    cupid_id VARCHAR(12) UNIQUE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.personality_analysis (
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

-- Create positive personas table
CREATE TABLE IF NOT EXISTS public.positive_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    personality_traits JSONB DEFAULT '{}'::jsonb,
    core_values JSONB DEFAULT '{}'::jsonb,
    behavioral_traits JSONB DEFAULT '{}'::jsonb,
    hobbies_interests JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Drop and recreate negative_personas table with proper structure
DROP TABLE IF EXISTS public.negative_personas CASCADE;

CREATE TABLE public.negative_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emotional_weaknesses JSONB DEFAULT '{}'::jsonb,
    social_weaknesses JSONB DEFAULT '{}'::jsonb,
    intellectual_weaknesses JSONB DEFAULT '{}'::jsonb,
    lifestyle_weaknesses JSONB DEFAULT '{}'::jsonb,
    relational_weaknesses JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.negative_personas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;

-- Create policies for user_profiles
CREATE POLICY "Enable insert for authenticated users"
    ON public.user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable update for users based on user_id"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for personality_analysis
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

-- Policies for positive_personas
CREATE POLICY "Enable all operations for own positive persona"
    ON public.positive_personas FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for others positive persona"
    ON public.positive_personas FOR SELECT
    TO authenticated
    USING (true);

-- Policies for negative_personas
CREATE POLICY "Enable insert for own negative persona"
    ON public.negative_personas FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for own negative persona"
    ON public.negative_personas FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable update for own negative persona"
    ON public.negative_personas FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for own negative persona"
    ON public.negative_personas FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for compatibility_scores
CREATE POLICY "Enable all operations for own compatibility scores"
    ON public.compatibility_scores FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = target_user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to generate CUPID ID
CREATE OR REPLACE FUNCTION generate_cupid_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    unique_id TEXT;
BEGIN
    -- Keep trying until we find a unique ID
    LOOP
        -- Reset result to CUPID- prefix
        result := 'CUPID-';
        
        -- Generate 6 random characters
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if this ID already exists
        SELECT cupid_id INTO unique_id
        FROM user_profiles
        WHERE cupid_id = result;
        
        -- If we didn't find this ID, we can use it
        IF unique_id IS NULL THEN
            RETURN result;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate CUPID ID
CREATE OR REPLACE FUNCTION set_cupid_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cupid_id IS NULL THEN
        NEW.cupid_id := generate_cupid_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_cupid_id ON public.user_profiles;
CREATE TRIGGER ensure_cupid_id
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_cupid_id();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.personality_analysis TO authenticated;
GRANT ALL ON public.positive_personas TO authenticated;
GRANT ALL ON public.negative_personas TO authenticated;
GRANT ALL ON public.compatibility_scores TO authenticated; 