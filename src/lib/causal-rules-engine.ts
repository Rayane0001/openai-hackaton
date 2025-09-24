// @file src/lib/causal-rules-engine.ts  
// Causal Rules Engine - Understanding how decisions cascade through life

import { UserProfile, Decision, LifeStats, AIPersonality } from './types';
import { WorldState } from './world-context-engine';

export interface CausalRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  effects: RuleEffect[];
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term'; // 0-6mo, 6mo-2yr, 2-5yr, 5-15yr
  confidence: number; // 0-100 how sure we are this rule applies
  personality_modifier: { [P in AIPersonality]?: number }; // How much each personality weights this rule
}

export interface RuleCondition {
  type: 'user_trait' | 'decision_property' | 'world_context' | 'life_metric' | 'combined';
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: any;
  weight: number; // 0-1, how important this condition is
}

export interface RuleEffect {
  target_metric: keyof LifeStats;
  impact_type: 'additive' | 'multiplicative' | 'replacement';
  magnitude: number; // Can be positive or negative
  duration: 'temporary' | 'permanent' | 'decaying'; // How the effect evolves over time
  cascade_effects?: CascadeEffect[]; // Secondary effects this triggers
}

export interface CascadeEffect {
  triggered_by_change: number; // Minimum change needed to trigger cascade
  delay_months: number; // How long before cascade triggers
  secondary_rule_id: string; // Which rule gets triggered
  probability: number; // 0-1 chance of cascade occurring
}

export class CausalRulesEngine {
  private rules: CausalRule[] = [];

  constructor() {
    this.initializeRuleSet();
  }

