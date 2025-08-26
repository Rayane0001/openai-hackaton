import { UserProfile, LifeStats } from './types';
import { monteCarloSimulation } from './monte-carlo-simulation';
import { worldContext } from './world-context-engine';

export interface LifeAction {
  id: string;
  parentId?: string;
  x: number;
  y: number;
  level: number;
  timeframe: number; // months from start
  action: string;
  description: string;
  actionType: 'micro_decision' | 'major_decision' | 'life_event' | 'consequence' | 'milestone';
  category: 'career' | 'financial' | 'relationships' | 'health' | 'personal' | 'location' | 'education';
  specificity: 'high' | 'medium' | 'low'; // How specific/detailed this action is
  probability: number;
  lifeStats: LifeStats;
  aiReasoning: string; // Why this action leads to these stats
  prerequisites: string[]; // What needs to happen before this
  consequences: string[]; // What this action triggers
  worldFactors: string[];
  children: LifeAction[];
  conversationContext: string;
}

export interface AdvancedLifeTreeData {
  actions: LifeAction[];
  userProfile: UserProfile;
  generatedAt: Date;
  totalActions: number;
  branchDepth: number;
}

class AdvancedLifeTreeEngine {
  private actionCounter = 0;
  
  async generateCompleteLifeSimulation(userProfile: UserProfile): Promise<AdvancedLifeTreeData> {
    console.log('🧠 Starting advanced life simulation with massive granularity...');
    
    this.actionCounter = 0;
    const actions: LifeAction[] = [];
    
    // Root: Current life state
    const rootAction: LifeAction = {
      id: this.getActionId(),
      x: 1500,
      y: 100,
      level: 0,
      timeframe: 0,
      action: `Continue current life at ${userProfile.age}`,
      description: `Maintaining current path as ${userProfile.occupation}, age ${userProfile.age}`,
      actionType: 'milestone',
      category: 'personal',
      specificity: 'high',
      probability: 1.0,
      lifeStats: await this.calculateCurrentLifeStats(userProfile),
      aiReasoning: `Baseline life stats calculated from psychology profile: ${this.getPersonalityInsights(userProfile)}`,
      prerequisites: [],
      consequences: ['Opens all future life paths'],
      worldFactors: ['current_economic_climate', 'age_demographic'],
      children: [],
      conversationContext: `You are currently ${userProfile.age} years old, working as ${userProfile.occupation}.`
    };
    
    actions.push(rootAction);
    
    // Generate quality-focused life paths (limited depth to avoid repetition)
    await this.generateMicroLifePaths(rootAction, userProfile, actions, 5, 120); // 10 years simulation, max 5 levels
    
    console.log(`✅ Generated ${actions.length} life actions with deep granularity`);
    
    return {
      actions,
      userProfile,
      generatedAt: new Date(),
      totalActions: actions.length,
      branchDepth: 8
    };
  }

  private async generateMicroLifePaths(
    parentAction: LifeAction,
    userProfile: UserProfile,
    actions: LifeAction[],
    maxDepth: number,
    maxTimeframe: number // months
  ): Promise<void> {
    if (parentAction.level >= maxDepth || parentAction.timeframe >= maxTimeframe) return;

    // Get time-appropriate micro actions
    const microActions = await this.generateTimeSpecificActions(
      parentAction, 
      userProfile, 
      parentAction.level
    );

    const childY = parentAction.y + 200;
    const totalWidth = Math.max(2000, microActions.length * 300);
    const startX = parentAction.x - totalWidth / 2;
    const stepX = totalWidth / (microActions.length + 1);

    for (let i = 0; i < microActions.length; i++) {
      const microAction = microActions[i];
      const childX = startX + stepX * (i + 1);
      
      // Calculate AI-powered life stats impact
      const aiImpact = await this.calculateAILifeImpact(
        microAction, 
        parentAction.lifeStats, 
        userProfile,
        parentAction.timeframe
      );
      
      const actionNode: LifeAction = {
        id: this.getActionId(),
        parentId: parentAction.id,
        x: childX,
        y: childY,
        level: parentAction.level + 1,
        timeframe: parentAction.timeframe + microAction.timeOffset,
        action: microAction.action,
        description: microAction.description,
        actionType: microAction.type as LifeAction['actionType'],
        category: microAction.category as LifeAction['category'],
        specificity: microAction.specificity as LifeAction['specificity'],
        probability: parentAction.probability * microAction.probability,
        lifeStats: aiImpact.stats,
        aiReasoning: aiImpact.reasoning,
        prerequisites: microAction.prerequisites,
        consequences: microAction.consequences,
        worldFactors: microAction.worldFactors,
        children: [],
        conversationContext: this.buildDetailedContext(microAction, userProfile, parentAction.timeframe + microAction.timeOffset)
      };

      actions.push(actionNode);
      parentAction.children.push(actionNode);

      // Continue branching avec contrôle strict pour éviter explosion de nœuds
      if (actionNode.probability > 0.4 && parentAction.level < 3 && actions.length < 200) {
        await this.generateMicroLifePaths(actionNode, userProfile, actions, maxDepth, maxTimeframe);
      }
    }
  }

