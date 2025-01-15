-- Create favorite_profiles table
CREATE TABLE IF NOT EXISTS public.favorite_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, favorite_user_id)
);

-- Enable RLS on favorite_profiles
ALTER TABLE public.favorite_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for favorite_profiles
CREATE POLICY "Users can manage their own favorites"
  ON public.favorite_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  room_id TEXT PRIMARY KEY,
  participants TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_rooms
CREATE POLICY "Users can view their chat rooms"
  ON chat_rooms
  FOR SELECT
  USING (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can create chat rooms they're part of"
  ON chat_rooms
  FOR INSERT
  WITH CHECK (auth.uid()::text = ANY(participants));

-- Create policies for messages
CREATE POLICY "Users can view messages in their chat rooms"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.room_id = messages.room_id
      AND auth.uid()::text = ANY(participants)
    )
  );

CREATE POLICY "Users can send messages to their chat rooms"
  ON messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.room_id = messages.room_id
      AND auth.uid()::text = ANY(participants)
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_participants ON chat_rooms USING GIN (participants);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at); 