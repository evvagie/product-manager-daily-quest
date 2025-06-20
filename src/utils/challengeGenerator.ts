
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
const createFallbackChallenge = (skillArea: string, difficulty: string, exerciseNumber: number): Exercise => {
  const fallbackChallenges = {
    strategy: [
      {
        id: `fallback-strategy-${exerciseNumber}`,
        title: `Product Vision Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
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
      {
        id: `fallback-strategy-${exerciseNumber}`,
        title: `Market Analysis Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
        content: {
          context: 'You need to analyze the competitive landscape.',
          instructions: 'Select the most effective analysis method.',
          options: [
            {
              id: 'option-1',
              text: 'Conduct SWOT analysis with customer interviews',
              isCorrect: true,
              explanation: 'SWOT with customer input provides comprehensive insights.'
            },
            {
              id: 'option-2',
              text: 'Copy competitor feature lists',
              isCorrect: false,
              explanation: 'Copying features without understanding context is ineffective.'
            }
          ]
        }
      }
    ],
    research: [
      {
        id: `fallback-research-${exerciseNumber}`,
        title: `User Research Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
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
      {
        id: `fallback-research-${exerciseNumber}`,
        title: `User Testing Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
        content: {
          context: 'You need to validate a new feature design.',
          instructions: 'Choose the best testing approach.',
          options: [
            {
              id: 'option-1',
              text: 'Prototype testing with task-based scenarios',
              isCorrect: true,
              explanation: 'Task-based testing reveals real usage patterns.'
            },
            {
              id: 'option-2',
              text: 'Show static screenshots and ask for opinions',
              isCorrect: false,
              explanation: 'Static screenshots don\'t reveal interaction issues.'
            }
          ]
        }
      }
    ],
    analytics: [
      {
        id: `fallback-analytics-${exerciseNumber}`,
        title: `Data Analysis Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
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
      {
        id: `fallback-analytics-${exerciseNumber}`,
        title: `A/B Testing Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
        content: {
          context: 'You need to test a new feature variation.',
          instructions: 'Select the best A/B testing approach.',
          options: [
            {
              id: 'option-1',
              text: 'Test with statistical significance and proper sample size',
              isCorrect: true,
              explanation: 'Statistical rigor ensures reliable results.'
            },
            {
              id: 'option-2',
              text: 'Test with 10 users for one day',
              isCorrect: false,
              explanation: 'Small sample size leads to unreliable results.'
            }
          ]
        }
      }
    ],
    design: [
      {
        id: `fallback-design-${exerciseNumber}`,
        title: `UX Design Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
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
      },
      {
        id: `fallback-design-${exerciseNumber}`,
        title: `Usability Challenge ${exerciseNumber}`,
        type: 'multiple-choice',
        timeLimit: 60,
        content: {
          context: 'You need to improve the usability of a complex form.',
          instructions: 'Choose the best usability improvement.',
          options: [
            {
              id: 'option-1',
              text: 'Break form into logical sections with clear progress indicators',
              isCorrect: true,
              explanation: 'Sectioned forms with progress reduce user anxiety.'
            },
            {
              id: 'option-2',
              text: 'Put all fields on one long page',
              isCorrect: false,
              explanation: 'Long forms without structure are overwhelming.'
            }
          ]
        }
      }
    ]
  };

  const categoryFallbacks = fallbackChallenges[skillArea as keyof typeof fallbackChallenges] || fallbackChallenges.strategy;
  const fallbackIndex = (exerciseNumber - 1) % categoryFallbacks.length;
  return categoryFallbacks[fallbackIndex];
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
            // Ensure the challenge has 60 second time limit for retries
            const retryChallenge = { ...specificChallenge, timeLimit: 60 };
            return {
              sessionId: `retry-${specificChallengeId}-${Date.now()}`,
              skillArea,
              difficulty,
              totalExercises: 1,
              exercises: [retryChallenge],
              source: 'static',
              estimatedDuration: 60
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
        
        // Ensure exactly 4 exercises with 60 second time limits
        let exercises = aiData.exercises || [];
        
        // Set all exercises to 60 second time limit
        exercises = exercises.map((exercise: any, index: number) => ({
          ...exercise,
          timeLimit: 60,
          id: exercise.id || `ai-exercise-${index + 1}-${Date.now()}`
        }));
        
        // Ensure we have exactly 4 exercises
        while (exercises.length < 4) {
          const exerciseNumber = exercises.length + 1;
          const fallbackExercise = createFallbackChallenge(skillArea, difficulty, exerciseNumber);
          exercises.push(fallbackExercise);
        }
        
        // Limit to exactly 4 exercises
        exercises = exercises.slice(0, 4);
        
        return {
          sessionId: `ai-${Date.now()}`,
          skillArea,
          difficulty,
          totalExercises: 4,
          exercises,
          source: 'openai',
          estimatedDuration: 240 // 4 exercises * 60 seconds each
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
          const challenge = { ...challengesToUse[randomIndex], timeLimit: 60 };
          selectedChallenges.push(challenge);
        }
      }

      // If we don't have 4 challenges, add fallback challenges
      while (selectedChallenges.length < 4) {
        const exerciseNumber = selectedChallenges.length + 1;
        const fallbackExercise = createFallbackChallenge(skillArea, difficulty, exerciseNumber);
        selectedChallenges.push(fallbackExercise);
      }

      console.log('Using enhanced static challenges:', selectedChallenges.length);
      
      return {
        sessionId: `static-${Date.now()}`,
        skillArea,
        difficulty,
        totalExercises: 4,
        exercises: selectedChallenges,
        source: 'static',
        estimatedDuration: 240 // 4 exercises * 60 seconds each
      };
    } else {
      // Use 4 fallback challenges if no static data available
      console.warn(`No static challenge data available for ${skillArea}, using fallback challenges`);
      const fallbackExercises = [];
      
      for (let i = 1; i <= 4; i++) {
        const fallbackChallenge = createFallbackChallenge(skillArea, difficulty, i);
        fallbackExercises.push(fallbackChallenge);
      }
      
      return {
        sessionId: `fallback-${Date.now()}`,
        skillArea,
        difficulty,
        totalExercises: 4,
        exercises: fallbackExercises,
        source: 'static',
        estimatedDuration: 240 // 4 exercises * 60 seconds each
      };
    }

  } catch (error) {
    console.error('Error generating challenge:', error);
    
    // Final fallback - always provide 4 exercises
    const fallbackExercises = [];
    
    for (let i = 1; i <= 4; i++) {
      const fallbackChallenge = createFallbackChallenge(skillArea, difficulty, i);
      fallbackExercises.push(fallbackChallenge);
    }
    
    return {
      sessionId: `emergency-fallback-${Date.now()}`,
      skillArea,
      difficulty,
      totalExercises: 4,
      exercises: fallbackExercises,
      source: 'static',
      estimatedDuration: 240 // 4 exercises * 60 seconds each
    };
  }
};
