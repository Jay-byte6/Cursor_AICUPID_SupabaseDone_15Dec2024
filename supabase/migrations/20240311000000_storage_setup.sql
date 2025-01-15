-- Skip bucket creation since it already exists
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('user-content', 'user-content', true);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow public access to profile pictures
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'user-content' AND (storage.foldername(name))[1] = 'profile-pictures');

-- Allow users to update/delete their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'user-content' AND
  (storage.foldername(name))[1] = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[2]
); 