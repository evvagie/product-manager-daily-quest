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
import { usePersonalizedRecommendation } from "@/hooks/usePersonalizedRecommendation"
import { useSecondPersonalizedRecommendation } from "@/hooks/useSecondPersonalizedRecommendation"
import { useThirdPersonalizedRecommendation } from "@/hooks/useThirdPersonalizedRecommendation"

const SessionFeedback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [personalizedFeedback, setPersonalizedFeedback] = useState<any>(null)
  const [streak, setStreak] = useState(0)
  const [newBadges, setNewBadges] = useState<string[]>([])
  const [sessionSaved, setSessionSaved] = useState(false)
  
  const sessionData = location.state
  if (!sessionData) {
    navigate('/dashboard')
    return null
  }

  // Handle both single challenge (legacy) and multi-exercise session formats
  const { challengeSession, exerciseAnswers, challenge, answer, timeUsed } = sessionData
  
  // Extract category and difficulty
  const category = challengeSession?.skillArea || challenge?.content?.category || 'general'
  const difficulty = challengeSession?.difficulty || challenge?.content?.difficulty || 'beginner'
  
  // For multi-exercise sessions vs single challenge
  const answers = exerciseAnswers || (answer ? [answer] : [])
  const totalExercises = challengeSession?.totalExercises || 1
  
  // Fixed scoring calculation to properly extract and evaluate user answers
  const calculateExerciseScores = () => {
    if (!challengeSession?.exercises || !exerciseAnswers) {
      console.log('No exercises or answers found for scoring');
      return [];
    }
    
    console.log('Calculating scores for exercises:', challengeSession.exercises.length);
    console.log('Exercise answers:', exerciseAnswers);
    
    return challengeSession.exercises.map((exercise: any, index: number) => {
      const exerciseAnswer = exerciseAnswers[index];
      console.log(`Exercise ${index + 1} answer:`, exerciseAnswer);
      
      if (!exerciseAnswer || !exercise.content?.options) {
        console.log(`No answer or options for exercise ${index + 1}`);
        return { 
          score: 0, 
          isCorrect: false, 
          correctAnswer: 'N/A', 
          userAnswer: 'No answer provided',
          questionTitle: exercise.title || `Exercise ${index + 1}`
        };
      }
      
      const correctOption = exercise.content.options.find((opt: any) => opt.isCorrect);
      
      // Try multiple property names to find the selected option
      let selectedOption = null;
      let userSelectedId = null;
      
      // Check different possible property names for the user's selection
      if (exerciseAnswer.selectedOptionId) {
        userSelectedId = exerciseAnswer.selectedOptionId;
      } else if (exerciseAnswer.selectedOption) {
        userSelectedId = exerciseAnswer.selectedOption;
      } else if (exerciseAnswer.answer) {
        userSelectedId = exerciseAnswer.answer;
      } else if (exerciseAnswer.optionId) {
        userSelectedId = exerciseAnswer.optionId;
      } else if (typeof exerciseAnswer === 'string') {
        userSelectedId = exerciseAnswer;
      }
      
      console.log(`Exercise ${index + 1} - User selected ID:`, userSelectedId);
      
      if (userSelectedId) {
        selectedOption = exercise.content.options.find((opt: any) => 
          opt.id === userSelectedId || opt.text === userSelectedId
        );
      }
      
      const isCorrect = selectedOption?.isCorrect || false;
      const score = isCorrect ? 100 : 0;
      
      const result = {
        score,
        isCorrect,
        correctAnswer: correctOption?.text || 'N/A',
        userAnswer: selectedOption?.text || 'No valid selection',
        questionTitle: exercise.title || `Exercise ${index + 1}`
      };
      
      console.log(`Exercise ${index + 1} score result:`, result);
      return result;
    });
  };

  const exerciseScores = calculateExerciseScores();
  const completedExercises = answers.filter((a: any) => a !== undefined && a !== null).length
  const totalScore = exerciseScores.length > 0 
    ? Math.round(exerciseScores.reduce((sum, score) => sum + score.score, 0) / exerciseScores.length)
    : 0;
  
  console.log('Final calculated total score:', totalScore);
  console.log('Exercise scores breakdown:', exerciseScores);
  
  const completionRate = (completedExercises / totalExercises) * 100
  const baseXP = difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 100 : 200
  const sessionMultiplier = totalExercises > 1 ? totalExercises * 0.8 : 1
  const earnedXP = Math.round(baseXP * (completionRate / 100) * sessionMultiplier)

  // Generate feedback only once when component mounts
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
            const prevSession = recentSessions[1];
            previousScore = Math.round((prevSession.xp_gagne / baseXP) * 100);
          }
        }
        
        const feedback = generatePersonalizedFeedback(
          { answers, category, difficulty, challenges: totalExercises },
          previousScore
        );
        
        // Use calculated score instead of feedback score
        setPersonalizedFeedback({
          ...feedback,
          score: totalScore
        });
      } catch (error) {
        console.error('Error generating feedback:', error);
        setPersonalizedFeedback({
          score: totalScore,
          strengths: ["You completed the challenge session successfully"],
          improvements: ["Keep practicing to improve your PM skills"],
          progress_statement: "You're making progress in your PM journey",
          recommendation: "Try another session to continue improving your skills"
        });
      }
    };

    if (!personalizedFeedback) {
      generateFeedback();
    }
  }, [totalScore]);

  // Get first AI-generated personalized recommendation
  const {
    recommendation: firstAIRecommendation,
    loading: firstAILoading,
    error: firstAIError
  } = usePersonalizedRecommendation({
    skillArea: category,
    difficulty: difficulty,
    performanceScore: totalScore,
    exerciseScores: exerciseScores,
    totalExercises: totalExercises,
    triggerGeneration: !!personalizedFeedback
  });

  // Get second AI-generated personalized recommendation (avoiding duplicate type)
  const {
    recommendation: secondAIRecommendation,
    loading: secondAILoading,
    error: secondAIError
  } = useSecondPersonalizedRecommendation({
    skillArea: category,
    difficulty: difficulty,
    performanceScore: totalScore,
    exerciseScores: exerciseScores,
    totalExercises: totalExercises,
    firstAIRecommendationType: firstAIRecommendation?.recommendation_type,
    triggerGeneration: !!personalizedFeedback && !!firstAIRecommendation
  });

  // Get third AI-generated personalized recommendation (avoiding both previous types)
  const {
    recommendation: thirdAIRecommendation,
    loading: thirdAILoading,
    error: thirdAIError
  } = useThirdPersonalizedRecommendation({
    skillArea: category,
    difficulty: difficulty,
    performanceScore: totalScore,
    exerciseScores: exerciseScores,
    totalExercises: totalExercises,
    firstAIRecommendationType: firstAIRecommendation?.recommendation_type,
    secondAIRecommendationType: secondAIRecommendation?.recommendation_type,
    triggerGeneration: !!personalizedFeedback && !!firstAIRecommendation && !!secondAIRecommendation
  });

  // Save session data and individual exercises with accurate scoring
  useEffect(() => {
    const saveSessionData = async () => {
      if (!user || loading || !personalizedFeedback || sessionSaved) return
      
      setLoading(true)
      try {
        console.log('Saving session data with scores:', exerciseScores);
        
        // Create session record
        const { data: sessionRecord, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            xp_gagne: earnedXP,
            duree_totale: 15,
            classement_jour: Math.floor(Math.random() * 100) + 1,
            session_complete: completionRate === 100
          })
          .select()
          .single()

        if (sessionError) throw sessionError

        // Save individual exercises to both tables with accurate scores
        if (challengeSession && challengeSession.exercises && exerciseScores.length > 0) {
          // Save to exercise_scores table with accurate scoring
          const exerciseScoreRecords = challengeSession.exercises.map((exercise: any, index: number) => {
            const scoreData = exerciseScores[index];
            
            return {
              user_id: user.id,
              exercise_id: `${challengeSession.sessionId}-exercise-${index}`,
              challenge_session_id: challengeSession.sessionId,
              question_title: scoreData.questionTitle,
              user_answer: scoreData.userAnswer,
              correct_answer: scoreData.correctAnswer,
              is_correct: scoreData.isCorrect,
              score_percentage: scoreData.score,
              time_taken: exercise.timeLimit || 60,
              completion_date: new Date().toISOString()
            };
          });

          console.log('Saving exercise score records:', exerciseScoreRecords);

          const { error: exerciseScoresError } = await supabase
            .from('exercise_scores')
            .insert(exerciseScoreRecords);

          if (exerciseScoresError) {
            console.error('Error saving exercise scores:', exerciseScoresError);
          } else {
            console.log('Exercise scores saved successfully');
          }

          // Save to challenge_history table with accurate scores
          const challengeHistoryRecords = challengeSession.exercises.map((exercise: any, index: number) => {
            const scoreData = exerciseScores[index];
            
            return {
              user_id: user.id,
              challenge_id: `${challengeSession.sessionId}-exercise-${index}`,
              skill_area: category,
              challenge_type: exercise.type || 'multiple-choice',
              challenge_title: exercise.title,
              completion_date: new Date().toISOString(),
              score: scoreData.score,
              time_taken: exercise.timeLimit || 60,
              difficulty: difficulty
            };
          });

          console.log('Saving challenge history records:', challengeHistoryRecords);

          const { error: historyError } = await supabase
            .from('challenge_history')
            .insert(challengeHistoryRecords);

          if (historyError) {
            console.error('Error saving challenge history:', historyError);
          } else {
            console.log('Challenge history saved successfully');
          }
        }

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
        if (completedExercises === totalExercises) badges.push('Session Complete')
        if ((updatedStreak || 0) >= 7) badges.push('Week Warrior')
        if (newLevel > userData.level) badges.push('Level Up!')
        if (personalizedFeedback.score >= 85) badges.push('High Performer')
        
        setNewBadges(badges)
        setSessionSaved(true)
        
        toast.success(`Session saved! +${earnedXP} XP earned`)
        
      } catch (error: any) {
        console.error('Error saving session:', error)
        toast.error('Failed to save session data')
      } finally {
        setLoading(false)
      }
    }

    saveSessionData()
  }, [personalizedFeedback]) // Only run when feedback is ready

  const getPerformanceMessage = () => {
    if (!personalizedFeedback) return "Analyzing your performance..."
    
    const score = personalizedFeedback.score
    if (totalExercises > 1) {
      if (score >= 85) return `Outstanding session performance! 🏆 (${totalExercises} exercises)`
      if (score >= 75) return `Great session! Keep it up! 💪 (${totalExercises} exercises)`
      if (score >= 60) return `Good effort across all exercises! 📈 (${totalExercises} exercises)`
      return `Keep practicing! You're learning 🎯 (${totalExercises} exercises)`
    } else {
      if (score >= 85) return "Outstanding performance! 🏆"
      if (score >= 75) return "Great job! Keep it up! 💪"
      if (score >= 60) return "Good effort! You're improving 📈"
      return "Keep practicing! You're learning 🎯"
    }
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
                <CardTitle className="text-2xl text-green-400">{completedExercises}/{totalExercises}</CardTitle>
                <CardDescription>Exercises Completed</CardDescription>
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
                {category} • {difficulty} • {totalExercises} exercise{totalExercises > 1 ? 's' : ''} • {personalizedFeedback.progress_statement}
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
                  <div className="py-6 px-4 bg-gradient-to-br from-blue-500/25 via-teal-500/20 to-cyan-500/25 border border-blue-400/20 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      What You Did Well
                    </h4>
                    <ul className="text-black text-sm space-y-2">
                      {personalizedFeedback.strengths.map((strength: string, index: number) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="py-6 px-4 bg-gradient-to-br from-red-500/25 via-pink-500/20 to-purple-500/25 border border-red-400/20 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <span className="text-yellow-400 mr-2">📈</span>
                      Areas to Improve
                    </h4>
                    <ul className="text-black text-sm space-y-2">
                      {personalizedFeedback.improvements.map((improvement: string, index: number) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Recommendations Only */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                🤖 AI-Powered Learning Resources
              </CardTitle>
              <CardDescription className="text-gray-400">
                Personalized recommendations based on your performance in {category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(firstAILoading || secondAILoading || thirdAILoading) ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-400">Generating personalized recommendations...</span>
                </div>
              ) : (firstAIError && secondAIError && thirdAIError) ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">Failed to generate recommendations</p>
                  <p className="text-gray-500 text-sm">{firstAIError || secondAIError || thirdAIError}</p>
                </div>
              ) : (firstAIRecommendation || secondAIRecommendation || thirdAIRecommendation) ? (
                <div className="space-y-4">
                  {/* First AI-generated personalized recommendation */}
                  {firstAIRecommendation && (
                    <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-700/50 hover:border-purple-600/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{firstAIRecommendation.title}</h4>
                            <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs border-purple-500/30">
                              AI Personalized
                            </Badge>
                            <Badge variant="secondary" className="bg-teal-600/20 text-teal-400 text-xs">
                              {firstAIRecommendation.recommendation_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">by {firstAIRecommendation.author_speaker}</p>
                          <p className="text-gray-300 text-sm">{firstAIRecommendation.description}</p>
                        </div>
                        {firstAIRecommendation.source_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-600 text-purple-300 hover:bg-purple-800/20 ml-4"
                            onClick={() => window.open(firstAIRecommendation.source_url, '_blank')}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Second AI-generated personalized recommendation */}
                  {secondAIRecommendation && (
                    <div className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg border border-indigo-700/50 hover:border-indigo-600/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{secondAIRecommendation.title}</h4>
                            <Badge className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 text-xs border-indigo-500/30">
                              AI Personalized
                            </Badge>
                            <Badge variant="secondary" className="bg-teal-600/20 text-teal-400 text-xs">
                              {secondAIRecommendation.recommendation_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">by {secondAIRecommendation.author_speaker}</p>
                          <p className="text-gray-300 text-sm">{secondAIRecommendation.description}</p>
                        </div>
                        {secondAIRecommendation.source_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/20 ml-4"
                            onClick={() => window.open(secondAIRecommendation.source_url, '_blank')}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Third AI-generated personalized recommendation */}
                  {thirdAIRecommendation && (
                    <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-700/50 hover:border-emerald-600/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{thirdAIRecommendation.title}</h4>
                            <Badge className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 text-xs border-emerald-500/30">
                              AI Personalized
                            </Badge>
                            <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-400 text-xs">
                              {thirdAIRecommendation.recommendation_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">by {thirdAIRecommendation.author_speaker}</p>
                          <p className="text-gray-300 text-sm">{thirdAIRecommendation.description}</p>
                        </div>
                        {thirdAIRecommendation.source_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-emerald-600 text-emerald-300 hover:bg-emerald-800/20 ml-4"
                            onClick={() => window.open(thirdAIRecommendation.source_url, '_blank')}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Personalized recommendations will appear here after session completion.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-[#0400ff] to-purple-600 hover:from-[#0300cc] hover:to-purple-700 !text-white shadow-lg"
              style={{ color: 'white !important' }}
              onClick={() => navigate('/challenge-selection')}
            >
              Try Another Session
            </Button>
            <Button 
              className="flex-1 bg-transparent border border-gray-600 hover:bg-black hover:border-gray-500 transition-all duration-200 [&]:text-white [&]:hover:text-white [&_*]:text-white [&_*]:hover:text-white"
              style={{ 
                color: 'white !important',
                '--tw-text-opacity': '1 !important'
              } as React.CSSProperties}
              onClick={() => navigate('/dashboard')}
            >
              <span style={{ color: 'white !important' }} className="text-white">
                Back to Dashboard
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionFeedback
