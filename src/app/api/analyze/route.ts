import { NextRequest, NextResponse } from 'next/server';
import { Decision, LifeStats, ReasoningLevel } from '@/lib/types';
import { generateTransparentReasoning } from '@/lib/reasoning';

export async function POST(request: NextRequest) {
  try {
    const { decision, currentStats, reasoningLevel = 'medium' } = await request.json();
    
    // Try AI-enhanced analysis first
    const analysis = await analyzeDecisionWithAI(decision, currentStats, reasoningLevel) ||
                    await analyzeDecisionEnhanced(decision, currentStats, reasoningLevel);

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze decision' }, { status: 500 });
  }
}

async function analyzeDecisionWithAI(decision: Decision, currentStats: LifeStats, reasoningLevel: ReasoningLevel) {
  try {
    const { callGptOss } = await import('@/lib/gpt-oss');
    
    const prompt = `Analyze this decision: ${decision.title}
Category: ${decision.category}, Urgency: ${decision.urgency}
Current stats: Financial ${currentStats.financial}, Happiness ${currentStats.happiness}, Career ${currentStats.career}

Provide detailed impact analysis with percentage changes and reasoning for each life metric.`;

    const response = await callGptOss(prompt, 'realistic', reasoningLevel, 'analysis');
    
    if (response) {
      const enhanced = await analyzeDecisionEnhanced(decision, currentStats, reasoningLevel);
      return {
        ...enhanced,
        reasoning: [{
          step: 1, type: 'analysis' as const, content: 'AI-enhanced analysis completed',
          confidence: 92, reasoning: response.reasoning.substring(0, 200)
        }, ...enhanced.reasoning]
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function analyzeDecisionEnhanced(decision: Decision, currentStats: LifeStats, _reasoningLevel: ReasoningLevel) {
  const immediateImpact = calculateImpact(decision, currentStats);
  const longTermImpact = projectLongTermImpact(currentStats, immediateImpact);
  const reasoning = generateTransparentReasoning(decision, [], 'analysis');
  
  return {
    decision,
    immediateImpact,
    longTermImpact,
    riskAssessment: assessRisks(decision),
    opportunityAssessment: assessOpportunities(decision),
    confidence: calculateConfidence(decision, reasoning),
    reasoning
  };
}

function calculateImpact(decision: Decision, currentStats: LifeStats) {
  const categoryImpacts = {
    career: { financial: 15, happiness: 5, career: 25, relationships: -5, health: -10 },
    financial: { financial: 30, happiness: 10, career: 5, relationships: 0, health: 5 },
    relationships: { financial: -5, happiness: 20, career: -5, relationships: 30, health: 10 },
    lifestyle: { financial: -10, happiness: 15, career: 0, relationships: 10, health: 20 },
    health: { financial: -5, happiness: 25, career: 5, relationships: 5, health: 35 }
  };

  const baseImpact = categoryImpacts[decision.category] || categoryImpacts.lifestyle;
  const urgencyMultiplier = { high: 1.2, medium: 1.0, low: 0.8 }[decision.urgency];

  return Object.entries(baseImpact).reduce((acc, [key, value]) => {
    const adjustedChange = Math.round(value * urgencyMultiplier);
    const currentLevel = currentStats[key as keyof LifeStats];
    
    acc[key as keyof LifeStats] = {
      change: adjustedChange,
      reasoning: `${decision.category} decision with ${decision.urgency} urgency. Current level: ${currentLevel}`,
      confidence: Math.max(70, Math.min(95, 85 + (currentLevel > 50 ? 5 : -5)))
    };
    return acc;
  }, {} as Record<keyof LifeStats, { change: number; reasoning: string; confidence: number }>);
}

function projectLongTermImpact(currentStats: LifeStats, immediateImpact: Record<keyof LifeStats, { change: number; reasoning: string; confidence: number }>) {
  const years = [5, 10, 15];
  const projections: Record<string, LifeStats> = {};

  years.forEach(year => {
    const timeMultiplier = Math.log(year + 1) / Math.log(16);
    projections[`year${year}`] = Object.entries(currentStats).reduce((acc, [key, currentValue]) => {
      const impact = immediateImpact[key as keyof LifeStats];
      const projectedValue = currentValue + (impact.change * timeMultiplier);
      acc[key as keyof LifeStats] = Math.min(100, Math.max(0, Math.round(projectedValue)));
      return acc;
    }, {} as LifeStats);
  });

  return projections;
}

function assessRisks(decision: Decision): string[] {
  const categoryRisks = {
    career: ['Job market volatility', 'Industry changes', 'Work-life balance challenges'],
    financial: ['Market conditions', 'Inflation impact', 'Unexpected expenses'],
    relationships: ['Communication challenges', 'Different goals', 'External pressures'],
    lifestyle: ['Adaptation difficulties', 'Higher costs', 'Routine disruption'],
    health: ['Slower results', 'Injury risk', 'Motivation challenges']
  };

  const risks = categoryRisks[decision.category] || categoryRisks.lifestyle;
  
  if (decision.urgency === 'high') {
    risks.push('Time pressure may affect execution quality');
  }
  
  return risks.slice(0, 4);
}

function assessOpportunities(decision: Decision): string[] {
  const categoryOpportunities = {
    career: ['Network expansion', 'Skill development', 'Leadership opportunities'],
    financial: ['Wealth building', 'Investment growth', 'Financial independence'],
    relationships: ['Deeper connections', 'Expanded social circle', 'Personal growth'],
    lifestyle: ['Enhanced satisfaction', 'New experiences', 'Improved quality of life'],
    health: ['Increased energy', 'Longevity benefits', 'Mental clarity improvement']
  };

  const opportunities = categoryOpportunities[decision.category] || categoryOpportunities.lifestyle;
  
  if (decision.alternatives.length > 2) {
    opportunities.push('Multiple options provide flexibility');
  }
  
  return opportunities.slice(0, 4);
}

function calculateConfidence(decision: Decision, reasoning: { confidence: number }[]): number {
  let baseConfidence = 80;
  
  // Adjust based on decision factors
  if (decision.urgency === 'high') baseConfidence -= 10;
  if (decision.constraints.length > 3) baseConfidence -= 5;
  if (decision.alternatives.length > 1) baseConfidence += 5;
  
  // Factor in reasoning chain confidence
  if (reasoning.length > 0) {
    const avgReasoningConfidence = reasoning.reduce((sum, step) => sum + step.confidence, 0) / reasoning.length;
    baseConfidence = (baseConfidence + avgReasoningConfidence) / 2;
  }
  
  return Math.min(95, Math.max(60, Math.round(baseConfidence)));
}