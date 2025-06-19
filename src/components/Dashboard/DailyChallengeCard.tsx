
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const DailyChallengeCard = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default DailyChallengeCard;
