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

  const handleAnswerChange = (answer: AssessmentAnswer) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === answer.questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = answer;
        return updated;
      }
      return [...prev, answer];
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
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to save assessment:', error);
    }
  };

  return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Future Self
            </h1>
            <p className="text-gray-600">
              Let&apos;s understand you better to create accurate future scenarios
            </p>
          </div>

          {/* Progress Tracker */}
          <ProgressTracker
              currentStep={stepIndex[currentStep]}
              completedSteps={completedSteps}
          />

          {/* Main Content */}
          <div className="min-h-[500px]">
            {currentStep === 'tier' && (
                <div className="space-y-6">
                  <TierSelector
                      selectedTier={selectedTier}
                      onTierChange={handleTierChange}
                  />
                  <div className="text-center">
                    <button
                        onClick={handleStartAssessment}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Start Assessment
                    </button>
                  </div>
                </div>
            )}

            {currentStep === 'assessment' && (
                <AssessmentForm
                    questions={questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleCompleteAssessment}
                    currentQuestionIndex={currentQuestionIndex}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            )}

            {currentStep === 'profile' && (
                <div className="bg-white rounded-xl border p-8 text-center space-y-6">
                  <div className="text-6xl">🎯</div>
                  <h2 className="text-2xl font-bold">Profile Complete!</h2>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium">Assessment Level</div>
                      <div className="text-purple-600">Tier {selectedTier}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium">Questions Answered</div>
                      <div className="text-green-600">{answers.length} / {questions.length}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium">Prediction Accuracy</div>
                      <div className="text-blue-600">
                        {selectedTier === 1 ? '60%' : selectedTier === 2 ? '80%' : '95%'}
                      </div>
                    </div>
                  </div>
                  <button
                      onClick={handleFinishOnboarding}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Create My Future Scenarios
                  </button>
                </div>
            )}
          </div>

          {/* Tips */}
          <div className="text-center text-sm text-gray-500">
            💡 You can always upgrade your assessment level later for better accuracy
          </div>
        </div>
      </Layout>
  );
}