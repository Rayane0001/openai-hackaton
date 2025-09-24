// @file src/lib/archetype-pattern-engine.ts
// Converts Monte Carlo simulation results into narrative archetypes for the 4 future selves

import { Scenario, UserProfile, Decision, AIPersonality, LifeStats } from './types';
import { SimulationRun, PatternSignature, TurningPoint, LifeTrajectory } from './monte-carlo-simulation';

export interface ArchetypeNarrative {
  personality: AIPersonality;
  core_storyline: string;
  key_milestones: string[];
  challenges_overcome: string[];
  opportunities_seized: string[];
  life_philosophy: string;
  advice_themes: string[];
  regrets_and_learnings: string[];
  probability_explanation: string;
}

export interface ScenarioArchetype {
  scenario: Scenario;
  narrative: ArchetypeNarrative;
  supporting_evidence: string[];
  pattern_confidence: number;
}

export class ArchetypePatternEngine {
  
  async convertSimulationToArchetypes(
    simulationRuns: SimulationRun[],
    decision: Decision,
    userProfile: UserProfile
  ): Promise<ScenarioArchetype[]> {
    
    const archetypes: ScenarioArchetype[] = [];
    
    for (const simulation of simulationRuns) {
      const archetype = await this.createPersonalityArchetype(
        simulation,
        decision,
        userProfile
      );
      archetypes.push(archetype);
    }
    
    return this.rankAndOptimizeArchetypes(archetypes);
  }
  
  private async createPersonalityArchetype(
    simulation: SimulationRun,
    decision: Decision,
    userProfile: UserProfile
  ): Promise<ScenarioArchetype> {
    
    // Extract the most representative trajectory
    const representativeTrajectory = this.selectRepresentativeTrajectory(simulation);
    
    // Generate base scenario
    const scenario = this.buildScenarioFromTrajectory(
      representativeTrajectory,
      simulation.personality,
      decision,
      userProfile
    );
    
    // Create narrative archetype
    const narrative = this.generatePersonalityNarrative(
      simulation,
      representativeTrajectory,
      decision,
      userProfile
    );
    
    // Generate supporting evidence
    const supportingEvidence = this.extractSupportingEvidence(simulation);
    
    return {
      scenario,
      narrative,
      supporting_evidence: supportingEvidence,
      pattern_confidence: simulation.confidence_score
    };
  }
  
  private selectRepresentativeTrajectory(simulation: SimulationRun): LifeTrajectory {
    // Find trajectory that best represents the dominant patterns
    const dominantPattern = simulation.dominant_patterns[0]; // Most common pattern
    
    if (!dominantPattern || simulation.trajectories.length === 0) {
      // Create fallback trajectory if none exists
      return this.createFallbackTrajectory(simulation.personality);
    }
    
    // Find trajectory that most closely matches the dominant pattern
    let bestMatch = simulation.trajectories[0];
    let bestScore = 0;
    
    for (const trajectory of simulation.trajectories) {
      const score = this.calculatePatternMatchScore(trajectory, dominantPattern);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = trajectory;
      }
    }
    
