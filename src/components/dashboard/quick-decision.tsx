// @file src/components/dashboard/quick-decision.tsx
// Quick decision input for immediate analysis

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickDecisionProps {
  onAnalyze?: (decision: string, category: string) => void;
}

const DECISION_CATEGORIES = {
  career: {
    icon: '🚀',
    label: 'Career',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    suggestions: [
      'Should I accept this job offer?',
      'Should I ask for a promotion?',
      'Should I change careers?',
      'Should I start my own business?'
    ]
  },
  relationships: {
    icon: '💖',
    label: 'Relationships',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    suggestions: [
      'Should I move in with my partner?',
      'Should I end this relationship?',
      'Should I get married?',
      'Should I have children?'
    ]
  },
  lifestyle: {
    icon: '🏡',
    label: 'Lifestyle',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    suggestions: [
      'Should I move to a new city?',
      'Should I buy a house?',
      'Should I travel for a year?',
      'Should I go back to school?'
    ]
  },
  financial: {
    icon: '💰',
    label: 'Financial',
    color: 'bg-green-100 text-green-700 border-green-200',
    suggestions: [
      'Should I invest in stocks?',
      'Should I take out a loan?',
      'Should I buy or rent?',
      'Should I start saving more aggressively?'
    ]
  }
};

export default function QuickDecision({ onAnalyze }: QuickDecisionProps) {
  const router = useRouter();
  const [decision, setDecision] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof DECISION_CATEGORIES | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!decision.trim()) return;

    setIsLoading(true);

    // Store in localStorage to pass to decision page
    localStorage.setItem('quickDecision', JSON.stringify({
      title: decision,
      category: selectedCategory
    }));

    router.push('/decision');
    setIsLoading(false);
  };

  const handleCategorySelect = (categoryKey: keyof typeof DECISION_CATEGORIES) => {
    setSelectedCategory(categoryKey);
    setDecision(''); // Clear current decision when switching categories
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDecision(suggestion);
  };

  const getCurrentSuggestions = () => {
    if (selectedCategory && DECISION_CATEGORIES[selectedCategory]) {
      return DECISION_CATEGORIES[selectedCategory].suggestions;
    }
    // Show mix from all categories if none selected
    return Object.values(DECISION_CATEGORIES).flatMap(cat => cat.suggestions.slice(0, 2));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            🔮 What decision is on your mind?
          </h3>
          <p className="text-gray-600">
            Get insights from 4 versions of your future self
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Choose a category:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DECISION_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategorySelect(key as keyof typeof DECISION_CATEGORIES)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                  selectedCategory === key
                    ? `${category.color}`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-sm">{category.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Decision Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Describe your decision:
          </label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="What decision are you facing? Be as specific as you'd like..."
            className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Dynamic Suggestions */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            {selectedCategory ? 'Or choose a common scenario:' : 'Popular decisions:'}
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {getCurrentSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 text-sm bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!decision.trim() || isLoading}
          loading={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          size="lg"
        >
          {isLoading ? 'Creating scenarios...' : '✨ Talk to Your Future Selves'}
        </Button>

        {/* Info */}
        <div className="text-center text-xs text-gray-500">
          💡 Get personalized insights from optimistic, realistic, cautious & adventurous versions of your future self
        </div>
      </div>
    </div>
  );
}