  private async generateTimeSpecificActions(
    parentAction: LifeAction, 
    userProfile: UserProfile, 
    currentLevel: number
  ) {
    const currentAge = userProfile.age + Math.floor(parentAction.timeframe / 12);
    const personality = userProfile.bigFive;
    
    // Get context-specific action templates
    const actionTemplates = this.getDetailedActionTemplates(
      parentAction.category,
      currentAge,
      parentAction.timeframe,
      personality,
      currentLevel
    );

    // Apply personality filters and world context
    const filteredActions = actionTemplates.filter(action => 
      this.isActionPersonalityCompatible(action, personality) &&
      this.isActionTimeAppropriate(action, currentAge, parentAction.timeframe)
    );

    // Limiter drastiquement le nombre d'actions pour éviter répétitions
    const maxActions = currentLevel === 0 ? 4 : Math.max(2, 4 - currentLevel);
    return this.selectDiverseActions(filteredActions, maxActions);
  }

  private getDetailedActionTemplates(
    parentCategory: string,
    age: number,
    timeframe: number,
    personality: any,
    level: number
  ) {
    const month = timeframe % 12;
    const year = Math.floor(timeframe / 12);
    
    const templates = {
      // CAREER - Diversified career paths
      career: this.getCareerActionsByAge(age, timeframe, level),

      // FINANCIAL - Age-based financial decisions
      financial: this.getFinancialActionsByAge(age, timeframe, level),

      // RELATIONSHIPS - Context-specific social development
      relationships: this.getRelationshipActionsByAge(age, timeframe, level),

      // HEALTH - Lifecycle health decisions
      health: this.getHealthActionsByAge(age, timeframe, level),

      // PERSONAL - Life-stage personal growth
      personal: this.getPersonalActionsByAge(age, timeframe, level)
    };

    return templates[parentCategory as keyof typeof templates] || templates.career;
  }

  private async calculateAILifeImpact(
    action: any,
    currentStats: LifeStats,
    userProfile: UserProfile,
    timeframe: number
  ): Promise<{ stats: LifeStats; reasoning: string }> {
    // Simulate AI reasoning for life impact calculation
    const personality = userProfile.bigFive;
    const age = userProfile.age + Math.floor(timeframe / 12);
    
    // Base impact calculation with AI-like reasoning
    let impact = this.calculateBaseImpact(action, currentStats);
    
    // Personality modifiers
    if (action.category === 'career' && personality.conscientiousness > 75) {
      impact.career *= 1.3;
      impact.financial *= 1.2;
    }
    
    if (action.category === 'relationships' && personality.extraversion > 70) {
      impact.relationships *= 1.4;
      impact.happiness *= 1.2;
    }
    
    if (action.category === 'health' && personality.conscientiousness > 80) {
      impact.health *= 1.3;
      impact.happiness *= 1.1;
    }
    
    // Age factor
    const ageFactor = Math.max(0.8, 1 - (age - 25) * 0.005);
    impact.health *= ageFactor;
    
    // Apply world context modifiers
    const worldMultiplier = await this.getWorldImpactMultiplier(action, timeframe);
    Object.keys(impact).forEach(key => {
      impact[key as keyof LifeStats] *= worldMultiplier;
    });
    
    // Calculate new stats
    const newStats: LifeStats = {
      financial: Math.max(0, Math.min(100, currentStats.financial + impact.financial)),
      happiness: Math.max(0, Math.min(100, currentStats.happiness + impact.happiness)),
      career: Math.max(0, Math.min(100, currentStats.career + impact.career)),
      relationships: Math.max(0, Math.min(100, currentStats.relationships + impact.relationships)),
      health: Math.max(0, Math.min(100, currentStats.health + impact.health))
    };

    const reasoning = this.generateAIReasoning(action, impact, personality, age, worldMultiplier);
    
    return { stats: newStats, reasoning };
  }

