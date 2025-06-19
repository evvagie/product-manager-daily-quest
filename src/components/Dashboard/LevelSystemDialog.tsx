
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LEVEL_SYSTEM, getCurrentLevel, getNextLevel, Level } from "@/data/levelSystem";
import { CheckCircle, Circle, Trophy, Target, BookOpen } from "lucide-react";

interface LevelSystemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userXP: number;
  currentUserLevel: number;
}

const LevelSystemDialog = ({ isOpen, onClose, userXP, currentUserLevel }: LevelSystemDialogProps) => {
  const currentLevel = getCurrentLevel(userXP);
  const nextLevel = getNextLevel(currentLevel);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Product Manager Level System
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Your journey through product management expertise levels
          </DialogDescription>
        </DialogHeader>

        {/* Current Progress Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Your Current Progress
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Current Level</span>
                <Badge className={`${currentLevel.color} text-white`}>
                  {currentLevel.name} - {currentLevel.title}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-400">{userXP.toLocaleString()} XP</div>
            </div>
            
            {nextLevel && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress to {nextLevel.name}</span>
                  <span className="text-sm text-gray-400">
                    {nextLevel.minXP - userXP} XP needed
                  </span>
                </div>
                <Progress 
                  value={((userXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100} 
                  className="h-3"
                />
              </div>
            )}
          </div>
        </div>

        {/* All Levels Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-400" />
            All Levels Overview
          </h3>
          
          {LEVEL_SYSTEM.map((level) => {
            const isCompleted = userXP >= level.minXP;
            const isCurrent = level.id === currentLevel.id;
            
            return (
              <div 
                key={level.id} 
                className={`border rounded-lg p-4 transition-all ${
                  isCurrent 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : isCompleted 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${level.color} text-white`}>
                          {level.name}
                        </Badge>
                        <h4 className="font-semibold">{level.title}</h4>
                        {isCurrent && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{level.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>{level.minXP.toLocaleString()} - {level.maxXP === Number.MAX_SAFE_INTEGER ? '∞' : level.maxXP.toLocaleString()} XP</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2 text-blue-400">Knowledge Areas</h5>
                    <ul className="space-y-1">
                      {level.knowledge.map((item, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2 text-green-400">Key Skills</h5>
                    <ul className="space-y-1">
                      {level.skills.map((item, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelSystemDialog;
