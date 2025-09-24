import { BigFiveScores, UserProfile, AssessmentAnswer } from './types';

export function calculateBigFive(answers: Map<string, string | number>): BigFiveScores {
  return {
    openness: calculateTrait(answers, 'openness', ['creativity', 'curiosity', 'artistic']),
    conscientiousness: calculateTrait(answers, 'conscientiousness', ['organization', 'discipline', 'planning']),
    extraversion: calculateTrait(answers, 'extraversion', ['social', 'outgoing', 'energy']),
    agreeableness: calculateTrait(answers, 'agreeableness', ['cooperation', 'trust', 'empathy']),
    neuroticism: calculateTrait(answers, 'neuroticism', ['anxiety', 'stress', 'worry'])
  };
}

function calculateTrait(answers: Map<string, string | number>, trait: string, keywords: string[]): number {
  let score = getDirectScore(answers, trait);
  
  // Cross-validate with related keywords
  keywords.forEach(keyword => {
    const value = answers.get(keyword);
    if (typeof value === 'number') {
      score += (value - 3) * 5; // Adjust from 1-5 scale
    }
  });

  return Math.max(0, Math.min(100, score));
}

function getDirectScore(answers: Map<string, string | number>, trait: string): number {
  const value = answers.get(trait);
  return typeof value === 'number' ? (value / 5) * 100 : 50;
}

export function inferValues(answers: Map<string, string | number>): string[] {
  const values = [];
  
  if (getScore(answers, 'family') > 4) values.push('Family');
  if (getScore(answers, 'career') > 4) values.push('Career Success');
  if (getScore(answers, 'security') > 4) values.push('Financial Security');
  if (getScore(answers, 'creativity') > 4) values.push('Creativity');
  if (getScore(answers, 'balance') > 4) values.push('Work-Life Balance');
  
  return values.slice(0, 5);
}

export function inferFears(answers: Map<string, string | number>): string[] {
  const fears = [];
  
  if (getScore(answers, 'failure') > 3) fears.push('Professional failure');
  if (getScore(answers, 'rejection') > 3) fears.push('Social rejection');
  if (getScore(answers, 'instability') > 3) fears.push('Financial instability');
  if (getScore(answers, 'loneliness') > 3) fears.push('Isolation');
  
  return fears.slice(0, 3);
}

export function inferGoals(answers: Map<string, string | number>): string[] {
  const goals = [];
  
  if (getScore(answers, 'leadership') > 3) goals.push('Leadership role');
  if (getScore(answers, 'expertise') > 3) goals.push('Domain expertise');
  if (getScore(answers, 'impact') > 3) goals.push('Positive impact');
  if (getScore(answers, 'growth') > 3) goals.push('Personal growth');
  
  return goals.slice(0, 4);
}

export function determineDecisionStyle(answers: Map<string, string | number>, bigFive: BigFiveScores): 'analytical' | 'intuitive' | 'balanced' | 'spontaneous' {
  const analyticalScore = (bigFive.conscientiousness + getScore(answers, 'research', 50)) / 2;
  const intuitiveScore = (bigFive.openness + getScore(answers, 'intuition', 50)) / 2;
  
  if (analyticalScore > 75) return 'analytical';
  if (intuitiveScore > 75) return 'intuitive';
  if (getScore(answers, 'quick_decisions') > 80) return 'spontaneous';
  return 'balanced';
}

function getScore(answers: Map<string, string | number>, key: string, defaultValue = 50): number {
  const value = answers.get(key);
  return typeof value === 'number' ? (value / 5) * 100 : defaultValue;
}

export function validateProfileCompleteness(profile: UserProfile): number {
  let completeness = 0;
  
  if (profile.age > 0) completeness += 20;
  if (profile.occupation) completeness += 15;
  if (profile.values.length > 0) completeness += 20;
  if (profile.goals.length > 0) completeness += 20;
  if (profile.fears.length > 0) completeness += 15;
  if (profile.decisionStyle) completeness += 10;
  
  return completeness;
}