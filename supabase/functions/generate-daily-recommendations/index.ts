
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

// Available recommendation types
const RECOMMENDATION_TYPES = ['book', 'article', 'ted_talk', 'podcast', 'online_course'];

// Content library organized by type and category
const CONTENT_LIBRARY = {
  book: {
    strategy: [
      {
        title: "Good Strategy Bad Strategy",
        author_speaker: "Richard Rumelt",
        description: "A practical guide to developing and implementing effective strategies in business and product management.",
        source_url: "https://www.amazon.com/Good-Strategy-Bad-Strategy-Difference/dp/0307886239"
      },
      {
        title: "Playing to Win",
        author_speaker: "A.G. Lafley & Roger Martin",
        description: "How strategy really works - a framework for making strategic choices that drive business success.",
        source_url: "https://www.amazon.com/Playing-Win-Strategy-Really-Works/dp/142218739X"
      }
    ],
    research: [
      {
        title: "The Mom Test",
        author_speaker: "Rob Fitzpatrick",
        description: "How to talk to customers and learn if your business is a good idea when everyone is lying to you.",
        source_url: "https://www.amazon.com/Mom-Test-customers-business-everyone/dp/1492180742"
      },
      {
        title: "Continuous Discovery Habits",
        author_speaker: "Teresa Torres",
        description: "Discover products that create customer value and business value through continuous product discovery.",
        source_url: "https://www.amazon.com/Continuous-Discovery-Habits-Discover-Products/dp/1736633309"
      }
    ],
    general: [
      {
        title: "Inspired",
        author_speaker: "Marty Cagan",
        description: "How to create tech products customers love by focusing on customer needs and market validation.",
        source_url: "https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507"
      },
      {
        title: "Escaping the Build Trap",
        author_speaker: "Melissa Perri",
        description: "How effective product management creates real value for companies and customers.",
        source_url: "https://www.amazon.com/Escaping-Build-Trap-Effective-Management/dp/149197379X"
      }
    ]
  },
  article: {
    low: [
      {
        title: "Product Management Fundamentals",
        author_speaker: "Mind the Product",
        description: "Essential concepts and frameworks every product manager should know to build better products.",
        source_url: "https://www.mindtheproduct.com/what-exactly-is-a-product-manager/"
      },
      {
        title: "Getting Started in Product Management",
        author_speaker: "Product Coalition",
        description: "A comprehensive guide for new product managers covering the basics of product strategy and execution.",
        source_url: "https://productcoalition.com/getting-started-in-product-management-101-guide"
      }
    ],
    medium: [
      {
        title: "Advanced PM Techniques",
        author_speaker: "Product Coalition",
        description: "Advanced strategies for product discovery, prioritization, and stakeholder management.",
        source_url: "https://productcoalition.com/advanced-product-management-techniques-d4a8c8c4c8c4"
      },
      {
        title: "Data-Driven Product Decisions",
        author_speaker: "First Round Review",
        description: "How to use metrics and analytics to make better product decisions and measure success.",
        source_url: "https://review.firstround.com/how-to-be-strategic-about-strategic-planning"
      }
    ],
    high: [
      {
        title: "Leadership in Product Management",
        author_speaker: "Harvard Business Review", 
        description: "How successful product leaders build teams, influence stakeholders, and drive organizational change.",
        source_url: "https://hbr.org/2019/12/what-it-takes-to-become-a-great-product-manager"
      },
      {
        title: "Strategic Product Roadmapping",
        author_speaker: "Product Plan",
        description: "Advanced techniques for creating and communicating strategic product roadmaps that align teams.",
        source_url: "https://www.productplan.com/learn/strategic-product-roadmap/"
      }
    ]
  },
  ted_talk: {
    strategy: [
      {
        title: "How Great Leaders Inspire Action",
        author_speaker: "Simon Sinek",
        description: "Understanding the power of 'why' in building compelling product vision and inspiring teams.",
        source_url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action"
      },
      {
        title: "The Puzzle of Motivation",
        author_speaker: "Dan Pink",
        description: "What really motivates people and how to build products that align with human motivation.",
        source_url: "https://www.ted.com/talks/dan_pink_the_puzzle_of_motivation"
      }
    ],
    research: [
      {
        title: "The Power of Vulnerability",
        author_speaker: "Brené Brown",
        description: "Building trust and empathy with users through authentic customer research and validation.",
        source_url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability"
      }
    ],
    general: [
      {
        title: "Your Body Language May Shape Who You Are",
        author_speaker: "Amy Cuddy",
        description: "Building confidence as a product leader and presenting ideas with conviction.",
        source_url: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are"
      }
    ]
  },
  podcast: {
    strategy: [
      {
        title: "This is Product Management",
        author_speaker: "Mike Fishbein",
        description: "Weekly conversations with product leaders about strategy, roadmapping, and product discovery.",
        source_url: "https://podcasts.apple.com/us/podcast/this-is-product-management/id975284403"
      }
    ],
    research: [
      {
        title: "User Defenders",
        author_speaker: "Jason Ogle",
        description: "Interviews with UX and product professionals about user research and customer-centered design.",
        source_url: "https://podcasts.apple.com/us/podcast/user-defenders-ux-design-user-experience-podcast/id1055121160"
      }
    ],
    general: [
      {
        title: "Masters of Scale",
        author_speaker: "Reid Hoffman",
        description: "How companies grow from zero to billion-user scale, featuring insights from successful product leaders.",
        source_url: "https://podcasts.apple.com/us/podcast/masters-of-scale/id1227971746"
      }
    ]
  },
  online_course: {
    strategy: [
      {
        title: "Product Strategy Fundamentals",
        author_speaker: "Product School",
        description: "Comprehensive course covering product strategy frameworks, competitive analysis, and go-to-market planning.",
        source_url: "https://productschool.com/product-management-courses/product-strategy/"
      }
    ],
    research: [
      {
        title: "User Research Methods",
        author_speaker: "Coursera - University of Michigan",
        description: "Learn practical user research techniques including interviews, surveys, and usability testing.",
        source_url: "https://www.coursera.org/learn/user-research"
      }
    ],
    general: [
      {
        title: "Google Product Management Certificate",
        author_speaker: "Google",
        description: "Industry-recognized certificate covering the full product management lifecycle from ideation to launch.",
        source_url: "https://www.coursera.org/professional-certificates/google-project-management"
      }
    ]
  }
};

