interface ChallengeFormat {
  id: string;
  name: string;
  description: string;
  type: 'time-bomb' | 'stakeholder-tension' | 'trade-off-slider' | 'post-mortem' | 'resource-allocator' | 'dialogue-tree' | 'retrospective-fix';
  timeLimit: number;
  steps: number;
  interactionType: 'multiple-choice' | 'drag-drop' | 'slider' | 'ranking' | 'dialogue';
}

interface GeneratedChallenge {
  id: string;
  title: string;
  description: string;
  type: string;
  timeLimit: number;
  content: any;
  format: ChallengeFormat;
}

const challengeFormats: ChallengeFormat[] = [
  {
    id: 'time-bomb',
    name: 'Time Bomb Decision',
    description: 'Critical decision under pressure with incomplete information',
    type: 'time-bomb',
    timeLimit: 60,
    steps: 1,
    interactionType: 'multiple-choice'
  },
  {
    id: 'stakeholder-tension',
    name: 'Stakeholder Tension Map',
    description: 'Navigate competing priorities and stakeholder conflicts',
    type: 'stakeholder-tension',
    timeLimit: 180,
    steps: 2,
    interactionType: 'drag-drop'
  },
  {
    id: 'trade-off-slider',
    name: 'Trade-off Balance',
    description: 'Adjust balance between competing metrics and priorities',
    type: 'trade-off-slider',
    timeLimit: 120,
    steps: 1,
    interactionType: 'slider'
  },
  {
    id: 'post-mortem',
    name: 'Root Cause Investigation',
    description: 'Analyze what went wrong based on data and evidence',
    type: 'post-mortem',
    timeLimit: 240,
    steps: 3,
    interactionType: 'multiple-choice'
  },
  {
    id: 'resource-allocator',
    name: 'Resource Allocation',
    description: 'Distribute limited resources across competing priorities',
    type: 'resource-allocator',
    timeLimit: 150,
    steps: 1,
    interactionType: 'drag-drop'
  },
  {
    id: 'dialogue-tree',
    name: 'Stakeholder Dialogue',
    description: 'Navigate complex conversations with multiple stakeholders',
    type: 'dialogue-tree',
    timeLimit: 200,
    steps: 4,
    interactionType: 'dialogue'
  },
  {
    id: 'retrospective-fix',
    name: 'Retrospective Analysis',
    description: 'Reflect on past decisions and plan improvements',
    type: 'retrospective-fix',
    timeLimit: 180,
    steps: 2,
    interactionType: 'ranking'
  }
];

const skillAreaContent = {
  strategy: {
    contexts: [
      'Product roadmap planning session',
      'Competitive threat response',
      'Market expansion decision',
      'Platform architecture choice',
      'Acquisition integration'
    ],
    stakeholders: ['CEO', 'Engineering Lead', 'Sales Director', 'Customer Success', 'Marketing'],
    kpis: ['Market Share', 'Revenue Growth', 'Customer Acquisition', 'Product Adoption', 'Competitive Position']
  },
  research: {
    contexts: [
      'User research methodology selection',
      'Research ethics dilemma',
      'Conflicting user feedback',
      'Research resource allocation',
      'Stakeholder research presentation'
    ],
    stakeholders: ['UX Researcher', 'Product Designer', 'Engineering', 'Business Analyst', 'Customer Support'],
    kpis: ['Research Quality', 'User Satisfaction', 'Insight Actionability', 'Research Speed', 'Stakeholder Buy-in']
  },
  analytics: {
    contexts: [
      'A/B test interpretation',
      'Data pipeline failure',
      'Metric selection for new feature',
      'Dashboard design decision',
      'Predictive model accuracy'
    ],
    stakeholders: ['Data Scientist', 'Engineering', 'Business Intelligence', 'Product Manager', 'Leadership'],
    kpis: ['Data Accuracy', 'Analysis Speed', 'Model Performance', 'Business Impact', 'Technical Debt']
  },
  design: {
    contexts: [
      'Design system implementation',
      'Accessibility compliance',
      'User experience optimization',
      'Design-dev handoff process',
      'Cross-platform consistency'
    ],
    stakeholders: ['UX Designer', 'UI Designer', 'Frontend Dev', 'QA Engineer', 'Product Manager'],
    kpis: ['User Experience', 'Design Consistency', 'Development Velocity', 'Accessibility Score', 'User Feedback']
  }
};

