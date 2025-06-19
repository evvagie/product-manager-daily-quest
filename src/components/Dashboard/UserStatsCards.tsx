
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  progression_jour: number;
}

interface UserStatsCardsProps {
  stats: UserStats;
}

const UserStatsCards = ({ stats }: UserStatsCardsProps) => {
  const progressToNextLevel = (stats.xp % 1000) / 10;

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
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
    </div>
  );
};

export default UserStatsCards;
