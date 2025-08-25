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

const decisionCategories = [
  { id: 'career', name: 'Career', icon: '💼', color: 'bg-blue-100 text-blue-700' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: 'bg-pink-100 text-pink-700' },
  { id: 'financial', name: 'Financial', icon: '💰', color: 'bg-green-100 text-green-700' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🏠', color: 'bg-purple-100 text-purple-700' },
  { id: 'health', name: 'Health', icon: '🏃', color: 'bg-orange-100 text-orange-700' }
];

const quickPrompts = [
  "Should I accept this job offer?",
  "Is it time to move to a new city?",
  "Should I end this relationship?",
  "Should I start my own business?",
  "Is it worth going back to school?"
];

export default function QuickDecision({ onAnalyze }: QuickDecisionProps) {
  const router = useRouter();
  const [decision, setDecision] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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

  const handleQuickPrompt = (prompt: string) => {
    setDecision(prompt);
  };

  return (
      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Decision Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Get instant insights on any decision you&apos;re facing
            </p>
          </div>

          {/* Quick prompts */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Or try these common decisions:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                  <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
              ))}
            </div>
          </div>

          {/* Decision input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              What decision are you facing?
            </label>
            <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g., Should I accept this job offer in another city?"
                className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          {/* Category selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Category (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {decisionCategories.map((category) => (
                  <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all",
                          selectedCategory === category.id
                              ? `${category.color} border-current`
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                      )}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <Button
              onClick={handleAnalyze}
              disabled={!decision.trim() || isLoading}
              loading={isLoading}
              className="w-full"
              size="lg"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Decision 🔮'}
          </Button>

          {/* Info */}
          <div className="text-center text-xs text-gray-500">
            ⚡ Get instant impact analysis and future scenarios
          </div>
        </div>
      </Card>
  );
}