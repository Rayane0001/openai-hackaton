// @file src/app/onboarding/page.tsx
// Complete onboarding flow with state management

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentQuestions, getTierQuestions } from '@/data/psychology-questions';
import { AssessmentAnswer } from '@/lib/types';
import ProgressTracker from '@/components/onboarding/progress-tracker';
import TierSelector from '@/components/onboarding/tier-selector';
import AssessmentForm from '@/components/onboarding/assessment-form';
import Layout from '@/components/layout/layout';

type OnboardingStep = 'tier' | 'assessment' | 'profile' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('tier');
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = getTierQuestions(selectedTier);
  const stepIndex = { tier: 0, assessment: 1, profile: 2, complete: 3 };
  const completedSteps = Object.keys(stepIndex).slice(0, stepIndex[currentStep]).map(step => stepIndex[step as OnboardingStep]);

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (currentStep === 'tier') return 0;
    if (currentStep === 'assessment') {
      return Math.round((answers.length / questions.length) * 100);
    }
    return 100;
  };

  const handleTierChange = (tier: 1 | 2 | 3) => {
    setSelectedTier(tier);
    // Reset answers if switching to lower tier
    if (tier < selectedTier) {
      const tierQuestions = getTierQuestions(tier);
      setAnswers(prev => prev.filter(answer =>
          tierQuestions.some(q => q.id === answer.questionId)
      ));
    }
  };

  const handleStartAssessment = () => {
    setCurrentStep('assessment');
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, value };
        return updated;
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteAssessment = () => {
    setCurrentStep('profile');
  };

  const handleFinishOnboarding = async () => {
    // Save user profile and answers to backend
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          answers: answers,
          completion: getCompletionPercentage()
        })
      });

      if (response.ok) {
        // Generate life tree immediately after assessment
        console.log('🌳 Assessment completed, generating life tree...');
        localStorage.setItem('onboarding_completed', 'true');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to save assessment:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
        
        <div className="relative max-w-5xl mx-auto py-12 px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
              Welcome to Your Future
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Let&apos;s understand your unique psychology so we can create the most 
              <span className="text-indigo-600 font-medium"> accurate future scenarios</span> for your life decisions
            </p>
          </div>

          <div className="mb-12">
            <ProgressTracker 
              currentStep={stepIndex[currentStep]} 
              completedSteps={completedSteps} 
            />
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
            {currentStep === 'tier' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">Choose Your Assessment Depth</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select how detailed you want your psychological analysis to be. More questions = more accurate future predictions.
                  </p>
                </div>
                <TierSelector
                  selectedTier={selectedTier}
                  onTierChange={handleTierChange}
                />
                <div className="text-center">
                  <button
                    onClick={handleStartAssessment}
                    className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105"
                  >
                    Start Assessment
                    <span className="ml-3 group-hover:translate-x-1 transition-transform">✨</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'assessment' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">Psychology Assessment</h2>
                  <p className="text-lg text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length} • {getCompletionPercentage()}% Complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                </div>
                <AssessmentForm
                  questions={questions}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleCompleteAssessment}
                  currentQuestionIndex={currentQuestionIndex}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </div>
            )}

            {currentStep === 'profile' && (
              <div className="text-center space-y-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <div className="text-6xl">🎯</div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Assessment Complete!
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Perfect! Your psychological profile is ready. Now let&apos;s create your personalized future scenarios 
                    and meet the four versions of your future self.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 py-8">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="text-lg font-semibold text-gray-900">Assessment Level</div>
                    <div className="text-2xl font-bold text-indigo-600">Tier {selectedTier}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <div className="text-lg font-semibold text-gray-900">Questions Answered</div>
                    <div className="text-2xl font-bold text-green-600">{answers.length} / {questions.length}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                    <div className="text-lg font-semibold text-gray-900">Prediction Accuracy</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedTier === 1 ? '60%' : selectedTier === 2 ? '80%' : '95%'}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleFinishOnboarding}
                    className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-6 rounded-3xl text-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105"
                  >
                    Create My Future Scenarios
                    <span className="ml-3 group-hover:translate-x-2 transition-transform">🚀</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                    <div className="text-3xl mb-3">🧠</div>
                    <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                    <p className="text-sm text-gray-600 mt-2">Your responses analyzed with advanced psychology models</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <div className="text-3xl mb-3">🔮</div>
                    <h3 className="font-semibold text-gray-900">Future Scenarios</h3>
                    <p className="text-sm text-gray-600 mt-2">Personalized life paths based on your unique profile</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="font-semibold text-gray-900">Future Conversations</h3>
                    <p className="text-sm text-gray-600 mt-2">Chat with four versions of your future self</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="text-center text-gray-500 mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
            💡 <span className="font-medium">Tip:</span> You can always upgrade your assessment level later for better accuracy
          </div>
        </div>
      </div>
    </Layout>
  );
}