const difficultyModifiers = {
  beginner: {
    timeMultiplier: 1.5,
    complexityLevel: 1,
    stakeholderCount: 2,
    optionCount: 3
  },
  intermediate: {
    timeMultiplier: 1.0,
    complexityLevel: 2,
    stakeholderCount: 3,
    optionCount: 4
  },
  advanced: {
    timeMultiplier: 0.7,
    complexityLevel: 3,
    stakeholderCount: 4,
    optionCount: 5
  }
};

export const generateDynamicChallenge = (skillArea: string, difficulty: string): GeneratedChallenge => {
  // Randomly select a challenge format
  const format = challengeFormats[Math.floor(Math.random() * challengeFormats.length)];
  const modifier = difficultyModifiers[difficulty as keyof typeof difficultyModifiers];
  const areaContent = skillAreaContent[skillArea as keyof typeof skillAreaContent];
  
  // Adjust time limit based on difficulty
  const adjustedTimeLimit = Math.round(format.timeLimit * modifier.timeMultiplier);
  
  // Generate context based on skill area
  const context = areaContent.contexts[Math.floor(Math.random() * areaContent.contexts.length)];
  
  // Generate challenge content based on format type
  let content;
  
  switch (format.type) {
    case 'time-bomb':
      content = generateTimeBombChallenge(areaContent, modifier, context);
      break;
    case 'stakeholder-tension':
      content = generateStakeholderTensionChallenge(areaContent, modifier, context);
      break;
    case 'trade-off-slider':
      content = generateTradeOffChallenge(areaContent, modifier, context);
      break;
    case 'post-mortem':
      content = generatePostMortemChallenge(areaContent, modifier, context);
      break;
    case 'resource-allocator':
      content = generateResourceAllocationChallenge(areaContent, modifier, context);
      break;
    case 'dialogue-tree':
      content = generateDialogueTreeChallenge(areaContent, modifier, context);
      break;
    case 'retrospective-fix':
      content = generateRetrospectiveChallenge(areaContent, modifier, context);
      break;
    default:
      content = generateTimeBombChallenge(areaContent, modifier, context);
  }
  
  const challenge = {
    id: `${skillArea}-${difficulty}-${format.id}-${Date.now()}`,
    title: `${format.name}: ${context}`,
    description: `A ${difficulty} level ${format.description.toLowerCase()} in ${skillArea}`,
    type: format.interactionType, // Use interactionType for rendering
    timeLimit: adjustedTimeLimit,
    content,
    format
  };
  
  // Add debugging
  console.log('Generated challenge:', {
    formatType: format.type,
    interactionType: format.interactionType,
    challengeType: challenge.type,
    title: challenge.title
  });
  
  return challenge;
};

const generateTimeBombChallenge = (areaContent: any, modifier: any, context: string) => {
  const urgentScenarios = [
    "Critical bug discovered 2 hours before launch",
    "Major customer threatening to leave",
    "Competitor launching similar feature tomorrow",
    "Server capacity at 95% during peak traffic",
    "Key team member just quit mid-sprint"
  ];
  
  const scenario = urgentScenarios[Math.floor(Math.random() * urgentScenarios.length)];
  
  return {
    context: `🚨 URGENT: ${scenario}. You have 60 seconds to decide.`,
    scenario: context,
    teamMessages: [
      {
        id: '1',
        sender: 'Engineering Lead',
        avatar: 'EL',
        message: 'This is critical - we need a decision NOW!',
        timestamp: 'just now',
        type: 'alert'
      }
    ],
    options: [
      {
        id: 'immediate',
        text: 'Take immediate action',
        description: 'Act fast with current information',
        isCorrect: false,
        quality: 'poor',
        explanation: 'Acting too hastily without proper information can lead to bigger problems.',
        consequences: [
          {
            type: 'negative',
            title: 'Hasty Decision',
            description: 'Quick action but potential oversight',
            impact: 'May miss important considerations'
          }
        ],
        kpiImpact: {
          revenue: { value: 245, change: -5 },
          teamMood: { value: 6, change: -1 },
          customerSat: { value: 3.8, change: -0.2 },
          userGrowth: { value: 12, change: -3 }
        }
      },
      {
        id: 'gather-info',
        text: 'Gather more information first',
        description: 'Take time to understand the situation',
        isCorrect: false,
        quality: 'average',
        explanation: 'While gathering info is good, time pressure may make this too slow.',
        consequences: [
          {
            type: 'neutral',
            title: 'Measured Approach',
            description: 'Better informed but time-costly decision',
            impact: 'May be too late for optimal outcome'
          }
        ],
        kpiImpact: {
          revenue: { value: 250, change: 0 },
          teamMood: { value: 7, change: 0 },
          customerSat: { value: 4.0, change: 0 },
          userGrowth: { value: 15, change: 0 }
        }
      },
      {
        id: 'delegate',
        text: 'Delegate to subject matter expert',
        description: 'Let the most qualified person decide',
        isCorrect: true,
        quality: 'excellent',
        explanation: 'Leveraging team expertise is the best approach under pressure.',
        consequences: [
          {
            type: 'positive',
            title: 'Expert Decision',
            description: 'Leveraged team expertise effectively',
            impact: 'Better technical outcome, team empowerment'
          }
        ],
        kpiImpact: {
          revenue: { value: 255, change: 2 },
          teamMood: { value: 8, change: 1 },
          customerSat: { value: 4.2, change: 0.2 },
          userGrowth: { value: 18, change: 3 }
        }
      }
    ]
  };
};

