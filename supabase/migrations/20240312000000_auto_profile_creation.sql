-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations for service_role" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can create user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.personality_analysis;

-- Disable RLS temporarily
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_analysis DISABLE ROW LEVEL SECURITY;

-- Enable RLS with new policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Enable all for authenticated users"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for personality_analysis
CREATE POLICY "Enable all for authenticated users"
ON public.personality_analysis
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.personality_analysis TO authenticated;
GRANT ALL ON public.personality_analysis TO service_role;