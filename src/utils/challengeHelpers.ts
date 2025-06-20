
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
  // Generate a truly unique ID for each exercise instance
  const uniqueInstanceId = `${challenge.id}-${timestamp}-${index}-${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    ...challenge,
    timeLimit: 180,
    id: uniqueInstanceId,
    originalId: challenge.id, // Keep reference to original
    instanceIndex: index,
    content: {
      ...challenge.content,
      instructions: 'Complete this challenge to the best of your ability.'
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
