-- Create positive personas table
CREATE TABLE IF NOT EXISTS public.positive_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    personality_traits JSONB DEFAULT '{"examples": []}',
    core_values JSONB DEFAULT '{"examples": []}',
    behavioral_traits JSONB DEFAULT '{"examples": []}',
    hobbies_interests JSONB DEFAULT '{"examples": []}',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create negative personas table
CREATE TABLE IF NOT EXISTS public.negative_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emotional_weaknesses JSONB DEFAULT '{"traits": []}',
    social_weaknesses JSONB DEFAULT '{"traits": []}',
    lifestyle_weaknesses JSONB DEFAULT '{"traits": []}',
    relational_weaknesses JSONB DEFAULT '{"traits": []}',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.positive_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negative_personas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own positive persona"
    ON public.positive_personas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own positive persona"
    ON public.positive_personas FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own positive persona"
    ON public.positive_personas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own positive persona"
    ON public.positive_personas FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own negative persona"
    ON public.negative_personas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own negative persona"
    ON public.negative_personas FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own negative persona"
    ON public.negative_personas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own negative persona"
    ON public.negative_personas FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS positive_personas_user_id_idx ON public.positive_personas(user_id);
CREATE INDEX IF NOT EXISTS negative_personas_user_id_idx ON public.negative_personas(user_id); 