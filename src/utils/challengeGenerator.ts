
import { supabase } from '@/integrations/supabase/client';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: string;
  timeLimit: number;
  content: any;
}

export interface ChallengeSession {
  sessionId: string;
  skillArea: string;
  difficulty: string;
  totalExercises: number;
  exercises: Exercise[];
  source?: string;
  generatedAt?: string;
}

export const generateDynamicChallenge = async (skillArea: string, difficulty: string): Promise<ChallengeSession> => {
  console.log('Generating dynamic challenge session:', { skillArea, difficulty });
  
  try {
    // Try to call the OpenAI edge function first
    const { data, error } = await supabase.functions.invoke('generate-ai-challenge', {
      body: {
        skillArea,
        difficulty,
        exerciseCount: 4
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (data && !data.error) {
      console.log('AI challenge session generated successfully with', data.exercises?.length || 0, 'exercises');
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
    console.log('Falling back to enhanced static challenge generation');
    
    // Fallback to enhanced static challenge generation
    return generateEnhancedStaticSession(skillArea, difficulty);
  }
};

const generateEnhancedStaticSession = (skillArea: string, difficulty: string): ChallengeSession => {
  const sessionId = `static-session-${skillArea}-${difficulty}-${Date.now()}`;
  
  // Generate 4 different exercises for variety
  const exercises: Exercise[] = [
    generateStaticExercise(skillArea, difficulty, 'multiple-choice', 1),
    generateStaticExercise(skillArea, difficulty, 'slider', 2),
    generateStaticExercise(skillArea, difficulty, 'dialogue', 3),
    generateStaticExercise(skillArea, difficulty, 'ranking', 4)
  ];

  return {
    sessionId,
    skillArea,
    difficulty,
    totalExercises: 4,
    exercises,
    source: 'static',
    generatedAt: new Date().toISOString()
  };
};

const generateStaticExercise = (skillArea: string, difficulty: string, type: string, exerciseNumber: number): Exercise => {
  const baseId = `${skillArea}-${difficulty}-${type}-${exerciseNumber}`;
  
  // Exercise templates based on type and skill area
  const exerciseTemplates = {
    'multiple-choice': {
      title: `Strategic Decision Making - Exercise ${exerciseNumber}`,
      description: "Make a critical product decision under pressure",
      timeLimit: 180,
      content: {
        context: `You're facing a critical decision in your ${skillArea} role. Multiple stakeholders have different opinions.`,
        scenario: `A urgent situation requires immediate action from the product team.`,
        instructions: "Choose the best approach based on PM best practices.",
        options: [
          {
            id: `${baseId}-option-1`,
            text: "Gather more data before deciding",
            description: "Take time to analyze the situation thoroughly",
            isCorrect: true,
            quality: "excellent",
            explanation: "Data-driven decisions lead to better outcomes in product management.",
            consequences: [
              {
                type: "positive",
                title: "Informed Decision",
                description: "Your analysis reveals key insights",
                impact: "Better long-term outcomes and team confidence"
              }
            ],
            kpiImpact: {
              revenue: { value: 220 + (exerciseNumber * 10), change: 5 + exerciseNumber },
              teamMood: { value: 7 + exerciseNumber, change: 1 },
              customerSat: { value: 4.0 + (exerciseNumber * 0.1), change: 0.2 },
              userGrowth: { value: 15 + exerciseNumber, change: 3 }
            }
          },
          {
            id: `${baseId}-option-2`,
            text: "Make a quick decision based on intuition",
            description: "Trust your experience and move fast",
            isCorrect: false,
            quality: "average",
            explanation: "While speed is valuable, product decisions benefit from analysis.",
            consequences: [
              {
                type: "neutral",
                title: "Fast Action",
                description: "You move quickly but outcomes are uncertain",
                impact: "Mixed results due to lack of validation"
              }
            ],
            kpiImpact: {
              revenue: { value: 180 + (exerciseNumber * 5), change: -1 },
              teamMood: { value: 6, change: -1 },
              customerSat: { value: 3.8, change: 0 },
              userGrowth: { value: 12, change: -1 }
            }
          }
        ]
      }
    },
    'slider': {
      title: `Resource Allocation - Exercise ${exerciseNumber}`,
      description: "Balance competing priorities with limited resources",
      timeLimit: 150,
      content: {
        context: `You need to allocate resources between different ${skillArea} initiatives.`,
        scenario: "Your team has limited capacity and multiple high-priority requests.",
        instructions: "Use the sliders to allocate resources optimally.",
        constraints: "Total allocation cannot exceed 100%",
        tradeOffs: [
          {
            name: "Feature Development",
            value: 50,
            max: 80
          },
          {
            name: "Technical Debt",
            value: 30,
            max: 60
          },
          {
            name: "User Research",
            value: 20,
            max: 40
          }
        ],
        options: [
          {
            id: `${baseId}-balanced`,
            text: "Balanced Approach (40/35/25)",
            quality: "good",
            explanation: "A balanced approach maintains all areas but may not maximize impact."
          },
          {
            id: `${baseId}-feature-focused`,
            text: "Feature-Focused (60/25/15)",
            quality: "excellent",
            explanation: "Prioritizing features can drive immediate user value and business impact."
          }
        ]
      }
    },
    'dialogue': {
      title: `Stakeholder Communication - Exercise ${exerciseNumber}`,
      description: "Navigate a challenging conversation with key stakeholders",
      timeLimit: 200,
      content: {
        context: `You're in a meeting with stakeholders who have conflicting views on ${skillArea} priorities.`,
        scenario: "Tension is rising and you need to find a path forward that satisfies everyone.",
        instructions: "Choose your responses carefully to maintain relationships while making progress.",
        conversation: [
          {
            speaker: "Engineering Lead",
            message: `We're drowning in technical debt and this new ${skillArea} initiative will make it worse. We need to focus on stability first.`,
            responses: [
              {
                id: `${baseId}-compromise`,
                text: "Let's find a middle ground - we can address critical tech debt while making progress on the initiative.",
                tone: "diplomatic",
                quality: "excellent",
                explanation: "Finding compromise shows leadership and keeps both priorities moving forward."
              },
              {
                id: `${baseId}-pushback`,
                text: "I understand the concerns, but this initiative is critical for our business goals.",
                tone: "assertive",
                quality: "good",
                explanation: "Standing firm on priorities is important, but may create tension."
              },
              {
                id: `${baseId}-defer`,
                text: "You're right, let's postpone the initiative until we fix the technical issues.",
                tone: "agreeable",
                quality: "poor",
                explanation: "Constantly deferring product initiatives can hurt business outcomes."
              }
            ]
          }
        ]
      }
    },
    'ranking': {
      title: `Priority Setting - Exercise ${exerciseNumber}`,
      description: "Rank initiatives based on impact and feasibility",
      timeLimit: 120,
      content: {
        context: `Your ${skillArea} team has identified several potential improvements from recent feedback.`,
        scenario: "You can only tackle 2 initiatives this quarter. Choose wisely to maximize impact.",
        instructions: "Rank the initiatives by priority and select the top 2 to pursue.",
        retrospectiveData: {
          whatWentWell: [
            "Strong user engagement with core features",
            "Improved team collaboration and communication",
            "Successful implementation of agile practices"
          ],
          whatWentWrong: [
            "User onboarding completion rate is low",
            "Customer support tickets are increasing",
            "Feature adoption is slower than expected"
          ]
        },
        options: [
          {
            id: `${baseId}-onboarding`,
            text: "Improve User Onboarding Experience",
            description: "Streamline the first-time user experience",
            priority: 3,
            quality: "excellent",
            explanation: "Better onboarding directly impacts user activation and retention.",
            kpiImpact: {
              revenue: { value: 280, change: 12 },
              teamMood: { value: 8, change: 1 },
              customerSat: { value: 4.3, change: 0.4 },
              userGrowth: { value: 25, change: 8 }
            }
          },
          {
            id: `${baseId}-support`,
            text: "Reduce Customer Support Load",
            description: "Implement self-service options and better documentation",
            priority: 2,
            quality: "good",
            explanation: "Reducing support load improves efficiency but may not drive growth."
          },
          {
            id: `${baseId}-adoption`,
            text: "Increase Feature Adoption",
            description: "Add in-app guidance and feature discovery",
            priority: 1,
            quality: "average",
            explanation: "Feature adoption is important but may not address root causes."
          }
        ]
      }
    }
  };

  const template = exerciseTemplates[type as keyof typeof exerciseTemplates];
  
  return {
    id: baseId,
    title: template.title,
    description: template.description,
    type,
    timeLimit: template.timeLimit,
    content: template.content
  };
};
