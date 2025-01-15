-- Insert dummy positive persona
INSERT INTO public.positive_personas (
    id,
    user_id,
    personality_traits,
    core_values,
    behavioral_traits,
    hobbies_interests,
    summary,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    auth.uid(),
    jsonb_build_object(
        'examples', 
        ARRAY[
            'Highly empathetic and understanding',
            'Natural leader with strong decision-making abilities',
            'Creative problem-solver',
            'Adaptable and resilient'
        ]
    ),
    jsonb_build_object(
        'examples',
        ARRAY[
            'Integrity and honesty',
            'Family-oriented',
            'Personal growth and learning',
            'Work-life balance'
        ]
    ),
    jsonb_build_object(
        'examples',
        ARRAY[
            'Excellent communicator',
            'Active listener',
            'Team player',
            'Goal-oriented'
        ]
    ),
    jsonb_build_object(
        'examples',
        ARRAY[
            'Cooking and culinary exploration',
            'Outdoor adventures',
            'Photography',
            'Reading and self-improvement'
        ]
    ),
    'A well-rounded individual with strong interpersonal skills and a passion for personal growth.',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.positive_personas WHERE user_id = auth.uid()
);

-- Insert dummy negative persona
INSERT INTO public.negative_personas (
    id,
    user_id,
    emotional_weaknesses,
    social_weaknesses,
    lifestyle_weaknesses,
    relational_weaknesses,
    summary,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    auth.uid(),
    jsonb_build_object(
        'traits',
        ARRAY[
            'Can be overly sensitive to criticism',
            'Occasional anxiety in high-pressure situations',
            'Tendency to overthink decisions'
        ]
    ),
    jsonb_build_object(
        'traits',
        ARRAY[
            'Sometimes reserved in large groups',
            'Can be too accommodating to others',
            'Occasional difficulty with public speaking'
        ]
    ),
    jsonb_build_object(
        'traits',
        ARRAY[
            'Perfectionist tendencies affecting work-life balance',
            'Sometimes struggles with time management',
            'Can be too focused on work'
        ]
    ),
    jsonb_build_object(
        'traits',
        ARRAY[
            'Takes time to open up emotionally',
            'Can be overly cautious in relationships',
            'Sometimes avoids confrontation'
        ]
    ),
    'Areas for growth include managing emotional sensitivity and finding better work-life balance.',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.negative_personas WHERE user_id = auth.uid()
); 