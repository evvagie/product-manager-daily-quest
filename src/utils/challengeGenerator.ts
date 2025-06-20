
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
  console.log('📋 Available database keys:', Object.keys(enhancedChallengeDatabase));
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  
  try {
    // If specific challenge ID is provided (retry scenario), try to find it first
    if (specificChallengeId) {
      const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
      if (categoryData && typeof categoryData === 'object') {
        // Look through all difficulties in this category
        for (const difficultyKey of Object.keys(categoryData)) {
          const difficultyData = categoryData[difficultyKey as keyof typeof categoryData];
          if (Array.isArray(difficultyData)) {
            const specificChallenge = difficultyData.find((challenge: any) => challenge.id === specificChallengeId);
            if (specificChallenge) {
              console.log('📋 Found specific static challenge for retry:', specificChallenge.title);
              return {
                sessionId: `retry-${specificChallengeId}-${timestamp}`,
                skillArea,
                difficulty,
                totalExercises: 1,
                exercises: [{ 
                  ...specificChallenge, 
                  timeLimit: 180,
                  content: {
                    ...specificChallenge.content,
                    instructions: 'Complete this challenge to the best of your ability.'
                  }
                }],
                source: 'static',
                estimatedDuration: 180
              };
            }
          }
        }
      }
    }

    // Get the category data - direct access since the keys match exactly
    const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
    if (!categoryData || typeof categoryData !== 'object') {
      console.log('❌ No category data found for:', skillArea);
      console.log('📋 Available categories:', Object.keys(enhancedChallengeDatabase));
      
      // Emergency fallback - use any available category
      const allCategories = Object.keys(enhancedChallengeDatabase);
      if (allCategories.length > 0) {
        const fallbackCategory = allCategories[0];
        const fallbackCategoryData = enhancedChallengeDatabase[fallbackCategory as keyof typeof enhancedChallengeDatabase];
        console.log('🚨 Using fallback category:', fallbackCategory);
        
        if (fallbackCategoryData && typeof fallbackCategoryData === 'object') {
          // Get any difficulty from fallback category
          const fallbackDifficulties = Object.keys(fallbackCategoryData);
          if (fallbackDifficulties.length > 0) {
            const fallbackDifficulty = fallbackDifficulties[0];
            const fallbackChallenges = fallbackCategoryData[fallbackDifficulty as keyof typeof fallbackCategoryData];
            
            if (Array.isArray(fallbackChallenges) && fallbackChallenges.length > 0) {
              const shuffledChallenges = [...fallbackChallenges].sort(() => Math.random() - 0.5);
              const selectedChallenges = shuffledChallenges.slice(0, Math.min(4, shuffledChallenges.length));
              
              const exercises = selectedChallenges.map((challenge: any, index: number) => ({
                ...challenge,
                timeLimit: 180,
                id: `${challenge.id}-${timestamp}-${index}`,
                content: {
                  ...challenge.content,
                  instructions: 'Complete this challenge to the best of your ability.'
                }
              }));

              return {
                sessionId: `fallback-session-${skillArea}-${difficulty}-${timestamp}-${randomId}`,
                skillArea,
                difficulty,
                totalExercises: exercises.length,
                exercises,
                source: 'static',
                estimatedDuration: exercises.length * 180
              };
            }
          }
        }
      }
      
      throw new Error(`No challenges found for skill area: ${skillArea}`);
    }

    // Now access the specific difficulty within the category
    const difficultyData = categoryData[difficulty as keyof typeof categoryData];
    
    console.log('✅ Found category data:', { 
      key: skillArea, 
      availableDifficulties: Object.keys(categoryData),
      targetDifficulty: difficulty,
      difficultyDataFound: Array.isArray(difficultyData),
      challengeCount: Array.isArray(difficultyData) ? difficultyData.length : 0
    });

    let availableChallenges: any[] = [];

    if (Array.isArray(difficultyData) && difficultyData.length > 0) {
      // Found challenges for exact difficulty
      availableChallenges = [...difficultyData];
      console.log('🎯 Using exact difficulty match:', { difficulty, count: availableChallenges.length });
    } else {
      // No challenges for this difficulty, mix from all difficulties in this category
      console.log('🚨 No challenges for exact difficulty, mixing from all difficulties');
      const allDifficulties = Object.keys(categoryData);
      
      for (const diff of allDifficulties) {
        const challenges = categoryData[diff as keyof typeof categoryData];
        if (Array.isArray(challenges)) {
          availableChallenges.push(...challenges);
        }
      }
      
      console.log('📚 Mixed challenges from all difficulties:', { 
        difficulties: allDifficulties, 
        totalChallenges: availableChallenges.length 
      });
    }

    if (availableChallenges.length === 0) {
      throw new Error(`No challenges found for category: ${skillArea}`);
    }

    // Shuffle and select 4 unique challenges
    const shuffledChallenges = [...availableChallenges].sort(() => Math.random() - 0.5);
    
    // Ensure we get exactly 4 challenges by repeating if necessary
    const selectedChallenges: any[] = [];
    let challengeIndex = 0;
    
    while (selectedChallenges.length < 4 && challengeIndex < 20) { // Safety limit
      const challenge = shuffledChallenges[challengeIndex % shuffledChallenges.length];
      // Avoid exact duplicates by checking if we already selected this challenge
      const isDuplicate = selectedChallenges.some(selected => selected.id === challenge.id);
      
      if (!isDuplicate || selectedChallenges.length === 0) {
        selectedChallenges.push({ ...challenge });
      }
      
      challengeIndex++;
      
      // If we've gone through all unique challenges and still need more, start allowing repeats with modified IDs
      if (challengeIndex >= shuffledChallenges.length && selectedChallenges.length < 4) {
        const repeatedChallenge = { 
          ...shuffledChallenges[challengeIndex % shuffledChallenges.length],
          id: `${shuffledChallenges[challengeIndex % shuffledChallenges.length].id}-repeat-${challengeIndex}`
        };
        selectedChallenges.push(repeatedChallenge);
      }
    }

    // Add timeLimit and ensure unique IDs for each exercise in this session
    // Also ensure all exercises have the required instructions property
    const exercises = selectedChallenges.map((challenge: any, index: number) => ({
      ...challenge,
      timeLimit: 180,
      id: `${challenge.id}-${timestamp}-${index}`,
      content: {
        ...challenge.content,
        instructions: 'Complete this challenge to the best of your ability.'
      }
    }));

    console.log('✅ Successfully selected static challenges:', {
      count: exercises.length,
      titles: exercises.map(e => e.title),
      uniqueIds: exercises.map(e => e.id)
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
