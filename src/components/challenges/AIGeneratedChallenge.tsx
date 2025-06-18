
import React, { useState } from 'react';
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

  const renderAIContent = () => {
    const content = challenge.content;
    const challengeType = challenge.type;

    // Handle different AI-generated interaction types
    switch (challengeType) {
      case 'priority-matrix':
        return renderPriorityMatrix(content);
      case 'feature-voting':
        return renderFeatureVoting(content);
      case 'stakeholder-mapping':
        return renderStakeholderMapping(content);
      case 'timeline-reconstruction':
        return renderTimelineReconstruction(content);
      case 'budget-allocation':
        return renderBudgetAllocation(content);
      case 'slack-simulation':
        return renderSlackSimulation(content);
      default:
        // Default to multiple choice for unknown types
        return renderMultipleChoice(content);
    }
  };

  const renderMultipleChoice = (content: any) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 font-medium">{content.instructions}</p>
      </div>
      
      {content.data && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Supporting Data:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {typeof content.data === 'string' ? content.data : JSON.stringify(content.data, null, 2)}
          </pre>
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

  const renderPriorityMatrix = (content: any) => (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-800 font-medium">{content.instructions}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center font-medium">High Impact</div>
        <div className="text-center font-medium">Low Impact</div>
        {/* This would be a drag-and-drop interface in a full implementation */}
        <div className="min-h-32 border-2 border-dashed border-gray-300 p-4 rounded">
          <p className="text-gray-500 text-sm">High Impact Items</p>
        </div>
        <div className="min-h-32 border-2 border-dashed border-gray-300 p-4 rounded">
          <p className="text-gray-500 text-sm">Low Impact Items</p>
        </div>
      </div>
      {renderMultipleChoice(content)}
    </div>
  );

  const renderFeatureVoting = (content: any) => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-800 font-medium">{content.instructions}</p>
      </div>
      {content.features?.map((feature: any, index: number) => (
        <Card key={index} className="p-4">
          <h4 className="font-medium">{feature.name}</h4>
          <p className="text-gray-600 text-sm">{feature.description}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm mr-2">Vote weight:</span>
            <Slider
              value={[customState[`feature-${index}`] || 0]}
              onValueChange={(value) => {
                setCustomState(prev => ({ ...prev, [`feature-${index}`]: value[0] }));
              }}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="ml-2 text-sm font-mono">
              {customState[`feature-${index}`] || 0}
            </span>
          </div>
        </Card>
      ))}
      <Button 
        onClick={() => onAnswer(customState)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Submit Feature Votes
      </Button>
    </div>
  );

  const renderStakeholderMapping = (content: any) => (
    <div className="space-y-4">
      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-orange-800 font-medium">{content.instructions}</p>
      </div>
      {/* Simplified stakeholder mapping */}
      {renderMultipleChoice(content)}
    </div>
  );

  const renderTimelineReconstruction = (content: any) => (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-indigo-800 font-medium">{content.instructions}</p>
      </div>
      {/* Simplified timeline interface */}
      {renderMultipleChoice(content)}
    </div>
  );

  const renderBudgetAllocation = (content: any) => (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800 font-medium">{content.instructions}</p>
      </div>
      {/* Simplified budget allocation */}
      {renderMultipleChoice(content)}
    </div>
  );

  const renderSlackSimulation = (content: any) => (
    <div className="space-y-4">
      <div className="bg-gray-900 text-white p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">#{content.channel || 'product-team'}</span>
        </div>
        <p className="text-sm">{content.instructions}</p>
      </div>
      {/* Simulate Slack conversation choices */}
      {renderMultipleChoice(content)}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-100 text-purple-700">
              🤖 AI Generated
            </Badge>
            <Badge variant="secondary">
              {challenge.type}
            </Badge>
          </div>
          <CardDescription className="text-gray-700 text-lg">
            {challenge.content.context}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderAIContent()}
        </CardContent>
      </Card>
    </div>
  );
};
