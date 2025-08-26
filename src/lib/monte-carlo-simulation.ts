// @file src/lib/monte-carlo-simulation.ts
// Monte Carlo simulation engine for generating realistic life trajectories

import { UserProfile, Decision, LifeStats, AIPersonality, Scenario } from './types';
import { WorldState, worldContext } from './world-context-engine';
import { causalRules } from './causal-rules-engine';

export interface SimulationRun {
  id: string;
  personality: AIPersonality;
  trajectories: LifeTrajectory[];
  dominant_patterns: PatternSignature[];
  outlier_events: OutlierEvent[];
  confidence_score: number;
}

export interface LifeTrajectory {
  timeline: {
    year1: LifeStats;
    year5: LifeStats; 
    year10: LifeStats;
    year15: LifeStats;
  };
  key_turning_points: TurningPoint[];
  external_events: ExternalEvent[];
  path_probability: number;
}

export interface PatternSignature {
  pattern_type: 'steady_growth' | 'volatile_high_reward' | 'stable_plateau' | 'decline_recovery' | 'breakthrough_moment';
  affected_metrics: (keyof LifeStats)[];
  probability: number;
  description: string;
  typical_timeline: string;
}

export interface TurningPoint {
  year: number;
  event_type: 'career_breakthrough' | 'relationship_change' | 'health_crisis' | 'financial_windfall' | 'external_shock';
  description: string;
  impact_magnitude: number;
  affected_metrics: (keyof LifeStats)[];
}

export interface ExternalEvent {
  year: number;
  event: string;
  probability_occurred: number;
  impact_on_trajectory: string;
}

export interface OutlierEvent {
  event_type: string;
  probability: number;
  potential_impact: string;
  risk_mitigation: string[];
}

export class MonteCarloSimulationEngine {
  
  // NEW: Fast single-personality simulation for tree nodes
  async runPersonalitySimulation(
    decision: Decision, 
    userProfile: UserProfile, 
    personality: AIPersonality, 
    trajectoryCount = 100
  ): Promise<SimulationRun> {
    const worldState = worldContext.getWorldState(userProfile, decision);
    const trajectories: LifeTrajectory[] = [];
    
    for (let i = 0; i < trajectoryCount; i++) {
      trajectories.push(this.simulatePersonalityTrajectory(decision, userProfile, personality, worldState, i));
    }
    
    return {
      id: `sim_${personality}_${Date.now()}`,
      personality,
      trajectories,
      dominant_patterns: this.detectDominantPatterns(trajectories, personality),
      outlier_events: this.identifyOutlierEvents(trajectories),
      confidence_score: this.calculateConfidenceScore(trajectories, this.detectDominantPatterns(trajectories, personality))
    };
  }

  private simulatePersonalityTrajectory(
    decision: Decision, 
    userProfile: UserProfile, 
    personality: AIPersonality, 
    worldState: WorldState,
    runIndex: number
  ): LifeTrajectory {
    return this.generateSingleTrajectory(decision, userProfile, worldState, personality, runIndex);
  }

  private readonly SIMULATION_RUNS = 1000; // Number of Monte Carlo runs
  private readonly PATTERN_DETECTION_THRESHOLD = 0.15; // 15% of runs to identify pattern

  async runFullSimulation(
    decision: Decision,
    userProfile: UserProfile
  ): Promise<SimulationRun[]> {
    
    const worldState = worldContext.getWorldState(userProfile, decision);
    const personalities: AIPersonality[] = ['optimistic', 'realistic', 'cautious', 'adventurous'];
    
    const simulationResults: SimulationRun[] = [];

    for (const personality of personalities) {
      const trajectories = this.generateTrajectories(decision, userProfile, worldState, personality);
      const patterns = this.detectDominantPatterns(trajectories, personality);
      const outliers = this.identifyOutlierEvents(trajectories);
      
      simulationResults.push({
        id: `simulation_${personality}_${Date.now()}`,
        personality,
        trajectories,
        dominant_patterns: patterns,
        outlier_events: outliers,
        confidence_score: this.calculateConfidenceScore(trajectories, patterns)
      });
    }

    return simulationResults;
  }

