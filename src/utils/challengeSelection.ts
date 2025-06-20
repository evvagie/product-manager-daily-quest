
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

// Enhanced Fisher-Yates shuffle with multiple randomization sources
const advancedShuffle = (array: any[], sessionSeed: number): any[] => {
  const shuffled = [...array];
  
  // Use multiple randomization sources for better entropy
  const microTime = performance.now();
  const randomMultiplier = Math.sin(sessionSeed) * 10000;
  const timeBasedSeed = (sessionSeed + microTime + randomMultiplier) % 1000000;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Create a pseudo-random number using multiple sources
    const randomValue = Math.abs(Math.sin(timeBasedSeed + i * 137.508) * 43758.5453);
    const j = Math.floor(randomValue % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  if (availableChallenges.length === 0) {
    throw new Error('No challenges available for selection');
  }

  // Create a session-specific seed based on current time and random factors
  const timestamp = Date.now();
  const sessionSeed = timestamp + Math.random() * 1000000;
  
  logDebug('Starting challenge selection with enhanced uniqueness', {
    availableCount: availableChallenges.length,
    requestedCount: count,
    sessionSeed: Math.floor(sessionSeed)
  });

  // If we have fewer challenges than requested, we'll need to be creative
  if (availableChallenges.length < count) {
    logDebug('Not enough unique challenges, will create variants', {
      available: availableChallenges.length,
      needed: count
    });
  }

  // Step 1: Remove any potential duplicates from source array based on title and content
  const uniqueSourceChallenges: any[] = [];
  const seenTitles = new Set<string>();
  const seenContentHashes = new Set<string>();

  for (const challenge of availableChallenges) {
    const titleKey = challenge.title?.toLowerCase().trim();
    const contentKey = JSON.stringify(challenge.content || {});
    const contentHash = btoa(contentKey).substring(0, 20); // Simple hash
    
    if (!seenTitles.has(titleKey) && !seenContentHashes.has(contentHash)) {
      uniqueSourceChallenges.push(challenge);
      seenTitles.add(titleKey);
      seenContentHashes.add(contentHash);
    }
  }

  logDebug('Filtered to truly unique challenges', {
    originalCount: availableChallenges.length,
    uniqueCount: uniqueSourceChallenges.length
  });

  // Step 2: Apply advanced shuffling
  const shuffledChallenges = advancedShuffle(uniqueSourceChallenges, sessionSeed);
  
  // Step 3: Select challenges with absolute uniqueness guarantee
  const selectedChallenges: any[] = [];
  const usedIds = new Set<string>();
  const usedTitles = new Set<string>();
  const usedContentHashes = new Set<string>();

  // First pass: select completely unique challenges
  for (let i = 0; i < shuffledChallenges.length && selectedChallenges.length < count; i++) {
    const challenge = shuffledChallenges[i];
    const titleKey = challenge.title?.toLowerCase().trim();
    const contentKey = JSON.stringify(challenge.content || {});
    const contentHash = btoa(contentKey).substring(0, 20);
    
    if (!usedIds.has(challenge.id) && 
        !usedTitles.has(titleKey) && 
        !usedContentHashes.has(contentHash)) {
      
      selectedChallenges.push({ ...challenge });
      usedIds.add(challenge.id);
      usedTitles.add(titleKey);
      usedContentHashes.add(contentHash);
    }
  }

  // Step 4: If we still need more challenges, create variants with unique IDs
  while (selectedChallenges.length < count && uniqueSourceChallenges.length > 0) {
    const sourceIndex = selectedChallenges.length % uniqueSourceChallenges.length;
    const sourceChallenge = uniqueSourceChallenges[sourceIndex];
    
    // Create a variant with a completely unique ID and slight modifications
    const variantId = `${sourceChallenge.id}-variant-${timestamp}-${selectedChallenges.length}`;
    const variant = {
      ...sourceChallenge,
      id: variantId,
      title: `${sourceChallenge.title} (Scenario ${selectedChallenges.length + 1})`,
      content: {
        ...sourceChallenge.content,
        context: sourceChallenge.content?.context ? 
          `${sourceChallenge.content.context} (Alternative scenario)` : 
          sourceChallenge.content?.context
      }
    };
    
    selectedChallenges.push(variant);
  }

  // Final validation: ensure all selected challenges have unique IDs
  const finalUniqueIds = new Set(selectedChallenges.map(c => c.id));
  if (finalUniqueIds.size !== selectedChallenges.length) {
    throw new Error('Failed to generate unique challenges - duplicate IDs detected');
  }

  logChallengeSelection('Successfully selected unique challenges with enhanced algorithm', {
    selected: selectedChallenges.length,
    sessionSeed: Math.floor(sessionSeed),
    uniqueIds: selectedChallenges.map(c => c.id),
    titles: selectedChallenges.map(c => c.title)
  });

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
