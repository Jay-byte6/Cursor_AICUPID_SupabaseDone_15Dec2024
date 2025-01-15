-- Create profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT NOT NULL,
            age INTEGER,
            location TEXT,
            interests TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );

        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view all profiles"
            ON public.profiles FOR SELECT
            USING (true);

        CREATE POLICY "Users can update their own profile"
            ON public.profiles FOR UPDATE
            USING (auth.uid() = user_id);

        -- Create indexes
        CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
    END IF;
END $$;

-- Add personality_traits column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'smart_matches' 
                  AND column_name = 'personality_traits') THEN
        ALTER TABLE public.smart_matches 
        ADD COLUMN personality_traits TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Insert dummy profiles only if they don't exist
INSERT INTO public.profiles (id, user_id, full_name, age, location, interests, created_at)
SELECT 
    uuid_generate_v4(),
    auth.uid(),
    'Jay Shan',
    30,
    'Mumbai, India',
    ARRAY['Technology', 'Health', 'Nature', 'Travel'],
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE full_name = 'Jay Shan'
);

INSERT INTO public.profiles (id, user_id, full_name, age, location, interests, created_at)
SELECT 
    uuid_generate_v4(),
    auth.uid(),
    'Priya Sharma',
    27,
    'Mumbai, India',
    ARRAY['Nature', 'Travel', 'Wellness', 'Social Activities'],
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE full_name = 'Priya Sharma'
);

-- Insert dummy compatibility insights only if they don't exist
INSERT INTO public.smart_matches (
    id,
    user_id,
    target_user_id,
    compatibility_score,
    strengths,
    challenges,
    tips,
    long_term_prediction,
    personality_traits,
    created_at,
    last_updated
)
SELECT
    uuid_generate_v4(),
    p1.user_id,
    p2.user_id,
    0.85,
    ARRAY[
        'Shared Values: Both value honesty, loyalty, and family deeply',
        'Emotional Support: High emotional intelligence and nurturing nature',
        'Complementary Lifestyle Preferences: Disciplined and balanced approach',
        'Openness to Growth: Both open to new experiences'
    ],
    ARRAY[
        'Conflict Styles: Different approaches to resolution',
        'Idealism vs Reality: Expectations management needed',
        'Social Preferences: Varying needs for social interaction',
        'Sensitivity to Criticism: Need for gentle communication'
    ],
    ARRAY[
        'Practice active listening during disagreements',
        'Find balance in social activities',
        'Express appreciation in partner''s love language',
        'Schedule regular quality time',
        'Develop shared routines'
    ],
    'Jay Shan and Priya Sharma have a high compatibility score due to their shared values, complementary personality traits, and common relationship goals. However, some challenges need attention to ensure a long-term harmonious married life.',
    ARRAY['Creative', 'Ambitious', 'Empathetic'],
    NOW(),
    NOW()
FROM public.profiles p1
CROSS JOIN public.profiles p2
WHERE p1.full_name = 'Jay Shan' 
AND p2.full_name = 'Priya Sharma'
AND NOT EXISTS (
    SELECT 1 FROM public.smart_matches 
    WHERE user_id = p1.user_id 
    AND target_user_id = p2.user_id
); 