  private generateTrajectories(
    decision: Decision,
    userProfile: UserProfile, 
    worldState: WorldState,
    personality: AIPersonality
  ): LifeTrajectory[] {
    
    const trajectories: LifeTrajectory[] = [];
    
    // Generate multiple trajectory samples (fewer for performance, but representative)
    const samplesPerPersonality = Math.floor(this.SIMULATION_RUNS / 4); // 250 per personality
    
    for (let i = 0; i < samplesPerPersonality; i++) {
      const trajectory = this.generateSingleTrajectory(decision, userProfile, worldState, personality, i);
      trajectories.push(trajectory);
    }
    
    return trajectories;
  }

  private generateSingleTrajectory(
    decision: Decision,
    userProfile: UserProfile,
    worldState: WorldState, 
    personality: AIPersonality,
    runIndex: number
  ): LifeTrajectory {
    
    // Start with baseline life stats for user's age and profile
    let currentStats = this.generateBaselineStats(userProfile, personality);
    
    const timeline: LifeTrajectory['timeline'] = {
      year1: { ...currentStats },
      year5: { ...currentStats },
      year10: { ...currentStats },
      year15: { ...currentStats }
    };

    const turningPoints: TurningPoint[] = [];
    const externalEvents: ExternalEvent[] = [];

    // Apply decision impact through causal rules at different time horizons
    const timeHorizons = ['year1', 'year5', 'year10', 'year15'] as const;
    
    for (const timeHorizon of timeHorizons) {
      // Apply causal rules for this timeframe
      currentStats = causalRules.applyRules(
        decision, 
        userProfile, 
        worldState, 
        personality, 
        currentStats, 
        timeHorizon
      );

      // Add stochastic variations based on personality
      currentStats = this.addStochasticVariation(currentStats, personality, timeHorizon, runIndex);
      
      // Generate external events that might occur
      const yearNumber = this.getYearNumber(timeHorizon);
      const possibleEvents = this.generatePossibleExternalEvents(worldState, userProfile, yearNumber);
      
      for (const event of possibleEvents) {
        if (Math.random() < event.probability_occurred) {
          externalEvents.push(event);
          currentStats = this.applyExternalEventImpact(currentStats, event);
          
          // Check if this creates a turning point
          if (event.probability_occurred < 0.3 && Math.abs(this.calculateTotalImpact(event)) > 15) {
            turningPoints.push({
              year: yearNumber,
              event_type: this.categorizeEvent(event.event),
              description: event.event,
              impact_magnitude: Math.abs(this.calculateTotalImpact(event)),
              affected_metrics: this.getAffectedMetrics(event)
            });
          }
        }
      }

      // Store the stats for this time horizon
      timeline[timeHorizon] = { ...currentStats };
    }

    // Calculate path probability based on how typical this trajectory is
    const pathProbability = this.calculatePathProbability(timeline, personality, userProfile);

    return {
      timeline,
      key_turning_points: turningPoints,
      external_events: externalEvents,
      path_probability: pathProbability
    };
  }

  private generateBaselineStats(userProfile: UserProfile, personality: AIPersonality): LifeStats {
    // Generate realistic baseline based on user's age, profile, and personality bias
    const baseStats: LifeStats = {
      financial: 50,
      happiness: 50, 
      career: 50,
      relationships: 50,
      health: 50
    };

    // Adjust based on age (younger = more potential, older = more established)
    const ageAdjustment = userProfile.age < 30 ? -10 : userProfile.age > 40 ? 10 : 0;
    
    // Adjust based on personality traits
    if (userProfile.bigFive.conscientiousness > 70) {
      baseStats.career += 10;
      baseStats.financial += 8;
    }
    
    if (userProfile.bigFive.extraversion > 70) {
      baseStats.relationships += 12;
      baseStats.happiness += 8;
    }
    
    if (userProfile.bigFive.neuroticism > 70) {
      baseStats.happiness -= 10;
      baseStats.health -= 8;
    }

    // Apply personality lens (how each personality interprets baseline)
    const personalityMultipliers = {
      optimistic: { financial: 1.1, happiness: 1.2, career: 1.1, relationships: 1.1, health: 1.1 },
      realistic: { financial: 1.0, happiness: 1.0, career: 1.0, relationships: 1.0, health: 1.0 },
      cautious: { financial: 1.05, happiness: 0.95, career: 0.95, relationships: 1.0, health: 1.05 },
      adventurous: { financial: 0.95, happiness: 1.15, career: 1.1, relationships: 1.05, health: 0.98 }
    };

    Object.keys(baseStats).forEach(key => {
      const metric = key as keyof LifeStats;
      baseStats[metric] *= personalityMultipliers[personality][metric];
      baseStats[metric] = Math.max(20, Math.min(80, baseStats[metric] + ageAdjustment));
    });

    return baseStats;
  }

