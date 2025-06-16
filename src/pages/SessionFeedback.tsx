
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const SessionFeedback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const sessionData = location.state
  if (!sessionData) {
    navigate('/dashboard')
    return null
  }

  const { answers, category, difficulty, challenges } = sessionData
  
  // Calculate performance metrics
  const completedChallenges = answers.filter((a: any) => a !== undefined).length
  const completionRate = (completedChallenges / challenges) * 100
  const baseXP = difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 100 : 200
  const earnedXP = Math.round(baseXP * (completionRate / 100))
  
  const [streak, setStreak] = useState(0)
  const [newBadges, setNewBadges] = useState<string[]>([])

  useEffect(() => {
    const saveSessionData = async () => {
      if (!user || loading) return
      
      setLoading(true)
      try {
        // Create session record
        const { data: sessionRecord, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            xp_gagne: earnedXP,
            duree_totale: 15, // Mock duration
            classement_jour: Math.floor(Math.random() * 100) + 1,
            session_complete: completionRate === 100
          })
          .select()
          .single()

        if (sessionError) throw sessionError

        // Update user stats
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('xp, level, streak')
          .eq('id', user.id)
          .single()

        if (userError) throw userError
        if (!userData) throw new Error('User data not found')

        const newXP = userData.xp + earnedXP
        const newLevel = Math.floor(newXP / 1000) + 1
        const newStreak = userData.streak + 1

        const { error: updateError } = await supabase
          .from('users')
          .update({
            xp: newXP,
            level: newLevel,
            streak: newStreak,
            progression_jour: completionRate,
            last_active_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) throw updateError

        setStreak(newStreak)
        
        // Check for new badges
        const badges = []
        if (completedChallenges === challenges) badges.push('Session Complete')
        if (newStreak >= 7) badges.push('Week Warrior')
        if (newLevel > userData.level) badges.push('Level Up!')
        
        setNewBadges(badges)
        
        toast.success(`Session saved! +${earnedXP} XP earned`)
        
      } catch (error: any) {
        console.error('Error saving session:', error)
        toast.error('Failed to save session data')
      } finally {
        setLoading(false)
      }
    }

    saveSessionData()
  }, [user, earnedXP, completionRate, completedChallenges, challenges])

  const getPerformanceMessage = () => {
    if (completionRate === 100) return "Outstanding performance! 🏆"
    if (completionRate >= 75) return "Great job! Keep it up! 💪"
    if (completionRate >= 50) return "Good effort! Room for improvement 📈"
    return "Keep practicing! You'll get there 🎯"
  }

  const getResourceRecommendations = () => {
    const recommendations = [
      {
        title: "Product Management Fundamentals",
        type: "Course",
        description: "Master the basics of product strategy and execution",
        url: "#"
      },
      {
        title: "Data-Driven Product Decisions",
        type: "Article",
        description: "Learn how to use analytics for better PM decisions",
        url: "#"
      },
      {
        title: "Stakeholder Management Guide",
        type: "Guide",
        description: "Navigate complex stakeholder relationships",
        url: "#"
      }
    ]
    
    return recommendations.slice(0, 2) // Show 2 recommendations
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
            <p className="text-gray-400">{getPerformanceMessage()}</p>
          </div>

          {/* Performance Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">{earnedXP}</CardTitle>
                <CardDescription>XP Earned</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400">{completedChallenges}/{challenges}</CardTitle>
                <CardDescription>Challenges Completed</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-400">{streak}</CardTitle>
                <CardDescription>Day Streak</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Session Results</CardTitle>
              <CardDescription className="text-gray-400">
                {category} • {difficulty} • {Math.round(completionRate)}% completion rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Overall Performance</span>
                    <span className="text-white">{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Strengths</h4>
                    <ul className="text-green-400 text-sm space-y-1">
                      <li>• Completed challenges efficiently</li>
                      <li>• Good strategic thinking</li>
                      <li>• Consistent decision-making</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Areas for Growth</h4>
                    <ul className="text-yellow-400 text-sm space-y-1">
                      <li>• Consider stakeholder impact more</li>
                      <li>• Focus on data-driven decisions</li>
                      <li>• Practice prioritization frameworks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Badges */}
          {newBadges.length > 0 && (
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-800 mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  🏅 New Achievements Unlocked!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {newBadges.map((badge, index) => (
                    <Badge key={index} className="bg-yellow-600/20 text-yellow-400 px-3 py-1">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Resources */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Recommended for You</CardTitle>
              <CardDescription className="text-gray-400">
                Resources to help you improve your PM skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getResourceRecommendations().map((resource, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium">{resource.title}</h4>
                          <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{resource.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/challenge-selection')}
            >
              Try Another Session
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-600 text-white hover:bg-gray-800"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionFeedback
