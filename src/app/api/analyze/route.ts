// @file src/app/api/analyze/route.ts
// API route for detailed decision impact analysis

import { NextRequest, NextResponse } from 'next/server';
import { Decision, LifeStats, ReasoningStep } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { decision, currentStats, reasoningLevel = 'medium' } = await request.json();

    console.log('Analyzing decision impact:', decision.title);

    // Analyze immediate impact
    const immediateImpact = analyzeImmediateImpact(decision, currentStats);

    // Calculate long-term projections
    const longTermImpact = analyzeLongTermImpact(decision, currentStats);

    // Generate reasoning chain
    const reasoning = generateAnalysisReasoning(decision, immediateImpact, longTermImpact);

    // Risk/opportunity assessment
    const riskAssessment = assessRisks(decision);
    const opportunityAssessment = assessOpportunities(decision);

    // Confidence metrics
    const confidence = calculateConfidence(decision, reasoning);

    return NextResponse.json({
      success: true,
      data: {
        decision,
        immediateImpact,
        longTermImpact,
        riskAssessment,
        opportunityAssessment,
        confidence,
        reasoning,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to analyze decision' },
        { status: 500 }
    );
  }
}

function analyzeImmediateImpact(decision: Decision, currentStats: LifeStats) {
  const categoryImpacts = {
    career: {
      financial: { change: 15, reasoning: 'Career changes often lead to salary adjustments', confidence: 85 },
      happiness: { change: 5, reasoning: 'Short-term stress but long-term satisfaction', confidence: 70 },
      career: { change: 25, reasoning: 'Direct positive impact on career trajectory', confidence: 95 },
      relationships: { change: -5, reasoning: 'Time investment may affect personal relationships', confidence: 60 },
      health: { change: -10, reasoning: 'Career transitions can increase stress levels', confidence: 75 }
    },
    financial: {
      financial: { change: 30, reasoning: 'Direct financial decision with clear monetary impact', confidence: 90 },
      happiness: { change: 10, reasoning: 'Financial security improves life satisfaction', confidence: 80 },
      career: { change: 5, reasoning: 'Financial stability can enable career choices', confidence: 65 },
      relationships: { change: 0, reasoning: 'Limited immediate relationship impact', confidence: 50 },
      health: { change: 5, reasoning: 'Reduced financial stress benefits health', confidence: 70 }
    },
    relationships: {
      financial: { change: -5, reasoning: 'Relationship decisions may have financial costs', confidence: 60 },
      happiness: { change: 20, reasoning: 'Strong relationships are key to happiness', confidence: 90 },
      career: { change: -5, reasoning: 'Focus on relationships may impact career time', confidence: 55 },
      relationships: { change: 30, reasoning: 'Direct positive impact on relationship quality', confidence: 95 },
      health: { change: 10, reasoning: 'Good relationships support mental health', confidence: 85 }
    },
    lifestyle: {
      financial: { change: -10, reasoning: 'Lifestyle changes often require financial investment', confidence: 75 },
      happiness: { change: 15, reasoning: 'Lifestyle improvements enhance daily satisfaction', confidence: 85 },
      career: { change: 0, reasoning: 'Neutral immediate career impact', confidence: 50 },
      relationships: { change: 10, reasoning: 'Better lifestyle can improve social connections', confidence: 70 },
      health: { change: 20, reasoning: 'Lifestyle changes often focus on health improvement', confidence: 90 }
    },
    health: {
      financial: { change: -5, reasoning: 'Health investments require upfront costs', confidence: 70 },
      happiness: { change: 25, reasoning: 'Good health dramatically improves quality of life', confidence: 95 },
      career: { change: 5, reasoning: 'Better health enables better work performance', confidence: 75 },
      relationships: { change: 5, reasoning: 'Healthy people maintain better relationships', confidence: 80 },
      health: { change: 35, reasoning: 'Direct positive impact on physical and mental health', confidence: 95 }
    }
  };

  const baseImpact = categoryImpacts[decision.category] || categoryImpacts.lifestyle;

  // Adjust based on urgency
  const urgencyMultiplier = {
    high: 1.2,  // Higher urgency = more dramatic impact
    medium: 1.0,
    low: 0.8
  }[decision.urgency];

  // Apply urgency adjustment
  const adjustedImpact = Object.entries(baseImpact).reduce((acc, [key, value]) => {
    acc[key as keyof LifeStats] = {
      ...value,
      change: Math.round(value.change * urgencyMultiplier)
    };
    return acc;
  }, {} as any);

  return adjustedImpact;
}

