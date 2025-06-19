
-- Create achievements table to define all possible achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'xp', 'level', 'streak', 'challenge', 'special'
  xp_required INTEGER DEFAULT NULL,
  level_required INTEGER DEFAULT NULL,
  streak_required INTEGER DEFAULT NULL,
  challenges_required INTEGER DEFAULT NULL,
  skill_areas_required TEXT[] DEFAULT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track unlocked achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Add Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for achievements (public read access)
CREATE POLICY "Anyone can view achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (true);

-- RLS policies for user_achievements (users can only see their own)
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Insert predefined achievements
INSERT INTO public.achievements (name, description, icon, category, xp_required, sort_order) VALUES
('First Steps', 'Complete your first challenge', '🏅', 'challenge', NULL, 1),
('Rookie', 'Earn your first 1,000 XP', '⭐', 'xp', 1000, 2),
('Rising Star', 'Reach 5,000 XP', '🌟', 'xp', 5000, 3),
('Expert', 'Accumulate 10,000 XP', '💎', 'xp', 10000, 4),
('Master', 'Achieve 25,000 XP', '👑', 'xp', 25000, 5),
('Legend', 'Reach 50,000 XP', '🏆', 'xp', 50000, 6),
('Champion', 'Accumulate 100,000 XP', '🥇', 'xp', 100000, 7);

INSERT INTO public.achievements (name, description, icon, category, level_required, sort_order) VALUES
('Associate', 'Reach PM2 level', '📈', 'level', 2, 10),
('Professional', 'Advance to PM4 level', '🎯', 'level', 4, 11),
('Director', 'Achieve PM6 level', '🚀', 'level', 6, 12),
('Executive', 'Reach PM8 level', '👨‍💼', 'level', 8, 13);

INSERT INTO public.achievements (name, description, icon, category, streak_required, sort_order) VALUES
('Getting Started', 'Maintain a 3-day streak', '🔥', 'streak', 3, 20),
('Week Warrior', 'Complete 7 days in a row', '🎪', 'streak', 7, 21),
('Consistency King', 'Achieve a 15-day streak', '⚡', 'streak', 15, 22),
('Dedication Master', 'Maintain a 30-day streak', '🎊', 'streak', 30, 23);

INSERT INTO public.achievements (name, description, icon, category, challenges_required, sort_order) VALUES
('Challenge Accepted', 'Complete 10 challenges', '🎲', 'challenge', 10, 30),
('Problem Solver', 'Finish 50 challenges', '🧩', 'challenge', 50, 31),
('Challenge Master', 'Complete 100 challenges', '🏅', 'challenge', 100, 32);

-- Function to check and grant achievements for a user
CREATE OR REPLACE FUNCTION public.check_and_grant_achievements(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_stats RECORD;
    achievement_record RECORD;
    new_achievements INTEGER := 0;
    total_challenges INTEGER := 0;
BEGIN
    -- Get user stats
    SELECT xp, level, streak INTO user_stats
    FROM public.users 
    WHERE id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Get total challenges completed
    SELECT COUNT(*) INTO total_challenges
    FROM public.challenge_history
    WHERE user_id = user_uuid;
    
    -- Check each achievement
    FOR achievement_record IN 
        SELECT a.* FROM public.achievements a
        WHERE a.id NOT IN (
            SELECT ua.achievement_id 
            FROM public.user_achievements ua 
            WHERE ua.user_id = user_uuid
        )
    LOOP
        -- Check if user qualifies for this achievement
        IF (achievement_record.xp_required IS NULL OR user_stats.xp >= achievement_record.xp_required) AND
           (achievement_record.level_required IS NULL OR user_stats.level >= achievement_record.level_required) AND
           (achievement_record.streak_required IS NULL OR user_stats.streak >= achievement_record.streak_required) AND
           (achievement_record.challenges_required IS NULL OR total_challenges >= achievement_record.challenges_required) THEN
            
            -- Grant the achievement
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (user_uuid, achievement_record.id)
            ON CONFLICT (user_id, achievement_id) DO NOTHING;
            
            IF FOUND THEN
                new_achievements := new_achievements + 1;
            END IF;
        END IF;
    END LOOP;
    
    RETURN new_achievements;
END;
$$;

-- Function to get user achievements with progress
CREATE OR REPLACE FUNCTION public.get_user_achievements_with_progress(user_uuid UUID)
RETURNS TABLE (
    achievement_id UUID,
    name TEXT,
    description TEXT,
    icon TEXT,
    category TEXT,
    is_unlocked BOOLEAN,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER,
    current_value INTEGER,
    required_value INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_stats RECORD;
    total_challenges INTEGER := 0;
BEGIN
    -- Get user stats
    SELECT xp, level, streak INTO user_stats
    FROM public.users 
    WHERE id = user_uuid;
    
    -- Get total challenges completed
    SELECT COUNT(*) INTO total_challenges
    FROM public.challenge_history
    WHERE user_id = user_uuid;
    
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.description,
        a.icon,
        a.category,
        ua.achievement_id IS NOT NULL as is_unlocked,
        ua.unlocked_at,
        CASE 
            WHEN ua.achievement_id IS NOT NULL THEN 100
            WHEN a.xp_required IS NOT NULL THEN LEAST(100, (user_stats.xp * 100 / a.xp_required))
            WHEN a.level_required IS NOT NULL THEN LEAST(100, (user_stats.level * 100 / a.level_required))
            WHEN a.streak_required IS NOT NULL THEN LEAST(100, (user_stats.streak * 100 / a.streak_required))
            WHEN a.challenges_required IS NOT NULL THEN LEAST(100, (total_challenges * 100 / a.challenges_required))
            ELSE 0
        END::INTEGER as progress_percentage,
        CASE 
            WHEN a.xp_required IS NOT NULL THEN user_stats.xp
            WHEN a.level_required IS NOT NULL THEN user_stats.level
            WHEN a.streak_required IS NOT NULL THEN user_stats.streak
            WHEN a.challenges_required IS NOT NULL THEN total_challenges
            ELSE 0
        END::INTEGER as current_value,
        CASE 
            WHEN a.xp_required IS NOT NULL THEN a.xp_required
            WHEN a.level_required IS NOT NULL THEN a.level_required
            WHEN a.streak_required IS NOT NULL THEN a.streak_required
            WHEN a.challenges_required IS NOT NULL THEN a.challenges_required
            ELSE 0
        END::INTEGER as required_value
    FROM public.achievements a
    LEFT JOIN public.user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = user_uuid
    ORDER BY a.sort_order, a.name;
END;
$$;

-- Trigger to automatically check achievements when user stats change
CREATE OR REPLACE FUNCTION public.handle_achievement_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check achievements when XP, level, or streak changes
    IF NEW.xp != OLD.xp OR NEW.level != OLD.level OR NEW.streak != OLD.streak THEN
        PERFORM check_and_grant_achievements(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_check_achievements
    AFTER UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_achievement_check();

-- Trigger to check achievements when challenges are completed
CREATE OR REPLACE FUNCTION public.handle_challenge_achievement_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM check_and_grant_achievements(NEW.user_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_check_challenge_achievements
    AFTER INSERT ON public.challenge_history
    FOR EACH ROW
    EXECUTE FUNCTION handle_challenge_achievement_check();
