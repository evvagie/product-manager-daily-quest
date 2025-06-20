
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

// Create a fallback challenge for when AI generation fails completely
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
      }
    ]
  };

  const categoryFallbacks = fallbackChallenges[skillArea as keyof typeof fallbackChallenges] || fallbackChallenges.strategy;
  return categoryFallbacks[0];
};

export const generateDynamicChallenge = async (
  skillArea: string, 
  difficulty: string,
  specificChallengeId?: string | null
): Promise<ChallengeSession> => {
  console.log('🎯 Generating UNIQUE challenge session for:', { skillArea, difficulty, specificChallengeId });
  
  // Create unique session identifiers to ensure no repetition
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const sessionContext = `${skillArea}-${difficulty}-${timestamp}-${randomId}`;
  
  try {
    // If specific challenge ID is provided (retry scenario), try to find it first
    if (specificChallengeId && !specificChallengeId.includes('ai-session')) {
      const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
      if (categoryData && Array.isArray(categoryData)) {
        const specificChallenge = categoryData.find((challenge: any) => challenge.id === specificChallengeId);
        
        if (specificChallenge) {
          console.log('📋 Found specific static challenge for retry:', specificChallenge.title);
          return {
            sessionId: `retry-${specificChallengeId}-${timestamp}`,
            skillArea,
            difficulty,
            totalExercises: 1,
            exercises: [{ ...specificChallenge, timeLimit: 60 }],
            source: 'static',
            estimatedDuration: 60
          };
        }
      }
    }

    // PRIORITY: Generate unique AI challenges
    console.log('🤖 Attempting AI generation with enhanced uniqueness...');
    
    const aiPayload = {
      skillArea,
      difficulty,
      sessionContext,
      timestamp,
      uniquenessSeed: randomId,
      exerciseCount: 4,
      generateCompletely: true,
      avoidRepetition: true,
      requestId: `${sessionContext}-${Date.now()}`
    };

    console.log('📤 Sending AI request with payload:', aiPayload);

    const response = await fetch(`https://xtnlfdcqaqtqxyzywaoh.supabase.co/functions/v1/generate-ai-challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bmxmZGNxYXF0cXh5enl3YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTkzMjEsImV4cCI6MjA2NTY3NTMyMX0.p05Zf-qKmWpmyI1Lc_t5lFZYG82ZXImCvZ1DxXi5uLA`
      },
      body: JSON.stringify(aiPayload)
    });

    console.log('📥 AI Response status:', response.status);

    if (response.ok) {
      const aiData = await response.json();
      console.log('✅ AI Challenge generated successfully!', {
        exerciseCount: aiData.exercises?.length,
        sessionId: aiData.sessionId
      });
      
      // Ensure unique IDs and proper structure
      let exercises = aiData.exercises || [];
      exercises = exercises.map((exercise: any, index: number) => ({
        ...exercise,
        timeLimit: 60,
        id: `ai-${sessionContext}-ex${index + 1}-${timestamp}`
      }));

      // Validate we have 4 exercises
      if (exercises.length < 4) {
        console.warn('⚠️ AI generated fewer than 4 exercises, padding with unique variations');
        while (exercises.length < 4) {
          const baseExercise = exercises[exercises.length % exercises.length] || createFallbackChallenge(skillArea, difficulty, exercises.length + 1);
          const newExercise = {
            ...baseExercise,
            id: `ai-variation-${sessionContext}-ex${exercises.length + 1}-${timestamp}`,
            title: `${baseExercise.title} - Variation ${exercises.length + 1}`
          };
          exercises.push(newExercise);
        }
      }

      return {
        sessionId: `ai-session-${sessionContext}`,
        skillArea,
        difficulty,
        totalExercises: 4,
        exercises: exercises.slice(0, 4),
        source: 'openai',
        estimatedDuration: 240
      };
    } else {
      const errorText = await response.text();
      console.error('❌ AI generation failed:', response.status, errorText);
    }
  } catch (error) {
    console.error('💥 AI generation error:', error);
  }

  // Only use static content as absolute last resort
  console.warn('🔄 Falling back to static content - AI generation unavailable');
  
  const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
  
  if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
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
        const challenge = { 
          ...challengesToUse[randomIndex], 
          timeLimit: 60,
          id: `static-${sessionContext}-${selectedChallenges.length}-${timestamp}`
        };
        selectedChallenges.push(challenge);
      }
    }

    // Fill to 4 exercises with fallbacks if needed
    while (selectedChallenges.length < 4) {
      const fallbackExercise = createFallbackChallenge(skillArea, difficulty, selectedChallenges.length + 1);
      fallbackExercise.id = `fallback-${sessionContext}-${selectedChallenges.length}-${timestamp}`;
      selectedChallenges.push(fallbackExercise);
    }

    return {
      sessionId: `static-${sessionContext}`,
      skillArea,
      difficulty,
      totalExercises: 4,
      exercises: selectedChallenges,
      source: 'static',
      estimatedDuration: 240
    };
  }

  // Emergency fallback
  console.error('🚨 Emergency fallback - no static data available');
  const fallbackExercises = [];
  
  for (let i = 1; i <= 4; i++) {
    const fallbackChallenge = createFallbackChallenge(skillArea, difficulty, i);
    fallbackChallenge.id = `emergency-${sessionContext}-${i}-${timestamp}`;
    fallbackExercises.push(fallbackChallenge);
  }
  
  return {
    sessionId: `emergency-${sessionContext}`,
    skillArea,
    difficulty,
    totalExercises: 4,
    exercises: fallbackExercises,
    source: 'static',
    estimatedDuration: 240
  };
};
