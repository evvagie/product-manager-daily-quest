import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { generatePersonalizedFeedback } from "@/utils/feedbackGenerator"

const SessionFeedback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [personalizedFeedback, setPersonalizedFeedback] = useState<any>(null)
  
  const sessionData = location.state
  if (!sessionData) {
    navigate('/dashboard')
    return null
  }

  const { challenge, answer, timeUsed } = sessionData
  
  // Extract category and difficulty from challenge or URL params
  const category = challenge?.content?.category || 'general'
  const difficulty = challenge?.content?.difficulty || 'beginner'
  
  // For single challenge format, we have 1 challenge and 1 answer
  const answers = answer ? [answer] : []
  const challenges = 1
  
  // Calculate performance metrics
  const completedChallenges = answers.filter((a: any) => a !== undefined).length
  const completionRate = (completedChallenges / challenges) * 100
  const baseXP = difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 100 : 200
  const earnedXP = Math.round(baseXP * (completionRate / 100))
  
  const [streak, setStreak] = useState(0)
  const [newBadges, setNewBadges] = useState<string[]>([])

  useEffect(() => {
    const generateFeedback = async () => {
      try {
        // Get previous session score for comparison
        let previousScore = null;
        if (user) {
          const { data: recentSessions } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2);
          
          if (recentSessions && recentSessions.length > 1) {
            // Calculate previous score based on XP and completion
            const prevSession = recentSessions[1];
            previousScore = Math.round((prevSession.xp_gagne / baseXP) * 100);
          }
        }
        
        const feedback = generatePersonalizedFeedback(
          { answers, category, difficulty, challenges },
          previousScore
        );
        
        setPersonalizedFeedback(feedback);
      } catch (error) {
        console.error('Error generating feedback:', error);
        // Fallback to basic feedback if generation fails
        setPersonalizedFeedback({
          score: Math.round(completionRate * 0.8),
          strengths: ["You completed the challenge successfully"],
          improvements: ["Keep practicing to improve your PM skills"],
          progress_statement: "You're making progress in your PM journey",
          recommendation: "Try another session to continue improving your skills"
        });
      }
    };

    generateFeedback();
  }, [answers, category, difficulty, challenges, user, baseXP, completionRate]);

  useEffect(() => {
    const saveSessionData = async () => {
      if (!user || loading || !personalizedFeedback) return
      
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

        // Get current user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('xp, level, streak')
          .eq('id', user.id)
          .single()

        if (userError) throw userError
        if (!userData) throw new Error('User data not found')

        const newXP = userData.xp + earnedXP
        const newLevel = Math.floor(newXP / 1000) + 1

        // Update user stats (XP, level, progression) but let the streak function handle streak calculation
        const { error: updateError } = await supabase
          .from('users')
          .update({
            xp: newXP,
            level: newLevel,
            progression_jour: personalizedFeedback.score,
            last_active_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) throw updateError

        // Update streak using the realistic calculation function
        const { data: updatedStreak, error: streakError } = await supabase
          .rpc('update_user_streak', { user_uuid: user.id });

        if (streakError) {
          console.error('Error updating streak:', streakError);
          setStreak(userData.streak); // Fallback to current streak
        } else {
          setStreak(updatedStreak || 0);
        }
        
        // Check for new badges
        const badges = []
        if (completedChallenges === challenges) badges.push('Session Complete')
        if ((updatedStreak || 0) >= 7) badges.push('Week Warrior')
        if (newLevel > userData.level) badges.push('Level Up!')
        if (personalizedFeedback.score >= 85) badges.push('High Performer')
        
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
  }, [user, earnedXP, completionRate, completedChallenges, challenges, personalizedFeedback])

  const getPerformanceMessage = () => {
    if (!personalizedFeedback) return "Analyzing your performance..."
    
    const score = personalizedFeedback.score
    if (score >= 85) return "Outstanding performance! 🏆"
    if (score >= 75) return "Great job! Keep it up! 💪"
    if (score >= 60) return "Good effort! You're improving 📈"
    return "Keep practicing! You're learning 🎯"
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
    
    return recommendations.slice(0, 2)
  }

  if (!personalizedFeedback) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your performance...</p>
        </div>
      </div>
    )
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
                <CardTitle className="text-2xl text-blue-400">{personalizedFeedback.score}%</CardTitle>
                <CardDescription>Performance Score</CardDescription>
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

          {/* Personalized Feedback */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Your Performance Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                {category} • {difficulty} • {personalizedFeedback.progress_statement}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Overall Performance</span>
                    <span className="text-white">{personalizedFeedback.score}%</span>
                  </div>
                  <Progress value={personalizedFeedback.score} className="h-3" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      What You Did Well
                    </h4>
                    <ul className="text-green-400 text-sm space-y-2">
                      {personalizedFeedback.strengths.map((strength: string, index: number) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <span className="text-yellow-400 mr-2">📈</span>
                      Areas to Improve
                    </h4>
                    <ul className="text-yellow-400 text-sm space-y-2">
                      {personalizedFeedback.improvements.map((improvement: string, index: number) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Recommendation for You
                  </h4>
                  <p className="text-gray-300 text-sm">{personalizedFeedback.recommendation}</p>
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
