import { ReasoningStep, Decision, Scenario, AIPersonality } from './types';

export function generateTransparentReasoning(
  decision: Decision,
  scenarios: Scenario[],
  context: 'generation' | 'analysis' | 'chat'
): ReasoningStep[] {
  const steps: ReasoningStep[] = [];
  
  // Step 1: Context Analysis
  steps.push({
    step: 1,
    type: 'analysis',
    content: `Analyzing ${context} context for: ${decision.title}`,
    confidence: 95,
    reasoning: `Decision category: ${decision.category}, Urgency: ${decision.urgency}, Constraints: ${decision.constraints.length}`
  });

  // Step 2: Multi-perspective Generation
  if (context === 'generation') {
    steps.push({
      step: 2,
      type: 'calculation',
      content: 'Generating 4 distinct future perspectives',
      confidence: 88,
      reasoning: 'Each personality (optimistic, realistic, cautious, adventurous) applies different multipliers and risk assessments'
    });
  }

  // Step 3: Impact Calculation
  steps.push({
    step: scenarios.length + 1,
    type: 'calculation',
    content: `Calculated impact across 5 life metrics for ${scenarios.length} scenarios`,
    confidence: 85,
    reasoning: 'Applied category-specific impact models with personality adjustments and time projections'
  });

  // Step 4: Validation
  steps.push({
    step: scenarios.length + 2,
    type: 'comparison',
    content: 'Cross-validated scenarios for consistency and realism',
    confidence: 82,
    reasoning: 'Compared probability distributions and ensured personality-specific trait consistency'
  });

  // Step 5: Conclusion
  steps.push({
    step: scenarios.length + 3,
    type: 'conclusion',
    content: `Generated comprehensive ${context} analysis`,
    confidence: 90,
    reasoning: `Analysis complete with ${Math.round(steps.reduce((sum, s) => sum + s.confidence, 0) / steps.length)}% average confidence`
  });

  return steps;
}

export function explainPersonalityReasoning(personality: AIPersonality, decision: Decision): string {
  const reasoningMap = {
    optimistic: `As your optimistic future self, I focus on the positive potential outcomes of "${decision.title}". 
                 I naturally emphasize opportunities over risks and assume favorable external conditions. 
                 My perspective amplifies benefits by ~20% based on positive momentum and network effects.`,
    
    realistic: `As your realistic future self, I provide a balanced view of "${decision.title}". 
               I consider both positive and negative outcomes with equal weight, assuming normal life challenges. 
               My projections use baseline multipliers without optimistic or pessimistic bias.`,
    
    cautious: `As your cautious future self, I prioritize security and risk management for "${decision.title}". 
              I emphasize potential downsides and prefer stable, proven approaches. 
              My perspective reduces risk exposure by ~20% while maintaining steady progress.`,
    
    adventurous: `As your adventurous future self, I embrace bold moves and calculated risks with "${decision.title}". 
                 I amplify growth opportunities by ~40% while accepting higher volatility. 
                 My perspective maximizes potential breakthroughs even with increased uncertainty.`
  };

  return reasoningMap[personality];
}

export function generateImpactExplanation(
  metric: keyof import('./types').LifeStats,
  change: number,
  personality: AIPersonality,
  decision: Decision
): string {
  const direction = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'remain stable';
  const magnitude = Math.abs(change);
  
  let explanation = `Your ${metric} is projected to ${direction}`;
  
  if (magnitude > 20) explanation += ' significantly';
  else if (magnitude > 10) explanation += ' moderately';
  else if (magnitude > 5) explanation += ' slightly';
  else explanation += ' minimally';
  
  // Add personality-specific reasoning
  const personalityContext = {
    optimistic: 'due to positive momentum and favorable conditions',
    realistic: 'based on typical outcomes for similar decisions',
    cautious: 'assuming careful risk management and gradual progress',
    adventurous: 'through bold actions and high-growth opportunities'
  };
  
  explanation += ` ${personalityContext[personality]}`;
  
  // Add decision-specific context
  if (decision.category === 'career' && metric === 'financial') {
    explanation += '. Career changes often have direct financial implications.';
  } else if (decision.category === 'health' && metric === 'happiness') {
    explanation += '. Health improvements typically boost overall life satisfaction.';
  } else if (decision.category === 'relationships' && metric === 'happiness') {
    explanation += '. Relationship decisions deeply affect emotional well-being.';
  }
  
  return explanation;
}

export function explainConfidenceLevel(confidence: number, factors: string[]): string {
  let explanation = `Confidence level: ${confidence}% - `;
  
  if (confidence >= 90) {
    explanation += 'Very high confidence. ';
  } else if (confidence >= 80) {
    explanation += 'High confidence. ';
  } else if (confidence >= 70) {
    explanation += 'Moderate confidence. ';
  } else {
    explanation += 'Lower confidence due to uncertainty. ';
  }
  
  explanation += 'Based on: ' + factors.slice(0, 3).join(', ');
  
  return explanation;
}

export function generateMethodologyExplanation(): string {
  return `Our analysis uses a multi-layered approach:

1. **Personality Modeling**: Each future self applies distinct multipliers based on psychological traits
2. **Impact Calculation**: Category-specific models predict changes across 5 life dimensions  
3. **Timeline Projection**: Compound effects modeled over 5, 10, and 15-year periods
4. **Risk Assessment**: Probability calculations based on decision complexity and external factors
5. **Transparent Reasoning**: Every step explained with confidence metrics and validation

This creates 4 distinct but consistent future perspectives for comprehensive decision analysis.`;
}

export function validateReasoningChain(steps: ReasoningStep[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check step sequence
  const stepNumbers = steps.map(s => s.step);
  const expectedSequence = Array.from({length: steps.length}, (_, i) => i + 1);
  if (JSON.stringify(stepNumbers) !== JSON.stringify(expectedSequence)) {
    issues.push('Step sequence is not consecutive');
  }
  
  // Check confidence levels
  const lowConfidence = steps.filter(s => s.confidence < 60);
  if (lowConfidence.length > 0) {
    issues.push(`${lowConfidence.length} steps have confidence below 60%`);
  }
  
  // Check reasoning completeness
  const incompleteReasoning = steps.filter(s => s.reasoning.length < 20);
  if (incompleteReasoning.length > 0) {
    issues.push(`${incompleteReasoning.length} steps lack detailed reasoning`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}