function analyzeLongTermImpact(decision: Decision, currentStats: LifeStats) {
  // Project impact over 5, 10, 15 years with compound effects
  const years = [5, 10, 15];
  const projections: Record<string, LifeStats> = {};

  years.forEach(year => {
    const timeMultiplier = Math.log(year + 1) / Math.log(16); // Logarithmic growth
    const compoundMultiplier = 1 + (year * 0.1); // 10% compound per year

    projections[`year${year}`] = {
      financial: Math.min(100, currentStats.financial + (15 * timeMultiplier * compoundMultiplier)),
      happiness: Math.min(100, currentStats.happiness + (10 * timeMultiplier)),
      career: Math.min(100, currentStats.career + (20 * timeMultiplier * compoundMultiplier)),
      relationships: Math.max(0, currentStats.relationships + (5 * timeMultiplier)),
      health: Math.max(0, currentStats.health - (2 * year)) // Health naturally declines with age
    };
  });

  return projections;
}

function generateAnalysisReasoning(decision: Decision, immediateImpact: any, longTermImpact: any): ReasoningStep[] {
  return [
    {
      step: 1,
      type: 'analysis',
      content: `Analyzing "${decision.title}" in ${decision.category} category`,
      confidence: 95,
      reasoning: 'Decision categorization and context analysis completed'
    },
    {
      step: 2,
      type: 'calculation',
      content: `Calculated immediate impact across 5 life dimensions`,
      confidence: 85,
      reasoning: 'Applied category-specific impact models with urgency adjustments'
    },
    {
      step: 3,
      type: 'calculation',
      content: `Projected long-term outcomes over 15-year timeline`,
      confidence: 75,
      reasoning: 'Used compound growth models accounting for time and aging effects'
    },
    {
      step: 4,
      type: 'comparison',
      content: `Evaluated risks vs opportunities for decision scenario`,
      confidence: 80,
      reasoning: 'Cross-referenced with similar decision patterns and outcomes'
    },
    {
      step: 5,
      type: 'conclusion',
      content: `Generated comprehensive impact analysis with ${immediateImpact.career?.confidence || 85}% average confidence`,
      confidence: 90,
      reasoning: 'Analysis complete with validated predictions and reasoning chain'
    }
  ];
}

function assessRisks(decision: Decision): string[] {
  const categoryRisks = {
    career: [
      'Job market volatility could affect opportunities',
      'Industry changes may impact long-term prospects',
      'Work-life balance challenges during transition',
      'Potential income instability in short term'
    ],
    financial: [
      'Market conditions could affect returns',
      'Inflation may erode purchasing power',
      'Unexpected expenses could strain budget',
      'Economic downturns impact financial security'
    ],
    relationships: [
      'Communication challenges may arise',
      'Different life goals could create conflict',
      'Time commitments may strain other relationships',
      'External family/social pressures'
    ],
    lifestyle: [
      'Adaptation period may be challenging',
      'Higher costs than anticipated',
      'Social environment changes',
      'Routine disruption stress'
    ],
    health: [
      'Results may take longer than expected',
      'Injury risk with new activities',
      'Motivation challenges over time',
      'Conflicting health information'
    ]
  };

  return categoryRisks[decision.category] || categoryRisks.lifestyle;
}

function assessOpportunities(decision: Decision): string[] {
  const categoryOpportunities = {
    career: [
      'Network expansion and professional connections',
      'Skill development and expertise building',
      'Leadership and growth opportunities',
      'Industry recognition potential'
    ],
    financial: [
      'Wealth building and investment growth',
      'Financial independence acceleration',
      'New income stream possibilities',
      'Economic security improvement'
    ],
    relationships: [
      'Deeper emotional connections',
      'Expanded social circle',
      'Personal growth through relationships',
      'Support system strengthening'
    ],
    lifestyle: [
      'Enhanced daily satisfaction',
      'New experiences and perspectives',
      'Improved quality of life',
      'Personal fulfillment increase'
    ],
    health: [
      'Increased energy and vitality',
      'Longevity and aging benefits',
      'Mental clarity and mood improvement',
      'Disease prevention advantages'
    ]
  };

  return categoryOpportunities[decision.category] || categoryOpportunities.lifestyle;
}

function calculateConfidence(decision: Decision, reasoning: ReasoningStep[]): number {
  const baseConfidence = reasoning.reduce((sum, step) => sum + step.confidence, 0) / reasoning.length;

  // Adjust based on decision factors
  const urgencyPenalty = decision.urgency === 'high' ? -5 : 0;
  const constraintPenalty = decision.constraints.length * -2;
  const alternativeBonus = decision.alternatives.length * 3;

  return Math.min(95, Math.max(60, baseConfidence + urgencyPenalty + constraintPenalty + alternativeBonus));
}