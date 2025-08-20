// @file src/app/api/generate/route.ts
// API route to generate scenarios with gpt-oss

import { NextRequest, NextResponse } from 'next/server';
import { Decision, Scenario, LifeStats, ReasoningLevel, AIPersonality } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { decision, reasoningLevel = 'medium', userId } = await request.json();

    console.log('Generating scenarios for:', decision.title);

    // Get user profile (mock for now)
    const userProfile = await getUserProfile(userId);

    // Generate 4 different scenarios
    const scenarios = await generateScenarios(decision, userProfile, reasoningLevel);

    // Calculate reasoning steps for transparency
    const reasoning = generateReasoningSteps(decision, scenarios);

    return NextResponse.json({
      success: true,
      data: {
        scenarios,
        reasoning,
        analysisId: `analysis_${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to generate scenarios' },
        { status: 500 }
    );
  }
}

async function generateScenarios(
    decision: Decision,
    userProfile: any,
    reasoningLevel: ReasoningLevel
): Promise<Scenario[]> {

  const personalities: AIPersonality[] = ['optimistic', 'realistic', 'cautious', 'adventurous'];
  const scenarios: Scenario[] = [];

  for (let i = 0; i < personalities.length; i++) {
    const personality = personalities[i];

    // Mock scenario generation (replace with real gpt-oss call)
    const scenario = await generateSingleScenario(decision, userProfile, personality, reasoningLevel);
    scenarios.push(scenario);
  }

  return scenarios;
}

async function generateSingleScenario(
    decision: Decision,
    userProfile: any,
    personality: AIPersonality,
    reasoningLevel: ReasoningLevel
): Promise<Scenario> {

  // Mock data - replace with real gpt-oss integration
  const baseStats = { financial: 65, happiness: 72, career: 58, relationships: 80, health: 45 };

  const personalityMultipliers = {
    optimistic: { financial: 1.3, happiness: 1.4, career: 1.2, relationships: 1.1, health: 1.1 },
    realistic: { financial: 1.0, happiness: 1.0, career: 1.0, relationships: 1.0, health: 1.0 },
    cautious: { financial: 1.1, happiness: 0.9, career: 0.8, relationships: 0.9, health: 1.2 },
    adventurous: { financial: 0.8, happiness: 1.3, career: 1.4, relationships: 1.2, health: 0.9 }
  };

  const multipliers = personalityMultipliers[personality];
  const impact = calculateImpact(decision, personality);

  const futureStats = {
    year5: applyImpact(baseStats, impact, multipliers, 0.3),
    year10: applyImpact(baseStats, impact, multipliers, 0.7),
    year15: applyImpact(baseStats, impact, multipliers, 1.0)
  };

  return {
    id: `scenario_${Date.now()}_${personality}`,
    decisionId: decision.id,
    title: generateScenarioTitle(decision, personality),
    description: generateScenarioDescription(decision, personality),
    personality,
    timeline: futureStats,
    impact: {
      financial: { change: impact.financial, reasoning: 'Based on decision impact analysis', confidence: 85 },
      happiness: { change: impact.happiness, reasoning: 'Considering lifestyle changes', confidence: 80 },
      career: { change: impact.career, reasoning: 'Professional growth trajectory', confidence: 90 },
      relationships: { change: impact.relationships, reasoning: 'Social impact assessment', confidence: 75 },
      health: { change: impact.health, reasoning: 'Stress and lifestyle factors', confidence: 70 }
    },
    keyMilestones: generateMilestones(decision, personality),
    risks: generateRisks(decision, personality),
    opportunities: generateOpportunities(decision, personality),
    probability: calculateProbability(decision, personality)
  };
}

function calculateImpact(decision: Decision, personality: AIPersonality): LifeStats {
  const categoryImpacts = {
    career: { financial: 15, happiness: 5, career: 25, relationships: -5, health: -10 },
    financial: { financial: 30, happiness: 10, career: 5, relationships: 0, health: 5 },
    relationships: { financial: -5, happiness: 20, career: -5, relationships: 30, health: 10 },
    lifestyle: { financial: -10, happiness: 15, career: 0, relationships: 10, health: 20 },
    health: { financial: -5, happiness: 25, career: 5, relationships: 5, health: 35 }
  };

  const baseImpact = categoryImpacts[decision.category] || categoryImpacts.lifestyle;

  // Adjust based on personality
  const personalityAdjustments = {
    optimistic: 1.2,
    realistic: 1.0,
    cautious: 0.8,
    adventurous: 1.3
  };

  const multiplier = personalityAdjustments[personality];

  return {
    financial: Math.round(baseImpact.financial * multiplier),
    happiness: Math.round(baseImpact.happiness * multiplier),
    career: Math.round(baseImpact.career * multiplier),
    relationships: Math.round(baseImpact.relationships * multiplier),
    health: Math.round(baseImpact.health * multiplier)
  };
}

function applyImpact(baseStats: LifeStats, impact: LifeStats, multipliers: any, timeMultiplier: number): LifeStats {
  return {
    financial: Math.min(100, Math.max(0, baseStats.financial + (impact.financial * timeMultiplier * multipliers.financial))),
    happiness: Math.min(100, Math.max(0, baseStats.happiness + (impact.happiness * timeMultiplier * multipliers.happiness))),
    career: Math.min(100, Math.max(0, baseStats.career + (impact.career * timeMultiplier * multipliers.career))),
    relationships: Math.min(100, Math.max(0, baseStats.relationships + (impact.relationships * timeMultiplier * multipliers.relationships))),
    health: Math.min(100, Math.max(0, baseStats.health + (impact.health * timeMultiplier * multipliers.health)))
  };
}

function generateScenarioTitle(decision: Decision, personality: AIPersonality): string {
  const titles = {
    optimistic: `Best Case: ${decision.title}`,
    realistic: `Likely Outcome: ${decision.title}`,
    cautious: `Conservative Path: ${decision.title}`,
    adventurous: `Bold Move: ${decision.title}`
  };
  return titles[personality];
}

function generateScenarioDescription(decision: Decision, personality: AIPersonality): string {
  const descriptions = {
    optimistic: `Everything goes exceptionally well with ${decision.title.toLowerCase()}. Maximum benefits realized.`,
    realistic: `A balanced view of ${decision.title.toLowerCase()} with expected outcomes and normal challenges.`,
    cautious: `A conservative approach to ${decision.title.toLowerCase()}, minimizing risks and ensuring stability.`,
    adventurous: `An ambitious pursuit of ${decision.title.toLowerCase()} with bold moves and high-risk, high-reward outcomes.`
  };
  return descriptions[personality];
}

function generateMilestones(decision: Decision, personality: AIPersonality): string[] {
  return [
    `Year 1: Initial transition and adaptation period`,
    `Year 3: Significant progress and skill development`,
    `Year 5: Major achievement and recognition`,
    `Year 10: Leadership position and expertise established`
  ];
}

function generateRisks(decision: Decision, personality: AIPersonality): string[] {
  const riskLevels = {
    optimistic: ['Minor setbacks possible', 'Temporary financial adjustment'],
    realistic: ['Market volatility', 'Competition challenges', 'Work-life balance issues'],
    cautious: ['Economic downturns', 'Industry disruption', 'Health concerns from stress'],
    adventurous: ['High financial risk', 'Potential failure', 'Relationship strain', 'Burnout risk']
  };
  return riskLevels[personality];
}

function generateOpportunities(decision: Decision, personality: AIPersonality): string[] {
  return [
    'Network expansion and new connections',
    'Skill development and expertise building',
    'Financial growth potential',
    'Personal fulfillment and satisfaction'
  ];
}

function calculateProbability(decision: Decision, personality: AIPersonality): number {
  const baseProbabilities = {
    optimistic: 25,
    realistic: 45,
    cautious: 60,
    adventurous: 20
  };

  const urgencyModifier = decision.urgency === 'high' ? -5 : decision.urgency === 'low' ? 5 : 0;

  return Math.min(95, Math.max(5, baseProbabilities[personality] + urgencyModifier));
}

function generateReasoningSteps(decision: Decision, scenarios: Scenario[]) {
  return [
    { step: 1, type: 'analysis' as const, content: `Analyzed decision: ${decision.title}`, confidence: 95, reasoning: 'Decision parsing complete' },
    { step: 2, type: 'calculation' as const, content: `Generated ${scenarios.length} scenarios`, confidence: 90, reasoning: 'Multi-perspective analysis' },
    { step: 3, type: 'comparison' as const, content: 'Compared outcomes across personalities', confidence: 85, reasoning: 'Cross-scenario validation' },
    { step: 4, type: 'conclusion' as const, content: 'Scenarios ready for user review', confidence: 92, reasoning: 'Analysis complete' }
  ];
}

async function getUserProfile(userId: string) {
  // Mock user profile - replace with real database lookup
  return {
    age: 28,
    decisionStyle: 'analytical',
    riskTolerance: 3,
    values: ['Career Success', 'Financial Security']
  };
}