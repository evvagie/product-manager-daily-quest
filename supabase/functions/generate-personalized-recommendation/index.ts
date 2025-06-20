
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
  excludeType?: string;
  excludeTypes?: string[];
  isSecondRecommendation?: boolean;
  isThirdRecommendation?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      skillArea, 
      difficulty, 
      performanceScore, 
      exerciseScores, 
      totalExercises,
      excludeType,
      excludeTypes,
      isSecondRecommendation = false,
      isThirdRecommendation = false
    }: RequestBody = await req.json();
    
    console.log('Generating personalized recommendation for:', { 
      skillArea, 
      difficulty, 
      performanceScore, 
      totalExercises,
      excludeType,
      excludeTypes,
      isSecondRecommendation,
      isThirdRecommendation
    });

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

    // Define content types to choose from
    const contentTypes = ['ted_talk', 'podcast', 'book', 'article', 'online_course'];
    
    // Build list of types to exclude (support both single excludeType and multiple excludeTypes)
    let typesToExclude: string[] = [];
    if (excludeType) typesToExclude.push(excludeType);
    if (excludeTypes && excludeTypes.length > 0) typesToExclude = [...typesToExclude, ...excludeTypes];
    
    const availableTypes = contentTypes.filter(type => !typesToExclude.includes(type));
    
    // Select a random type from available types
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    const typeDescriptions = {
      'ted_talk': 'TED Talk',
      'podcast': 'Podcast episode',
      'book': 'Book',
      'article': 'Article',
      'online_course': 'Online course'
    };

    // Updated with verified working URLs and more variety
    const realUrlExamples = {
      'ted_talk': [
        'https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action',
        'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
        'https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve',
        'https://www.ted.com/talks/susan_cain_the_power_of_introverts',
        'https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are',
        'https://www.ted.com/talks/dan_pink_the_puzzle_of_motivation',
        'https://www.ted.com/talks/elizabeth_gilbert_your_elusive_creative_genius'
      ],
      'podcast': [
        'https://open.spotify.com/show/1BZN7H3ikovSejhwQTzNm4',
        'https://open.spotify.com/show/5qSUyCrk9KR69lEiXbjwXM',
        'https://open.spotify.com/show/6E709HRH7XaiZrMfgtNCun',
        'https://podcasts.apple.com/us/podcast/masters-of-scale/id1227971746',
        'https://podcasts.apple.com/us/podcast/the-tim-ferriss-show/id863897795',
        'https://podcasts.apple.com/us/podcast/how-i-built-this-with-guy-raz/id1150510297'
      ],
      'book': [
        'https://www.goodreads.com/book/show/35747076-inspired',
        'https://www.goodreads.com/book/show/10127019-the-lean-startup',
        'https://www.goodreads.com/book/show/61493.Crossing_the_Chasm',
        'https://www.goodreads.com/book/show/18077875-zero-to-one',
        'https://www.goodreads.com/book/show/2467.The_Innovator_s_Dilemma',
        'https://www.goodreads.com/book/show/840.The_Design_of_Everyday_Things',
        'https://www.goodreads.com/book/show/22668729-hooked'
      ],
      'article': [
        'https://medium.com/hackernoon/what-is-a-product-manager-ce0efdcf114c',
        'https://medium.com/@noah_weiss/50-articles-and-books-that-will-make-you-a-great-product-manager-aad5babee2f7',
        'https://blog.intercom.com/first-rule-prioritization-no-snacking/',
        'https://blog.intercom.com/the-dribbblisation-of-design/',
        'https://firstround.com/review/how-to-build-your-first-product-roadmap/',
        'https://www.mindtheproduct.com/what-exactly-is-a-product-manager/',
        'https://productcoalition.com/product-management-mental-models-for-everyone-31e7828cb50b'
      ],
      'online_course': [
        'https://www.coursera.org/specializations/product-management',
        'https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/',
        'https://www.edx.org/course/introduction-to-product-management',
        'https://productschool.com/product-management-bootcamp/',
        'https://www.pluralsight.com/courses/product-management-fundamentals',
        'https://www.linkedin.com/learning/product-management-first-steps'
      ]
    };

    const recommendationContext = isThirdRecommendation 
      ? 'This is a third recommendation, so provide a unique perspective that complements the previous two recommendations.' 
      : isSecondRecommendation 
        ? 'This is a second recommendation, so provide a different perspective or complementary learning approach.' 
        : '';

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

Please recommend ONE specific ${typeDescriptions[selectedType]} that would help this person improve their Product Management skills based on their exact performance. Focus on areas where they struggled or could grow.

${recommendationContext}

IMPORTANT: For the source_url, you must use one of these REAL, working URLs based on the content type:
${realUrlExamples[selectedType].join(', ')}

Choose the most relevant URL from the list above that best matches your recommendation.