  private calculateBaseImpact(action: any, currentStats: LifeStats) {
    const impactMap = {
      // Career actions
      'Request 15% salary increase meeting': { financial: 8, career: 5, happiness: 3, relationships: -1, health: 0 },
      'Apply to Google L5 Software Engineer role': { financial: 15, career: 20, happiness: 5, relationships: -2, health: -3 },
      'Complete AWS Solutions Architect certification': { financial: 5, career: 12, happiness: 4, relationships: 0, health: -1 },
      'Launch side consulting business': { financial: 12, career: 15, happiness: 8, relationships: -5, health: -8 },
      'Transition to Product Manager role internally': { financial: 7, career: 18, happiness: 6, relationships: 3, health: -2 },
      'Join startup as CTO co-founder': { financial: -5, career: 25, happiness: 12, relationships: -8, health: -10 },
      
      // Financial actions
      'Invest $5000 in S&P 500 index fund': { financial: 8, career: 0, happiness: 2, relationships: 0, health: 0 },
      'Purchase $400k condo with 20% down': { financial: 15, career: 0, happiness: 8, relationships: 5, health: 2 },
      'Open Roth IRA with $6500 contribution': { financial: 12, career: 0, happiness: 3, relationships: 0, health: 0 },
      'Start cryptocurrency investment with $2000': { financial: 0, career: 0, happiness: -2, relationships: 0, health: -1 },
      
      // Relationship actions
      'Join local hiking meetup group': { financial: -1, career: 2, happiness: 8, relationships: 12, health: 6 },
      'Ask Sarah on second date to art museum': { financial: -1, career: 0, happiness: 6, relationships: 8, health: 1 },
      'Move in together after 8 months dating': { financial: 5, career: 0, happiness: 10, relationships: 15, health: 3 },
      'Propose marriage with $8000 ring': { financial: -8, career: 0, happiness: 15, relationships: 20, health: 2 },
      
      // Health actions
      'Join CrossFit gym membership $150/month': { financial: -2, career: 0, happiness: 6, relationships: 4, health: 15 },
      'Hire personal trainer for 3 months': { financial: -4, career: 0, happiness: 4, relationships: 2, health: 18 },
      'Complete 10-day silent meditation retreat': { financial: -2, career: 2, happiness: 12, relationships: 1, health: 8 },
      'Get comprehensive health checkup': { financial: -1, career: 0, happiness: 2, relationships: 0, health: 5 },
      
      // Location actions
      'Relocate to Austin for tech scene': { financial: -5, career: 12, happiness: 8, relationships: -8, health: 2 },
      'Upgrade to luxury 1-bedroom downtown': { financial: -8, career: 2, happiness: 6, relationships: 3, health: 1 },
      'Buy Tesla Model 3 for $45k': { financial: -12, career: 1, happiness: 8, relationships: 2, health: 1 }
    };

    return impactMap[action.action as keyof typeof impactMap] || { financial: 0, career: 0, happiness: 0, relationships: 0, health: 0 };
  }

  private generateAIReasoning(action: any, impact: any, personality: any, age: number, worldMultiplier: number): string {
    const reasons = [];
    
    if (impact.financial !== 0) {
      reasons.push(`Financial impact (${impact.financial > 0 ? '+' : ''}${impact.financial.toFixed(1)}): ${impact.financial > 0 ? 'Income boost from' : 'Cost associated with'} ${action.action.toLowerCase()}`);
    }
    
    if (impact.career !== 0) {
      reasons.push(`Career development (${impact.career > 0 ? '+' : ''}${impact.career.toFixed(1)}): Professional growth through ${action.category} advancement`);
    }
    
    if (impact.happiness !== 0) {
      reasons.push(`Happiness change (${impact.happiness > 0 ? '+' : ''}${impact.happiness.toFixed(1)}): ${impact.happiness > 0 ? 'Positive' : 'Stressful'} life change affecting wellbeing`);
    }

    if (personality.conscientiousness > 75 && action.category === 'career') {
      reasons.push(`High conscientiousness (+30% career impact): Strong work ethic amplifies professional benefits`);
    }
    
    if (worldMultiplier !== 1.0) {
      reasons.push(`World context modifier (×${worldMultiplier.toFixed(2)}): Current market conditions ${worldMultiplier > 1 ? 'favor' : 'challenge'} this decision`);
    }

    return reasons.join(' • ');
  }

