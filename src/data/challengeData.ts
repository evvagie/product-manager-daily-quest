
interface ChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'drag-drop' | 'multiple-choice' | 'ranking' | 'scenario';
  content: any;
  timeLimit: number;
}

interface ChallengeSet {
  [key: string]: {
    [key: string]: ChallengeData[];
  };
}

export const challengeDatabase: ChallengeSet = {
  strategy: {
    beginner: [
      {
        id: 's-b-1',
        title: 'Basic Feature Prioritization',
        description: 'Drag and drop features in order of priority for a simple mobile app',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'User Login', impact: 'high', effort: 'low' },
            { id: 'f2', name: 'Profile Picture', impact: 'low', effort: 'low' },
            { id: 'f3', name: 'Settings Page', impact: 'medium', effort: 'low' },
            { id: 'f4', name: 'Search Feature', impact: 'high', effort: 'medium' },
            { id: 'f5', name: 'Theme Customization', impact: 'low', effort: 'medium' }
          ]
        },
        timeLimit: 90
      },
      {
        id: 's-b-2',
        title: 'Simple Market Entry',
        description: 'Choose the best initial market for your new app',
        type: 'multiple-choice',
        content: {
          scenario: "You're launching a new fitness app. Which market should you target first?",
          options: [
            { id: 'a', text: 'Young professionals (25-35)', impact: 'Tech-savvy, disposable income' },
            { id: 'b', text: 'College students (18-25)', impact: 'Early adopters, limited budget' },
            { id: 'c', text: 'Middle-aged adults (35-50)', impact: 'Health conscious, stable income' },
            { id: 'd', text: 'Senior citizens (50+)', impact: 'Growing market, less tech-savvy' }
          ]
        },
        timeLimit: 60
      },
      {
        id: 's-b-3',
        title: 'Basic Team Roles',
        description: 'Rank team members by involvement in product decisions',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Product Manager', role: 'Product strategy' },
            { id: 's2', name: 'Developer', role: 'Technical implementation' },
            { id: 's3', name: 'Designer', role: 'User experience' },
            { id: 's4', name: 'Marketing', role: 'User acquisition' }
          ]
        },
        timeLimit: 80
      },
      {
        id: 's-b-4',
        title: 'Simple Launch Strategy',
        description: 'Choose your app launch approach',
        type: 'scenario',
        content: {
          situation: "Your app is ready to launch. What's your strategy?",
          options: [
            {
              id: 'o1',
              strategy: 'Soft Launch',
              description: 'Release to a small group first',
              pros: ['Safe testing', 'Early feedback'],
              cons: ['Slow growth', 'Limited exposure']
            },
            {
              id: 'o2',
              strategy: 'Full Launch',
              description: 'Release to everyone immediately',
              pros: ['Maximum exposure', 'Quick adoption'],
              cons: ['Higher risk', 'Harder to fix issues']
            }
          ]
        },
        timeLimit: 100
      }
    ],
    intermediate: [
      {
        id: 's-i-1',
        title: 'Platform Strategy Features',
        description: 'Prioritize features for a multi-platform product strategy',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Cross-platform Sync', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'API Integration', impact: 'high', effort: 'medium' },
            { id: 'f3', name: 'Advanced Analytics', impact: 'medium', effort: 'high' },
            { id: 'f4', name: 'Offline Mode', impact: 'medium', effort: 'high' },
            { id: 'f5', name: 'Third-party Plugins', impact: 'medium', effort: 'medium' },
            { id: 'f6', name: 'Premium Features', impact: 'high', effort: 'low' }
          ]
        },
        timeLimit: 150
      },
      {
        id: 's-i-2',
        title: 'Competitive Response',
        description: 'How should you respond to a competitor launching a similar feature?',
        type: 'multiple-choice',
        content: {
          scenario: "A major competitor just launched a feature similar to one on your roadmap. Your feature is 60% complete.",
          options: [
            { id: 'a', text: 'Rush to launch first', impact: 'Fast to market but quality risks' },
            { id: 'b', text: 'Continue planned timeline', impact: 'Better quality but later to market' },
            { id: 'c', text: 'Pivot to differentiate', impact: 'Unique positioning but resource cost' },
            { id: 'd', text: 'Cancel and focus elsewhere', impact: 'Avoid competition but missed opportunity' }
          ]
        },
        timeLimit: 120
      },
      {
        id: 's-i-3',
        title: 'Stakeholder Influence Matrix',
        description: 'Rank stakeholders by their influence on product roadmap decisions',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'VP of Product', role: 'Product vision and strategy' },
            { id: 's2', name: 'Engineering Lead', role: 'Technical feasibility' },
            { id: 's3', name: 'Sales Director', role: 'Customer requirements' },
            { id: 's4', name: 'Customer Success', role: 'User satisfaction' },
            { id: 's5', name: 'Data Analyst', role: 'Usage insights' }
          ]
        },
        timeLimit: 140
      },
      {
        id: 's-i-4',
        title: 'Market Expansion Strategy',
        description: 'Choose your international expansion strategy',
        type: 'scenario',
        content: {
          situation: "Your product is successful domestically. You have budget for one international market expansion.",
          options: [
            {
              id: 'o1',
              strategy: 'Similar Market',
              description: 'Expand to culturally similar market',
              pros: ['Lower localization cost', 'Proven product-market fit'],
              cons: ['Limited learning', 'Similar competitive landscape']
            },
            {
              id: 'o2',
              strategy: 'High-Growth Market',
              description: 'Target emerging high-growth market',
              pros: ['Huge potential', 'First-mover advantage'],
              cons: ['Higher risk', 'Significant localization needs']
            },
            {
              id: 'o3',
              strategy: 'Premium Market',
              description: 'Enter established premium market',
              pros: ['Higher revenue per user', 'Quality positioning'],
              cons: ['Intense competition', 'Higher customer acquisition cost']
            }
          ]
        },
        timeLimit: 180
      }
    ],
    advanced: [
      {
        id: 's-a-1',
        title: 'Enterprise Platform Priorities',
        description: 'Prioritize complex platform features for enterprise clients',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Enterprise SSO', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'Advanced Permissions', impact: 'high', effort: 'high' },
            { id: 'f3', name: 'Audit Logging', impact: 'medium', effort: 'medium' },
            { id: 'f4', name: 'Custom Workflows', impact: 'high', effort: 'high' },
            { id: 'f5', name: 'White-label Options', impact: 'medium', effort: 'high' },
            { id: 'f6', name: 'Compliance Dashboard', impact: 'high', effort: 'medium' },
            { id: 'f7', name: 'Advanced Reporting', impact: 'medium', effort: 'medium' }
          ]
        },
        timeLimit: 240
      },
      {
        id: 's-a-2',
        title: 'Strategic Pivot Decision',
        description: 'Navigate a major strategic decision with limited data',
        type: 'multiple-choice',
        content: {
          scenario: "User growth has plateaued, churn is increasing, and a new technology threatens your core business model. Board wants a strategic response.",
          options: [
            { id: 'a', text: 'Double down on current model', impact: 'Optimize existing strengths but risk obsolescence' },
            { id: 'b', text: 'Pivot to new technology', impact: 'Future-proof but abandon current users' },
            { id: 'c', text: 'Build hybrid solution', impact: 'Serve both markets but resource strain' },
            { id: 'd', text: 'Acquire technology/talent', impact: 'Fast capability gain but integration risk' }
          ]
        },
        timeLimit: 200
      },
      {
        id: 's-a-3',
        title: 'Complex Stakeholder Matrix',
        description: 'Navigate influence across multiple organizational levels',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Board of Directors', role: 'Strategic oversight and funding' },
            { id: 's2', name: 'CEO', role: 'Company vision and priorities' },
            { id: 's3', name: 'CTO', role: 'Technology strategy and architecture' },
            { id: 's4', name: 'Key Enterprise Client', role: 'Revenue and requirements' },
            { id: 's5', name: 'Product Team', role: 'Execution and user advocacy' },
            { id: 's6', name: 'Regulatory Body', role: 'Compliance requirements' }
          ]
        },
        timeLimit: 200
      },
      {
        id: 's-a-4',
        title: 'Multi-Market Platform Strategy',
        description: 'Design strategy for global platform expansion',
        type: 'scenario',
        content: {
          situation: "You're launching a B2B platform in 5 different markets with varying regulations, customer needs, and competitive landscapes.",
          options: [
            {
              id: 'o1',
              strategy: 'Unified Platform',
              description: 'Single platform with regional configurations',
              pros: ['Lower development cost', 'Easier maintenance', 'Consistent brand'],
              cons: ['May not fit all markets', 'Complex configuration', 'Regulatory challenges']
            },
            {
              id: 'o2',
              strategy: 'Regional Variants',
              description: 'Customized versions for each market',
              pros: ['Perfect market fit', 'Regulatory compliance', 'Local optimization'],
              cons: ['High development cost', 'Complex maintenance', 'Fragmented learning']
            },
            {
              id: 'o3',
              strategy: 'Modular Architecture',
              description: 'Core platform with market-specific modules',
              pros: ['Balanced approach', 'Scalable', 'Shared learnings'],
              cons: ['Complex architecture', 'Integration challenges', 'Higher initial cost']
            }
          ]
        },
        timeLimit: 300
      }
    ]
  },
  research: {
    beginner: [
      {
        id: 'r-b-1',
        title: 'Basic Research Methods',
        description: 'Prioritize research methods for understanding user needs',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'User Surveys', impact: 'medium', effort: 'low' },
            { id: 'f2', name: 'User Interviews', impact: 'high', effort: 'medium' },
            { id: 'f3', name: 'Analytics Review', impact: 'medium', effort: 'low' },
            { id: 'f4', name: 'Competitor Analysis', impact: 'low', effort: 'low' },
            { id: 'f5', name: 'Usability Testing', impact: 'high', effort: 'medium' }
          ]
        },
        timeLimit: 90
      },
      {
        id: 'r-b-2',
        title: 'Simple Survey Design',
        description: 'Choose the best question type for your research goal',
        type: 'multiple-choice',
        content: {
          scenario: "You want to understand why users are not completing the signup process.",
          options: [
            { id: 'a', text: 'Multiple choice questions', impact: 'Easy to analyze but limited insights' },
            { id: 'b', text: 'Open-ended questions', impact: 'Rich insights but hard to analyze' },
            { id: 'c', text: 'Rating scale questions', impact: 'Quantifiable but may miss context' },
            { id: 'd', text: 'Yes/No questions', impact: 'Clear data but oversimplified' }
          ]
        },
        timeLimit: 70
      },
      {
        id: 'r-b-3',
        title: 'Research Priority',
        description: 'Rank these research activities by importance for a new feature',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'User Need Validation', role: 'Confirm problem exists' },
            { id: 's2', name: 'Solution Testing', role: 'Test proposed solution' },
            { id: 's3', name: 'Competitive Analysis', role: 'Understand market landscape' },
            { id: 's4', name: 'Technical Feasibility', role: 'Confirm implementation possibility' }
          ]
        },
        timeLimit: 80
      },
      {
        id: 'r-b-4',
        title: 'Basic User Feedback',
        description: 'How should you collect user feedback on a new design?',
        type: 'scenario',
        content: {
          situation: "You have a new design concept and need user feedback before development starts.",
          options: [
            {
              id: 'o1',
              strategy: 'Online Survey',
              description: 'Send survey to existing users',
              pros: ['Large sample size', 'Quick results'],
              cons: ['Limited depth', 'Low response rate']
            },
            {
              id: 'o2',
              strategy: 'User Interviews',
              description: 'Conduct 1-on-1 interviews',
              pros: ['Deep insights', 'Follow-up questions'],
              cons: ['Small sample', 'Time intensive']
            }
          ]
        },
        timeLimit: 100
      }
    ],
    intermediate: [
      {
        id: 'r-i-1',
        title: 'Mixed-Method Research Design',
        description: 'Prioritize research methods for a complex user journey study',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Journey Mapping Sessions', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'Behavioral Analytics', impact: 'high', effort: 'medium' },
            { id: 'f3', name: 'Diary Studies', impact: 'high', effort: 'high' },
            { id: 'f4', name: 'Focus Groups', impact: 'medium', effort: 'medium' },
            { id: 'f5', name: 'A/B Testing Setup', impact: 'medium', effort: 'low' },
            { id: 'f6', name: 'Card Sorting', impact: 'medium', effort: 'low' }
          ]
        },
        timeLimit: 150
      },
      {
        id: 'r-i-2',
        title: 'Research Methodology Choice',
        description: 'Choose the best research approach for understanding user motivations',
        type: 'multiple-choice',
        content: {
          scenario: "Users are abandoning your app after the first week. You need to understand their motivations and barriers.",
          options: [
            { id: 'a', text: 'Longitudinal study with weekly check-ins', impact: 'Deep insights but high participant dropout' },
            { id: 'b', text: 'Exit interviews with churned users', impact: 'Direct feedback but potential bias' },
            { id: 'c', text: 'Cohort analysis with behavioral data', impact: 'Objective data but limited context' },
            { id: 'd', text: 'Mixed methods with surveys and interviews', impact: 'Comprehensive but resource intensive' }
          ]
        },
        timeLimit: 140
      },
      {
        id: 'r-i-3',
        title: 'Research Stakeholder Management',
        description: 'Rank stakeholders by their involvement in research planning',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'UX Researcher', role: 'Research design and execution' },
            { id: 's2', name: 'Product Manager', role: 'Research questions and priorities' },
            { id: 's3', name: 'Engineering Lead', role: 'Technical constraints and feasibility' },
            { id: 's4', name: 'Design Lead', role: 'Design implications and testing' },
            { id: 's5', name: 'Customer Success', role: 'User access and relationships' }
          ]
        },
        timeLimit: 130
      },
      {
        id: 'r-i-4',
        title: 'Research Timeline Management',
        description: 'Balance research depth with product development timeline',
        type: 'scenario',
        content: {
          situation: "Product team needs research insights in 3 weeks for a major feature decision, but thorough research typically takes 6-8 weeks.",
          options: [
            {
              id: 'o1',
              strategy: 'Rapid Research Sprint',
              description: 'Compressed timeline with focused scope',
              pros: ['Meets deadline', 'Actionable insights'],
              cons: ['Limited depth', 'Potential blind spots']
            },
            {
              id: 'o2',
              strategy: 'Phased Research Approach',
              description: 'Quick initial insights, deeper research later',
              pros: ['Immediate guidance', 'Comprehensive long-term'],
              cons: ['May delay decisions', 'Resource allocation challenges']
            },
            {
              id: 'o3',
              strategy: 'Request Timeline Extension',
              description: 'Push for full research timeline',
              pros: ['Thorough insights', 'Better decisions'],
              cons: ['Product delays', 'Team frustration']
            }
          ]
        },
        timeLimit: 180
      }
    ],
    advanced: [
      {
        id: 'r-a-1',
        title: 'Complex Research Program Design',
        description: 'Design a comprehensive research program for enterprise product validation',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Multi-site Ethnographic Studies', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'Longitudinal Cohort Analysis', impact: 'high', effort: 'high' },
            { id: 'f3', name: 'Stakeholder Interview Program', impact: 'high', effort: 'medium' },
            { id: 'f4', name: 'Competitive Intelligence Research', impact: 'medium', effort: 'high' },
            { id: 'f5', name: 'Statistical Modeling & Prediction', impact: 'high', effort: 'high' },
            { id: 'f6', name: 'Cross-cultural Validation Studies', impact: 'medium', effort: 'high' },
            { id: 'f7', name: 'Regulatory Compliance Research', impact: 'high', effort: 'medium' }
          ]
        },
        timeLimit: 240
      },
      {
        id: 'r-a-2',
        title: 'Research Ethics and Bias',
        description: 'Navigate complex ethical considerations in user research',
        type: 'multiple-choice',
        content: {
          scenario: "You're researching sensitive user behaviors for a mental health app. Participants are sharing personal trauma, and you're noticing researcher bias affecting your analysis.",
          options: [
            { id: 'a', text: 'Continue with current approach, note biases in limitations', impact: 'Fast progress but ethical concerns' },
            { id: 'b', text: 'Implement triangulation with multiple researchers', impact: 'Reduces bias but increases cost and time' },
            { id: 'c', text: 'Redesign study with external ethics review', impact: 'Ethical compliance but significant delays' },
            { id: 'd', text: 'Partner with clinical research experts', impact: 'Expert guidance but loss of internal control' }
          ]
        },
        timeLimit: 220
      },
      {
        id: 'r-a-3',
        title: 'Global Research Coordination',
        description: 'Coordinate research across different cultural and regulatory contexts',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Global Research Director', role: 'Overall strategy and coordination' },
            { id: 's2', name: 'Regional Research Leads', role: 'Local execution and cultural context' },
            { id: 's3', name: 'Ethics Review Board', role: 'Compliance and participant protection' },
            { id: 's4', name: 'Product Leadership', role: 'Business requirements and decisions' },
            { id: 's5', name: 'Legal and Regulatory', role: 'Compliance and risk management' },
            { id: 's6', name: 'Data Privacy Officer', role: 'Data handling and privacy compliance' }
          ]
        },
        timeLimit: 200
      },
      {
        id: 'r-a-4',
        title: 'Research Impact and ROI',
        description: 'Demonstrate research value in organization with limited research culture',
        type: 'scenario',
        content: {
          situation: "Leadership questions the ROI of user research, preferring to rely on data analytics and expert assumptions. Research budget is being cut by 50%.",
          options: [
            {
              id: 'o1',
              strategy: 'Embedded Research Model',
              description: 'Integrate researchers directly into product teams',
              pros: ['Immediate impact', 'Team buy-in', 'Efficient resource use'],
              cons: ['Reduced research rigor', 'Limited strategic perspective', 'Siloed insights']
            },
            {
              id: 'o2',
              strategy: 'Research ROI Demonstration',
              description: 'Quantify research impact on business metrics',
              pros: ['Clear value proposition', 'Data-driven case', 'Sustainable funding'],
              cons: ['Time intensive setup', 'Difficult attribution', 'Focus on short-term gains']
            },
            {
              id: 'o3',
              strategy: 'Lean Research Operations',
              description: 'Streamline methods, focus on highest-impact research',
              pros: ['Cost effective', 'Maintained quality', 'Strategic focus'],
              cons: ['Reduced coverage', 'Increased risk', 'Team capacity strain']
            }
          ]
        },
        timeLimit: 300
      }
    ]
  },
  analytics: {
    beginner: [
      {
        id: 'a-b-1',
        title: 'Basic Metrics Selection',
        description: 'Choose the most important metrics to track for a new app',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Daily Active Users', impact: 'high', effort: 'low' },
            { id: 'f2', name: 'Session Duration', impact: 'medium', effort: 'low' },
            { id: 'f3', name: 'Conversion Rate', impact: 'high', effort: 'low' },
            { id: 'f4', name: 'Feature Usage', impact: 'medium', effort: 'medium' },
            { id: 'f5', name: 'User Satisfaction Score', impact: 'medium', effort: 'high' }
          ]
        },
        timeLimit: 80
      },
      {
        id: 'a-b-2',
        title: 'Simple A/B Test',
        description: 'What should you test first on your landing page?',
        type: 'multiple-choice',
        content: {
          scenario: "Your landing page has a 2% conversion rate. You want to run your first A/B test.",
          options: [
            { id: 'a', text: 'Headline text', impact: 'Easy to test, moderate impact' },
            { id: 'b', text: 'Button color', impact: 'Very easy to test, low impact' },
            { id: 'c', text: 'Page layout', impact: 'Hard to test, high impact' },
            { id: 'd', text: 'Call-to-action text', impact: 'Easy to test, high impact' }
          ]
        },
        timeLimit: 60
      },
      {
        id: 'a-b-3',
        title: 'Analytics Dashboard Priority',
        description: 'Rank these metrics by priority for your weekly dashboard',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Revenue Growth', role: 'Business performance indicator' },
            { id: 's2', name: 'User Acquisition', role: 'Growth measurement' },
            { id: 's3', name: 'User Retention', role: 'Product-market fit indicator' },
            { id: 's4', name: 'Feature Adoption', role: 'Product development guide' }
          ]
        },
        timeLimit: 90
      },
      {
        id: 'a-b-4',
        title: 'Data Collection Setup',
        description: 'Choose your initial analytics setup approach',
        type: 'scenario',
        content: {
          situation: "You're launching a new product and need to set up analytics tracking.",
          options: [
            {
              id: 'o1',
              strategy: 'Comprehensive Tracking',
              description: 'Track everything from day one',
              pros: ['Complete data', 'Future flexibility'],
              cons: ['Complex setup', 'Performance impact']
            },
            {
              id: 'o2',
              strategy: 'Minimal Viable Analytics',
              description: 'Track only essential metrics initially',
              pros: ['Quick launch', 'Simple setup'],
              cons: ['Limited insights', 'Missing opportunities']
            }
          ]
        },
        timeLimit: 100
      }
    ],
    intermediate: [
      {
        id: 'a-i-1',
        title: 'Funnel Analysis Priorities',
        description: 'Prioritize metrics for optimizing your conversion funnel',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Landing Page CTR', impact: 'high', effort: 'low' },
            { id: 'f2', name: 'Signup Completion Rate', impact: 'high', effort: 'medium' },
            { id: 'f3', name: 'Onboarding Drop-off Points', impact: 'high', effort: 'medium' },
            { id: 'f4', name: 'Feature Discovery Rate', impact: 'medium', effort: 'high' },
            { id: 'f5', name: 'Time to Value Metrics', impact: 'high', effort: 'high' },
            { id: 'f6', name: 'Cohort Retention Analysis', impact: 'medium', effort: 'medium' }
          ]
        },
        timeLimit: 140
      },
      {
        id: 'a-i-2',
        title: 'Statistical Significance',
        description: 'Your A/B test results are unclear. What should you do?',
        type: 'multiple-choice',
        content: {
          scenario: "After 2 weeks, your A/B test shows a 15% improvement but only 85% statistical confidence.",
          options: [
            { id: 'a', text: 'Run test longer to reach 95% confidence', impact: 'Statistically sound but delays decisions' },
            { id: 'b', text: 'Ship the variation based on positive trend', impact: 'Fast action but risk of false positive' },
            { id: 'c', text: 'Redesign test with larger effect size', impact: 'Better detection but starting over' },
            { id: 'd', text: 'Run additional validation test', impact: 'Confirmation but resource intensive' }
          ]
        },
        timeLimit: 120
      },
      {
        id: 'a-i-3',
        title: 'Cross-functional Analytics Team',
        description: 'Rank team members by their role in analytics decision-making',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Data Analyst', role: 'Data interpretation and insights' },
            { id: 's2', name: 'Product Manager', role: 'Business context and decisions' },
            { id: 's3', name: 'Growth Marketer', role: 'Acquisition and conversion optimization' },
            { id: 's4', name: 'UX Researcher', role: 'Qualitative context for quantitative data' },
            { id: 's5', name: 'Engineering Lead', role: 'Data infrastructure and implementation' }
          ]
        },
        timeLimit: 130
      },
      {
        id: 'a-i-4',
        title: 'Data Quality vs Speed',
        description: 'Balance data accuracy with decision-making speed',
        type: 'scenario',
        content: {
          situation: "Your current analytics setup has a 48-hour delay but leadership wants real-time insights for a critical product launch.",
          options: [
            {
              id: 'o1',
              strategy: 'Implement Real-time Pipeline',
              description: 'Build new infrastructure for instant data',
              pros: ['Immediate insights', 'Future capability'],
              cons: ['High cost', 'Implementation risk', 'Potential accuracy issues']
            },
            {
              id: 'o2',
              strategy: 'Hybrid Approach',
              description: 'Real-time for key metrics, delayed for detailed analysis',
              pros: ['Balanced solution', 'Manageable cost'],
              cons: ['Complex system', 'Partial coverage']
            },
            {
              id: 'o3',
              strategy: 'Enhanced Reporting',
              description: 'Improve current system with better dashboards',
              pros: ['Cost effective', 'Proven reliability'],
              cons: ['Still delayed', 'Competitive disadvantage']
            }
          ]
        },
        timeLimit: 180
      }
    ],
    advanced: [
      {
        id: 'a-a-1',
        title: 'Advanced Analytics Infrastructure',
        description: 'Design analytics architecture for enterprise-scale data platform',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Real-time Event Streaming', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'Predictive Modeling Pipeline', impact: 'high', effort: 'high' },
            { id: 'f3', name: 'Cross-platform Data Unification', impact: 'high', effort: 'high' },
            { id: 'f4', name: 'Advanced Segmentation Engine', impact: 'high', effort: 'medium' },
            { id: 'f5', name: 'Machine Learning Feature Store', impact: 'medium', effort: 'high' },
            { id: 'f6', name: 'Privacy-compliant Data Lake', impact: 'high', effort: 'high' },
            { id: 'f7', name: 'Automated Anomaly Detection', impact: 'medium', effort: 'medium' }
          ]
        },
        timeLimit: 250
      },
      {
        id: 'a-a-2',
        title: 'Strategic Analytics Decisions',
        description: 'Navigate complex trade-offs in enterprise analytics strategy',
        type: 'multiple-choice',
        content: {
          scenario: "Your company is facing privacy regulations, data silos across acquisitions, and pressure for AI-driven insights, all while maintaining system performance.",
          options: [
            { id: 'a', text: 'Federated analytics with privacy-first architecture', impact: 'Compliance focused but complex integration' },
            { id: 'b', text: 'Centralized data lake with advanced governance', impact: 'Powerful insights but privacy and performance risks' },
            { id: 'c', text: 'Hybrid cloud-edge computing model', impact: 'Balanced approach but architectural complexity' },
            { id: 'd', text: 'AI-first platform with built-in privacy protection', impact: 'Future-ready but unproven technology risks' }
          ]
        },
        timeLimit: 220
      },
      {
        id: 'a-a-3',
        title: 'Enterprise Analytics Governance',
        description: 'Establish analytics governance across global organization',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Chief Data Officer', role: 'Enterprise data strategy and governance' },
            { id: 's2', name: 'Regional Analytics Leads', role: 'Local implementation and compliance' },
            { id: 's3', name: 'Privacy and Legal Team', role: 'Regulatory compliance and risk management' },
            { id: 's4', name: 'Product Analytics Team', role: 'Product insights and optimization' },
            { id: 's5', name: 'Business Intelligence Team', role: 'Strategic reporting and analysis' },
            { id: 's6', name: 'Data Engineering Team', role: 'Infrastructure and data pipeline management' }
          ]
        },
        timeLimit: 200
      },
      {
        id: 'a-a-4',
        title: 'Analytics ROI and Investment',
        description: 'Justify major analytics infrastructure investment to executive team',
        type: 'scenario',
        content: {
          situation: "Board wants $2M investment in advanced analytics justified with clear ROI projections, but current measurement capabilities make attribution difficult.",
          options: [
            {
              id: 'o1',
              strategy: 'Incremental Implementation',
              description: 'Phase implementation with measurable milestones',
              pros: ['Lower risk', 'Proven ROI at each stage', 'Manageable budget'],
              cons: ['Delayed benefits', 'Competitive disadvantage', 'Integration complexity']
            },
            {
              id: 'o2',
              strategy: 'Pilot Program with Key Use Cases',
              description: 'Focus on high-impact, measurable use cases first',
              pros: ['Clear ROI demonstration', 'Stakeholder buy-in', 'Learning opportunity'],
              cons: ['Limited scope', 'May not show full potential', 'Pressure to oversell']
            },
            {
              id: 'o3',
              strategy: 'Comprehensive Business Case',
              description: 'Build detailed financial model with industry benchmarks',
              pros: ['Thorough analysis', 'Professional approach', 'Risk assessment'],
              cons: ['Time intensive', 'Uncertain projections', 'May not convince skeptics']
            }
          ]
        },
        timeLimit: 300
      }
    ]
  },
  design: {
    beginner: [
      {
        id: 'd-b-1',
        title: 'Basic UI Component Priority',
        description: 'Prioritize UI components for your first mobile app design',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Navigation Menu', impact: 'high', effort: 'low' },
            { id: 'f2', name: 'Login Screen', impact: 'high', effort: 'low' },
            { id: 'f3', name: 'Loading States', impact: 'medium', effort: 'low' },
            { id: 'f4', name: 'Error Messages', impact: 'medium', effort: 'low' },
            { id: 'f5', name: 'Animations', impact: 'low', effort: 'medium' }
          ]
        },
        timeLimit: 90
      },
      {
        id: 'd-b-2',
        title: 'Color Scheme Decision',
        description: 'Choose the best color approach for a productivity app',
        type: 'multiple-choice',
        content: {
          scenario: "You're designing a productivity app. Users will spend long periods using it.",
          options: [
            { id: 'a', text: 'Bright, energetic colors', impact: 'Motivating but potentially tiring' },
            { id: 'b', text: 'Neutral, calming colors', impact: 'Easy on eyes but may lack energy' },
            { id: 'c', text: 'Dark mode with accent colors', impact: 'Modern and easy on eyes' },
            { id: 'd', text: 'User-customizable themes', impact: 'Flexible but complex to implement' }
          ]
        },
        timeLimit: 70
      },
      {
        id: 'd-b-3',
        title: 'Design Process Steps',
        description: 'Rank these design process steps in order of execution',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'User Research', role: 'Understanding user needs' },
            { id: 's2', name: 'Wireframing', role: 'Layout and structure' },
            { id: 's3', name: 'Visual Design', role: 'Colors, typography, style' },
            { id: 's4', name: 'Prototyping', role: 'Interactive testing' }
          ]
        },
        timeLimit: 80
      },
      {
        id: 'd-b-4',
        title: 'First Design Review',
        description: 'How should you present your initial design concepts?',
        type: 'scenario',
        content: {
          situation: "You've created initial wireframes for a new feature and need stakeholder feedback.",
          options: [
            {
              id: 'o1',
              strategy: 'Static Wireframes',
              description: 'Present detailed wireframes with annotations',
              pros: ['Clear structure', 'Easy to create'],
              cons: ['Hard to visualize flow', 'Abstract for stakeholders']
            },
            {
              id: 'o2',
              strategy: 'Interactive Prototype',
              description: 'Create clickable prototype',
              pros: ['Realistic experience', 'Better feedback'],
              cons: ['Time intensive', 'May focus on details too early']
            }
          ]
        },
        timeLimit: 100
      }
    ],
    intermediate: [
      {
        id: 'd-i-1',
        title: 'Design System Components',
        description: 'Prioritize design system components for your growing product',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Button Variants', impact: 'high', effort: 'low' },
            { id: 'f2', name: 'Form Components', impact: 'high', effort: 'medium' },
            { id: 'f3', name: 'Typography Scale', impact: 'high', effort: 'low' },
            { id: 'f4', name: 'Color Palette System', impact: 'high', effort: 'medium' },
            { id: 'f5', name: 'Icon Library', impact: 'medium', effort: 'high' },
            { id: 'f6', name: 'Animation Guidelines', impact: 'low', effort: 'high' }
          ]
        },
        timeLimit: 140
      },
      {
        id: 'd-i-2',
        title: 'Accessibility vs Timeline',
        description: 'Your product needs accessibility improvements but launch is in 2 weeks',
        type: 'multiple-choice',
        content: {
          scenario: "Accessibility audit reveals multiple issues. Marketing has announced launch date publicly.",
          options: [
            { id: 'a', text: 'Fix critical accessibility issues, delay launch', impact: 'Inclusive design but marketing/business impact' },
            { id: 'b', text: 'Launch as planned, fix accessibility post-launch', impact: 'Meets deadline but excludes users' },
            { id: 'c', text: 'Implement quick wins, plan comprehensive fixes', impact: 'Balanced but incomplete solution' },
            { id: 'd', text: 'Launch in phases, accessibility-first approach', impact: 'Responsible but complex rollout' }
          ]
        },
        timeLimit: 130
      },
      {
        id: 'd-i-3',
        title: 'Design Team Collaboration',
        description: 'Rank team members by their input on design decisions',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'UX Designer', role: 'User experience and interaction design' },
            { id: 's2', name: 'Visual Designer', role: 'Visual aesthetics and brand consistency' },
            { id: 's3', name: 'Product Manager', role: 'Business requirements and user needs' },
            { id: 's4', name: 'Frontend Developer', role: 'Technical feasibility and implementation' },
            { id: 's5', name: 'UX Researcher', role: 'User testing and validation' }
          ]
        },
        timeLimit: 120
      },
      {
        id: 'd-i-4',
        title: 'Responsive Design Strategy',
        description: 'Choose your approach for designing across multiple device sizes',
        type: 'scenario',
        content: {
          situation: "Your web app needs to work seamlessly across desktop, tablet, and mobile with limited design resources.",
          options: [
            {
              id: 'o1',
              strategy: 'Mobile-First Design',
              description: 'Design for mobile, then expand to larger screens',
              pros: ['Ensures mobile usability', 'Progressive enhancement'],
              cons: ['May limit desktop potential', 'Complex desktop features']
            },
            {
              id: 'o2',
              strategy: 'Desktop-First Design',
              description: 'Design for desktop, then adapt down',
              pros: ['Full feature set', 'Powerful desktop experience'],
              cons: ['Mobile compromises', 'Performance issues']
            },
            {
              id: 'o3',
              strategy: 'Breakpoint-Specific Design',
              description: 'Custom designs for each major breakpoint',
              pros: ['Optimized for each size', 'Best user experience'],
              cons: ['Resource intensive', 'Maintenance complexity']
            }
          ]
        },
        timeLimit: 170
      }
    ],
    advanced: [
      {
        id: 'd-a-1',
        title: 'Enterprise Design System Architecture',
        description: 'Architect a design system for multi-brand, multi-platform organization',
        type: 'drag-drop',
        content: {
          features: [
            { id: 'f1', name: 'Design Token Infrastructure', impact: 'high', effort: 'high' },
            { id: 'f2', name: 'Component API Design', impact: 'high', effort: 'high' },
            { id: 'f3', name: 'Brand Theming System', impact: 'high', effort: 'high' },
            { id: 'f4', name: 'Cross-platform Compatibility', impact: 'high', effort: 'high' },
            { id: 'f5', name: 'Documentation Platform', impact: 'medium', effort: 'medium' },
            { id: 'f6', name: 'Automated Testing Framework', impact: 'medium', effort: 'high' },
            { id: 'f7', name: 'Version Control Strategy', impact: 'high', effort: 'medium' }
          ]
        },
        timeLimit: 240
      },
      {
        id: 'd-a-2',
        title: 'Design Leadership Decision',
        description: 'Navigate conflicting design philosophies across global design teams',
        type: 'multiple-choice',
        content: {
          scenario: "Regional design teams have developed different design languages reflecting local preferences, but global brand consistency is suffering and development costs are increasing.",
          options: [
            { id: 'a', text: 'Enforce unified global design system', impact: 'Consistency and efficiency but cultural insensitivity' },
            { id: 'b', text: 'Maintain regional flexibility with shared foundations', impact: 'Cultural relevance but complexity and cost' },
            { id: 'c', text: 'Create modular system with cultural variants', impact: 'Balanced approach but architectural complexity' },
            { id: 'd', text: 'Data-driven approach: test regional preferences globally', impact: 'Evidence-based but time and resource intensive' }
          ]
        },
        timeLimit: 220
      },
      {
        id: 'd-a-3',
        title: 'Design Org Transformation',
        description: 'Lead organizational change from project-based to product-centered design',
        type: 'ranking',
        content: {
          stakeholders: [
            { id: 's1', name: 'Head of Design', role: 'Strategic vision and organizational change' },
            { id: 's2', name: 'Product Leadership', role: 'Business alignment and resource allocation' },
            { id: 's3', name: 'Design Managers', role: 'Team transformation and capability building' },
            { id: 's4', name: 'Senior Designers', role: 'Skill development and change advocacy' },
            { id: 's5', name: 'Engineering Leadership', role: 'Process integration and tooling' },
            { id: 's6', name: 'Executive Sponsor', role: 'Organizational support and budget approval' }
          ]
        },
        timeLimit: 200
      },
      {
        id: 'd-a-4',
        title: 'Design Innovation vs Consistency',
        description: 'Balance design innovation with system consistency in competitive market',
        type: 'scenario',
        content: {
          situation: "Competitors are launching innovative UI patterns that users love, but adopting them would break your established design system and require significant rework.",
          options: [
            {
              id: 'o1',
              strategy: 'Evolutionary Approach',
              description: 'Gradually evolve design system to incorporate innovations',
              pros: ['Maintains consistency', 'Manageable change', 'System integrity'],
              cons: ['Slow to market', 'Competitive disadvantage', 'User expectation gap']
            },
            {
              id: 'o2',
              strategy: 'Innovation Labs',
              description: 'Create experimental space for new patterns outside main system',
              pros: ['Fast innovation', 'Competitive response', 'Learning opportunity'],
              cons: ['System fragmentation', 'User confusion', 'Maintenance overhead']
            },
            {
              id: 'o3',
              strategy: 'System Redesign',
              description: 'Comprehensive redesign of design system and products',
              pros: ['Future-ready foundation', 'Competitive differentiation', 'Clean architecture'],
              cons: ['Massive resource investment', 'High risk', 'Long timeline']
            }
          ]
        },
        timeLimit: 300
      }
    ]
  }
};

export const getChallengesForSession = (category: string, difficulty: string): ChallengeData[] => {
  return challengeDatabase[category]?.[difficulty] || challengeDatabase.strategy.beginner;
};
