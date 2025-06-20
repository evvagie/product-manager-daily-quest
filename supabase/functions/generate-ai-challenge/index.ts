
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
    const { skillArea, difficulty, exerciseCount = 4, sessionContext, uniquenessSeed } = await req.json();
    const openAIApiKey = Deno.env.get('YUNO_KEY');

    console.log('Generate AI Challenge called with:', { skillArea, difficulty, exerciseCount, sessionContext });
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

    // Create unique session identifiers
    const timestamp = Date.now();
    const randomId = uniquenessSeed || Math.floor(Math.random() * 100000);
    const uniqueSessionId = `${skillArea}-${difficulty}-${timestamp}-${randomId}`;

    console.log('Generating unique session:', uniqueSessionId);

    const prompt = `You are an expert Product Manager challenge generator. Create exactly ${exerciseCount} completely unique and different Product Manager challenges.

CRITICAL REQUIREMENTS:
- Generate ENTIRELY NEW scenarios each time - never repeat content
- Each exercise must be completely different from the others
- Return ONLY valid JSON with no additional text, comments, or formatting
- All JSON properties must be properly quoted
- No trailing commas or syntax errors

SESSION INFO:
- Session ID: ${uniqueSessionId}
- Skill Area: ${skillArea}
- Difficulty: ${difficulty}
- Unique Seed: ${randomId}

RESPONSE FORMAT - Return ONLY this JSON structure:
{
  "sessionId": "${uniqueSessionId}",
  "skillArea": "${skillArea}",
  "difficulty": "${difficulty}",
  "totalExercises": ${exerciseCount},
  "exercises": [
    {
      "id": "exercise-1",
      "title": "Unique Exercise Title",
      "description": "Brief exercise description",
      "type": "multiple-choice",
      "timeLimit": 180,
      "content": {
        "context": "Detailed scenario background",
        "scenario": "Specific problem to solve",
        "instructions": "Clear user instructions",
        "data": "Supporting information",
        "options": [
          {
            "id": "option-1",
            "text": "First option description",
            "isCorrect": true,
            "explanation": "Why this is correct",
            "consequences": [
              {
                "type": "positive",
                "title": "Immediate Impact",
                "description": "What happens next"
              }
            ]
          },
          {
            "id": "option-2",
            "text": "Second option description",
            "isCorrect": false,
            "explanation": "Why this is incorrect"
          }
        ]
      }
    }
  ]
}

Create ${exerciseCount} realistic ${skillArea} scenarios for ${difficulty} level Product Managers. Make each exercise completely unique with different contexts, problems, and solutions.`;

    console.log('Sending request to OpenAI with model gpt-4o-mini');

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
            content: `You are a Product Manager challenge generator. Always respond with ONLY valid JSON. No additional text, explanations, or formatting. Session: ${uniqueSessionId}` 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.9,
        max_tokens: 3500,
        presence_penalty: 0.6,
        frequency_penalty: 0.8,
      }),
    });

    console.log('OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText,
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Raw OpenAI response length:', generatedContent.length);
    console.log('First 200 chars:', generatedContent.substring(0, 200));

    // Parse and validate the JSON response
    let challengeSession;
    try {
      // Clean the response - remove any markdown formatting or extra whitespace
      const cleanContent = generatedContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s+|\s+$/g, '')
        .trim();
      
      challengeSession = JSON.parse(cleanContent);
      console.log('Successfully parsed JSON with', challengeSession.exercises?.length || 0, 'exercises');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content that failed to parse:', generatedContent);
      
      // Create a fallback structure if JSON parsing fails
      challengeSession = {
        sessionId: uniqueSessionId,
        skillArea: skillArea,
        difficulty: difficulty,
        totalExercises: exerciseCount,
        exercises: []
      };
      
      // Generate fallback exercises
      for (let i = 1; i <= exerciseCount; i++) {
        challengeSession.exercises.push({
          id: `fallback-exercise-${i}`,
          title: `${skillArea} Challenge ${i}`,
          description: `Product Manager challenge for ${skillArea}`,
          type: "multiple-choice",
          timeLimit: 180,
          content: {
            context: `You are working on a ${skillArea} challenge as a Product Manager.`,
            scenario: `Scenario ${i}: Make the best decision for your product.`,
            instructions: "Choose the most appropriate option.",
            data: "Consider the context and make your choice.",
            options: [
              {
                id: "option-1",
                text: "Option A: Focus on user feedback and data",
                isCorrect: true,
                explanation: "This approach prioritizes user needs and evidence-based decisions."
              },
              {
                id: "option-2",
                text: "Option B: Follow competitor strategies",
                isCorrect: false,
                explanation: "Simply copying competitors may not align with your unique value proposition."
              }
            ]
          }
        });
      }
    }

    // Validate exercise structure
    if (!challengeSession.exercises || !Array.isArray(challengeSession.exercises) || challengeSession.exercises.length !== exerciseCount) {
      console.error('Invalid exercise structure:', {
        hasExercises: !!challengeSession.exercises,
        isArray: Array.isArray(challengeSession.exercises),
        length: challengeSession.exercises?.length,
        expected: exerciseCount
      });
      
      return new Response(JSON.stringify({ 
        error: 'Invalid exercise structure from OpenAI',
        details: `Expected ${exerciseCount} exercises, got ${challengeSession.exercises?.length || 0}`,
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure required fields
    challengeSession.sessionId = challengeSession.sessionId || uniqueSessionId;
    challengeSession.source = 'openai';
    challengeSession.randomSeed = randomId;
    challengeSession.timestamp = timestamp;

    console.log('Successfully generated AI challenge session:', {
      sessionId: challengeSession.sessionId,
      exerciseCount: challengeSession.exercises.length,
      skillArea: challengeSession.skillArea,
      difficulty: challengeSession.difficulty
    });

    return new Response(JSON.stringify(challengeSession), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-challenge function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true,
      details: 'Unexpected error in challenge generation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
