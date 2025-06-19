
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

  // Create a unique session key based on session data
  const sessionKey = `personalized_rec_2_${user?.id}_${skillArea}_${difficulty}_${performanceScore}_${totalExercises}_${exerciseScores.length}_${firstAIRecommendationType || 'none'}`;

  useEffect(() => {
    if (!user || !triggerGeneration || exerciseScores.length === 0) return;

    // Check sessionStorage first
    const cachedRecommendation = sessionStorage.getItem(sessionKey);
    if (cachedRecommendation) {
      try {
        const parsed = JSON.parse(cachedRecommendation);
        setRecommendation(parsed);
        return;
      } catch (e) {
        console.error('Error parsing cached recommendation:', e);
        sessionStorage.removeItem(sessionKey);
      }
    }

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
          // Cache in sessionStorage
          sessionStorage.setItem(sessionKey, JSON.stringify(data.recommendation));
        }
      } catch (err: any) {
        console.error('Error in second personalized recommendation hook:', err);
        setError(err.message || 'Failed to generate second personalized recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchSecondPersonalizedRecommendation();
  }, [user, skillArea, difficulty, performanceScore, triggerGeneration, exerciseScores.length, firstAIRecommendationType, sessionKey]);

  return { recommendation, loading, error };
};
