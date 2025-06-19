
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  skillArea: string;
  difficulty: string;
  performanceScore: number;
  exerciseScores: Array<{
    questionTitle: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    score: number;
  }>;
  totalExercises: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skillArea, difficulty, performanceScore, exerciseScores, totalExercises }: RequestBody = await req.json();
    
    console.log('Generating personalized recommendation for:', { skillArea, difficulty, performanceScore, totalExercises });

    const openAIApiKey = Deno.env.get('YUNO_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build performance analysis
    const correctAnswers = exerciseScores.filter(ex => ex.isCorrect).length;
    const incorrectAnswers = exerciseScores.filter(ex => !ex.isCorrect).length;
    
    const performanceDetails = exerciseScores.map(ex => 
      `Question: "${ex.questionTitle}" - Your answer: "${ex.userAnswer}" - Correct answer: "${ex.correctAnswer}" - ${ex.isCorrect ? 'Correct' : 'Incorrect'}`
    ).join('\n');

    const prompt = `You are an expert Product Management coach providing personalized learning recommendations. 

Based on this performance data:
- Skill Area: ${skillArea}
- Difficulty: ${difficulty}  
- Overall Score: ${performanceScore}%
- Exercises Completed: ${totalExercises}
- Correct Answers: ${correctAnswers}
- Incorrect Answers: ${incorrectAnswers}

Detailed Performance:
${performanceDetails}

Please recommend ONE specific TED Talk that would help this person improve their Product Management skills based on their exact performance. Focus on areas where they struggled or could grow.

Respond in this exact JSON format:
{
  "title": "TED Talk Title",
  "author_speaker": "Speaker Name", 
  "description": "Brief description explaining why this TED talk is perfect for their specific performance and learning needs (2-3 sentences)",
  "source_url": "https://ted.com/talks/..."
}

Make sure the description is personalized to their specific performance and explains how this TED talk addresses their particular strengths and improvement areas.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Product Management expert who provides personalized learning recommendations based on performance data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);

    // Parse the JSON response
    let recommendation;
    try {
      recommendation = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback recommendation
      recommendation = {
        title: "The Power of Yet",
        author_speaker: "Carol Dweck",
        description: "Based on your performance, developing a growth mindset will help you approach Product Management challenges with resilience and continuous learning.",
        source_url: "https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve"
      };
    }

    // Add the recommendation type
    const personalizedRecommendation = {
      ...recommendation,
      recommendation_type: 'ted_talk'
    };

    console.log('Generated personalized recommendation:', personalizedRecommendation);

    return new Response(JSON.stringify({ recommendation: personalizedRecommendation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personalized-recommendation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
