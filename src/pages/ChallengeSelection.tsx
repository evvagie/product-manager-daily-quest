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
  const handleStartSession = () => {
    if (selectedCategory && selectedDifficulty) {
      navigate(`/challenge?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
    }
  };
  return <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Choose Your Challenge</h1>
          <p className="text-gray-400">Select a category and difficulty to begin your session</p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Select Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(category => <Card key={category.id} className={`cursor-pointer transition-all hover:scale-105 ${selectedCategory === category.id ? 'bg-blue-900/50 border-blue-600' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`} onClick={() => setSelectedCategory(category.id)}>
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-lg text-white">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-400 text-sm">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Select Difficulty</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {difficulties.map(difficulty => <Card key={difficulty.id} className={`cursor-pointer transition-all hover:scale-105 ${selectedDifficulty === difficulty.id ? 'bg-green-900/50 border-green-600' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`} onClick={() => setSelectedDifficulty(difficulty.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{difficulty.name}</CardTitle>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {difficulty.xp}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {difficulty.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Session Preview */}
        {selectedCategory && selectedDifficulty && <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-zinc-950">Session Preview</CardTitle>
              <CardDescription className="text-zinc-500">
                Your selected challenge session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-zinc-950">
                    {categories.find(c => c.id === selectedCategory)?.name} • {difficulties.find(d => d.id === selectedDifficulty)?.name}
                  </p>
                  <p className="text-sm text-zinc-500">4 interactive challenges • ~15 minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-medium">{difficulties.find(d => d.id === selectedDifficulty)?.xp}</p>
                  <p className="text-gray-400 text-sm">Potential XP</p>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleStartSession}>
                Start Challenge Session →
              </Button>
            </CardContent>
          </Card>}

        {/* Info Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">1</div>
                <p className="text-gray-300">Choose category & difficulty</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">2</div>
                <p className="text-gray-300">Complete 4 interactive challenges</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">3</div>
                <p className="text-gray-300">Get instant feedback</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">4</div>
                <p className="text-gray-300">Earn XP and improve</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ChallengeSelection;