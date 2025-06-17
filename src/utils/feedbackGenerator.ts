
interface SessionAnswer {
  id: string;
  quality?: 'poor' | 'average' | 'good' | 'excellent';
  isCorrect?: boolean;
  timeSpent?: number;
  challengeType?: string;
}

interface SessionData {
  answers: any[];
  category: string;
  difficulty: string;
  challenges: number;
  timeEfficiency?: number;
}

interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  progress_statement: string;
  recommendation: string;
}

const strengthTemplates = {
  excellent_decisions: [
    "You made excellent strategic decisions under pressure.",
    "Your critical thinking skills really shone through.",
    "You demonstrated strong decision-making abilities."
  ],
  stakeholder_management: [
    "You showed great awareness of stakeholder tensions.",
    "Your stakeholder prioritization was spot-on.",
    "You handled competing priorities very well."
  ],
  time_management: [
    "You used your time efficiently across challenges.",
    "Great time management - you stayed calm under pressure.",
    "You balanced speed and accuracy effectively."
  ],
  analytical_thinking: [
    "Your analytical approach to problems was impressive.",
    "You demonstrated strong data-driven thinking.",
    "Your systematic problem-solving approach worked well."
  ],
  adaptability: [
    "You adapted well to different challenge formats.",
    "You showed flexibility in your approach to varied scenarios.",
    "Your versatility across different PM challenges was notable."
  ]
};

const improvementTemplates = {
  decision_speed: [
    "Try to make decisions more quickly while maintaining quality.",
    "You can afford to trust your instincts more in time-pressured situations.",
    "Consider setting time limits for yourself during decision-making."
  ],
  stakeholder_focus: [
    "Pay closer attention to stakeholder impact in your decisions.",
    "Consider all stakeholder perspectives before finalizing choices.",
    "Think more about long-term stakeholder relationships."
  ],
  analytical_depth: [
    "Dig deeper into the data before making conclusions.",
    "Take more time to analyze the root causes of problems.",
    "Consider multiple analytical angles before deciding."
  ],
  strategic_thinking: [
    "Focus more on long-term strategic implications.",
    "Think beyond immediate solutions to broader impact.",
    "Consider how decisions align with overall product strategy."
  ],
  time_efficiency: [
    "You had unused time - try to double-check your answers.",
    "Use remaining time to reconsider your initial choices.",
    "Balance thoroughness with the time constraints given."
  ]
};

const recommendationTemplates = {
  strategy: [
    "Try practicing more strategic planning scenarios to strengthen your long-term thinking.",
    "Focus on competitive analysis exercises to improve your strategic decision-making.",
    "Work on aligning tactical decisions with broader strategic goals."
  ],
  research: [
    "Practice user research methodology scenarios to improve your research skills.",
    "Focus on balancing quantitative and qualitative insights in your decisions.",
    "Try scenarios involving research ethics and stakeholder communication."
  ],
  analytics: [
    "Work on data interpretation exercises to strengthen your analytical skills.",
    "Practice identifying key metrics and their trade-offs.",
    "Focus on scenarios involving A/B testing and statistical significance."
  ],
  design: [
    "Try UX decision-making scenarios to improve your design thinking.",
    "Focus on accessibility and inclusive design challenges.",
    "Practice balancing user needs with technical constraints."
  ]
};

const progressStatements = {
  improved: [
    "Your performance improved since your last session — great job!",
    "You're getting better at PM decision-making — keep it up!",
    "Nice improvement from your previous attempt!",
    "Your growth in PM skills is clearly showing."
  ],
  consistent: [
    "Your performance was consistent with your previous session.",
    "You maintained your skill level from last time.",
    "Your PM abilities are staying steady — now let's push for growth."
  ],
  declined: [
    "This session was more challenging than your last — that's normal as you learn!",
    "Don't worry about the dip in performance — consistency comes with practice.",
    "Today was tougher, but each session teaches you something valuable."
  ]
};

export const generatePersonalizedFeedback = (
  sessionData: SessionData,
  previousScore?: number
): FeedbackResult => {
  const { answers, category, difficulty, challenges } = sessionData;
  
  // Calculate performance metrics
  const completedChallenges = answers.filter((a: any) => a !== undefined).length;
  const completionRate = (completedChallenges / challenges) * 100;
  
  // Analyze answer quality
  const qualityScores = answers
    .filter((a: any) => a && a.quality)
    .map((a: any) => {
      switch (a.quality) {
        case 'excellent': return 95;
        case 'good': return 80;
        case 'average': return 65;
        case 'poor': return 40;
        default: return 50;
      }
    });
  
  const averageQuality = qualityScores.length > 0 
    ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
    : 50;
  
  // Calculate realistic score (never give 100% unless perfect)
  let baseScore = (averageQuality * 0.7) + (completionRate * 0.3);
  
  // Apply difficulty modifier
  const difficultyModifier = difficulty === 'advanced' ? 1.1 : difficulty === 'intermediate' ? 1.05 : 1.0;
  baseScore *= difficultyModifier;
  
  // Cap at 95% to avoid perfect scores
  const finalScore = Math.min(95, Math.max(10, Math.round(baseScore)));
  
  // Determine strengths and improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // Analyze performance patterns
  const excellentAnswers = answers.filter((a: any) => a?.quality === 'excellent').length;
  const poorAnswers = answers.filter((a: any) => a?.quality === 'poor').length;
  const timeEfficient = completionRate > 90;
  
  // Generate strengths
  if (excellentAnswers >= 2) {
    strengths.push(getRandomTemplate(strengthTemplates.excellent_decisions));
  }
  if (category === 'strategy' && averageQuality > 75) {
    strengths.push(getRandomTemplate(strengthTemplates.stakeholder_management));
  }
  if (timeEfficient) {
    strengths.push(getRandomTemplate(strengthTemplates.time_management));
  }
  if (strengths.length === 0) {
    strengths.push(getRandomTemplate(strengthTemplates.adaptability));
  }
  
  // Ensure we have 1-2 strengths
  if (strengths.length > 2) {
    strengths.splice(2);
  }
  
  // Generate improvements
  if (poorAnswers >= 2) {
    improvements.push(getRandomTemplate(improvementTemplates.strategic_thinking));
  }
  if (completionRate < 80) {
    improvements.push(getRandomTemplate(improvementTemplates.decision_speed));
  }
  if (category === 'analytics' && averageQuality < 70) {
    improvements.push(getRandomTemplate(improvementTemplates.analytical_depth));
  }
  if (improvements.length === 0) {
    improvements.push(getRandomTemplate(improvementTemplates.stakeholder_focus));
  }
  
  // Ensure we have 1-2 improvements
  if (improvements.length > 2) {
    improvements.splice(2);
  }
  
  // Generate progress statement
  let progressStatement: string;
  if (previousScore && finalScore > previousScore + 5) {
    progressStatement = getRandomTemplate(progressStatements.improved);
  } else if (previousScore && finalScore < previousScore - 5) {
    progressStatement = getRandomTemplate(progressStatements.declined);
  } else {
    progressStatement = getRandomTemplate(progressStatements.consistent);
  }
  
  // Generate recommendation
  const categoryRecommendations = recommendationTemplates[category as keyof typeof recommendationTemplates] || recommendationTemplates.strategy;
  const recommendation = getRandomTemplate(categoryRecommendations);
  
  return {
    score: finalScore,
    strengths,
    improvements,
    progress_statement: progressStatement,
    recommendation
  };
};

const getRandomTemplate = (templates: string[]): string => {
  return templates[Math.floor(Math.random() * templates.length)];
};
