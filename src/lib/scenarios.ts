import { Scenario, Decision, LifeStats, AIPersonality, UserProfile } from './types';

export function compareScenarios(scenarios: Scenario[]): ScenarioComparison {
  const metrics: (keyof LifeStats)[] = ['financial', 'happiness', 'career', 'relationships', 'health'];
  
  return {
    summary: generateComparisonSummary(scenarios),
    bestFor: findBestScenarioFor(scenarios, metrics),
    riskAnalysis: analyzeRisks(scenarios),
    tradeoffs: identifyTradeoffs(scenarios, metrics),
    recommendation: generateRecommendation(scenarios)
  };
}

interface ScenarioComparison {
  summary: string;
  bestFor: Record<string, string>;
  riskAnalysis: { scenario: string; riskLevel: 'low' | 'medium' | 'high'; reasoning: string }[];
  tradeoffs: { metric: string; bestScenario: string; worstScenario: string; difference: number }[];
  recommendation: string;
}

function generateComparisonSummary(scenarios: Scenario[]): string {
  const bestOverall = scenarios.reduce((best, current) => 
    getOverallScore(current) > getOverallScore(best) ? current : best
  );
  
  return `${bestOverall.title} shows the highest overall potential with ${bestOverall.probability}% likelihood.`;
}

function getOverallScore(scenario: Scenario): number {
  const stats = scenario.timeline.year10;
  return (stats.financial + stats.happiness + stats.career + stats.relationships + stats.health) / 5;
}

function findBestScenarioFor(scenarios: Scenario[], metrics: (keyof LifeStats)[]): Record<string, string> {
  const bestFor: Record<string, string> = {};
  
  metrics.forEach(metric => {
    const best = scenarios.reduce((best, current) => 
      current.timeline.year10[metric] > best.timeline.year10[metric] ? current : best
    );
    bestFor[metric] = best.title;
  });
  
  return bestFor;
}

function analyzeRisks(scenarios: Scenario[]): { scenario: string; riskLevel: 'low' | 'medium' | 'high'; reasoning: string }[] {
  return scenarios.map(scenario => ({
    scenario: scenario.title,
    riskLevel: getRiskLevel(scenario),
    reasoning: getRiskReasoning(scenario)
  }));
}

function getRiskLevel(scenario: Scenario): 'low' | 'medium' | 'high' {
  if (scenario.probability > 50) return 'low';
  if (scenario.probability > 30) return 'medium';
  return 'high';
}

function getRiskReasoning(scenario: Scenario): string {
  const riskFactors = scenario.risks.length;
  const probability = scenario.probability;
  
  if (probability > 50 && riskFactors < 3) {
    return 'High probability with manageable risks';
  } else if (probability > 30) {
    return 'Moderate probability with some challenges';
  }
  return 'Lower probability but high potential rewards';
}

function identifyTradeoffs(scenarios: Scenario[], metrics: (keyof LifeStats)[]): { metric: string; bestScenario: string; worstScenario: string; difference: number }[] {
  return metrics.map(metric => {
    const sorted = scenarios.sort((a, b) => b.timeline.year10[metric] - a.timeline.year10[metric]);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    
    return {
      metric,
      bestScenario: best.title,
      worstScenario: worst.title,
      difference: best.timeline.year10[metric] - worst.timeline.year10[metric]
    };
  });
}

function generateRecommendation(scenarios: Scenario[]): string {
  const sortedByProbability = scenarios.sort((a, b) => b.probability - a.probability);
  const mostLikely = sortedByProbability[0];
  
  const sortedByOverallScore = scenarios.sort((a, b) => getOverallScore(b) - getOverallScore(a));
  const bestOutcome = sortedByOverallScore[0];
  
  if (mostLikely === bestOutcome) {
    return `${mostLikely.title} offers the best balance of likelihood and outcomes.`;
  }
  
  return `Consider ${mostLikely.title} for reliability or ${bestOutcome.title} for maximum potential.`;
}

export function generateScenarioInsights(scenario: Scenario, userProfile?: UserProfile): ScenarioInsights {
  return {
    keyStrengths: identifyStrengths(scenario),
    mainConcerns: identifyMainConcerns(scenario),
    timelineHighlights: extractTimelineHighlights(scenario),
    personalFit: assessPersonalFit(scenario, userProfile),
    actionItems: generateActionItems(scenario)
  };
}

interface ScenarioInsights {
  keyStrengths: string[];
  mainConcerns: string[];
  timelineHighlights: { year: number; milestone: string }[];
  personalFit: number; // 0-100
  actionItems: string[];
}

function identifyStrengths(scenario: Scenario): string[] {
  const strengths = [];
  const year10 = scenario.timeline.year10;
  
  if (year10.financial > 80) strengths.push('Strong financial position');
  if (year10.happiness > 80) strengths.push('High life satisfaction');
  if (year10.career > 80) strengths.push('Excellent career growth');
  if (year10.relationships > 80) strengths.push('Thriving relationships');
  if (year10.health > 80) strengths.push('Optimal health outcomes');
  
  return strengths.slice(0, 3);
}

function identifyMainConcerns(scenario: Scenario): string[] {
  return scenario.risks.slice(0, 2);
}

function extractTimelineHighlights(scenario: Scenario): { year: number; milestone: string }[] {
  return [
    { year: 5, milestone: scenario.keyMilestones[1] || 'Initial progress milestone' },
    { year: 10, milestone: scenario.keyMilestones[2] || 'Major achievement reached' },
    { year: 15, milestone: scenario.keyMilestones[3] || 'Long-term success established' }
  ];
}

function assessPersonalFit(scenario: Scenario, userProfile?: UserProfile): number {
  if (!userProfile) return 75; // Default moderate fit
  
  let fit = 50;
  
  // Align with user's risk tolerance
  if (userProfile.decisionStyle === 'analytical' && scenario.personality === 'realistic') fit += 20;
  if (userProfile.decisionStyle === 'intuitive' && scenario.personality === 'optimistic') fit += 15;
  
  // Check value alignment
  if (userProfile.values.includes('Financial Security') && scenario.timeline.year10.financial > 70) fit += 15;
  if (userProfile.values.includes('Work-Life Balance') && scenario.timeline.year10.happiness > 75) fit += 10;
  
  return Math.min(100, fit);
}

function generateActionItems(scenario: Scenario): string[] {
  const actions = [];
  
  if (scenario.risks.length > 2) {
    actions.push('Develop risk mitigation strategies');
  }
  
  if (scenario.timeline.year5.career < scenario.timeline.year10.career) {
    actions.push('Focus on skill development in early years');
  }
  
  if (scenario.opportunities.length > 2) {
    actions.push('Identify and pursue key opportunities');
  }
  
  return actions.slice(0, 3);
}