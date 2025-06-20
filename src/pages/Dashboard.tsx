
import { useDashboardData } from "@/hooks/useDashboardData";
import UserStatsCards from "@/components/Dashboard/UserStatsCards";
import DailyChallengeCard from "@/components/Dashboard/DailyChallengeCard";
import AchievementsCard from "@/components/Dashboard/AchievementsCard";
import ChallengeLibrarySection from "@/components/Dashboard/ChallengeLibrarySection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Dashboard = () => {
  const { stats, challengeStats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    );
  }

  const glossaryData = [
    {
      category: "📈 User Metrics & Growth",
      terms: [
        {
          term: "Churn",
          definition: "Percentage of users who stop using your product over a period of time.",
          example: "(Ex: users who signed up but didn't return.)"
        },
        {
          term: "Retention",
          definition: "The ability to get users to come back and keep using the product regularly.",
          example: "(High retention = users find lasting value.)"
        },
        {
          term: "Activation",
          definition: "The moment a new user experiences the core value of the product for the first time.",
          example: "(Ex: first message sent, first checklist completed.)"
        },
        {
          term: "NPS (Net Promoter Score)",
          definition: "A metric that measures customer satisfaction by asking how likely users are to recommend your product.",
          example: ""
        },
        {
          term: "KPI (Key Performance Indicator)",
          definition: "A measurable indicator that reflects how well a product or feature is performing.",
          example: ""
        },
        {
          term: "Conversion rate",
          definition: "The percentage of users who complete a specific action (like signing up, subscribing, or upgrading).",
          example: ""
        },
        {
          term: "MAU / DAU",
          definition: "Monthly / Daily Active Users — how many people are actively using your product over a given period.",
          example: ""
        }
      ]
    },
    {
      category: "🚀 Product & Launch",
      terms: [
        {
          term: "Go-to-market (GTM)",
          definition: "A plan to launch and promote your product or feature to the right audience at the right time.",
          example: ""
        },
        {
          term: "Onboarding",
          definition: "The user journey from sign-up to first success. Good onboarding increases engagement and retention.",
          example: ""
        },
        {
          term: "Beta",
          definition: "A testing phase before full release, where selected users try the product to identify bugs or feedback.",
          example: ""
        },
        {
          term: "MVP (Minimum Viable Product)",
          definition: "A simplified version of a product with just enough features to deliver value and get feedback.",
          example: ""
        },
        {
          term: "Feature flag",
          definition: "A tool to enable or disable features without deploying new code — useful for testing gradually.",
          example: ""
        }
      ]
    },
    {
      category: "💻 Technical Terms",
      terms: [
        {
          term: "Tech debt (Technical debt)",
          definition: "Quick fixes or shortcuts in the code that save time now but can cause problems later.",
          example: ""
        },
        {
          term: "Rollback",
          definition: "Reverting to an older version of the product after a failed update.",
          example: ""
        },
        {
          term: "Bug",
          definition: "An error or issue in the product that causes unexpected behaviour.",
          example: ""
        },
        {
          term: "API",
          definition: "A system that allows different software applications to talk to each other.",
          example: ""
        }
      ]
    },
    {
      category: "🧭 Team & Communication",
      terms: [
        {
          term: "Escalate",
          definition: "To raise a problem to someone with more authority (like a manager or a leadership team).",
          example: ""
        },
        {
          term: "Stakeholder",
          definition: "Anyone with an interest in the product — like users, business leaders, marketing, or developers.",
          example: ""
        },
        {
          term: "Alignment",
          definition: "Making sure everyone (teams, stakeholders) agrees on goals and priorities.",
          example: ""
        },
        {
          term: "Scope",
          definition: "What is included — and excluded — from a specific project or feature.",
          example: "(\"Out of scope\" means: not doing it for now.)"
        }
      ]
    },
    {
      category: "⚖️ Strategy & Prioritisation",
      terms: [
        {
          term: "Roadmap",
          definition: "A visual plan of what features or improvements are coming next.",
          example: ""
        },
        {
          term: "Trade-off",
          definition: "A decision where gaining one thing means giving up something else (e.g. speed vs. quality).",
          example: ""
        },
        {
          term: "North Star Metric",
          definition: "The one key metric that best reflects long-term success (e.g. number of active users).",
          example: ""
        },
        {
          term: "Impact vs. Effort",
          definition: "A prioritisation method: choose actions that bring high impact with low effort.",
          example: ""
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, PM!</h1>
          <p className="text-gray-400">Ready to level up your product management skills?</p>
        </div>

        {/* Stats Cards */}
        <UserStatsCards stats={stats} />

        {/* Main Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <DailyChallengeCard />
          <AchievementsCard />
        </div>

        {/* Challenge Library */}
        <ChallengeLibrarySection challengeStats={challengeStats} />

        {/* Glossary Section */}
        <Card className="bg-gray-900 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              Glossary 🧠
            </CardTitle>
            <CardDescription className="text-gray-400">
              Essential product management terms and definitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {glossaryData.map((category, categoryIndex) => (
                <AccordionItem key={categoryIndex} value={`category-${categoryIndex}`}>
                  <AccordionTrigger className="text-white hover:text-gray-300">
                    {category.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {category.terms.map((term, termIndex) => (
                        <div key={termIndex} className="p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-600/20">
                          <h4 className="font-semibold text-blue-400 mb-2">{term.term}</h4>
                          <p className="text-gray-300 mb-1">→ {term.definition}</p>
                          {term.example && (
                            <p className="text-gray-400 text-sm italic">{term.example}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