  private async getWorldImpactMultiplier(action: any, timeframe: number): Promise<number> {
    // Simulate world context impact
    let multiplier = 1.0;
    
    if (action.category === 'career' && action.action.includes('tech')) {
      multiplier = 1.2; // Tech boom
    }
    
    if (action.category === 'financial' && action.action.includes('real estate')) {
      multiplier = 1.1; // Real estate appreciation
    }
    
    if (action.category === 'financial' && action.action.includes('crypto')) {
      multiplier = 0.8; // Crypto volatility
    }

    return multiplier;
  }

  private async calculateCurrentLifeStats(userProfile: UserProfile): Promise<LifeStats> {
    // Use Monte Carlo simulation to get realistic baseline
    const mockDecision = {
      id: 'baseline',
      title: 'Continue current path',
      description: 'Maintain status quo',
      category: 'lifestyle' as const,
      urgency: 'low' as const,
      timeline: 'short_term' as const,
      constraints: [],
      alternatives: [],
      createdAt: new Date()
    };

    try {
      const simulation = await monteCarloSimulation.runPersonalitySimulation(
        mockDecision, userProfile, 'realistic', 10
      );

      return simulation.trajectories[0]?.timeline.year1 || this.getFallbackStats(userProfile);
    } catch (error) {
      return this.getFallbackStats(userProfile);
    }
  }

  private getFallbackStats(userProfile: UserProfile): LifeStats {
    const age = userProfile.age;
    const p = userProfile.bigFive;
    
    return {
      financial: Math.round(35 + p.conscientiousness * 0.5 + (age - 25) * 1.5),
      happiness: Math.round(55 + p.extraversion * 0.4 - p.neuroticism * 0.3),
      career: Math.round(40 + p.openness * 0.4 + p.conscientiousness * 0.3),
      relationships: Math.round(60 + p.agreeableness * 0.4 + p.extraversion * 0.3),
      health: Math.round(70 - (age - 25) * 0.8 + p.conscientiousness * 0.2)
    };
  }

  private isActionPersonalityCompatible(action: any, personality: any): boolean {
    if (action.action.includes('startup') && personality.openness < 60) return false;
    if (action.action.includes('investment') && personality.conscientiousness < 50) return false;
    if (action.action.includes('social') && personality.extraversion < 40) return false;
    return true;
  }

  private isActionTimeAppropriate(action: any, age: number, timeframe: number): boolean {
    if (action.action.includes('marriage') && age < 26) return false;
    if (action.action.includes('startup') && age > 45) return false;
    if (action.action.includes('certification') && timeframe > 120) return false;
    return true;
  }

  private getPersonalityInsights(profile: UserProfile): string {
    const p = profile.bigFive;
    const insights = [];
    
    if (p.openness > 70) insights.push('highly creative and open to new experiences');
    if (p.conscientiousness > 75) insights.push('extremely disciplined and organized');
    if (p.extraversion > 65) insights.push('socially energetic and outgoing');
    if (p.agreeableness > 70) insights.push('cooperative and trusting');
    if (p.neuroticism < 40) insights.push('emotionally stable and resilient');
    
    return insights.slice(0, 2).join(', ');
  }

  private buildDetailedContext(action: any, profile: UserProfile, timeframe: number): string {
    const age = profile.age + Math.floor(timeframe / 12);
    const months = timeframe % 12;
    
    return `You are ${age} years old, ${months} months into this life path. You recently decided to ${action.action.toLowerCase()}. You can reflect on this specific choice and its immediate consequences from your lived experience.`;
  }

  private getActionId(): string {
    return `action_${++this.actionCounter}`;
  }

