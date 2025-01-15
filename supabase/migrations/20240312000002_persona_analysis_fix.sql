-- Create table for persona aspects
CREATE TABLE IF NOT EXISTS persona_aspects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aspect_type TEXT NOT NULL CHECK (
    aspect_type IN (
      'personality_traits',
      'core_values',
      'behavioral_traits',
      'hobbies_interests',
      'emotional_aspects',
      'social_aspects',
      'lifestyle_aspects',
      'relational_aspects'
    )
  ),
  traits JSONB DEFAULT '[]'::jsonb,
  examples JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  intensity INTEGER CHECK (intensity >= 0 AND intensity <= 100),
  is_positive BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, aspect_type)
);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_persona_aspects_updated_at
  BEFORE UPDATE ON persona_aspects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS and create policies
ALTER TABLE persona_aspects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own persona aspects"
  ON persona_aspects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own persona aspects"
  ON persona_aspects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own persona aspects"
  ON persona_aspects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_persona_aspects_user_id ON persona_aspects(user_id);
CREATE INDEX idx_persona_aspects_type ON persona_aspects(aspect_type);
CREATE INDEX idx_persona_aspects_is_positive ON persona_aspects(is_positive); 