
import { supabase } from '@/integrations/supabase/client';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: string;
  timeLimit: number;
  content: any;
}

export interface ChallengeSession {
  sessionId: string;
  skillArea: string;
  difficulty: string;
  totalExercises: number;
  exercises: Exercise[];
  source?: string;
  generatedAt?: string;
  randomSeed?: number;
  timestamp?: number;
}

export const generateDynamicChallenge = async (skillArea: string, difficulty: string): Promise<ChallengeSession> => {
  const timestamp = Date.now();
  console.log('🚀 Starting OpenAI challenge generation:', { skillArea, difficulty, timestamp });
  
  try {
    // Get YUNO_KEY from Supabase secrets
    const { data: secretsData, error: secretsError } = await supabase.functions.invoke('get-secrets');
    
    if (secretsError || !secretsData?.OPENAI_API_KEY) {
      console.error('❌ YUNO_KEY not found:', secretsError);
      throw new Error('YUNO_KEY not configured');
    }

    const apiKey = secretsData.OPENAI_API_KEY;
    console.log('🔑 YUNO_KEY retrieved successfully');

    // Create a simple, reliable prompt for generating 4 exercises
    const prompt = `Generate exactly 4 product management exercises for skill area "${skillArea}" at "${difficulty}" level.

Return a JSON object with this exact structure:
{
  "exercises": [
    {
      "id": "unique-id-1",
      "title": "Exercise Title",
      "description": "Exercise description",
      "type": "multiple-choice",
      "timeLimit": 60,
      "content": {
        "context": "Scenario description",
        "scenario": "Specific situation",
        "instructions": "What to do",
        "options": [
          {
            "id": "option-1",
            "text": "Option text",
            "description": "Option description",
            "isCorrect": true,
            "quality": "excellent",
            "explanation": "Why this is correct"
          }
        ]
      }
    }
  ]
}

Make each exercise unique with different scenarios. Include 2-4 options per exercise with clear explanations.`;

    console.log('📡 Making OpenAI API call...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a product management expert who creates educational exercises. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('📋 OpenAI response received:', { 
      hasChoices: !!aiResponse.choices,
      choiceCount: aiResponse.choices?.length 
    });

    const content = aiResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse the JSON response
    let exerciseData;
    try {
      exerciseData = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    // Validate the response structure
    if (!exerciseData.exercises || !Array.isArray(exerciseData.exercises) || exerciseData.exercises.length !== 4) {
      console.error('❌ Invalid exercise structure:', exerciseData);
      throw new Error('OpenAI response does not contain 4 exercises');
    }

    // Create the challenge session
    const sessionId = `ai-session-${skillArea}-${difficulty}-${timestamp}`;
    const challengeSession: ChallengeSession = {
      sessionId,
      skillArea,
      difficulty,
      totalExercises: 4,
      exercises: exerciseData.exercises,
      source: 'openai-direct',
      generatedAt: new Date().toISOString(),
      timestamp
    };

    console.log('✅ AI challenge session generated successfully!', {
      sessionId,
      exerciseCount: challengeSession.exercises.length,
      source: challengeSession.source
    });

    return challengeSession;

  } catch (error) {
    console.error('💥 Error in OpenAI challenge generation:', error);
    
    // Show user-friendly error instead of fallback
    throw new Error(`Failed to generate AI challenges: ${error.message}. Please check your YUNO_KEY configuration.`);
  }
};
