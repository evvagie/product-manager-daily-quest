
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChallengeHistory {
  id: string;
  challenge_title: string;
  challenge_type: string;
  completion_date: string;
  score: number | null;
  time_taken: number | null;
  difficulty: string;
}

interface CategoryMetadata {
  total_challenges: number;
  challenge_types: string[];
}

const ChallengeLibrary = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const { user } = useAuth();
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
  const [metadata, setMetadata] = useState<CategoryMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryInfo = {
    strategy: {
      name: "Product Strategy",
      description: "Vision, roadmapping, and competitive analysis",
      icon: "🎯",
      color: "blue"
    },
    research: {
      name: "User Research",
      description: "User interviews, surveys, and insights",
      icon: "🔍",
      color: "green"
    },
    analytics: {
      name: "Data & Analytics",
      description: "Metrics, A/B testing, and data interpretation",
      icon: "📊",
      color: "purple"
    },
    design: {
      name: "Product Design",
      description: "UX principles, wireframing, and prototyping",
      icon: "🎨",
      color: "pink"
    }
  };

  const currentCategory = category && categoryInfo[category as keyof typeof categoryInfo] 
    ? categoryInfo[category as keyof typeof categoryInfo]
    : null;

  useEffect(() => {
    const fetchChallengeData = async () => {
      if (!user || !category) return;

      console.log('Fetching challenge data for category:', category, 'user:', user.id);

      try {
        setError(null);
        
        // Fetch challenge history for this category
        const { data: history, error: historyError } = await supabase
          .from('challenge_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('skill_area', category)
          .order('completion_date', { ascending: false });

        if (historyError) {
          console.error('Error fetching challenge history:', historyError);
          setError('Failed to load challenge history');
        } else {
          console.log('Fetched challenge history:', history);
          setChallengeHistory(history || []);
        }

        // Fetch metadata for this category - use maybeSingle() instead of single()
        const { data: meta, error: metaError } = await supabase
          .from('challenge_metadata')
          .select('total_challenges, challenge_types')
          .eq('skill_area', category)
          .maybeSingle();

        if (metaError) {
          console.error('Error fetching challenge metadata:', metaError);
          // Don't set error state for metadata - we can use defaults
          console.log('Using default metadata for category:', category);
          setMetadata({
            total_challenges: 300,
            challenge_types: ["time-bomb", "stakeholder-tension", "trade-off-slider", "post-mortem", "resource-allocator", "dialogue-tree", "retrospective-fix"]
          });
        } else if (meta) {
          console.log('Fetched challenge metadata:', meta);
          // Type cast the challenge_types from Json to string[]
          const typedMetadata: CategoryMetadata = {
            total_challenges: meta.total_challenges,
            challenge_types: Array.isArray(meta.challenge_types) ? meta.challenge_types as string[] : []
          };
          setMetadata(typedMetadata);
        } else {
          // No metadata found, use defaults
          console.log('No metadata found, using defaults for category:', category);
          setMetadata({
            total_challenges: 300,
            challenge_types: ["time-bomb", "stakeholder-tension", "trade-off-slider", "post-mortem", "resource-allocator", "dialogue-tree", "retrospective-fix"]
          });
        }
      } catch (error) {
        console.error('Error fetching challenge data:', error);
        setError('Failed to load challenge data');
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, [user, category]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-4">
            The category "{category}" is not recognized. Available categories are: strategy, research, analytics, design
          </p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading challenge library...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = challengeHistory.length;
  const totalCount = metadata?.total_challenges || 300;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Button>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl">{currentCategory.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
              <p className="text-gray-400">{currentCategory.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Your Progress</CardTitle>
            <CardDescription className="text-gray-400">
              Challenge completion in {currentCategory.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{completedCount} of {totalCount}</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                  {Math.round(progressPercentage)}% Complete
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-400">
                You've completed {completedCount} challenges. Keep going to master {currentCategory.name}!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Challenge History */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Challenge History</CardTitle>
            <CardDescription className="text-gray-400">
              Your completed challenges in {currentCategory.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {challengeHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-400 mb-4">No challenges completed yet in this category</p>
                <Button 
                  onClick={() => navigate('/challenge-selection')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Your First Challenge
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {challengeHistory.map((challenge) => (
                  <div key={challenge.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{challenge.challenge_title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {challenge.difficulty}
                        </Badge>
                        {challenge.score && (
                          <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                            {challenge.score}% Score
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Type: {challenge.challenge_type}</span>
                        <span>Time: {formatTime(challenge.time_taken)}</span>
                        <span>Completed: {formatDate(challenge.completion_date)}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => navigate('/challenge-selection')}
                      >
                        Retry Challenge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeLibrary;
