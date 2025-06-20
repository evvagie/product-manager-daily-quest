
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      skillArea, 
      difficulty, 
      exerciseCount = 4, 
      sessionContext, 
      uniquenessSeed, 
      timestamp,
      microTimestamp,
      uniqueHash,
      forceUnique = true 
    } = await req.json();
    
    const openAIApiKey = Deno.env.get('YUNO_KEY');

    console.log('🎯 Generate UNIQUE AI Challenge called with:', { 
      skillArea, 
      difficulty, 
      exerciseCount, 
      sessionContext, 
      forceUnique,
      timestamp,
      microTimestamp 
    });
    console.log('API Key available:', !!openAIApiKey);

    if (!openAIApiKey) {
      console.error('YUNO_KEY is not set in environment variables');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured - YUNO_KEY missing',
        details: 'Please ensure YUNO_KEY is set in Supabase Edge Function secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create ultra-unique session identifiers
    const ultraUniqueId = `${skillArea}-${difficulty}-${timestamp}-${microTimestamp}-${uniquenessSeed}-${uniqueHash}`;
    const randomVariation = Math.floor(Math.random() * 1000000);

    console.log('🚀 Generating COMPLETELY UNIQUE session:', ultraUniqueId);

    const prompt = `Generate exactly ${exerciseCount} COMPLETELY UNIQUE Product Manager challenges. Each must be 100% original and different from any previous generation.

CRITICAL: Return ONLY valid JSON with this EXACT structure:

{
  "sessionId": "${ultraUniqueId}",
  "skillArea": "${skillArea}",
  "difficulty": "${difficulty}",
  "totalExercises": ${exerciseCount},
  "exercises": [
    {
      "id": "unique-${randomVariation}-1",
      "title": "Challenge Title",
      "description": "Brief description",
      "type": "multiple-choice",
      "timeLimit": 180,
      "content": {
        "context": "Detailed scenario background",
        "scenario": "Specific problem to solve",
        "instructions": "Clear user instructions",
        "data": "Supporting information",
        "options": [
          {
            "id": "opt-${randomVariation}-1-1",
            "text": "Option 1",
            "isCorrect": true,
            "explanation": "Why this is correct"
          },
          {
            "id": "opt-${randomVariation}-1-2", 
            "text": "Option 2",
            "isCorrect": false,
            "explanation": "Why this is incorrect"
          },
          {
            "id": "opt-${randomVariation}-1-3",
            "text": "Option 3", 
            "isCorrect": false,
            "explanation": "Why this is incorrect"
          }
        ]
      }
    }
  ]
}

Requirements:
- ${skillArea} focus at ${difficulty} level
- Each exercise completely different scenario
- Unique company situations, products, markets
- Fresh contexts never seen before
- All IDs must be unique
- NO markdown, NO extra text, ONLY JSON`;

    console.log('🤖 Sending request to OpenAI with ultra-unique prompt');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert Product Manager challenge generator. Generate ONLY valid JSON. Session: ${ultraUniqueId}` 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.9,
        max_tokens: 3000,
        presence_penalty: 0.8,
        frequency_penalty: 0.8,
        seed: randomVariation
      }),
    });

    console.log('📥 OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText,
        sessionId: ultraUniqueId
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('✅ Raw OpenAI response received, length:', generatedContent.length);

    // Parse and validate the JSON response
    let challengeSession;
    try {
      // Clean the response more aggressively
      let cleanContent = generatedContent.trim();
      
      // Remove any markdown code blocks
      cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find the JSON object boundaries
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        throw new Error('No valid JSON object found in response');
      }
      
      cleanContent = cleanContent.substring(jsonStart, jsonEnd);
      
      challengeSession = JSON.parse(cleanContent);
      console.log('🎉 Successfully parsed JSON with', challengeSession.exercises?.length || 0, 'exercises');
      
      // Validate exercises structure
      if (!challengeSession.exercises || !Array.isArray(challengeSession.exercises)) {
        throw new Error('Invalid exercises array structure');
      }
      
      if (challengeSession.exercises.length !== exerciseCount) {
        throw new Error(`Expected ${exerciseCount} exercises, got ${challengeSession.exercises.length}`);
      }
      
      // Ensure each exercise has proper structure and unique IDs
      challengeSession.exercises = challengeSession.exercises.map((exercise: any, index: number) => {
        const baseId = `unique-${ultraUniqueId}-ex${index + 1}`;
        return {
          ...exercise,
          id: baseId,
          timeLimit: 180,
          content: {
            ...exercise.content,
            options: exercise.content?.options?.map((option: any, optIndex: number) => ({
              ...option,
              id: `opt-${baseId}-${optIndex + 1}`
            })) || []
          }
        };
      });
      
    } catch (parseError) {
      console.error('💥 JSON parse error:', parseError);
      console.error('Content that failed to parse (first 500 chars):', generatedContent.substring(0, 500));
      
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response as JSON',
        details: parseError.message,
        sessionId: ultraUniqueId,
        rawContent: generatedContent.substring(0, 200)
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Final validation and ensure required fields
    challengeSession.sessionId = ultraUniqueId;
    challengeSession.source = 'openai';
    challengeSession.estimatedDuration = exerciseCount * 180;

    console.log('🎯 Successfully generated UNIQUE AI challenge session:', {
      sessionId: challengeSession.sessionId,
      exerciseCount: challengeSession.exercises.length,
      skillArea: challengeSession.skillArea,
      difficulty: challengeSession.difficulty,
      uniqueId: ultraUniqueId
    });

    return new Response(JSON.stringify(challengeSession), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in generate-ai-challenge function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Unexpected error in AI challenge generation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
