
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  achievement_id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  progress_percentage: number;
  current_value: number;
  required_value: number;
}

export const useUserAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching achievements for user:', user.id);
        
        // First, check and grant any new achievements
        const { error: checkError } = await supabase
          .rpc('check_and_grant_achievements', { user_uuid: user.id });

        if (checkError) {
          console.error('Error checking achievements:', checkError);
        }

        // Then fetch achievements with progress
        const { data, error } = await supabase
          .rpc('get_user_achievements_with_progress', { user_uuid: user.id });

        console.log('Achievements data:', data);
        console.log('Achievements error:', error);

        if (error) {
          setError(error.message);
        } else {
          setAchievements(data || []);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to fetch achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const unlockedAchievements = achievements.filter(a => a.is_unlocked);
  const lockedAchievements = achievements.filter(a => !a.is_unlocked);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    loading,
    error
  };
};
