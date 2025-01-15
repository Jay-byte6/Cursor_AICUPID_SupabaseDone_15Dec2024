-- Drop existing function if it exists
DROP FUNCTION IF EXISTS generate_unique_cupid_id();

-- Create function to generate alphanumeric CUPID ID
CREATE OR REPLACE FUNCTION generate_unique_cupid_id()
RETURNS VARCHAR(12) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(6) := '';
    i INTEGER := 0;
    done BOOLEAN;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        -- Generate a random 6-character string
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if it exists
        done := NOT EXISTS (
            SELECT 1 
            FROM user_profiles 
            WHERE cupid_id = 'CUPID-' || result
        );
    END LOOP;
    
    RETURN 'CUPID-' || result;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS ensure_cupid_id ON user_profiles;

-- Create trigger to automatically generate CUPID ID for new profiles
CREATE OR REPLACE FUNCTION set_cupid_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cupid_id IS NULL THEN
        NEW.cupid_id := generate_unique_cupid_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_cupid_id
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_cupid_id();

-- Update existing profiles without CUPID IDs
UPDATE user_profiles
SET cupid_id = generate_unique_cupid_id()
WHERE cupid_id IS NULL OR cupid_id NOT LIKE 'CUPID-%'; 