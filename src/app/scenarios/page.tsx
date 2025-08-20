// @file src/app/scenarios/page.tsx
// Main scenarios page with list and comparison

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scenario, Decision } from '@/lib/types';
import Layout from '@/components/layout/layout';
import ScenarioCard from '@/components/scenarios/scenario-card';
import ScenarioComparison from '@/components/scenarios/scenario-comparison';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

// Mock data - replace with real API calls
const mockScenarios: Scenario[] = [
  {
    id: 'scenario_1',
    decisionId: 'decision_1',
    title: 'Best Case: Accept Remote Job Offer',
    description: 'Everything goes exceptionally well with the remote job transition. Maximum benefits realized.',
    personality: 'optimistic',
    timeline: {
      year5: { financial: 85, happiness: 82, career: 88, relationships: 75, health: 70 },
      year10: { financial: 92, happiness: 85, career: 95, relationships: 78, health: 68 },
      year15: { financial: 95, happiness: 88, career: 98, relationships: 80, health: 65 }
    },
    impact: {
      financial: { change: 20, reasoning: 'Salary increase and career advancement', confidence: 85 },
      happiness: { change: 10, reasoning: 'Better work-life balance', confidence: 80 },
      career: { change: 30, reasoning: 'Tech industry growth opportunities', confidence: 90 },
      relationships: { change: -5, reasoning: 'Less in-person social interaction', confidence: 70 },
      health: { change: -10, reasoning: 'Sedentary remote work lifestyle', confidence: 75 }
    },
    keyMilestones: [
      'Year 1: Successful remote work adaptation',
      'Year 3: Promotion to senior role',
      'Year 5: Team leadership position',
      'Year 10: Director level achievement'
    ],
    risks: ['Remote work isolation', 'Career plateau risk'],
    opportunities: ['Global job market access', 'Location independence'],
    probability: 25
  },
  {
    id: 'scenario_2',
    decisionId: 'decision_1',
    title: 'Likely Outcome: Accept Remote Job Offer',
    description: 'A balanced view of the remote job transition with expected outcomes and normal challenges.',
    personality: 'realistic',
    timeline: {
      year5: { financial: 75, happiness: 74, career: 78, relationships: 70, health: 65 },
      year10: { financial: 82, happiness: 76, career: 85, relationships: 72, health: 62 },
      year15: { financial: 85, happiness: 78, career: 88, relationships: 74, health: 60 }
    },
    impact: {
      financial: { change: 15, reasoning: 'Steady salary growth', confidence: 90 },
      happiness: { change: 5, reasoning: 'Mixed work-life balance results', confidence: 85 },
      career: { change: 20, reasoning: 'Normal progression path', confidence: 95 },
      relationships: { change: -8, reasoning: 'Reduced social opportunities', confidence: 80 },
      health: { change: -15, reasoning: 'Lifestyle adjustment challenges', confidence: 85 }
    },
    keyMilestones: [
      'Year 1: Adjustment period completion',
      'Year 3: Skill development milestone',
      'Year 5: Mid-level career achievement',
      'Year 10: Senior position attainment'
    ],
    risks: ['Technology disruption', 'Market competition'],
    opportunities: ['Skill diversification', 'Network expansion'],
    probability: 45
  }
];

export default function ScenariosPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load scenarios from localStorage or API
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      // Mock loading - replace with real API call
      setTimeout(() => {
        setScenarios(mockScenarios);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      setIsLoading(false);
    }
  };

  const handleViewScenarioDetails = (scenario: Scenario) => {
    router.push(`/scenarios/${scenario.id}`);
  };

  const handleChatWithFutureSelf = (scenario: Scenario) => {
    router.push(`/chat/${scenario.id}`);
  };

  if (isLoading) {
    return (
        <Layout>
          <div className="max-w-6xl mx-auto">
            <Card>
              <div className="text-center py-12 space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                <h3 className="text-lg font-semibold">Loading Your Scenarios...</h3>
                <p className="text-gray-600">Preparing your future insights</p>
              </div>
            </Card>
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Future Scenarios</h1>
            <p className="text-gray-600">
              Explore different paths your life could take based on your decisions
            </p>

            {/* View mode toggle */}
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'cards'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  📋 Card View
                </button>
                <button
                    onClick={() => setViewMode('comparison')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'comparison'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  📊 Compare
                </button>
              </div>
            </div>
          </div>

          {scenarios.length === 0 ? (
              <Card>
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">🔮</div>
                  <h3 className="text-lg font-semibold text-gray-900">No Scenarios Yet</h3>
                  <p className="text-gray-600">
                    Start by analyzing a decision to see your future scenarios
                  </p>
                  <Button onClick={() => router.push('/decision')} size="lg">
                    Analyze Your First Decision
                  </Button>
                </div>
              </Card>
          ) : (
              <div className="space-y-6">
                {viewMode === 'cards' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {scenarios.map(scenario => (
                          <ScenarioCard
                              key={scenario.id}
                              scenario={scenario}
                              onViewDetails={() => handleViewScenarioDetails(scenario)}
                              onChat={() => handleChatWithFutureSelf(scenario)}
                          />
                      ))}
                    </div>
                )}

                {viewMode === 'comparison' && (
                    <ScenarioComparison scenarios={scenarios} />
                )}
              </div>
          )}

          {/* Quick actions */}
          {scenarios.length > 0 && (
              <Card>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/decision')}
                    >
                      Analyze New Decision
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                          if (scenarios.length > 0) {
                            handleChatWithFutureSelf(scenarios[0]);
                          }
                        }}
                    >
                      Chat with Future Self
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </Card>
          )}
        </div>
      </Layout>
  );
}