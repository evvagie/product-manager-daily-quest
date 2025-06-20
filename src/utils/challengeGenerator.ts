
import { enhancedChallengeDatabase } from '@/data/enhancedChallengeData';

export interface Exercise {
  id: string;
  title: string;
  type: string;
  timeLimit: number;
  content: {
    context: string;
    instructions: string;
    scenario?: string;
    data?: string;
    options?: any[];
    constraints?: string;
    tradeOffs?: any[];
    priorities?: any[];
    conversation?: any[];
    retrospectiveData?: any;
    totalResources?: number;
  };
}

export interface ChallengeSession {
  sessionId: string;
  skillArea: string;
  difficulty: string;
  totalExercises: number;
  exercises: Exercise[];
  source: 'static' | 'openai';
  estimatedDuration: number;
}

// Create a fallback challenge for when specific challenges can't be found
const createFallbackChallenge = (skillArea: string, difficulty: string): Exercise => {
  const fallbackChallenges = {
    strategy: {
      id: 'fallback-strategy',
      title: 'Product Vision Challenge',
      type: 'multiple-choice',
      timeLimit: 180,
      content: {
        context: 'You are leading product strategy for a growing SaaS company.',
        instructions: 'Choose the best approach for defining your product vision.',
        options: [
          {
            id: 'option-1',
            text: 'Focus on customer feedback and market research',
            isCorrect: true,
            explanation: 'Customer-driven vision ensures market fit.'
          },
          {
            id: 'option-2',
            text: 'Follow competitor strategies',
            isCorrect: false,
            explanation: 'Following competitors limits innovation.'
          }
        ]
      }
    },
    research: {
      id: 'fallback-research',
      title: 'User Research Fundamentals',
      type: 'multiple-choice',
      timeLimit: 180,
      content: {
        context: 'You need to understand user needs for a new feature.',
        instructions: 'Select the most effective research method.',
        options: [
          {
            id: 'option-1',
            text: 'Conduct user interviews with open-ended questions',
            isCorrect: true,
            explanation: 'User interviews provide deep qualitative insights.'
          },
          {
            id: 'option-2',
            text: 'Send out a survey with yes/no questions',
            isCorrect: false,
            explanation: 'Yes/no questions limit insight depth.'
          }
        ]
      }
    },
    analytics: {
      id: 'fallback-analytics',
      title: 'Data Analysis Challenge',
      type: 'multiple-choice',
      timeLimit: 180,
      content: {
        context: 'You need to analyze user engagement metrics.',
        instructions: 'Choose the most important metric to track.',
        options: [
          {
            id: 'option-1',
            text: 'Daily Active Users (DAU)',
            isCorrect: true,
            explanation: 'DAU indicates consistent user value.'
          },
          {
            id: 'option-2',
            text: 'Total registered users',
            isCorrect: false,
            explanation: 'Registration doesn\'t indicate engagement.'
          }
        ]
      }
    },
    design: {
      id: 'fallback-design',
      title: 'UX Design Principles',
      type: 'multiple-choice',
      timeLimit: 180,
      content: {
        context: 'You are designing a new user onboarding flow.',
        instructions: 'Select the best UX principle to follow.',
        options: [
          {
            id: 'option-1',
            text: 'Progressive disclosure of information',
            isCorrect: true,
            explanation: 'Progressive disclosure reduces cognitive load.'
          },
          {
            id: 'option-2',
            text: 'Show all features immediately',
            isCorrect: false,
            explanation: 'Too much information overwhelms users.'
          }
        ]
      }
    }
  };

  return fallbackChallenges[skillArea as keyof typeof fallbackChallenges] || fallbackChallenges.strategy;
};

