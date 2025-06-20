
import { enhancedChallengeDatabase } from '@/data/enhancedChallengeData';
import { type Exercise } from '@/types/challenge';
import { addExerciseMetadata, logDebug, logChallengeSelection } from './challengeHelpers';

export const findSpecificChallenge = (skillArea: string, specificChallengeId: string): Exercise | null => {
  const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
  if (categoryData && typeof categoryData === 'object') {
    for (const difficultyKey of Object.keys(categoryData)) {
      const difficultyData = categoryData[difficultyKey as keyof typeof categoryData];
      if (Array.isArray(difficultyData)) {
        const specificChallenge = difficultyData.find((challenge: any) => challenge.id === specificChallengeId);
        if (specificChallenge) {
          const timestamp = Date.now();
          return {
            ...specificChallenge,
            timeLimit: 180,
            content: {
              ...specificChallenge.content,
              instructions: 'Complete this challenge to the best of your ability.'
            }
          };
        }
      }
    }
  }
  return null;
};

export const getChallengesForCategory = (skillArea: string, difficulty: string): any[] => {
  const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
  
  if (!categoryData || typeof categoryData !== 'object') {
    logDebug('No category data found for', skillArea);
    return [];
  }

  const difficultyData = categoryData[difficulty as keyof typeof categoryData];
  let availableChallenges: any[] = [];

  if (Array.isArray(difficultyData) && difficultyData.length > 0) {
    availableChallenges = [...difficultyData];
    logChallengeSelection('Using exact difficulty match', { difficulty, count: availableChallenges.length });
  } else {
    logDebug('No challenges for exact difficulty, mixing from all difficulties', {});
    const allDifficulties = Object.keys(categoryData);
    
    for (const diff of allDifficulties) {
      const challenges = categoryData[diff as keyof typeof categoryData];
      if (Array.isArray(challenges)) {
        availableChallenges.push(...challenges);
      }
    }
    
    logDebug('Mixed challenges from all difficulties', { 
      difficulties: allDifficulties, 
      totalChallenges: availableChallenges.length 
    });
  }

  return availableChallenges;
};

export const getFallbackChallenges = (): any[] => {
  const allCategories = Object.keys(enhancedChallengeDatabase);
  if (allCategories.length === 0) return [];

  const fallbackCategory = allCategories[0];
  const fallbackCategoryData = enhancedChallengeDatabase[fallbackCategory as keyof typeof enhancedChallengeDatabase];
  
  if (fallbackCategoryData && typeof fallbackCategoryData === 'object') {
    const fallbackDifficulties = Object.keys(fallbackCategoryData);
    if (fallbackDifficulties.length > 0) {
      const fallbackDifficulty = fallbackDifficulties[0];
      const fallbackChallenges = fallbackCategoryData[fallbackDifficulty as keyof typeof fallbackCategoryData];
      
      if (Array.isArray(fallbackChallenges) && fallbackChallenges.length > 0) {
        return fallbackChallenges;
      }
    }
  }
  
  return [];
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  if (availableChallenges.length === 0) {
    throw new Error('No challenges available for selection');
  }

  const shuffledChallenges = [...availableChallenges].sort(() => Math.random() - 0.5);
  const selectedChallenges: any[] = [];
  let challengeIndex = 0;
  const timestamp = Date.now();

  while (selectedChallenges.length < count && challengeIndex < 20) {
    const challenge = shuffledChallenges[challengeIndex % shuffledChallenges.length];
    const isDuplicate = selectedChallenges.some(selected => selected.id === challenge.id);
    
    if (!isDuplicate || selectedChallenges.length === 0) {
      selectedChallenges.push({ ...challenge });
    }
    
    challengeIndex++;
    
    if (challengeIndex >= shuffledChallenges.length && selectedChallenges.length < count) {
      const repeatedChallenge = { 
        ...shuffledChallenges[challengeIndex % shuffledChallenges.length],
        id: `${shuffledChallenges[challengeIndex % shuffledChallenges.length].id}-repeat-${challengeIndex}`
      };
      selectedChallenges.push(repeatedChallenge);
    }
  }

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