  private addStochasticVariation(
    stats: LifeStats, 
    personality: AIPersonality, 
    timeHorizon: string,
    runIndex: number
  ): LifeStats {
    
    const variation = { ...stats };
    
    // Different personalities have different volatility profiles
    const volatilityProfiles = {
      optimistic: { base: 5, growth_bias: 3 }, // Lower volatility, positive bias
      realistic: { base: 8, growth_bias: 0 }, // Moderate volatility, neutral
      cautious: { base: 4, growth_bias: -1 }, // Low volatility, slight negative bias  
      adventurous: { base: 12, growth_bias: 2 } // High volatility, slight positive bias
    };

    const profile = volatilityProfiles[personality];
    
    // Add random variation to each metric
    Object.keys(variation).forEach(key => {
      const metric = key as keyof LifeStats;
      
      // Use seeded randomness for reproducibility
      const seed = runIndex * 1000 + key.charCodeAt(0) * timeHorizon.charCodeAt(0);
      const randomValue = this.seededRandom(seed);
      
      const variance = (randomValue - 0.5) * profile.base * 2; // -base to +base
      const bias = profile.growth_bias;
      
      variation[metric] += variance + bias;
      variation[metric] = Math.max(0, Math.min(100, variation[metric]));
    });

    return variation;
  }

  private generatePossibleExternalEvents(
    worldState: WorldState, 
    userProfile: UserProfile, 
    year: number
  ): ExternalEvent[] {
    
    const events: ExternalEvent[] = [];
    
    // Economic events
    if (worldState.economic_climate === 'volatile') {
      events.push({
        year,
        event: 'Economic recession impacts job market',
        probability_occurred: 0.3,
        impact_on_trajectory: 'career: -15, financial: -10, stress increase'
      });
    }
    
    // Industry disruption events
    const relevantDisruptions = worldState.technology_disruption.filter(
      d => d.timeline === '2-3years' || d.timeline === 'immediate'
    );
    
    for (const disruption of relevantDisruptions) {
      events.push({
        year,
        event: `${disruption.technology} disrupts industry`,
        probability_occurred: disruption.disruption_severity / 100 * 0.4,
        impact_on_trajectory: 'career: -20, opportunity for adaptation: +25'
      });
    }
    
    // Personal milestone events (age-based)
    if (userProfile.age + year >= 30 && userProfile.age + year <= 35) {
      events.push({
        year,
        event: 'Marriage or long-term partnership established',
        probability_occurred: 0.4,
        impact_on_trajectory: 'relationships: +20, happiness: +15, financial: +5'
      });
      
      events.push({
        year,
        event: 'First child born',
        probability_occurred: 0.25,
        impact_on_trajectory: 'relationships: +25, financial: -15, career: -10, happiness: +20'
      });
    }
    
    // Random opportunity events
    events.push({
      year,
      event: 'Unexpected career opportunity arises',
      probability_occurred: 0.15,
      impact_on_trajectory: 'career: +20, financial: +15, uncertainty: +10'
    });
    
    events.push({
      year,
      event: 'Health challenge requiring lifestyle change',
      probability_occurred: 0.1,
      impact_on_trajectory: 'health: -20, then recovery: +15, perspective shift'
    });

    return events;
  }

