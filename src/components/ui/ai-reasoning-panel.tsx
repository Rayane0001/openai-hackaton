// @file src/components/ui/ai-reasoning-panel.tsx
// Collapsible AI reasoning section with minimal, digestible format

import { useState } from 'react';
import { ReasoningStep } from '@/lib/types';

interface AIReasoningPanelProps {
  reasoning?: ReasoningStep[] | string;
  confidence?: 'high' | 'medium' | 'refining';
  title?: string;
}

const CONFIDENCE_CONFIG = {
  high: {
    label: 'High Confidence',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: '🎯'
  },
  medium: {
    label: 'Medium Confidence',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: '🤔'
  },
  refining: {
    label: 'Still Refining',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: '🔄'
  }
};

// Convert complex reasoning into simple steps
const simplifyReasoning = (reasoning: ReasoningStep[] | string): string[] => {
  if (typeof reasoning === 'string') {
    // If it's already a string, split into logical chunks
    return reasoning
      .split(/[.!?]+/)
      .filter(step => step.trim().length > 10)
      .slice(0, 4)
      .map(step => step.trim());
  }
  
  // If it's ReasoningStep[], extract key points
  if (Array.isArray(reasoning)) {
    return reasoning
      .slice(0, 4)
      .map(step => step.content || step.reasoning)
      .filter(content => content && content.length > 10);
  }
  
  return ['Analysis completed based on your profile and decision context'];
};

export default function AIReasoningPanel({ 
  reasoning, 
  confidence = 'medium',
  title = "How the AI thought about this"
}: AIReasoningPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const confidenceConfig = CONFIDENCE_CONFIG[confidence];
  const reasoningSteps = reasoning ? simplifyReasoning(reasoning) : [];

  if (!reasoning || reasoningSteps.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50/50">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🧠</span>
          <div>
            <span className="font-medium text-gray-700">{title}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${confidenceConfig.color}`}>
                <span>{confidenceConfig.icon}</span>
                {confidenceConfig.label}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-white/50">
          <div className="space-y-3 pt-4">
            {reasoningSteps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick insight */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-medium mb-1">Key Insight:</div>
            <div className="text-sm text-blue-700">
              This analysis considers your personality, values, and decision-making style to provide personalized future scenarios.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}