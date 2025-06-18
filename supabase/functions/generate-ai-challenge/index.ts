
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
    const { skillArea, difficulty } = await req.json();
    const openAIApiKey = Deno.env.get('YUNO_KEY');

    if (!openAIApiKey) {
      throw new Error('YUNO_KEY is not set');
    }

    const prompt = `You are a challenge generator engine for a Product Manager simulator. For each request, invent a completely original challenge: scenario, interaction type, format, structure. The challenge type can be known (drag & drop, form, multiple-choice, slider) or invented on the fly (ex: recompose a timeline, make a budget arbitration, simulate a Slack exchange, stakeholder mapping, feature prioritization matrix...). 

Return everything in structured JSON format with: title, type, instructions, content, options, correct answer, explanation, tags, level.

Parameters:
- Skill Area: ${skillArea}
- Difficulty: ${difficulty}

Create a realistic Product Manager challenge scenario. Be creative with the interaction type - you can invent new formats that make sense for PM work.

Required JSON structure:
{
  "id": "unique-id",
  "title": "Challenge Title",
  "description": "Brief description",
  "type": "interaction-type", 
  "timeLimit": 120,
  "content": {
    "context": "Detailed scenario context",
    "scenario": "Specific situation description",
    "instructions": "What the user needs to do",
    "data": {}, // Any supporting data/metrics
    "options": [
      {
        "id": "option-1",
        "text": "Option text",
        "description": "Option description",
        "isCorrect": true/false,
        "quality": "excellent|good|average|poor",
        "explanation": "Why this choice leads to this outcome",
        "consequences": [
          {
            "type": "positive|negative|neutral",
            "title": "Consequence title",
            "description": "What happens",
            "impact": "Long-term impact"
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
  },
  "format": {
    "id": "custom-format",
    "name": "Format Name",
    "description": "Format description",
    "type": "custom-interaction-type",
    "timeLimit": 120,
    "steps": 1,
    "interactionType": "multiple-choice"
  }
}

Make it challenging, realistic, and engaging. Focus on real PM scenarios like feature prioritization, stakeholder management, technical trade-offs, user research decisions, etc.`;

    console.log('Calling OpenAI with prompt for:', { skillArea, difficulty });

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
            content: 'You are an expert Product Manager challenge generator. Always respond with valid JSON only, no additional text.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Raw OpenAI response:', generatedContent);

    // Parse the JSON response from OpenAI
    let challengeData;
    try {
      challengeData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Ensure required fields and add timestamp
    challengeData.id = challengeData.id || `ai-${skillArea}-${difficulty}-${Date.now()}`;
    challengeData.generatedAt = new Date().toISOString();
    challengeData.source = 'openai';

    console.log('Generated challenge:', challengeData.title);

    return new Response(JSON.stringify(challengeData), {
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
