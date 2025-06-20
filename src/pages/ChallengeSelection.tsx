
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ChallengeSelection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const categories = [{
    id: "strategy",
    name: "Product Strategy",
    description: "Vision, roadmapping, and competitive analysis",
    icon: "🎯",
    color: "blue"
  }, {
    id: "research",
    name: "User Research",
    description: "User interviews, surveys, and insights",
    icon: "🔍",
    color: "green"
  }, {
    id: "analytics",
    name: "Data & Analytics",
    description: "Metrics, A/B testing, and data interpretation",
    icon: "📊",
    color: "purple"
  }, {
    id: "design",
    name: "Product Design",
    description: "UX principles, wireframing, and prototyping",
    icon: "🎨",
    color: "pink"
  }];

  const difficulties = [{
    id: "beginner",
    name: "Beginner",
    description: "Perfect for getting started",
    xp: "50-100 XP"
  }, {
    id: "intermediate",
    name: "Intermediate",
    description: "For developing PMs",
    xp: "100-200 XP"
  }, {
    id: "advanced",
    name: "Advanced",
    description: "Challenge yourself",
    xp: "200-300 XP"
  }];

  // Helper function to get difficulty card styles
  const getDifficultyCardStyles = (difficultyId: string, isSelected: boolean) => {
    const baseClasses = "cursor-pointer transition-all hover:scale-105";
    
    // Always show gradient colors, not just when selected
    if (difficultyId === 'beginner') {
      return `${baseClasses} bg-gradient-to-r from-sky-200 to-purple-400 ${isSelected ? 'ring-2 ring-sky-300 ring-offset-2' : 'border-sky-200'}`;
    } else if (difficultyId === 'intermediate') {
      return `${baseClasses} bg-gradient-to-r from-purple-200 to-pink-300 ${isSelected ? 'ring-2 ring-purple-300 ring-offset-2' : 'border-purple-200'}`;
    } else if (difficultyId === 'advanced') {
      return `${baseClasses} bg-gradient-to-r from-purple-500 to-blue-500 ${isSelected ? 'ring-2 ring-purple-400 ring-offset-2' : 'border-purple-500'}`;
    }
    
    return `${baseClasses} bg-white border-gray-200 hover:border-gray-300`;
  };

  const handleStartSession = () => {
    if (selectedCategory && selectedDifficulty) {
      navigate(`/challenge?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0 font-medium text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Challenge</h1>
          <p className="text-gray-600 text-sm sm:text-base">Select a category and difficulty to begin your session</p>
        </div>

        {/* Category Selection */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">1. Select Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map(category => (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-300 ring-2 ring-blue-300 ring-offset-2' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200 hover:border-gray-300'
                }`} 
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader className="text-center pb-2 px-3 sm:px-6">
                  <div className="text-3xl sm:text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-base sm:text-lg text-black">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-3 sm:px-6">
                  <CardDescription className="text-gray-600 text-xs sm:text-sm">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">2. Select Difficulty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {difficulties.map(difficulty => (
              <Card 
                key={difficulty.id} 
                className={getDifficultyCardStyles(difficulty.id, selectedDifficulty === difficulty.id)}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base sm:text-lg text-white">
                      {difficulty.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
                      {difficulty.xp}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <CardDescription className="text-white/80 text-xs sm:text-sm">
                    {difficulty.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Session Preview */}
        {selectedCategory && selectedDifficulty && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6 sm:mb-8">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-black">Session Preview</CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Your selected challenge session
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <p className="font-medium text-black text-sm sm:text-base">
                    {categories.find(c => c.id === selectedCategory)?.name} • {difficulties.find(d => d.id === selectedDifficulty)?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">4 interactive challenges • ~20 minutes</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-blue-600 font-medium text-sm sm:text-base">{difficulties.find(d => d.id === selectedDifficulty)?.xp}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Potential XP</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white animate-pulse font-medium text-sm sm:text-base py-2 sm:py-3" 
                onClick={handleStartSession}
              >
                Start Challenge Session →
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChallengeSelection;
