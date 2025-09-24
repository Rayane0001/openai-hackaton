// @file src/app/decision/page.tsx
// Main decision analysis page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Decision, Scenario } from '@/lib/types';
import Layout from '@/components/layout/layout';
import DecisionForm from '@/components/decision/decision-form';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function DecisionPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickDecisionData, setQuickDecisionData] = useState<any>(null);

  // Load quick decision data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quickDecision');
    if (stored) {
      const data = JSON.parse(stored);
      setQuickDecisionData(data);
      localStorage.removeItem('quickDecision'); // Clean up
    }
  }, []);

  const handleDecisionSubmit = async (decisionData: Partial<Decision>) => {
    setIsLoading(true);
    setStep('analyzing');

    try {
      // Create decision object
      const newDecision: Decision = {
        id: Date.now().toString(),
        title: decisionData.title!,
        description: decisionData.description!,
        category: decisionData.category!,
        urgency: decisionData.urgency!,
        timeline: decisionData.timeline!,
        constraints: decisionData.constraints || [],
        alternatives: decisionData.alternatives || [],
        createdAt: new Date()
      };

      setDecision(newDecision);

      // Generate scenarios
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: newDecision,
          reasoningLevel: 'medium'
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          const generatedScenarios = responseData.data.scenarios;
          setScenarios(generatedScenarios);
          
          // Store scenarios for later use in /scenarios page
          localStorage.setItem('userScenarios', JSON.stringify({
            decision: newDecision,
            scenarios: generatedScenarios,
            timestamp: Date.now()
          }));
          
          setStep('results');
        } else {
          throw new Error(responseData.error || 'Failed to generate scenarios');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate scenarios');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error state
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('form');
    setDecision(null);
    setScenarios([]);
  };

  return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Decision Analysis
            </h1>
            <p className="text-gray-600">
              Get AI-powered insights on your life decisions
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4">
            {['Input', 'Analysis', 'Results'].map((label, index) => {
              const isActive =
                  (step === 'form' && index === 0) ||
                  (step === 'analyzing' && index === 1) ||
                  (step === 'results' && index === 2);
              const isCompleted =
                  (step === 'analyzing' && index === 0) ||
                  (step === 'results' && index < 2);

              return (
                  <div key={label} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted ? 'bg-green-500 text-white' :
                            isActive ? 'bg-purple-500 text-white' :
                                'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${isActive ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
                    {index < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-4" />}
                  </div>
              );
            })}
          </div>

          {/* Content */}
          {step === 'form' && (
              <DecisionForm
                  key={quickDecisionData ? 'with-data' : 'empty'} 
                  onSubmit={handleDecisionSubmit}
                  isLoading={isLoading}
                  initialData={{
                    title: quickDecisionData?.title || '',
                    category: quickDecisionData?.category
                  }}
              />
          )}

          {step === 'analyzing' && (
              <Card>
                <div className="text-center py-12 space-y-4">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                  <h3 className="text-lg font-semibold">Analyzing Your Decision...</h3>
                  <p className="text-gray-600">Our AI is generating personalized scenarios based on your profile</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div>✓ Processing decision context</div>
                    <div>✓ Analyzing psychological profile</div>
                    <div className="animate-pulse">🔮 Generating future scenarios...</div>
                  </div>
                </div>
              </Card>
          )}

          {step === 'results' && decision && scenarios.length > 0 && (
              <div className="space-y-6">
                {/* Decision summary */}
                <Card>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Decision: {decision.title}</h3>
                    <p className="text-gray-600">{decision.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {decision.category}</span>
                      <span>•</span>
                      <span>Urgency: {decision.urgency}</span>
                      <span>•</span>
                      <span>Timeline: {decision.timeline}</span>
                    </div>
                  </div>
                </Card>

                {/* Scenarios preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  {scenarios.slice(0, 4).map((scenario) => (
                      <Card key={scenario.id} hover>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{scenario.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                scenario.personality === 'optimistic' ? 'bg-green-100 text-green-700' :
                                    scenario.personality === 'realistic' ? 'bg-blue-100 text-blue-700' :
                                        scenario.personality === 'cautious' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-purple-100 text-purple-700'
                            }`}>
                        {scenario.personality}
                      </span>
                          </div>
                          <p className="text-sm text-gray-600">{scenario.description}</p>
                          <div className="text-xs text-gray-500">
                            Probability: {scenario.probability}%
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-4 justify-center">
                  <Button onClick={() => router.push('/scenarios')} size="lg">
                    View Detailed Analysis
                  </Button>
                  <Button variant="outline" onClick={handleStartOver}>
                    Analyze Another Decision
                  </Button>
                </div>
              </div>
          )}
        </div>
      </Layout>
  );
}