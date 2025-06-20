
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface ChallengeLibraryStats {
  strategy: number;
  research: number;
  analytics: number;
  design: number;
}

interface ChallengeLibrarySectionProps {
  challengeStats: ChallengeLibraryStats;
}

const ChallengeLibrarySection = ({ challengeStats }: ChallengeLibrarySectionProps) => {
  const navigate = useNavigate();

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

  return (
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
              className="p-4 bg-gradient-to-br from-[#0400ff]/20 to-purple-600/20 rounded-lg border border-[#0400ff]/30 hover:from-[#0400ff]/30 hover:to-purple-600/30 transition-all duration-200 cursor-pointer shadow-lg"
              onClick={() => navigate(`/challenge-library/${category.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-black">{category.name}</h4>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {category.completed} completed
              </p>
              <Progress value={(category.completed / 300) * 100} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeLibrarySection;
