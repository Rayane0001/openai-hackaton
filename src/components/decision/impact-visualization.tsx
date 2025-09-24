// @file src/components/decision/impact-visualization.tsx
// Interactive before/after impact visualization

'use client';

import { useState } from 'react';
import { LifeStats, Scenario } from '@/lib/types';
import { lifeMetrics } from '@/data/life-metrics';
import { formatPercentage, cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import Card from '@/components/ui/card';

interface ImpactVisualizationProps {
  currentStats: LifeStats;
  scenarios: Scenario[];
  selectedScenario?: string;
}

type ChartType = 'bars' | 'radar' | 'comparison';

export default function ImpactVisualization({
                                              currentStats,
                                              scenarios,
                                              selectedScenario
                                            }: ImpactVisualizationProps) {
  const [chartType, setChartType] = useState<ChartType>('bars');
  const [timeframe, setTimeframe] = useState<'year5' | 'year10' | 'year15'>('year10');

  const scenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  if (!scenario) {
    return (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <p>No scenario selected for impact visualization</p>
          </div>
        </Card>
    );
  }

  const futureStats = scenario.timeline[timeframe];

  // Prepare data for charts
  const barChartData = lifeMetrics.map(metric => ({
    name: metric.name,
    current: currentStats[metric.key],
    future: futureStats[metric.key],
    change: scenario.impact[metric.key].change,
    icon: metric.icon
  }));

  const radarData = lifeMetrics.map(metric => ({
    metric: metric.name,
    current: currentStats[metric.key],
    future: futureStats[metric.key]
  }));

  const comparisonData = scenarios.map(s => ({
    name: s.personality,
    ...s.timeline[timeframe]
  }));

  return (
      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Chart type selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { type: 'bars' as const, label: '📊 Bars', description: 'Before vs After' },
                { type: 'radar' as const, label: '🎯 Radar', description: 'Life Balance' },
                { type: 'comparison' as const, label: '⚖️ Compare', description: 'All Scenarios' }
              ].map(option => (
                  <button
                      key={option.type}
                      onClick={() => setChartType(option.type)}
                      className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          chartType === option.type
                              ? "bg-white text-purple-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                      )}
                      title={option.description}
                  >
                    {option.label}
                  </button>
              ))}
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'year5' as const, label: '5Y' },
                { key: 'year10' as const, label: '10Y' },
                { key: 'year15' as const, label: '15Y' }
              ].map(option => (
                  <button
                      key={option.key}
                      onClick={() => setTimeframe(option.key)}
                      className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          timeframe === option.key
                              ? "bg-white text-purple-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                      )}
                  >
                    {option.label}
                  </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Chart visualization */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Impact Analysis - {timeframe.replace('year', '')} Years
              </h3>
              <div className="text-sm text-gray-600">
                Scenario: <span className="font-medium">{scenario.personality}</span>
              </div>
            </div>

            {/* Bar Chart */}
            {chartType === 'bars' && (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis domain={[0, 100]} />
                        <Bar dataKey="current" fill="#94a3b8" name="Current" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="future" fill="#8b5cf6" name="Future" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend and changes */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {barChartData.map((item) => (
                        <div key={item.name} className="text-center space-y-1">
                          <div className="text-lg">{item.icon}</div>
                          <div className="text-xs font-medium text-gray-700">{item.name}</div>
                          <div className="flex items-center justify-center space-x-2 text-xs">
                            <span className="text-gray-500">{item.current}</span>
                            <span>→</span>
                            <span className="text-purple-600 font-medium">{item.future}</span>
                          </div>
                          <div className={cn(
                              "text-xs font-medium",
                              item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-500"
                          )}>
                            {formatPercentage(item.change)}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Radar Chart */}
            {chartType === 'radar' && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 10 }}
                          tickCount={6}
                      />
                      <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.1}
                          strokeWidth={2}
                      />
                      <Radar
                          name="Future"
                          dataKey="future"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.2}
                          strokeWidth={3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
            )}

            {/* Scenario Comparison */}
            {chartType === 'comparison' && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Bar dataKey="financial" fill="#10b981" name="Financial" />
                      <Bar dataKey="happiness" fill="#f59e0b" name="Happiness" />
                      <Bar dataKey="career" fill="#3b82f6" name="Career" />
                      <Bar dataKey="relationships" fill="#ec4899" name="Relationships" />
                      <Bar dataKey="health" fill="#8b5cf6" name="Health" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            )}
          </div>
        </Card>

        {/* Impact summary */}
        <Card>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Impact Summary</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Positive impacts */}
              <div>
                <h5 className="text-sm font-medium text-green-700 mb-3">Positive Changes</h5>
                <div className="space-y-2">
                  {Object.entries(scenario.impact)
                      .filter(([_, impact]) => impact.change > 0)
                      .map(([key, impact]) => {
                        const metric = lifeMetrics.find(m => m.key === key);
                        return (
                            <div key={key} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <span>{metric?.icon}</span>
                          <span>{metric?.name}</span>
                        </span>
                              <div className="text-right">
                                <div className="font-medium text-green-600">
                                  {formatPercentage(impact.change)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {impact.confidence}% confidence
                                </div>
                              </div>
                            </div>
                        );
                      })}
                </div>
              </div>

              {/* Negative impacts */}
              <div>
                <h5 className="text-sm font-medium text-red-700 mb-3">Trade-offs</h5>
                <div className="space-y-2">
                  {Object.entries(scenario.impact)
                      .filter(([_, impact]) => impact.change < 0)
                      .map(([key, impact]) => {
                        const metric = lifeMetrics.find(m => m.key === key);
                        return (
                            <div key={key} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <span>{metric?.icon}</span>
                          <span>{metric?.name}</span>
                        </span>
                              <div className="text-right">
                                <div className="font-medium text-red-600">
                                  {formatPercentage(impact.change)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {impact.confidence}% confidence
                                </div>
                              </div>
                            </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
  );
}