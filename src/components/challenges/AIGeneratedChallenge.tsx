
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface AIGeneratedChallengeProps {
  challenge: any;
  onAnswer: (answer: any) => void;
  currentAnswer: any;
  showConsequences: boolean;
}

export const AIGeneratedChallenge = ({ 
  challenge, 
  onAnswer, 
  currentAnswer, 
  showConsequences 
}: AIGeneratedChallengeProps) => {
  const [customState, setCustomState] = useState<any>({});

  console.log('Rendering AI-generated challenge:', challenge);

  const getQualityBadge = useCallback((quality: string) => {
    const qualityConfig = {
      excellent: { color: 'bg-green-100 text-green-700', label: '✓ Excellent' },
      good: { color: 'bg-blue-100 text-blue-700', label: '✓ Good' },
      average: { color: 'bg-yellow-100 text-yellow-700', label: '~ Average' },
      poor: { color: 'bg-red-100 text-red-700', label: '✗ Poor' }
    };
    
    const config = qualityConfig[quality as keyof typeof qualityConfig] || qualityConfig.average;
    return <Badge className={config.color}>{config.label}</Badge>;
  }, []);

  const renderAIContent = () => {
    const content = challenge.content;
    const challengeType = challenge.type;

    // Handle different AI-generated interaction types
    switch (challengeType) {
      case 'slider':
        return renderSliderChallenge(content);
      case 'drag-drop':
        return renderDragDropChallenge(content);
      case 'dialogue':
        return renderDialogueChallenge(content);
      case 'ranking':
        return renderRankingChallenge(content);
      case 'priority-matrix':
        return renderPriorityMatrix(content);
      case 'stakeholder-mapping':
        return renderStakeholderMapping(content);
      case 'budget-allocation':
        return renderBudgetAllocation(content);
      default:
        // Default to multiple choice for all types including custom ones
        return renderMultipleChoice(content);
    }
  };

  const renderMultipleChoice = (content: any) => (
    <div className="space-y-4">
      {content.instructions && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-medium">{content.instructions}</p>
        </div>
      )}
      
      {content.data && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Context & Data:</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {typeof content.data === 'string' ? content.data : JSON.stringify(content.data, null, 2)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {content.options?.map((option: any) => (
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
                    <strong>Reasoning:</strong> {option.explanation}
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

  const renderSliderChallenge = (content: any) => (
    <div className="space-y-4">
      {content.instructions && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-800 font-medium">{content.instructions}</p>
        </div>
      )}
      
      {content.tradeOffs?.map((tradeOff: any, index: number) => (
        <div key={index} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-black">{tradeOff.name}</label>
            <Badge variant="secondary" className="bg-blue-100 text-blue-600">
              {customState[tradeOff.name] || tradeOff.defaultValue || 50}%
            </Badge>
          </div>
          <Slider
            value={[customState[tradeOff.name] || tradeOff.defaultValue || 50]}
            onValueChange={(value) => {
              const newState = { ...customState, [tradeOff.name]: value[0] };
              setCustomState(newState);
              onAnswer(newState);
            }}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      )) || renderMultipleChoice(content)}
    </div>
  );

  const renderDragDropChallenge = (content: any) => (
    <div className="space-y-4">
      {content.instructions && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 font-medium">{content.instructions}</p>
        </div>
      )}
      {/* Simplified to multiple choice for now */}
      {renderMultipleChoice(content)}
    </div>
  );

  const renderDialogueChallenge = (content: any) => {
    const conversation = content.conversation?.[0];
    if (!conversation) return renderMultipleChoice(content);

    return (
      <div className="space-y-4">
        {content.instructions && (
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-800 font-medium">{content.instructions}</p>
          </div>
        )}
        
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {conversation.speaker?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">{conversation.speaker}</p>
                <p className="text-gray-700 mt-1">{conversation.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">How do you respond?</p>
          {conversation.responses?.map((response: any) => (
            <button
              key={response.id}
              onClick={() => onAnswer(response.id)}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                currentAnswer === response.id 
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
                  {currentAnswer === response.id && response.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>Impact:</strong> {response.explanation}
                    </div>
                  )}
                </div>
                {currentAnswer === response.id && response.quality && (
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

  const renderRankingChallenge = (content: any) => {
    if (content.retrospectiveData) {
      return (
        <div className="space-y-6">
          {content.instructions && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 font-medium">{content.instructions}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <h4 className="font-medium text-green-800">What Went Well</h4>
              </CardHeader>
              <CardContent className="space-y-2">
                {content.retrospectiveData.whatWentWell?.map((item: string, index: number) => (
                  <p key={index} className="text-green-700 text-sm">✓ {item}</p>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <h4 className="font-medium text-red-800">What Went Wrong</h4>
              </CardHeader>
              <CardContent className="space-y-2">
                {content.retrospectiveData.whatWentWrong?.map((item: string, index: number) => (
                  <p key={index} className="text-red-700 text-sm">✗ {item}</p>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="font-medium text-black mb-3">Priority Actions</h4>
            <div className="space-y-2">
              {content.options?.map((option: any) => (
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
                          <strong>Impact:</strong> {option.explanation}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {option.priority && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Priority: {option.priority}/3
                        </Badge>
                      )}
                      {currentAnswer === option.id && option.quality && getQualityBadge(option.quality)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return renderMultipleChoice(content);
  };

  const renderPriorityMatrix = (content: any) => renderMultipleChoice(content);
  const renderStakeholderMapping = (content: any) => renderMultipleChoice(content);
  const renderBudgetAllocation = (content: any) => renderMultipleChoice(content);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-purple-100 text-purple-700">
              🤖 AI Generated
            </Badge>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {challenge.skillArea}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {challenge.difficulty}
              </Badge>
            </div>
          </div>
          <CardDescription className="text-gray-700 text-lg">
            {challenge.content.context}
          </CardDescription>
          {challenge.content.scenario && (
            <div className="mt-2 p-3 bg-white bg-opacity-50 rounded-lg">
              <p className="text-gray-800 text-sm font-medium">Scenario:</p>
              <p className="text-gray-700 text-sm">{challenge.content.scenario}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {renderAIContent()}
        </CardContent>
      </Card>
    </div>
  );
};
