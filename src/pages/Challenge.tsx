
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimePressureIndicator } from '@/components/challenges/TimePressureIndicator';
import { DynamicChallengeRenderer } from '@/components/challenges/DynamicChallengeRenderer';
import { ConsequenceDisplay } from '@/components/challenges/ConsequenceDisplay';
import { KPIDisplay } from '@/components/challenges/KPIDisplay';
import { generateDynamicChallenge } from '@/utils/challengeGenerator';
import { useToast } from '@/components/ui/use-toast';

const Challenge = () => {
  const [searchParams] = useSearchParams();
  const skillArea = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showConsequences, setShowConsequences] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!skillArea || !difficulty) {
        navigate('/challenge-selection');
        return;
      }

      setLoading(true);
      try {
        console.log('Loading challenge for:', { skillArea, difficulty });
        const newChallenge = await generateDynamicChallenge(skillArea, difficulty);
        console.log('Challenge loaded:', newChallenge);
        
        setChallenge(newChallenge);
        setTimeLeft(newChallenge.timeLimit);
        
        // Show success message based on source
        if (newChallenge.source === 'openai') {
          toast({
            title: "🤖 AI Challenge Generated!",
            description: "A unique challenge created just for you",
          });
        } else {
          toast({
            title: "Challenge Ready",
            description: "Using fallback challenge system",
          });
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
        toast({
          title: "Error",
          description: "Failed to load challenge. Please try again.",
          variant: "destructive",
        });
        navigate('/challenge-selection');
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [skillArea, difficulty, navigate, toast]);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isComplete]);

  const handleAnswer = (answer: any) => {
    setCurrentAnswer(answer);
    setShowConsequences(true);
  };

  const handleTimeUp = () => {
    if (!isComplete) {
      toast({
        title: "Time's Up!",
        description: "The challenge has ended.",
        variant: "destructive",
      });
      setIsComplete(true);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    navigate('/session-feedback', {
      state: {
        challenge,
        answer: currentAnswer,
        timeUsed: challenge?.timeLimit - timeLeft
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                🤖 Generating Your Challenge...
              </h2>
              <p className="text-gray-600">
                Our AI is creating a unique challenge just for you. This may take a few moments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Challenge Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                Unable to load the challenge. Please try again.
              </p>
              <Button onClick={() => navigate('/challenge-selection')}>
                Back to Selection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-black">
                  {challenge.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {skillArea}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {difficulty}
                  </Badge>
                  {challenge.source === 'openai' && (
                    <Badge className="bg-purple-100 text-purple-700">
                      🤖 AI Generated
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/challenge-selection')}
                className="border-gray-400"
              >
                Exit Challenge
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Timer */}
        {!isComplete && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <TimePressureIndicator
                timeLeft={timeLeft}
                totalTime={challenge.timeLimit}
                onTimeUp={handleTimeUp}
              />
            </CardContent>
          </Card>
        )}

        {/* Challenge Content */}
        <DynamicChallengeRenderer
          challenge={challenge}
          onAnswer={handleAnswer}
          currentAnswer={currentAnswer}
          showConsequences={showConsequences}
        />

        {/* Consequences */}
        {showConsequences && currentAnswer && (
          <ConsequenceDisplay
            consequences={challenge.content.options?.find((opt: any) => opt.id === currentAnswer)?.consequences || []}
          />
        )}

        {/* KPI Display */}
        {showConsequences && currentAnswer && (
          <KPIDisplay
            metrics={challenge.content.options?.find((opt: any) => opt.id === currentAnswer)?.kpiImpact || {}}
          />
        )}

        {/* Complete Button */}
        {showConsequences && !isComplete && (
          <div className="text-center">
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Challenge
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;