Respond in this exact JSON format:
{
  "title": "Actual ${typeDescriptions[selectedType]} Title",
  "author_speaker": "${selectedType === 'ted_talk' ? 'Speaker Name' : selectedType === 'podcast' ? 'Host/Guest Name' : selectedType === 'book' ? 'Author Name' : selectedType === 'online_course' ? 'Instructor/Platform' : 'Author Name'}", 
  "description": "Brief description explaining why this ${selectedType.replace('_', ' ')} is perfect for their specific performance and learning needs (2-3 sentences)",
  "source_url": "MUST be one of the real URLs provided above"
}

Make sure the description is personalized to their specific performance and explains how this ${selectedType.replace('_', ' ')} addresses their particular strengths and improvement areas.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Product Management expert who provides personalized learning recommendations based on performance data. Always use real, working URLs from the provided list.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
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
      
      // Validate that the URL is from our approved list
      const allValidUrls = Object.values(realUrlExamples).flat();
      if (!allValidUrls.includes(recommendation.source_url)) {
        // Force a valid URL if AI didn't follow instructions - use random selection for variety
        const validUrls = realUrlExamples[selectedType];
        recommendation.source_url = validUrls[Math.floor(Math.random() * validUrls.length)];
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Enhanced fallback recommendations with more variety
      const fallbackRecommendations = {
        'ted_talk': [
          {
            title: "How Great Leaders Inspire Action",
            author_speaker: "Simon Sinek",
            description: "Based on your performance, understanding leadership principles will help you approach Product Management challenges with better strategic thinking and team alignment.",
            source_url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action"
          },
          {
            title: "The Power of Vulnerability",
            author_speaker: "Brené Brown",
            description: "This talk will help you embrace learning from mistakes and build stronger relationships with your team and stakeholders.",
            source_url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability"
          },
          {
            title: "The Power of Believing That You Can Improve",
            author_speaker: "Carol Dweck",
            description: "Develop a growth mindset that will enhance your product management skills through continuous learning and adaptation.",
            source_url: "https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve"
          }
        ],
        'podcast': [
          {
            title: "Masters of Scale",
            author_speaker: "Reid Hoffman",
            description: "Based on your performance, this podcast will help you understand how successful product leaders scale their teams and products.",
            source_url: "https://open.spotify.com/show/1BZN7H3ikovSejhwQTzNm4"
          },
          {
            title: "The Tim Ferriss Show",
            author_speaker: "Tim Ferriss",
            description: "Learn from world-class performers and apply their strategies to your product management approach.",
            source_url: "https://open.spotify.com/show/5qSUyCrk9KR69lEiXbjwXM"
          }
        ],
        'book': [
          {
            title: "Inspired",
            author_speaker: "Marty Cagan",
            description: "Based on your performance, this book will help you understand how to create products customers love.",
            source_url: "https://www.goodreads.com/book/show/35747076-inspired"
          },
          {
            title: "The Lean Startup",
            author_speaker: "Eric Ries",
            description: "Learn how to build products efficiently through validated learning and iterative development.",
            source_url: "https://www.goodreads.com/book/show/10127019-the-lean-startup"
          },
          {
            title: "Zero to One",
            author_speaker: "Peter Thiel",
            description: "Understand how to build unique products that create new markets and drive innovation.",
            source_url: "https://www.goodreads.com/book/show/18077875-zero-to-one"
          }
        ],
        'article': [
          {
            title: "What is a Product Manager?",
            author_speaker: "Hackernoon",
            description: "Based on your performance, this article will help you strengthen your PM fundamentals and role clarity.",
            source_url: "https://medium.com/hackernoon/what-is-a-product-manager-ce0efdcf114c"
          },
          {
            title: "50 Articles That Will Make You a Great Product Manager",
            author_speaker: "Noah Weiss",
            description: "A comprehensive collection of resources to enhance your product management skills across multiple domains.",
            source_url: "https://medium.com/@noah_weiss/50-articles-and-books-that-will-make-you-a-great-product-manager-aad5babee2f7"
          }
        ],
        'online_course': [
          {
            title: "Product Management Specialization",
            author_speaker: "Coursera",
            description: "Based on your performance, this comprehensive course will help you develop stronger strategic thinking skills.",
            source_url: "https://www.coursera.org/specializations/product-management"
          },
          {
            title: "Become a Product Manager",
            author_speaker: "Udemy",
            description: "Learn practical PM skills through hands-on exercises and real-world case studies.",
            source_url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/"
          }
        ]
      };
      
      // Use random selection for variety
      const fallbackOptions = fallbackRecommendations[selectedType] || fallbackRecommendations['ted_talk'];
      recommendation = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
    }

    // Add the recommendation type
    const personalizedRecommendation = {
      ...recommendation,
      recommendation_type: selectedType
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
