
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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

// Simple static recommendations based on skill area and performance
const generateSimpleRecommendations = (skillArea: string, performanceScore: number, improvementAreas: string[]) => {
  const recommendations = [];
  
  // Book recommendation based on skill area
  const books = {
    strategy: {
      title: "Good Strategy Bad Strategy",
      author_speaker: "Richard Rumelt",
      description: "A practical guide to developing and implementing effective strategies in business and product management.",
      source_url: "https://www.amazon.com/Good-Strategy-Bad-Strategy-Difference/dp/0307886239"
    },
    research: {
      title: "The Mom Test",
      author_speaker: "Rob Fitzpatrick",
      description: "How to talk to customers and learn if your business is a good idea when everyone is lying to you.",
      source_url: "https://www.amazon.com/Mom-Test-customers-business-everyone/dp/1492180742"
    },
    general: {
      title: "Inspired",
      author_speaker: "Marty Cagan",
      description: "How to create tech products customers love by focusing on customer needs and market validation.",
      source_url: "https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507"
    }
  };

  // Article recommendation based on performance
  const articles = {
    low: {
      title: "Product Management Fundamentals",
      author_speaker: "Mind the Product",
      description: "Essential concepts and frameworks every product manager should know to build better products.",
      source_url: "https://www.mindtheproduct.com/what-exactly-is-a-product-manager/"
    },
    medium: {
      title: "Advanced PM Techniques",
      author_speaker: "Product Coalition",
      description: "Advanced strategies for product discovery, prioritization, and stakeholder management.",
      source_url: "https://productcoalition.com/advanced-product-management-techniques-d4a8c8c4c8c4"
    },
    high: {
      title: "Leadership in Product Management",
      author_speaker: "Harvard Business Review", 
      description: "How successful product leaders build teams, influence stakeholders, and drive organizational change.",
      source_url: "https://hbr.org/2019/12/what-it-takes-to-become-a-great-product-manager"
    }
  };

  // TED talk recommendation based on improvement areas
  const tedTalk = improvementAreas.includes('stakeholder') ? {
    title: "How Great Leaders Inspire Action",
    author_speaker: "Simon Sinek",
    description: "Understanding the 'why' behind decisions and inspiring stakeholders through clear communication and vision.",
    source_url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action"
  } : {
    title: "The Power of Yet",
    author_speaker: "Carol Dweck",
    description: "Developing a growth mindset to overcome challenges and continuously improve your skills.",
    source_url: "https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve"
  };

  // Add book recommendation
  const bookRec = books[skillArea as keyof typeof books] || books.general;
  recommendations.push({
    type: "book",
    title: bookRec.title,
    author_speaker: bookRec.author_speaker,
    description: bookRec.description,
    source_url: bookRec.source_url
  });

  // Add article recommendation based on performance
  const performanceLevel = performanceScore >= 80 ? 'high' : performanceScore >= 60 ? 'medium' : 'low';
  const articleRec = articles[performanceLevel];
  recommendations.push({
    type: "article",
    title: articleRec.title,
    author_speaker: articleRec.author_speaker,
    description: articleRec.description,
    source_url: articleRec.source_url
  });

  // Add TED talk recommendation
  recommendations.push({
    type: "ted_talk",
    title: tedTalk.title,
    author_speaker: tedTalk.author_speaker,
    description: tedTalk.description,
    source_url: tedTalk.source_url
  });

  return recommendations;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, skillArea, difficulty, performanceScore, improvementAreas, strengths }: RequestBody = await req.json();

    console.log('Generating simple recommendations for user:', userId, 'skill:', skillArea, 'score:', performanceScore);

    // Check if recommendations already exist for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecs } = await supabase
      .from('daily_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);

    if (existingRecs && existingRecs.length >= 3) {
      console.log('Found existing recommendations:', existingRecs.length);
      return new Response(JSON.stringify({ recommendations: existingRecs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate simple recommendations
    const recommendations = generateSimpleRecommendations(skillArea, performanceScore, improvementAreas);
    console.log('Generated recommendations:', recommendations.length);

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
