
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  skillArea: string;
  difficulty: string;
  performanceScore: number;
  improvementAreas: string[];
  strengths: string[];
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiKey = Deno.env.get('YUNO_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, skillArea, difficulty, performanceScore, improvementAreas, strengths }: RequestBody = await req.json();

    console.log('Generating recommendations for user:', userId, 'skill:', skillArea);

    // Check if recommendations already exist for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecs } = await supabase
      .from('daily_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);

    if (existingRecs && existingRecs.length >= 3) {
      return new Response(JSON.stringify({ recommendations: existingRecs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate AI recommendations using OpenAI
    const prompt = `You are a Product Management learning advisor. Generate 3 REAL, specific learning resource recommendations for a PM who just completed a ${skillArea} challenge at ${difficulty} level with ${performanceScore}% performance.

Areas needing improvement: ${improvementAreas.join(', ')}
Areas of strength: ${strengths.join(', ')}

For EACH recommendation, provide:
1. ONE real book with actual author and brief description
2. ONE real TED talk with actual speaker name and brief description  
3. ONE real article from a reputable PM publication with actual author

Requirements:
- All resources must be REAL and exist (not fictional)
- Include actual author/speaker names
- Provide specific, actionable descriptions
- Focus on ${skillArea} and the improvement areas mentioned
- Suitable for ${difficulty} level

Format your response as a JSON array with exactly 3 objects, each having: type, title, author_speaker, description, source_url (use real URLs when possible, or null if unsure)`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a PM learning advisor who only recommends real, existing resources. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response:', openaiData);

    if (!openaiData.choices || !openaiData.choices[0]) {
      throw new Error('Invalid OpenAI response');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(openaiData.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', openaiData.choices[0].message.content);
      throw new Error('Failed to parse AI recommendations');
    }

    // Insert recommendations into database
    const dbRecords = recommendations.map((rec: any) => ({
      user_id: userId,
      date: today,
      recommendation_type: rec.type,
      title: rec.title,
      author_speaker: rec.author_speaker,
      description: rec.description,
      source_url: rec.source_url,
      skill_area: skillArea,
      difficulty_level: difficulty,
      performance_context: {
        score: performanceScore,
        improvement_areas: improvementAreas,
        strengths: strengths
      }
    }));

    const { data: insertedRecs, error } = await supabase
      .from('daily_recommendations')
      .insert(dbRecords)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully inserted recommendations:', insertedRecs?.length);

    return new Response(JSON.stringify({ recommendations: insertedRecs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-daily-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