const generateStakeholderTensionChallenge = (areaContent: any, modifier: any, context: string) => {
  const selectedStakeholders = areaContent.stakeholders.slice(0, modifier.stakeholderCount);
  
  return {
    context: `Navigate conflicting stakeholder priorities in: ${context}`,
    stakeholders: selectedStakeholders.map((name: string, index: number) => ({
      id: `stakeholder-${index}`,
      name,
      role: name,
      priority: `Priority ${index + 1}`,
      influence: Math.floor(Math.random() * 100) + 1,
      satisfaction: Math.floor(Math.random() * 100) + 1
    })),
    tensions: [
      'Speed vs Quality debate',
      'Resource allocation conflict',
      'Technical debt vs new features',
      'Short-term gains vs long-term vision'
    ],
    options: [
      {
        id: 'compromise',
        text: 'Find a compromise solution',
        description: 'Balance all stakeholder needs',
        isCorrect: false,
        quality: 'average',
        explanation: 'Compromise often leads to sub-optimal outcomes for everyone.',
        consequences: [{
          type: 'neutral',
          title: 'Balanced Approach',
          description: 'No one fully happy, but everyone partially satisfied',
          impact: 'Moderate progress across all areas'
        }]
      },
      {
        id: 'prioritize-business',
        text: 'Prioritize business impact',
        description: 'Focus on revenue and growth metrics',
        isCorrect: true,
        quality: 'good',
        explanation: 'Business impact should guide decisions, but consider stakeholder buy-in.',
        consequences: [{
          type: 'positive',
          title: 'Business Success',
          description: 'Strong business outcomes achieved',
          impact: 'May create technical debt or team burnout'
        }]
      },
      {
        id: 'data-driven',
        text: 'Use data to make the decision',
        description: 'Let metrics and user feedback guide the choice',
        isCorrect: true,
        quality: 'excellent',
        explanation: 'Data-driven decisions reduce bias and increase stakeholder confidence.',
        consequences: [{
          type: 'positive',
          title: 'Evidence-Based Decision',
          description: 'Objective approach builds consensus',
          impact: 'Higher stakeholder confidence and better outcomes'
        }]
      }
    ]
  };
};

const generateTradeOffChallenge = (areaContent: any, modifier: any, context: string) => {
  const kpis = areaContent.kpis.slice(0, 2);
  
  return {
    context: `Balance competing priorities in: ${context}`,
    tradeOffs: [
      { name: kpis[0], value: 50, max: 100 },
      { name: kpis[1], value: 50, max: 100 }
    ],
    constraints: 'You have 100 points total to distribute',
    options: [
      {
        id: 'balanced',
        text: 'Balanced approach (50/50)',
        description: 'Equal focus on both priorities'
      },
      {
        id: 'focus-first',
        text: `Focus on ${kpis[0]} (70/30)`,
        description: `Prioritize ${kpis[0]} over ${kpis[1]}`
      },
      {
        id: 'focus-second',
        text: `Focus on ${kpis[1]} (30/70)`,
        description: `Prioritize ${kpis[1]} over ${kpis[0]}`
      }
    ]
  };
};

