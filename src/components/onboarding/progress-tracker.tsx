// @file src/components/onboarding/progress-tracker.tsx
// Visual progress tracker for onboarding steps

import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ProgressTrackerProps {
  steps?: Step[];
  currentStep: number;
  completedSteps: number[];
}

const defaultSteps: Step[] = [
  {
    id: 'tier',
    title: 'Choose Level',
    description: 'Select assessment depth',
    icon: '⚡'
  },
  {
    id: 'assessment',
    title: 'Assessment',
    description: 'Answer questions',
    icon: '📝'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Review & confirm',
    icon: '👤'
  },
  {
    id: 'complete',
    title: 'Ready!',
    description: 'Generate scenarios',
    icon: '🚀'
  }
];

export default function ProgressTracker({
                                          steps = defaultSteps,
                                          currentStep,
                                          completedSteps = []
                                        }: ProgressTrackerProps) {
  return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isUpcoming = index > currentStep;

            return (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step circle */}
                  <div className="relative flex items-center justify-center">
                    <div
                        className={cn(
                            "w-12 h-12 rounded-full border-2 flex items-center justify-center font-medium transition-all duration-300",
                            isCompleted && "border-green-500 bg-green-500 text-white",
                            isCurrent && "border-purple-500 bg-purple-500 text-white shadow-lg",
                            isUpcoming && "border-gray-300 bg-white text-gray-400"
                        )}
                    >
                      {isCompleted ? '✓' : step.icon}
                    </div>

                    {/* Pulse animation for current step */}
                    {isCurrent && (
                        <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="ml-4 flex-1">
                    <div
                        className={cn(
                            "font-medium transition-colors",
                            isCompleted && "text-green-700",
                            isCurrent && "text-purple-700",
                            isUpcoming && "text-gray-400"
                        )}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                      <div
                          className={cn(
                              "h-0.5 w-full mx-4 transition-colors duration-300",
                              index < currentStep ? "bg-green-400" : "bg-gray-200"
                          )}
                      />
                  )}
                </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
  );
}