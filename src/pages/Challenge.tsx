import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TimePressureIndicator } from '@/components/challenges/TimePressureIndicator';
import { DynamicChallengeRenderer } from '@/components/challenges/DynamicChallengeRenderer';
import { ConsequenceDisplay } from '@/components/challenges/ConsequenceDisplay';
import { RetryFeedbackModal } from '@/components/challenges/RetryFeedbackModal';
import { generateDynamicChallenge, type ChallengeSession, type Exercise } from '@/utils/challengeGenerator';
import { useToast } from '@/components/ui/use-toast';

const Challenge = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const skillArea = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const challengeId = searchParams.get('challengeId');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [challengeSession, setChallengeSession] = useState<ChallengeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showConsequences, setShowConsequences] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);

  const currentExercise: Exercise | null = challengeSession?.exercises[currentExerciseIndex] || null;
  const isLastExercise = currentExerciseIndex === (challengeSession?.totalExercises || 0) - 1;
  const progressPercentage = challengeSession ? ((currentExerciseIndex + 1) / challengeSession.totalExercises) * 100 : 0;
  const isRetryChallenge = challengeId !== null;

  // Helper function to get difficulty badge styles
  const getDifficultyBadgeStyles = (difficulty: string) => {
    const difficultyLower = difficulty.toLowerCase();
    if (difficultyLower === 'beginner') {
      return 'bg-gradient-to-r from-sky-300 to-purple-400 text-white border-0';
    } else if (difficultyLower === 'intermediate') {
      return 'bg-gradient-to-r from-purple-300 to-pink-400 text-white border-0';
    } else if (difficultyLower === 'expert' || difficultyLower === 'advanced') {
      return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0';
    }
    return 'bg-gray-700 text-gray-300';
  };

  useEffect(() => {
    const loadChallengeSession = async () => {
      if (!skillArea || !difficulty) {
        navigate('/challenge-selection');
        return;
      }

      setLoading(true);
      try {
        console.log('Loading challenge session for:', { skillArea, difficulty, challengeId });
        const newChallengeSession = await generateDynamicChallenge(skillArea, difficulty, challengeId);
        console.log('Challenge session loaded:', newChallengeSession);
        
        setChallengeSession(newChallengeSession);
        // Always set timer to 1:00 (60 seconds) for all challenges
        setTimeLeft(60);
        setExerciseAnswers(new Array(newChallengeSession.totalExercises).fill(null));
        
        // Show success message based on source and retry context
        const isRetry = location.state?.retryChallenge;
        if (isRetry) {
          toast({
            title: "🔄 Challenge Reloaded!",
            description: `Retrying "${location.state?.originalChallengeTitle || 'challenge'}"`,
          });
        } else if (newChallengeSession.source === 'openai') {
          toast({
            title: "🤖 AI Challenge Session Generated!",
            description: `${newChallengeSession.totalExercises} unique exercises created just for you`,
          });
        } else {
          toast({
            title: "Challenge Session Ready",
            description: `${newChallengeSession.totalExercises} exercises using enhanced static content`,
          });
        }
      } catch (error) {
        console.error('Error loading challenge session:', error);
        toast({
          title: "Error",
          description: "Failed to load challenge session. Please try again.",
          variant: "destructive",
        });
        navigate('/challenge-selection');
      } finally {
        setLoading(false);
      }
    };

    loadChallengeSession();
  }, [skillArea, difficulty, challengeId, navigate, toast, location.state]);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete && !showConsequences) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isComplete, showConsequences]);

  const handleAnswer = (answer: any) => {
    setCurrentAnswer(answer);
    setShowConsequences(true);
    
    // Store the answer for this exercise
    const newAnswers = [...exerciseAnswers];
    newAnswers[currentExerciseIndex] = answer;
    setExerciseAnswers(newAnswers);
  };

  const handleTimeUp = () => {
    if (!isComplete && !showConsequences) {
      toast({
        title: "Time's Up!",
        description: isRetryChallenge ? "Challenge completed!" : "Moving to next exercise.",
        variant: "destructive",
      });
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (isLastExercise) {
      handleCompleteSession();
    } else {
      // Move to next exercise
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setCurrentAnswer(null);
      setShowConsequences(false);
      // Always reset timer to 60 seconds for each exercise
      setTimeLeft(60);
    }
  };

  const handleCompleteSession = () => {
    setIsComplete(true);
    
    if (isRetryChallenge) {
      // For retry challenges, show modal instead of navigating to session feedback
      setShowRetryModal(true);
    } else {
      // For regular challenges, navigate to session feedback
      navigate('/session-feedback', {
        state: {
          challengeSession,
          exerciseAnswers,
          timeUsed: challengeSession?.exercises.reduce((total, ex) => total + ex.timeLimit, 0) - timeLeft
        }
      });
    }
  };

  const handleRetryModalClose = () => {
    setShowRetryModal(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {challengeId ? "🔄 Loading Specific Challenge..." : "🤖 Generating Your Challenge Session..."}
              </h2>
              <p className="text-gray-600">
                {challengeId ? "Preparing your retry challenge..." : "Creating 4 unique exercises tailored to your skill level. This may take a few moments."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!challengeSession || !currentExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Challenge Session Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                Unable to load the challenge session. Please try again.
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
        <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-black">
                  {currentExercise.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                    {skillArea}
                  </Badge>
                  <Badge variant="secondary" className={getDifficultyBadgeStyles(difficulty || '')}>
                    {difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Exercise {currentExerciseIndex + 1} of {challengeSession.totalExercises}
                  </Badge>
                  {challengeSession.source === 'openai' && (
                    <Badge className="bg-purple-100 text-purple-700">
                      🤖 AI Generated
                    </Badge>
                  )}
                  {challengeId && (
                    <Badge className="bg-orange-100 text-orange-700">
                      🔄 Retry
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(isRetryChallenge ? '/dashboard' : '/challenge-selection')}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0 font-medium"
              >
                {isRetryChallenge ? 'Back to Dashboard' : 'Exit Session'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Session Progress</span>
                <span>{currentExerciseIndex + 1} / {challengeSession.totalExercises}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        {!isComplete && (
          <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200">
            <CardContent className="p-4">
              <TimePressureIndicator
                timeLeft={timeLeft}
                totalTime={60}
                onTimeUp={handleTimeUp}
              />
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        <DynamicChallengeRenderer
          challenge={currentExercise}
          onAnswer={handleAnswer}
          currentAnswer={currentAnswer}
          showConsequences={showConsequences}
        />

        {/* Consequences */}
        {showConsequences && currentAnswer && (
          <ConsequenceDisplay
            consequences={currentExercise.content.options?.find((opt: any) => opt.id === currentAnswer)?.consequences || []}
          />
        )}

        {/* Next/Complete Button */}
        {showConsequences && !isComplete && (
          <div className="text-center">
            <Button
              onClick={handleNextExercise}
              className={`px-8 py-3 ${isLastExercise ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isLastExercise ? 'Complete Session' : 'Next Exercise'}
            </Button>
          </div>
        )}

        {/* Retry Feedback Modal */}
        {showRetryModal && challengeSession && (
          <RetryFeedbackModal
            challengeSession={challengeSession}
            exerciseAnswers={exerciseAnswers}
            isOpen={showRetryModal}
            onClose={handleRetryModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default Challenge;
