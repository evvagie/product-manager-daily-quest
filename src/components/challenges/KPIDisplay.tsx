
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Heart } from "lucide-react";

interface KPIDisplayProps {
  metrics: {
    revenue: { value: number; change: number };
    teamMood: { value: number; change: number };
    customerSat: { value: number; change: number };
    userGrowth: { value: number; change: number };
  };
}

export const KPIDisplay = ({ metrics }: KPIDisplayProps) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-black">${metrics.revenue.value}k</p>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className={`ml-1 text-sm ${getChangeColor(metrics.revenue.change)}`}>
                {metrics.revenue.change > 0 ? '+' : ''}{metrics.revenue.change}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Mood</p>
              <p className="text-lg font-bold text-black">{metrics.teamMood.value}/10</p>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className={`ml-1 text-sm ${getChangeColor(metrics.teamMood.change)}`}>
                {metrics.teamMood.change > 0 ? '+' : ''}{metrics.teamMood.change}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Sat</p>
              <p className="text-lg font-bold text-black">{metrics.customerSat.value}/5</p>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(metrics.customerSat.value))}
              </div>
              <span className={`ml-1 text-sm ${getChangeColor(metrics.customerSat.change)}`}>
                {metrics.customerSat.change > 0 ? '+' : ''}{metrics.customerSat.change}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">User Growth</p>
              <p className="text-lg font-bold text-black">{metrics.userGrowth.value}%</p>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600" />
              <span className={`ml-1 text-sm ${getChangeColor(metrics.userGrowth.change)}`}>
                {metrics.userGrowth.change > 0 ? '+' : ''}{metrics.userGrowth.change}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
