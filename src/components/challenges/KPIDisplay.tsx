
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Heart } from "lucide-react";

interface KPIDisplayProps {
  metrics: {
    revenue?: { value: number; change: number };
    teamMood?: { value: number; change: number };
    customerSat?: { value: number; change: number };
    userGrowth?: { value: number; change: number };
  };
}

export const KPIDisplay = ({ metrics }: KPIDisplayProps) => {
  // Provide default values for all metrics to prevent undefined errors
  const defaultMetrics = {
    revenue: { value: 0, change: 0 },
    teamMood: { value: 5, change: 0 },
    customerSat: { value: 3, change: 0 },
    userGrowth: { value: 0, change: 0 },
    ...metrics
  };

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
              <p className="text-lg font-bold text-black">${defaultMetrics.revenue.value}k</p>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className={`ml-1 text-sm ${getChangeColor(defaultMetrics.revenue.change)}`}>
                {defaultMetrics.revenue.change > 0 ? '+' : ''}{defaultMetrics.revenue.change}%
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
              <p className="text-lg font-bold text-black">{defaultMetrics.teamMood.value}/10</p>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className={`ml-1 text-sm ${getChangeColor(defaultMetrics.teamMood.change)}`}>
                {defaultMetrics.teamMood.change > 0 ? '+' : ''}{defaultMetrics.teamMood.change}
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
              <p className="text-lg font-bold text-black">{defaultMetrics.customerSat.value}/5</p>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(defaultMetrics.customerSat.value))}
              </div>
              <span className={`ml-1 text-sm ${getChangeColor(defaultMetrics.customerSat.change)}`}>
                {defaultMetrics.customerSat.change > 0 ? '+' : ''}{defaultMetrics.customerSat.change}
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
              <p className="text-lg font-bold text-black">{defaultMetrics.userGrowth.value}%</p>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600" />
              <span className={`ml-1 text-sm ${getChangeColor(defaultMetrics.userGrowth.change)}`}>
                {defaultMetrics.userGrowth.change > 0 ? '+' : ''}{defaultMetrics.userGrowth.change}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
