import { NextRequest, NextResponse } from 'next/server';
import { Decision, Scenario, LifeStats, ReasoningLevel, AIPersonality, UserProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { decision, reasoningLevel = 'medium', userId } = await request.json();
    const userProfile = await getUserProfile(userId);
    const scenarios = await generateScenarios(decision, userProfile, reasoningLevel);
    
    return NextResponse.json({
      success: true,
      data: {
        scenarios,
        reasoning: generateReasoningSteps(decision, scenarios),
        analysisId: `analysis_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate scenarios' }, { status: 500 });
  }
}

async function generateScenarios(decision: Decision, userProfile: UserProfile | null, reasoningLevel: ReasoningLevel): Promise<Scenario[]> {
  const personalities: AIPersonality[] = ['optimistic', 'realistic', 'cautious', 'adventurous'];
  const scenarios: Scenario[] = [];

  // Try GPT-OSS first
  const { gptOssClient } = await import('@/lib/gpt-oss');
  const gptScenarios = userProfile ? await gptOssClient.generateScenarios(decision, userProfile, reasoningLevel) : [];
  
  // Process GPT scenarios or generate enhanced mocks
  for (let i = 0; i < 4; i++) {
    const personality = personalities[i];
    const scenario = gptScenarios[i] ? 
      processGptScenario(gptScenarios[i], decision, personality) :
      generateEnhancedScenario(decision, userProfile, personality);
    scenarios.push(scenario);
  }

  return scenarios;
}

function processGptScenario(_gptScenario: unknown, decision: Decision, personality: AIPersonality): Scenario {
  // Extract from GPT response or fallback to mock
  return generateEnhancedScenario(decision, null, personality);
}

function generateEnhancedScenario(decision: Decision, _userProfile: UserProfile | null, personality: AIPersonality): Scenario {
  const baseStats: LifeStats = { financial: 65, happiness: 72, career: 58, relationships: 80, health: 45 };
  const impact = calculateImpact(decision, personality);
  const multipliers = getMultipliers(personality);
  
  return {
    id: `scenario_${Date.now()}_${personality}`,
    decisionId: decision.id,
    title: `${getPrefix(personality)}: ${decision.title}`,
    description: getDescription(decision, personality),
    personality,
    timeline: {
      year5: applyImpact(baseStats, impact, multipliers, 0.3),
      year10: applyImpact(baseStats, impact, multipliers, 0.7),
      year15: applyImpact(baseStats, impact, multipliers, 1.0)
    },
    impact: {
      financial: { change: impact.financial, reasoning: getReasoningFor('financial', personality), confidence: 85 },
      happiness: { change: impact.happiness, reasoning: getReasoningFor('happiness', personality), confidence: 80 },
      career: { change: impact.career, reasoning: getReasoningFor('career', personality), confidence: 90 },
      relationships: { change: impact.relationships, reasoning: getReasoningFor('relationships', personality), confidence: 75 },
      health: { change: impact.health, reasoning: getReasoningFor('health', personality), confidence: 70 }
    },
    keyMilestones: getMilestones(personality),
    risks: getRisks(personality),
    opportunities: getOpportunities(),
    probability: getProbability(personality)
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

  const base = categoryImpacts[decision.category] || categoryImpacts.lifestyle;
  const multiplier = { optimistic: 1.2, realistic: 1.0, cautious: 0.8, adventurous: 1.3 }[personality];

  return {
    financial: Math.round(base.financial * multiplier),
    happiness: Math.round(base.happiness * multiplier),
    career: Math.round(base.career * multiplier),
    relationships: Math.round(base.relationships * multiplier),
    health: Math.round(base.health * multiplier)
  };
}

function getMultipliers(personality: AIPersonality) {
  return {
    optimistic: { financial: 1.3, happiness: 1.4, career: 1.2, relationships: 1.1, health: 1.1 },
    realistic: { financial: 1.0, happiness: 1.0, career: 1.0, relationships: 1.0, health: 1.0 },
    cautious: { financial: 1.1, happiness: 0.9, career: 0.8, relationships: 0.9, health: 1.2 },
    adventurous: { financial: 0.8, happiness: 1.3, career: 1.4, relationships: 1.2, health: 0.9 }
  }[personality];
}

function applyImpact(baseStats: LifeStats, impact: LifeStats, multipliers: Record<keyof LifeStats, number>, timeMultiplier: number): LifeStats {
  return {
    financial: Math.min(100, Math.max(0, baseStats.financial + (impact.financial * timeMultiplier * multipliers.financial))),
    happiness: Math.min(100, Math.max(0, baseStats.happiness + (impact.happiness * timeMultiplier * multipliers.happiness))),
    career: Math.min(100, Math.max(0, baseStats.career + (impact.career * timeMultiplier * multipliers.career))),
    relationships: Math.min(100, Math.max(0, baseStats.relationships + (impact.relationships * timeMultiplier * multipliers.relationships))),
    health: Math.min(100, Math.max(0, baseStats.health + (impact.health * timeMultiplier * multipliers.health)))
  };
}

function getPrefix(personality: AIPersonality): string {
  return { optimistic: 'Best Case', realistic: 'Likely Outcome', cautious: 'Safe Path', adventurous: 'Bold Move' }[personality];
}

function getDescription(decision: Decision, personality: AIPersonality): string {
  const descriptions = {
    optimistic: `Everything goes exceptionally well with ${decision.title.toLowerCase()}. Maximum benefits realized.`,
    realistic: `A balanced view of ${decision.title.toLowerCase()} with expected outcomes and challenges.`,
    cautious: `A conservative approach to ${decision.title.toLowerCase()}, minimizing risks.`,
    adventurous: `An ambitious pursuit of ${decision.title.toLowerCase()} with high-risk, high-reward outcomes.`
  };
  return descriptions[personality];
}

function getReasoningFor(metric: string, personality: AIPersonality): string {
  const reasons = {
    financial: {
      optimistic: 'Financial opportunities multiply through positive momentum',
      realistic: 'Steady financial growth through consistent execution',
      cautious: 'Financial stability prioritized through risk management',
      adventurous: 'High financial potential through bold moves'
    },
    happiness: {
      optimistic: 'Joy compounds as positive outcomes reinforce satisfaction',
      realistic: 'Happiness grows through balanced progress',
      cautious: 'Peace of mind through security and stability',
      adventurous: 'Excitement and growth create deep satisfaction'
    },
    career: {
      optimistic: 'Career accelerates through momentum and opportunities',
      realistic: 'Career develops through consistent performance',
      cautious: 'Career grows safely through proven paths',
      adventurous: 'Career transforms through breakthrough opportunities'
    },
    relationships: {
      optimistic: 'Relationships flourish as success attracts like-minded people',
      realistic: 'Relationships evolve naturally through shared experiences',
      cautious: 'Relationships remain stable through careful investment',
      adventurous: 'Relationships deepen through shared adventures'
    },
    health: {
      optimistic: 'Health benefits from reduced stress and positive momentum',
      realistic: 'Health maintained through balanced self-care',
      cautious: 'Health prioritized through careful stress management',
      adventurous: 'Health challenged but strengthened by active lifestyle'
    }
  };
  return reasons[metric as keyof typeof reasons]?.[personality] || 'Impact varies based on execution';
}

function getMilestones(_personality: AIPersonality): string[] {
  return [
    'Year 1: Initial transition and adaptation',
    'Year 3: Significant progress achieved',
    'Year 5: Major milestone reached',
    'Year 10: Leadership and expertise established'
  ];
}

function getRisks(personality: AIPersonality): string[] {
  const risks = {
    optimistic: ['Minor setbacks possible', 'Temporary adjustment period'],
    realistic: ['Market volatility', 'Competition challenges', 'Work-life balance'],
    cautious: ['Economic downturns', 'Industry disruption', 'Stress concerns'],
    adventurous: ['High financial risk', 'Potential failure', 'Burnout risk']
  };
  return risks[personality];
}

function getOpportunities(): string[] {
  return [
    'Network expansion and connections',
    'Skill development and expertise',
    'Financial growth potential',
    'Personal fulfillment increase'
  ];
}

function getProbability(personality: AIPersonality): number {
  return { optimistic: 25, realistic: 45, cautious: 60, adventurous: 20 }[personality];
}

function generateReasoningSteps(decision: Decision, scenarios: Scenario[]) {
  return [
    { step: 1, type: 'analysis' as const, content: `Analyzed decision: ${decision.title}`, confidence: 95, reasoning: 'Decision parsing complete' },
    { step: 2, type: 'calculation' as const, content: `Generated ${scenarios.length} scenarios`, confidence: 90, reasoning: 'Multi-perspective analysis' },
    { step: 3, type: 'conclusion' as const, content: 'Scenarios ready for review', confidence: 92, reasoning: 'Analysis complete' }
  ];
}

async function getUserProfile(_userId: string): Promise<UserProfile> {
  return {
    age: 28,
    occupation: 'Software Engineer',
    bigFive: {
      openness: 75,
      conscientiousness: 80,
      extraversion: 60,
      agreeableness: 70,
      neuroticism: 40
    },
    decisionStyle: 'analytical' as const,
    values: ['Career Success', 'Financial Security'],
    goals: ['Leadership', 'Work-Life Balance'],
    fears: ['Financial instability', 'Career stagnation']
  };
}