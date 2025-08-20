// @file src/lib/utils.ts
// Utility functions including cn for className merging and app helpers

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPercentage(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
}

export function getStatColor(value: number): string {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
}

export function getImpactColor(change: number): string {
    if (change > 10) return 'text-green-600';
    if (change > 0) return 'text-green-500';
    if (change === 0) return 'text-gray-500';
    if (change > -10) return 'text-red-500';
    return 'text-red-600';
}