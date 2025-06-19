
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

interface UseThirdPersonalizedRecommendationParams {
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
  secondAIRecommendationType?: string;
  triggerGeneration?: boolean;
}

export const useThirdPersonalizedRecommendation = ({
  skillArea,
  difficulty,
  performanceScore,
  exerciseScores,
  totalExercises,
  firstAIRecommendationType,
  secondAIRecommendationType,
  triggerGeneration = false
}: UseThirdPersonalizedRecommendationParams) => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !triggerGeneration || exerciseScores.length === 0) return;

    const fetchThirdPersonalizedRecommendation = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching third personalized recommendation for:', { skillArea, difficulty, performanceScore });
        
        const excludeTypes = [firstAIRecommendationType, secondAIRecommendationType].filter(Boolean);
        
        const { data, error: generateError } = await supabase.functions.invoke(
          'generate-personalized-recommendation',
          {
            body: {
              skillArea,
              difficulty,
              performanceScore,
              exerciseScores,
              totalExercises,
              excludeTypes,
              isThirdRecommendation: true
            }
          }
        );

        if (generateError) {
          console.error('Error generating third personalized recommendation:', generateError);
          throw generateError;
        }

        if (data?.recommendation) {
          setRecommendation(data.recommendation);
        }
      } catch (err: any) {
        console.error('Error in third personalized recommendation hook:', err);
        setError(err.message || 'Failed to generate third personalized recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchThirdPersonalizedRecommendation();
  }, [user, skillArea, difficulty, performanceScore, triggerGeneration, exerciseScores.length, firstAIRecommendationType, secondAIRecommendationType]);

  return { recommendation, loading, error };
};