  async regenerateBranchWithMassiveDetail(
    actionId: string, 
    newAction: string, 
    treeData: AdvancedLifeTreeData
  ): Promise<AdvancedLifeTreeData> {
    const targetAction = treeData.actions.find(a => a.id === actionId);
    if (!targetAction) return treeData;

    // Remove all descendants
    const descendantIds = this.getAllDescendantIds(targetAction, treeData.actions);
    const filteredActions = treeData.actions.filter(a => !descendantIds.includes(a.id));
    
    // Update target action
    targetAction.action = `🎯 ${newAction}`;
    targetAction.description = `User override: ${newAction}`;
    targetAction.children = [];
    
    // Generate massive new branching from this override
    await this.generateMicroLifePaths(targetAction, treeData.userProfile, filteredActions, 8, 240);
    
    return { ...treeData, actions: filteredActions, totalActions: filteredActions.length };
  }

  private getCareerActionsByAge(age: number, _timeframe: number, _level: number): Array<{action: string, description: string, timeOffset: number, probability: number, type: string, category: string, specificity: string}> {
    const actions = [];
    
    if (age < 30) {
      actions.push(
        { action: 'Complete professional certification', description: 'Build credibility with industry certification', timeOffset: 4, probability: 0.8, type: 'micro_decision', category: 'career', specificity: 'high' },
        { action: 'Join startup as early employee', description: 'Take equity risk for potential high rewards', timeOffset: 8, probability: 0.4, type: 'major_decision', category: 'career', specificity: 'high' },
        { action: 'Request mentorship program', description: 'Seek guidance from senior professionals', timeOffset: 2, probability: 0.7, type: 'micro_decision', category: 'career', specificity: 'medium' }
      );
    } else if (age < 40) {
      actions.push(
        { action: 'Apply for team leadership role', description: 'Step into management responsibilities', timeOffset: 6, probability: 0.6, type: 'major_decision', category: 'career', specificity: 'high' },
        { action: 'Launch consulting side business', description: 'Monetize expertise independently', timeOffset: 12, probability: 0.5, type: 'major_decision', category: 'career', specificity: 'high' },
        { action: 'Negotiate remote work arrangement', description: 'Optimize work-life balance', timeOffset: 3, probability: 0.8, type: 'micro_decision', category: 'career', specificity: 'medium' }
      );
    } else {
      actions.push(
        { action: 'Consider executive coaching', description: 'Develop senior leadership skills', timeOffset: 8, probability: 0.6, type: 'micro_decision', category: 'career', specificity: 'medium' },
        { action: 'Explore board positions', description: 'Leverage experience for governance roles', timeOffset: 18, probability: 0.3, type: 'major_decision', category: 'career', specificity: 'high' },
        { action: 'Plan succession strategy', description: 'Prepare next generation leaders', timeOffset: 12, probability: 0.4, type: 'micro_decision', category: 'career', specificity: 'medium' }
      );
    }
    
    return actions.map(action => ({ ...action, prerequisites: [], consequences: [], worldFactors: [] }));
  }

  private getFinancialActionsByAge(age: number, timeframe: number, level: number): any[] {
    const actions = [];
    
    if (age < 30) {
      actions.push(
        { action: 'Open high-yield savings account', description: 'Maximize emergency fund growth', timeOffset: 1, probability: 0.9, type: 'micro_decision', category: 'financial', specificity: 'low' },
        { action: 'Start 401k contributions', description: 'Begin retirement planning early', timeOffset: 2, probability: 0.8, type: 'micro_decision', category: 'financial', specificity: 'medium' },
        { action: 'Pay off student loans aggressively', description: 'Eliminate high-interest education debt', timeOffset: 24, probability: 0.7, type: 'major_decision', category: 'financial', specificity: 'high' }
      );
    } else if (age < 40) {
      actions.push(
        { action: 'Purchase first investment property', description: 'Enter real estate market', timeOffset: 18, probability: 0.4, type: 'major_decision', category: 'financial', specificity: 'high' },
        { action: 'Maximize retirement contributions', description: 'Accelerate wealth building', timeOffset: 3, probability: 0.7, type: 'micro_decision', category: 'financial', specificity: 'medium' },
        { action: 'Diversify investment portfolio', description: 'Reduce risk through diversification', timeOffset: 6, probability: 0.8, type: 'micro_decision', category: 'financial', specificity: 'medium' }
      );
    } else {
      actions.push(
        { action: 'Plan estate and succession', description: 'Protect wealth for next generation', timeOffset: 12, probability: 0.6, type: 'major_decision', category: 'financial', specificity: 'high' },
        { action: 'Consider tax optimization strategies', description: 'Minimize tax burden legally', timeOffset: 8, probability: 0.7, type: 'micro_decision', category: 'financial', specificity: 'medium' },
        { action: 'Evaluate early retirement options', description: 'Assess financial independence', timeOffset: 6, probability: 0.5, type: 'micro_decision', category: 'financial', specificity: 'high' }
      );
    }
    
    return actions.map(action => ({ ...action, prerequisites: [], consequences: [], worldFactors: [] }));
  }

