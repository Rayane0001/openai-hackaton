// @file src/lib/types.ts
// Core TypeScript types for Future Self Decision Advisor

export interface User {
    id: string;
    name: string;
    email: string;
    assessmentLevel: 1 | 2 | 3;
    assessmentCompletion: number; // 0-100%
    profile: UserProfile;
    createdAt: Date;
}

export interface UserProfile {
    age: number;
    occupation: string;
    bigFive: BigFiveScores;
    values: string[];
    fears: string[];
    goals: string[];
    decisionStyle: 'analytical' | 'intuitive' | 'balanced' | 'spontaneous';
}

export interface BigFiveScores {
    openness: number;     // 0-100
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
}

// Life metrics that we track
export interface LifeStats {
    financial: number;    // 0-100
    happiness: number;
    career: number;
    relationships: number;
    health: number;
}

export interface Decision {
    id: string;
    title: string;
    description: string;
    timeline: string;     // "within 6 months", "next year", etc.
    constraints: string[];
    alternatives: string[];
    urgency: 'low' | 'medium' | 'high';
    category: 'career' | 'relationships' | 'financial' | 'lifestyle' | 'health';
    createdAt: Date;
}

export interface Scenario {
    id: string;
    decisionId: string;
    title: string;
    description: string;
    personality: 'optimistic' | 'realistic' | 'cautious' | 'adventurous';

    // Life progression over time
    timeline: {
        year5: LifeStats;
        year10: LifeStats;
        year15: LifeStats;
    };

    // Impact analysis
    impact: {
        [K in keyof LifeStats]: {
            change: number;     // -100 to +100
            reasoning: string;
            confidence: number; // 0-100
        };
    };

    keyMilestones: string[];
    risks: string[];
    opportunities: string[];
    probability: number;   // 0-100
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    scenarioId: string;
    futureAge: number;     // Age of the future self
}

export interface ReasoningStep {
    step: number;
    type: 'analysis' | 'calculation' | 'comparison' | 'conclusion';
    content: string;
    confidence: number;
    reasoning: string;
}

export interface AssessmentQuestion {
    id: string;
    tier: 1 | 2 | 3;
    category: 'personality' | 'values' | 'goals' | 'fears' | 'background';
    question: string;
    type: 'scale' | 'multiple' | 'text' | 'ranking';
    options?: string[];
    required: boolean;
}

export interface AssessmentAnswer {
    questionId: string;
    value: string | number;  // Pas de string[] ici, on le gère différemment
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    reasoning?: ReasoningStep[];
}

export interface ScenarioGenerationRequest {
    userId: string;
    decision: Decision;
    reasoningLevel: 'low' | 'medium' | 'high';
}

export interface ChatRequest {
    scenarioId: string;
    message: string;
    userId: string;
}

// UI State types
export interface OnboardingState {
    currentTier: 1 | 2 | 3;
    answers: AssessmentAnswer[];
    completion: number;
    isComplete: boolean;
}

export interface DashboardState {
    currentStats: LifeStats;
    recentDecisions: Decision[];
    activeScenarios: Scenario[];
    isLoading: boolean;
}

export type AIPersonality = 'optimistic' | 'realistic' | 'cautious' | 'adventurous';
export type ReasoningLevel = 'low' | 'medium' | 'high';
export type LifeMetric = keyof LifeStats;