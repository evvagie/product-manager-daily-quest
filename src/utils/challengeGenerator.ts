
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedChallenge {
  id: string;
  title: string;
  description: string;
  type: string;
  timeLimit: number;
  content: any;
  format: any;
  source?: string;
}

export const generateDynamicChallenge = async (skillArea: string, difficulty: string): Promise<GeneratedChallenge> => {
  console.log('Generating dynamic challenge:', { skillArea, difficulty });
  
  try {
    // Try to call the OpenAI edge function first
    const { data, error } = await supabase.functions.invoke('generate-ai-challenge', {
      body: {
        skillArea,
        difficulty
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (data && !data.error) {
      console.log('AI challenge generated successfully');
      return {
        ...data,
        source: 'openai'
      };
    } else {
      console.warn('AI generation failed, using fallback:', data?.error);
      throw new Error(data?.error || 'AI generation failed');
    }
  } catch (error) {
    console.error('Error calling AI generation function:', error);
    console.log('Falling back to static challenge generation');
    
    // Fallback to static challenge generation
    return generateStaticChallenge(skillArea, difficulty);
  }
};

const generateStaticChallenge = (skillArea: string, difficulty: string): GeneratedChallenge => {
  const challengeTemplates = {
    strategy: {
      beginner: {
        title: "Product Roadmap Prioritization",
        description: "Help prioritize features for the next quarter",
        type: "multiple-choice",
        timeLimit: 180,
        content: {
          context: "You're managing a mobile app with limited development resources.",
          scenario: "Your team can only deliver 2 major features this quarter. You need to choose wisely.",
          instructions: "Select the 2 features you would prioritize and explain your reasoning.",
          options: [
            {
              id: "option-1",
              text: "User Authentication & Security",
              description: "Implement secure login and user profiles",
              isCorrect: true,
              quality: "excellent",
              explanation: "Security is fundamental and enables other features",
              consequences: [
                {
                  type: "positive",
                  title: "Strong Foundation",
                  description: "Users feel secure using your app",
                  impact: "Enables future personalization features"
                }
              ],
              kpiImpact: {
                revenue: { value: 150, change: 2 },
                teamMood: { value: 7, change: 0 },
                customerSat: { value: 4.1, change: 0.3 },
                userGrowth: { value: 12, change: 1 }
              }
            },
            {
              id: "option-2", 
              text: "Push Notifications",
              description: "Send users alerts and updates",
              isCorrect: false,
              quality: "good",
              explanation: "Useful but not critical without other features first",
              consequences: [
                {
                  type: "neutral",
                  title: "Moderate Engagement",
                  description: "Some users appreciate notifications",
                  impact: "May annoy users without value-add features"
                }
              ],
              kpiImpact: {
                revenue: { value: 145, change: 0 },
                teamMood: { value: 6, change: -1 },
                customerSat: { value: 3.8, change: -0.1 },
                userGrowth: { value: 10, change: -1 }
              }
            }
          ]
        },
        format: {
          id: "priority-selection",
          name: "Priority Selection",
          description: "Choose and rank features by importance",
          type: "multiple-choice",
          timeLimit: 180,
          steps: 1,
          interactionType: "multiple-choice"
        }
      }
    },
    research: {
      beginner: {
        title: "User Interview Analysis",
        description: "Analyze user feedback to identify key insights",
        type: "multiple-choice",
        timeLimit: 120,
        content: {
          context: "You've conducted 10 user interviews about your e-commerce app.",
          scenario: "Users mentioned various pain points. You need to identify the most critical issue to address.",
          instructions: "Choose the most important insight from the user interviews.",
          options: [
            {
              id: "insight-1",
              text: "Checkout process is too complicated",
              description: "8/10 users mentioned checkout friction",
              isCorrect: true,
              quality: "excellent",
              explanation: "High frequency and directly impacts conversion",
              consequences: [
                {
                  type: "positive", 
                  title: "Improved Conversion",
                  description: "Simplifying checkout increases sales",
                  impact: "Direct revenue impact from reduced cart abandonment"
                }
              ],
              kpiImpact: {
                revenue: { value: 200, change: 8 },
                teamMood: { value: 8, change: 1 },
                customerSat: { value: 4.3, change: 0.4 },
                userGrowth: { value: 15, change: 2 }
              }
            }
          ]
        },
        format: {
          id: "insight-analysis",
          name: "Insight Analysis", 
          description: "Identify key insights from user research",
          type: "multiple-choice",
          timeLimit: 120,
          steps: 1,
          interactionType: "multiple-choice"
        }
      }
    }
  };

  const template = challengeTemplates[skillArea as keyof typeof challengeTemplates]?.[difficulty as keyof any];
  
  if (!template) {
    // Default fallback challenge
    return {
      id: `fallback-${skillArea}-${difficulty}`,
      title: "Product Challenge",
      description: "A general product management challenge",
      type: "multiple-choice",
      timeLimit: 120,
      content: {
        context: "You're working on a product decision.",
        scenario: "Make the best choice for your product.",
        instructions: "Select the best option.",
        options: [
          {
            id: "default-1",
            text: "Option A",
            description: "First option",
            isCorrect: true,
            quality: "good",
            explanation: "This is a reasonable choice",
            consequences: [
              {
                type: "positive",
                title: "Positive Outcome",
                description: "Good things happen",
                impact: "Moderate positive impact"
              }
            ],
            kpiImpact: {
              revenue: { value: 100, change: 1 },
              teamMood: { value: 7, change: 0 },
              customerSat: { value: 4.0, change: 0.1 },
              userGrowth: { value: 10, change: 1 }
            }
          }
        ]
      },
      format: {
        id: "basic-choice",
        name: "Basic Choice",
        description: "Make a product decision",
        type: "multiple-choice", 
        timeLimit: 120,
        steps: 1,
        interactionType: "multiple-choice"
      },
      source: 'static'
    };
  }

  return {
    id: `static-${skillArea}-${difficulty}-${Date.now()}`,
    ...template,
    source: 'static'
  };
};
