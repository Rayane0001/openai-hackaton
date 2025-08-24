// @file src/app/scenarios/[id]/page.tsx
// Detailed view of a specific scenario

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Scenario, LifeStats } from '@/lib/types';
import { lifeMetrics } from '@/data/life-metrics';
import { formatPercentage, cn } from '@/lib/utils';
import Layout from '@/components/layout/layout';
import ImpactVisualization from '@/components/decision/impact-visualization';
import ReasoningDisplay from '@/components/decision/reasoning-display';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

// Mock scenario data
const mockScenario: Scenario = {
  id: 'scenario_1',
  decisionId: 'decision_1',
  title: 'Best Case: Accept Remote Job Offer',
  description: 'Everything goes exceptionally well with the remote job transition. Maximum benefits realized with minimal drawbacks.',
  personality: 'optimistic',
  timeline: {
    year5: { financial: 85, happiness: 82, career: 88, relationships: 75, health: 70 },
    year10: { financial: 92, happiness: 85, career: 95, relationships: 78, health: 68 },
    year15: { financial: 95, happiness: 88, career: 98, relationships: 80, health: 65 }
  },
  impact: {
    financial: { change: 20, reasoning: 'Remote work salary premium and reduced living costs', confidence: 85 },
    happiness: { change: 10, reasoning: 'Better work-life balance and location flexibility', confidence: 80 },
    career: { change: 30, reasoning: 'Access to global opportunities and skill development', confidence: 90 },
    relationships: { change: -5, reasoning: 'Less in-person networking but more family time', confidence: 70 },
    health: { change: -10, reasoning: 'Sedentary lifestyle challenges offset by flexibility', confidence: 75 }
  },
  keyMilestones: [
    'Year 1: Successful remote work adaptation and productivity optimization',
    'Year 2: First major promotion with expanded responsibilities',
    'Year 3: Leadership role in distributed team management',
    'Year 5: Senior architect position with equity participation',
    'Year 7: Technical advisory role and speaking engagements',
    'Year 10: CTO or founding team member of successful startup'
  ],
  risks: [
    'Remote work isolation and reduced career visibility',
    'Technology industry volatility and job market changes',
    'Health impacts from sedentary work environment',
    'Potential plateau in salary growth after initial gains'
  ],
  opportunities: [
    'Global job market access without relocation',
    'Location arbitrage for cost of living optimization',
    'Flexible schedule enabling side projects and learning',
    'Building distributed team leadership expertise',
    'Access to cutting-edge remote-first companies'
  ],
  probability: 25
};

const mockCurrentStats: LifeStats = {
  financial: 65,
  happiness: 72,
  career: 58,
  relationships: 80,
  health: 45
};

const mockReasoning = [
  {
    step: 1,
    type: 'analysis' as const,
    content: 'Analyzed remote work decision context and user profile',
    confidence: 95,
    reasoning: 'Decision involves clear career transition with well-defined parameters and user shows analytical decision-making style'
  },
  {
    step: 2,
    type: 'calculation' as const,
    content: 'Calculated impact across 5 life dimensions using industry data',
    confidence: 85,
    reasoning: 'Used remote work studies, salary data, and lifestyle impact research to model outcomes'
  },
  {
    step: 3,
    type: 'comparison' as const,
    content: 'Compared against alternative scenarios and decision outcomes',
    confidence: 80,
    reasoning: 'Cross-referenced with similar decisions and validated against known pattern outcomes'
  },
  {
    step: 4,
    type: 'conclusion' as const,
    content: 'Generated optimistic scenario with 25% probability assessment',
    confidence: 90,
    reasoning: 'Optimistic assumptions validated against best-case historical outcomes for similar transitions'
  }
];

