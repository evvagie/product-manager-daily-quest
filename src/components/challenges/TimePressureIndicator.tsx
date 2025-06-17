
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface TimePressureIndicatorProps {
  timeLeft: number;
  totalTime: number;
  onTimeUp: () => void;
}

export const TimePressureIndicator = ({ timeLeft, totalTime, onTimeUp }: TimePressureIndicatorProps) => {
  const [pulseClass, setPulseClass] = useState('');
  
  const progressPercentage = (timeLeft / totalTime) * 100;
  
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setPulseClass('animate-pulse');
    } else {
      setPulseClass('');
    }
    
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const getProgressColor = () => {
    if (progressPercentage > 50) return 'bg-green-500';
    if (progressPercentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimeColor = () => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-2 ${pulseClass}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Time Remaining</span>
        <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className="h-3"
        />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {timeLeft <= 10 && timeLeft > 0 && (
        <p className="text-red-600 text-sm font-medium animate-pulse">⚠️ Time almost up!</p>
      )}
    </div>
  );
};
