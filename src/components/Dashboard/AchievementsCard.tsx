
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AchievementsCard = () => {
  return (
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
  );
};

export default AchievementsCard;
