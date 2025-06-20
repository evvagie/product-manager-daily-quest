
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

  // Create a more sophisticated randomization based on timestamp and category
  const timestamp = Date.now();
  const sessionSeed = timestamp % 1000; // Use timestamp modulo for variety
  
  // Create multiple shuffled versions to ensure different selections
  const shuffleWithSeed = (array: any[], seed: number) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(((seed + i) * 9301 + 49297) % 233280) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Apply different shuffling strategies based on session timing
  const shuffleStrategy = sessionSeed % 3;
  let shuffledChallenges: any[];

  switch (shuffleStrategy) {
    case 0:
      // Reverse order shuffle
      shuffledChallenges = shuffleWithSeed([...availableChallenges].reverse(), sessionSeed);
      break;
    case 1:
      // Skip pattern shuffle
      shuffledChallenges = shuffleWithSeed(availableChallenges, sessionSeed + 1000);
      break;
    default:
      // Standard shuffle with time-based seed
      shuffledChallenges = shuffleWithSeed(availableChallenges, sessionSeed + 2000);
  }

  const selectedChallenges: any[] = [];
  const usedIds = new Set<string>();
  let challengeIndex = 0;

  // Select unique challenges with better distribution logic
  while (selectedChallenges.length < count && challengeIndex < shuffledChallenges.length * 2) {
    const currentChallenge = shuffledChallenges[challengeIndex % shuffledChallenges.length];
    
    if (!usedIds.has(currentChallenge.id)) {
      selectedChallenges.push({ ...currentChallenge });
      usedIds.add(currentChallenge.id);
    }
    
    challengeIndex++;

    // Safety mechanism: if we've tried all challenges twice and still need more
    if (challengeIndex >= shuffledChallenges.length * 2 && selectedChallenges.length < count) {
      const remainingNeeded = count - selectedChallenges.length;
      for (let i = 0; i < remainingNeeded && i < shuffledChallenges.length; i++) {
        const repeatedChallenge = { 
          ...shuffledChallenges[i],
          id: `${shuffledChallenges[i].id}-session-${timestamp}-${i}`
        };
        selectedChallenges.push(repeatedChallenge);
      }
      break;
    }
  }

  logChallengeSelection('Selected unique challenges with improved algorithm', {
    selected: selectedChallenges.length,
    strategy: shuffleStrategy,
    sessionSeed: sessionSeed,
    uniqueIds: selectedChallenges.map(c => c.id)
  });

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
