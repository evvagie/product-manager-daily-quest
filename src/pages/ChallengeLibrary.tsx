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
  challenge_id: string;
  skill_area: string;
}

const ChallengeLibrary = () => {
  const navigate = useNavigate();
  const {
    category
  } = useParams<{
    category: string;
  }>();
  const {
    user
  } = useAuth();
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
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
  const validCategories = Object.keys(categoryInfo);

  // Check if category is valid, if not redirect to strategy as default
  useEffect(() => {
    if (category && !validCategories.includes(category)) {
      console.log('Invalid category detected:', category, 'Redirecting to strategy');
      navigate('/challenge-library/strategy', {
        replace: true
      });
      return;
    }

    // Handle case where category is missing or is the literal ":category"
    if (!category || category === ':category') {
      console.log('Missing or invalid category parameter, redirecting to strategy');
      navigate('/challenge-library/strategy', {
        replace: true
      });
      return;
    }
  }, [category, navigate]);
  const currentCategory = category && categoryInfo[category as keyof typeof categoryInfo] ? categoryInfo[category as keyof typeof categoryInfo] : null;
  useEffect(() => {
    const fetchChallengeData = async () => {
      if (!user || !category || !validCategories.includes(category)) return;
      console.log('Fetching challenge data for category:', category, 'user:', user.id);
      try {
        setError(null);

        // Fetch challenge history for this category
        const {
          data: history,
          error: historyError
        } = await supabase.from('challenge_history').select('*').eq('user_id', user.id).eq('skill_area', category).order('completion_date', {
          ascending: false
        });
        if (historyError) {
          console.error('Error fetching challenge history:', historyError);
          setError('Failed to load challenge history');
        } else {
          console.log('Fetched challenge history:', history);
          setChallengeHistory(history || []);
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
  const handleRetryChallenge = (challenge: ChallengeHistory) => {
    // Navigate to challenge selection with the specific category and difficulty
    navigate('/challenge-selection', {
      state: {
        retryChallenge: true,
        category: challenge.skill_area || category,
        difficulty: challenge.difficulty,
        originalChallengeTitle: challenge.challenge_title
      }
    });
  };
  const getDifficultyBadgeStyles = (difficulty: string) => {
    if (difficulty.toLowerCase() === 'beginner') {
      return 'bg-sky-300 text-white border-sky-300';
    }
    return 'bg-gray-700 text-gray-300';
  };
  const getScoreBadgeStyles = (score: number) => {
    if (score === 100) {
      return 'bg-green-500 text-white border-green-500';
    }
    return score >= 80 ? 'bg-green-600/20 text-green-400' : score >= 60 ? 'bg-yellow-600/20 text-yellow-400' : 'bg-red-600/20 text-red-400';
  };

  // Don't render anything while redirecting
  if (!category || category === ':category' || !validCategories.includes(category)) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Redirecting...</div>
      </div>;
  }
  if (!currentCategory) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-4">
            The category "{category}" is not recognized. Available categories are: strategy, research, analytics, design
          </p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>;
  }
  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading challenge library...</div>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>;
  }
  const completedCount = challengeHistory.length;
  const averageScore = completedCount > 0 ? Math.round(challengeHistory.reduce((sum, challenge) => sum + (challenge.score || 0), 0) / completedCount) : 0;
  return <div className="min-h-screen bg-black text-white">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">{completedCount}</span>
                  <p className="text-sm text-gray-400">Challenges Completed</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-400">{averageScore}%</span>
                  <p className="text-sm text-gray-400">Average Score</p>
                </div>
              </div>
              {completedCount > 0 && <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Performance</span>
                    <span className="text-sm text-white">{averageScore}%</span>
                  </div>
                  <Progress value={averageScore} className="h-2" />
                </div>}
              <p className="text-sm text-gray-400">
                {completedCount === 0 ? `Start your first challenge in ${currentCategory.name}!` : `You've completed ${completedCount} challenge${completedCount === 1 ? '' : 's'}. Keep going to master ${currentCategory.name}!`}
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
            {challengeHistory.length === 0 ? <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-400 mb-4">No challenges completed yet in this category</p>
                <Button onClick={() => navigate('/challenge-selection')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Your First Challenge
                </Button>
              </div> : <div className="space-y-4">
                {challengeHistory.map(challenge => <div key={challenge.id} className="p-4 bg-gradient-to-br from-pink-600/20 to-blue-600/20 rounded-lg border border-pink-600/30 hover:from-pink-600/30 hover:to-blue-600/30 transition-all duration-200 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-black">{challenge.challenge_title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getDifficultyBadgeStyles(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.score !== null && <Badge variant="secondary" className={getScoreBadgeStyles(challenge.score)}>
                            {challenge.score}% Score
                          </Badge>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>Type: {challenge.challenge_type}</span>
                        <span>Time: {formatTime(challenge.time_taken)}</span>
                        <span>Completed: {formatDate(challenge.completion_date)}</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-md p-0.5">
                          <div className="bg-white rounded-md h-full w-full flex items-center justify-center">
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent font-medium text-sm px-3 py-1.5">
                              Retry Challenge
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRetryChallenge(challenge)} 
                          className="relative bg-transparent hover:bg-transparent text-transparent rounded-md"
                        >
                          Retry Challenge
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};

export default ChallengeLibrary;