  private getRelationshipActionsByAge(age: number, timeframe: number, level: number): any[] {
    const actions = [];
    
    if (age < 30) {
      actions.push(
        { action: 'Join hobby-based social groups', description: 'Meet people with shared interests', timeOffset: 2, probability: 0.8, type: 'micro_decision', category: 'relationships', specificity: 'medium' },
        { action: 'Try online dating seriously', description: 'Expand romantic opportunities', timeOffset: 3, probability: 0.6, type: 'micro_decision', category: 'relationships', specificity: 'medium' },
        { action: 'Strengthen college friendships', description: 'Maintain important connections', timeOffset: 1, probability: 0.7, type: 'micro_decision', category: 'relationships', specificity: 'low' }
      );
    } else if (age < 40) {
      actions.push(
        { action: 'Plan wedding with partner', description: 'Formalize committed relationship', timeOffset: 12, probability: 0.5, type: 'major_decision', category: 'relationships', specificity: 'high' },
        { action: 'Start family planning discussions', description: 'Consider having children', timeOffset: 6, probability: 0.6, type: 'major_decision', category: 'relationships', specificity: 'high' },
        { action: 'Join parent networks', description: 'Connect with other families', timeOffset: 4, probability: 0.7, type: 'micro_decision', category: 'relationships', specificity: 'medium' }
      );
    } else {
      actions.push(
        { action: 'Focus on marriage renewal', description: 'Strengthen long-term partnership', timeOffset: 6, probability: 0.6, type: 'micro_decision', category: 'relationships', specificity: 'medium' },
        { action: 'Mentor younger professionals', description: 'Give back through mentorship', timeOffset: 8, probability: 0.7, type: 'micro_decision', category: 'relationships', specificity: 'medium' },
        { action: 'Plan multi-generational activities', description: 'Connect family across generations', timeOffset: 3, probability: 0.8, type: 'micro_decision', category: 'relationships', specificity: 'low' }
      );
    }
    
    return actions.map(action => ({ ...action, prerequisites: [], consequences: [], worldFactors: [] }));
  }

  private getHealthActionsByAge(age: number, timeframe: number, level: number): any[] {
    const actions = [];
    
    if (age < 30) {
      actions.push(
        { action: 'Establish workout routine', description: 'Build lifelong fitness habits', timeOffset: 2, probability: 0.8, type: 'micro_decision', category: 'health', specificity: 'medium' },
        { action: 'Learn stress management techniques', description: 'Develop coping strategies early', timeOffset: 3, probability: 0.7, type: 'micro_decision', category: 'health', specificity: 'medium' },
        { action: 'Get comprehensive health baseline', description: 'Establish health metrics', timeOffset: 1, probability: 0.9, type: 'micro_decision', category: 'health', specificity: 'low' }
      );
    } else if (age < 40) {
      actions.push(
        { action: 'Focus on injury prevention', description: 'Adapt exercise for aging body', timeOffset: 4, probability: 0.7, type: 'micro_decision', category: 'health', specificity: 'medium' },
        { action: 'Address work-related strain', description: 'Prevent repetitive stress injuries', timeOffset: 6, probability: 0.8, type: 'micro_decision', category: 'health', specificity: 'medium' },
        { action: 'Prioritize sleep quality', description: 'Optimize rest for busy lifestyle', timeOffset: 2, probability: 0.9, type: 'micro_decision', category: 'health', specificity: 'low' }
      );
    } else {
      actions.push(
        { action: 'Increase preventive screenings', description: 'Early detection of age-related issues', timeOffset: 6, probability: 0.9, type: 'micro_decision', category: 'health', specificity: 'high' },
        { action: 'Adapt fitness for mobility', description: 'Maintain strength and flexibility', timeOffset: 3, probability: 0.8, type: 'micro_decision', category: 'health', specificity: 'medium' },
        { action: 'Consider hormone optimization', description: 'Address age-related changes', timeOffset: 8, probability: 0.5, type: 'micro_decision', category: 'health', specificity: 'high' }
      );
    }
    
    return actions.map(action => ({ ...action, prerequisites: [], consequences: [], worldFactors: [] }));
  }

