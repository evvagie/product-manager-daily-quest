
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  progression_jour: number;
}

interface ChallengeLibraryStats {
  strategy: number;
  research: number;
  analytics: number;
  design: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    progression_jour: 0
  });
  const [challengeStats, setChallengeStats] = useState<ChallengeLibraryStats>({
    strategy: 0,
    research: 0,
    analytics: 0,
    design: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        console.log('Fetching user stats for user:', user.id);
        
        // First, update the user's streak using the new realistic calculation
        const { data: updatedStreak, error: streakError } = await supabase
          .rpc('update_user_streak', { user_uuid: user.id });

        if (streakError) {
          console.error('Error updating streak:', streakError);
        } else {
          console.log('Updated streak result:', updatedStreak);
        }

        // Then fetch the updated user stats
        const { data, error } = await supabase
          .from('users')
          .select('xp, level, streak, progression_jour')
          .eq('id', user.id)
          .single();

        console.log('Fetched user data:', data);
        console.log('User stats error:', error);

        if (data && !error) {
          setStats(data);
        }

        // Also fetch recent sessions to debug streak calculation
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('date, session_complete')
          .eq('user_id', user.id)
          .eq('session_complete', true)
          .order('date', { ascending: false })
          .limit(10);

        console.log('Recent completed sessions:', sessionsData);
        console.log('Sessions error:', sessionsError);

        // Fetch challenge completion counts for each category
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenge_history')
          .select('skill_area')
          .eq('user_id', user.id);

        if (challengeData && !challengeError) {
          const counts = challengeData.reduce((acc, challenge) => {
            acc[challenge.skill_area as keyof ChallengeLibraryStats] = 
              (acc[challenge.skill_area as keyof ChallengeLibraryStats] || 0) + 1;
            return acc;
          }, {} as Partial<ChallengeLibraryStats>);

          setChallengeStats({
            strategy: counts.strategy || 0,
            research: counts.research || 0,
            analytics: counts.analytics || 0,
            design: counts.design || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return { stats, challengeStats, loading };
};
