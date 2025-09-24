// @file src/data/life-metrics.ts
// Life metrics definitions and sample data

import { LifeStats } from '@/lib/types';

export interface MetricDefinition {
    key: keyof LifeStats;
    name: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
}

export const lifeMetrics: MetricDefinition[] = [
    {
        key: 'financial',
        name: 'Financial Stability',
        description: 'Income security, savings, and financial freedom',
        icon: '💰',
        color: 'text-green-600',
        gradient: 'from-green-500 to-emerald-500'
    },
    {
        key: 'happiness',
        name: 'Happiness',
        description: 'Life satisfaction, joy, and emotional well-being',
        icon: '😊',
        color: 'text-yellow-600',
        gradient: 'from-yellow-500 to-orange-500'
    },
    {
        key: 'career',
        name: 'Career Growth',
        description: 'Professional development and achievement',
        icon: '🚀',
        color: 'text-blue-600',
        gradient: 'from-blue-500 to-indigo-500'
    },
    {
        key: 'relationships',
        name: 'Relationships',
        description: 'Family, friends, and romantic connections',
        icon: '❤️',
        color: 'text-pink-600',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        key: 'health',
        name: 'Health',
        description: 'Physical fitness, mental health, and vitality',
        icon: '🏃',
        color: 'text-purple-600',
        gradient: 'from-purple-500 to-violet-500'
    }
];

export const sampleUserStats: LifeStats = {
    financial: 65,
    happiness: 72,
    career: 58,
    relationships: 80,
    health: 45
};

export function getMetricInfo(key: keyof LifeStats): MetricDefinition {
    return lifeMetrics.find((m: MetricDefinition) => m.key === key)!;
}

export function getStatDescription(value: number): string {
    if (value >= 80) return 'Excellent';
    if (value >= 70) return 'Good';
    if (value >= 50) return 'Fair';
    if (value >= 30) return 'Needs Attention';
    return 'Critical';
}

export function getStatLevel(value: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (value >= 80) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 50) return 'fair';
    if (value >= 30) return 'poor';
    return 'critical';
}