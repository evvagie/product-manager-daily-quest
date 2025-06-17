
interface TeamMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: 'message' | 'reaction' | 'alert';
}

interface KPIMetrics {
  revenue: { value: number; change: number };
  teamMood: { value: number; change: number };
  customerSat: { value: number; change: number };
  userGrowth: { value: number; change: number };
}

interface Consequence {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: string;
}

interface EnhancedChallengeData {
  id: string;
  title: string;
  description: string;
  type: 'time-pressure' | 'kpi-impact' | 'team-chat' | 'crisis-management' | 'multi-step' | 'drag-drop' | 'multiple-choice' | 'ranking' | 'scenario';
  timeLimit: number;
  content: {
    context: string;
    teamMessages?: TeamMessage[];
    currentKPIs?: KPIMetrics;
    options: Array<{
      id: string;
      text: string;
      description?: string;
      consequences: Consequence[];
      kpiImpact?: KPIMetrics;
      teamReaction?: TeamMessage[];
    }>;
    features?: any[];
    stakeholders?: any[];
  };
}

interface EnhancedChallengeSet {
  [key: string]: {
    [key: string]: EnhancedChallengeData[];
  };
}

export const enhancedChallengeDatabase: EnhancedChallengeSet = {
  strategy: {
    beginner: [
      {
        id: 's-b-1',
        title: 'Urgent Feature Request Crisis',
        description: 'A major client is threatening to leave unless you prioritize their feature request immediately',
        type: 'time-pressure',
        timeLimit: 60,
        content: {
          context: "Your biggest client (40% of revenue) just called. They need a specific reporting feature by next week or they're switching to a competitor. Your team is already at capacity working on the planned roadmap.",
          teamMessages: [
            { id: '1', sender: 'Sarah', avatar: 'SA', message: 'The client call just ended. They seemed really serious about leaving...', timestamp: '2 min ago', type: 'alert' },
            { id: '2', sender: 'Mike', avatar: 'MK', message: 'We can build it, but we\'d have to drop the mobile optimization', timestamp: '1 min ago', type: 'message' },
            { id: '3', sender: 'Lisa', avatar: 'LI', message: 'Other customers have been asking for mobile improvements for months', timestamp: '30s ago', type: 'message' }
          ],
          currentKPIs: {
            revenue: { value: 450, change: 5 },
            teamMood: { value: 7, change: 0 },
            customerSat: { value: 4.2, change: -0.2 },
            userGrowth: { value: 12, change: 3 }
          },
          options: [
            {
              id: 'a',
              text: 'Drop everything and build their feature',
              consequences: [
                { type: 'positive', title: 'Client Retained', description: 'Major client stays and increases contract', impact: 'Revenue +15%' },
                { type: 'negative', title: 'Team Burnout', description: 'Team works overtime, morale drops', impact: 'Team Mood -2' },
                { type: 'negative', title: 'Other Features Delayed', description: 'Mobile optimization pushed back 2 months', impact: 'Customer Sat -0.3' }
              ],
              kpiImpact: {
                revenue: { value: 520, change: 15 },
                teamMood: { value: 5, change: -2 },
                customerSat: { value: 3.9, change: -0.3 },
                userGrowth: { value: 8, change: -4 }
              }
            },
            {
              id: 'b',
              text: 'Negotiate a compromise timeline',
              consequences: [
                { type: 'neutral', title: 'Partial Solution', description: 'Build basic version in 2 weeks, full version later', impact: 'Balanced approach' },
                { type: 'positive', title: 'Team Stability', description: 'No major disruption to roadmap', impact: 'Team Mood +1' }
              ],
              kpiImpact: {
                revenue: { value: 430, change: -4 },
                teamMood: { value: 8, change: 1 },
                customerSat: { value: 4.0, change: -0.2 },
                userGrowth: { value: 10, change: -2 }
              }
            },
            {
              id: 'c',
              text: 'Stick to the roadmap and risk losing them',
              consequences: [
                { type: 'negative', title: 'Client Lost', description: 'Major client switches to competitor', impact: 'Revenue -40%' },
                { type: 'positive', title: 'Roadmap Integrity', description: 'Mobile optimization launches on time', impact: 'Customer Sat +0.5' }
              ],
              kpiImpact: {
                revenue: { value: 270, change: -40 },
                teamMood: { value: 6, change: -1 },
                customerSat: { value: 4.7, change: 0.5 },
                userGrowth: { value: 15, change: 3 }
              }
            }
          ]
        }
      },
      {
        id: 's-b-2',
        title: 'Team Capacity Planning',
        description: 'Your development team is overwhelmed. Choose how to manage the workload.',
        type: 'kpi-impact',
        timeLimit: 90,
        content: {
          context: "Your 5-person development team is working 60+ hour weeks. Bug reports are increasing, and two developers mentioned they're considering other jobs. You need to address this before it gets worse.",
          currentKPIs: {
            revenue: { value: 380, change: 2 },
            teamMood: { value: 4, change: -3 },
            customerSat: { value: 3.8, change: -0.4 },
            userGrowth: { value: 8, change: -2 }
          },
          options: [
            {
              id: 'a',
              text: 'Hire 2 more developers immediately',
              consequences: [
                { type: 'positive', title: 'Reduced Workload', description: 'Team stress decreases significantly', impact: 'Team Mood +3' },
                { type: 'negative', title: 'Higher Costs', description: 'Monthly expenses increase', impact: 'Revenue -8%' },
                { type: 'neutral', title: 'Onboarding Time', description: '2-3 months before new hires are fully productive', impact: 'Temporary productivity dip' }
              ],
              kpiImpact: {
                revenue: { value: 350, change: -8 },
                teamMood: { value: 7, change: 3 },
                customerSat: { value: 4.1, change: 0.3 },
                userGrowth: { value: 12, change: 4 }
              }
            },
            {
              id: 'b',
              text: 'Reduce feature scope and slow down development',
              consequences: [
                { type: 'positive', title: 'Sustainable Pace', description: 'Team can work normal hours', impact: 'Team Mood +2' },
                { type: 'negative', title: 'Slower Progress', description: 'Feature delivery slows by 30%', impact: 'Growth -5%' }
              ],
              kpiImpact: {
                revenue: { value: 380, change: 0 },
                teamMood: { value: 6, change: 2 },
                customerSat: { value: 3.9, change: 0.1 },
                userGrowth: { value: 3, change: -5 }
              }
            },
            {
              id: 'c',
              text: 'Outsource some development work',
              consequences: [
                { type: 'neutral', title: 'Mixed Results', description: 'Faster delivery but coordination challenges', impact: 'Complex trade-offs' },
                { type: 'negative', title: 'Quality Concerns', description: 'External team needs more oversight', impact: 'Customer Sat -0.2' }
              ],
              kpiImpact: {
                revenue: { value: 375, change: -1 },
                teamMood: { value: 5, change: 1 },
                customerSat: { value: 3.6, change: -0.2 },
                userGrowth: { value: 10, change: 2 }
              }
            }
          ]
        }
      },
      {
        id: 's-b-3',
        title: 'Competitive Response Strategy',
        description: 'A competitor just launched a feature similar to your main differentiator',
        type: 'team-chat',
        timeLimit: 120,
        content: {
          context: "Your main competitor just announced a feature that's 80% similar to your core differentiator. The tech press is calling it a 'game changer' and several prospects have delayed their decisions.",
          teamMessages: [
            { id: '1', sender: 'Marketing', avatar: 'MR', message: 'Three prospects just asked for calls to \"reassess their options\"', timestamp: '5 min ago', type: 'alert' },
            { id: '2', sender: 'Sales', avatar: 'SL', message: 'The competitor\'s pricing is 20% lower than ours', timestamp: '4 min ago', type: 'message' },
            { id: '3', sender: 'Engineering', avatar: 'EN', message: 'I looked at their demo. It\'s basic but functional', timestamp: '3 min ago', type: 'message' },
            { id: '4', sender: 'CEO', avatar: 'CE', message: 'Board meeting is tomorrow. They\'ll ask about our response plan', timestamp: '1 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Immediately build a better version of their feature',
              consequences: [
                { type: 'positive', title: 'Technical Superiority', description: 'Your version will be more advanced', impact: 'Competitive advantage' },
                { type: 'negative', title: 'Reactive Strategy', description: 'Following their lead instead of innovating', impact: 'Brand perception risk' }
              ]
            },
            {
              id: 'b',
              text: 'Focus on your unique strengths and differentiate further',
              consequences: [
                { type: 'positive', title: 'Clear Positioning', description: 'Strengthen your unique value proposition', impact: 'Brand differentiation' },
                { type: 'negative', title: 'Short-term Vulnerability', description: 'May lose some prospects in the near term', impact: 'Revenue risk' }
              ]
            },
            {
              id: 'c',
              text: 'Lower prices to compete directly',
              consequences: [
                { type: 'negative', title: 'Margin Compression', description: 'Profitability decreases significantly', impact: 'Revenue -15%' },
                { type: 'neutral', title: 'Market Share Protection', description: 'Maintain competitive pricing position', impact: 'User retention' }
              ]
            }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 's-i-1',
        title: 'Multi-Market Product Strategy',
        description: 'Design your international expansion strategy across 3 different markets',
        type: 'multi-step',
        timeLimit: 150,
        content: {
          context: "Your SaaS product is successful in the US. You have budget to expand to 3 international markets: UK (similar regulations), Germany (strict data laws), and Japan (different work culture). Each requires different adaptations.",
          options: [
            {
              id: 'a',
              text: 'Sequential expansion: UK → Germany → Japan',
              consequences: [
                { type: 'positive', title: 'Lower Risk', description: 'Learn from each market before the next', impact: 'Gradual growth' },
                { type: 'negative', title: 'Slow Market Entry', description: 'Competitors may enter first', impact: 'First-mover disadvantage' }
              ]
            },
            {
              id: 'b',
              text: 'Simultaneous expansion to all three markets',
              consequences: [
                { type: 'positive', title: 'Fast Market Entry', description: 'Capture market share quickly', impact: 'Rapid growth potential' },
                { type: 'negative', title: 'High Resource Demand', description: 'Team stretched across multiple fronts', impact: 'Execution risk' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on just UK and Germany first',
              consequences: [
                { type: 'neutral', title: 'Balanced Approach', description: 'Moderate risk and resource allocation', impact: 'Steady progress' },
                { type: 'negative', title: 'Miss Japan Opportunity', description: 'Competitors may dominate Japanese market', impact: 'Limited growth' }
              ]
            }
          ]
        }
      },
      {
        id: 's-i-2',
        title: 'Platform Architecture Decision',
        description: 'Choose your technical architecture for the next 5 years of growth',
        type: 'crisis-management',
        timeLimit: 180,
        content: {
          context: "Your current monolithic architecture is hitting limits. You're experiencing slowdowns during peak hours, and adding new features takes 3x longer than before. Your engineering team is split on the solution.",
          teamMessages: [
            { id: '1', sender: 'CTO', avatar: 'CT', message: 'We hit 95% CPU again during lunch hour. This is becoming critical.', timestamp: '10 min ago', type: 'alert' },
            { id: '2', sender: 'Lead Dev', avatar: 'LD', message: 'Microservices would solve this, but it\'s a 18-month project', timestamp: '8 min ago', type: 'message' },
            { id: '3', sender: 'DevOps', avatar: 'DO', message: 'We could scale vertically for now, buy us 12 more months', timestamp: '5 min ago', type: 'message' },
            { id: '4', sender: 'Product', avatar: 'PM', message: 'Sales is promising enterprise features we can\'t deliver with current arch', timestamp: '2 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Migrate to microservices architecture',
              consequences: [
                { type: 'positive', title: 'Future-Proof Solution', description: 'Unlimited scalability and team autonomy', impact: 'Long-term growth enabler' },
                { type: 'negative', title: 'Major Resource Investment', description: '18 months with reduced feature velocity', impact: 'Short-term growth impact' }
              ]
            },
            {
              id: 'b',
              text: 'Optimize current system and scale vertically',
              consequences: [
                { type: 'positive', title: 'Quick Relief', description: 'Performance issues solved in 4-6 weeks', impact: 'Immediate stability' },
                { type: 'negative', title: 'Technical Debt', description: 'Problem will return larger in 12-18 months', impact: 'Future scalability limits' }
              ]
            },
            {
              id: 'c',
              text: 'Hybrid approach: extract critical services first',
              consequences: [
                { type: 'neutral', title: 'Balanced Transition', description: 'Gradual migration reducing risk', impact: 'Moderate improvement' },
                { type: 'negative', title: 'Complexity', description: 'Managing both architectures simultaneously', impact: 'Team cognitive load' }
              ]
            }
          ]
        }
      },
      {
        id: 's-i-3',
        title: 'Product-Market Fit Pivot',
        description: 'Your metrics suggest you need to pivot. Choose your new direction.',
        type: 'kpi-impact',
        timeLimit: 160,
        content: {
          context: "After 18 months, user growth has plateaued at 10K users, churn is 15% monthly, and revenue per user is declining. User feedback suggests the core value proposition isn't compelling enough.",
          currentKPIs: {
            revenue: { value: 180, change: -5 },
            teamMood: { value: 5, change: -2 },
            customerSat: { value: 3.2, change: -0.8 },
            userGrowth: { value: -2, change: -8 }
          },
          options: [
            {
              id: 'a',
              text: 'Pivot to serve enterprise customers instead of SMBs',
              consequences: [
                { type: 'positive', title: 'Higher Revenue Per User', description: 'Enterprise deals are 10x larger', impact: 'Revenue potential +200%' },
                { type: 'negative', title: 'Complete Product Rebuild', description: 'Need enterprise-grade features', impact: '12-month development cycle' }
              ],
              kpiImpact: {
                revenue: { value: 120, change: -33 },
                teamMood: { value: 6, change: 1 },
                customerSat: { value: 2.8, change: -0.4 },
                userGrowth: { value: -5, change: -3 }
              }
            },
            {
              id: 'b',
              text: 'Double down on current market with better positioning',
              consequences: [
                { type: 'neutral', title: 'Incremental Improvement', description: 'Refine messaging and features', impact: 'Modest growth potential' },
                { type: 'negative', title: 'Fundamental Issues Remain', description: 'May not solve core PMF problems', impact: 'Continued struggles' }
              ],
              kpiImpact: {
                revenue: { value: 190, change: 5 },
                teamMood: { value: 4, change: -1 },
                customerSat: { value: 3.5, change: 0.3 },
                userGrowth: { value: 2, change: 4 }
              }
            }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 's-a-1',
        title: 'Global Platform Governance Crisis',
        description: 'Navigate regulatory compliance across multiple jurisdictions while maintaining product coherence',
        type: 'crisis-management',
        timeLimit: 240,
        content: {
          context: "Your platform operates in 15 countries. New EU regulations conflict with US requirements, China is demanding local data storage, and Brazil is threatening to ban your service over content moderation policies. Each solution affects other markets.",
          teamMessages: [
            { id: '1', sender: 'Legal EU', avatar: 'LE', message: 'GDPR enforcement notice received. 30 days to comply or €20M fine', timestamp: '1 hour ago', type: 'alert' },
            { id: '2', sender: 'Legal US', avatar: 'LU', message: 'US compliance requires data practices that violate EU requirements', timestamp: '45 min ago', type: 'alert' },
            { id: '3', sender: 'China Lead', avatar: 'CL', message: 'Government wants all Chinese user data on local servers by Q1', timestamp: '30 min ago', type: 'message' },
            { id: '4', sender: 'Brazil Team', avatar: 'BR', message: 'Congress hearing scheduled. They want content algorithm transparency', timestamp: '15 min ago', type: 'alert' },
            { id: '5', sender: 'CEO', avatar: 'CE', message: 'Board emergency meeting in 2 hours. Need a coherent strategy.', timestamp: '5 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Create region-specific platform variants',
              consequences: [
                { type: 'positive', title: 'Regulatory Compliance', description: 'Each region gets compliant version', impact: 'Legal risk mitigation' },
                { type: 'negative', title: 'Platform Fragmentation', description: 'Massive engineering and maintenance burden', impact: 'Development cost +300%' }
              ]
            },
            {
              id: 'b',
              text: 'Exit problematic markets and focus on core regions',
              consequences: [
                { type: 'positive', title: 'Operational Simplicity', description: 'Unified platform and compliance strategy', impact: 'Reduced complexity' },
                { type: 'negative', title: 'Revenue Loss', description: 'Lose 40% of global user base', impact: 'Revenue -40%' }
              ]
            },
            {
              id: 'c',
              text: 'Architect federated system with local compliance modules',
              consequences: [
                { type: 'neutral', title: 'Technical Complexity', description: 'Core platform with compliance adapters', impact: '24-month engineering project' },
                { type: 'positive', title: 'Scalable Solution', description: 'Framework for future regulatory changes', impact: 'Long-term flexibility' }
              ]
            }
          ]
        }
      },
      {
        id: 's-a-2',
        title: 'AI Integration Strategic Decision',
        description: 'Your board wants aggressive AI integration, but your users value human oversight',
        type: 'multi-step',
        timeLimit: 280,
        content: {
          context: "The board sees competitors gaining advantage with AI features and wants you to integrate AI across all product areas within 6 months. However, your user research shows 67% prefer human oversight for critical decisions, and your enterprise clients have strict AI governance requirements.",
          teamMessages: [
            { id: '1', sender: 'Board Chair', avatar: 'BC', message: 'Competitors\' AI features are in every tech publication. We need to catch up.', timestamp: '2 hours ago', type: 'message' },
            { id: '2', sender: 'Research Lead', avatar: 'RL', message: 'Latest user interviews show strong preference for human-AI collaboration', timestamp: '1 hour ago', type: 'message' },
            { id: '3', sender: 'Enterprise Sales', avatar: 'ES', message: 'Fortune 500 clients asking about AI governance and explainability', timestamp: '45 min ago', type: 'message' },
            { id: '4', sender: 'Engineering', avatar: 'ENG', message: 'Building responsible AI infrastructure will take 12+ months', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Rapid AI deployment across all features',
              consequences: [
                { type: 'positive', title: 'Competitive Positioning', description: 'Quick market response and board satisfaction', impact: 'Short-term competitive advantage' },
                { type: 'negative', title: 'User Trust Risk', description: 'Potential backlash from users preferring human oversight', impact: 'Customer satisfaction -25%' }
              ]
            },
            {
              id: 'b',
              text: 'Human-AI collaboration approach with governance framework',
              consequences: [
                { type: 'positive', title: 'User-Centric Design', description: 'Aligns with user preferences and enterprise requirements', impact: 'Customer trust +15%' },
                { type: 'negative', title: 'Development Complexity', description: 'Longer timeline and higher engineering investment', impact: '18-month development cycle' }
              ]
            },
            {
              id: 'c',
              text: 'AI-first for new features, human oversight for existing',
              consequences: [
                { type: 'neutral', title: 'Hybrid Strategy', description: 'Balance innovation with user comfort', impact: 'Moderate progress' },
                { type: 'negative', title: 'Product Inconsistency', description: 'Different UX patterns across features', impact: 'User experience fragmentation' }
              ]
            }
          ]
        }
      },
      {
        id: 's-a-3',
        title: 'Ecosystem Platform Strategy',
        description: 'Transform from product to platform while managing existing customer relationships',
        type: 'time-pressure',
        timeLimit: 300,
        content: {
          context: "Your product's success has attracted third-party developers wanting to build on your platform. This could 10x your growth, but requires opening APIs, sharing revenue, and potentially competing with your own features. Major customers are asking for this, and competitors are already building platforms.",
          teamMessages: [
            { id: '1', sender: 'Strategic Partner', avatar: 'SP', message: 'Microsoft wants to discuss platform partnership. Meeting scheduled for tomorrow.', timestamp: '3 hours ago', type: 'alert' },
            { id: '2', sender: 'Top Customer', avatar: 'TC', message: 'When can we access APIs? Our internal team wants to build custom integrations.', timestamp: '2 hours ago', type: 'message' },
            { id: '3', sender: 'Competitor Watch', avatar: 'CW', message: 'Rival just announced their platform with 50 launch partners', timestamp: '1 hour ago', type: 'alert' },
            { id: '4', sender: 'Product Team', avatar: 'PT', message: 'Platform architecture needs 12-month rebuild. APIs aren\'t ready for external use.', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Full platform transformation with extensive API suite',
              consequences: [
                { type: 'positive', title: 'Ecosystem Growth', description: 'Potential for exponential growth through partners', impact: 'Revenue potential +500%' },
                { type: 'negative', title: 'Core Product Risk', description: 'Resources shifted from core features', impact: 'Customer satisfaction risk' }
              ]
            },
            {
              id: 'b',
              text: 'Limited API release for strategic partners only',
              consequences: [
                { type: 'neutral', title: 'Controlled Expansion', description: 'Test platform concept with low risk', impact: 'Gradual ecosystem development' },
                { type: 'negative', title: 'Competitive Disadvantage', description: 'Slower than competitors\' platform growth', impact: 'Market share risk' }
              ]
            },
            {
              id: 'c',
              text: 'Acquisition-based platform strategy',
              consequences: [
                { type: 'positive', title: 'Rapid Capability Addition', description: 'Buy existing solutions instead of building', impact: 'Fast platform expansion' },
                { type: 'negative', title: 'Integration Challenges', description: 'Cultural and technical integration complexity', impact: 'Execution risk' }
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
        id: 'r-b-1',
        title: 'User Interview Crisis',
        description: 'Your scheduled user interviews are being cancelled last minute',
        type: 'time-pressure',
        timeLimit: 90,
        content: {
          context: "Today is Monday and you need user insights for Friday's product review. 6 out of 8 scheduled interviews were just cancelled, and your backup participants aren't responding. The product team is counting on this research.",
          teamMessages: [
            { id: '1', sender: 'Recruiter', avatar: 'RC', message: '3 more cancellations just came in. Only 2 interviews left.', timestamp: '10 min ago', type: 'alert' },
            { id: '2', sender: 'Product Manager', avatar: 'PM', message: 'Friday presentation to executives depends on these insights', timestamp: '8 min ago', type: 'message' },
            { id: '3', sender: 'Designer', avatar: 'DS', message: 'We could use existing support tickets for insights?', timestamp: '5 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Run guerrilla research in coffee shops',
              consequences: [
                { type: 'positive', title: 'Quick Data Collection', description: 'Get insights within 24 hours', impact: 'Fast turnaround' },
                { type: 'negative', title: 'Sample Quality Risk', description: 'Random participants may not match target users', impact: 'Data reliability concerns' }
              ]
            },
            {
              id: 'b',
              text: 'Analyze support tickets and user feedback',
              consequences: [
                { type: 'positive', title: 'Existing Data Utilization', description: 'Rich qualitative data already available', impact: 'No additional recruitment needed' },
                { type: 'negative', title: 'Biased Sample', description: 'Only includes users with problems', impact: 'Skewed insights' }
              ]
            },
            {
              id: 'c',
              text: 'Request deadline extension for proper research',
              consequences: [
                { type: 'positive', title: 'Research Quality', description: 'Proper methodology and representative sample', impact: 'Reliable insights' },
                { type: 'negative', title: 'Delayed Decision', description: 'Product timeline pushed back', impact: 'Business impact' }
              ]
            }
          ]
        }
      },
      {
        id: 'r-b-2',
        title: 'Survey Response Rate Crisis',
        description: 'Your user survey has only 3% response rate with 2 days left',
        type: 'kpi-impact',
        timeLimit: 75,
        content: {
          context: "You sent a survey to 10,000 users about feature priorities. After 5 days, only 300 people responded (3%). You need statistical significance and the deadline is in 2 days.",
          currentKPIs: {
            revenue: { value: 420, change: 0 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 4.1, change: 0 },
            userGrowth: { value: 12, change: 0 }
          },
          options: [
            {
              id: 'a',
              text: 'Offer $10 gift cards to increase responses',
              consequences: [
                { type: 'positive', title: 'Higher Response Rate', description: 'Incentives typically boost responses to 15-20%', impact: 'Better data quality' },
                { type: 'negative', title: 'Budget Impact', description: '$2000 unplanned expense', impact: 'Research budget -25%' }
              ],
              kpiImpact: {
                revenue: { value: 418, change: -0.5 },
                teamMood: { value: 7, change: 1 },
                customerSat: { value: 4.1, change: 0 },
                userGrowth: { value: 12, change: 0 }
              }
            },
            {
              id: 'b',
              text: 'Shorten survey and resend to different user segment',
              consequences: [
                { type: 'neutral', title: 'Fresh Approach', description: 'Different users, simpler questions', impact: 'Moderate response improvement' },
                { type: 'negative', title: 'Less Detailed Data', description: 'Shorter survey means fewer insights', impact: 'Limited depth' }
              ],
              kpiImpact: {
                revenue: { value: 420, change: 0 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 4.1, change: 0 },
                userGrowth: { value: 12, change: 0 }
              }
            },
            {
              id: 'c',
              text: 'Proceed with current responses and note limitations',
              consequences: [
                { type: 'negative', title: 'Statistical Limitations', description: 'Results may not be representative', impact: 'Data reliability concerns' },
                { type: 'positive', title: 'On Schedule', description: 'No delay to project timeline', impact: 'Timeline maintained' }
              ],
              kpiImpact: {
                revenue: { value: 420, change: 0 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.1, change: 0 },
                userGrowth: { value: 12, change: 0 }
              }
            }
          ]
        }
      },
      {
        id: 'r-b-3',
        title: 'Conflicting User Feedback',
        description: 'Power users want advanced features, but casual users find the product too complex',
        type: 'team-chat',
        timeLimit: 105,
        content: {
          context: "Your research shows a clear split: power users (20% of base, 60% of revenue) want more advanced features, while casual users (80% of base, 40% of revenue) are already overwhelmed and asking for simplification.",
          teamMessages: [
            { id: '1', sender: 'Research', avatar: 'RE', message: 'Power user interviews: \"Need more automation and advanced workflows\"', timestamp: '1 hour ago', type: 'message' },
            { id: '2', sender: 'Research', avatar: 'RE', message: 'Casual user interviews: \"Too many buttons, can\'t find basic features\"', timestamp: '45 min ago', type: 'message' },
            { id: '3', sender: 'Product', avatar: 'PM', message: 'Engineering bandwidth can only support one direction this quarter', timestamp: '30 min ago', type: 'message' },
            { id: '4', sender: 'Sales', avatar: 'SL', message: 'Enterprise prospects (power users) are our biggest opportunity', timestamp: '15 min ago', type: 'message' },
            { id: '5', sender: 'Support', avatar: 'SP', message: 'Most support tickets are from casual users asking \"how do I...\"', timestamp: '5 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Focus on power user advanced features',
              consequences: [
                { type: 'positive', title: 'Revenue Growth', description: 'Higher-value customers get what they need', impact: 'Revenue +15%' },
                { type: 'negative', title: 'Casual User Churn', description: 'Product becomes more complex for majority', impact: 'User satisfaction -20%' }
              ]
            },
            {
              id: 'b',
              text: 'Simplify for casual users',
              consequences: [
                { type: 'positive', title: 'User Adoption', description: 'Easier onboarding and broader appeal', impact: 'User growth +25%' },
                { type: 'negative', title: 'Power User Risk', description: 'Advanced users may switch to competitors', impact: 'Revenue risk -10%' }
              ]
            },
            {
              id: 'c',
              text: 'Create user tiers with different interfaces',
              consequences: [
                { type: 'neutral', title: 'Compromise Solution', description: 'Basic and advanced modes', impact: 'Moderate satisfaction for both' },
                { type: 'negative', title: 'Development Complexity', description: 'Maintaining two UX paths', impact: 'Engineering overhead +40%' }
              ]
            }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 'r-i-1',
        title: 'Research Methodology Validation Crisis',
        description: 'Your research methodology is being questioned by stakeholders',
        type: 'crisis-management',
        timeLimit: 140,
        content: {
          context: "You presented research showing users want Feature A, but the CEO's friend (who happens to be a user) told them users actually want Feature B. Now stakeholders are questioning your entire methodology and want you to redo the research.",
          teamMessages: [
            { id: '1', sender: 'CEO', avatar: 'CEO', message: 'My friend John says our users definitely want Feature B. How did your research miss this?', timestamp: '2 hours ago', type: 'alert' },
            { id: '2', sender: 'VP Product', avatar: 'VP', message: 'Board is asking if our research process is rigorous enough', timestamp: '1.5 hours ago', type: 'message' },
            { id: '3', sender: 'Data Analyst', avatar: 'DA', message: 'I can run additional analytics to validate the findings', timestamp: '1 hour ago', type: 'message' },
            { id: '4', sender: 'Designer', avatar: 'UX', message: 'Usability tests also supported Feature A preference', timestamp: '45 min ago', type: 'message' },
            { id: '5', sender: 'Engineering', avatar: 'ENG', message: 'We need to know which feature to build. Timeline is already tight.', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Defend your methodology with additional evidence',
              consequences: [
                { type: 'positive', title: 'Research Integrity', description: 'Stand by scientific approach and methodology', impact: 'Long-term credibility' },
                { type: 'negative', title: 'Political Risk', description: 'May create tension with CEO and stakeholders', impact: 'Relationship strain' }
              ]
            },
            {
              id: 'b',
              text: 'Conduct additional research including anecdotal feedback',
              consequences: [
                { type: 'neutral', title: 'Comprehensive Approach', description: 'Incorporate all types of feedback', impact: 'Broader perspective' },
                { type: 'negative', title: 'Timeline Delay', description: 'Product development delayed by 4-6 weeks', impact: 'Schedule impact' }
              ]
            },
            {
              id: 'c',
              text: 'Propose testing both features with A/B test',
              consequences: [
                { type: 'positive', title: 'Data-Driven Resolution', description: 'Let user behavior decide', impact: 'Objective decision making' },
                { type: 'negative', title: 'Resource Split', description: 'Engineering effort divided between both features', impact: 'Development complexity' }
              ]
            }
          ]
        }
      },
      {
        id: 'r-i-2',
        title: 'Ethical Research Dilemma',
        description: 'Research participants are sharing concerning personal information',
        type: 'multi-step',
        timeLimit: 160,
        content: {
          context: "During interviews about mental health app features, participants are sharing traumatic personal experiences and asking for help. You're not qualified to provide mental health support, but cutting them off seems callous. You need these insights but participant wellbeing comes first.",
          options: [
            {
              id: 'a',
              text: 'Continue interviews but establish clear boundaries',
              consequences: [
                { type: 'positive', title: 'Research Completion', description: 'Gather needed insights for product development', impact: 'Product roadmap clarity' },
                { type: 'negative', title: 'Participant Vulnerability', description: 'Risk of re-traumatizing participants', impact: 'Ethical concerns' }
              ]
            },
            {
              id: 'b',
              text: 'Pause research and bring in mental health professional',
              consequences: [
                { type: 'positive', title: 'Participant Safety', description: 'Ensure proper support for vulnerable users', impact: 'Ethical research practice' },
                { type: 'negative', title: 'Timeline Impact', description: 'Research delayed while finding qualified moderator', impact: '4-week delay' }
              ]
            },
            {
              id: 'c',
              text: 'Redesign study with pre-screening and support resources',
              consequences: [
                { type: 'neutral', title: 'Balanced Approach', description: 'Safer methodology with support structure', impact: 'Moderate timeline impact' },
                { type: 'positive', title: 'Best Practice Development', description: 'Create framework for future sensitive research', impact: 'Long-term process improvement' }
              ]
            }
          ]
        }
      },
      {
        id: 'r-i-3',
        title: 'Cross-Cultural Research Challenge',
        description: 'Your research methods work in the US but fail in international markets',
        type: 'kpi-impact',
        timeLimit: 175,
        content: {
          context: "You're expanding to Japan and Germany. Your standard user interviews and surveys are getting very different results than expected, and local teams say your research approach doesn't fit cultural norms. You need insights but current methods aren't working.",
          currentKPIs: {
            revenue: { value: 380, change: 2 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 3.9, change: -0.3 },
            userGrowth: { value: 8, change: -5 }
          },
          options: [
            {
              id: 'a',
              text: 'Hire local research teams with cultural expertise',
              consequences: [
                { type: 'positive', title: 'Cultural Appropriateness', description: 'Research methods fit local norms', impact: 'Better data quality' },
                { type: 'negative', title: 'Higher Costs', description: 'Local teams and coordination overhead', impact: 'Research budget +150%' }
              ],
              kpiImpact: {
                revenue: { value: 375, change: -1 },
                teamMood: { value: 7, change: 1 },
                customerSat: { value: 4.2, change: 0.3 },
                userGrowth: { value: 12, change: 4 }
              }
            },
            {
              id: 'b',
              text: 'Adapt existing methods with local guidance',
              consequences: [
                { type: 'neutral', title: 'Hybrid Approach', description: 'Modify US methods for local context', impact: 'Moderate improvement' },
                { type: 'negative', title: 'Compromise Quality', description: 'May miss cultural nuances', impact: 'Partial insights' }
              ],
              kpiImpact: {
                revenue: { value: 380, change: 0 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 4.0, change: 0.1 },
                userGrowth: { value: 10, change: 2 }
              }
            },
            {
              id: 'c',
              text: 'Focus on behavioral data and reduce qualitative research',
              consequences: [
                { type: 'positive', title: 'Universal Data', description: 'Analytics work across cultures', impact: 'Consistent methodology' },
                { type: 'negative', title: 'Lost Context', description: 'Miss cultural insights and motivations', impact: 'Surface-level understanding' }
              ],
              kpiImpact: {
                revenue: { value: 380, change: 0 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 3.7, change: -0.2 },
                userGrowth: { value: 6, change: -2 }
              }
            }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 'r-a-1',
        title: 'Research Program ROI Challenge',
        description: 'Leadership questions the value of your research program amid budget cuts',
        type: 'crisis-management',
        timeLimit: 220,
        content: {
          context: "The CFO wants to cut research budget by 60%, saying 'we can just look at the data and ask sales what customers want.' You need to demonstrate research ROI while several major research initiatives are in progress.",
          teamMessages: [
            { id: '1', sender: 'CFO', avatar: 'CFO', message: 'Research ROI is unclear. Sales talks to customers daily - isn\'t that enough?', timestamp: '3 hours ago', type: 'alert' },
            { id: '2', sender: 'Sales Director', avatar: 'SD', message: 'Customers tell us what they want. Not sure why we need formal research.', timestamp: '2 hours ago', type: 'message' },
            { id: '3', sender: 'Product Team', avatar: 'PT', message: 'Last quarter\'s research prevented us from building the wrong feature entirely', timestamp: '1.5 hours ago', type: 'message' },
            { id: '4', sender: 'CEO', avatar: 'CEO', message: 'Need concrete examples of research impact on revenue by Friday', timestamp: '1 hour ago', type: 'alert' },
            { id: '5', sender: 'Designer', avatar: 'UX', message: 'User testing saved us from a 40% conversion drop last month', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Build comprehensive ROI case with specific examples',
              consequences: [
                { type: 'positive', title: 'Data-Driven Defense', description: 'Quantify research impact on business metrics', impact: 'Strong business case' },
                { type: 'negative', title: 'Time Investment', description: 'Spend 2 weeks building case instead of researching', impact: 'Current projects delayed' }
              ]
            },
            {
              id: 'b',
              text: 'Propose embedded research model with product teams',
              consequences: [
                { type: 'positive', title: 'Direct Impact Visibility', description: 'Research directly tied to product decisions', impact: 'Clear value demonstration' },
                { type: 'negative', title: 'Strategic Research Loss', description: 'Less time for long-term strategic insights', impact: 'Short-term focus risk' }
              ]
            },
            {
              id: 'c',
              text: 'Partner with sales to enhance customer insights',
              consequences: [
                { type: 'neutral', title: 'Collaborative Approach', description: 'Combine research rigor with sales relationships', impact: 'Unified customer understanding' },
                { type: 'negative', title: 'Methodology Compromise', description: 'Sales feedback may be biased toward vocal customers', impact: 'Data quality concerns' }
              ]
            }
          ]
        }
      },
      {
        id: 'r-a-2',
        title: 'AI vs Human Research Decision',
        description: 'Leadership wants to replace human researchers with AI-driven insights',
        type: 'time-pressure',
        timeLimit: 260,
        content: {
          context: "The board is excited about AI tools that can analyze customer feedback, conduct surveys, and even run interviews. They want to pilot replacing 70% of human research with AI to reduce costs and increase speed. You see both opportunities and risks.",
          teamMessages: [
            { id: '1', sender: 'Board Member', avatar: 'BM', message: 'AI can analyze 10,000 reviews in minutes. Why do we need 3-week research cycles?', timestamp: '4 hours ago', type: 'message' },
            { id: '2', sender: 'CTO', avatar: 'CTO', message: 'New AI research platform can run 24/7 user interviews via chatbot', timestamp: '3 hours ago', type: 'message' },
            { id: '3', sender: 'Research Team', avatar: 'RT', message: 'AI misses emotional context and can\'t probe deeper into unexpected responses', timestamp: '2 hours ago', type: 'message' },
            { id: '4', sender: 'Product VP', avatar: 'PVP', message: 'If AI gets us 80% of insights in 10% of time, worth considering', timestamp: '1 hour ago', type: 'message' },
            { id: '5', sender: 'CEO', avatar: 'CEO', message: 'Need decision by end of week. Pilot starting next month.', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Embrace AI-first research with human oversight',
              consequences: [
                { type: 'positive', title: 'Speed and Scale', description: 'Research insights 10x faster and broader reach', impact: 'Competitive research advantage' },
                { type: 'negative', title: 'Nuance Loss', description: 'May miss subtle insights that require human intuition', impact: 'Quality concerns' }
              ]
            },
            {
              id: 'b',
              text: 'Propose hybrid model with AI augmenting human research',
              consequences: [
                { type: 'neutral', title: 'Balanced Approach', description: 'Use AI for initial analysis, humans for deeper insights', impact: 'Moderate efficiency gains' },
                { type: 'positive', title: 'Quality Preservation', description: 'Maintain research rigor while gaining speed', impact: 'Best of both worlds' }
              ]
            },
            {
              id: 'c',
              text: 'Resist AI replacement and focus on human research value',
              consequences: [
                { type: 'positive', title: 'Research Quality', description: 'Maintain depth and contextual understanding', impact: 'Superior insights' },
                { type: 'negative', title: 'Competitive Disadvantage', description: 'Slower research cycles versus AI-enabled competitors', impact: 'Speed to market risk' }
              ]
            }
          ]
        }
      },
      {
        id: 'r-a-3',
        title: 'Global Research Ethics Crisis',
        description: 'Navigate conflicting research ethics requirements across international markets',
        type: 'multi-step',
        timeLimit: 290,
        content: {
          context: "Your global research program faces ethical conflicts: EU requires explicit consent for all data use, US allows broader research under IRB approval, China requires government oversight of user research, and your startup culture values rapid iteration. Each market's ethics requirements conflicts with others.",
          options: [
            {
              id: 'a',
              text: 'Adopt strictest global standard (EU GDPR) everywhere',
              consequences: [
                { type: 'positive', title: 'Universal Compliance', description: 'One ethical standard across all markets', impact: 'Simplified governance' },
                { type: 'negative', title: 'Research Limitations', description: 'Severely restricted research capabilities in permissive markets', impact: 'Innovation speed -50%' }
              ]
            },
            {
              id: 'b',
              text: 'Localized ethics approach per market requirements',
              consequences: [
                { type: 'positive', title: 'Market Optimization', description: 'Maximum research capability in each region', impact: 'Optimal local insights' },
                { type: 'negative', title: 'Complexity Management', description: 'Different standards create operational overhead', impact: 'Governance complexity +200%' }
              ]
            },
            {
              id: 'c',
              text: 'Develop tiered research program based on sensitivity levels',
              consequences: [
                { type: 'neutral', title: 'Risk-Based Approach', description: 'Different protocols for different research types', impact: 'Balanced flexibility' },
                { type: 'negative', title: 'Process Complexity', description: 'Multiple workflows and approval processes', impact: 'Operational overhead' }
              ]
            }
          ]
        }
      }
    ]
  },
  analytics: {
    beginner: [
      {
        id: 'a-b-1',
        title: 'Metrics Dashboard Emergency',
        description: 'Your main analytics dashboard is down during a critical product launch',
        type: 'time-pressure',
        timeLimit: 90,
        content: {
          context: "It's launch day for your biggest feature of the year. The marketing campaign is live, and the CEO is asking for real-time metrics every hour. Your main dashboard just crashed and won't be back online for 6 hours.",
          teamMessages: [
            { id: '1', sender: 'DevOps', avatar: 'DO', message: 'Analytics server crashed. Database corruption detected. ETA 6 hours.', timestamp: '10 min ago', type: 'alert' },
            { id: '2', sender: 'CEO', avatar: 'CEO', message: 'Need hourly updates on launch metrics. Board is watching closely.', timestamp: '8 min ago', type: 'alert' },
            { id: '3', sender: 'Marketing', avatar: 'MR', message: 'Campaign spent $50k in first hour. Need to know if it\'s working.', timestamp: '5 min ago', type: 'message' },
            { id: '4', sender: 'Product', avatar: 'PM', message: 'Engineering needs usage data to optimize performance', timestamp: '2 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Set up manual tracking with spreadsheets',
              consequences: [
                { type: 'positive', title: 'Immediate Solution', description: 'Get basic metrics within 30 minutes', impact: 'Quick stakeholder updates' },
                { type: 'negative', title: 'Manual Overhead', description: 'Team spends day updating spreadsheets instead of analyzing', impact: 'Productivity loss' }
              ]
            },
            {
              id: 'b',
              text: 'Use backup analytics tools (Google Analytics, etc.)',
              consequences: [
                { type: 'positive', title: 'Automated Tracking', description: 'Basic metrics available immediately', impact: 'Continuous monitoring' },
                { type: 'negative', title: 'Limited Metrics', description: 'Missing custom events and business-specific tracking', impact: 'Incomplete picture' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on server logs and raw data analysis',
              consequences: [
                { type: 'neutral', title: 'Detailed Data', description: 'Complete information but requires technical analysis', impact: 'Accurate but delayed insights' },
                { type: 'negative', title: 'Technical Barrier', description: 'Only engineers can interpret the data', impact: 'Communication challenges' }
              ]
            }
          ]
        }
      },
      {
        id: 'a-b-2',
        title: 'A/B Test Interpretation Crisis',
        description: 'Your A/B test results are confusing and stakeholders want immediate answers',
        type: 'kpi-impact',
        timeLimit: 105,
        content: {
          context: "Your A/B test shows Version B has 20% higher clicks but 15% lower conversions. Version A has better user retention but lower immediate engagement. The marketing team says clicks matter most, sales says conversions matter most.",
          currentKPIs: {
            revenue: { value: 420, change: 0 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 4.1, change: 0 },
            userGrowth: { value: 12, change: 0 }
          },
          teamMessages: [
            { id: '1', sender: 'Marketing', avatar: 'MR', message: 'Version B clearly wins - 20% more engagement!', timestamp: '30 min ago', type: 'message' },
            { id: '2', sender: 'Sales', avatar: 'SL', message: 'Conversions are revenue. Version A is obviously better.', timestamp: '25 min ago', type: 'message' },
            { id: '3', sender: 'Product', avatar: 'PM', message: 'User retention suggests Version A creates better long-term value', timestamp: '20 min ago', type: 'message' },
            { id: '4', sender: 'CEO', avatar: 'CEO', message: 'Need decision today. Can\'t keep running both versions.', timestamp: '10 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Choose Version B for higher engagement',
              consequences: [
                { type: 'positive', title: 'Increased Traffic', description: 'More users engage with content and features', impact: 'User activity +20%' },
                { type: 'negative', title: 'Conversion Drop', description: 'Fewer users complete desired actions', impact: 'Revenue -15%' }
              ],
              kpiImpact: {
                revenue: { value: 357, change: -15 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.3, change: 0.2 },
                userGrowth: { value: 18, change: 6 }
              }
            },
            {
              id: 'b',
              text: 'Choose Version A for higher conversions',
              consequences: [
                { type: 'positive', title: 'Revenue Optimization', description: 'Better conversion rate drives more sales', impact: 'Revenue stability' },
                { type: 'negative', title: 'Engagement Concerns', description: 'Lower initial engagement may limit growth', impact: 'User acquisition challenges' }
              ],
              kpiImpact: {
                revenue: { value: 420, change: 0 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 4.1, change: 0 },
                userGrowth: { value: 8, change: -4 }
              }
            },
            {
              id: 'c',
              text: 'Run longer test to understand the trade-off better',
              consequences: [
                { type: 'positive', title: 'Better Understanding', description: 'More data reveals true long-term impact', impact: 'Informed decision making' },
                { type: 'negative', title: 'Decision Delay', description: 'Business waits while competitors may gain advantage', impact: 'Opportunity cost' }
              ],
              kpiImpact: {
                revenue: { value: 420, change: 0 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.1, change: 0 },
                userGrowth: { value: 12, change: 0 }
              }
            }
          ]
        }
      },
      {
        id: 'a-b-3',
        title: 'Data Privacy vs Analytics Crisis',
        description: 'New privacy regulations are blocking your key analytics tracking',
        type: 'team-chat',
        timeLimit: 85,
        content: {
          context: "iOS 14.5 update and new privacy regulations have blocked 60% of your analytics tracking. You can't measure user journeys, attribution is broken, and your conversion funnel analysis is now incomplete.",
          teamMessages: [
            { id: '1', sender: 'Analytics Lead', avatar: 'AL', message: 'Conversion tracking dropped 60% overnight after iOS update', timestamp: '2 hours ago', type: 'alert' },
            { id: '2', sender: 'Marketing', avatar: 'MR', message: 'Can\'t measure campaign ROI anymore. Budget allocation is blind.', timestamp: '1.5 hours ago', type: 'alert' },
            { id: '3', sender: 'Legal', avatar: 'LG', message: 'Privacy compliance is mandatory. Cannot revert to old tracking.', timestamp: '1 hour ago', type: 'message' },
            { id: '4', sender: 'Product', avatar: 'PM', message: 'User behavior analysis is now incomplete. Hard to optimize features.', timestamp: '45 min ago', type: 'message' },
            { id: '5', sender: 'CEO', avatar: 'CEO', message: 'Need alternative analytics strategy by end of week', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Implement first-party data collection strategy',
              consequences: [
                { type: 'positive', title: 'Privacy Compliant', description: 'User consent-based tracking respects privacy', impact: 'Regulatory compliance' },
                { type: 'negative', title: 'Reduced Data Volume', description: 'Only opted-in users provide data', impact: 'Limited analytics scope' }
              ]
            },
            {
              id: 'b',
              text: 'Focus on server-side analytics and user surveys',
              consequences: [
                { type: 'positive', title: 'Complete Control', description: 'Own data collection and analysis pipeline', impact: 'Data sovereignty' },
                { type: 'negative', title: 'Implementation Complexity', description: 'Requires significant technical investment', impact: '3-month development timeline' }
              ]
            },
            {
              id: 'c',
              text: 'Use privacy-focused analytics tools',
              consequences: [
                { type: 'neutral', title: 'Quick Solution', description: 'Third-party tools designed for privacy era', impact: 'Faster implementation' },
                { type: 'negative', title: 'Feature Limitations', description: 'Less detailed tracking than previous setup', impact: 'Reduced analytical depth' }
              ]
            }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 'a-i-1',
        title: 'Attribution Model Crisis',
        description: 'Marketing and Product teams disagree on which attribution model to use',
        type: 'crisis-management',
        timeLimit: 150,
        content: {
          context: "Marketing wants last-click attribution to show their campaign impact. Product wants first-click to show top-of-funnel value. Sales wants assisted conversions counted. Each model shows different teams as the 'winner' for driving revenue.",
          teamMessages: [
            { id: '1', sender: 'Marketing Director', avatar: 'MD', message: 'Last-click shows our campaigns drove 70% of conversions this month', timestamp: '2 hours ago', type: 'message' },
            { id: '2', sender: 'Product Manager', avatar: 'PM', message: 'First-click attribution shows organic search and product features drive most conversions', timestamp: '1.5 hours ago', type: 'message' },
            { id: '3', sender: 'Sales Director', avatar: 'SD', message: 'Time-decay model shows our nurturing process is crucial for enterprise deals', timestamp: '1 hour ago', type: 'message' },
            { id: '4', sender: 'CEO', avatar: 'CEO', message: 'Budget planning needs one source of truth. Can\'t have three different attribution stories.', timestamp: '45 min ago', type: 'alert' },
            { id: '5', sender: 'Data Analyst', avatar: 'DA', message: 'Each model is technically correct but answers different questions', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Implement multi-touch attribution model',
              consequences: [
                { type: 'positive', title: 'Comprehensive View', description: 'Credits all touchpoints in customer journey', impact: 'Balanced team recognition' },
                { type: 'negative', title: 'Complex Implementation', description: 'Requires advanced analytics setup and ongoing maintenance', impact: 'Technical overhead +40%' }
              ]
            },
            {
              id: 'b',
              text: 'Use different attribution models for different purposes',
              consequences: [
                { type: 'neutral', title: 'Context-Specific Analysis', description: 'Each team uses most relevant model for their goals', impact: 'Targeted insights' },
                { type: 'negative', title: 'Inconsistent Reporting', description: 'Makes cross-team collaboration and budgeting difficult', impact: 'Communication challenges' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on incrementality testing instead of attribution',
              consequences: [
                { type: 'positive', title: 'True Causal Impact', description: 'Measures actual incremental value of each channel', impact: 'Scientific approach' },
                { type: 'negative', title: 'Testing Overhead', description: 'Requires constant experimentation and statistical rigor', impact: 'Resource intensive' }
              ]
            }
          ]
        }
      },
      {
        id: 'a-i-2',
        title: 'Real-time vs Batch Analytics Trade-off',
        description: 'Stakeholders want real-time insights but your infrastructure can only support batch processing',
        type: 'kpi-impact',
        timeLimit: 165,
        content: {
          context: "Your current analytics run on nightly batch jobs with 24-hour delays. Stakeholders want real-time dashboards for faster decision-making, but the infrastructure upgrade would cost $200K and take 6 months.",
          currentKPIs: {
            revenue: { value: 480, change: 3 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 4.0, change: -0.1 },
            userGrowth: { value: 15, change: 2 }
          },
          teamMessages: [
            { id: '1', sender: 'VP Sales', avatar: 'VS', message: 'Need real-time conversion tracking to optimize campaigns during the day', timestamp: '3 hours ago', type: 'message' },
            { id: '2', sender: 'Product Team', avatar: 'PT', message: 'Feature A/B tests need live results to make quick iterations', timestamp: '2 hours ago', type: 'message' },
            { id: '3', sender: 'Engineering', avatar: 'ENG', message: 'Real-time analytics infrastructure is 6-month project, $200K budget', timestamp: '1 hour ago', type: 'message' },
            { id: '4', sender: 'CFO', avatar: 'CFO', message: 'What\'s the ROI on real-time vs 24-hour delayed insights?', timestamp: '45 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Invest in full real-time analytics infrastructure',
              consequences: [
                { type: 'positive', title: 'Competitive Advantage', description: 'Fastest decision-making in the market', impact: 'Operational efficiency +25%' },
                { type: 'negative', title: 'Major Investment', description: 'Significant cost and engineering time', impact: 'Revenue -8% due to costs' }
              ],
              kpiImpact: {
                revenue: { value: 440, change: -8 },
                teamMood: { value: 7, change: 1 },
                customerSat: { value: 4.2, change: 0.2 },
                userGrowth: { value: 20, change: 5 }
              }
            },
            {
              id: 'b',
              text: 'Build selective real-time tracking for key metrics only',
              consequences: [
                { type: 'neutral', title: 'Targeted Solution', description: 'Real-time for critical KPIs, batch for detailed analysis', impact: 'Balanced approach' },
                { type: 'negative', title: 'Partial Coverage', description: 'Some decisions still require waiting for batch data', impact: 'Mixed user experience' }
              ],
              kpiImpact: {
                revenue: { value: 475, change: -1 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 4.1, change: 0.1 },
                userGrowth: { value: 17, change: 2 }
              }
            },
            {
              id: 'c',
              text: 'Optimize current batch processing for faster turnaround',
              consequences: [
                { type: 'positive', title: 'Cost Effective', description: 'Improve speed without major infrastructure changes', impact: 'Quick wins' },
                { type: 'negative', title: 'Limited Improvement', description: 'Still 8-12 hour delays instead of 24 hours', impact: 'Incremental benefit only' }
              ],
              kpiImpact: {
                revenue: { value: 485, change: 1 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.0, change: 0 },
                userGrowth: { value: 16, change: 1 }
              }
            }
          ]
        }
      },
      {
        id: 'a-i-3',
        title: 'Data Quality vs Speed Dilemma',
        description: 'Your data has quality issues but stakeholders need insights for tomorrow\'s board meeting',
        type: 'time-pressure',
        timeLimit: 140,
        content: {
          context: "Tomorrow's board meeting will decide Q4 budget allocation. Your analytics team discovered data quality issues: 20% of events are missing, attribution is broken for last month, and user segmentation has errors. Fixing it takes 2 weeks but the board needs insights now.",
          teamMessages: [
            { id: '1', sender: 'Data Engineer', avatar: 'DE', message: 'Found major gaps in event tracking. 20% of user actions not recorded.', timestamp: '6 hours ago', type: 'alert' },
            { id: '2', sender: 'Analytics Lead', avatar: 'AL', message: 'Attribution model has been double-counting conversions for 3 weeks', timestamp: '4 hours ago', type: 'alert' },
            { id: '3', sender: 'CEO', avatar: 'CEO', message: 'Board meeting at 9 AM tomorrow. Need growth metrics and channel performance.', timestamp: '2 hours ago', type: 'alert' },
            { id: '4', sender: 'CFO', avatar: 'CFO', message: 'Budget decisions depend on accurate ROI data for each marketing channel', timestamp: '1 hour ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Present available data with clear caveats about quality issues',
              consequences: [
                { type: 'positive', title: 'Transparency', description: 'Honest about data limitations and their impact', impact: 'Maintains credibility' },
                { type: 'negative', title: 'Decision Risk', description: 'Board may make suboptimal budget decisions', impact: 'Business impact uncertainty' }
              ]
            },
            {
              id: 'b',
              text: 'Work overnight to patch most critical data issues',
              consequences: [
                { type: 'positive', title: 'Improved Accuracy', description: 'Quick fixes for most glaring problems', impact: 'Better decision support' },
                { type: 'negative', title: 'Team Burnout', description: 'Unsustainable pace and potential for new errors', impact: 'Team morale and quality risk' }
              ]
            },
            {
              id: 'c',
              text: 'Request meeting delay to ensure data accuracy',
              consequences: [
                { type: 'positive', title: 'Data Integrity', description: 'Decisions based on accurate, reliable information', impact: 'Optimal business outcomes' },
                { type: 'negative', title: 'Business Delay', description: 'Q4 planning delayed, competitors may gain advantage', impact: 'Opportunity cost' }
              ]
            }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 'a-a-1',
        title: 'AI-Driven Analytics vs Human Insight',
        description: 'Your new AI system contradicts expert analyst interpretations of user behavior',
        type: 'crisis-management',
        timeLimit: 240,
        content: {
          context: "Your machine learning system identifies user segments and predicts churn with 85% accuracy, but recommends actions that contradict your senior analysts' understanding of user behavior. The AI suggests targeting high-value users with discount offers, while analysts insist this would devalue the brand.",
          teamMessages: [
            { id: '1', sender: 'ML Engineer', avatar: 'ML', message: 'AI model shows 23% churn reduction with targeted discounts to premium users', timestamp: '4 hours ago', type: 'message' },
            { id: '2', sender: 'Senior Analyst', avatar: 'SA', message: 'This goes against everything we know about premium user psychology', timestamp: '3 hours ago', type: 'message' },
            { id: '3', sender: 'Customer Success', avatar: 'CS', message: 'High-value users often tell us they chose us because we\'re NOT the discount option', timestamp: '2 hours ago', type: 'message' },
            { id: '4', sender: 'VP Product', avatar: 'VP', message: 'AI found patterns humans missed, but human context matters too', timestamp: '1 hour ago', type: 'message' },
            { id: '5', sender: 'CEO', avatar: 'CEO', message: 'Need decision on Q4 retention strategy. AI insights vs human expertise?', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Trust the AI model and implement its recommendations',
              consequences: [
                { type: 'positive', title: 'Data-Driven Innovation', description: 'Discover new user behavior patterns', impact: 'Potential breakthrough insights' },
                { type: 'negative', title: 'Brand Risk', description: 'May damage premium positioning and user trust', impact: 'Long-term brand value risk' }
              ]
            },
            {
              id: 'b',
              text: 'Run controlled experiment testing AI vs human strategies',
              consequences: [
                { type: 'positive', title: 'Scientific Approach', description: 'Test both approaches with measurable outcomes', impact: 'Evidence-based decision making' },
                { type: 'negative', title: 'Resource Split', description: 'Divide efforts between competing strategies', impact: 'Reduced execution power' }
              ]
            },
            {
              id: 'c',
              text: 'Combine AI insights with human interpretation',
              consequences: [
                { type: 'neutral', title: 'Hybrid Intelligence', description: 'Use AI patterns with human context and judgment', impact: 'Balanced approach' },
                { type: 'negative', title: 'Compromised Execution', description: 'May dilute the power of both approaches', impact: 'Moderate results' }
              ]
            }
          ]
        }
      },
      {
        id: 'a-a-2',
        title: 'Global Data Governance Strategy',
        description: 'Build analytics infrastructure compliant with conflicting international data laws',
        type: 'multi-step',
        timeLimit: 280,
        content: {
          context: "Your analytics platform serves users globally. EU GDPR requires data localization and explicit consent. China demands government access to user data. US regulations allow broader use but with state-level variations. India is implementing new data protection laws. Each market's requirements conflict with others.",
          options: [
            {
              id: 'a',
              text: 'Build federated analytics with region-specific compliance',
              consequences: [
                { type: 'positive', title: 'Full Compliance', description: 'Meet all regional requirements without compromise', impact: 'Global market access' },
                { type: 'negative', title: 'System Complexity', description: 'Multiple analytics systems with different capabilities', impact: 'Engineering complexity +300%' }
              ]
            },
            {
              id: 'b',
              text: 'Adopt highest standard globally (EU GDPR)',
              consequences: [
                { type: 'positive', title: 'Unified Approach', description: 'Single analytics system and governance model', impact: 'Operational simplicity' },
                { type: 'negative', title: 'Capability Limitations', description: 'Restrict analytics to most conservative standard', impact: 'Innovation constraints' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on privacy-first analytics that work everywhere',
              consequences: [
                { type: 'positive', title: 'Future-Proof Strategy', description: 'Ahead of regulatory trends globally', impact: 'Competitive differentiation' },
                { type: 'negative', title: 'Technical Challenge', description: 'Building privacy-preserving analytics is cutting-edge', impact: '18-month R&D timeline' }
              ]
            }
          ]
        }
      },
      {
        id: 'a-a-3',
        title: 'Predictive Analytics Ethics Decision',
        description: 'Your predictive model can identify users likely to churn or have mental health crises',
        type: 'time-pressure',
        timeLimit: 250,
        content: {
          context: "Your advanced analytics can predict with 90% accuracy which users will churn in the next 30 days, and with 75% accuracy which users are showing signs of mental health distress. Marketing wants to target churning users with retention offers. Legal is concerned about using mental health predictions for any business purpose.",
          teamMessages: [
            { id: '1', sender: 'Data Scientist', avatar: 'DS', message: 'Model accuracy is incredible. We can predict user behavior weeks in advance.', timestamp: '3 hours ago', type: 'message' },
            { id: '2', sender: 'Marketing', avatar: 'MR', message: 'Churn prediction could save millions in retention costs. Why not use it?', timestamp: '2 hours ago', type: 'message' },
            { id: '3', sender: 'Legal', avatar: 'LG', message: 'Mental health predictions raise serious ethical and liability questions', timestamp: '1.5 hours ago', type: 'alert' },
            { id: '4', sender: 'Customer Success', avatar: 'CS', message: 'Could we use health insights to connect users with support resources?', timestamp: '1 hour ago', type: 'message' },
            { id: '5', sender: 'Ethics Committee', avatar: 'EC', message: 'Need clear guidelines on predictive analytics use by end of week', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Use churn prediction only, avoid health-related predictions',
              consequences: [
                { type: 'positive', title: 'Business Value', description: 'Improve retention while avoiding sensitive data use', impact: 'Revenue protection' },
                { type: 'negative', title: 'Missed Opportunity', description: 'Could help users but choose not to use capability', impact: 'Ethical opportunity cost' }
              ]
            },
            {
              id: 'b',
              text: 'Use health predictions for user support, not business purposes',
              consequences: [
                { type: 'positive', title: 'User Welfare', description: 'Proactively help users in distress', impact: 'Social responsibility' },
                { type: 'negative', title: 'Liability Risk', description: 'Legal exposure if predictions are wrong or misused', impact: 'Legal and reputational risk' }
              ]
            },
            {
              id: 'c',
              text: 'Disable predictive capabilities and focus on descriptive analytics',
              consequences: [
                { type: 'positive', title: 'Ethical Clarity', description: 'Avoid all predictive ethics dilemmas', impact: 'Clear moral position' },
                { type: 'negative', title: 'Competitive Disadvantage', description: 'Competitors may use similar capabilities', impact: 'Innovation gap' }
              ]
            }
          ]
        }
      }
    ]
  },
  design: {
    beginner: [
      {
        id: 'd-b-1',
        title: 'Mobile-First Design Crisis',
        description: 'Your desktop-focused design doesn\'t work on mobile, but 60% of users are mobile',
        type: 'time-pressure',
        timeLimit: 85,
        content: {
          context: "Analytics show 60% of your users access the app on mobile, but your design was built desktop-first. Mobile users have 40% higher bounce rates and complete 50% fewer actions. Competitors are gaining mobile users while yours are leaving.",
          teamMessages: [
            { id: '1', sender: 'Analytics', avatar: 'AN', message: 'Mobile bounce rate jumped to 75%. Desktop is only 35%.', timestamp: '2 hours ago', type: 'alert' },
            { id: '2', sender: 'Support', avatar: 'SP', message: 'Getting complaints about tiny buttons and unreadable text on phones', timestamp: '1 hour ago', type: 'message' },
            { id: '3', sender: 'Sales', avatar: 'SL', message: 'Lost 3 deals this week. Prospects said our mobile experience is poor.', timestamp: '45 min ago', type: 'alert' },
            { id: '4', sender: 'CEO', avatar: 'CEO', message: 'Competitor just launched mobile-first. We need to respond fast.', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Completely redesign with mobile-first approach',
              consequences: [
                { type: 'positive', title: 'Optimal Mobile Experience', description: 'Best possible experience for majority of users', impact: 'User satisfaction +40%' },
                { type: 'negative', title: 'Major Development Effort', description: '4-month complete redesign and rebuild', impact: 'Feature development paused' }
              ]
            },
            {
              id: 'b',
              text: 'Quick mobile optimizations of current design',
              consequences: [
                { type: 'positive', title: 'Fast Improvement', description: 'Address major mobile pain points in 2 weeks', impact: 'Quick wins for users' },
                { type: 'negative', title: 'Compromise Solution', description: 'Still not optimal for mobile experience', impact: 'Bandaid approach' }
              ]
            },
            {
              id: 'c',
              text: 'Build separate mobile app',
              consequences: [
                { type: 'positive', title: 'Native Mobile Experience', description: 'Optimal for mobile without affecting web', impact: 'Platform-specific optimization' },
                { type: 'negative', title: 'Maintenance Overhead', description: 'Maintain two separate codebases and designs', impact: 'Development complexity doubled' }
              ]
            }
          ]
        }
      },
      {
        id: 'd-b-2',
        title: 'Accessibility Compliance Crisis',
        description: 'Your design fails accessibility standards and you have 30 days to comply',
        type: 'kpi-impact',
        timeLimit: 100,
        content: {
          context: "A accessibility audit revealed your product violates WCAG 2.1 standards: insufficient color contrast, missing alt text, keyboard navigation issues, and screen reader problems. You have 30 days to comply or face legal action.",
          currentKPIs: {
            revenue: { value: 450, change: 2 },
            teamMood: { value: 6, change: -1 },
            customerSat: { value: 4.0, change: -0.2 },
            userGrowth: { value: 10, change: -3 }
          },
          teamMessages: [
            { id: '1', sender: 'Legal', avatar: 'LG', message: 'ADA compliance notice received. 30 days to fix or face lawsuit.', timestamp: '4 hours ago', type: 'alert' },
            { id: '2', sender: 'Designer', avatar: 'UX', message: 'Color contrast fails on 40% of interface. Need complete color system review.', timestamp: '3 hours ago', type: 'message' },
            { id: '3', sender: 'Frontend Dev', avatar: 'FE', message: 'Missing semantic HTML and ARIA labels throughout the app', timestamp: '2 hours ago', type: 'message' },
            { id: '4', sender: 'Customer Success', avatar: 'CS', message: 'Visually impaired user says our app is unusable with screen reader', timestamp: '1 hour ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'All-hands effort to fix accessibility issues immediately',
              consequences: [
                { type: 'positive', title: 'Legal Compliance', description: 'Avoid lawsuit and open product to disabled users', impact: 'User base expansion +15%' },
                { type: 'negative', title: 'Feature Development Halt', description: 'All other work stops for accessibility sprint', impact: 'Roadmap delayed 6 weeks' }
              ],
              kpiImpact: {
                revenue: { value: 445, change: -1 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.3, change: 0.3 },
                userGrowth: { value: 15, change: 5 }
              }
            },
            {
              id: 'b',
              text: 'Fix critical issues first, improve gradually',
              consequences: [
                { type: 'neutral', title: 'Minimal Compliance', description: 'Meet legal requirements without perfect accessibility', impact: 'Reduced legal risk' },
                { type: 'negative', title: 'Suboptimal Experience', description: 'Still difficult for disabled users to use product', impact: 'Limited inclusion benefits' }
              ],
              kpiImpact: {
                revenue: { value: 450, change: 0 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 4.1, change: 0.1 },
                userGrowth: { value: 12, change: 2 }
              }
            },
            {
              id: 'c',
              text: 'Hire accessibility consultant for comprehensive overhaul',
              consequences: [
                { type: 'positive', title: 'Expert Implementation', description: 'Professional accessibility integration done right', impact: 'Gold standard accessibility' },
                { type: 'negative', title: 'Higher Costs', description: '$50k consultant fee plus extended timeline', impact: 'Budget impact -5%' }
              ],
              kpiImpact: {
                revenue: { value: 427, change: -5 },
                teamMood: { value: 7, change: 1 },
                customerSat: { value: 4.4, change: 0.4 },
                userGrowth: { value: 18, change: 8 }
              }
            }
          ]
        }
      },
      {
        id: 'd-b-3',
        title: 'Design System Consistency Crisis',
        description: 'Your product has 5 different button styles and users are confused',
        type: 'team-chat',
        timeLimit: 95,
        content: {
          context: "User testing reveals confusion about your interface: buttons look different on every page, colors vary by section, and similar actions have different visual treatments. Multiple designers working independently created an inconsistent experience.",
          teamMessages: [
            { id: '1', sender: 'User Research', avatar: 'UR', message: 'Users can\'t find the \"save\" button because it looks different on each page', timestamp: '2 hours ago', type: 'alert' },
            { id: '2', sender: 'Designer A', avatar: 'DA', message: 'I was told to make the checkout flow stand out, so I used different styles', timestamp: '1.5 hours ago', type: 'message' },
            { id: '3', sender: 'Designer B', avatar: 'DB', message: 'Settings page needed premium feel, so I created new button variants', timestamp: '1 hour ago', type: 'message' },
            { id: '4', sender: 'Frontend Dev', avatar: 'FE', message: 'We have 47 different button CSS classes. Maintenance nightmare.', timestamp: '45 min ago', type: 'alert' },
            { id: '5', sender: 'Product Manager', avatar: 'PM', message: 'Conversion rates are down 15%. Users seem lost in our interface.', timestamp: '30 min ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Create comprehensive design system immediately',
              consequences: [
                { type: 'positive', title: 'Consistent Experience', description: 'Unified visual language across entire product', impact: 'User confusion reduced' },
                { type: 'negative', title: 'Major Redesign Work', description: 'Retrofit entire product to use new system', impact: '8-week design and development effort' }
              ]
            },
            {
              id: 'b',
              text: 'Standardize critical components first (buttons, forms)',
              consequences: [
                { type: 'positive', title: 'Quick Wins', description: 'Fix most confusing elements within 2 weeks', impact: 'Immediate user experience improvement' },
                { type: 'negative', title: 'Partial Solution', description: 'Other inconsistencies remain across the product', impact: 'Incomplete consistency' }
              ]
            },
            {
              id: 'c',
              text: 'Establish design review process to prevent future inconsistencies',
              consequences: [
                { type: 'positive', title: 'Process Improvement', description: 'Prevent future design fragmentation', impact: 'Long-term consistency' },
                { type: 'negative', title: 'Current Issues Remain', description: 'Doesn\'t fix existing inconsistent interface', impact: 'Users still confused short-term' }
              ]
            }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 'd-i-1',
        title: 'User Testing vs Stakeholder Opinions',
        description: 'User testing contradicts executive preferences for the new design direction',
        type: 'crisis-management',
        timeLimit: 155,
        content: {
          context: "Your user testing shows the new navigation design confuses users and reduces task completion by 30%. However, the CEO loves the modern look and the board specifically requested a more contemporary design to match competitors.",
          teamMessages: [
            { id: '1', sender: 'UX Researcher', avatar: 'UX', message: 'Task completion dropped 30% with new navigation. Users can\'t find key features.', timestamp: '3 hours ago', type: 'alert' },
            { id: '2', sender: 'CEO', avatar: 'CEO', message: 'New design looks amazing. Finally matches our premium brand positioning.', timestamp: '2 hours ago', type: 'message' },
            { id: '3', sender: 'Board Member', avatar: 'BM', message: 'Investors love the modern interface. Looks like a $100M company now.', timestamp: '1.5 hours ago', type: 'message' },
            { id: '4', sender: 'Customer Success', avatar: 'CS', message: 'Support tickets increased 40% since design preview. Users asking \"where did X go?\"', timestamp: '1 hour ago', type: 'alert' },
            { id: '5', sender: 'Product Manager', avatar: 'PM', message: 'Caught between user data and stakeholder expectations. Need a decision.', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Follow user testing data and revert to functional design',
              consequences: [
                { type: 'positive', title: 'User-Centered Design', description: 'Prioritize user experience and task completion', impact: 'Better user outcomes' },
                { type: 'negative', title: 'Stakeholder Disappointment', description: 'CEO and board may lose confidence in design team', impact: 'Political consequences' }
              ]
            },
            {
              id: 'b',
              text: 'Find middle ground that addresses usability while keeping modern aesthetic',
              consequences: [
                { type: 'neutral', title: 'Compromise Solution', description: 'Balance user needs with stakeholder preferences', impact: 'Moderate satisfaction' },
                { type: 'negative', title: 'Additional Development Time', description: 'Requires new design iteration and testing', impact: '4-week delay' }
              ]
            },
            {
              id: 'c',
              text: 'Implement stakeholder preference with extensive user onboarding',
              consequences: [
                { type: 'positive', title: 'Stakeholder Alignment', description: 'Meet executive vision and investor expectations', impact: 'Business relationship benefits' },
                { type: 'negative', title: 'User Experience Risk', description: 'May alienate existing users with confusing interface', impact: 'Potential user churn' }
              ]
            }
          ]
        }
      },
      {
        id: 'd-i-2',
        title: 'Responsive Design Resource Allocation',
        description: 'Choose which devices/screen sizes to prioritize with limited design resources',
        type: 'multi-step',
        timeLimit: 170,
        content: {
          context: "Your analytics show: 45% mobile phone users, 35% desktop users, 15% tablet users, 5% large screens (4K+). Your design team can only optimize for 2 device categories this quarter. Each requires different interaction patterns and visual hierarchies.",
          options: [
            {
              id: 'a',
              text: 'Focus on mobile and desktop (80% of users)',
              consequences: [
                { type: 'positive', title: 'Maximum User Coverage', description: 'Optimize experience for vast majority of users', impact: 'Broad user satisfaction' },
                { type: 'negative', title: 'Tablet Experience Suffers', description: 'Tablet users get suboptimal stretched mobile or cramped desktop experience', impact: '15% of users affected' }
              ]
            },
            {
              id: 'b',
              text: 'Mobile-first approach with progressive enhancement',
              consequences: [
                { type: 'positive', title: 'Unified Foundation', description: 'Ensure all devices work, optimize mobile first', impact: 'Consistent baseline experience' },
                { type: 'negative', title: 'Desktop Underutilized', description: 'Desktop users don\'t get full advantage of larger screens', impact: 'Premium users may feel underserved' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on highest-value user segments regardless of device',
              consequences: [
                { type: 'neutral', title: 'Business-Focused Approach', description: 'Optimize for users who drive most revenue', impact: 'Revenue per user optimization' },
                { type: 'negative', title: 'Device Fragmentation', description: 'Different device types get very different experience quality', impact: 'Inconsistent brand experience' }
              ]
            }
          ]
        }
      },
      {
        id: 'd-i-3',
        title: 'Dark Mode Implementation Strategy',
        description: 'Users demand dark mode but it requires redesigning your entire visual system',
        type: 'kpi-impact',
        timeLimit: 145,
        content: {
          context: "67% of users in your latest survey requested dark mode. Competitors offer it, and it's becoming a standard expectation. However, your current design uses color heavily for meaning and navigation - implementing dark mode requires rethinking your entire visual hierarchy.",
          currentKPIs: {
            revenue: { value: 420, change: 1 },
            teamMood: { value: 6, change: 0 },
            customerSat: { value: 3.8, change: -0.3 },
            userGrowth: { value: 8, change: -2 }
          },
          options: [
            {
              id: 'a',
              text: 'Full dark mode implementation with redesigned color system',
              consequences: [
                { type: 'positive', title: 'Complete User Request', description: 'Comprehensive dark mode that works everywhere', impact: 'User satisfaction +25%' },
                { type: 'negative', title: 'Major Design Overhaul', description: 'Requires rebuilding color system and testing all components', impact: '12-week development cycle' }
              ],
              kpiImpact: {
                revenue: { value: 415, change: -1 },
                teamMood: { value: 5, change: -1 },
                customerSat: { value: 4.2, change: 0.4 },
                userGrowth: { value: 15, change: 7 }
              }
            },
            {
              id: 'b',
              text: 'Simple dark mode with inverted colors and minimal changes',
              consequences: [
                { type: 'positive', title: 'Quick Implementation', description: 'Basic dark mode available in 3 weeks', impact: 'Fast user request fulfillment' },
                { type: 'negative', title: 'Poor User Experience', description: 'Color conflicts and readability issues', impact: 'User complaints about quality' }
              ],
              kpiImpact: {
                revenue: { value: 420, change: 0 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 3.6, change: -0.2 },
                userGrowth: { value: 10, change: 2 }
              }
            },
            {
              id: 'c',
              text: 'Focus on other highly requested features instead',
              consequences: [
                { type: 'positive', title: 'Alternative Value', description: 'Deliver other user-requested improvements', impact: 'Different user satisfaction gains' },
                { type: 'negative', title: 'Competitive Gap', description: 'Fall behind competitors offering dark mode', impact: 'Feature parity disadvantage' }
              ],
              kpiImpact: {
                revenue: { value: 425, change: 1 },
                teamMood: { value: 6, change: 0 },
                customerSat: { value: 3.9, change: 0.1 },
                userGrowth: { value: 6, change: -2 }
              }
            }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 'd-a-1',
        title: 'Global Design System Architecture',
        description: 'Design a system that works across different cultures, languages, and regulatory requirements',
        type: 'crisis-management',
        timeLimit: 260,
        content: {
          context: "Your design system needs to support 12 languages including Arabic (RTL), accommodate European accessibility laws, work with Chinese social media integration requirements, and respect cultural color/imagery sensitivities across markets while maintaining brand consistency.",
          teamMessages: [
            { id: '1', sender: 'International PM', avatar: 'IP', message: 'Arabic RTL support breaks our entire layout system. Need architectural solution.', timestamp: '4 hours ago', type: 'alert' },
            { id: '2', sender: 'Legal EU', avatar: 'LE', message: 'GDPR requires explicit consent UI for every data collection point', timestamp: '3 hours ago', type: 'message' },
            { id: '3', sender: 'China Lead', avatar: 'CL', message: 'Red color means luck here but danger in other markets. Need cultural variants.', timestamp: '2 hours ago', type: 'message' },
            { id: '4', sender: 'Brand Manager', avatar: 'BM', message: 'Brand consistency is crucial for global recognition and trust', timestamp: '1.5 hours ago', type: 'message' },
            { id: '5', sender: 'Engineering', avatar: 'ENG', message: 'Current system can\'t handle conditional styling for different regions', timestamp: '1 hour ago', type: 'alert' }
          ],
          options: [
            {
              id: 'a',
              text: 'Build modular design system with cultural/regulatory overlays',
              consequences: [
                { type: 'positive', title: 'Comprehensive Solution', description: 'Single system that adapts to all regional requirements', impact: 'Global scalability' },
                { type: 'negative', title: 'System Complexity', description: 'Extremely complex architecture and maintenance', impact: '18-month development timeline' }
              ]
            },
            {
              id: 'b',
              text: 'Create region-specific design systems with shared core',
              consequences: [
                { type: 'neutral', title: 'Balanced Approach', description: 'Core consistency with regional flexibility', impact: 'Moderate complexity' },
                { type: 'negative', title: 'Synchronization Challenges', description: 'Keeping multiple systems aligned and updated', impact: 'Maintenance overhead +200%' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on universal design principles that work globally',
              consequences: [
                { type: 'positive', title: 'Unified Experience', description: 'Consistent global experience with minimal variants', impact: 'Operational simplicity' },
                { type: 'negative', title: 'Cultural Insensitivity', description: 'May miss important regional needs and preferences', impact: 'User adoption challenges' }
              ]
            }
          ]
        }
      },
      {
        id: 'd-a-2',
        title: 'AI-Generated vs Human-Crafted Design',
        description: 'Your team can produce designs 10x faster with AI, but stakeholders question the quality and originality',
        type: 'time-pressure',
        timeLimit: 270,
        content: {
          context: "New AI design tools can generate interfaces, icons, and layouts in minutes instead of days. Your team's productivity has increased 10x, but the CEO worries about losing creative edge and differentiation. Competitors using AI are launching features faster.",
          teamMessages: [
            { id: '1', sender: 'Design Lead', avatar: 'DL', message: 'AI generated 50 interface variations in 30 minutes. Would take weeks manually.', timestamp: '3 hours ago', type: 'message' },
            { id: '2', sender: 'CEO', avatar: 'CEO', message: 'Everything looks generic now. Where\'s our unique design voice?', timestamp: '2.5 hours ago', type: 'alert' },
            { id: '3', sender: 'Product Manager', avatar: 'PM', message: 'Competitor launched 3 new features while we\'re debating design process', timestamp: '2 hours ago', type: 'message' },
            { id: '4', sender: 'Senior Designer', avatar: 'SD', message: 'AI is a tool. We still make creative decisions and refine outputs.', timestamp: '1.5 hours ago', type: 'message' },
            { id: '5', sender: 'Brand Manager', avatar: 'BM', message: 'Brand differentiation through design is core to our strategy', timestamp: '1 hour ago', type: 'alert' },
            { id: '6', sender: 'User Research', avatar: 'UR', message: 'Users can\'t tell difference between AI and human designs in testing', timestamp: '30 min ago', type: 'message' }
          ],
          options: [
            {
              id: 'a',
              text: 'Embrace AI-first design workflow with human refinement',
              consequences: [
                { type: 'positive', title: 'Speed Advantage', description: 'Launch features 5x faster than competitors', impact: 'Market leadership through velocity' },
                { type: 'negative', title: 'Potential Design Homogenization', description: 'Risk of losing unique brand voice and differentiation', impact: 'Brand dilution risk' }
              ]
            },
            {
              id: 'b',
              text: 'Use AI for rapid prototyping, human design for final products',
              consequences: [
                { type: 'neutral', title: 'Hybrid Approach', description: 'Speed benefits with human creativity for final output', impact: 'Balanced productivity and quality' },
                { type: 'negative', title: 'Process Complexity', description: 'Managing handoffs between AI generation and human refinement', impact: 'Workflow coordination overhead' }
              ]
            },
            {
              id: 'c',
              text: 'Maintain human-centered design process with selective AI assistance',
              consequences: [
                { type: 'positive', title: 'Design Quality', description: 'Preserve unique creative voice and brand differentiation', impact: 'Premium design positioning' },
                { type: 'negative', title: 'Competitive Speed Disadvantage', description: 'Slower feature delivery versus AI-enabled competitors', impact: 'Market share risk' }
              ]
            }
          ]
        }
      },
      {
        id: 'd-a-3',
        title: 'Accessibility vs Innovation Trade-off',
        description: 'Your innovative interface patterns create accessibility barriers but drive user engagement',
        type: 'multi-step',
        timeLimit: 290,
        content: {
          context: "Your product features innovative UI patterns (gesture-based navigation, dynamic layouts, voice interfaces) that increase user engagement by 40% and differentiate from competitors. However, these patterns create significant barriers for users with disabilities and some assistive technologies.",
          options: [
            {
              id: 'a',
              text: 'Redesign innovative features to be fully accessible',
              consequences: [
                { type: 'positive', title: 'Inclusive Innovation', description: 'Pioneering accessible advanced interfaces', impact: 'Competitive differentiation through inclusion' },
                { type: 'negative', title: 'Technical Complexity', description: 'Extremely challenging to make advanced UI patterns accessible', impact: '12-month R&D timeline' }
              ]
            },
            {
              id: 'b',
              text: 'Provide alternative accessible interfaces alongside innovative ones',
              consequences: [
                { type: 'neutral', title: 'Dual Experience', description: 'Innovative UI for some, accessible alternatives for others', impact: 'Multiple user pathways' },
                { type: 'negative', title: 'Maintenance Overhead', description: 'Developing and maintaining two different interface paradigms', impact: 'Development cost +150%' }
              ]
            },
            {
              id: 'c',
              text: 'Focus on innovation with gradual accessibility improvements',
              consequences: [
                { type: 'positive', title: 'Competitive Advantage', description: 'Leading-edge user experience drives market position', impact: 'User engagement leadership' },
                { type: 'negative', title: 'Exclusionary Design', description: 'Significant portion of users cannot access full functionality', impact: 'Legal and ethical risks' }
              ]
            }
          ]
        }
      }
    ]
  }
};

export const getEnhancedChallengesForSession = (category: string, difficulty: string): EnhancedChallengeData[] => {
  return enhancedChallengeDatabase[category]?.[difficulty] || enhancedChallengeDatabase.strategy.beginner;
};