  private getPersonalActionsByAge(age: number, timeframe: number, level: number): any[] {
    const actions = [];
    
    if (age < 30) {
      actions.push(
        { action: 'Explore different cities', description: 'Experience diverse living environments', timeOffset: 8, probability: 0.6, type: 'micro_decision', category: 'personal', specificity: 'medium' },
        { action: 'Develop creative hobbies', description: 'Explore artistic expression', timeOffset: 2, probability: 0.7, type: 'micro_decision', category: 'personal', specificity: 'low' },
        { action: 'Travel internationally', description: 'Broaden cultural perspective', timeOffset: 6, probability: 0.5, type: 'micro_decision', category: 'personal', specificity: 'medium' }
      );
    } else if (age < 40) {
      actions.push(
        { action: 'Create home office space', description: 'Optimize work environment', timeOffset: 3, probability: 0.8, type: 'micro_decision', category: 'personal', specificity: 'low' },
        { action: 'Plan major home renovation', description: 'Invest in living space quality', timeOffset: 12, probability: 0.4, type: 'major_decision', category: 'personal', specificity: 'high' },
        { action: 'Start meaningful volunteer work', description: 'Give back to community', timeOffset: 4, probability: 0.6, type: 'micro_decision', category: 'personal', specificity: 'medium' }
      );
    } else {
      actions.push(
        { action: 'Pursue advanced education', description: 'Continue lifelong learning', timeOffset: 18, probability: 0.3, type: 'major_decision', category: 'personal', specificity: 'high' },
        { action: 'Plan legacy projects', description: 'Create lasting impact', timeOffset: 12, probability: 0.5, type: 'major_decision', category: 'personal', specificity: 'high' },
        { action: 'Simplify lifestyle', description: 'Focus on what truly matters', timeOffset: 6, probability: 0.7, type: 'micro_decision', category: 'personal', specificity: 'medium' }
      );
    }
    
    return actions.map(action => ({ ...action, prerequisites: [], consequences: [], worldFactors: [] }));
  }

  private selectDiverseActions(actions: any[], maxActions: number): any[] {
    if (actions.length <= maxActions) return actions;
    
    // Grouper par catégorie et type pour éviter duplication
    const categories = new Map<string, any[]>();
    actions.forEach(action => {
      const key = `${action.category}_${action.type}`;
      if (!categories.has(key)) categories.set(key, []);
      categories.get(key)!.push(action);
    });
    
    // Sélectionner maximum 1 action par catégorie/type
    const selected: any[] = [];
    for (const [key, categoryActions] of categories) {
      if (selected.length >= maxActions) break;
      
      // Prendre l'action avec la meilleure probabilité dans cette catégorie
      const best = categoryActions.sort((a, b) => b.probability - a.probability)[0];
      selected.push(best);
    }
    
    // Compléter avec des actions aléatoires si besoin
    const remaining = actions.filter(a => !selected.includes(a));
    while (selected.length < maxActions && remaining.length > 0) {
      const random = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
      selected.push(random);
    }
    
    return selected.slice(0, maxActions);
  }

  private getAllDescendantIds(action: LifeAction, allActions: LifeAction[]): string[] {
    const descendants: string[] = [];
    const traverse = (currentAction: LifeAction) => {
      for (const child of currentAction.children) {
        descendants.push(child.id);
        traverse(child);
      }
    };
    traverse(action);
    return descendants;
  }
}

export const advancedLifeTreeEngine = new AdvancedLifeTreeEngine();