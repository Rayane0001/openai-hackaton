// @file src/components/onboarding/assessment-form.tsx
// Progressive assessment form with different question types

'use client';

import { useState } from 'react';
import { AssessmentQuestion, AssessmentAnswer } from '@/lib/types';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';

interface AssessmentFormProps {
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
  onAnswerChange: (questionId: string, value: string | number) => void;
  onSubmit: () => void;
  currentQuestionIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function AssessmentForm({
                                         questions,
                                         answers,
                                         onAnswerChange,
                                         onSubmit,
                                         currentQuestionIndex,
                                         onNext,
                                         onPrevious
                                       }: AssessmentFormProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleScaleChange = (value: number) => {
    onAnswerChange(currentQuestion.id, value);
  };

  const handleMultipleChoice = (value: string) => {
    onAnswerChange(currentQuestion.id, value);
  };

  const handleTextChange = (value: string) => {
    onAnswerChange(currentQuestion.id, value);
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    if (!currentAnswer || currentAnswer.value === undefined || currentAnswer.value === null) return false;

    // Validation spécifique pour l'âge
    if (currentQuestion.id === 'age') {
      const age = parseInt(currentAnswer.value as string);
      return !isNaN(age) && age >= 13 && age <= 120;
    }

    // Validation pour string
    if (typeof currentAnswer.value === 'string') {
      return currentAnswer.value.trim().length > 0;
    }

    // Validation pour number (scale questions)
    if (typeof currentAnswer.value === 'number') {
      return currentAnswer.value > 0;
    }

    return false;
  };

  if (!currentQuestion) {
    return (
        <div className="text-center space-y-8 p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <div className="text-6xl">🎉</div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Assessment Complete!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perfect! All questions answered. Ready to generate your personalized future scenarios.
            </p>
          </div>
          <button 
            onClick={onSubmit}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-6 rounded-3xl text-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105"
          >
            ✨ Generate My Future Scenarios
          </button>
        </div>
    );
  }

  return (
      <div className="space-y-8">
        {/* Question Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                currentQuestion.tier === 1 && "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
                currentQuestion.tier === 2 && "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
                currentQuestion.tier === 3 && "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
            )}>
              Tier {currentQuestion.tier}
            </span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div>

            {/* Scale input */}
            {currentQuestion.type === 'scale' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    {[1, 2, 3, 4, 5].map(value => (
                        <button
                            key={value}
                            onClick={() => handleScaleChange(value)}
                            className={cn(
                                "w-16 h-16 rounded-full border-2 font-bold text-lg transition-all duration-200 hover:scale-105",
                                (typeof currentAnswer?.value === 'number' && currentAnswer.value === value)
                                    ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                                    : "border-gray-300 hover:border-indigo-300 bg-white hover:bg-indigo-50"
                            )}
                        >
                          {value}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* Multiple choice */}
            {currentQuestion.type === 'multiple' && (
                <div className="grid gap-4">
                  {currentQuestion.options?.map(option => (
                      <button
                          key={option}
                          onClick={() => handleMultipleChoice(option)}
                          className={cn(
                              "p-6 text-left border-2 rounded-2xl transition-all duration-200 hover:scale-[1.02]",
                              (typeof currentAnswer?.value === 'string' && currentAnswer.value === option)
                                  ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg"
                                  : "border-gray-200 hover:border-indigo-200 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                          )}
                      >
                        <span className="font-medium text-gray-900">{option}</span>
                      </button>
                  ))}
                </div>
            )}

            {/* Text input */}
            {currentQuestion.type === 'text' && (
                <div className="space-y-4">
                  {currentQuestion.id === 'age' ? (
                      <div className="text-center">
                        <input
                            type="number"
                            min="13"
                            max="120"
                            value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                            onChange={(e) => handleTextChange(e.target.value)}
                            className="w-32 text-center text-2xl font-bold p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                            placeholder="25"
                        />
                        <p className="text-sm text-gray-500 mt-2">years old</p>
                      </div>
                  ) : (
                      <textarea
                          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                          onChange={(e) => handleTextChange(e.target.value)}
                          className="w-full h-32 p-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none"
                          placeholder="Share your thoughts in detail..."
                          maxLength={500}
                      />
                  )}
                </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <button
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <button
                onClick={isLastQuestion ? onSubmit : onNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {isLastQuestion ? '✨ Complete Assessment' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
  );
}