  private applyExternalEventImpact(stats: LifeStats, event: ExternalEvent): LifeStats {
    const modifiedStats = { ...stats };
    
    // Parse impact string and apply changes
    // This is simplified - could be more sophisticated
    const impactText = event.impact_on_trajectory.toLowerCase();
    
    if (impactText.includes('career:')) {
      const match = impactText.match(/career:\s*([+-]?\d+)/);
      if (match) {
        modifiedStats.career += parseInt(match[1]);
      }
    }
    
    if (impactText.includes('financial:')) {
      const match = impactText.match(/financial:\s*([+-]?\d+)/);
      if (match) {
        modifiedStats.financial += parseInt(match[1]);
      }
    }
    
    if (impactText.includes('happiness:')) {
      const match = impactText.match(/happiness:\s*([+-]?\d+)/);
      if (match) {
        modifiedStats.happiness += parseInt(match[1]);
      }
    }
    
    if (impactText.includes('relationships:')) {
      const match = impactText.match(/relationships:\s*([+-]?\d+)/);
      if (match) {
        modifiedStats.relationships += parseInt(match[1]);
      }
    }
    
    if (impactText.includes('health:')) {
      const match = impactText.match(/health:\s*([+-]?\d+)/);
      if (match) {
        modifiedStats.health += parseInt(match[1]);
      }
    }

    // Normalize to bounds
    Object.keys(modifiedStats).forEach(key => {
      const metric = key as keyof LifeStats;
      modifiedStats[metric] = Math.max(0, Math.min(100, modifiedStats[metric]));
    });

    return modifiedStats;
  }

  private detectDominantPatterns(trajectories: LifeTrajectory[], personality: AIPersonality): PatternSignature[] {
    const patterns: PatternSignature[] = [];
    const patternCounts = new Map<string, number>();
    
    // Analyze trajectories to identify common patterns
    for (const trajectory of trajectories) {
      const signature = this.identifyTrajectoryPattern(trajectory);
      patternCounts.set(signature.pattern_type, (patternCounts.get(signature.pattern_type) || 0) + 1);
    }
    
    // Extract dominant patterns (appearing in >15% of trajectories)
    const threshold = trajectories.length * this.PATTERN_DETECTION_THRESHOLD;
    
    for (const [patternType, count] of patternCounts.entries()) {
      if (count >= threshold) {
        patterns.push({
          pattern_type: patternType as PatternSignature['pattern_type'],
          affected_metrics: this.getPatternAffectedMetrics(patternType),
          probability: count / trajectories.length,
          description: this.getPatternDescription(patternType, personality),
          typical_timeline: this.getPatternTimeline(patternType)
        });
      }
    }

    return patterns.sort((a, b) => b.probability - a.probability);
  }

  private identifyTrajectoryPattern(trajectory: LifeTrajectory): PatternSignature {
    const { year1, year5, year10, year15 } = trajectory.timeline;
    
    // Calculate overall trajectory direction
    const totalGrowth = this.calculateTotalGrowth(year1, year15);
    const volatility = this.calculateVolatility(trajectory.timeline);
    const midTermGrowth = this.calculateTotalGrowth(year1, year5);
    
    // Pattern classification logic
    if (totalGrowth > 30 && volatility < 15) {
      return {
        pattern_type: 'steady_growth',
        affected_metrics: ['career', 'financial'],
        probability: 0,
        description: '',
        typical_timeline: ''
      };
    } else if (totalGrowth > 20 && volatility > 25) {
      return {
        pattern_type: 'volatile_high_reward',
        affected_metrics: ['career', 'financial', 'happiness'],
        probability: 0,
        description: '',
        typical_timeline: ''
      };
    } else if (Math.abs(totalGrowth) < 10 && volatility < 10) {
      return {
        pattern_type: 'stable_plateau',
        affected_metrics: ['relationships', 'health'],
        probability: 0,
        description: '',
        typical_timeline: ''
      };
    } else if (midTermGrowth < -10 && totalGrowth > 0) {
      return {
        pattern_type: 'decline_recovery',
        affected_metrics: ['career', 'health'],
        probability: 0,
        description: '',
        typical_timeline: ''
      };
    } else {
      return {
        pattern_type: 'breakthrough_moment',
        affected_metrics: ['happiness', 'career'],
        probability: 0,
        description: '',
        typical_timeline: ''
      };
    }
  }

