import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEnhancedChallengesForSession } from "@/data/enhancedChallengeData";
import { KPIDisplay } from "@/components/challenges/KPIDisplay";
import { TeamChat } from "@/components/challenges/TeamChat";
import { TimePressureIndicator } from "@/components/challenges/TimePressureIndicator";
import { ConsequenceDisplay } from "@/components/challenges/ConsequenceDisplay";
import { generateDynamicChallenge } from "@/utils/challengeGenerator";
import { DynamicChallengeRenderer } from "@/components/challenges/DynamicChallengeRenderer";

interface EnhancedChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'time-pressure' | 'kpi-impact' | 'team-chat' | 'crisis-management' | 'multi-step' | 'drag-drop' | 'multiple-choice' | 'ranking' | 'scenario';
  timeLimit: number;
  content: any;
}

const Challenge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'strategy';
  const difficulty = searchParams.get('difficulty') || 'beginner';
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showConsequences, setShowConsequences] = useState(false);
  const [currentKPIs, setCurrentKPIs] = useState<any>(null);
  const [generatedChallenges, setGeneratedChallenges] = useState<any[]>([]);

  // Generate dynamic challenges when session starts
  const generateSessionChallenges = () => {
    const challenges = [];
    for (let i = 0; i < 4; i++) {
      challenges.push(generateDynamicChallenge(category, difficulty));
    }
    setGeneratedChallenges(challenges);
    return challenges;
  };

  const currentChallengeData = generatedChallenges[currentChallenge];
  const progress = generatedChallenges.length > 0 ? (currentChallenge + 1) / generatedChallenges.length * 100 : 0;

  useEffect(() => {
    if (sessionStarted && timeLeft > 0 && !showConsequences) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionStarted, timeLeft, showConsequences]);

  useEffect(() => {
    if (currentChallengeData?.content?.currentKPIs) {
      setCurrentKPIs(currentChallengeData.content.currentKPIs);
    }
  }, [currentChallengeData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    const challenges = generateSessionChallenges();
    setSessionStarted(true);
    setTimeLeft(challenges[0]?.timeLimit || 300);
  };

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentChallenge] = answer;
    setAnswers(newAnswers);
    
    // Show consequences immediately for most challenge types
    if (currentChallengeData?.type !== 'slider' && currentChallengeData?.type !== 'drag-drop') {
      const selectedOption = currentChallengeData.content.options?.find((opt: any) => opt.id === answer);
      if (selectedOption) {
        setShowConsequences(true);
        if (selectedOption.kpiImpact) {
          setCurrentKPIs(selectedOption.kpiImpact);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentChallenge < generatedChallenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(generatedChallenges[currentChallenge + 1].timeLimit || 300);
      setShowConsequences(false);
    } else {
      // Session completed
      navigate('/session-feedback', {
        state: {
          answers,
          category,
          difficulty,
          challenges: generatedChallenges.length
        }
      });
    }
  };

  const handleTimeUp = () => {
    if (!showConsequences && currentChallengeData.type !== 'slider' && currentChallengeData.type !== 'drag-drop') {
      // Auto-advance if time runs out and no answer selected
      setShowConsequences(true);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/challenge-selection')} className="mb-4 text-gray-600 hover:text-black">
              ← Back to Selection
            </Button>

            <Card className="bg-white border-gray-200 mb-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-2xl text-black">Ready for Dynamic Challenges?</CardTitle>
                <CardDescription className="text-gray-600">
                  {category} • {difficulty} • 4 Unique Interactive Challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    You're about to start a dynamic PM challenge session with randomly generated scenarios, varying formats, and real-time feedback.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-50">
                      <p className="text-blue-600 font-semibold">~12-15 min</p>
                      <p className="text-sm text-gray-700">Estimated time</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-green-600 font-semibold">Dynamic</p>
                      <p className="text-gray-700 text-sm">Unique every time</p>
                    </div>
                  </div>
                  
                  <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-black mb-2">Challenge Formats You Might Encounter:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ⏰ Time-bomb decisions under pressure</li>
                      <li>• 🎯 Stakeholder tension mapping</li>
                      <li>• ⚖️ Trade-off balance sliders</li>
                      <li>• 🔍 Post-mortem investigations</li>
                      <li>• 📊 Resource allocation challenges</li>
                      <li>• 💬 Dialogue tree conversations</li>
                      <li>• 🔄 Retrospective analysis</li>
                    </ul>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleStartSession}>
                  Generate & Start Dynamic Session →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentChallengeData) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your unique challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Progress and Time */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-600 mb-2">
                Challenge {currentChallenge + 1} of {generatedChallenges.length} • {currentChallengeData.format.name}
              </Badge>
              <h1 className="text-2xl font-bold text-black">{currentChallengeData.title}</h1>
            </div>
            <div className="w-64">
              {(currentChallengeData.format.type === 'time-bomb' || currentChallengeData.format.type === 'stakeholder-tension') ? (
                <TimePressureIndicator 
                  timeLeft={timeLeft} 
                  totalTime={currentChallengeData.timeLimit} 
                  onTimeUp={handleTimeUp}
                />
              ) : (
                <div className="text-right">
                  <div className="text-2xl font-mono text-blue-600">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-600">Time remaining</div>
                </div>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-gray-600 text-sm">{Math.round(progress)}% complete</p>
        </div>

        {/* KPI Display for challenges with KPI impact */}
        {currentKPIs && (
          <KPIDisplay metrics={currentKPIs} />
        )}

        {/* Challenge Content */}
        <div className="max-w-4xl mx-auto">
          <DynamicChallengeRenderer
            challenge={currentChallengeData}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentChallenge]}
            showConsequences={showConsequences}
          />

          {/* Show consequences after answer selection */}
          {showConsequences && answers[currentChallenge] && currentChallengeData.content.options && (
            <ConsequenceDisplay 
              consequences={
                currentChallengeData.content.options.find((opt: any) => opt.id === answers[currentChallenge])?.consequences || []
              }
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="border-gray-400 text-black hover:bg-gray-100" onClick={() => navigate('/challenge-selection')}>
              Exit Session
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleNext} 
              disabled={!answers[currentChallenge] && !showConsequences}
            >
              {currentChallenge === generatedChallenges.length - 1 ? 'Complete Session' : 'Next Challenge'} →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;
