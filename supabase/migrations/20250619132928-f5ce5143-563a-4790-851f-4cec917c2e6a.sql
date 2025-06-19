
-- Fix the update_user_streak function to always recalculate (remove daily limitation)
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_streak INTEGER;
BEGIN
    -- Always calculate new realistic streak (remove daily limitation)
    new_streak := calculate_realistic_streak(user_uuid);
    
    -- Update user streak and last update date
    UPDATE public.users
    SET streak = new_streak,
        last_streak_update = CURRENT_DATE
    WHERE id = user_uuid;
    
    RETURN new_streak;
END;
$$;

-- Create a function to automatically update streak when session is completed
CREATE OR REPLACE FUNCTION public.handle_session_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only update streak if session was marked as complete
    IF NEW.session_complete = true AND (OLD.session_complete IS NULL OR OLD.session_complete = false) THEN
        PERFORM update_user_streak(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically update streak when session is completed
DROP TRIGGER IF EXISTS on_session_completed ON public.sessions;
CREATE TRIGGER on_session_completed
    AFTER INSERT OR UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_session_completion();

-- Create a function to manually refresh all user streaks (for fixing existing data)
CREATE OR REPLACE FUNCTION public.refresh_all_streaks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Update streak for all users
    FOR user_record IN SELECT id FROM public.users LOOP
        PERFORM update_user_streak(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$;

-- Manually refresh the current user's streak to fix the immediate issue
SELECT update_user_streak('2ec2604b-db24-48bc-b558-aeaed1b60565');
