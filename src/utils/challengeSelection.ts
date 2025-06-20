
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

// Get ALL unique challenges from the entire database
const getAllUniqueChallenges = (): any[] => {
  const allChallenges: any[] = [];
  const seenIds = new Set<string>();
  
  const allCategories = Object.keys(enhancedChallengeDatabase);
  
  for (const category of allCategories) {
    const categoryData = enhancedChallengeDatabase[category as keyof typeof enhancedChallengeDatabase];
    
    if (categoryData && typeof categoryData === 'object') {
      const difficulties = Object.keys(categoryData);
      
      for (const difficulty of difficulties) {
        const challenges = categoryData[difficulty as keyof typeof categoryData];
        
        if (Array.isArray(challenges)) {
          for (const challenge of challenges) {
            if (!seenIds.has(challenge.id)) {
              allChallenges.push({
                ...challenge,
                sourceCategory: category,
                sourceDifficulty: difficulty
              });
              seenIds.add(challenge.id);
            }
          }
        }
      }
    }
  }
  
  logDebug('Collected all unique challenges', {
    totalChallenges: allChallenges.length,
    categories: allCategories.length,
    uniqueIds: Array.from(seenIds).slice(0, 10)
  });
  
  return allChallenges;
};

// Simple but effective shuffle
const shuffleArray = (array: any[]): any[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  const timestamp = Date.now();
  
  logDebug('Starting challenge selection for 4 unique challenges', {
    availableCount: availableChallenges.length,
    requestedCount: count,
    timestamp
  });

  // Get ALL unique challenges from entire database
  const allUniqueChallenges = getAllUniqueChallenges();
  
  if (allUniqueChallenges.length === 0) {
    throw new Error('No challenges found in database');
  }

  // Shuffle to get random order
  const shuffledChallenges = shuffleArray(allUniqueChallenges);
  
  logDebug('Available challenges after shuffle', {
    totalAvailable: shuffledChallenges.length,
    firstFewTitles: shuffledChallenges.slice(0, 5).map(c => c.title)
  });

  const selectedChallenges: any[] = [];
  const usedIds = new Set<string>();
  const usedTitles = new Set<string>();
  const usedTypes = new Set<string>();

  // Select exactly 4 different challenges
  for (let i = 0; i < shuffledChallenges.length && selectedChallenges.length < 4; i++) {
    const candidate = shuffledChallenges[i];
    const candidateTitle = candidate.title?.toLowerCase().trim() || '';
    const candidateType = candidate.type?.toLowerCase() || '';
    
    // Ensure it's completely different (different ID, title, and preferably type)
    if (!usedIds.has(candidate.id) && 
        !usedTitles.has(candidateTitle) && 
        candidateTitle !== '') {
      
      // Prefer different types when possible, but don't block if we can't find enough
      const shouldInclude = !usedTypes.has(candidateType) || selectedChallenges.length >= 3;
      
      if (shouldInclude) {
        const uniqueId = `${candidate.id}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 100000)}`;
        
        selectedChallenges.push({
          ...candidate,
          id: uniqueId,
          originalId: candidate.id,
          instanceIndex: selectedChallenges.length,
          title: `${candidate.title} (Challenge ${selectedChallenges.length + 1})`
        });
        
        usedIds.add(candidate.id);
        usedTitles.add(candidateTitle);
        usedTypes.add(candidateType);
      }
    }
  }

  // Validation
  const finalIds = selectedChallenges.map(c => c.originalId || c.id);
  const finalTitles = selectedChallenges.map(c => c.title);
  const finalTypes = selectedChallenges.map(c => c.type);
  
  logChallengeSelection('Successfully selected 4 unique challenges', {
    selectedCount: selectedChallenges.length,
    originalIds: finalIds,
    titles: finalTitles,
    types: finalTypes,
    uniqueOriginalIds: new Set(finalIds).size,
    uniqueTitles: new Set(finalTitles.map(t => t?.toLowerCase().trim())).size,
    uniqueTypes: new Set(finalTypes).size
  });

  if (selectedChallenges.length < 4) {
    logDebug('Warning: Could not find 4 unique challenges', { 
      selectedCount: selectedChallenges.length
    });
  }

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
