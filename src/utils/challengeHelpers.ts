
export const generateSessionId = (type: string, skillArea: string, difficulty: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const microTime = performance.now().toString().replace('.', '');
  const sessionHash = Math.floor(Math.random() * 1000000);
  return `${type}-session-${skillArea}-${difficulty}-${timestamp}-${microTime}-${randomId}-${sessionHash}`;
};

export const generateRetrySessionId = (challengeId: string): string => {
  const timestamp = Date.now();
  const microTime = performance.now().toString().replace('.', '');
  const retryHash = Math.floor(Math.random() * 1000000);
  return `retry-${challengeId}-${timestamp}-${microTime}-${retryHash}`;
};

export const addExerciseMetadata = (challenge: any, timestamp: number, index: number) => {
  // Generate multiple unique identifiers to ensure absolute uniqueness
  const microTime = performance.now().toString().replace('.', '');
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const indexSuffix = index.toString().padStart(2, '0');
  const contentHash = Math.abs(JSON.stringify(challenge).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)).toString(36);
  
  // Create a completely unique ID that's impossible to duplicate
  const absoluteUniqueId = `${challenge.id}-${timestamp}-${microTime}-${indexSuffix}-${randomSuffix}-${contentHash}`;
  
  return {
    ...challenge,
    timeLimit: 180,
    id: absoluteUniqueId,
    originalId: challenge.originalId || challenge.id,
    instanceIndex: index,
    uniqueTimestamp: timestamp,
    content: {
      ...challenge.content,
      instructions: challenge.content?.instructions || 'Complete this challenge to the best of your ability.',
      uniqueMarker: `exercise-${index + 1}-${timestamp}-${contentHash}` // Additional uniqueness marker
    }
  };
};

export const logChallengeSelection = (context: string, data: any) => {
  console.log(`✅ ${context}:`, data);
};

export const logError = (context: string, error: any) => {
  console.error(`💥 ${context}:`, error);
};

export const logDebug = (context: string, data: any) => {
  console.log(`🎯 ${context}:`, data);
};
