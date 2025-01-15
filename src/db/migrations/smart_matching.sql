-- Create favorite_profiles table
CREATE TABLE IF NOT EXISTS favorite_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, favorite_user_id)
);

-- Create match_requests table
CREATE TABLE IF NOT EXISTS match_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('PERSONA_VIEW', 'CHAT')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create relationship_insights table
CREATE TABLE IF NOT EXISTS relationship_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('VIEWING', 'CHATTING', 'DATING', 'ENDED')),
  compatibility_score NUMERIC CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  interaction_metrics JSONB DEFAULT '{"chat_frequency": 0, "response_time": 0, "engagement_level": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, partner_id)
);

-- Add RLS policies
ALTER TABLE favorite_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_insights ENABLE ROW LEVEL SECURITY;

-- Policies for favorite_profiles
CREATE POLICY "Users can view their own favorite profiles"
  ON favorite_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorite profiles"
  ON favorite_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorite profiles"
  ON favorite_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for match_requests
CREATE POLICY "Users can view their own sent or received requests"
  ON match_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can create their own requests"
  ON match_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update requests they're involved in"
  ON match_requests FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- Policies for relationship_insights
CREATE POLICY "Users can view their own relationship insights"
  ON relationship_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own relationship insights"
  ON relationship_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own relationship insights"
  ON relationship_insights FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_favorite_profiles_user_id ON favorite_profiles(user_id);
CREATE INDEX idx_match_requests_requester_id ON match_requests(requester_id);
CREATE INDEX idx_match_requests_target_id ON match_requests(target_id);
CREATE INDEX idx_match_requests_status ON match_requests(status);
CREATE INDEX idx_relationship_insights_user_id ON relationship_insights(user_id);
CREATE INDEX idx_relationship_insights_partner_id ON relationship_insights(partner_id); 