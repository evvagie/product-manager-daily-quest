
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserAchievements } from "@/hooks/useUserAchievements";

interface AchievementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsDialog = ({ isOpen, onClose }: AchievementsDialogProps) => {
  const { achievements, unlockedAchievements, lockedAchievements, loading } = useUserAchievements();
  const [activeTab, setActiveTab] = useState("all");

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-500/15 via-purple-500/8 to-cyan-500/10 backdrop-blur-md border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Achievements</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-400 py-8">
            Loading your achievements...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'xp': return 'bg-blue-500';
      case 'level': return 'bg-green-500';
      case 'streak': return 'bg-orange-500';
      case 'challenge': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const renderAchievementCard = (achievement: any) => (
    <div
      key={achievement.achievement_id}
      className={`p-4 rounded-lg border ${
        achievement.is_unlocked 
          ? 'bg-white/70 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-white/80 border border-white/50' 
          : 'bg-white/40 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-white/50 border border-white/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className={`text-3xl ${achievement.is_unlocked ? '' : 'opacity-50'}`}>
            {achievement.icon}
          </span>
          <div>
            <h3 className={`font-semibold ${achievement.is_unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.name}
            </h3>
            <p className={`text-sm ${achievement.is_unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
              {achievement.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge 
            variant="outline" 
            className={`${getCategoryColor(achievement.category)} text-white border-none`}
          >
            {achievement.category.toUpperCase()}
          </Badge>
          {achievement.is_unlocked && (
            <span className="text-xs text-green-400">
              ✓ Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      {!achievement.is_unlocked && achievement.required_value > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-400">
              {achievement.current_value} / {achievement.required_value}
            </span>
          </div>
          <Progress 
            value={achievement.progress_percentage} 
            className="h-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {achievement.progress_percentage}% complete
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-500/15 via-purple-500/8 to-cyan-500/10 backdrop-blur-md border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Achievements</DialogTitle>
          <p className="text-gray-400">
            {unlockedAchievements.length} of {achievements.length} achievements unlocked
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="all" className="text-white">
              All ({achievements.length})
            </TabsTrigger>
            <TabsTrigger value="unlocked" className="text-white">
              Unlocked ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="text-white">
              Locked ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {achievements.map(renderAchievementCard)}
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-4 mt-6">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map(renderAchievementCard)
            ) : (
              <div className="text-center text-gray-400 py-8">
                No achievements unlocked yet. Keep playing to earn your first achievement!
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4 mt-6">
            {lockedAchievements.length > 0 ? (
              lockedAchievements.map(renderAchievementCard)
            ) : (
              <div className="text-center text-gray-400 py-8">
                Congratulations! You've unlocked all achievements!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsDialog;