  private identifyOutlierEvents(trajectories: LifeTrajectory[]): OutlierEvent[] {
    const outliers: OutlierEvent[] = [];
    
    // Identify low-probability, high-impact events
    const allEvents = trajectories.flatMap(t => t.external_events);
    const eventFrequency = new Map<string, number>();
    
    for (const event of allEvents) {
      eventFrequency.set(event.event, (eventFrequency.get(event.event) || 0) + 1);
    }
    
    for (const [event, frequency] of eventFrequency.entries()) {
      const probability = frequency / trajectories.length;
      
      if (probability < 0.1) { // Rare events
        outliers.push({
          event_type: event,
          probability,
          potential_impact: 'Significant life trajectory change',
          risk_mitigation: ['Build emergency fund', 'Develop adaptable skills', 'Maintain strong network']
        });
      }
    }
    
    return outliers;
  }

  // Utility methods
  private calculateTotalGrowth(start: LifeStats, end: LifeStats): number {
    const startTotal = Object.values(start).reduce((sum, val) => sum + val, 0);
    const endTotal = Object.values(end).reduce((sum, val) => sum + val, 0);
    return endTotal - startTotal;
  }

  private calculateVolatility(timeline: LifeTrajectory['timeline']): number {
    const points = [timeline.year1, timeline.year5, timeline.year10, timeline.year15];
    const totals = points.map(p => Object.values(p).reduce((sum, val) => sum + val, 0));
    
    const mean = totals.reduce((sum, val) => sum + val, 0) / totals.length;
    const variance = totals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / totals.length;
    
    return Math.sqrt(variance);
  }

  private calculatePathProbability(timeline: LifeTrajectory['timeline'], personality: AIPersonality, userProfile: UserProfile): number {
    // Calculate how typical this trajectory is for this personality/profile combination
    // More typical = higher probability
    const growth = this.calculateTotalGrowth(timeline.year1, timeline.year15);
    const volatility = this.calculateVolatility(timeline);
    
    // Personality-based expectations
    const expectedRanges = {
      optimistic: { growth: [20, 40] as [number, number], volatility: [5, 15] as [number, number] },
      realistic: { growth: [5, 20] as [number, number], volatility: [8, 20] as [number, number] },
      cautious: { growth: [0, 15] as [number, number], volatility: [3, 12] as [number, number] },
      adventurous: { growth: [10, 35] as [number, number], volatility: [15, 30] as [number, number] }
    };
    
    const expected = expectedRanges[personality];
    const growthFit = this.calculateFitness(growth, expected.growth);
    const volatilityFit = this.calculateFitness(volatility, expected.volatility);
    
    return (growthFit + volatilityFit) / 2;
  }

  private calculateFitness(value: number, range: [number, number]): number {
    const [min, max] = range;
    if (value >= min && value <= max) return 1.0;
    
    const distance = Math.min(Math.abs(value - min), Math.abs(value - max));
    return Math.max(0, 1 - (distance / Math.abs(max - min)));
  }

