// @file src/app/dashboard/page.tsx
// Main dashboard with stats overview and quick actions

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LifeStats, Decision, Scenario } from '@/lib/types';
import { sampleUserStats } from '@/data/life-metrics';
import Layout from '@/components/layout/layout';
import StatsOverview from '@/components/dashboard/stats-overview';
import QuickDecision from '@/components/dashboard/quick-decision';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

// Sample data - replace with real API calls
const sampleRecentDecisions: Decision[] = [
  {
    id: '1',
    title: 'Accept Remote Job Offer',
    description: 'Tech company offering 20% salary increase but fully remote',
    timeline: 'within 2 weeks',
    constraints: ['Current lease expires in 6 months'],
    alternatives: ['Negotiate hybrid schedule', 'Stay at current job'],
    urgency: 'high',
    category: 'career',
    createdAt: new Date('2025-01-15')
  },
  {
    id: '2',
    title: 'Move to New City',
    description: 'Considering relocating to Austin for better opportunities',
    timeline: 'within 6 months',
    constraints: ['Family lives here', 'Cost of moving'],
    alternatives: ['Stay put', 'Move to different city'],
    urgency: 'medium',
    category: 'lifestyle',
    createdAt: new Date('2025-01-10')
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<LifeStats>(sampleUserStats);
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>(sampleRecentDecisions);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data
  useEffect(() => {
    // TODO: Replace with real API call
    // fetchUserStats();
    // fetchRecentDecisions();
  }, []);

  const handleQuickAnalysis = (decision: string, category: string) => {
    console.log('Quick analysis:', { decision, category });
    // Navigate to decision page for full analysis
    router.push('/decision');
  };

  return (
      <Layout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">
              Here&apos;s your life overview and recent activity
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2">
              <StatsOverview
                  stats={stats}
                  showTrends={true}
              />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              <QuickDecision onAnalyze={handleQuickAnalysis} />

              {/* Quick Actions */}
              <Card>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/decision">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="mr-2">🤔</span>
                        New Decision Analysis
                      </Button>
                    </Link>
                    <Link href="/scenarios">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="mr-2">🔮</span>
                        View Scenarios
                      </Button>
                    </Link>
                    <Link href="/onboarding">
                      <Button variant="ghost" className="w-full justify-start">
                        <span className="mr-2">⚙️</span>
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Decisions</h2>

            {recentDecisions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {recentDecisions.map((decision) => (
                      <Card key={decision.id} hover>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{decision.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{decision.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                decision.urgency === 'high' ? 'bg-red-100 text-red-700' :
                                    decision.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                            }`}>
                        {decision.urgency}
                      </span>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Timeline: {decision.timeline}</span>
                            <span>{decision.category}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push('/scenarios')}
                            >
                              View Analysis
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => router.push('/decision')}
                            >
                              Analyze Again
                            </Button>
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>
            ) : (
                <Card>
                  <div className="text-center py-8 space-y-3">
                    <div className="text-4xl">🤔</div>
                    <h3 className="font-medium text-gray-900">No decisions yet</h3>
                    <p className="text-gray-600">Start by analyzing your first decision!</p>
                    <Link href="/decision">
                      <Button>Create First Decision</Button>
                    </Link>
                  </div>
                </Card>
            )}
          </div>

          {/* Tips */}
          <Card>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <span className="mr-2">💡</span>
                Today&apos;s Tip
              </h3>
              <p className="text-sm text-gray-600">
                Your <strong>Health</strong> score is lower than other areas. Consider asking &quot;Should I start a fitness routine?&quot; to see how it impacts your future scenarios.
              </p>
            </div>
          </Card>
        </div>
      </Layout>
  );
}