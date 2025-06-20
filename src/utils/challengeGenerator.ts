
import { type ChallengeSession } from '@/types/challenge';
import { 
  generateSessionId, 
  generateRetrySessionId, 
  logDebug, 
  logError, 
  logChallengeSelection 
} from './challengeHelpers';
import {
  findSpecificChallenge,
  getChallengesForCategory,
  getFallbackChallenges,
  selectUniqueChallenges
} from './challengeSelection';

// Re-export types for backward compatibility
export type { Exercise, ChallengeSession } from '@/types/challenge';

export const generateDynamicChallenge = async (
  skillArea: string, 
  difficulty: string,
  specificChallengeId?: string | null
): Promise<ChallengeSession> => {
  logDebug('Generating static challenge session for', { skillArea, difficulty, specificChallengeId });
  
  try {
    // Handle retry scenario with specific challenge ID
    if (specificChallengeId) {
      const specificChallenge = findSpecificChallenge(skillArea, specificChallengeId);
      if (specificChallenge) {
        logChallengeSelection('Found specific static challenge for retry', specificChallenge.title);
        return {
          sessionId: generateRetrySessionId(specificChallengeId),
          skillArea,
          difficulty,
          totalExercises: 1,
          exercises: [specificChallenge],
          source: 'static',
          estimatedDuration: 180
        };
      }
    }

    // Get challenges for the requested category and difficulty
    let availableChallenges = getChallengesForCategory(skillArea, difficulty);

    // Fallback to any available challenges if none found
    if (availableChallenges.length === 0) {
      logDebug('Using fallback category', skillArea);
      availableChallenges = getFallbackChallenges();
      
      if (availableChallenges.length > 0) {
        const exercises = selectUniqueChallenges(availableChallenges);
        return {
          sessionId: generateSessionId('fallback', skillArea, difficulty),
          skillArea,
          difficulty,
          totalExercises: exercises.length,
          exercises,
          source: 'static',
          estimatedDuration: exercises.length * 180
        };
      }
      
      throw new Error(`No challenges found for skill area: ${skillArea}`);
    }

    // Select unique challenges
    const exercises = selectUniqueChallenges(availableChallenges);

    logChallengeSelection('Successfully selected static challenges', {
      count: exercises.length,
      titles: exercises.map(e => e.title),
      uniqueIds: exercises.map(e => e.id)
    });

    return {
      sessionId: generateSessionId('static', skillArea, difficulty),
      skillArea,
      difficulty,
      totalExercises: exercises.length,
      exercises,
      source: 'static',
      estimatedDuration: exercises.length * 180
    };
    
  } catch (error) {
    logError('Error generating static challenge session', error);
    throw new Error(`Failed to generate static challenges: ${error.message}`);
  }
};
