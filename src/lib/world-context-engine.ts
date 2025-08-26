// @file src/lib/world-context-engine.ts
// Dynamic World State Context Engine - The brain behind realistic predictions

import { UserProfile, Decision } from './types';

export interface WorldState {
  economic_climate: 'recession' | 'growth' | 'stable' | 'volatile';
  industry_trends: { [sector: string]: IndustryTrend };
  demographic_shifts: DemographicContext;
  technology_disruption: TechDisruption[];
  geographic_factors: LocationContext;
  social_trends: SocialTrend[];
  time_pressure: TimeWindow;
}

export interface IndustryTrend {
  direction: 'rising' | 'declining' | 'mature' | 'disrupted';
  confidence: number; // 0-100
  timeframe: '1-2years' | '3-5years' | '5-10years';
  key_drivers: string[];
  threat_level: number; // 0-100 (job security risk)
  opportunity_score: number; // 0-100 (growth potential)
}

export interface LocationContext {
  cost_of_living_trend: 'increasing' | 'stable' | 'decreasing';
  job_market_strength: number; // 0-100
  network_opportunities: number; // 0-100
  family_friendliness: number; // 0-100
  cultural_fit: number; // 0-100 based on user profile
}

export interface TechDisruption {
  technology: string;
  industries_affected: string[];
  timeline: 'immediate' | '2-3years' | '5-7years' | '10+years';
  disruption_severity: number; // 0-100
  new_opportunities: string[];
}

export interface SocialTrend {
  trend_name: string;
  relevance_to_decision: number; // 0-100
  impact_direction: 'positive' | 'negative' | 'mixed';
  affected_demographics: string[];
}

export interface TimeWindow {
  current_phase: 'planning' | 'execution' | 'adaptation';
  optimal_timing: number; // 0-100 (how good is timing)
  deadline_pressure: number; // 0-100 (urgency level)
  market_cycle_position: 'early' | 'peak' | 'decline' | 'recovery';
}

export interface DemographicContext {
  age_cohort_trends: string[];
  lifecycle_stage: 'exploring' | 'establishing' | 'advancing' | 'transitioning' | 'optimizing';
  peer_group_patterns: string[];
  generational_factors: string[];
}

export class WorldContextEngine {
  private worldState: WorldState;

  constructor() {
    this.worldState = this.initializeWorldState();
  }

  private initializeWorldState(): WorldState {
    // Current world context (2025) - could be updated with real-time data
    return {
      economic_climate: 'volatile', // Post-2024 adjustments
      
      industry_trends: {
        'technology': {
          direction: 'rising',
          confidence: 85,
          timeframe: '3-5years',
          key_drivers: ['AI adoption', 'Remote work normalization', 'Automation'],
          threat_level: 40, // AI replacing some jobs
          opportunity_score: 90
        },
        'healthcare': {
          direction: 'rising',
          confidence: 95,
          timeframe: '5-10years',
          key_drivers: ['Aging population', 'Mental health focus', 'Preventive care'],
          threat_level: 10,
          opportunity_score: 85
        },
        'finance': {
          direction: 'disrupted',
          confidence: 70,
          timeframe: '1-2years',
          key_drivers: ['Fintech', 'Crypto regulation', 'AI trading'],
          threat_level: 60,
          opportunity_score: 75
        },
        'retail': {
          direction: 'declining',
          confidence: 80,
          timeframe: '1-2years',
          key_drivers: ['E-commerce dominance', 'Supply chain issues'],
          threat_level: 75,
          opportunity_score: 30
        },
        'education': {
          direction: 'mature',
          confidence: 60,
          timeframe: '5-10years',
          key_drivers: ['Online learning', 'Skill-based hiring', 'Credentials disruption'],
          threat_level: 45,
          opportunity_score: 65
        }
      },

      technology_disruption: [
        {
          technology: 'AI/LLMs',
          industries_affected: ['content', 'customer service', 'coding', 'analysis'],
          timeline: 'immediate',
          disruption_severity: 85,
          new_opportunities: ['AI prompt engineering', 'Human-AI collaboration', 'AI ethics']
        },
        {
          technology: 'Remote collaboration tools',
          industries_affected: ['all knowledge work'],
          timeline: 'immediate',
          disruption_severity: 70,
          new_opportunities: ['Distributed team management', 'Async workflows']
        },
        {
          technology: 'Autonomous vehicles',
          industries_affected: ['transportation', 'logistics', 'urban planning'],
          timeline: '5-7years',
          disruption_severity: 90,
          new_opportunities: ['Fleet management', 'Mobility services']
        }
      ],

      demographic_shifts: {
        age_cohort_trends: [
          'Millennials entering peak career years',
          'Gen Z prioritizing work-life balance',
          'Boomers delaying retirement'
        ],
        lifecycle_stage: 'establishing', // Default - will be personalized
        peer_group_patterns: [
          'Career pivoting more common',
          'Entrepreneurship rising',
          'Geographic mobility increasing'
        ],
        generational_factors: [
          'Technology native advantages',
          'Economic uncertainty adaptation',
          'Value-driven decision making'
        ]
      },

      geographic_factors: {
        cost_of_living_trend: 'increasing',
        job_market_strength: 70,
        network_opportunities: 60,
        family_friendliness: 65,
        cultural_fit: 70 // Will be personalized
      },

      social_trends: [
        {
          trend_name: 'Remote work normalization',
          relevance_to_decision: 90,
          impact_direction: 'positive',
          affected_demographics: ['knowledge workers', 'young professionals']
        },
        {
          trend_name: 'Mental health prioritization',
          relevance_to_decision: 75,
          impact_direction: 'positive',
          affected_demographics: ['all ages', 'high-stress careers']
        },
        {
          trend_name: 'Climate change concerns',
          relevance_to_decision: 60,
          impact_direction: 'mixed',
          affected_demographics: ['young adults', 'families']
        }
      ],

      time_pressure: {
        current_phase: 'execution',
        optimal_timing: 65, // Generally decent time to make changes
        deadline_pressure: 50, // Moderate urgency
        market_cycle_position: 'recovery' // Post-pandemic recovery phase
      }
    };
  }

