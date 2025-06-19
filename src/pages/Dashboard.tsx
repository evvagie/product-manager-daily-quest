import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const Dashboard = () => {
  const navigate = useNavigate();
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
        // First, update the user's streak using the new realistic calculation
        const { data: updatedStreak, error: streakError } = await supabase
          .rpc('update_user_streak', { user_uuid: user.id });

        if (streakError) {
          console.error('Error updating streak:', streakError);
        }

        // Then fetch the updated user stats
        const { data, error } = await supabase
          .from('users')
          .select('xp, level, streak, progression_jour')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setStats(data);
        }

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

  const currentLevelXP = stats.level * 1000;
  const progressToNextLevel = (stats.xp % 1000) / 10;

  const challengeCategories = [
    {
      id: 'strategy',
      name: 'Product Strategy',
      icon: '📊',
      color: 'blue',
      completed: challengeStats.strategy
    },
    {
      id: 'research',
      name: 'User Research',
      icon: '🔍',
      color: 'green', 
      completed: challengeStats.research
    },
    {
      id: 'analytics',
      name: 'Data Analysis',
      icon: '📈',
      color: 'purple',
      completed: challengeStats.analytics
    },
    {
      id: 'design',
      name: 'Product Design',
      icon: '🎨',
      color: 'pink',
      completed: challengeStats.design
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, PM!</h1>
          <p className="text-gray-400">Ready to level up your product management skills?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">XP Points</CardDescription>
              <CardTitle className="text-2xl text-blue-400">{stats.xp.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(progressToNextLevel)}% to level {stats.level + 1}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Current Level</CardDescription>
              <CardTitle className="text-2xl text-green-400">{stats.level}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Product Manager</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Current Streak</CardDescription>
              <CardTitle className="text-2xl text-orange-400">{stats.streak} days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Keep it going! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Today's Progress</CardDescription>
              <CardTitle className="text-2xl text-purple-400">{stats.progression_jour}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.progression_jour} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Challenge */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-800 bg-zinc-50">
            <CardHeader>
              <CardTitle className="text-xl text-white">Today's Challenge Session</CardTitle>
              <CardDescription className="text-slate-50">
                4 interactive challenges await you. Test your PM skills!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">Strategy</Badge>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">Analytics</Badge>
                </div>
                <span className="text-2xl">🎯</span>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => navigate('/challenge-selection')}
              >
                Start Today's Session →
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Recent Achievements</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest unlocked badges and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="font-medium text-white">First Steps</p>
                    <p className="text-sm text-gray-400">Completed your first challenge</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
                  <span className="text-2xl opacity-50">🎪</span>
                  <div>
                    <p className="font-medium text-gray-500">Week Warrior</p>
                    <p className="text-sm text-gray-600">Complete 7 days in a row</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Library */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Challenge Library</CardTitle>
            <CardDescription className="text-gray-400">
              Explore your progress and revisit challenges by skill area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {challengeCategories.map((category) => (
                <div 
                  key={category.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/challenge-library/${category.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <span className={`text-${category.color}-400`}>{category.icon}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {category.completed} completed
                  </p>
                  <Progress value={(category.completed / 300) * 100} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
