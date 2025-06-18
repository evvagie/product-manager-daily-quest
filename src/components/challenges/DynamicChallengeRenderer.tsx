import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { KPIDisplay } from './KPIDisplay';
import { TeamChat } from './TeamChat';
import { ConsequenceDisplay } from './ConsequenceDisplay';
import { AIGeneratedChallenge } from './AIGeneratedChallenge';

interface DynamicChallengeRendererProps {
  challenge: any;
  onAnswer: (answer: any) => void;
  currentAnswer: any;
  showConsequences: boolean;
}

export const DynamicChallengeRenderer = ({ 
  challenge, 
  onAnswer, 
  currentAnswer, 
  showConsequences 
}: DynamicChallengeRendererProps) => {
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({});
  const [resourceAllocation, setResourceAllocation] = useState<{ [key: string]: number }>({});
  const [conversationState, setConversationState] = useState(0);

  // Add debugging
  console.log('Rendering challenge:', {
    type: challenge.type,
    formatType: challenge.format?.type,
    source: challenge.source,
    content: challenge.content
  });

  // Check if this is an AI-generated challenge
  if (challenge.source === 'openai' || challenge.generatedAt) {
    console.log('Rendering AI-generated challenge');
    return (
      <AIGeneratedChallenge
        challenge={challenge}
        onAnswer={onAnswer}
        currentAnswer={currentAnswer}
        showConsequences={showConsequences}
      />
    );
  }

  const getQualityBadge = (quality: string) => {
    const qualityConfig = {
      excellent: { color: 'bg-green-100 text-green-700', label: '✓ Excellent' },
      good: { color: 'bg-blue-100 text-blue-700', label: '✓ Good' },
      average: { color: 'bg-yellow-100 text-yellow-700', label: '~ Average' },
      poor: { color: 'bg-red-100 text-red-700', label: '✗ Poor' }
    };
    
    const config = qualityConfig[quality as keyof typeof qualityConfig] || qualityConfig.average;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const renderChallengeContent = () => {
    // Use challenge.type (which comes from format.interactionType) for switching
    const challengeType = challenge.type;
    
    console.log('Rendering challenge type:', challengeType);
    
    switch (challengeType) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'slider':
        return renderTradeOffSlider();
      case 'drag-drop':
        return renderResourceAllocation();
      case 'dialogue':
        return renderDialogueTree();
      case 'ranking':
        return renderRetrospective();
      default:
        console.warn('Unknown challenge type, falling back to multiple choice:', challengeType);
        return renderMultipleChoiceFallback();
    }
  };

  const renderMultipleChoiceFallback = () => {
    // Fallback for unrecognized challenge types - always show options if they exist
    const options = challenge.content?.options || [];
    
    if (options.length === 0) {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">{challenge.content?.context || 'Challenge context not available'}</p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">This challenge format is not fully supported yet.</p>
            <Button 
              onClick={() => onAnswer('fallback-complete')}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Mark as Complete
            </Button>
          </div>
        </div>
      );
    }
    
    return renderMultipleChoice();
  };

  const renderMultipleChoice = () => (
    <div className="space-y-4">
      {challenge.content.teamMessages && (
        <TeamChat messages={challenge.content.teamMessages} />
      )}
      
      <div className="space-y-3">
        {challenge.content.options?.map((option: any) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              currentAnswer === option.id 
                ? 'bg-blue-50 border-blue-600' 
                : 'bg-gray-50 border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-black font-medium mb-1">{option.text}</div>
                {option.description && (
                  <div className="text-gray-600 text-sm">{option.description}</div>
                )}
                {currentAnswer === option.id && option.explanation && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>Feedback:</strong> {option.explanation}
                  </div>
                )}
              </div>
              {currentAnswer === option.id && option.quality && (
                <div className="ml-3">
                  {getQualityBadge(option.quality)}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTradeOffSlider = () => {
    const tradeOffs = challenge.content.tradeOffs || [];
    
    return (
      <div className="space-y-6">
        <p className="text-gray-700">{challenge.content.constraints}</p>
        
        {tradeOffs.map((tradeOff: any, index: number) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-black">{tradeOff.name}</label>
              <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                {sliderValues[tradeOff.name] || tradeOff.value}%
              </Badge>
            </div>
            <Slider
              value={[sliderValues[tradeOff.name] || tradeOff.value]}
              onValueChange={(value) => {
                const newValues = { ...sliderValues, [tradeOff.name]: value[0] };
                setSliderValues(newValues);
                onAnswer(newValues);
              }}
              max={tradeOff.max}
              step={1}
              className="w-full"
            />
          </div>
        ))}
        
        <div className="mt-6 space-y-2">
          {challenge.content.options?.map((option: any) => (
            <Button
              key={option.id}
              variant="outline"
              onClick={() => {
                const preset = option.text.includes('70/30') ? { [tradeOffs[0].name]: 70, [tradeOffs[1].name]: 30 } :
                             option.text.includes('30/70') ? { [tradeOffs[0].name]: 30, [tradeOffs[1].name]: 70 } :
                             { [tradeOffs[0].name]: 50, [tradeOffs[1].name]: 50 };
                setSliderValues(preset);
                onAnswer(preset);
              }}
              className="w-full border-gray-400 text-black hover:bg-gray-100"
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderResourceAllocation = () => {
    const priorities = challenge.content.priorities || [];
    const totalResources = challenge.content.totalResources || 10;
    const allocated = Object.values(resourceAllocation).reduce((sum: number, val: number) => sum + val, 0);
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-medium">
            Resources Used: {allocated} / {totalResources}
          </p>
          <p className="text-blue-600 text-sm">
            Remaining: {totalResources - allocated}
          </p>
        </div>

        {priorities.map((priority: any) => (
          <Card key={priority.id} className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-black">{priority.name}</h4>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Impact: {priority.impact}/5
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Urgency: {priority.urgency}/5
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = resourceAllocation[priority.id] || 1;
                    if (current > 1) {
                      const newAllocation = { ...resourceAllocation, [priority.id]: current - 1 };
                      setResourceAllocation(newAllocation);
                      onAnswer(newAllocation);
                    }
                  }}
                  disabled={!resourceAllocation[priority.id] || resourceAllocation[priority.id] <= 1}
                  className="border-gray-400"
                >
                  -
                </Button>
                
                <span className="w-8 text-center font-mono">
                  {resourceAllocation[priority.id] || 1}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = resourceAllocation[priority.id] || 1;
                    if (allocated < totalResources && current < 4) {
                      const newAllocation = { ...resourceAllocation, [priority.id]: current + 1 };
                      setResourceAllocation(newAllocation);
                      onAnswer(newAllocation);
                    }
                  }}
                  disabled={allocated >= totalResources || (resourceAllocation[priority.id] || 1) >= 4}
                  className="border-gray-400"
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDialogueTree = () => {
    const conversation = challenge.content.conversation?.[conversationState] || challenge.content.conversation?.[0];
    
    return (
      <div className="space-y-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {conversation?.speaker?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">{conversation?.speaker}</p>
                <p className="text-gray-700 mt-1">{conversation?.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">How do you respond?</p>
          {conversation?.responses?.map((response: any) => (
            <button
              key={response.id}
              onClick={() => {
                onAnswer(response);
                setConversationState(conversationState + 1);
              }}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                currentAnswer?.id === response.id 
                  ? 'bg-blue-50 border-blue-600' 
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-black">{response.text}</div>
                  <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-700">
                    {response.tone}
                  </Badge>
                  {currentAnswer?.id === response.id && response.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>Feedback:</strong> {response.explanation}
                    </div>
                  )}
                </div>
                {currentAnswer?.id === response.id && response.quality && (
                  <div className="ml-3">
                    {getQualityBadge(response.quality)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRetrospective = () => {
    const retrospective = challenge.content.retrospectiveData;
    
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <h4 className="font-medium text-green-800">What Went Well</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              {retrospective?.whatWentWell?.map((item: string, index: number) => (
                <p key={index} className="text-green-700 text-sm">✓ {item}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <h4 className="font-medium text-red-800">What Went Wrong</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              {retrospective?.whatWentWrong?.map((item: string, index: number) => (
                <p key={index} className="text-red-700 text-sm">✗ {item}</p>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <h4 className="font-medium text-black mb-3">Priority Improvements</h4>
          <div className="space-y-2">
            {challenge.content.options?.map((option: any) => (
              <button
                key={option.id}
                onClick={() => onAnswer(option.id)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  currentAnswer === option.id 
                    ? 'bg-blue-50 border-blue-600' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-black">{option.text}</span>
                    {currentAnswer === option.id && option.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Feedback:</strong> {option.explanation}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Priority: {option.priority}/3
                    </Badge>
                    {currentAnswer === option.id && option.quality && getQualityBadge(option.quality)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardDescription className="text-gray-700 text-lg">
            {challenge.content.context}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderChallengeContent()}
        </CardContent>
      </Card>

      {challenge.content.incidentData && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <h4 className="font-medium text-yellow-800">Incident Data</h4>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-black mb-2">Timeline</h5>
                {challenge.content.incidentData.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">{event.time}</span>
                    <span className="text-gray-800">{event.event}</span>
                  </div>
                ))}
              </div>
              <div>
                <h5 className="font-medium text-black mb-2">Impact</h5>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">Users Affected: <span className="font-medium">{challenge.content.incidentData.impact.usersAffected}</span></p>
                  <p className="text-gray-700">Downtime: <span className="font-medium">{challenge.content.incidentData.impact.downtime}</span></p>
                  <p className="text-gray-700">Revenue Impact: <span className="font-medium">{challenge.content.incidentData.impact.revenueImpact}</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
