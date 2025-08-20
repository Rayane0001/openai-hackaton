// @file src/components/scenarios/scenario-card.tsx
// Card component for displaying individual scenarios

'use client';

import { Scenario } from '@/lib/types';
import { getStatColor, formatPercentage, cn } from '@/lib/utils';
import { lifeMetrics } from '@/data/life-metrics';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

interface ScenarioCardProps {
  scenario: Scenario;
  onViewDetails?: () => void;
  onChat?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

const personalityStyles = {
  optimistic: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
    icon: '🌟'
  },
  realistic: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    icon: '⚖️'
  },
  cautious: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: '🛡️'
  },
  adventurous: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800',
    icon: '🚀'
  }
};

export default function ScenarioCard({
                                       scenario,
                                       onViewDetails,
                                       onChat,
                                       isSelected = false,
                                       compact = false
                                     }: ScenarioCardProps) {
  const style = personalityStyles[scenario.personality];

  return (
      <Card
          className={cn(
              "transition-all duration-200 cursor-pointer",
              isSelected && "ring-2 ring-purple-500 ring-offset-2",
              style.bg,
              style.border,
              "border-2 hover:shadow-lg"
          )}
          onClick={onViewDetails}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{style.icon}</span>
                <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
              </div>
              <span className={cn("px-2 py-1 text-xs rounded-full font-medium", style.badge)}>
              {scenario.personality}
            </span>
            </div>
            <div className="text-right">
              <div className={cn("font-bold text-lg", style.text)}>
                {scenario.probability}%
              </div>
              <div className="text-xs text-gray-500">probability</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {scenario.description}
          </p>

          {/* Impact preview */}
          {!compact && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Impact Preview</h4>
                <div className="grid grid-cols-2 gap-2">
                  {lifeMetrics.slice(0, 4).map((metric) => {
                    const impact = scenario.impact[metric.key];
                    return (
                        <div key={metric.key} className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1">
                      <span>{metric.icon}</span>
                      <span className="truncate">{metric.name}</span>
                    </span>
                          <span className={cn(
                              "font-medium",
                              impact.change > 0 ? "text-green-600" : impact.change < 0 ? "text-red-600" : "text-gray-500"
                          )}>
                      {formatPercentage(impact.change)}
                    </span>
                        </div>
                    );
                  })}
                </div>
              </div>
          )}

          {/* Key milestones */}
          {!compact && scenario.keyMilestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Key Milestones</h4>
                <div className="space-y-1">
                  {scenario.keyMilestones.slice(0, 2).map((milestone, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{milestone}</span>
                      </div>
                  ))}
                  {scenario.keyMilestones.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{scenario.keyMilestones.length - 2} more milestones
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Risk/opportunity indicators */}
          {!compact && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-gray-600">{scenario.risks.length} risks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-500">💡</span>
                  <span className="text-gray-600">{scenario.opportunities.length} opportunities</span>
                </div>
              </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2 border-t border-gray-200">
            <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.();
                }}
                className="flex-1"
            >
              View Details
            </Button>
            <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onChat?.();
                }}
                className="flex-1"
            >
              Chat with Future Self
            </Button>
          </div>
        </div>
      </Card>
  );
}