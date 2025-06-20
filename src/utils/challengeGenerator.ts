
import { enhancedChallengeDatabase } from '@/data/enhancedChallengeData';

export interface Exercise {
  id: string;
  title: string;
  type: string;
  timeLimit: number;
  content: {
    context: string;
    instructions: string;
    scenario?: string;
    data?: string;
    options?: any[];
    constraints?: string;
    tradeOffs?: any[];
    priorities?: any[];
    conversation?: any[];
    retrospectiveData?: any;
    totalResources?: number;
  };
}

export interface ChallengeSession {
  sessionId: string;
  skillArea: string;
  difficulty: string;
  totalExercises: number;
  exercises: Exercise[];
  source: 'static' | 'openai';
  estimatedDuration: number;
}

export const generateDynamicChallenge = async (
  skillArea: string, 
  difficulty: string,
  specificChallengeId?: string | null
): Promise<ChallengeSession> => {
  console.log('🎯 Generating COMPLETELY UNIQUE challenge session for:', { skillArea, difficulty, specificChallengeId });
  
  // Create ultra-unique session identifiers to prevent any repetition
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const microTimestamp = performance.now();
  const uniqueHash = btoa(`${skillArea}-${difficulty}-${timestamp}-${randomId}-${microTimestamp}`).substring(0, 10);
  const sessionContext = `${skillArea}-${difficulty}-${timestamp}-${randomId}-${uniqueHash}`;
  
  try {
    // If specific challenge ID is provided (retry scenario), try to find it first
    if (specificChallengeId && !specificChallengeId.includes('ai-session')) {
      const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
      if (categoryData && Array.isArray(categoryData)) {
        const specificChallenge = categoryData.find((challenge: any) => challenge.id === specificChallengeId);
        
        if (specificChallenge) {
          console.log('📋 Found specific static challenge for retry:', specificChallenge.title);
          return {
            sessionId: `retry-${specificChallengeId}-${timestamp}`,
            skillArea,
            difficulty,
            totalExercises: 1,
            exercises: [{ ...specificChallenge, timeLimit: 180 }],
            source: 'static',
            estimatedDuration: 180
          };
        }
      }
    }

    // FORCE AI generation - no fallback to static content for regular sessions
    console.log('🤖 FORCING AI generation with maximum uniqueness parameters...');
    
    const aiPayload = {
      skillArea,
      difficulty,
      sessionContext,
      timestamp,
      microTimestamp,
      uniquenessSeed: randomId,
      uniqueHash,
      exerciseCount: 4,
      forceUnique: true,
      sessionType: 'new-generation'
    };

    console.log('📤 Sending ENHANCED AI request with payload:', aiPayload);

    const response = await fetch(`https://xtnlfdcqaqtqxyzywaoh.supabase.co/functions/v1/generate-ai-challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bmxmZGNxYXF0cXh5enl3YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTkzMjEsImV4cCI6MjA2NTY3NTMyMX0.p05Zf-qKmWpmyI1Lc_t5lFZYG82ZXImCvZ1DxXi5uLA`
      },
      body: JSON.stringify(aiPayload)
    });

    console.log('📥 AI Response status:', response.status);

    if (response.ok) {
      const aiData = await response.json();
      console.log('✅ AI Challenge generated successfully!', {
        exerciseCount: aiData.exercises?.length,
        sessionId: aiData.sessionId
      });
      
      // Ensure proper structure and ultra-unique IDs
      let exercises = aiData.exercises || [];
      exercises = exercises.map((exercise: any, index: number) => ({
        ...exercise,
        timeLimit: 180,
        id: `ai-${sessionContext}-ex${index + 1}-${timestamp}-${microTimestamp}`
      }));

      // Validate we have exactly 4 unique exercises
      if (exercises.length >= 4) {
        return {
          sessionId: `ai-session-${sessionContext}`,
          skillArea,
          difficulty,
          totalExercises: 4,
          exercises: exercises.slice(0, 4),
          source: 'openai',
          estimatedDuration: 720
        };
      } else {
        console.error('❌ AI generated insufficient exercises:', exercises.length);
        throw new Error(`AI generated only ${exercises.length} exercises, need 4`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ AI generation failed:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('💥 CRITICAL: AI generation failed completely:', error);
    
    // For regular sessions, we MUST have AI generation - throw error instead of fallback
    throw new Error(`Failed to generate unique AI challenges: ${error.message}`);
  }
};
