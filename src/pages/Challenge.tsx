import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
interface ChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'drag-drop' | 'multiple-choice' | 'ranking' | 'scenario';
  content: any;
  timeLimit?: number;
}
const Challenge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per challenge
  const [sessionStarted, setSessionStarted] = useState(false);

  // Mock challenges data
  const challenges: ChallengeData[] = [{
    id: '1',
    title: 'Prioritize Features',
    description: 'Drag and drop features in order of priority for your product roadmap',
    type: 'drag-drop',
    content: {
      features: [{
        id: 'f1',
        name: 'User Authentication',
        impact: 'high',
        effort: 'medium'
      }, {
        id: 'f2',
        name: 'Push Notifications',
        impact: 'medium',
        effort: 'low'
      }, {
        id: 'f3',
        name: 'Advanced Analytics',
        impact: 'high',
        effort: 'high'
      }, {
        id: 'f4',
        name: 'Dark Mode',
        impact: 'low',
        effort: 'low'
      }, {
        id: 'f5',
        name: 'API Integration',
        impact: 'high',
        effort: 'high'
      }]
    },
    timeLimit: 180
  }, {
    id: '2',
    title: 'Interpret User Feedback',
    description: 'Analyze user feedback and choose the best action',
    type: 'multiple-choice',
    content: {
      scenario: "Users are complaining that the app is too slow during peak hours. You have limited engineering resources.",
      options: [{
        id: 'a',
        text: 'Immediately add more servers',
        impact: 'Quick fix but expensive'
      }, {
        id: 'b',
        text: 'Optimize existing code first',
        impact: 'Takes time but cost-effective'
      }, {
        id: 'c',
        text: 'Ignore feedback and focus on new features',
        impact: 'Risky for user satisfaction'
      }, {
        id: 'd',
        text: 'Conduct performance audit first',
        impact: 'Data-driven but takes time'
      }]
    },
    timeLimit: 120
  }, {
    id: '3',
    title: 'Stakeholder Management',
    description: 'Rank these stakeholders by influence on your product decision',
    type: 'ranking',
    content: {
      stakeholders: [{
        id: 's1',
        name: 'CEO',
        role: 'Sets company vision'
      }, {
        id: 's2',
        name: 'Lead Developer',
        role: 'Implementation feasibility'
      }, {
        id: 's3',
        name: 'Marketing Manager',
        role: 'User acquisition'
      }, {
        id: 's4',
        name: 'Customer Support',
        role: 'User pain points'
      }, {
        id: 's5',
        name: 'Sales Team',
        role: 'Revenue impact'
      }]
    },
    timeLimit: 150
  }, {
    id: '4',
    title: 'Product Launch Strategy',
    description: 'Choose your go-to-market strategy for a new feature',
    type: 'scenario',
    content: {
      situation: "You've developed a new AI-powered recommendation feature. It's ready to launch but you need to decide the rollout strategy.",
      options: [{
        id: 'o1',
        strategy: 'Full Launch',
        description: 'Release to all users immediately',
        pros: ['Maximum impact', 'Quick feedback'],
        cons: ['High risk if bugs exist', 'Support overload']
      }, {
        id: 'o2',
        strategy: 'Beta Testing',
        description: 'Release to 10% of users first',
        pros: ['Controlled rollout', 'Early feedback'],
        cons: ['Slower adoption', 'Complex rollback']
      }, {
        id: 'o3',
        strategy: 'Premium First',
        description: 'Launch to paid users only',
        pros: ['Revenue impact', 'Loyal user feedback'],
        cons: ['Limited reach', 'May create inequality']
      }]
    },
    timeLimit: 200
  }];
  const currentChallengeData = challenges[currentChallenge];
  const progress = (currentChallenge + 1) / challenges.length * 100;
  useEffect(() => {
    if (sessionStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionStarted, timeLeft]);
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
  };
  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(challenges[currentChallenge + 1].timeLimit || 300);
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
  if (!sessionStarted) {
    return <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/challenge-selection')} className="mb-4 text-gray-400 hover:text-white">
              ← Back to Selection
            </Button>

            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-2xl text-white">Ready to Begin?</CardTitle>
                <CardDescription className="text-gray-400">
                  {category} • {difficulty} • 4 Challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <p className="text-gray-300 mb-4">
                    You're about to start an interactive PM challenge session. Each challenge will test different aspects of product management.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-100">
                      <p className="text-blue-400 font-semibold">15 minutes</p>
                      <p className="text-sm text-zinc-950 py-0">Total estimated time</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-green-400 font-semibold">50-200 XP</p>
                      <p className="text-gray-400 text-sm">Potential rewards</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleStartSession}>
                  Start Challenge Session →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 mb-2">
                Challenge {currentChallenge + 1} of {challenges.length}
              </Badge>
              <h1 className="text-2xl font-bold">{currentChallengeData.title}</h1>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-blue-400">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-400">Time remaining</div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-gray-400 text-sm">{Math.round(progress)}% complete</p>
        </div>

        {/* Challenge Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardDescription className="text-gray-300 text-lg">
                {currentChallengeData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Render different challenge types */}
              {currentChallengeData.type === 'drag-drop' && <DragDropChallenge content={currentChallengeData.content} onAnswer={handleAnswer} currentAnswer={answers[currentChallenge]} />}
              
              {currentChallengeData.type === 'multiple-choice' && <MultipleChoiceChallenge content={currentChallengeData.content} onAnswer={handleAnswer} currentAnswer={answers[currentChallenge]} />}

              {currentChallengeData.type === 'ranking' && <RankingChallenge content={currentChallengeData.content} onAnswer={handleAnswer} currentAnswer={answers[currentChallenge]} />}

              {currentChallengeData.type === 'scenario' && <ScenarioChallenge content={currentChallengeData.content} onAnswer={handleAnswer} currentAnswer={answers[currentChallenge]} />}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800" onClick={() => navigate('/challenge-selection')}>
              Exit Session
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNext} disabled={!answers[currentChallenge]}>
              {currentChallenge === challenges.length - 1 ? 'Complete Session' : 'Next Challenge'} →
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

