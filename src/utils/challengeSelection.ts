
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

// Enhanced shuffle with better randomization
const advancedShuffle = (array: any[]): any[] => {
  const shuffled = [...array];
  const seed = Date.now() + Math.random() * 1000000 + performance.now();
  
  // Multiple shuffle passes for better randomization
  for (let pass = 0; pass < 3; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomValue = Math.abs(Math.sin(seed + i * 73.847 + pass * 47.123) * 43758.5453);
      const j = Math.floor(randomValue % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  
  return shuffled;
};

// Group challenges by type for better diversity
const groupByType = (challenges: any[]): { [key: string]: any[] } => {
  const grouped: { [key: string]: any[] } = {};
  
  challenges.forEach(challenge => {
    const type = challenge.type || 'unknown';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(challenge);
  });
  
  return grouped;
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  if (availableChallenges.length === 0) {
    throw new Error('No challenges available for selection');
  }

  const timestamp = Date.now();
  
  logDebug('Starting enhanced unique challenge selection', {
    availableCount: availableChallenges.length,
    requestedCount: count,
    timestamp
  });

  // Step 1: Remove duplicates with stricter criteria
  const uniqueChallenges: any[] = [];
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const seenScenarios = new Set<string>();
  const seenContentHashes = new Set<string>();

  for (const challenge of availableChallenges) {
    const id = challenge.id;
    const title = challenge.title?.toLowerCase().trim() || '';
    const scenario = challenge.content?.scenario?.toLowerCase().trim() || '';
    const context = challenge.content?.context?.toLowerCase().trim() || '';
    
    // Create content hash for deeper uniqueness check
    const contentHash = `${title}-${scenario}-${context}`.replace(/\s+/g, '').toLowerCase();
    
    if (!seenIds.has(id) && 
        !seenTitles.has(title) && 
        !seenScenarios.has(scenario) &&
        !seenContentHashes.has(contentHash)) {
      
      uniqueChallenges.push({...challenge});
      seenIds.add(id);
      seenTitles.add(title);
      seenScenarios.add(scenario);
      seenContentHashes.add(contentHash);
    }
  }

  logDebug('After strict deduplication', {
    originalCount: availableChallenges.length,
    uniqueCount: uniqueChallenges.length
  });

  if (uniqueChallenges.length === 0) {
    throw new Error('No unique challenges found after deduplication');
  }

  // Step 2: Group by type for diversity
  const groupedByType = groupByType(uniqueChallenges);
  const availableTypes = Object.keys(groupedByType);
  
  logDebug('Challenge types available', {
    types: availableTypes,
    distribution: Object.fromEntries(
      availableTypes.map(type => [type, groupedByType[type].length])
    )
  });

  // Step 3: Select challenges with type diversity
  const selectedChallenges: any[] = [];
  const usedTypes = new Set<string>();
  const usedIds = new Set<string>();
  const usedTitles = new Set<string>();

  // First pass: Try to get one challenge from each type
  for (const type of availableTypes) {
    if (selectedChallenges.length >= count) break;
    
    const challengesOfType = advancedShuffle(groupedByType[type]);
    
    for (const challenge of challengesOfType) {
      if (!usedIds.has(challenge.id) && !usedTitles.has(challenge.title?.toLowerCase().trim() || '')) {
        const uniqueId = `${challenge.id}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 100000)}`;
        
        selectedChallenges.push({
          ...challenge,
          id: uniqueId,
          originalId: challenge.id,
          instanceIndex: selectedChallenges.length,
          title: `${challenge.title} (Challenge ${selectedChallenges.length + 1})`
        });
        
        usedTypes.add(type);
        usedIds.add(challenge.id);
        usedTitles.add(challenge.title?.toLowerCase().trim() || '');
        break;
      }
    }
  }

  // Second pass: Fill remaining slots with unused challenges
  const remainingChallenges = uniqueChallenges.filter(c => !usedIds.has(c.id));
  const shuffledRemaining = advancedShuffle(remainingChallenges);

  for (const challenge of shuffledRemaining) {
    if (selectedChallenges.length >= count) break;
    
    if (!usedIds.has(challenge.id) && !usedTitles.has(challenge.title?.toLowerCase().trim() || '')) {
      const uniqueId = `${challenge.id}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 100000)}`;
      
      selectedChallenges.push({
        ...challenge,
        id: uniqueId,
        originalId: challenge.id,
        instanceIndex: selectedChallenges.length,
        title: `${challenge.title} (Challenge ${selectedChallenges.length + 1})`
      });
      
      usedIds.add(challenge.id);
      usedTitles.add(challenge.title?.toLowerCase().trim() || '');
    }
  }

  // Step 4: If still need more, create intelligent variants
  if (selectedChallenges.length < count) {
    const remainingNeeded = count - selectedChallenges.length;
    logDebug(`Creating ${remainingNeeded} intelligent variants`, {});
    
    for (let i = 0; i < remainingNeeded && uniqueChallenges.length > 0; i++) {
      const sourceIndex = (selectedChallenges.length + i) % uniqueChallenges.length;
      const sourceChallenge = uniqueChallenges[sourceIndex];
      
      // Create meaningful variant
      const variantType = sourceChallenge.type === 'multiple-choice' ? 'slider' : 'multiple-choice';
      const variantId = `variant-${sourceChallenge.id}-${timestamp}-${selectedChallenges.length}-${Math.floor(Math.random() * 100000)}`;
      
      const variant = {
        ...sourceChallenge,
        id: variantId,
        originalId: sourceChallenge.id,
        instanceIndex: selectedChallenges.length,
        type: variantType,
        title: `${sourceChallenge.title} (Alternative ${selectedChallenges.length + 1})`,
        content: {
          ...sourceChallenge.content,
          context: `Alternative scenario: ${sourceChallenge.content?.context || ''}`,
          scenario: `Different approach: ${sourceChallenge.content?.scenario || ''}`
        }
      };
      
      selectedChallenges.push(variant);
    }
  }

  // Final validation
  const finalIds = selectedChallenges.map(c => c.id);
  const finalTitles = selectedChallenges.map(c => c.title?.toLowerCase().trim());
  const finalTypes = selectedChallenges.map(c => c.type);
  
  const uniqueIdCount = new Set(finalIds).size;
  const uniqueTitleCount = new Set(finalTitles).size;
  
  if (uniqueIdCount !== selectedChallenges.length || uniqueTitleCount !== selectedChallenges.length) {
    logDebug('ERROR: Duplicates detected!', { 
      finalIds, 
      finalTitles,
      uniqueIdCount,
      uniqueTitleCount,
      totalSelected: selectedChallenges.length
    });
    throw new Error('Failed to create unique challenges - duplicates found');
  }

  logChallengeSelection('Successfully selected completely unique and diverse challenges', {
    selectedCount: selectedChallenges.length,
    requestedCount: count,
    uniqueIds: finalIds,
    titles: selectedChallenges.map(c => c.title),
    types: finalTypes,
    typeDistribution: Object.fromEntries(
      [...new Set(finalTypes)].map(type => [type, finalTypes.filter(t => t === type).length])
    )
  });

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
