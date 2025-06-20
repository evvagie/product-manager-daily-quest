
import { enhancedChallengeData } from '@/data/enhancedChallengeData';

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
  console.log('Generating challenge for:', { skillArea, difficulty, specificChallengeId });
  
  try {
    // If specific challenge ID is provided, try to find it first
    if (specificChallengeId) {
      const specificChallenge = enhancedChallengeData[skillArea as keyof typeof enhancedChallengeData]
        ?.find((challenge: any) => challenge.id === specificChallengeId);
      
      if (specificChallenge) {
        console.log('Found specific challenge:', specificChallenge.title);
        return {
          sessionId: `retry-${specificChallengeId}-${Date.now()}`,
          skillArea,
          difficulty,
          totalExercises: 1,
          exercises: [specificChallenge],
          source: 'static',
          estimatedDuration: specificChallenge.timeLimit
        };
      } else {
        console.warn('Specific challenge not found, falling back to normal generation');
      }
    }

    // Try OpenAI generation first
    try {
      const response = await fetch(`https://xtnlfdcqaqtqxyzywaoh.supabase.co/functions/v1/generate-ai-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bmxmZGNxYXF0cXh5enl3YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTkzMjEsImV4cCI6MjA2NTY3NTMyMX0.p05Zf-qKmWpmyI1Lc_t5lFZYG82ZXImCvZ1DxXi5uLA`
        },
        body: JSON.stringify({ skillArea, difficulty })
      });

      if (response.ok) {
        const aiData = await response.json();
        console.log('AI Challenge generated successfully');
        return {
          sessionId: `ai-${Date.now()}`,
          skillArea,
          difficulty,
          totalExercises: aiData.exercises?.length || 4,
          exercises: aiData.exercises || [],
          source: 'openai',
          estimatedDuration: (aiData.exercises?.length || 4) * 180
        };
      } else {
        console.warn('AI generation failed, falling back to static content');
      }
    } catch (aiError) {
      console.warn('AI generation error, falling back to static content:', aiError);
    }

    // Fallback to enhanced static content
    const categoryData = enhancedChallengeData[skillArea as keyof typeof enhancedChallengeData];
    if (!categoryData || categoryData.length === 0) {
      throw new Error(`No challenge data available for ${skillArea}`);
    }

    // Filter by difficulty and select 4 random challenges
    const filteredChallenges = categoryData.filter((challenge: any) => 
      challenge.difficulty?.toLowerCase() === difficulty.toLowerCase()
    );

    const challengesToUse = filteredChallenges.length > 0 ? filteredChallenges : categoryData;
    const selectedChallenges = [];
    const usedIndices = new Set();

    // Select 4 unique challenges
    while (selectedChallenges.length < Math.min(4, challengesToUse.length)) {
      const randomIndex = Math.floor(Math.random() * challengesToUse.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedChallenges.push(challengesToUse[randomIndex]);
      }
    }

    console.log('Using enhanced static challenges:', selectedChallenges.length);
    
    return {
      sessionId: `static-${Date.now()}`,
      skillArea,
      difficulty,
      totalExercises: selectedChallenges.length,
      exercises: selectedChallenges,
      source: 'static',
      estimatedDuration: selectedChallenges.reduce((total: number, challenge: any) => 
        total + (challenge.timeLimit || 180), 0
      )
    };

  } catch (error) {
    console.error('Error generating challenge:', error);
    throw error;
  }
};
