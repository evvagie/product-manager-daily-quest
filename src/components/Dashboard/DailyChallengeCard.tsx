
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const DailyChallengeCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Today's Challenge Session</CardTitle>
        <CardDescription className="text-gray-600">
          4 interactive challenges await you. Test your PM skills!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-[#0400ff]/20 to-purple-600/20 text-[#0400ff] border-[#0400ff]/30">Strategy</Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/30">Analytics</Badge>
          </div>
          <span className="text-2xl">🎯</span>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-[#0400ff] to-purple-600 hover:from-[#0300cc] hover:to-purple-700 !text-white shadow-lg" 
          style={{ color: 'white !important' }}
          onClick={() => navigate('/challenge-selection')}
        >
          Start Today's Session →
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyChallengeCard;