  private initializeRuleSet() {
    // CAREER DECISION RULES
    this.rules.push({
      id: 'job_change_network_reset',
      name: 'Job Change Network Disruption',
      conditions: [
        { type: 'decision_property', field: 'category', operator: 'equals', value: 'career', weight: 1.0 },
        { type: 'decision_property', field: 'description', operator: 'contains', value: 'new company', weight: 0.8 }
      ],
      effects: [
        {
          target_metric: 'career',
          impact_type: 'additive',
          magnitude: -15, // Initial network loss
          duration: 'temporary',
          cascade_effects: [{
            triggered_by_change: -10,
            delay_months: 3,
            secondary_rule_id: 'network_recovery_extravert',
            probability: 0.8
          }]
        }
      ],
      timeframe: 'immediate',
      confidence: 85,
      personality_modifier: {
        optimistic: 0.7, // Optimist downplays network issues
        cautious: 1.3, // Cautious person more worried about network loss
        realistic: 1.0,
        adventurous: 0.8 // Adventurous sees it as opportunity
      }
    });

    this.rules.push({
      id: 'network_recovery_extravert',
      name: 'Extraverted Network Recovery',
      conditions: [
        { type: 'user_trait', field: 'bigFive.extraversion', operator: 'greater_than', value: 60, weight: 1.0 }
      ],
      effects: [
        {
          target_metric: 'career',
          impact_type: 'additive',
          magnitude: 25, // Strong network recovery
          duration: 'permanent'
        },
        {
          target_metric: 'happiness',
          impact_type: 'additive',
          magnitude: 10, // Social satisfaction
          duration: 'permanent'
        }
      ],
      timeframe: 'short_term',
      confidence: 75,
      personality_modifier: {
        optimistic: 1.2,
        realistic: 1.0,
        cautious: 0.9,
        adventurous: 1.1
      }
    });

    this.rules.push({
      id: 'relocation_family_stress',
      name: 'Relocation Family Impact',
      conditions: [
        { type: 'decision_property', field: 'description', operator: 'contains', value: 'move', weight: 0.9 },
        { type: 'user_trait', field: 'age', operator: 'greater_than', value: 30, weight: 0.7 },
        { type: 'world_context', field: 'demographic_shifts.lifecycle_stage', operator: 'equals', value: 'establishing', weight: 0.8 }
      ],
      effects: [
        {
          target_metric: 'relationships',
          impact_type: 'additive',
          magnitude: -20, // Initial family disruption
          duration: 'temporary'
        },
        {
          target_metric: 'health',
          impact_type: 'additive',
          magnitude: -10, // Stress impact
          duration: 'temporary'
        }
      ],
      timeframe: 'immediate',
      confidence: 80,
      personality_modifier: {
        optimistic: 0.6, // Optimist minimizes family stress
        cautious: 1.4, // Cautious very concerned about family
        realistic: 1.0,
        adventurous: 0.8
      }
    });

    // FINANCIAL DECISION RULES
    this.rules.push({
      id: 'high_risk_investment_stress',
      name: 'High Risk Investment Psychological Impact',
      conditions: [
        { type: 'decision_property', field: 'category', operator: 'equals', value: 'financial', weight: 1.0 },
        { type: 'decision_property', field: 'description', operator: 'contains', value: 'invest', weight: 0.8 },
        { type: 'user_trait', field: 'bigFive.neuroticism', operator: 'greater_than', value: 60, weight: 0.9 }
      ],
      effects: [
        {
          target_metric: 'health',
          impact_type: 'additive',
          magnitude: -15, // Stress from financial risk
          duration: 'decaying'
        },
        {
          target_metric: 'happiness',
          impact_type: 'additive',
          magnitude: -10, // Anxiety impact
          duration: 'temporary'
        }
      ],
      timeframe: 'immediate',
      confidence: 70,
      personality_modifier: {
        optimistic: 0.5, // Optimist doesn't worry much
        cautious: 1.5, // Cautious very stressed by risk
        realistic: 1.0,
        adventurous: 0.7
      }
    });

    // LIFESTYLE DECISION RULES  
    this.rules.push({
      id: 'remote_work_productivity',
      name: 'Remote Work Productivity Impact',
      conditions: [
        { type: 'decision_property', field: 'description', operator: 'contains', value: 'remote', weight: 0.9 },
        { type: 'user_trait', field: 'bigFive.conscientiousness', operator: 'greater_than', value: 70, weight: 0.8 }
      ],
      effects: [
        {
          target_metric: 'career',
          impact_type: 'additive',
          magnitude: 15, // High conscientiousness thrives remotely
          duration: 'permanent'
        },
        {
          target_metric: 'happiness',
          impact_type: 'additive',
          magnitude: 12, // Work-life balance improvement
          duration: 'permanent'
        }
      ],
      timeframe: 'short_term',
      confidence: 75,
      personality_modifier: {
        optimistic: 1.1,
        realistic: 1.0,
        cautious: 1.2, // Cautious appreciates control
        adventurous: 0.9 // Adventurous might miss office dynamic
      }
    });

    // RELATIONSHIP DECISION RULES
    this.rules.push({
      id: 'marriage_stability_boost',
      name: 'Marriage Psychological Stability',
      conditions: [
        { type: 'decision_property', field: 'description', operator: 'contains', value: 'marry', weight: 1.0 },
        { type: 'user_trait', field: 'age', operator: 'greater_than', value: 25, weight: 0.6 }
      ],
      effects: [
        {
          target_metric: 'happiness',
          impact_type: 'additive',
          magnitude: 20, // Emotional support
          duration: 'permanent'
        },
        {
          target_metric: 'health',
          impact_type: 'additive',
          magnitude: 15, // Health benefits of partnership
          duration: 'permanent'
        },
        {
          target_metric: 'financial',
          impact_type: 'additive',
          magnitude: 10, // Dual income potential
          duration: 'permanent'
        }
      ],
      timeframe: 'short_term',
      confidence: 85,
      personality_modifier: {
        optimistic: 1.3, // Optimist sees big benefits
        realistic: 1.0,
        cautious: 1.1, // Cautious values stability
        adventurous: 0.8 // Adventurous might see constraints
      }
    });

    // WORLD CONTEXT INTERACTION RULES
    this.rules.push({
      id: 'tech_disruption_career_threat',
      name: 'Technology Disruption Career Risk',
      conditions: [
        { type: 'world_context', field: 'technology_disruption.disruption_severity', operator: 'greater_than', value: 70, weight: 1.0 },
        { type: 'user_trait', field: 'age', operator: 'greater_than', value: 40, weight: 0.7 },
        { type: 'user_trait', field: 'bigFive.openness', operator: 'less_than', value: 50, weight: 0.8 }
      ],
      effects: [
        {
          target_metric: 'career',
          impact_type: 'additive',
          magnitude: -25, // Career disruption for older, less adaptable workers
          duration: 'permanent'
        }
      ],
      timeframe: 'medium_term',
      confidence: 70,
      personality_modifier: {
        optimistic: 0.6, // Optimist believes they'll adapt
        cautious: 1.4, // Cautious very worried about disruption
        realistic: 1.0,
        adventurous: 0.7 // Adventurous sees opportunity
      }
    });

    // Add more complex rules for compound effects...
    this.addCompoundEffectRules();
  }

