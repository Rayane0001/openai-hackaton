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
  onAnswerChange: (answer: AssessmentAnswer) => void;
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
    onAnswerChange({
      questionId: currentQuestion.id,
      value: value  // Garder comme number
    });
  };

  const handleMultipleChoice = (value: string) => {
    onAnswerChange({
      questionId: currentQuestion.id,
      value: value
    });
  };

  const handleTextChange = (value: string) => {
    onAnswerChange({
      questionId: currentQuestion.id,
      value: value
    });
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
        <Card className="text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold">Assessment Complete!</h2>
            <p className="text-gray-600">Ready to generate your future scenarios</p>
            <Button onClick={onSubmit} size="lg">
              Generate My Future Scenarios
            </Button>
          </div>
        </Card>
    );
  }

  return (
      <Card>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="flex items-center space-x-1">
            <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                currentQuestion.tier === 1 && "bg-yellow-100 text-yellow-700",
                currentQuestion.tier === 2 && "bg-blue-100 text-blue-700",
                currentQuestion.tier === 3 && "bg-purple-100 text-purple-700"
            )}>
              Tier {currentQuestion.tier}
            </span>
          </span>
          </div>

          {/* Question */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>

            {/* Scale input */}
            {currentQuestion.type === 'scale' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(value => (
                        <button
                            key={value}
                            onClick={() => handleScaleChange(value)}
                            className={cn(
                                "w-12 h-12 rounded-full border-2 font-medium transition-colors",
                                (typeof currentAnswer?.value === 'number' && currentAnswer.value === value)
                                    ? "border-purple-500 bg-purple-500 text-white"
                                    : "border-gray-300 hover:border-purple-300"
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
                <div className="grid gap-3">
                  {currentQuestion.options?.map(option => (
                      <button
                          key={option}
                          onClick={() => handleMultipleChoice(option)}
                          className={cn(
                              "p-4 text-left border-2 rounded-lg transition-colors",
                              (typeof currentAnswer?.value === 'string' && currentAnswer.value === option)
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                          )}
                      >
                        {option}
                      </button>
                  ))}
                </div>
            )}

            {/* Text input */}
            {currentQuestion.type === 'text' && (
                <div className="space-y-2">
                  {currentQuestion.id === 'age' ? (
                      <input
                          type="number"
                          min="13"
                          max="120"
                          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                          onChange={(e) => handleTextChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="Enter your age"
                      />
                  ) : (
                      <textarea
                          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                          onChange={(e) => handleTextChange(e.target.value)}
                          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="Share your thoughts..."
                          maxLength={500}
                      />
                  )}
                </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
                variant="ghost"
                onClick={onPrevious}
                disabled={isFirstQuestion}
            >
              ← Previous
            </Button>

            <Button
                onClick={isLastQuestion ? onSubmit : onNext}
                disabled={!canProceed()}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next →'}
            </Button>
          </div>
        </div>
      </Card>
  );
}