// @file src/components/onboarding/tier-selector.tsx
// Beautiful tier selector for assessment levels

import { cn } from '@/lib/utils';
import Card from '@/components/ui/card';

interface TierOption {
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  time: string;
  precision: string;
  icon: string;
  color: string;
}

interface TierSelectorProps {
  selectedTier: 1 | 2 | 3;
  onTierChange: (tier: 1 | 2 | 3) => void;
}

const tierOptions: TierOption[] = [
  {
    tier: 1,
    title: 'Quick Start',
    description: 'Essential questions to get started quickly',
    time: '2 minutes',
    precision: '60% precision',
    icon: '⚡',
    color: 'border-yellow-300 bg-yellow-50'
  },
  {
    tier: 2,
    title: 'Enhanced',
    description: 'Deeper insights for better predictions',
    time: '5 minutes',
    precision: '80% precision',
    icon: '🎯',
    color: 'border-blue-300 bg-blue-50'
  },
  {
    tier: 3,
    title: 'Complete',
    description: 'Comprehensive analysis for maximum accuracy',
    time: '10 minutes',
    precision: '95% precision',
    icon: '🔮',
    color: 'border-purple-300 bg-purple-50'
  }
];

export default function TierSelector({ selectedTier, onTierChange }: TierSelectorProps) {
  return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Assessment Level
          </h2>
          <p className="text-gray-600">
            More questions = more accurate future scenarios. You can upgrade anytime.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tierOptions.map((option) => (
              <Card
                  key={option.tier}
                  className={cn(
                      "cursor-pointer transition-all duration-200 border-2",
                      selectedTier === option.tier
                          ? `${option.color} ring-2 ring-purple-500 ring-offset-2`
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  )}
                  onClick={() => onTierChange(option.tier)}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">{option.icon}</div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm text-gray-500">⏱️</span>
                      <span className="text-sm font-medium">{option.time}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm text-gray-500">🎯</span>
                      <span className="text-sm font-medium text-green-600">
                    {option.precision}
                  </span>
                    </div>
                  </div>

                  {selectedTier === option.tier && (
                      <div className="mt-3 p-2 bg-purple-100 rounded-lg">
                  <span className="text-sm font-medium text-purple-700">
                    ✓ Selected
                  </span>
                      </div>
                  )}
                </div>
              </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 Tip: Start with Quick Start and upgrade based on your first results
          </p>
        </div>
      </div>
  );
}