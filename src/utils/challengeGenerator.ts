
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
  console.log('🎯 Generating UNIQUE challenge session for:', { skillArea, difficulty, specificChallengeId });
  
  // Create unique session identifiers to ensure no repetition
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const sessionContext = `${skillArea}-${difficulty}-${timestamp}-${randomId}`;
  
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
            exercises: [{ ...specificChallenge, timeLimit: 60 }],
            source: 'static',
            estimatedDuration: 60
          };
        }
      }
    }

    // ALWAYS try AI generation first
    console.log('🤖 Attempting AI generation with enhanced uniqueness...');
    
    const aiPayload = {
      skillArea,
      difficulty,
      sessionContext,
      timestamp,
      uniquenessSeed: randomId,
      exerciseCount: 4
    };

    console.log('📤 Sending AI request with payload:', aiPayload);

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
      
      // Ensure proper structure and unique IDs
      let exercises = aiData.exercises || [];
      exercises = exercises.map((exercise: any, index: number) => ({
        ...exercise,
        timeLimit: 180,
        id: `ai-${sessionContext}-ex${index + 1}-${timestamp}`
      }));

      // Validate we have 4 exercises
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
        console.warn('⚠️ AI generated fewer than 4 exercises, trying again...');
        throw new Error('Insufficient exercises generated');
      }
    } else {
      const errorText = await response.text();
      console.error('❌ AI generation failed:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }
  } catch (error) {
    console.error('💥 AI generation error:', error);
    
    // Only fall back to static content if AI generation completely fails
    console.warn('🔄 Falling back to static content - AI generation unavailable');
    
    const categoryData = enhancedChallengeDatabase[skillArea as keyof typeof enhancedChallengeDatabase];
    
    if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
      const filteredChallenges = categoryData.filter((challenge: any) => 
        challenge.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );

      const challengesToUse = filteredChallenges.length > 0 ? filteredChallenges : categoryData;
      const selectedChallenges = [];
      const usedIndices = new Set();

      // Select up to 4 unique challenges
      while (selectedChallenges.length < Math.min(4, challengesToUse.length)) {
        const randomIndex = Math.floor(Math.random() * challengesToUse.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          const challenge = { 
            ...challengesToUse[randomIndex], 
            timeLimit: 180,
            id: `static-${sessionContext}-${selectedChallenges.length}-${timestamp}`
          };
          selectedChallenges.push(challenge);
        }
      }

      return {
        sessionId: `static-${sessionContext}`,
        skillArea,
        difficulty,
        totalExercises: selectedChallenges.length,
        exercises: selectedChallenges,
        source: 'static',
        estimatedDuration: selectedChallenges.length * 180
      };
    }

    // Emergency fallback
    console.error('🚨 Emergency fallback - creating basic exercises');
    const fallbackExercises = [];
    
    for (let i = 1; i <= 4; i++) {
      fallbackExercises.push({
        id: `emergency-${sessionContext}-${i}-${timestamp}`,
        title: `${skillArea} Challenge ${i}`,
        type: 'multiple-choice',
        timeLimit: 180,
        content: {
          context: `You are working on a ${skillArea} challenge as a Product Manager.`,
          instructions: 'Choose the best approach for this situation.',
          options: [
            {
              id: 'option-1',
              text: 'Focus on customer feedback and market research',
              isCorrect: true,
              explanation: 'Customer-driven approach ensures market fit.'
            },
            {
              id: 'option-2',
              text: 'Follow competitor strategies',
              isCorrect: false,
              explanation: 'Following competitors limits innovation.'
            }
          ]
        }
      });
    }
    
    return {
      sessionId: `emergency-${sessionContext}`,
      skillArea,
      difficulty,
      totalExercises: 4,
      exercises: fallbackExercises,
      source: 'static',
      estimatedDuration: 720
    };
  }
};
