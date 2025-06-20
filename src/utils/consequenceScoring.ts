
export interface Consequence {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: string;
}

export const evaluateAnswerQuality = (consequences: Consequence[]): {
  quality: 'excellent' | 'good' | 'average' | 'poor';
  score: number;
} => {
  if (!consequences || consequences.length === 0) {
    return { quality: 'average', score: 60 };
  }

  const positiveCount = consequences.filter(c => c.type === 'positive').length;
  const negativeCount = consequences.filter(c => c.type === 'negative').length;
  const neutralCount = consequences.filter(c => c.type === 'neutral').length;
  const totalCount = consequences.length;

  // Calculate positive ratio
  const positiveRatio = positiveCount / totalCount;
  const negativeRatio = negativeCount / totalCount;

  // Strategic scoring based on consequence analysis
  if (positiveRatio >= 0.7) {
    return { quality: 'excellent', score: 95 };
  } else if (positiveRatio >= 0.5 || (positiveRatio >= 0.3 && negativeRatio <= 0.3)) {
    return { quality: 'good', score: 80 };
  } else if (negativeRatio <= 0.5) {
    return { quality: 'average', score: 65 };
  } else {
    return { quality: 'poor', score: 40 };
  }
};

export const getQualityFromOption = (option: any, optionIndex: number = 0): 'excellent' | 'good' | 'average' | 'poor' => {
  // If option has explicit quality, use it
  if (option.quality) {
    return option.quality;
  }

  // If option has consequences, evaluate them
  if (option.consequences && Array.isArray(option.consequences)) {
    return evaluateAnswerQuality(option.consequences).quality;
  }

  // If option is marked as correct, it's excellent
  if (option.isCorrect) {
    return 'excellent';
  }

  // For multiple choice options without explicit quality, distribute quality levels
  // This ensures we get varied indicators instead of all being the same
  const qualityLevels: ('excellent' | 'good' | 'average' | 'poor')[] = ['excellent', 'good', 'average', 'poor'];
  
  // Use option index to distribute quality levels, with some randomization based on option text
  const textHash = option.text ? option.text.length + option.id?.length || 0 : 0;
  const qualityIndex = (optionIndex + textHash) % qualityLevels.length;
  
  return qualityLevels[qualityIndex];
};
