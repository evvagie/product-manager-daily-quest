
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

    // FORCE AI generation with maximum retries
    console.log('🤖 FORCING AI generation with maximum uniqueness parameters...');
    
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 AI Generation attempt ${attempt}/${maxRetries}`);
        
        const aiPayload = {
          skillArea,
          difficulty,
          sessionContext: `${sessionContext}-attempt${attempt}`,
          timestamp: timestamp + attempt,
          microTimestamp: microTimestamp + attempt,
          uniquenessSeed: `${randomId}-attempt${attempt}`,
          uniqueHash: `${uniqueHash}-${attempt}`,
          exerciseCount: 4,
          forceUnique: true,
          sessionType: 'new-generation'
        };

        const response = await fetch(`https://xtnlfdcqaqtqxyzywaoh.supabase.co/functions/v1/generate-ai-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bmxmZGNxYXF0cXh5enl3YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTkzMjEsImV4cCI6MjA2NTY3NTMyMX0.p05Zf-qKmWpmyI1Lc_t5lFZYG82ZXImCvZ1DxXi5uLA`
          },
          body: JSON.stringify(aiPayload)
        });

        if (response.ok) {
          const aiData = await response.json();
          
          if (aiData.exercises && aiData.exercises.length === 4) {
            console.log(`✅ AI Challenge generated successfully on attempt ${attempt}!`);
            
            return {
              sessionId: `ai-session-${sessionContext}-attempt${attempt}`,
              skillArea,
              difficulty,
              totalExercises: 4,
              exercises: aiData.exercises.map((exercise: any, index: number) => ({
                ...exercise,
                timeLimit: 180,
                id: `ai-${sessionContext}-attempt${attempt}-ex${index + 1}`
              })),
              source: 'openai',
              estimatedDuration: 720
            };
          } else {
            throw new Error(`AI generated ${aiData.exercises?.length || 0} exercises, need 4`);
          }
        } else {
          const errorData = await response.json();
          throw new Error(`AI API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error(`❌ AI generation attempt ${attempt} failed:`, error);
        lastError = error;
        
        if (attempt < maxRetries) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw new Error(`All ${maxRetries} AI generation attempts failed. Last error: ${lastError?.message}`);
    
  } catch (error) {
    console.error('💥 CRITICAL: AI generation failed completely:', error);
    throw new Error(`Failed to generate unique AI challenges: ${error.message}`);
  }
};
