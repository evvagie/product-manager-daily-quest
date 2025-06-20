
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

export const generateDynamicChallenge = async (
  skillArea: string, 
  difficulty: string,
  specificChallengeId?: string | null
): Promise<ChallengeSession> => {
  console.log('🎯 Generating static challenge session for:', { skillArea, difficulty, specificChallengeId });
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  
  try {
    // If specific challenge ID is provided (retry scenario), try to find it first
    if (specificChallengeId) {
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
            exercises: [{ ...specificChallenge, timeLimit: 180 }],
            source: 'static',
            estimatedDuration: 180
          };
        }
      }
    }

    // Fetch 4 different static exercises for the category/difficulty combination
    console.log('📚 Fetching 4 different static exercises...');
    
    const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
    if (!categoryData || !Array.isArray(categoryData)) {
      throw new Error(`No challenges found for skill area: ${skillArea}`);
    }

    // Filter challenges by difficulty
    const filteredChallenges = categoryData.filter((challenge: any) => 
      challenge.difficulty?.toLowerCase() === difficulty.toLowerCase()
    );

    if (filteredChallenges.length === 0) {
      throw new Error(`No challenges found for ${skillArea} at ${difficulty} difficulty`);
    }

    // Shuffle the array to get random selection
    const shuffledChallenges = [...filteredChallenges].sort(() => Math.random() - 0.5);
    
    // Take up to 4 different challenges
    const selectedChallenges = shuffledChallenges.slice(0, Math.min(4, shuffledChallenges.length));
    
    // If we have fewer than 4 challenges, repeat some but ensure we have 4 total
    while (selectedChallenges.length < 4 && filteredChallenges.length > 0) {
      const additionalChallenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
      selectedChallenges.push(additionalChallenge);
    }

    // Add timeLimit and unique IDs to each exercise
    const exercises = selectedChallenges.map((challenge: any, index: number) => ({
      ...challenge,
      timeLimit: 180,
      id: `${challenge.id}-${timestamp}-${index}`
    }));

    console.log('✅ Successfully selected static challenges:', {
      count: exercises.length,
      titles: exercises.map(e => e.title)
    });

    return {
      sessionId: `static-session-${skillArea}-${difficulty}-${timestamp}-${randomId}`,
      skillArea,
      difficulty,
      totalExercises: exercises.length,
      exercises,
      source: 'static',
      estimatedDuration: exercises.length * 180
    };
    
  } catch (error) {
    console.error('💥 Error generating static challenge session:', error);
    throw new Error(`Failed to generate static challenges: ${error.message}`);
  }
};
