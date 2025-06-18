
-- Create exercise_scores table to store detailed scoring information
CREATE TABLE public.exercise_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id TEXT NOT NULL,
  challenge_session_id TEXT NOT NULL,
  question_title TEXT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  score_percentage INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on exercise_scores
ALTER TABLE public.exercise_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for exercise_scores
CREATE POLICY "Users can view their own exercise scores" 
  ON public.exercise_scores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise scores" 
  ON public.exercise_scores 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_exercise_scores_user_session ON public.exercise_scores(user_id, challenge_session_id);
CREATE INDEX idx_exercise_scores_user_date ON public.exercise_scores(user_id, completion_date DESC);