  private addCompoundEffectRules() {
    // Compound rule: Career success -> Financial gains -> Lifestyle improvements -> Relationship benefits
    this.rules.push({
      id: 'career_success_compound',
      name: 'Career Success Compound Effects',
      conditions: [
        { type: 'life_metric', field: 'career', operator: 'greater_than', value: 80, weight: 1.0 }
      ],
      effects: [
        {
          target_metric: 'financial',
          impact_type: 'multiplicative',
          magnitude: 1.15, // 15% financial boost
          duration: 'permanent'
        },
        {
          target_metric: 'happiness',
          impact_type: 'additive',
          magnitude: 10, // Achievement satisfaction
          duration: 'permanent'
        }
      ],
      timeframe: 'short_term',
      confidence: 85,
      personality_modifier: {
        optimistic: 1.2,
        realistic: 1.0,
        cautious: 1.1,
        adventurous: 1.0
      }
    });
  }

  // Main method: Apply causal rules to a decision scenario
  applyRules(
    decision: Decision, 
    userProfile: UserProfile, 
    worldState: WorldState, 
    personality: AIPersonality,
    currentLifeStats: LifeStats,
    timeHorizon: 'year1' | 'year5' | 'year10' | 'year15'
  ): LifeStats {
    
    let modifiedStats = { ...currentLifeStats };
    const appliedRules: string[] = [];

    for (const rule of this.rules) {
      // Check if rule conditions are met
      if (this.evaluateConditions(rule.conditions, decision, userProfile, worldState, modifiedStats)) {
        
        // Apply personality modifier to rule strength
        const personalityMultiplier = rule.personality_modifier[personality] || 1.0;
        
        // Apply timeframe filtering
        if (this.isRuleApplicableInTimeframe(rule.timeframe, timeHorizon)) {
          
          // Apply rule effects
          for (const effect of rule.effects) {
            const effectMagnitude = effect.magnitude * personalityMultiplier * (rule.confidence / 100);
            
            if (effect.impact_type === 'additive') {
              modifiedStats[effect.target_metric] += effectMagnitude;
            } else if (effect.impact_type === 'multiplicative') {
              modifiedStats[effect.target_metric] *= effectMagnitude;
            } else if (effect.impact_type === 'replacement') {
              modifiedStats[effect.target_metric] = effectMagnitude;
            }

            // Apply temporal effects based on timeframe
            modifiedStats[effect.target_metric] = this.applyTemporalDecay(
              modifiedStats[effect.target_metric], 
              effect, 
              timeHorizon
            );
          }

          appliedRules.push(rule.id);

          // Handle cascade effects for long-term predictions
          if (timeHorizon === 'year10' || timeHorizon === 'year15') {
            modifiedStats = this.applyCascadeEffects(rule, modifiedStats, userProfile, worldState, personality);
          }
        }
      }
    }

    // Normalize stats to 0-100 range with realistic bounds
    Object.keys(modifiedStats).forEach(key => {
      const metric = key as keyof LifeStats;
      modifiedStats[metric] = Math.min(100, Math.max(0, modifiedStats[metric]));
    });

    return modifiedStats;
  }

