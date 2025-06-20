
import "https://deno.land/x/xhr@0.1.0/mod.ts";import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const prompt = `You are an expert Product Manager challenge generator. Your task is to create ${exerciseCount} COMPLETELY UNIQUE and DIFFERENT Product Manager challenges that have NEVER been generated before.

CRITICAL UNIQUENESS REQUIREMENTS:
- Session ID: ${ultraUniqueId}
- Random Variation: ${randomVariation}
- EVERY scenario must be completely original and different
- NO repetition of content, scenarios, or solutions
- Each exercise must have unique context, problems, and options
- Use current date: ${new Date().toISOString()}
- Skill Area: ${skillArea}
- Difficulty: ${difficulty}

RESPONSE FORMAT - Return ONLY this JSON structure with NO additional text:
{
  "sessionId": "${ultraUniqueId}",
  "skillArea": "${skillArea}",
  "difficulty": "${difficulty}",
  "totalExercises": ${exerciseCount},
  "exercises": [
    {
      "id": "exercise-${randomVariation}-1",
      "title": "Completely Unique Challenge Title",
      "description": "Original exercise description",
      "type": "multiple-choice",
      "timeLimit": 180,
      "content": {
        "context": "Original detailed scenario background - must be unique",
        "scenario": "Specific unique problem to solve",
        "instructions": "Clear user instructions",
        "data": "Supporting information specific to this scenario",
        "options": [
          {
            "id": "option-${randomVariation}-1",
            "text": "First unique option description",
            "isCorrect": true,
            "explanation": "Detailed explanation why this is correct for this specific scenario"
          },
          {
            "id": "option-${randomVariation}-2",
            "text": "Second unique option description",
            "isCorrect": false,
            "explanation": "Detailed explanation why this is incorrect for this specific scenario"
          },
          {
            "id": "option-${randomVariation}-3",
            "text": "Third unique option description",
            "isCorrect": false,
            "explanation": "Detailed explanation why this is incorrect for this specific scenario"
          }
        ]
      }
    }
  ]
}

GENERATE ${exerciseCount} COMPLETELY ORIGINAL ${skillArea} scenarios for Product Managers at ${difficulty} level. Each must be entirely different with unique:
- Company situations
- Product challenges
- Market contexts
- Team dynamics
- Technical constraints
- Business objectives

Make every scenario fresh, realistic, and never before seen. Use your creativity to ensure maximum uniqueness.`;

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
            content: `You are an expert Product Manager challenge generator. Your mission is to create COMPLETELY UNIQUE challenges that have never been generated before. Use maximum creativity and originality. Session: ${ultraUniqueId} | Variation: ${randomVariation}` 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 1.0,
        max_tokens: 4000,
        presence_penalty: 1.0,
        frequency_penalty: 1.0,
        top_p: 0.95,
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
    console.log('First 300 chars:', generatedContent.substring(0, 300));

    // Parse and validate the JSON response
    let challengeSession;
    try {
      // Clean the response aggressively
      const cleanContent = generatedContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s+|\s+$/g, '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      challengeSession = JSON.parse(cleanContent);
      console.log('🎉 Successfully parsed JSON with', challengeSession.exercises?.length || 0, 'exercises');
      
      // Validate exercises
      if (!challengeSession.exercises || !Array.isArray(challengeSession.exercises)) {
        throw new Error('Invalid exercises array');
      }
      
      // Ensure each exercise has proper structure
      challengeSession.exercises = challengeSession.exercises.map((exercise: any, index: number) => ({
        ...exercise,
        id: `unique-${ultraUniqueId}-ex${index + 1}`,
        timeLimit: 180,
        content: {
          ...exercise.content,
          options: exercise.content?.options?.map((option: any, optIndex: number) => ({
            ...option,
            id: `opt-${ultraUniqueId}-${index}-${optIndex}`
          })) || []
        }
      }));
      
    } catch (parseError) {
      console.error('💥 JSON parse error:', parseError);
      console.error('Content that failed to parse:', generatedContent.substring(0, 500));
      
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

    // Final validation
    if (!challengeSession.exercises || challengeSession.exercises.length !== exerciseCount) {
      console.error('❌ Invalid exercise count:', {
        expected: exerciseCount,
        received: challengeSession.exercises?.length || 0
      });
      
      return new Response(JSON.stringify({ 
        error: `Invalid exercise structure - expected ${exerciseCount} exercises`,
        details: `Received ${challengeSession.exercises?.length || 0} exercises`,
        sessionId: ultraUniqueId
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure required fields
    challengeSession.sessionId = ultraUniqueId;
    challengeSession.source = 'openai';
    challengeSession.randomSeed = randomVariation;
    challengeSession.timestamp = timestamp;
    challengeSession.microTimestamp = microTimestamp;

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
      details: 'Unexpected error in AI challenge generation',
      timestamp: Date.now()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
