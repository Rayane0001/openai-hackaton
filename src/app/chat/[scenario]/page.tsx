// @file src/app/chat/[scenario]/page.tsx
// Chat page for talking with future self from specific scenario

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Scenario } from '@/lib/types';
import Layout from '@/components/layout/layout';
import ChatInterface from '@/components/chat/chat-interface';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

// Mock scenarios - replace with real API call
const mockScenarios: Record<string, Scenario> = {
  'scenario_1': {
    id: 'scenario_1',
    decisionId: 'decision_1',
    title: 'Best Case: Accept Remote Job Offer',
    description: 'Everything goes exceptionally well with the remote job transition.',
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
    keyMilestones: ['Year 1: Remote work adaptation', 'Year 3: Senior role promotion'],
    risks: ['Remote work isolation', 'Career plateau risk'],
    opportunities: ['Global job market access', 'Location independence'],
    probability: 25
  },
  'scenario_2': {
    id: 'scenario_2',
    decisionId: 'decision_1',
    title: 'Realistic: Accept Remote Job Offer',
    description: 'A balanced view of the remote job transition with normal challenges.',
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
    keyMilestones: ['Year 1: Adjustment period', 'Year 3: Skill development'],
    risks: ['Technology disruption', 'Market competition'],
    opportunities: ['Skill diversification', 'Network expansion'],
    probability: 45
  }
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scenarioId = params.scenario as string;

  useEffect(() => {
    loadScenario();
  }, [scenarioId]);

  const loadScenario = async () => {
    try {
      // Mock loading - replace with real API call
      setTimeout(() => {
        const foundScenario = mockScenarios[scenarioId];
        if (foundScenario) {
          setScenario(foundScenario);
        } else {
          setError('Scenario not found');
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      setError('Failed to load scenario');
      setIsLoading(false);
    }
  };

  const handleMessageSent = (message: string) => {
    console.log('Message sent:', message);
    // Analytics or other side effects
  };

  if (isLoading) {
    return (
        <Layout>
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="text-center py-12 space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                <h3 className="text-lg font-semibold">Loading Chat...</h3>
                <p className="text-gray-600">Connecting you with your future self</p>
              </div>
            </Card>
          </div>
        </Layout>
    );
  }

  if (error || !scenario) {
    return (
        <Layout>
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">❌</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {error || 'Scenario Not Found'}
                </h3>
                <p className="text-gray-600">
                  The scenario you're looking for doesn't exist or has been removed.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button onClick={() => router.push('/scenarios')} variant="outline">
                    Back to Scenarios
                  </Button>
                  <Button onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Chat with Your Future Self
            </h1>
            <p className="text-gray-600">
              Scenario: <span className="font-medium">{scenario.title}</span>
            </p>
          </div>

          {/* Scenario context */}
          <Card>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Scenario Context</h3>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    scenario.personality === 'optimistic' ? 'bg-green-100 text-green-700' :
                        scenario.personality === 'realistic' ? 'bg-blue-100 text-blue-700' :
                            scenario.personality === 'cautious' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-purple-100 text-purple-700'
                }`}>
                {scenario.personality} • {scenario.probability}% probability
              </span>
              </div>
              <p className="text-gray-600">{scenario.description}</p>

              {/* Quick stats preview */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-gray-200">
                {Object.entries(scenario.impact).map(([key, impact]) => (
                    <div key={key} className="text-center">
                      <div className={`font-semibold ${
                          impact.change > 0 ? 'text-green-600' :
                              impact.change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {impact.change > 0 ? '+' : ''}{impact.change}%
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Chat interface */}
          <Card className="p-0 overflow-hidden">
            <div className="h-[600px]">
              <ChatInterface
                  scenario={scenario}
                  userId="current_user"
                  onMessageSent={handleMessageSent}
              />
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center space-x-3">
            <Button
                variant="outline"
                onClick={() => router.push('/scenarios')}
            >
              ← Back to Scenarios
            </Button>
            <Button
                variant="outline"
                onClick={() => router.push(`/scenarios/${scenario.id}`)}
            >
              View Scenario Details
            </Button>
          </div>
        </div>
      </Layout>
  );
}