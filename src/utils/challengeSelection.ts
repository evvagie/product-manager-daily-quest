
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

// Improved shuffle algorithm with time-based seeding
const improvedShuffle = (array: any[]): any[] => {
  const shuffled = [...array];
  const seed = Date.now() + Math.random() * 1000000;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValue = Math.abs(Math.sin(seed + i * 73.847) * 43758.5453);
    const j = Math.floor(randomValue % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  if (availableChallenges.length === 0) {
    throw new Error('No challenges available for selection');
  }

  const timestamp = Date.now();
  
  logDebug('Starting truly unique challenge selection', {
    availableCount: availableChallenges.length,
    requestedCount: count,
    timestamp
  });

  // Step 1: Remove duplicates based on multiple criteria
  const uniqueChallenges: any[] = [];
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const seenTypes = new Set<string>();
  const seenScenarios = new Set<string>();

  for (const challenge of availableChallenges) {
    const id = challenge.id;
    const title = challenge.title?.toLowerCase().trim() || '';
    const type = challenge.type || 'unknown';
    const scenario = challenge.content?.scenario?.toLowerCase().trim() || '';
    const context = challenge.content?.context?.toLowerCase().trim() || '';
    
    // Create a composite key for scenario uniqueness
    const scenarioKey = `${scenario}-${context}`.substring(0, 100);
    
    // Only add if completely unique across all criteria
    if (!seenIds.has(id) && 
        !seenTitles.has(title) && 
        !seenScenarios.has(scenarioKey)) {
      
      uniqueChallenges.push({...challenge});
      seenIds.add(id);
      seenTitles.add(title);
      seenTypes.add(type);
      seenScenarios.add(scenarioKey);
    }
  }

  logDebug('After deduplication', {
    originalCount: availableChallenges.length,
    uniqueCount: uniqueChallenges.length,
    uniqueIds: uniqueChallenges.map(c => c.id),
    uniqueTitles: uniqueChallenges.map(c => c.title)
  });

  if (uniqueChallenges.length === 0) {
    throw new Error('No unique challenges found after deduplication');
  }

  // Step 2: Shuffle the unique challenges
  const shuffledChallenges = improvedShuffle(uniqueChallenges);

  // Step 3: Select the required number with guaranteed uniqueness
  const selectedChallenges: any[] = [];
  const finalSeenIds = new Set<string>();
  const finalSeenTitles = new Set<string>();

  for (let i = 0; i < shuffledChallenges.length && selectedChallenges.length < count; i++) {
    const challenge = shuffledChallenges[i];
    const challengeId = challenge.id;
    const challengeTitle = challenge.title?.toLowerCase().trim() || '';
    
    if (!finalSeenIds.has(challengeId) && !finalSeenTitles.has(challengeTitle)) {
      // Create a unique instance with timestamp-based ID
      const uniqueInstanceId = `${challengeId}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 10000)}`;
      
      const uniqueInstance = {
        ...challenge,
        id: uniqueInstanceId,
        originalId: challengeId,
        instanceIndex: selectedChallenges.length,
        title: `${challenge.title} (Challenge ${selectedChallenges.length + 1})`
      };
      
      selectedChallenges.push(uniqueInstance);
      finalSeenIds.add(challengeId);
      finalSeenTitles.add(challengeTitle);
    }
  }

  // Step 4: If we still need more challenges, create variants from different categories
  if (selectedChallenges.length < count && uniqueChallenges.length > 0) {
    const remainingNeeded = count - selectedChallenges.length;
    logDebug(`Need ${remainingNeeded} more challenges, creating variants`, {});
    
    for (let i = 0; i < remainingNeeded && uniqueChallenges.length > 0; i++) {
      const sourceIndex = i % uniqueChallenges.length;
      const sourceChallenge = uniqueChallenges[sourceIndex];
      
      const variantId = `variant-${sourceChallenge.id}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 10000)}`;
      
      const variant = {
        ...sourceChallenge,
        id: variantId,
        originalId: sourceChallenge.id,
        instanceIndex: selectedChallenges.length,
        title: `${sourceChallenge.title} (Variant ${selectedChallenges.length + 1})`,
        content: {
          ...sourceChallenge.content,
          context: `${sourceChallenge.content?.context || ''} (Alternative scenario)`,
          scenario: `${sourceChallenge.content?.scenario || ''} (Different context)`
        }
      };
      
      selectedChallenges.push(variant);
    }
  }

  // Final validation
  const finalIds = selectedChallenges.map(c => c.id);
  const uniqueIdCount = new Set(finalIds).size;
  
  if (uniqueIdCount !== selectedChallenges.length) {
    logDebug('ERROR: Duplicate IDs detected!', { finalIds });
    throw new Error('Failed to create unique challenges - duplicate IDs found');
  }

  logChallengeSelection('Successfully selected completely unique challenges', {
    selectedCount: selectedChallenges.length,
    requestedCount: count,
    uniqueIds: finalIds,
    titles: selectedChallenges.map(c => c.title),
    types: selectedChallenges.map(c => c.type)
  });

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
