// @file src/components/decision/reasoning-display.tsx
// Transparent AI reasoning chain display

'use client';

import { useState } from 'react';
import { ReasoningStep } from '@/lib/types';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

interface ReasoningDisplayProps {
  reasoning: ReasoningStep[];
  title?: string;
  showConfidence?: boolean;
  collapsible?: boolean;
}

const stepTypeIcons = {
  analysis: '🔍',
  calculation: '🧮',
  comparison: '⚖️',
  conclusion: '💡'
};

const stepTypeColors = {
  analysis: 'border-blue-200 bg-blue-50',
  calculation: 'border-green-200 bg-green-50',
  comparison: 'border-yellow-200 bg-yellow-50',
  conclusion: 'border-purple-200 bg-purple-50'
};

export default function ReasoningDisplay({
                                           reasoning,
                                           title = "AI Reasoning Chain",
                                           showConfidence = true,
                                           collapsible = true
                                         }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  if (!reasoning || reasoning.length === 0) {
    return (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🤖</div>
            <p>No reasoning chain available</p>
          </div>
        </Card>
    );
  }

  const averageConfidence = Math.round(
      reasoning.reduce((sum, step) => sum + step.confidence, 0) / reasoning.length
  );

  return (
      <Card>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {showConfidence && (
                  <span className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium",
                      averageConfidence >= 80 ? "bg-green-100 text-green-700" :
                          averageConfidence >= 60 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                  )}>
                {averageConfidence}% avg confidence
              </span>
              )}
            </div>

            {collapsible && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? '⬆️ Collapse' : '⬇️ Expand'} Reasoning
                </Button>
            )}
          </div>

          {/* Quick summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <span>{reasoning.length} reasoning steps completed</span>
            <div className="flex items-center space-x-4">
              {Object.entries(stepTypeIcons).map(([type, icon]) => {
                const count = reasoning.filter(step => step.type === type).length;
                return count > 0 ? (
                    <span key={type} className="flex items-center space-x-1">
                  <span>{icon}</span>
                  <span>{count}</span>
                </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Reasoning steps */}
          {isExpanded && (
              <div className="space-y-3">
                {reasoning.map((step, index) => (
                    <div
                        key={step.step}
                        className={cn(
                            "border-2 rounded-lg p-4 transition-all cursor-pointer",
                            stepTypeColors[step.type],
                            selectedStep === step.step && "ring-2 ring-purple-500 ring-offset-2"
                        )}
                        onClick={() => setSelectedStep(selectedStep === step.step ? null : step.step)}
                    >
                      <div className="space-y-3">
                        {/* Step header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                              {step.step}
                            </div>
                            <span className="text-lg">{stepTypeIcons[step.type]}</span>
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {step.type} Step
                              </h4>
                              <p className="text-sm text-gray-600">{step.content}</p>
                            </div>
                          </div>

                          {showConfidence && (
                              <div className="text-right">
                                <div className={cn(
                                    "text-lg font-bold",
                                    step.confidence >= 80 ? "text-green-600" :
                                        step.confidence >= 60 ? "text-yellow-600" :
                                            "text-red-600"
                                )}>
                                  {step.confidence}%
                                </div>
                                <div className="text-xs text-gray-500">confidence</div>
                              </div>
                          )}
                        </div>

                        {/* Confidence bar */}
                        {showConfidence && (
                            <div className="w-full bg-white/60 rounded-full h-2">
                              <div
                                  className={cn(
                                      "h-full rounded-full transition-all duration-500",
                                      step.confidence >= 80 ? "bg-green-500" :
                                          step.confidence >= 60 ? "bg-yellow-500" :
                                              "bg-red-500"
                                  )}
                                  style={{ width: `${step.confidence}%` }}
                              />
                            </div>
                        )}

                        {/* Detailed reasoning */}
                        {selectedStep === step.step && (
                            <div className="bg-white/80 rounded-lg p-3 mt-3 border-l-4 border-purple-400">
                              <h5 className="font-medium text-gray-900 mb-2">Detailed Reasoning:</h5>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {step.reasoning}
                              </p>

                              {/* Step metadata */}
                              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                <span>Step Type: <span className="font-medium">{step.type}</span></span>
                                <span>Processing Order: <span className="font-medium">#{step.step}</span></span>
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Reasoning summary */}
          {isExpanded && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">🔍 Reasoning Summary</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Analysis Quality</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Data Processing:</span>
                        <span className="font-medium">
                      {reasoning.filter(s => s.type === 'analysis').length} steps
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calculations:</span>
                        <span className="font-medium">
                      {reasoning.filter(s => s.type === 'calculation').length} steps
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comparisons:</span>
                        <span className="font-medium">
                      {reasoning.filter(s => s.type === 'comparison').length} steps
                    </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Confidence Metrics</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Highest Confidence:</span>
                        <span className="font-medium text-green-600">
                      {Math.max(...reasoning.map(s => s.confidence))}%
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowest Confidence:</span>
                        <span className="font-medium text-red-600">
                      {Math.min(...reasoning.map(s => s.confidence))}%
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span className="font-medium">
                      {averageConfidence}%
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Steps:</span>
                        <span className="font-medium">
                      {reasoning.length}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Instructions */}
          {isExpanded && (
              <div className="text-xs text-gray-500 text-center">
                💡 Click on any step to see detailed reasoning • Higher confidence = more reliable analysis
              </div>
          )}
        </div>
      </Card>
  );
}