    return bestMatch;
  }
  
  private createFallbackTrajectory(personality: AIPersonality): LifeTrajectory {
    const baseStats: LifeStats = { financial: 50, happiness: 50, career: 50, relationships: 50, health: 50 };
    
    return {
      timeline: {
        year1: { ...baseStats },
        year5: { ...baseStats },
        year10: { ...baseStats },
        year15: { ...baseStats }
      },
      key_turning_points: [],
      external_events: [],
      path_probability: 0.5
    };
  }
  
  private calculatePatternMatchScore(trajectory: LifeTrajectory, pattern: PatternSignature): number {
    // Simplified pattern matching - could be more sophisticated
    const totalGrowth = this.calculateTotalGrowth(trajectory.timeline.year1, trajectory.timeline.year15);
    const volatility = this.calculateVolatility(trajectory.timeline);
    
    let score = 0;
    
    switch (pattern.pattern_type) {
      case 'steady_growth':
        if (totalGrowth > 20 && volatility < 15) score += 0.8;
        break;
      case 'volatile_high_reward':
        if (totalGrowth > 15 && volatility > 20) score += 0.8;
        break;
      case 'stable_plateau':
        if (Math.abs(totalGrowth) < 15 && volatility < 10) score += 0.8;
        break;
      case 'decline_recovery':
        // Check for decline then recovery pattern
        const midGrowth = this.calculateTotalGrowth(trajectory.timeline.year1, trajectory.timeline.year5);
        const lateGrowth = this.calculateTotalGrowth(trajectory.timeline.year5, trajectory.timeline.year15);
        if (midGrowth < 0 && lateGrowth > 0) score += 0.8;
        break;
      case 'breakthrough_moment':
        if (trajectory.key_turning_points.length > 0) score += 0.8;
        break;
    }
    
    return score;
  }
  
  private buildScenarioFromTrajectory(
    trajectory: LifeTrajectory,
    personality: AIPersonality,
    decision: Decision,
    userProfile: UserProfile
  ): Scenario {
    
    const scenarioId = `scenario_${personality}_${Date.now()}`;
    
    // Extract key milestones from trajectory
    const keyMilestones = this.generateMilestones(trajectory, personality, decision);
    
    // Extract risks and opportunities
    const risks = this.extractRisks(trajectory, personality);
    const opportunities = this.extractOpportunities(trajectory, personality);
    
    // Calculate probability based on personality archetype
    const probability = this.calculateArchetypeProbability(personality, trajectory, userProfile);
    
    return {
      id: scenarioId,
      decisionId: decision.id || `decision_${Date.now()}`,
      title: this.generateScenarioTitle(personality, decision),
      description: this.generateScenarioDescription(personality, trajectory, decision),
      personality,
      timeline: {
        year5: trajectory.timeline.year5,
        year10: trajectory.timeline.year10,
        year15: trajectory.timeline.year15
      },
      impact: this.calculateImpactAnalysis(trajectory.timeline.year1, trajectory.timeline.year15),
      keyMilestones,
      risks,
      opportunities,
      probability
    };
  }
  
  private generatePersonalityNarrative(
    simulation: SimulationRun,
    trajectory: LifeTrajectory,
    decision: Decision,
    userProfile: UserProfile
  ): ArchetypeNarrative {
    
    const personality = simulation.personality;
    
    // Generate core storyline based on personality and trajectory
    const coreStoryline = this.generateCoreStoryline(personality, trajectory, decision);
    
    // Extract key milestones as narrative beats
    const keyMilestones = this.narrativizeMilestones(trajectory.key_turning_points, personality);
    
    // Generate challenges and opportunities narrative
    const challengesOvercome = this.generateChallengesNarrative(trajectory, personality);
    const opportunitiesSeized = this.generateOpportunitiesNarrative(trajectory, personality);
    
    // Create personality-specific philosophy
    const lifePhilosophy = this.generateLifePhilosophy(personality, trajectory, userProfile);
    
    // Generate advice themes
    const adviceThemes = this.generateAdviceThemes(personality, trajectory, decision);
    
    // Generate regrets and learnings
    const regretsAndLearnings = this.generateRegretsAndLearnings(personality, trajectory);
    
    // Explain probability in narrative terms
    const probabilityExplanation = this.generateProbabilityExplanation(
      simulation.confidence_score, 
      personality, 
      simulation.dominant_patterns
    );
    
    return {
      personality,
      core_storyline: coreStoryline,
      key_milestones: keyMilestones,
      challenges_overcome: challengesOvercome,
      opportunities_seized: opportunitiesSeized,
      life_philosophy: lifePhilosophy,
      advice_themes: adviceThemes,
      regrets_and_learnings: regretsAndLearnings,
      probability_explanation: probabilityExplanation
    };
  }
  
  private generateCoreStoryline(personality: AIPersonality, trajectory: any, decision: Decision): string {
    const storylines = {
      optimistic: `Making this decision opened up incredible opportunities I never expected. The initial challenges quickly transformed into stepping stones, and by year 5, everything had fallen into place beautifully. Looking back, it was one of the best decisions of my life because it aligned perfectly with my values and pushed me toward my highest potential.`,
      
      realistic: `This decision brought both rewards and challenges, as most major life choices do. The first few years required significant adjustment and hard work, but the outcomes were ultimately worth the effort. There were trade-offs, but I learned to navigate them effectively and built resilience along the way.`,
      
      cautious: `I'm grateful I approached this decision thoughtfully and prepared for various scenarios. While I didn't take the most aggressive path, the stability and security I prioritized have served me well. I avoided several pitfalls that could have derailed my progress, and I sleep well knowing I made the prudent choice.`,
      
      adventurous: `Taking this bold leap was exactly what I needed to break out of my comfort zone! Yes, there were some wild ups and downs, but the growth and experiences I gained were extraordinary. I learned so much about myself and discovered capabilities I never knew I had. The risk was absolutely worth the adventure.`
    };
    
    return storylines[personality];
  }
  
  private narrativizeMilestones(turningPoints: TurningPoint[], personality: AIPersonality): string[] {
    if (!turningPoints || turningPoints.length === 0) {
      return this.generateGenericMilestones(personality);
    }
    
    return turningPoints.map(tp => {
      const personalityFraming = {
        optimistic: `Year ${tp.year}: ${tp.description} - it was amazing how everything aligned perfectly`,
        realistic: `Year ${tp.year}: ${tp.description} - required adaptation but led to positive outcomes`,
        cautious: `Year ${tp.year}: ${tp.description} - managed it carefully to minimize disruption`,
        adventurous: `Year ${tp.year}: ${tp.description} - embraced the change and turned it into an adventure`
      };
      
      return personalityFraming[personality];
    }).slice(0, 4); // Top 4 milestones
  }
  
  private generateGenericMilestones(personality: AIPersonality): string[] {
    const genericMilestones = {
      optimistic: [
        'Year 2: Breakthrough moment that exceeded all expectations',
        'Year 4: Network expansion led to incredible opportunities', 
        'Year 7: Achievement of major personal goal ahead of schedule',
        'Year 10: Recognition and success beyond initial dreams'
      ],
      realistic: [
        'Year 2: Successfully navigated initial adjustment period',
        'Year 5: Reached important personal and professional milestones',
        'Year 8: Overcame significant challenge through persistence',
        'Year 12: Achieved long-term stability and satisfaction'
      ],
      cautious: [
        'Year 1: Established solid foundation with minimal risk',
        'Year 3: Built emergency fund and security buffer',
        'Year 6: Achieved steady progress through careful planning',
        'Year 10: Reached comfortable stability with peace of mind'
      ],
      adventurous: [
        'Year 1: Took the bold leap and immediately felt energized',
        'Year 3: Navigated major challenge that led to unexpected growth',
        'Year 6: Discovered new passion through willingness to explore',
        'Year 9: Achieved breakthrough by embracing uncertainty'
      ]
    };
    
    return genericMilestones[personality];
  }
  
  private generateChallengesNarrative(trajectory: LifeTrajectory, personality: AIPersonality): string[] {
    const challengeNarratives = {
      optimistic: [
        'Initial uncertainty that became an exciting learning experience',
        'Temporary setback that led to discovering new strengths',
        'Resource constraints that sparked creative solutions'
      ],
      realistic: [
        'Adapting to new circumstances while maintaining balance',
        'Managing competing priorities through better organization',
        'Building new skills while maintaining existing commitments'
      ],
      cautious: [
        'Carefully managing risks while pursuing necessary changes',
        'Building safety nets before taking any significant steps',
        'Thorough preparation to avoid potential complications'
      ],
      adventurous: [
        'Embracing uncertainty as fuel for personal growth',
        'Turning obstacles into adventures and learning opportunities',
        'Using setbacks as springboards for even bolder moves'
      ]
    };
    
    return challengeNarratives[personality];
  }
  
  private generateOpportunitiesNarrative(trajectory: LifeTrajectory, personality: AIPersonality): string[] {
    const opportunityNarratives = {
      optimistic: [
        'Unexpected doors opened through positive attitude and enthusiasm',
        'Network connections flourished due to authentic relationship building',
        'Serendipitous events aligned perfectly with life goals'
      ],
      realistic: [
        'Strategic positioning led to well-timed opportunities',
        'Skill development opened new career pathways',
        'Balanced approach allowed pursuit of multiple interests'
      ],
      cautious: [
        'Careful preparation positioned for low-risk, high-reward opportunities',
        'Strong foundation enabled confident decision-making when chances arose',
        'Risk management strategies protected while allowing selective growth'
      ],
      adventurous: [
        'Bold moves attracted exciting and unconventional opportunities',
        'Willingness to take risks opened previously unimaginable paths',
        'Embracing change led to exponential growth and discovery'
      ]
    };
    
    return opportunityNarratives[personality];
  }
  
  private generateLifePhilosophy(personality: AIPersonality, trajectory: LifeTrajectory, userProfile: UserProfile): string {
    const philosophies = {
      optimistic: 'Life has a way of working out when you stay positive and remain open to possibilities. Trust the process and believe in the best outcomes.',
      realistic: 'Success comes from balancing ambition with practicality. Expect challenges, prepare well, and stay adaptable to changing circumstances.',
      cautious: 'Wisdom lies in careful planning and gradual progress. Security and stability provide the foundation for lasting happiness and peace of mind.',
      adventurous: 'Life is meant to be lived boldly. The biggest risk is not taking any risks at all. Growth happens outside your comfort zone.'
    };
    
    return philosophies[personality];
  }
  
  private generateAdviceThemes(personality: AIPersonality, trajectory: LifeTrajectory, decision: Decision): string[] {
    const adviceThemes = {
      optimistic: [
        'Trust your instincts and maintain a positive outlook',
        'Focus on possibilities rather than limitations',
        'Surround yourself with supportive, like-minded people'
      ],
      realistic: [
        'Weigh pros and cons carefully but don\'t overthink',
        'Prepare for challenges while working toward your goals',
        'Maintain balance between ambition and contentment'
      ],
      cautious: [
        'Build a solid foundation before making major moves',
        'Have backup plans and emergency resources ready',
        'Make decisions based on long-term security and stability'
      ],
      adventurous: [
        'Don\'t let fear hold you back from amazing experiences',
        'Embrace uncertainty as the price of growth',
        'Take calculated risks and learn from every outcome'
      ]
    };
    
    return adviceThemes[personality];
  }
  
  private generateRegretsAndLearnings(personality: AIPersonality, trajectory: LifeTrajectory): string[] {
    const regretsAndLearnings = {
      optimistic: [
        'Wish I had been even more bold in pursuing opportunities',
        'Learned that positive thinking really does attract positive outcomes',
        'Regret not trusting my intuition sooner in some situations'
      ],
      realistic: [
        'Wish I had spent less time worrying about potential problems',
        'Learned that most challenges are manageable with the right approach',
        'Regret not giving myself more credit for handling difficulties well'
      ],
      cautious: [
        'Sometimes wonder if I was too conservative with certain opportunities',
        'Learned that calculated risks can lead to significant rewards',
        'Regret not pushing my comfort zone a little more in some areas'
      ],
      adventurous: [
        'Regret not taking even bigger risks when I had the chance',
        'Learned that failure is just another form of valuable education',
        'Wish I had started this adventurous approach to life even earlier'
      ]
    };
    
    return regretsAndLearnings[personality];
  }
  
  private generateProbabilityExplanation(
    confidenceScore: number, 
    personality: AIPersonality, 
    patterns: PatternSignature[]
  ): string {
    
    const confidenceLevel = confidenceScore > 80 ? 'high' : confidenceScore > 60 ? 'moderate' : 'developing';
    const dominantPattern = patterns[0]?.pattern_type || 'varied';
    
    const explanations = {
      optimistic: `This outcome has a ${confidenceLevel} likelihood based on your personality strengths and the positive momentum that tends to build when you align decisions with your values. The ${dominantPattern} pattern shows consistently in similar situations.`,
      
      realistic: `This scenario reflects a ${confidenceLevel} probability considering both opportunities and challenges. The ${dominantPattern} pattern is common for people with your profile making similar decisions, accounting for typical life complexities.`,
      
      cautious: `This conservative approach has a ${confidenceLevel} likelihood of success based on your careful planning style and risk management preferences. The ${dominantPattern} pattern shows the benefits of prioritizing stability and security.`,
      
      adventurous: `This bold path has a ${confidenceLevel} probability of unfolding this way, based on your willingness to embrace risk and adapt quickly. The ${dominantPattern} pattern reflects how adventurous decisions can lead to exponential growth despite uncertainty.`
    };
    
    return explanations[personality];
  }
  
  // Utility methods
  private generateMilestones(trajectory: LifeTrajectory, personality: AIPersonality, decision: Decision): string[] {
    const milestones = this.narrativizeMilestones(trajectory.key_turning_points || [], personality);
    
    // Ensure we have at least 3-4 milestones
    while (milestones.length < 3) {
      milestones.push(...this.generateGenericMilestones(personality));
    }
    
    return milestones.slice(0, 4);
  }
  
  private extractRisks(trajectory: LifeTrajectory, personality: AIPersonality): string[] {
    const baseRisks = [
      'Unexpected market changes could impact timeline',
      'Personal circumstances might require plan adjustments',
      'External factors beyond control could create challenges'
    ];
    
    const personalityRisks = {
      optimistic: ['Over-optimism might lead to insufficient preparation'],
      realistic: ['Analysis paralysis could delay action on time-sensitive opportunities'],
      cautious: ['Excessive caution might result in missed opportunities'],
      adventurous: ['Risk-taking could occasionally lead to significant setbacks']
    };
    
    return [...baseRisks, ...personalityRisks[personality]].slice(0, 3);
  }
  
  private extractOpportunities(trajectory: LifeTrajectory, personality: AIPersonality): string[] {
    const baseOpportunities = [
      'Network expansion could accelerate progress',
      'Skill development will open new pathways',
      'Market trends may create favorable conditions'
    ];
    
    const personalityOpportunities = {
      optimistic: ['Positive attitude will attract beneficial partnerships and support'],
      realistic: ['Balanced approach will enable pursuit of multiple complementary goals'],
      cautious: ['Strong foundation will allow confident action when high-value opportunities arise'],
      adventurous: ['Bold moves will differentiate and create unique value propositions']
    };
    
    return [...baseOpportunities, ...personalityOpportunities[personality]].slice(0, 3);
  }
  
  private calculateArchetypeProbability(personality: AIPersonality, trajectory: any, userProfile: UserProfile): number {
    // Base probabilities for each archetype
    const baseProbabilities = {
      optimistic: 25,
      realistic: 45,
      cautious: 20,
      adventurous: 15
    };
    
    let probability = baseProbabilities[personality];
    
    // Adjust based on user profile alignment
    if (personality === 'optimistic' && userProfile.bigFive.openness > 70) probability += 10;
    if (personality === 'cautious' && userProfile.bigFive.neuroticism > 60) probability += 15;
    if (personality === 'adventurous' && userProfile.bigFive.openness > 75) probability += 10;
    if (personality === 'realistic' && userProfile.bigFive.conscientiousness > 70) probability += 5;
    
    return Math.min(70, Math.max(15, probability));
  }
  
  private generateScenarioTitle(personality: AIPersonality, decision: Decision): string {
    const decisionType = decision.category || 'life';
    
    const titles = {
      optimistic: `The ${decisionType} breakthrough that exceeded all expectations`,
      realistic: `Navigating ${decisionType} change with balance and wisdom`,
      cautious: `Building security through thoughtful ${decisionType} planning`,
      adventurous: `The bold ${decisionType} leap that transformed everything`
    };
    
    return titles[personality];
  }
  
  private generateScenarioDescription(personality: AIPersonality, trajectory: LifeTrajectory, decision: Decision): string {
    const totalGrowth = this.calculateTotalGrowth(trajectory.timeline.year1, trajectory.timeline.year15);
    const growthDesc = totalGrowth > 30 ? 'significant positive' : totalGrowth > 10 ? 'steady positive' : 'stable';
    
    const descriptions = {
      optimistic: `A future where this decision leads to ${growthDesc} outcomes across multiple life areas, with opportunities compounding beautifully over time.`,
      realistic: `A balanced future that includes both challenges and rewards, with ${growthDesc} development through thoughtful navigation of trade-offs.`,
      cautious: `A secure future built on careful planning and risk management, achieving ${growthDesc} progress while maintaining stability and peace of mind.`,
      adventurous: `An exciting future full of growth and discovery, where embracing risk and uncertainty leads to ${growthDesc} transformation and remarkable experiences.`
    };
    
    return descriptions[personality];
  }
  
  private calculateImpactAnalysis(initialStats: LifeStats, finalStats: LifeStats): Scenario['impact'] {
    const impact: Scenario['impact'] = {} as any;
    
    Object.keys(initialStats).forEach(key => {
      const metric = key as keyof LifeStats;
      const change = finalStats[metric] - initialStats[metric];
      
      impact[metric] = {
        change,
        reasoning: this.generateImpactReasoning(metric, change),
        confidence: Math.min(100, Math.max(60, 80 + Math.abs(change) / 10))
      };
    });
    
    return impact;
  }
  
  private generateImpactReasoning(metric: keyof LifeStats, change: number): string {
    const direction = change > 0 ? 'positive' : 'negative';
    const magnitude = Math.abs(change) > 20 ? 'significant' : Math.abs(change) > 10 ? 'moderate' : 'slight';
    
    const reasonings = {
      financial: `${magnitude} ${direction} impact due to ${change > 0 ? 'career advancement and better opportunities' : 'transition costs and initial uncertainty'}`,
      happiness: `${magnitude} ${direction} change from ${change > 0 ? 'alignment with values and personal growth' : 'adjustment stress and temporary challenges'}`,
      career: `${magnitude} ${direction} development through ${change > 0 ? 'new skills and expanded network' : 'career transition challenges'}`,
      relationships: `${magnitude} ${direction} effect on social connections ${change > 0 ? 'through shared experiences and growth' : 'due to lifestyle changes and time constraints'}`,
      health: `${magnitude} ${direction} influence from ${change > 0 ? 'reduced stress and better work-life balance' : 'increased pressure and adjustment period'}`
    };
    
    return reasonings[metric];
  }
  
  private extractSupportingEvidence(simulation: SimulationRun): string[] {
    const evidence = [];
    
    // Pattern evidence
    if (simulation.dominant_patterns.length > 0) {
      const topPattern = simulation.dominant_patterns[0];
      evidence.push(`${Math.round(topPattern.probability * 100)}% of similar scenarios showed ${topPattern.pattern_type} pattern`);
    }
    
    // Confidence evidence
    evidence.push(`${simulation.confidence_score}% confidence based on ${simulation.trajectories.length} trajectory simulations`);
    
    // External factors evidence
    if (simulation.outlier_events.length > 0) {
      evidence.push(`Account for ${simulation.outlier_events.length} potential external factors and disruptions`);
    }
    
    return evidence;
  }
  
  private rankAndOptimizeArchetypes(archetypes: ScenarioArchetype[]): ScenarioArchetype[] {
    // Sort by pattern confidence and narrative quality
    return archetypes
      .sort((a, b) => b.pattern_confidence - a.pattern_confidence)
      .map(archetype => this.optimizeNarrative(archetype));
  }
  
  private optimizeNarrative(archetype: ScenarioArchetype): ScenarioArchetype {
    // Could apply additional narrative optimization here
    // For now, return as-is
    return archetype;
  }
  
  // Utility methods from simulation engine
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
}

// Export singleton
export const archetypePatternEngine = new ArchetypePatternEngine();