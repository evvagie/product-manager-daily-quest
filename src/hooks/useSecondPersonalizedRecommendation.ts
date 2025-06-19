
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

interface UseSecondPersonalizedRecommendationParams {
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
  firstAIRecommendationType?: string;
  triggerGeneration?: boolean;
}

export const useSecondPersonalizedRecommendation = ({
  skillArea,
  difficulty,
  performanceScore,
  exerciseScores,
  totalExercises,
  firstAIRecommendationType,
  triggerGeneration = false
}: UseSecondPersonalizedRecommendationParams) => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !triggerGeneration || exerciseScores.length === 0) return;

    const fetchSecondPersonalizedRecommendation = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching second personalized recommendation for:', { skillArea, difficulty, performanceScore });
        
        const { data, error: generateError } = await supabase.functions.invoke(
          'generate-personalized-recommendation',
          {
            body: {
              skillArea,
              difficulty,
              performanceScore,
              exerciseScores,
              totalExercises,
              excludeType: firstAIRecommendationType,
              isSecondRecommendation: true
            }
          }
        );

        if (generateError) {
          console.error('Error generating second personalized recommendation:', generateError);
          throw generateError;
        }

        if (data?.recommendation) {
          setRecommendation(data.recommendation);
        }
      } catch (err: any) {
        console.error('Error in second personalized recommendation hook:', err);
        setError(err.message || 'Failed to generate second personalized recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchSecondPersonalizedRecommendation();
  }, [user, skillArea, difficulty, performanceScore, triggerGeneration, exerciseScores.length, firstAIRecommendationType]);

  return { recommendation, loading, error };
};
