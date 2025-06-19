
-- Create table for daily AI-generated recommendations
CREATE TABLE public.daily_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('book', 'ted_talk', 'article', 'podcast', 'course')),
  title TEXT NOT NULL,
  author_speaker TEXT NOT NULL,
  description TEXT NOT NULL,
  source_url TEXT,
  skill_area TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  performance_context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, recommendation_type, title)
);

-- Add Row Level Security
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own recommendations
CREATE POLICY "Users can view their own recommendations" 
  ON public.daily_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for system to insert recommendations
CREATE POLICY "System can create recommendations" 
  ON public.daily_recommendations 
  FOR INSERT 
  WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_daily_recommendations_user_date ON public.daily_recommendations(user_id, date);
CREATE INDEX idx_daily_recommendations_skill_area ON public.daily_recommendations(skill_area);