// Generate 1 random static recommendation
const generateRandomStaticRecommendation = (skillArea: string, performanceScore: number, improvementAreas: string[]) => {
  // Randomly select 1 type for static recommendation
  const selectedType = RECOMMENDATION_TYPES[Math.floor(Math.random() * RECOMMENDATION_TYPES.length)];
  
  console.log('Selected static recommendation type:', selectedType);
  
  let selectedContent;
  
  if (selectedType === 'book' || selectedType === 'ted_talk' || selectedType === 'podcast' || selectedType === 'online_course') {
    // For these types, select based on skill area
    const skillContent = CONTENT_LIBRARY[selectedType][skillArea as keyof typeof CONTENT_LIBRARY[typeof selectedType]] || 
                        CONTENT_LIBRARY[selectedType]['general'] || 
                        [];
    
    if (skillContent.length > 0) {
      selectedContent = skillContent[Math.floor(Math.random() * skillContent.length)];
    }
  } else if (selectedType === 'article') {
    // For articles, select based on performance level
    const performanceLevel = performanceScore >= 80 ? 'high' : performanceScore >= 60 ? 'medium' : 'low';
    const performanceContent = CONTENT_LIBRARY[selectedType][performanceLevel] || [];
    
    if (performanceContent.length > 0) {
      selectedContent = performanceContent[Math.floor(Math.random() * performanceContent.length)];
    }
  }
  
  if (selectedContent) {
    return {
      type: selectedType,
      title: selectedContent.title,
      author_speaker: selectedContent.author_speaker,
      description: selectedContent.description,
      source_url: selectedContent.source_url
    };
  }
  
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, skillArea, difficulty, performanceScore, improvementAreas, strengths }: RequestBody = await req.json();

    console.log('Generating 1 randomized static recommendation for user:', userId, 'skill:', skillArea, 'score:', performanceScore);

    // Check if recommendation already exists for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecs } = await supabase
      .from('daily_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);

    if (existingRecs && existingRecs.length >= 1) {
      console.log('Found existing static recommendation:', existingRecs.length);
      return new Response(JSON.stringify({ recommendations: existingRecs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 1 random static recommendation
    const recommendation = generateRandomStaticRecommendation(skillArea, performanceScore, improvementAreas);
    console.log('Generated randomized static recommendation:', recommendation ? 1 : 0);

    if (!recommendation) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert recommendation into database
    const dbRecord = {
      user_id: userId,
      date: today,
      recommendation_type: recommendation.type,
      title: recommendation.title,
      author_speaker: recommendation.author_speaker,
      description: recommendation.description,
      source_url: recommendation.source_url,
      skill_area: skillArea,
      difficulty_level: difficulty,
      performance_context: {
        score: performanceScore,
        improvement_areas: improvementAreas,
        strengths: strengths
      }
    };

    const { data: insertedRec, error } = await supabase
      .from('daily_recommendations')
      .insert([dbRecord])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully inserted randomized static recommendation:', insertedRec?.length);

    return new Response(JSON.stringify({ recommendations: insertedRec }), {
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
