
-- Create challenge_history table to track completed challenges
CREATE TABLE public.challenge_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  skill_area TEXT NOT NULL CHECK (skill_area IN ('strategy', 'research', 'analytics', 'design')),
  challenge_type TEXT NOT NULL,
  challenge_title TEXT NOT NULL,
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score INTEGER,
  time_taken INTEGER, -- in seconds
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge_metadata table to store available challenges per category
CREATE TABLE public.challenge_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_area TEXT NOT NULL CHECK (skill_area IN ('strategy', 'research', 'analytics', 'design')),
  total_challenges INTEGER NOT NULL DEFAULT 300,
  challenge_types JSONB NOT NULL DEFAULT '["time-bomb", "stakeholder-tension", "trade-off-slider", "post-mortem", "resource-allocator", "dialogue-tree", "retrospective-fix"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(skill_area)
);

-- Enable RLS on challenge_history
ALTER TABLE public.challenge_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for challenge_history
CREATE POLICY "Users can view their own challenge history" 
  ON public.challenge_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenge history" 
  ON public.challenge_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on challenge_metadata (read-only for all authenticated users)
ALTER TABLE public.challenge_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view challenge metadata" 
  ON public.challenge_metadata 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Seed the challenge_metadata table with initial data
INSERT INTO public.challenge_metadata (skill_area, total_challenges) VALUES
  ('strategy', 300),
  ('research', 300),
  ('analytics', 300),
  ('design', 300);
