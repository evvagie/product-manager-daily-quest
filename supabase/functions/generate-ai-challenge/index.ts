
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
    const { skillArea, difficulty, exerciseCount = 4 } = await req.json();
    const openAIApiKey = Deno.env.get('YUNO_KEY');

    console.log('Generate AI Challenge called with:', { skillArea, difficulty, exerciseCount });
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

    // Add strong randomization to ensure completely unique content each time
    const sessionTimestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 100000);
    const uniqueSessionId = `${skillArea}-${difficulty}-${sessionTimestamp}-${randomSeed}`;

    console.log('Generating unique session:', uniqueSessionId);

    const prompt = `You are an expert Product Manager challenge generator. Create exactly ${exerciseCount} completely unique and fresh Product Manager challenges for a simulation game session.

CRITICAL REQUIREMENTS:
- Generate ENTIRELY NEW and DIFFERENT scenarios each time - never repeat content
- Create exactly ${exerciseCount} exercises, each completely different from the others
- Each exercise must be realistic and based on real PM work scenarios
- Vary the interaction types across exercises (multiple-choice, slider, dialogue, ranking)
- Make challenges appropriate for ${difficulty} level Product Managers
- Focus on ${skillArea} skill area but include variety within that domain

SESSION UNIQUENESS:
- Session ID: ${uniqueSessionId}
- Random Seed: ${randomSeed}
- Timestamp: ${sessionTimestamp}

EXERCISE PARAMETERS:
- Skill Area: ${skillArea}
- Difficulty Level: ${difficulty}
- Number of Exercises: ${exerciseCount}

INTERACTION TYPES TO USE (vary across exercises):
1. "multiple-choice": Decision scenarios with 3-4 realistic options
2. "slider": Resource allocation or priority balancing with trade-offs
3. "dialogue": Stakeholder conversations with response choices
4. "ranking": Feature prioritization or retrospective analysis

RESPONSE FORMAT - Return ONLY valid JSON with this exact structure:
{
  "sessionId": "${uniqueSessionId}",
  "skillArea": "${skillArea}",
  "difficulty": "${difficulty}",
  "totalExercises": ${exerciseCount},
  "generatedAt": "${new Date().toISOString()}",
  "exercises": [
    {
      "id": "exercise-1",
      "title": "Specific Exercise Title",
      "description": "Brief description of the exercise task",
      "type": "multiple-choice",
      "timeLimit": 180,
      "content": {
        "context": "Detailed scenario background (2-3 sentences about the situation)",
        "scenario": "Specific problem or decision that needs to be made",
        "instructions": "Clear instructions on what the user should do",
        "data": "Supporting data, metrics, or background information",
        "options": [
          {
            "id": "option-1",
            "text": "Clear option description",
            "description": "Additional context explaining this choice",
            "isCorrect": true,
            "quality": "excellent",
            "explanation": "Why this is the best choice and what happens next",
            "consequences": [
              {
                "type": "positive",
                "title": "Immediate Impact",
                "description": "What happens right away",
                "impact": "Long-term consequences"
              }
            ],
            "kpiImpact": {
              "revenue": { "value": 250, "change": 5 },
              "teamMood": { "value": 8, "change": 1 },
              "customerSat": { "value": 4.2, "change": 0.2 },
              "userGrowth": { "value": 18, "change": 3 }
            }
          }
        ]
      }
    }
  ]
}

GENERATE REALISTIC SCENARIOS for ${skillArea} at ${difficulty} level:
- For "strategy": roadmapping, competitive analysis, market research, vision setting
- For "research": user interviews, survey design, data analysis, insights gathering  
- For "analytics": metrics definition, A/B testing, data interpretation, KPI tracking
- For "design": UX principles, user flows, prototyping, design systems

Each exercise must be completely unique and different. NO repetition across exercises or sessions.`;

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
            content: `You are an expert Product Manager challenge generator. Always respond with valid JSON only, no additional text. Generate fresh, original content for every request - never repeat scenarios. Current unique session: ${uniqueSessionId}` 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.9,
        max_tokens: 4000,
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

    // Parse the JSON response from OpenAI
    let challengeSession;
    try {
      // Clean the response in case there's any markdown formatting
      const cleanContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      challengeSession = JSON.parse(cleanContent);
      
      console.log('Successfully parsed JSON with', challengeSession.exercises?.length || 0, 'exercises');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content that failed to parse:', generatedContent);
      
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON response from OpenAI',
        details: parseError.message,
        rawContent: generatedContent.substring(0, 500),
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate the response structure
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

    // Ensure required fields and add metadata
    challengeSession.sessionId = challengeSession.sessionId || uniqueSessionId;
    challengeSession.source = 'openai';
    challengeSession.randomSeed = randomSeed;
    challengeSession.timestamp = sessionTimestamp;

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