// Challenge Components
const DragDropChallenge = ({
  content,
  onAnswer,
  currentAnswer
}: any) => {
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
  return <div className="space-y-4">
      <p className="text-gray-300 mb-4">Drag features to reorder them by priority (highest to lowest):</p>
      
      <div className="space-y-2">
        {orderedFeatures.map((feature: any, index: number) => <div key={feature.id} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, index)} className="p-4 bg-gray-800 rounded-lg border border-gray-700 cursor-move hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded text-white text-sm flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{feature.name}</span>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary" className={feature.impact === 'high' ? 'bg-red-600/20 text-red-400' : feature.impact === 'medium' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-green-600/20 text-green-400'}>
                  {feature.impact} impact
                </Badge>
                <Badge variant="secondary" className="bg-gray-600/20 text-gray-400">
                  {feature.effort} effort
                </Badge>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
const MultipleChoiceChallenge = ({
  content,
  onAnswer,
  currentAnswer
}: any) => {
  return <div className="space-y-4">
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-6">
        <p className="text-gray-300">{content.scenario}</p>
      </div>
      
      <div className="space-y-3">
        {content.options.map((option: any) => <button key={option.id} onClick={() => onAnswer(option.id)} className={`w-full p-4 text-left rounded-lg border transition-colors ${currentAnswer === option.id ? 'bg-blue-900/50 border-blue-600' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
            <div className="text-white font-medium mb-1">{option.text}</div>
            <div className="text-gray-400 text-sm">{option.impact}</div>
          </button>)}
      </div>
    </div>;
};
const RankingChallenge = ({
  content,
  onAnswer,
  currentAnswer
}: any) => {
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
  return <div className="space-y-4">
      <p className="text-gray-300 mb-4">Rank stakeholders by their influence on product decisions (most to least influential):</p>
      
      <div className="space-y-2">
        {rankedStakeholders.map((stakeholder: any, index: number) => <div key={stakeholder.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full text-white text-sm flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{stakeholder.name}</div>
                  <div className="text-gray-400 text-sm">{stakeholder.role}</div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button size="sm" variant="outline" onClick={() => moveStakeholder(index, 'up')} disabled={index === 0} className="h-6 px-2 text-xs border-gray-600">
                  ↑
                </Button>
                <Button size="sm" variant="outline" onClick={() => moveStakeholder(index, 'down')} disabled={index === rankedStakeholders.length - 1} className="h-6 px-2 text-xs border-gray-600">
                  ↓
                </Button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
const ScenarioChallenge = ({
  content,
  onAnswer,
  currentAnswer
}: any) => {
  return <div className="space-y-4">
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-6">
        <p className="text-gray-300">{content.situation}</p>
      </div>
      
      <div className="grid gap-4">
        {content.options.map((option: any) => <button key={option.id} onClick={() => onAnswer(option.id)} className={`p-4 text-left rounded-lg border transition-colors ${currentAnswer === option.id ? 'bg-blue-900/50 border-blue-600' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
            <div className="text-white font-bold mb-2">{option.strategy}</div>
            <div className="text-gray-300 mb-3">{option.description}</div>
            <div className="flex space-x-4 text-sm">
              <div>
                <span className="text-green-400 font-medium">Pros:</span>
                <ul className="text-gray-400 ml-2">
                  {option.pros.map((pro: string, i: number) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-red-400 font-medium">Cons:</span>
                <ul className="text-gray-400 ml-2">
                  {option.cons.map((con: string, i: number) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
          </button>)}
      </div>
    </div>;
};
export default Challenge;