  private evaluateConditions(
    conditions: RuleCondition[], 
    decision: Decision, 
    userProfile: UserProfile, 
    worldState: WorldState,
    currentStats: LifeStats
  ): boolean {
    
    let totalWeight = 0;
    let matchedWeight = 0;

    for (const condition of conditions) {
      totalWeight += condition.weight;

      const conditionMet = this.evaluateSingleCondition(condition, decision, userProfile, worldState, currentStats);
      if (conditionMet) {
        matchedWeight += condition.weight;
      }
    }

    // Rule applies if 70% of weighted conditions are met
    return (matchedWeight / totalWeight) >= 0.7;
  }

  private evaluateSingleCondition(
    condition: RuleCondition,
    decision: Decision,
    userProfile: UserProfile,
    worldState: WorldState,
    currentStats: LifeStats
  ): boolean {

    let targetValue: any;

    // Get the value to test based on condition type
    switch (condition.type) {
      case 'user_trait':
        targetValue = this.getNestedProperty(userProfile, condition.field);
        break;
      case 'decision_property':
        targetValue = this.getNestedProperty(decision, condition.field);
        break;
      case 'world_context':
        targetValue = this.getNestedProperty(worldState, condition.field);
        break;
      case 'life_metric':
        targetValue = this.getNestedProperty(currentStats, condition.field);
        break;
    }

    // Apply the operator
    switch (condition.operator) {
      case 'equals':
        return targetValue === condition.value;
      case 'greater_than':
        return Number(targetValue) > Number(condition.value);
      case 'less_than':
        return Number(targetValue) < Number(condition.value);
      case 'contains':
        return String(targetValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'in_range':
        const [min, max] = condition.value as [number, number];
        return Number(targetValue) >= min && Number(targetValue) <= max;
      default:
        return false;
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private isRuleApplicableInTimeframe(ruleTimeframe: CausalRule['timeframe'], queryTimeframe: string): boolean {
    const timeframeOrder = {
      'immediate': 1,
      'short_term': 2, 
      'medium_term': 3,
      'long_term': 4
    };

    const queryOrder = {
      'year1': 1,
      'year5': 3,
      'year10': 4,
      'year15': 4
    };

    return timeframeOrder[ruleTimeframe] <= queryOrder[queryTimeframe as keyof typeof queryOrder];
  }

  private applyTemporalDecay(value: number, effect: RuleEffect, timeHorizon: string): number {
    if (effect.duration === 'permanent') {
      return value;
    } else if (effect.duration === 'temporary') {
      // Temporary effects fade over time
      const fadeFactors = { year1: 1.0, year5: 0.3, year10: 0.1, year15: 0.0 };
      return value * (fadeFactors[timeHorizon as keyof typeof fadeFactors] || 1.0);
    } else if (effect.duration === 'decaying') {
      // Decaying effects diminish gradually
      const decayFactors = { year1: 1.0, year5: 0.7, year10: 0.4, year15: 0.2 };
      return value * (decayFactors[timeHorizon as keyof typeof decayFactors] || 1.0);
    }

    return value;
  }

  private applyCascadeEffects(
    rule: CausalRule, 
    currentStats: LifeStats, 
    userProfile: UserProfile, 
    worldState: WorldState, 
    personality: AIPersonality
  ): LifeStats {
    
    // Implement cascade effects for complex rule interactions
    // This would trigger secondary rules based on the primary rule's effects
    
    return currentStats; // Simplified for now
  }

  // Get explanation of which rules were applied
  getRuleExplanations(
    decision: Decision, 
    userProfile: UserProfile, 
    worldState: WorldState, 
    personality: AIPersonality
  ): string[] {
    
    const explanations: string[] = [];
    
    for (const rule of this.rules) {
      if (this.evaluateConditions(rule.conditions, decision, userProfile, worldState, {} as LifeStats)) {
        const personalityModifier = rule.personality_modifier[personality] || 1.0;
        const strength = personalityModifier > 1.0 ? 'strongly' : personalityModifier < 0.8 ? 'weakly' : 'moderately';
        
        explanations.push(`${rule.name} applies ${strength} (${rule.confidence}% confidence)`);
      }
    }
    
    return explanations;
  }
}

// Export singleton
export const causalRules = new CausalRulesEngine();