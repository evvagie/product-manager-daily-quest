
-- Add last_streak_update column to track when streak was last calculated
ALTER TABLE public.users 
ADD COLUMN last_streak_update DATE DEFAULT CURRENT_DATE;

-- Create function to calculate realistic streak based on actual session activity
CREATE OR REPLACE FUNCTION public.calculate_realistic_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_dates DATE[];
    current_streak INTEGER := 0;
    check_date DATE;
    prev_date DATE;
    gap_days INTEGER;
    i INTEGER;
BEGIN
    -- Get all unique session dates for the user (only completed sessions)
    SELECT ARRAY_AGG(DISTINCT date ORDER BY date DESC)
    INTO session_dates
    FROM public.sessions 
    WHERE user_id = user_uuid AND session_complete = true;
    
    -- If no sessions, streak is 0
    IF session_dates IS NULL OR array_length(session_dates, 1) = 0 THEN
        RETURN 0;
    END IF;
    
    -- Start with the most recent session date
    check_date := session_dates[1];
    
    -- If the most recent session is not today or yesterday, check gap from today
    gap_days := CURRENT_DATE - check_date;
    
    -- If gap is more than 1 day from today, reset streak
    IF gap_days > 1 THEN
        RETURN 0;
    END IF;
    
    -- Count consecutive days working backwards
    current_streak := 1; -- Start with 1 for the most recent session
    
    FOR i IN 2..array_length(session_dates, 1) LOOP
        prev_date := session_dates[i];
        gap_days := check_date - prev_date;
        
        -- If exactly 1 day gap, continue streak (freeze logic)
        IF gap_days = 1 THEN
            current_streak := current_streak + 1;
            check_date := prev_date;
        -- If exactly 2 days gap, freeze at current value (1 day missed)
        ELSIF gap_days = 2 THEN
            check_date := prev_date;
            -- Don't increment streak, but continue checking
        -- If more than 2 days gap, break the streak
        ELSIF gap_days > 2 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN current_streak;
END;
$$;

-- Create function to update user streak safely
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_streak INTEGER;
    last_update DATE;
BEGIN
    -- Get current last update date
    SELECT last_streak_update INTO last_update
    FROM public.users
    WHERE id = user_uuid;
    
    -- Only update once per day
    IF last_update = CURRENT_DATE THEN
        SELECT streak INTO new_streak
        FROM public.users
        WHERE id = user_uuid;
        RETURN new_streak;
    END IF;
    
    -- Calculate new realistic streak
    new_streak := calculate_realistic_streak(user_uuid);
    
    -- Update user streak and last update date
    UPDATE public.users
    SET streak = new_streak,
        last_streak_update = CURRENT_DATE
    WHERE id = user_uuid;
    
    RETURN new_streak;
END;
$$;
