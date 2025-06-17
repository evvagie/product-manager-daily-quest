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

  // Get enhanced challenges based on selected category and difficulty
  const challenges = getEnhancedChallengesForSession(category, difficulty);
  const currentChallengeData = challenges[currentChallenge];
  const progress = (currentChallenge + 1) / challenges.length * 100;

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
    setSessionStarted(true);
    setTimeLeft(currentChallengeData.timeLimit || 300);
  };

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentChallenge] = answer;
    setAnswers(newAnswers);
    
    // Show consequences immediately for enhanced challenges
    if (currentChallengeData.type !== 'drag-drop' && currentChallengeData.type !== 'ranking') {
      const selectedOption = currentChallengeData.content.options.find((opt: any) => opt.id === answer);
      if (selectedOption) {
        setShowConsequences(true);
        if (selectedOption.kpiImpact) {
          setCurrentKPIs(selectedOption.kpiImpact);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(challenges[currentChallenge + 1].timeLimit || 300);
      setShowConsequences(false);
    } else {
      // Session completed
      navigate('/session-feedback', {
        state: {
          answers,
          category,
          difficulty,
          challenges: challenges.length
        }
      });
    }
  };

  const handleTimeUp = () => {
    if (!showConsequences && currentChallengeData.type !== 'drag-drop' && currentChallengeData.type !== 'ranking') {
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
                <CardTitle className="text-2xl text-black">Ready to Begin?</CardTitle>
                <CardDescription className="text-gray-600">
                  {category} • {difficulty} • {challenges.length} Interactive Challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    You're about to start an immersive PM challenge session with real-time KPI tracking, team communications, and dynamic scenarios.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-50">
                      <p className="text-blue-600 font-semibold">{Math.round(challenges.reduce((sum, c) => sum + c.timeLimit, 0) / 60)} minutes</p>
                      <p className="text-sm text-gray-700">Estimated time</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-green-600 font-semibold">Interactive</p>
                      <p className="text-gray-700 text-sm">KPIs, team chat, consequences</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleStartSession}>
                  Start Interactive Session →
                </Button>
              </CardContent>
            </Card>
          </div>
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
                Challenge {currentChallenge + 1} of {challenges.length}
              </Badge>
              <h1 className="text-2xl font-bold text-black">{currentChallengeData.title}</h1>
            </div>
            <div className="w-64">
              {(currentChallengeData.type === 'time-pressure' || currentChallengeData.type === 'crisis-management') ? (
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

        {/* KPI Display for kpi-impact challenges */}
        {(currentChallengeData.type === 'kpi-impact' || showConsequences) && currentKPIs && (
          <KPIDisplay metrics={currentKPIs} />
        )}

        {/* Challenge Content */}
        <div className="max-w-4xl mx-auto">
          {/* Team Chat for team-chat challenges */}
          {(currentChallengeData.type === 'team-chat' || currentChallengeData.type === 'crisis-management') && 
           currentChallengeData.content.teamMessages && (
            <TeamChat messages={currentChallengeData.content.teamMessages} />
          )}

          <Card className="bg-white border-gray-200 mb-6">
            <CardHeader>
              <CardDescription className="text-gray-700 text-lg">
                {currentChallengeData.content.context || currentChallengeData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Enhanced Challenge Types */}
              {(currentChallengeData.type === 'multiple-choice' || 
                currentChallengeData.type === 'scenario' ||
                currentChallengeData.type === 'time-pressure' ||
                currentChallengeData.type === 'kpi-impact' ||
                currentChallengeData.type === 'team-chat' ||
                currentChallengeData.type === 'crisis-management' ||
                currentChallengeData.type === 'multi-step') && (
                <EnhancedMultipleChoice 
                  content={currentChallengeData.content} 
                  onAnswer={handleAnswer} 
                  currentAnswer={answers[currentChallenge]}
                  showConsequences={showConsequences}
                />
              )}

              {/* Keep existing challenge types for compatibility */}
              {currentChallengeData.type === 'drag-drop' && (
                <DragDropChallenge 
                  content={currentChallengeData.content} 
                  onAnswer={handleAnswer} 
                  currentAnswer={answers[currentChallenge]} 
                />
              )}

              {currentChallengeData.type === 'ranking' && (
                <RankingChallenge 
                  content={currentChallengeData.content} 
                  onAnswer={handleAnswer} 
                  currentAnswer={answers[currentChallenge]} 
                />
              )}
            </CardContent>
          </Card>

          {/* Show consequences after answer selection */}
          {showConsequences && answers[currentChallenge] && (
            <ConsequenceDisplay 
              consequences={
                currentChallengeData.content.options.find((opt: any) => opt.id === answers[currentChallenge])?.consequences || []
              }
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" className="border-gray-400 text-black hover:bg-gray-100" onClick={() => navigate('/challenge-selection')}>
              Exit Session
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleNext} 
              disabled={!answers[currentChallenge] && !showConsequences}
            >
              {currentChallenge === challenges.length - 1 ? 'Complete Session' : 'Next Challenge'} →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Multiple Choice Component for new challenge types
const EnhancedMultipleChoice = ({ content, onAnswer, currentAnswer, showConsequences }: any) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {content.options.map((option: any) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            disabled={showConsequences}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              currentAnswer === option.id 
                ? 'bg-blue-50 border-blue-600' 
                : showConsequences
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                : 'bg-gray-50 border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-black font-medium mb-1">{option.text}</div>
            {option.description && (
              <div className="text-gray-600 text-sm">{option.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Challenge Components
const DragDropChallenge = ({ content, onAnswer, currentAnswer }: any) => {
  const [orderedFeatures, setOrderedFeatures] = useState(currentAnswer || content.features);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newFeatures = [...orderedFeatures];
    const draggedFeature = newFeatures[dragIndex];
    newFeatures.splice(dragIndex, 1);
    newFeatures.splice(dropIndex, 0, draggedFeature);
    setOrderedFeatures(newFeatures);
    onAnswer(newFeatures);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">Drag features to reorder them by priority (highest to lowest):</p>
      
      <div className="space-y-2">
        {orderedFeatures.map((feature: any, index: number) => (
          <div
            key={feature.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-move hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded text-white text-sm flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-black font-medium">{feature.name}</span>
              </div>
              <div className="flex space-x-2">
                <Badge 
                  variant="secondary" 
                  className={
                    feature.impact === 'high' ? 'bg-red-100 text-red-700' : 
                    feature.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }
                >
                  {feature.impact} impact
                </Badge>
                <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                  {feature.effort} effort
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankingChallenge = ({ content, onAnswer, currentAnswer }: any) => {
  const [rankedStakeholders, setRankedStakeholders] = useState(currentAnswer || content.stakeholders);

  const moveStakeholder = (index: number, direction: 'up' | 'down') => {
    const newRanking = [...rankedStakeholders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newRanking.length) {
      [newRanking[index], newRanking[targetIndex]] = [newRanking[targetIndex], newRanking[index]];
      setRankedStakeholders(newRanking);
      onAnswer(newRanking);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">Rank stakeholders by their influence on product decisions (most to least influential):</p>
      
      <div className="space-y-2">
        {rankedStakeholders.map((stakeholder: any, index: number) => (
          <div key={stakeholder.id} className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full text-white text-sm flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-black font-medium">{stakeholder.name}</div>
                  <div className="text-gray-600 text-sm">{stakeholder.role}</div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveStakeholder(index, 'up')}
                  disabled={index === 0}
                  className="h-6 px-2 text-xs border-gray-400"
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveStakeholder(index, 'down')}
                  disabled={index === rankedStakeholders.length - 1}
                  className="h-6 px-2 text-xs border-gray-400"
                >
                  ↓
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenge;