export default function ScenarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'reasoning'>('overview');

  const scenarioId = params.id as string;

  useEffect(() => {
    loadScenario();
  }, [scenarioId]);

  const loadScenario = async () => {
    try {
      // Mock loading - replace with real API call
      setTimeout(() => {
        if (scenarioId === 'scenario_1') {
          setScenario(mockScenario);
        } else {
          setScenario(null);
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      setIsLoading(false);
    }
  };

  const personalityStyles = {
    optimistic: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '🌟' },
    realistic: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '⚖️' },
    cautious: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '🛡️' },
    adventurous: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '🚀' }
  };

  if (isLoading) {
    return (
        <Layout>
          <div className="max-w-6xl mx-auto">
            <Card>
              <div className="text-center py-12 space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                <h3 className="text-lg font-semibold">Loading Scenario...</h3>
              </div>
            </Card>
          </div>
        </Layout>
    );
  }

  if (!scenario) {
    return (
        <Layout>
          <div className="max-w-6xl mx-auto">
            <Card>
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">❌</div>
                <h3 className="text-lg font-semibold">Scenario Not Found</h3>
                <Button onClick={() => router.push('/scenarios')}>
                  Back to Scenarios
                </Button>
              </div>
            </Card>
          </div>
        </Layout>
    );
  }

  const style = personalityStyles[scenario.personality];

  return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button onClick={() => router.push('/scenarios')} className="hover:text-purple-600">
                Scenarios
              </button>
              <span>→</span>
              <span>{scenario.title}</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{scenario.title}</h1>
                <p className="text-gray-600 max-w-2xl">{scenario.description}</p>
              </div>

              <div className={cn("flex items-center space-x-3 px-4 py-2 rounded-lg border-2", style.bg, style.border)}>
                <span className="text-2xl">{style.icon}</span>
                <div>
                  <div className={cn("font-semibold", style.text)}>{scenario.personality}</div>
                  <div className="text-sm text-gray-600">{scenario.probability}% probability</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview' as const, label: '📋 Overview', description: 'Key insights' },
              { id: 'analysis' as const, label: '📊 Analysis', description: 'Impact charts' },
              { id: 'reasoning' as const, label: '🧠 Reasoning', description: 'AI thinking' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors text-center",
                        activeTab === tab.id
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                    title={tab.description}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Life metrics summary */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Life Impact Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lifeMetrics.map(metric => {
                          const impact = scenario.impact[metric.key];
                          return (
                              <div key={metric.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl">{metric.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm">{metric.name}</div>
                                    <div className="text-xs text-gray-500">{impact.reasoning}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={cn(
                                      "font-bold text-lg",
                                      impact.change > 0 ? "text-green-600" : impact.change < 0 ? "text-red-600" : "text-gray-600"
                                  )}>
                                    {formatPercentage(impact.change)}
                                  </div>
                                  <div className="text-xs text-gray-500">{impact.confidence}% confidence</div>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>

                  {/* Timeline progression */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Timeline Progression</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'year5' as const, label: '5 Years', description: 'Short-term outcomes' },
                          { key: 'year10' as const, label: '10 Years', description: 'Medium-term results' },
                          { key: 'year15' as const, label: '15 Years', description: 'Long-term impact' }
                        ].map(timeframe => (
                            <div key={timeframe.key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{timeframe.label}</h4>
                                <span className="text-sm text-gray-500">{timeframe.description}</span>
                              </div>
                              <div className="grid grid-cols-5 gap-2">
                                {lifeMetrics.map(metric => {
                                  const value = scenario.timeline[timeframe.key][metric.key];
                                  return (
                                      <div key={metric.key} className="text-center">
                                        <div className="text-xs text-gray-500">{metric.icon}</div>
                                        <div className={cn(
                                            "font-bold text-sm",
                                            value >= 80 ? "text-green-600" : value >= 60 ? "text-blue-600" : "text-red-600"
                                        )}>
                                          {Math.round(value)}
                                        </div>
                                      </div>
                                  );
                                })}
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Key milestones */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Key Milestones</h3>
                      <div className="space-y-3">
                        {scenario.keyMilestones.map((milestone, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">{milestone}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Risks & Opportunities */}
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <div className="space-y-3">
                        <h4 className="font-medium text-red-700 flex items-center space-x-1">
                          <span>⚠️</span>
                          <span>Risks</span>
                        </h4>
                        <div className="space-y-2">
                          {scenario.risks.map((risk, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{risk}</span>
                              </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-700 flex items-center space-x-1">
                          <span>💡</span>
                          <span>Opportunities</span>
                        </h4>
                        <div className="space-y-2">
                          {scenario.opportunities.map((opportunity, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>{opportunity}</span>
                              </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'analysis' && (
              <ImpactVisualization
                  currentStats={mockCurrentStats}
                  scenarios={[scenario]}
                  selectedScenario={scenario.id}
              />
          )}

          {activeTab === 'reasoning' && (
              <ReasoningDisplay
                  reasoning={mockReasoning}
                  title="AI Analysis Process"
                  showConfidence={true}
                  collapsible={false}
              />
          )}

          {/* Actions */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex space-x-3">
                <Button onClick={() => router.push(`/chat/${scenario.id}`)}>
                  💬 Chat with Future Self
                </Button>
                <Button variant="outline" onClick={() => router.push('/scenarios')}>
                  Compare Scenarios
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm">
                  📤 Export Analysis
                </Button>
                <Button variant="ghost" size="sm">
                  🔗 Share Scenario
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
  );
}