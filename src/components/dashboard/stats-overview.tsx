// @file src/components/dashboard/stats-overview.tsx
// Beautiful stats overview with progress bars and animations

'use client';

import { LifeStats } from '@/lib/types';
import { lifeMetrics, getStatDescription, getStatLevel } from '@/data/life-metrics';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/card';

interface StatsOverviewProps {
    stats: LifeStats;
    showTrends?: boolean;
    compact?: boolean;
}

export default function StatsOverview({
                                          stats,
                                          showTrends = false,
                                          compact = false
                                      }: StatsOverviewProps) {
    const overallScore = Math.round(
        (stats.financial + stats.happiness + stats.career + stats.relationships + stats.health) / 5
    );

    return (
        <div className="space-y-6">
            {/* Overall Score */}
            <Card className="text-center">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Overall Life Score
                        </h3>
                        <div className="mt-2 flex items-center justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gray-200">
                                    <div
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform transition-transform hover:scale-105"
                                        style={{
                                            background: `conic-gradient(from 0deg, #8b5cf6 0deg, #8b5cf6 ${(overallScore / 100) * 360}deg, #e5e7eb ${(overallScore / 100) * 360}deg, #e5e7eb 360deg)`
                                        }}
                                    >
                                        <span className="text-white font-bold text-lg">{overallScore}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {getStatDescription(overallScore)} - Keep growing! 🌱
                        </p>
                    </div>
                </div>
            </Card>

            {/* Individual Metrics */}
            <div className={cn(
                "grid gap-4",
                compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
                {lifeMetrics.map((metric) => {
                    const value = stats[metric.key];
                    const level = getStatLevel(value);

                    return (
                        <Card key={metric.key} hover className="group">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{metric.icon}</div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{metric.name}</h4>
                                            {!compact && (
                                                <p className="text-xs text-gray-500">{metric.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn("font-bold text-lg", metric.color)}>
                                            {value}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {getStatDescription(value)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out rounded-full",
                                                `bg-gradient-to-r ${metric.gradient}`
                                            )}
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>

                                    {/* Visual indicator */}
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>0</span>
                                        <span className={cn(
                                            "font-medium",
                                            level === 'excellent' && "text-green-600",
                                            level === 'good' && "text-blue-600",
                                            level === 'fair' && "text-yellow-600",
                                            level === 'poor' && "text-orange-600",
                                            level === 'critical' && "text-red-600"
                                        )}>
                      {value}
                    </span>
                                        <span>100</span>
                                    </div>
                                </div>

                                {/* Trend indicator (optional) */}
                                {showTrends && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">This month:</span>
                                        <span className="flex items-center space-x-1 text-green-600">
                      <span>↗</span>
                      <span>+3</span>
                    </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Quick insights */}
            <Card>
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Quick Insights</h4>
                    <div className="space-y-2 text-sm">
                        {/* Strongest area */}
                        {(() => {
                            const entries = [
                                { key: 'financial' as keyof LifeStats, value: stats.financial },
                                { key: 'happiness' as keyof LifeStats, value: stats.happiness },
                                { key: 'career' as keyof LifeStats, value: stats.career },
                                { key: 'relationships' as keyof LifeStats, value: stats.relationships },
                                { key: 'health' as keyof LifeStats, value: stats.health }
                            ];
                            const strongest = entries.reduce((max, entry) =>
                                entry.value > max.value ? entry : max
                            );

                            const strongestMetric = lifeMetrics.find(m => m.key === strongest.key);

                            return (
                                <div className="flex items-center space-x-2 text-green-600">
                                    <span>💪</span>
                                    <span>Your strongest area: {strongestMetric?.name} ({strongest.value})</span>
                                </div>
                            );
                        })()}

                        {/* Area for improvement */}
                        {(() => {
                            const entries = [
                                { key: 'financial' as keyof LifeStats, value: stats.financial },
                                { key: 'happiness' as keyof LifeStats, value: stats.happiness },
                                { key: 'career' as keyof LifeStats, value: stats.career },
                                { key: 'relationships' as keyof LifeStats, value: stats.relationships },
                                { key: 'health' as keyof LifeStats, value: stats.health }
                            ];
                            const weakest = entries.reduce((min, entry) =>
                                entry.value < min.value ? entry : min
                            );

                            const weakestMetric = lifeMetrics.find(m => m.key === weakest.key);

                            return (
                                <div className="flex items-center space-x-2 text-amber-600">
                                    <span>🎯</span>
                                    <span>Growth opportunity: {weakestMetric?.name} ({weakest.value})</span>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </Card>
        </div>
    );
}