
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedRecommendation {
  title: string;
  author_speaker: string;
  description: string;
  source_url: string;
  recommendation_type: string;
}

interface UsePersonalizedRecommendationParams {
  skillArea: string;
  difficulty: string;
  performanceScore: number;
  exerciseScores: Array<{
    questionTitle: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    score: number;
  }>;
  totalExercises: number;
  triggerGeneration?: boolean;
}

export const usePersonalizedRecommendation = ({
  skillArea,
  difficulty,
  performanceScore,
  exerciseScores,
  totalExercises,
  triggerGeneration = false
}: UsePersonalizedRecommendationParams) => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !triggerGeneration || exerciseScores.length === 0) return;

    const fetchPersonalizedRecommendation = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching personalized recommendation for:', { skillArea, difficulty, performanceScore });
        
        const { data, error: generateError } = await supabase.functions.invoke(
          'generate-personalized-recommendation',
          {
            body: {
              skillArea,
              difficulty,
              performanceScore,
              exerciseScores,
              totalExercises
            }
          }
        );

        if (generateError) {
          console.error('Error generating personalized recommendation:', generateError);
          throw generateError;
        }

        if (data?.recommendation) {
          setRecommendation(data.recommendation);
        }
      } catch (err: any) {
        console.error('Error in personalized recommendation hook:', err);
        setError(err.message || 'Failed to generate personalized recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedRecommendation();
  }, [user, skillArea, difficulty, performanceScore, triggerGeneration, exerciseScores.length]);

  return { recommendation, loading, error };
};
