
export interface Level {
  id: number;
  name: string;
  title: string;
  minXP: number;
  maxXP: number;
  description: string;
  knowledge: string[];
  skills: string[];
  color: string;
}

export const LEVEL_SYSTEM: Level[] = [
  {
    id: 1,
    name: "PM1",
    title: "Product Novice",
    minXP: 0,
    maxXP: 999,
    description: "Getting familiar with basic product management concepts and terminology.",
    knowledge: [
      "Understanding of product lifecycle",
      "Basic user story writing",
      "Familiarity with agile methodology",
      "Introduction to market research"
    ],
    skills: [
      "Can participate in sprint planning",
      "Writes simple user stories",
      "Understands basic KPIs"
    ],
    color: "bg-gray-500"
  },
  {
    id: 2,
    name: "PM2",
    title: "Associate Product Manager",
    minXP: 1000,
    maxXP: 2499,
    description: "Developing foundational skills in product strategy and user research.",
    knowledge: [
      "Product roadmapping basics",
      "User persona development",
      "Competitive analysis",
      "Basic data analysis",
      "Stakeholder management principles"
    ],
    skills: [
      "Creates basic product roadmaps",
      "Conducts user interviews",
      "Analyzes product metrics",
      "Manages simple feature launches"
    ],
    color: "bg-blue-500"
  },
  {
    id: 3,
    name: "PM3",
    title: "Product Manager",
    minXP: 2500,
    maxXP: 4999,
    description: "Competent in core product management responsibilities and strategic thinking.",
    knowledge: [
      "Advanced product strategy",
      "Go-to-market planning",
      "A/B testing methodology",
      "Product-market fit validation",
      "Cross-functional team leadership"
    ],
    skills: [
      "Develops comprehensive product strategies",
      "Leads product discovery processes",
      "Manages complex stakeholder relationships",
      "Drives data-driven decisions"
    ],
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "PM4",
    title: "Senior Product Manager",
    minXP: 5000,
    maxXP: 7999,
    description: "Advanced practitioner with deep expertise in product strategy and team leadership.",
    knowledge: [
      "Portfolio management",
      "Advanced analytics and ML concepts",
      "Platform strategy",
      "Pricing and monetization",
      "International product expansion"
    ],
    skills: [
      "Manages product portfolios",
      "Mentors junior PMs",
      "Drives product innovation",
      "Influences company strategy"
    ],
    color: "bg-purple-500"
  },
  {
    id: 5,
    name: "PM5",
    title: "Principal Product Manager",
    minXP: 8000,
    maxXP: 12999,
    description: "Expert-level practitioner influencing product direction across multiple teams.",
    knowledge: [
      "Ecosystem strategy",
      "Advanced user psychology",
      "Business model innovation",
      "Technical architecture understanding",
      "Market disruption patterns"
    ],
    skills: [
      "Shapes product vision across org",
      "Leads complex integrations",
      "Drives technical product decisions",
      "Influences industry standards"
    ],
    color: "bg-orange-500"
  },
  {
    id: 6,
    name: "PM6",
    title: "Director of Product",
    minXP: 13000,
    maxXP: 19999,
    description: "Strategic leader managing multiple product lines and teams.",
    knowledge: [
      "Organizational design",
      "Product team scaling",
      "Board-level communication",
      "Investment and funding strategy",
      "Global market dynamics"
    ],
    skills: [
      "Manages product organizations",
      "Sets company product strategy",
      "Builds product culture",
      "Drives business growth"
    ],
    color: "bg-red-500"
  },
  {
    id: 7,
    name: "PM7",
    title: "VP of Product",
    minXP: 20000,
    maxXP: 29999,
    description: "Executive-level product leadership with company-wide influence.",
    knowledge: [
      "Executive strategy",
      "M&A product integration",
      "Industry thought leadership",
      "Venture capital ecosystem",
      "Global expansion strategy"
    ],
    skills: [
      "Shapes industry direction",
      "Leads major acquisitions",
      "Builds strategic partnerships",
      "Influences market trends"
    ],
    color: "bg-yellow-500"
  },
  {
    id: 8,
    name: "PM8",
    title: "Chief Product Officer",
    minXP: 30000,
    maxXP: Number.MAX_SAFE_INTEGER,
    description: "Top-tier product executive defining the future of product management.",
    knowledge: [
      "Visionary product thinking",
      "Cross-industry expertise",
      "Global market leadership",
      "Innovation ecosystem building",
      "Future technology trends"
    ],
    skills: [
      "Defines product management future",
      "Leads industry transformation",
      "Builds product ecosystems",
      "Shapes technology evolution"
    ],
    color: "bg-gold-500"
  }
];

export const getCurrentLevel = (xp: number): Level => {
  return LEVEL_SYSTEM.find(level => xp >= level.minXP && xp <= level.maxXP) || LEVEL_SYSTEM[0];
};

export const getNextLevel = (currentLevel: Level): Level | null => {
  const nextLevelIndex = LEVEL_SYSTEM.findIndex(level => level.id === currentLevel.id) + 1;
  return nextLevelIndex < LEVEL_SYSTEM.length ? LEVEL_SYSTEM[nextLevelIndex] : null;
};