export const generateDynamicChallenge = async (
  skillArea: string, 
  difficulty: string,
  specificChallengeId?: string | null
): Promise<ChallengeSession> => {
  console.log('Generating challenge for:', { skillArea, difficulty, specificChallengeId });
  
  try {
    // If specific challenge ID is provided, try to find it first
    if (specificChallengeId) {
      // Check if it's an AI-generated challenge ID (contains "ai-session" or similar patterns)
      const isAIChallenge = specificChallengeId.includes('ai-session') || specificChallengeId.includes('exercise-');
      
      if (!isAIChallenge) {
        // Try to find in static database
        const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
        if (categoryData && Array.isArray(categoryData)) {
          const specificChallenge = categoryData.find((challenge: any) => challenge.id === specificChallengeId);
          
          if (specificChallenge) {
            console.log('Found specific challenge in static data:', specificChallenge.title);
            return {
              sessionId: `retry-${specificChallengeId}-${Date.now()}`,
              skillArea,
              difficulty,
              totalExercises: 1,
              exercises: [specificChallenge],
              source: 'static',
              estimatedDuration: specificChallenge.timeLimit
            };
          }
        }
      }
      
      console.warn('Specific challenge not found or was AI-generated, will try AI generation first');
    }

    // Try OpenAI generation first
    try {
      const response = await fetch(`https://xtnlfdcqaqtqxyzywaoh.supabase.co/functions/v1/generate-ai-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bmxmZGNxYXF0cXh5enl3YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTkzMjEsImV4cCI6MjA2NTY3NTMyMX0.p05Zf-qKmWpmyI1Lc_t5lFZYG82ZXImCvZ1DxXi5uLA`
        },
        body: JSON.stringify({ skillArea, difficulty })
      });

      if (response.ok) {
        const aiData = await response.json();
        console.log('AI Challenge generated successfully');
        return {
          sessionId: `ai-${Date.now()}`,
          skillArea,
          difficulty,
          totalExercises: aiData.exercises?.length || 4,
          exercises: aiData.exercises || [],
          source: 'openai',
          estimatedDuration: (aiData.exercises?.length || 4) * 180
        };
      } else {
        console.warn('AI generation failed, falling back to static content');
      }
    } catch (aiError) {
      console.warn('AI generation error, falling back to static content:', aiError);
    }

    // Fallback to enhanced static content
    const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
    
    if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
      // Filter by difficulty and select challenges
      const filteredChallenges = categoryData.filter((challenge: any) => 
        challenge.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );

      const challengesToUse = filteredChallenges.length > 0 ? filteredChallenges : categoryData;
      const selectedChallenges = [];
      const usedIndices = new Set();

      // Select up to 4 unique challenges
      while (selectedChallenges.length < Math.min(4, challengesToUse.length)) {
        const randomIndex = Math.floor(Math.random() * challengesToUse.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          selectedChallenges.push(challengesToUse[randomIndex]);
        }
      }

      console.log('Using enhanced static challenges:', selectedChallenges.length);
      
      return {
        sessionId: `static-${Date.now()}`,
        skillArea,
        difficulty,
        totalExercises: selectedChallenges.length,
        exercises: selectedChallenges,
        source: 'static',
        estimatedDuration: selectedChallenges.reduce((total: number, challenge: any) => 
          total + (challenge.timeLimit || 180), 0
        )
      };
    } else {
      // Use fallback challenge if no static data available
      console.warn(`No static challenge data available for ${skillArea}, using fallback challenge`);
      const fallbackChallenge = createFallbackChallenge(skillArea, difficulty);
      
      return {
        sessionId: `fallback-${Date.now()}`,
        skillArea,
        difficulty,
        totalExercises: 1,
        exercises: [fallbackChallenge],
        source: 'static',
        estimatedDuration: fallbackChallenge.timeLimit
      };
    }

  } catch (error) {
    console.error('Error generating challenge:', error);
    
    // Final fallback - always provide something
    const fallbackChallenge = createFallbackChallenge(skillArea, difficulty);
    return {
      sessionId: `emergency-fallback-${Date.now()}`,
      skillArea,
      difficulty,
      totalExercises: 1,
      exercises: [fallbackChallenge],
      source: 'static',
      estimatedDuration: fallbackChallenge.timeLimit
    };
  }
};
