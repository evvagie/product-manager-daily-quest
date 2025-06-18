
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
  skillArea?: string;
  difficulty?: string;
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
      console.log('AI challenge generated successfully:', data.title);
      return {
        ...data,
        source: 'openai',
        skillArea,
        difficulty
      };
    } else {
      console.warn('AI generation failed, using fallback:', data?.error);
      throw new Error(data?.error || 'AI generation failed');
    }
  } catch (error) {
    console.error('Error calling AI generation function:', error);
    console.log('Falling back to enhanced static challenge generation');
    
    // Fallback to enhanced static challenge generation
    return generateEnhancedStaticChallenge(skillArea, difficulty);
  }
};

const generateEnhancedStaticChallenge = (skillArea: string, difficulty: string): GeneratedChallenge => {
  const challengeTemplates = {
    strategy: {
      beginner: [
        {
          title: "Product Roadmap Prioritization",
          description: "Balance stakeholder demands with technical constraints",
          type: "multiple-choice",
          timeLimit: 180,
          content: {
            context: "You're the PM for a growing SaaS platform. Three departments have submitted feature requests for Q2, but you can only deliver one major feature.",
            scenario: "Sales wants CRM integration, Engineering wants to refactor the backend, and Marketing wants advanced analytics. Each choice has different implications.",
            instructions: "Choose which feature to prioritize and justify your decision.",
            data: "Current team: 4 developers, 2 designers. Customer satisfaction: 3.8/5. Monthly churn: 8%.",
            options: [
              {
                id: "crm-integration",
                text: "Prioritize CRM Integration",
                description: "Connect with Salesforce and HubSpot to streamline customer data",
                isCorrect: true,
                quality: "excellent",
                explanation: "CRM integration directly addresses customer pain points and can reduce churn while enabling sales growth.",
                consequences: [
                  {
                    type: "positive",
                    title: "Revenue Growth",
                    description: "Sales team can close deals 25% faster with better customer data",
                    impact: "15% increase in quarterly revenue, reduced sales cycle time"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 285, change: 15 },
                  teamMood: { value: 7, change: -1 },
                  customerSat: { value: 4.1, change: 0.3 },
                  userGrowth: { value: 22, change: 7 }
                }
              },
              {
                id: "backend-refactor",
                text: "Prioritize Backend Refactoring",
                description: "Improve system performance and technical debt",
                isCorrect: false,
                quality: "average",
                explanation: "While important for long-term health, this doesn't address immediate customer or business needs.",
                consequences: [
                  {
                    type: "neutral",
                    title: "Technical Improvement",
                    description: "Better system performance but no immediate business impact",
                    impact: "Foundation for future features but missed revenue opportunity"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 250, change: 0 },
                  teamMood: { value: 9, change: 2 },
                  customerSat: { value: 3.9, change: 0.1 },
                  userGrowth: { value: 15, change: 0 }
                }
              },
              {
                id: "analytics",
                text: "Prioritize Advanced Analytics",
                description: "Build comprehensive reporting and insights dashboard",
                isCorrect: false,
                quality: "good",
                explanation: "Valuable for power users but may not address the broader customer base needs.",
                consequences: [
                  {
                    type: "positive",
                    title: "User Engagement",
                    description: "Power users love the new insights capabilities",
                    impact: "Higher engagement from existing customers but limited new customer acquisition"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 265, change: 6 },
                  teamMood: { value: 7, change: 0 },
                  customerSat: { value: 4.0, change: 0.2 },
                  userGrowth: { value: 18, change: 3 }
                }
              }
            ]
          }
        },
        {
          title: "User Feedback Analysis",
          description: "Prioritize user feedback to guide product decisions",
          type: "ranking",
          timeLimit: 150,
          content: {
            context: "You've collected feedback from 150 users over the past month. Multiple themes have emerged that need prioritization.",
            scenario: "Your team can address 2 major feedback themes this sprint. Choose wisely to maximize impact.",
            instructions: "Rank the feedback themes by priority and select the top 2 to address.",
            retrospectiveData: {
              whatWentWell: [
                "Users love the core functionality",
                "App performance is generally stable",
                "Customer support response time improved"
              ],
              whatWentWrong: [
                "Onboarding flow confuses new users",
                "Mobile app crashes on older devices",
                "Export feature is slow and unreliable"
              ]
            },
            options: [
              {
                id: "onboarding",
                text: "Fix Onboarding Flow",
                description: "Simplify the user onboarding experience",
                priority: 3,
                quality: "excellent",
                explanation: "Poor onboarding directly impacts user activation and retention rates.",
                kpiImpact: {
                  revenue: { value: 280, change: 12 },
                  teamMood: { value: 8, change: 1 },
                  customerSat: { value: 4.3, change: 0.5 },
                  userGrowth: { value: 25, change: 10 }
                }
              },
              {
                id: "mobile-crashes",
                text: "Fix Mobile App Crashes",
                description: "Resolve stability issues on older devices",
                priority: 2,
                quality: "good",
                explanation: "Affects user experience but only impacts a subset of users.",
                kpiImpact: {
                  revenue: { value: 260, change: 4 },
                  teamMood: { value: 7, change: 0 },
                  customerSat: { value: 4.0, change: 0.2 },
                  userGrowth: { value: 17, change: 2 }
                }
              },
              {
                id: "export-feature",
                text: "Improve Export Feature",
                description: "Make data export faster and more reliable",
                priority: 1,
                quality: "average",
                explanation: "Important for power users but doesn't affect the majority of your user base.",
                kpiImpact: {
                  revenue: { value: 255, change: 2 },
                  teamMood: { value: 6, change: -1 },
                  customerSat: { value: 3.9, change: 0.1 },
                  userGrowth: { value: 16, change: 1 }
                }
              }
            ]
          }
        }
      ],
      intermediate: [
        {
          title: "Stakeholder Alignment Challenge",
          description: "Navigate conflicting stakeholder priorities",
          type: "dialogue",
          timeLimit: 200,
          content: {
            context: "You're leading a cross-functional project with conflicting stakeholder opinions. The CEO wants fast delivery, Engineering wants quality, and Sales wants specific features.",
            scenario: "In a tense stakeholder meeting, you need to find a path forward that satisfies everyone while keeping the project on track.",
            instructions: "Choose your responses carefully to maintain stakeholder relationships while making progress.",
            conversation: [
              {
                speaker: "CEO",
                message: "We need to ship this feature next month to hit our quarterly targets. Can we cut some corners to make it happen?",
                responses: [
                  {
                    id: "compromise",
                    text: "Let's find a middle ground - we can ship an MVP version with core functionality and iterate based on feedback.",
                    tone: "diplomatic",
                    quality: "excellent",
                    explanation: "This balances speed with quality while setting clear expectations."
                  },
                  {
                    id: "pushback",
                    text: "I understand the timeline pressure, but rushing could hurt our reputation and create technical debt.",
                    tone: "assertive",
                    quality: "good",
                    explanation: "Good point but might create tension with executive leadership."
                  },
                  {
                    id: "agree",
                    text: "Absolutely, let's do whatever it takes to hit the deadline.",
                    tone: "agreeable",
                    quality: "poor",
                    explanation: "This could lead to quality issues and team burnout."
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    research: {
      beginner: [
        {
          title: "User Research Study Design",
          description: "Design an effective user research study",
          type: "multiple-choice",
          timeLimit: 120,
          content: {
            context: "Your team is building a new feature but you're not sure if it solves the right problem. You have budget for one research study.",
            scenario: "You need to choose the most appropriate research method to validate your assumptions before development begins.",
            instructions: "Select the research method that would provide the most valuable insights for your situation.",
            data: "Budget: $5,000, Timeline: 2 weeks, Target: 200 existing users, Feature: AI-powered content recommendations",
            options: [
              {
                id: "user-interviews",
                text: "Conduct 15 in-depth user interviews",
                description: "One-on-one conversations to understand user needs and pain points",
                isCorrect: true,
                quality: "excellent",
                explanation: "Interviews provide deep qualitative insights into user motivations and behaviors, perfect for feature validation.",
                consequences: [
                  {
                    type: "positive",
                    title: "Deep User Understanding",
                    description: "Uncover unexpected insights about user needs and behaviors",
                    impact: "Feature development guided by real user problems and contexts"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 240, change: 8 },
                  teamMood: { value: 8, change: 1 },
                  customerSat: { value: 4.4, change: 0.4 },
                  userGrowth: { value: 20, change: 5 }
                }
              },
              {
                id: "survey",
                text: "Send a survey to 500 users",
                description: "Quantitative survey to gather broad feedback",
                isCorrect: false,
                quality: "good",
                explanation: "Surveys provide broad insights but lack the depth needed for feature validation.",
                consequences: [
                  {
                    type: "neutral",
                    title: "Broad Feedback",
                    description: "Collect quantitative data from many users",
                    impact: "Surface-level insights that may miss important nuances"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 220, change: 2 },
                  teamMood: { value: 7, change: 0 },
                  customerSat: { value: 4.0, change: 0.1 },
                  userGrowth: { value: 16, change: 1 }
                }
              }
            ]
          }
        }
      ]
    },
    analytics: {
      beginner: [
        {
          title: "Metric Selection for Feature Launch",
          description: "Choose the right metrics to track feature success",
          type: "multiple-choice",
          timeLimit: 120,
          content: {
            context: "You're launching a new in-app messaging feature. Your team needs to define success metrics to track after launch.",
            scenario: "The feature aims to increase user engagement and reduce support tickets. You need to choose the most important metric to focus on.",
            instructions: "Select the primary metric that best indicates the success of your messaging feature.",
            data: "Current metrics: DAU 10K, Support tickets 50/day, Session length 8 minutes, Feature adoption typically 30% in first month",
            options: [
              {
                id: "message-engagement",
                text: "Message Engagement Rate (messages sent per active user)",
                description: "Track how actively users are using the messaging feature",
                isCorrect: true,
                quality: "excellent",
                explanation: "This directly measures the core value proposition of the feature and user behavior change.",
                consequences: [
                  {
                    type: "positive",
                    title: "Clear Success Signal",
                    description: "Direct measurement of feature value and user adoption",
                    impact: "Actionable insights for feature iteration and improvement"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 230, change: 6 },
                  teamMood: { value: 8, change: 1 },
                  customerSat: { value: 4.2, change: 0.3 },
                  userGrowth: { value: 19, change: 4 }
                }
              },
              {
                id: "support-tickets",
                text: "Reduction in Support Tickets",
                description: "Measure decrease in customer support requests",
                isCorrect: false,
                quality: "good",
                explanation: "While important, this is a lagging indicator and doesn't directly measure feature engagement.",
                consequences: [
                  {
                    type: "neutral",
                    title: "Indirect Measurement",
                    description: "Tracks operational impact but not user engagement",
                    impact: "May miss insights about actual feature usage and value"
                  }
                ],
                kpiImpact: {
                  revenue: { value: 215, change: 1 },
                  teamMood: { value: 7, change: 0 },
                  customerSat: { value: 4.1, change: 0.2 },
                  userGrowth: { value: 16, change: 1 }
                }
              }
            ]
          }
        }
      ]
    }
  };

  // Get templates for the skill area and difficulty
  const skillTemplates = challengeTemplates[skillArea as keyof typeof challengeTemplates];
  const difficultyTemplates = skillTemplates?.[difficulty as keyof typeof skillTemplates] as any[];
  
  if (!difficultyTemplates || difficultyTemplates.length === 0) {
    // Return a generic fallback if no specific template exists
    return createGenericFallback(skillArea, difficulty);
  }

  // Randomly select one template from available options
  const selectedTemplate = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
  
  return {
    id: `static-${skillArea}-${difficulty}-${Date.now()}`,
    ...selectedTemplate,
    format: {
      id: `${selectedTemplate.type}-format`,
      name: selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1),
      type: selectedTemplate.type,
      timeLimit: selectedTemplate.timeLimit
    },
    source: 'static',
    skillArea,
    difficulty
  };
};

const createGenericFallback = (skillArea: string, difficulty: string): GeneratedChallenge => {
  return {
    id: `fallback-${skillArea}-${difficulty}-${Date.now()}`,
    title: `${skillArea.charAt(0).toUpperCase() + skillArea.slice(1)} Challenge`,
    description: `A ${difficulty} level challenge for ${skillArea} skills`,
    type: "multiple-choice",
    timeLimit: 150,
    content: {
      context: `You're working on a ${skillArea} challenge that tests your product management skills.`,
      scenario: `This ${difficulty} level scenario requires you to make strategic decisions.`,
      instructions: "Choose the best option based on product management best practices.",
      options: [
        {
          id: "option-1",
          text: "Analyze the situation and gather more data before deciding",
          description: "Take a data-driven approach to the problem",
          isCorrect: true,
          quality: "good",
          explanation: "In product management, data-driven decisions usually lead to better outcomes.",
          consequences: [
            {
              type: "positive",
              title: "Informed Decision",
              description: "Your careful analysis leads to better outcomes",
              impact: "Team confidence increases and risk is minimized"
            }
          ],
          kpiImpact: {
            revenue: { value: 200, change: 5 },
            teamMood: { value: 7, change: 1 },
            customerSat: { value: 4.0, change: 0.2 },
            userGrowth: { value: 15, change: 2 }
          }
        },
        {
          id: "option-2",
          text: "Make a quick decision based on intuition",
          description: "Trust your experience and move fast",
          isCorrect: false,
          quality: "average",
          explanation: "While speed can be valuable, product decisions benefit from data and analysis.",
          consequences: [
            {
              type: "neutral",
              title: "Fast Action",
              description: "You move quickly but results are unpredictable",
              impact: "Mixed outcomes due to lack of validation"
            }
          ],
          kpiImpact: {
            revenue: { value: 180, change: -2 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 3.8, change: 0 },
            userGrowth: { value: 12, change: -1 }
          }
        }
      ]
    },
    format: {
      id: "basic-choice",
      name: "Basic Choice",
      type: "multiple-choice",
      timeLimit: 150
    },
    source: 'static',
    skillArea,
    difficulty
  };
};
