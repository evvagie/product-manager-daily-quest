
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

// Collect ALL unique challenges from ALL categories and difficulties
const getAllUniqueBaseChallenges = (): any[] => {
  const allChallenges: any[] = [];
  const seenIds = new Set<string>();
  
  // Get challenges from ALL categories, not just the requested one
  const allCategories = Object.keys(enhancedChallengeDatabase);
  
  for (const category of allCategories) {
    const categoryData = enhancedChallengeDatabase[category as keyof typeof enhancedChallengeDatabase];
    
    if (categoryData && typeof categoryData === 'object') {
      const difficulties = Object.keys(categoryData);
      
      for (const difficulty of difficulties) {
        const challenges = categoryData[difficulty as keyof typeof categoryData];
        
        if (Array.isArray(challenges)) {
          for (const challenge of challenges) {
            // Only add truly unique challenges based on ID
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
  
  logDebug('Collected all unique base challenges', {
    totalChallenges: allChallenges.length,
    categories: allCategories.length,
    uniqueIds: Array.from(seenIds).slice(0, 10) // Show first 10 IDs
  });
  
  return allChallenges;
};

// Advanced shuffle that uses multiple randomization sources
const deterministicShuffle = (array: any[], seed: number): any[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Use a more complex random function with the seed
    const randomValue = Math.abs(Math.sin(seed + i * 9973) * 43758.5453);
    const j = Math.floor(randomValue % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Create a variant of a challenge with different type and content
const createChallengeVariant = (baseChallenge: any, variantIndex: number, timestamp: number): any => {
  const variantTypes = ['multiple-choice', 'slider', 'drag-drop', 'dialogue', 'ranking'];
  const originalType = baseChallenge.type || 'multiple-choice';
  
  // Pick a different type than the original
  const availableTypes = variantTypes.filter(type => type !== originalType);
  const newType = availableTypes[variantIndex % availableTypes.length] || 'slider';
  
  // Create significantly different content
  const variantScenarios = [
    'Crisis Management: Urgent stakeholder escalation requiring immediate decision',
    'Strategic Planning: Long-term product roadmap adjustment needed',
    'Resource Allocation: Budget constraints forcing prioritization choices',
    'Team Dynamics: Cross-functional conflict resolution scenario',
    'Customer Impact: User feedback demanding product pivot decision'
  ];
  
  const variantContexts = [
    'You have 30 minutes to present a solution to the board',
    'The engineering team is waiting for your technical direction',
    'Marketing needs your input for the upcoming campaign launch',
    'Customer success is reporting escalating user complaints',
    'The competitive landscape has shifted dramatically this quarter'
  ];
  
  const variantId = `${baseChallenge.id}-variant-${newType}-${variantIndex}-${timestamp}`;
  
  return {
    ...baseChallenge,
    id: variantId,
    originalId: baseChallenge.id,
    type: newType,
    title: `${baseChallenge.title} (${newType.charAt(0).toUpperCase() + newType.slice(1)} Variant)`,
    content: {
      ...baseChallenge.content,
      scenario: variantScenarios[variantIndex % variantScenarios.length],
      context: variantContexts[variantIndex % variantContexts.length],
      instructions: `This is a ${newType} variant of the original challenge. ${baseChallenge.content?.instructions || 'Complete this challenge to the best of your ability.'}`
    },
    isVariant: true,
    variantIndex
  };
};

export const selectUniqueChallenges = (availableChallenges: any[], count: number = 4): Exercise[] => {
  const timestamp = Date.now();
  
  logDebug('Starting completely new unique challenge selection', {
    availableCount: availableChallenges.length,
    requestedCount: count,
    timestamp
  });

  // Get ALL unique challenges from the entire database
  const allUniqueChallenges = getAllUniqueBaseChallenges();
  
  if (allUniqueChallenges.length === 0) {
    throw new Error('No unique challenges found in the entire database');
  }

  // Shuffle the challenges using timestamp as seed
  const shuffledChallenges = deterministicShuffle(allUniqueChallenges, timestamp);
  
  logDebug('Shuffled all challenges', {
    totalAvailable: shuffledChallenges.length,
    firstFewTitles: shuffledChallenges.slice(0, 5).map(c => c.title)
  });

  const selectedChallenges: any[] = [];
  const usedIds = new Set<string>();
  const usedTitles = new Set<string>();
  const usedTypes = new Set<string>();

  // Step 1: Select first challenge directly
  if (shuffledChallenges.length > 0) {
    const firstChallenge = shuffledChallenges[0];
    const uniqueId = `${firstChallenge.id}-${timestamp}-0-${Math.floor(Math.random() * 100000)}`;
    
    selectedChallenges.push({
      ...firstChallenge,
      id: uniqueId,
      originalId: firstChallenge.id,
      instanceIndex: 0,
      title: `${firstChallenge.title} (Challenge 1)`
    });
    
    usedIds.add(firstChallenge.id);
    usedTitles.add(firstChallenge.title?.toLowerCase().trim() || '');
    usedTypes.add(firstChallenge.type || 'multiple-choice');
  }

  // Step 2: Select remaining challenges, ensuring they're different
  let challengeIndex = 1;
  for (let i = 1; i < shuffledChallenges.length && selectedChallenges.length < count; i++) {
    const candidate = shuffledChallenges[i];
    const candidateTitle = candidate.title?.toLowerCase().trim() || '';
    const candidateType = candidate.type || 'multiple-choice';
    
    // Only select if it's truly different (different ID, title, and preferably type)
    if (!usedIds.has(candidate.id) && 
        !usedTitles.has(candidateTitle) && 
        candidateTitle !== '') {
      
      const uniqueId = `${candidate.id}-${timestamp}-${challengeIndex}-${Math.floor(Math.random() * 100000)}`;
      
      selectedChallenges.push({
        ...candidate,
        id: uniqueId,
        originalId: candidate.id,
        instanceIndex: challengeIndex,
        title: `${candidate.title} (Challenge ${challengeIndex + 1})`
      });
      
      usedIds.add(candidate.id);
      usedTitles.add(candidateTitle);
      usedTypes.add(candidateType);
      challengeIndex++;
    }
  }

  // Step 3: If we still need more challenges, create variants
  while (selectedChallenges.length < count && allUniqueChallenges.length > 0) {
    const baseIndex = selectedChallenges.length % allUniqueChallenges.length;
    const baseChallenge = allUniqueChallenges[baseIndex];
    
    // Make sure we don't use a challenge we've already used
    if (!usedIds.has(baseChallenge.id)) {
      const variant = createChallengeVariant(baseChallenge, selectedChallenges.length, timestamp);
      selectedChallenges.push(variant);
      usedIds.add(baseChallenge.id);
      usedTitles.add(baseChallenge.title?.toLowerCase().trim() || '');
    } else {
      // Find an unused challenge for the variant
      const unusedChallenge = allUniqueChallenges.find(c => !usedIds.has(c.id));
      if (unusedChallenge) {
        const variant = createChallengeVariant(unusedChallenge, selectedChallenges.length, timestamp);
        selectedChallenges.push(variant);
        usedIds.add(unusedChallenge.id);
        usedTitles.add(unusedChallenge.title?.toLowerCase().trim() || '');
      }
    }
  }

  // Final validation
  const finalIds = selectedChallenges.map(c => c.id);
  const finalOriginalIds = selectedChallenges.map(c => c.originalId || c.id);
  const finalTitles = selectedChallenges.map(c => c.title);
  const finalTypes = selectedChallenges.map(c => c.type);
  
  const uniqueOriginalIds = new Set(finalOriginalIds).size;
  const uniqueTitles = new Set(finalTitles.map(t => t?.toLowerCase().trim())).size;
  
  logChallengeSelection('Successfully selected diverse challenges', {
    selectedCount: selectedChallenges.length,
    requestedCount: count,
    uniqueIds: finalIds,
    uniqueOriginalIds: finalOriginalIds,
    titles: finalTitles,
    types: finalTypes,
    uniqueOriginalIdCount: uniqueOriginalIds,
    uniqueTitleCount: uniqueTitles,
    typeDistribution: Object.fromEntries(
      [...new Set(finalTypes)].map(type => [type, finalTypes.filter(t => t === type).length])
    )
  });

  if (uniqueOriginalIds !== selectedChallenges.length) {
    logDebug('Warning: Some challenges may share base content', { 
      selectedCount: selectedChallenges.length,
      uniqueOriginalIds: uniqueOriginalIds
    });
  }

  return selectedChallenges.map((challenge: any, index: number) => 
    addExerciseMetadata(challenge, timestamp, index)
  );
};
