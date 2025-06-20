
export const generateSessionId = (type: string, skillArea: string, difficulty: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const microTime = performance.now().toString().replace('.', '');
  return `${type}-session-${skillArea}-${difficulty}-${timestamp}-${microTime}-${randomId}`;
};

export const generateRetrySessionId = (challengeId: string): string => {
  const timestamp = Date.now();
  const microTime = performance.now().toString().replace('.', '');
  return `retry-${challengeId}-${timestamp}-${microTime}`;
};

export const addExerciseMetadata = (challenge: any, timestamp: number, index: number) => ({
  ...challenge,
  timeLimit: 180,
  id: `${challenge.id}-${timestamp}-${index}-${Math.random().toString(36).substring(2, 8)}`,
  content: {
    ...challenge.content,
    instructions: 'Complete this challenge to the best of your ability.'
  }
});

export const logChallengeSelection = (context: string, data: any) => {
  console.log(`✅ ${context}:`, data);
};

export const logError = (context: string, error: any) => {
  console.error(`💥 ${context}:`, error);
};

export const logDebug = (context: string, data: any) => {
  console.log(`🎯 ${context}:`, data);
};
