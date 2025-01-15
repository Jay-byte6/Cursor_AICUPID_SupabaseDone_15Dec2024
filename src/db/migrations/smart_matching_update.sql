-- Create match_requests table if it doesn't exist (moved from previous migration)
CREATE TABLE IF NOT EXISTS match_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('PERSONA_VIEW', 'CHAT')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add notification preferences to user_profiles (preserving existing data)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "request_received": true,
  "request_approved": true,
  "request_expired": true,
  "new_message": true,
  "new_match": true
}'::jsonb;

-- Add matching preferences to user_profiles (preserving existing data)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS matching_preferences JSONB DEFAULT '{
  "min_age": null,
  "max_age": null,
  "preferred_distance": null,
  "preferred_languages": [],
  "education_level": null,
  "relationship_type": null,
  "deal_breakers": []
}'::jsonb;

-- Add visibility settings to user_profiles if not exists
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS visibility_settings JSONB DEFAULT '{
  "smart_matching_visible": true,
  "profile_image_visible": true,
  "occupation_visible": true,
  "contact_visible": true,
  "master_visibility": true
}'::jsonb;

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('REQUEST_RECEIVED', 'REQUEST_APPROVED', 'REQUEST_EXPIRED', 'NEW_MESSAGE', 'NEW_MATCH')),
  content JSONB NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policy for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Create function to handle notification creation
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_content JSONB
) RETURNS notifications AS $$
DECLARE
  v_notification notifications;
BEGIN
  INSERT INTO notifications (user_id, type, content)
  VALUES (p_user_id, p_type, p_content)
  RETURNING * INTO v_notification;
  
  RETURN v_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add expiration trigger for match requests
CREATE OR REPLACE FUNCTION expire_old_requests() RETURNS trigger AS $$
BEGIN
  UPDATE match_requests
  SET status = 'EXPIRED'
  WHERE status = 'PENDING'
    AND created_at < NOW() - INTERVAL '30 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run daily
CREATE OR REPLACE FUNCTION create_expire_requests_trigger() RETURNS void AS $$
BEGIN
  -- Drop if exists to avoid errors
  DROP TRIGGER IF EXISTS expire_requests_trigger ON match_requests;
  
  CREATE TRIGGER expire_requests_trigger
    AFTER INSERT OR UPDATE ON match_requests
    EXECUTE FUNCTION expire_old_requests();
END;
$$ LANGUAGE plpgsql;

-- Create trigger for match request notifications
CREATE OR REPLACE FUNCTION notify_match_request() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'PENDING' THEN
    -- Notify target user of new request
    PERFORM create_notification(
      NEW.target_id,
      'REQUEST_RECEIVED',
      jsonb_build_object(
        'request_id', NEW.id,
        'requester_id', NEW.requester_id,
        'request_type', NEW.request_type
      )
    );
  ELSIF NEW.status = 'APPROVED' THEN
    -- Notify requester of approval
    PERFORM create_notification(
      NEW.requester_id,
      'REQUEST_APPROVED',
      jsonb_build_object(
        'request_id', NEW.id,
        'target_id', NEW.target_id,
        'request_type', NEW.request_type
      )
    );
  ELSIF NEW.status = 'EXPIRED' THEN
    -- Notify both users of expiration
    PERFORM create_notification(
      NEW.requester_id,
      'REQUEST_EXPIRED',
      jsonb_build_object(
        'request_id', NEW.id,
        'target_id', NEW.target_id,
        'request_type', NEW.request_type
      )
    );
    
    PERFORM create_notification(
      NEW.target_id,
      'REQUEST_EXPIRED',
      jsonb_build_object(
        'request_id', NEW.id,
        'requester_id', NEW.requester_id,
        'request_type', NEW.request_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers after all functions are defined
SELECT create_expire_requests_trigger();

DROP TRIGGER IF EXISTS match_request_notification_trigger ON match_requests;
CREATE TRIGGER match_request_notification_trigger
  AFTER INSERT OR UPDATE OF status ON match_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_match_request();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add Stream Chat user ID to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS stream_chat_token TEXT;

-- Add RLS policies for match_requests if not exists
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'match_requests' AND policyname = 'Users can view their own sent or received requests'
  ) THEN
    CREATE POLICY "Users can view their own sent or received requests"
      ON match_requests FOR SELECT
      USING (auth.uid() = requester_id OR auth.uid() = target_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'match_requests' AND policyname = 'Users can create their own requests'
  ) THEN
    CREATE POLICY "Users can create their own requests"
      ON match_requests FOR INSERT
      WITH CHECK (auth.uid() = requester_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'match_requests' AND policyname = 'Users can update requests they are involved in'
  ) THEN
    CREATE POLICY "Users can update requests they are involved in"
      ON match_requests FOR UPDATE
      USING (auth.uid() = requester_id OR auth.uid() = target_id);
  END IF;
END $$;