  private seededRandom(seed: number): number {
    // Simple seeded random number generator for reproducible results
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private getYearNumber(timeHorizon: string): number {
    switch (timeHorizon) {
      case 'year1': return 1;
      case 'year5': return 5;
      case 'year10': return 10;
      case 'year15': return 15;
      default: return 1;
    }
  }

  private calculateTotalImpact(event: ExternalEvent): number {
    // Parse impact string and calculate total magnitude
    const impacts = event.impact_on_trajectory.match(/([+-]?\d+)/g) || [];
    return impacts.reduce((sum, impact) => sum + Math.abs(parseInt(impact)), 0);
  }

  private categorizeEvent(eventText: string): TurningPoint['event_type'] {
    if (eventText.toLowerCase().includes('career') || eventText.toLowerCase().includes('job')) {
      return 'career_breakthrough';
    } else if (eventText.toLowerCase().includes('marriage') || eventText.toLowerCase().includes('child')) {
      return 'relationship_change';
    } else if (eventText.toLowerCase().includes('health')) {
      return 'health_crisis';
    } else if (eventText.toLowerCase().includes('economic') || eventText.toLowerCase().includes('financial')) {
      return 'external_shock';
    }
    return 'career_breakthrough';
  }

  private getAffectedMetrics(event: ExternalEvent): (keyof LifeStats)[] {
    const metrics: (keyof LifeStats)[] = [];
    const impact = event.impact_on_trajectory.toLowerCase();
    
    if (impact.includes('career')) metrics.push('career');
    if (impact.includes('financial')) metrics.push('financial');
    if (impact.includes('happiness')) metrics.push('happiness');
    if (impact.includes('relationships')) metrics.push('relationships');
    if (impact.includes('health')) metrics.push('health');
    
    return metrics;
  }

  private getPatternAffectedMetrics(patternType: string): (keyof LifeStats)[] {
    const patterns: { [key: string]: (keyof LifeStats)[] } = {
      'steady_growth': ['career', 'financial'],
      'volatile_high_reward': ['career', 'financial', 'happiness'],
      'stable_plateau': ['relationships', 'health'],
      'decline_recovery': ['career', 'health'],
      'breakthrough_moment': ['happiness', 'career']
    };
    
    return patterns[patternType] || ['career'];
  }

  private getPatternDescription(patternType: string, personality: AIPersonality): string {
    const descriptions: { [key: string]: { [P in AIPersonality]: string } } = {
      'steady_growth': {
        optimistic: 'Consistent upward trajectory with compounding benefits',
        realistic: 'Steady progress with expected ups and downs',
        cautious: 'Reliable growth through careful planning',
        adventurous: 'Building momentum through strategic risk-taking'
      },
      'volatile_high_reward': {
        optimistic: 'Dynamic growth with exciting breakthrough moments',
        realistic: 'High-risk, high-reward path with significant variability',
        cautious: 'Unpredictable but potentially rewarding journey',
        adventurous: 'Thrilling ride with major wins and challenges'
      }
    };
    
    return descriptions[patternType]?.[personality] || 'Complex trajectory with mixed outcomes';
  }

  private getPatternTimeline(patternType: string): string {
    const timelines: { [key: string]: string } = {
      'steady_growth': 'Gradual improvement over 5-10 years',
      'volatile_high_reward': 'Major changes in years 2-5, stabilization after',
      'stable_plateau': 'Equilibrium reached by year 3',
      'decline_recovery': 'Challenges in years 1-3, recovery by year 5+',
      'breakthrough_moment': 'Critical inflection point around year 3-7'
    };
    
    return timelines[patternType] || 'Variable timeline';
  }

  private calculateConfidenceScore(trajectories: LifeTrajectory[], patterns: PatternSignature[]): number {
    // Calculate confidence based on pattern consistency and trajectory convergence
    const avgProbability = patterns.reduce((sum, p) => sum + p.probability, 0) / patterns.length;
    const trajectoryConsistency = this.calculateTrajectoryConsistency(trajectories);
    
    return Math.round((avgProbability * 0.6 + trajectoryConsistency * 0.4) * 100);
  }

  private calculateTrajectoryConsistency(trajectories: LifeTrajectory[]): number {
    // Calculate how consistent the trajectories are with each other
    if (trajectories.length < 2) return 1.0;
    
    const finalStats = trajectories.map(t => t.timeline.year15);
    const avgStats = this.calculateAverageStats(finalStats);
    
    let totalDeviation = 0;
    for (const stats of finalStats) {
      totalDeviation += this.calculateDeviation(stats, avgStats);
    }
    
    const avgDeviation = totalDeviation / finalStats.length;
    return Math.max(0, 1 - (avgDeviation / 50)); // Normalize to 0-1
  }

  private calculateAverageStats(statsList: LifeStats[]): LifeStats {
    const avg: LifeStats = { financial: 0, happiness: 0, career: 0, relationships: 0, health: 0 };
    
    for (const stats of statsList) {
      Object.keys(avg).forEach(key => {
        const metric = key as keyof LifeStats;
        avg[metric] += stats[metric];
      });
    }
    
    Object.keys(avg).forEach(key => {
      const metric = key as keyof LifeStats;
      avg[metric] /= statsList.length;
    });
    
    return avg;
  }

  private calculateDeviation(stats1: LifeStats, stats2: LifeStats): number {
    let totalDiff = 0;
    Object.keys(stats1).forEach(key => {
      const metric = key as keyof LifeStats;
      totalDiff += Math.abs(stats1[metric] - stats2[metric]);
    });
    return totalDiff / Object.keys(stats1).length;
  }
}

// Export singleton
export const monteCarloSimulation = new MonteCarloSimulationEngine();