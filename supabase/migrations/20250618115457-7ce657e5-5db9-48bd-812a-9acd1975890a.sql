
-- Reset last_streak_update to force recalculation on next dashboard load
UPDATE public.users 
SET last_streak_update = NULL 
WHERE last_streak_update = CURRENT_DATE;

-- Alternatively, we could set it to yesterday to force immediate recalculation
-- UPDATE public.users 
-- SET last_streak_update = CURRENT_DATE - INTERVAL '1 day' 
-- WHERE last_streak_update = CURRENT_DATE;
