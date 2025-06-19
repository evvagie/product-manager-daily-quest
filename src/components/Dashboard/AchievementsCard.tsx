
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import AchievementsDialog from "./AchievementsDialog";

const AchievementsCard = () => {
  const [showAchievementsDialog, setShowAchievementsDialog] = useState(false);
  const { unlockedAchievements, achievements, loading } = useUserAchievements();

  // Get the most recent unlocked achievements to display
  const recentAchievements = unlockedAchievements
    .sort((a, b) => new Date(b.unlocked_at || '').getTime() - new Date(a.unlocked_at || '').getTime())
    .slice(0, 2);

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-blue-500/15 via-purple-500/8 to-cyan-500/10 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setShowAchievementsDialog(true)}
      >
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Achievements</CardTitle>
          <CardDescription className="text-gray-400">
            {loading 
              ? "Loading your achievements..." 
              : `${unlockedAchievements.length} of ${achievements.length} unlocked`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ) : recentAchievements.length > 0 ? (
              recentAchievements.map((achievement) => (
                <div key={achievement.achievement_id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="font-medium text-white">{achievement.name}</p>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20">
                <span className="text-2xl opacity-50">🏆</span>
                <div>
                  <p className="font-medium text-gray-500">No achievements yet</p>
                  <p className="text-sm text-gray-600">Complete challenges to unlock your first achievement!</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-blue-400 mt-4 text-center">Click to view all achievements</p>
        </CardContent>
      </Card>

      <AchievementsDialog
        isOpen={showAchievementsDialog}
        onClose={() => setShowAchievementsDialog(false)}
      />
    </>
  );
};

export default AchievementsCard;
