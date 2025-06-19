
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Recommendation {
  id: string;
  recommendation_type: string;
  title: string;
  author_speaker: string;
  description: string;
  source_url: string | null;
  skill_area: string;
  difficulty_level: string;
}

interface UseRecommendationsParams {
  skillArea: string;
  difficulty: string;
  performanceScore: number;
  improvementAreas: string[];
  strengths: string[];
  triggerGeneration?: boolean;
}

export const useDailyRecommendations = ({
  skillArea,
  difficulty,
  performanceScore,
  improvementAreas,
  strengths,
  triggerGeneration = false
}: UseRecommendationsParams) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !triggerGeneration) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching recommendations for user:', user.id);
        
        // Try to get today's recommendations first
        const today = new Date().toISOString().split('T')[0];
        const { data: existingRecs, error: fetchError } = await supabase
          .from('daily_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: true });

        if (fetchError) {
          console.error('Error fetching recommendations:', fetchError);
          throw fetchError;
        }

        if (existingRecs && existingRecs.length > 0) {
          console.log('Found existing recommendations:', existingRecs.length);
          setRecommendations(existingRecs);
        } else {
          console.log('No existing recommendations, generating new ones');
          // Generate new recommendations
          const { data, error: generateError } = await supabase.functions.invoke(
            'generate-daily-recommendations',
            {
              body: {
                userId: user.id,
                skillArea,
                difficulty,
                performanceScore,
                improvementAreas,
                strengths
              }
            }
          );

          if (generateError) {
            console.error('Error generating recommendations:', generateError);
            throw generateError;
          }

          if (data?.recommendations) {
            setRecommendations(data.recommendations);
          }
        }
      } catch (err: any) {
        console.error('Error in recommendations hook:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, skillArea, difficulty, performanceScore, triggerGeneration]);

  return { recommendations, loading, error };
};
