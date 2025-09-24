// @file src/components/scenarios/scenario-comparison.tsx
// Side-by-side comparison of scenarios

'use client';

import { useState } from 'react';
import { Scenario, LifeStats } from '@/lib/types';
import { lifeMetrics } from '@/data/life-metrics';
import { formatPercentage, cn } from '@/lib/utils';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  maxScenarios?: number;
}

const timeframes = [
  { key: 'year5' as const, label: '5 Years' },
  { key: 'year10' as const, label: '10 Years' },
  { key: 'year15' as const, label: '15 Years' }
];

export default function ScenarioComparison({
                                             scenarios,
                                             maxScenarios = 4
                                           }: ScenarioComparisonProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'year5' | 'year10' | 'year15'>('year10');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(
      scenarios.slice(0, maxScenarios).map(s => s.id)
  );

  const compareScenarios = scenarios.filter(s => selectedScenarios.includes(s.id));

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < maxScenarios) {
        return [...prev, scenarioId];
      }
      return prev;
    });
  };

  const getMetricComparison = (metricKey: keyof LifeStats) => {
    const values = compareScenarios.map(scenario => ({
      scenario,
      value: scenario.timeline[selectedTimeframe][metricKey],
      change: scenario.impact[metricKey].change
    }));

    const maxValue = Math.max(...values.map(v => v.value));
    const minValue = Math.min(...values.map(v => v.value));

    return values.map(item => ({
      ...item,
      isHighest: item.value === maxValue && maxValue !== minValue,
      isLowest: item.value === minValue && maxValue !== minValue
    }));
  };

  return (
      <div className="space-y-6">
        {/* Scenario selector */}
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              Select Scenarios to Compare (max {maxScenarios})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {scenarios.map(scenario => (
                  <button
                      key={scenario.id}
                      onClick={() => toggleScenario(scenario.id)}
                      disabled={!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= maxScenarios}
                      className={cn(
                          "p-3 rounded-lg border-2 text-left transition-all",
                          selectedScenarios.includes(scenario.id)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300",
                          !selectedScenarios.includes(scenario.id) && selectedScenarios.length >= maxScenarios
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                      )}
                  >
                    <div className="text-sm font-medium">{scenario.personality}</div>
                    <div className="text-xs text-gray-500 mt-1">{scenario.probability}% probability</div>
                  </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Timeframe selector */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeframes.map(timeframe => (
                <button
                    key={timeframe.key}
                    onClick={() => setSelectedTimeframe(timeframe.key)}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        selectedTimeframe === timeframe.key
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                  {timeframe.label}
                </button>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        {compareScenarios.length > 0 && (
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Life Metrics Comparison - {timeframes.find(t => t.key === selectedTimeframe)?.label}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Metric</th>
                      {compareScenarios.map(scenario => (
                          <th key={scenario.id} className="text-center py-3 px-2 font-medium text-gray-700">
                            <div className="space-y-1">
                              <div className="text-sm">{scenario.personality}</div>
                              <div className="text-xs text-gray-500">{scenario.probability}%</div>
                            </div>
                          </th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {lifeMetrics.map(metric => {
                      const comparison = getMetricComparison(metric.key);

                      return (
                          <tr key={metric.key} className="border-b border-gray-100">
                            <td className="py-4 px-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{metric.icon}</span>
                                <div>
                                  <div className="font-medium text-sm">{metric.name}</div>
                                  <div className="text-xs text-gray-500">{metric.description}</div>
                                </div>
                              </div>
                            </td>
                            {comparison.map(({ scenario, value, change, isHighest, isLowest }) => (
                                <td key={scenario.id} className="py-4 px-2 text-center">
                                  <div className="space-y-1">
                                    <div className={cn(
                                        "font-bold text-lg",
                                        isHighest && "text-green-600",
                                        isLowest && "text-red-600",
                                        !isHighest && !isLowest && "text-gray-700"
                                    )}>
                                      {Math.round(value)}
                                      {isHighest && " 👑"}
                                      {isLowest && " 📉"}
                                    </div>
                                    <div className={cn(
                                        "text-xs font-medium",
                                        change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-500"
                                    )}>
                                      {formatPercentage(change)}
                                    </div>
                                  </div>
                                </td>
                            ))}
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
        )}

        {/* Summary insights */}
        {compareScenarios.length > 1 && (
            <Card>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Comparison Insights</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">Strongest Performers</h5>
                    <div className="space-y-1">
                      {lifeMetrics.map(metric => {
                        const comparison = getMetricComparison(metric.key);
                        const highest = comparison.find(c => c.isHighest);
                        if (highest) {
                          return (
                              <div key={metric.key} className="text-xs text-gray-600">
                                <strong>{highest.scenario.personality}</strong> leads in {metric.name} ({Math.round(highest.value)})
                              </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-amber-700 mb-2">Trade-offs</h5>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>• Higher career growth often means lower relationships</div>
                      <div>• Financial gains may come with health trade-offs</div>
                      <div>• Adventurous paths have higher reward variance</div>
                      <div>• Cautious approaches offer more stability</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
        )}

        {compareScenarios.length === 0 && (
            <Card>
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">📊</div>
                <p>Select scenarios above to compare their outcomes</p>
              </div>
            </Card>
        )}
      </div>
  );
}