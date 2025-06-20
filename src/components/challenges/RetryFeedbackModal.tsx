
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type ChallengeSession } from '@/utils/challengeGenerator';

interface RetryFeedbackModalProps {
  challengeSession: ChallengeSession;
  exerciseAnswers: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const RetryFeedbackModal = ({ 
  challengeSession, 
  exerciseAnswers, 
  isOpen, 
  onClose 
}: RetryFeedbackModalProps) => {
  const performanceScore = useMemo(() => {
    let totalScore = 0;
    let validExercises = 0;

    challengeSession.exercises.forEach((exercise, index) => {
      const userAnswer = exerciseAnswers[index];
      if (userAnswer) {
        validExercises++;
        
        // Find the correct option
        const selectedOption = exercise.content.options?.find((opt: any) => opt.id === userAnswer);
        if (selectedOption) {
          // Score based on quality: excellent = 100, good = 80, average = 60, poor = 40
          const qualityScores = {
            excellent: 100,
            good: 80,
            average: 60,
            poor: 40
          };
          
          const score = qualityScores[selectedOption.quality as keyof typeof qualityScores] || 60;
          totalScore += score;
        }
      }
    });

    return validExercises > 0 ? Math.round(totalScore / validExercises) : 0;
  }, [challengeSession, exerciseAnswers]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { color: 'bg-green-100 text-green-700', label: 'Excellent!' };
    if (score >= 70) return { color: 'bg-yellow-100 text-yellow-700', label: 'Good!' };
    return { color: 'bg-red-100 text-red-700', label: 'Needs Improvement' };
  };

  const scoreBadge = getScoreBadge(performanceScore);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-black">
            Challenge Complete! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Performance Score */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-black">Your Performance</h3>
              <div className={`text-5xl font-bold ${getScoreColor(performanceScore)}`}>
                {performanceScore}%
              </div>
              <Badge className={scoreBadge.color}>
                {scoreBadge.label}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={performanceScore} className="h-3" />
              <p className="text-sm text-gray-600">
                Performance Score: {performanceScore}/100
              </p>
            </div>
          </div>

          {/* Challenge Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-black">Challenge Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Title:</span> {challengeSession.exercises[0]?.title}</p>
              <p><span className="font-medium">Category:</span> {challengeSession.skillArea}</p>
              <p><span className="font-medium">Difficulty:</span> {challengeSession.difficulty}</p>
            </div>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
