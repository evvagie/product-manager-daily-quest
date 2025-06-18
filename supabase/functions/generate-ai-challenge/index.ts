
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Create ${exerciseCount} unique Product Manager challenges for a simulation game session.

PARAMETERS:
- Skill Area: ${skillArea}
- Difficulty Level: ${difficulty}
- Number of Exercises: ${exerciseCount}

REQUIREMENTS:
- Create ${exerciseCount} completely different, realistic PM scenarios
- Vary the interaction types across exercises (multiple-choice, slider, dialogue, ranking)
- Make each exercise challenging and engaging for a ${difficulty} level PM
- Include realistic data, metrics, and context for each
- Provide meaningful consequences for different choices
- Ensure variety in topics within the ${skillArea} skill area

EXERCISE TYPES TO VARY:
- multiple-choice: Decision-making scenarios with 3-4 options
- slider: Trade-off decisions (resource allocation, priority balancing)
- dialogue: Stakeholder conversations, team interactions
- ranking: Feature prioritization, retrospective analysis

Return a JSON object with this exact structure:
{
  "sessionId": "unique-session-id",
  "skillArea": "${skillArea}",
  "difficulty": "${difficulty}",
  "totalExercises": ${exerciseCount},
  "exercises": [
    {
      "id": "exercise-1",
      "title": "Exercise Title",
      "description": "Brief description of what the user will do",
      "type": "interaction-type",
      "timeLimit": 180,
      "content": {
        "context": "Detailed scenario background (2-3 sentences)",
        "scenario": "Specific situation description",
        "instructions": "Clear instructions on what to do",
        "data": "Any supporting data, metrics, or background info",
        "options": [
          {
            "id": "option-1",
            "text": "Option description",
            "description": "Additional context for this choice",
            "isCorrect": true,
            "quality": "excellent",
            "explanation": "Why this is the best/worst choice and what happens",
            "consequences": [
              {
                "type": "positive",
                "title": "Immediate outcome",
                "description": "What happens right away",
                "impact": "Long-term implications"
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

Make each exercise realistic, specific to ${skillArea}, appropriate for ${difficulty} level, and DIFFERENT from the others. Focus on real PM scenarios like stakeholder management, feature prioritization, technical trade-offs, user research, go-to-market decisions, etc.`;

    console.log('Generating AI challenge session for:', { skillArea, difficulty, exerciseCount });

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
            content: 'You are an expert Product Manager challenge generator. Create realistic, engaging challenges that test real PM skills. Always respond with valid JSON only, no additional text or markdown. Ensure each exercise in a session is unique and varied.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a few minutes.');
      }
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Raw OpenAI response length:', generatedContent.length);

    // Parse the JSON response from OpenAI
    let challengeSession;
    try {
      // Clean the response in case there's any markdown formatting
      const cleanContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      challengeSession = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Ensure required fields and add metadata
    challengeSession.sessionId = challengeSession.sessionId || `ai-session-${skillArea}-${difficulty}-${Date.now()}`;
    challengeSession.generatedAt = new Date().toISOString();
    challengeSession.source = 'openai';

    console.log('Successfully generated challenge session with', challengeSession.exercises?.length || 0, 'exercises');

    return new Response(JSON.stringify(challengeSession), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-challenge function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