  // Personalize world context based on user profile and decision
  personalizeContext(userProfile: UserProfile, decision: Decision): WorldState {
    const personalizedState = { ...this.worldState };

    // Adjust based on user age and lifecycle stage
    if (userProfile.age < 25) {
      personalizedState.demographic_shifts.lifecycle_stage = 'exploring';
      personalizedState.time_pressure.optimal_timing += 20; // More time flexibility
    } else if (userProfile.age > 40) {
      personalizedState.demographic_shifts.lifecycle_stage = 'advancing';
      personalizedState.time_pressure.deadline_pressure += 15; // More urgency
    }

    // Industry-specific adjustments
    const userIndustry = this.inferIndustryFromDecision(decision);
    if (personalizedState.industry_trends[userIndustry]) {
      // Boost relevance of user's industry context
      const industryTrend = personalizedState.industry_trends[userIndustry];
      personalizedState.time_pressure.optimal_timing = this.calculateOptimalTiming(industryTrend);
    }

    // Decision category specific factors
    switch (decision.category) {
      case 'career':
        personalizedState.time_pressure.deadline_pressure += 10;
        break;
      case 'relationships':
        personalizedState.social_trends.forEach(trend => {
          if (trend.trend_name.includes('mental health') || trend.trend_name.includes('work-life')) {
            trend.relevance_to_decision += 20;
          }
        });
        break;
      case 'financial':
        personalizedState.economic_climate = this.adjustForFinancialContext(personalizedState.economic_climate);
        break;
    }

    // Personality-based adjustments
    if (userProfile.bigFive.openness > 70) {
      personalizedState.technology_disruption.forEach(disruption => {
        disruption.new_opportunities.push('Early adopter advantage');
      });
    }

    if (userProfile.bigFive.conscientiousness > 70) {
      personalizedState.time_pressure.optimal_timing += 10; // Better at planning
    }

    return personalizedState;
  }

  private inferIndustryFromDecision(decision: Decision): string {
    const decisionText = `${decision.title} ${decision.description}`.toLowerCase();
    
    if (decisionText.includes('job') || decisionText.includes('career') || decisionText.includes('work')) {
      if (decisionText.includes('tech') || decisionText.includes('software') || decisionText.includes('ai')) {
        return 'technology';
      }
      if (decisionText.includes('health') || decisionText.includes('medical')) {
        return 'healthcare';
      }
      if (decisionText.includes('finance') || decisionText.includes('bank')) {
        return 'finance';
      }
      if (decisionText.includes('education') || decisionText.includes('teaching')) {
        return 'education';
      }
    }
    
    return 'technology'; // Default fallback
  }

  private calculateOptimalTiming(industryTrend: IndustryTrend): number {
    let timing = 50; // Base timing
    
    if (industryTrend.direction === 'rising') timing += 20;
    if (industryTrend.direction === 'declining') timing -= 25;
    if (industryTrend.direction === 'disrupted') timing += 30; // High risk/reward
    
    if (industryTrend.confidence > 80) timing += 10;
    if (industryTrend.threat_level > 70) timing -= 15;
    if (industryTrend.opportunity_score > 80) timing += 15;
    
    return Math.max(0, Math.min(100, timing));
  }

  private adjustForFinancialContext(currentClimate: WorldState['economic_climate']): WorldState['economic_climate'] {
    // Could incorporate real economic indicators
    return currentClimate;
  }

  // Get critical factors that will influence this specific decision
  getCriticalFactors(decision: Decision, userProfile: UserProfile): string[] {
    const personalizedContext = this.personalizeContext(userProfile, decision);
    const factors: string[] = [];

    // Economic factors
    factors.push(`Economic climate is ${personalizedContext.economic_climate} - affecting job security and opportunities`);

    // Industry specific
    const industry = this.inferIndustryFromDecision(decision);
    const industryTrend = personalizedContext.industry_trends[industry];
    if (industryTrend) {
      factors.push(`${industry} industry is ${industryTrend.direction} with ${industryTrend.confidence}% confidence`);
      
      if (industryTrend.threat_level > 50) {
        factors.push(`High disruption risk (${industryTrend.threat_level}%) in your industry`);
      }
    }

    // Timing factors
    if (personalizedContext.time_pressure.optimal_timing > 70) {
      factors.push('Timing is favorable - market conditions support this decision');
    } else if (personalizedContext.time_pressure.optimal_timing < 40) {
      factors.push('Timing is challenging - consider waiting or additional preparation');
    }

    // Demographic factors
    factors.push(`Your life stage (${personalizedContext.demographic_shifts.lifecycle_stage}) influences success probability`);

    // Technology disruption
    const relevantDisruptions = personalizedContext.technology_disruption.filter(
      d => d.timeline === 'immediate' || d.timeline === '2-3years'
    );
    if (relevantDisruptions.length > 0) {
      factors.push(`Technology disruption coming: ${relevantDisruptions.map(d => d.technology).join(', ')}`);
    }

    return factors.slice(0, 6); // Top 6 most critical factors
  }

  // Get world state for a specific scenario simulation
  getWorldState(personalizedForUser: UserProfile, decision: Decision): WorldState {
    return this.personalizeContext(personalizedForUser, decision);
  }
}

// Export singleton instance
export const worldContext = new WorldContextEngine();