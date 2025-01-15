-- Add profile_image column to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS profile_image TEXT DEFAULT NULL;

-- Update RLS policies to allow access to profile_image
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.user_profiles;

CREATE POLICY "Enable all for authenticated users"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 