const generatePostMortemChallenge = (areaContent: any, modifier: any, context: string) => {
  return {
    context: `Analyze what went wrong in: ${context}`,
    incidentData: {
      timeline: [
        { time: '09:00', event: 'Issue first reported' },
        { time: '09:15', event: 'Team notified' },
        { time: '09:30', event: 'Investigation started' },
        { time: '10:45', event: 'Root cause identified' },
        { time: '11:30', event: 'Fix deployed' }
      ],
      impact: {
        usersAffected: Math.floor(Math.random() * 10000) + 1000,
        downtime: `${Math.floor(Math.random() * 120) + 30} minutes`,
        revenueImpact: `$${Math.floor(Math.random() * 50000) + 5000}`
      }
    },
    options: [
      {
        id: 'process-failure',
        text: 'Process failure was the root cause',
        description: 'Inadequate testing and deployment procedures',
        consequences: [{
          type: 'neutral',
          title: 'Process Improvement',
          description: 'Focus on improving development processes',
          impact: 'Slower releases but higher quality'
        }]
      },
      {
        id: 'technical-debt',
        text: 'Technical debt caused the issue',
        description: 'Legacy code and shortcuts created instability',
        consequences: [{
          type: 'positive',
          title: 'Technical Investment',
          description: 'Allocate resources to reduce technical debt',
          impact: 'Long-term stability and velocity improvement'
        }]
      },
      {
        id: 'communication',
        text: 'Communication breakdown was key',
        description: 'Poor coordination between teams',
        consequences: [{
          type: 'neutral',
          title: 'Communication Focus',
          description: 'Implement better team coordination tools',
          impact: 'Improved collaboration but process overhead'
        }]
      }
    ]
  };
};

const generateResourceAllocationChallenge = (areaContent: any, modifier: any, context: string) => {
  const priorities = [
    'Bug fixes and stability',
    'New feature development',
    'Technical debt reduction',
    'Performance optimization',
    'Security improvements',
    'User experience enhancements'
  ].slice(0, modifier.optionCount + 1);

  return {
    context: `Allocate your team's resources for: ${context}`,
    totalResources: 10,
    priorities: priorities.map((priority, index) => ({
      id: `priority-${index}`,
      name: priority,
      currentAllocation: 0,
      impact: Math.floor(Math.random() * 5) + 1,
      urgency: Math.floor(Math.random() * 5) + 1
    })),
    constraints: [
      'Total allocation must equal 10 points',
      'No priority can have 0 allocation',
      'Maximum 4 points per priority'
    ]
  };
};

const generateDialogueTreeChallenge = (areaContent: any, modifier: any, context: string) => {
  return {
    context: `Navigate a complex stakeholder conversation about: ${context}`,
    currentSpeaker: areaContent.stakeholders[0],
    conversation: [
      {
        speaker: areaContent.stakeholders[0],
        message: "I'm concerned about the direction we're taking with this initiative.",
        responses: [
          {
            id: 'empathetic',
            text: 'I understand your concerns. Can you tell me more?',
            tone: 'empathetic',
            isCorrect: true,
            quality: 'excellent',
            explanation: 'Empathetic listening builds trust and opens dialogue.',
            nextSpeaker: areaContent.stakeholders[1]
          },
          {
            id: 'defensive',
            text: 'We\'ve already considered all the risks.',
            tone: 'defensive',
            isCorrect: false,
            quality: 'poor',
            explanation: 'Defensive responses shut down communication and damage relationships.',
            nextSpeaker: areaContent.stakeholders[1]
          },
          {
            id: 'data-driven',
            text: 'Let me show you the data behind our decision.',
            tone: 'analytical',
            isCorrect: false,
            quality: 'average',
            explanation: 'While data is important, addressing concerns first shows better leadership.',
            nextSpeaker: areaContent.stakeholders[1]
          }
        ]
      }
    ]
  };
};

const generateRetrospectiveChallenge = (areaContent: any, modifier: any, context: string) => {
  const improvements = [
    'Better stakeholder communication',
    'More thorough testing procedures',
    'Improved team collaboration',
    'Enhanced monitoring and alerts',
    'Clearer requirement documentation',
    'Regular technical debt assessment'
  ];

  return {
    context: `Reflect on lessons learned from: ${context}`,
    retrospectiveData: {
      whatWentWell: [
        'Team responded quickly to issues',
        'Cross-functional collaboration improved',
        'Customer feedback was incorporated'
      ],
      whatWentWrong: [
        'Requirements were unclear',
        'Testing was insufficient',
        'Communication gaps occurred'
      ],
      improvements: improvements.slice(0, modifier.optionCount)
    },
    options: improvements.slice(0, modifier.optionCount).map((improvement, index) => ({
      id: `improvement-${index}`,
      text: improvement,
      description: `Focus on implementing ${improvement.toLowerCase()}`,
      priority: Math.floor(Math.random() * 3) + 1,
      isCorrect: index === 0, // First option is usually the best
      quality: index === 0 ? 'excellent' : index === 1 ? 'good' : 'average',
      explanation: index === 0 ? 'Communication improvements have the highest impact on team success.' : 
                  index === 1 ? 'Good choice for process improvement.' : 'Useful but lower priority improvement.'
    }))
  };
};
