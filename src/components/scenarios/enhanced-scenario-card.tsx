// @file src/components/scenarios/enhanced-scenario-card.tsx
// Enhanced scenario cards with personalities and visual gauges

import { Scenario } from '@/lib/types';
import LifeGauge from '@/components/ui/life-gauge';
import ProbabilityBadge from '@/components/ui/probability-badge';

interface EnhancedScenarioCardProps {
  scenario: Scenario;
  onChatClick?: () => void;
  isSelected?: boolean;
}

const PERSONALITY_CONFIG = {
  optimistic: {
    name: 'The Visionary',
    description: 'Sees opportunities everywhere, believes in the best outcomes',
    gradient: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    avatar: '🌟'
  },
  realistic: {
    name: 'The Balanced',
    description: 'Weighs pros and cons, provides practical perspective',
    gradient: 'from-blue-400 to-indigo-400',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    avatar: '⚖️'
  },
  cautious: {
    name: 'The Sage',
    description: 'Values security and stability, warns about risks',
    gradient: 'from-green-400 to-emerald-400',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    avatar: '🛡️'
  },
  adventurous: {
    name: 'The Explorer',
    description: 'Embraces risks, seeks bold new experiences',
    gradient: 'from-purple-400 to-pink-400',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    avatar: '🚀'
  }
};

// Convert LifeStats to our 5 key metrics
const getLifeMetrics = (scenario: Scenario) => [
  { key: 'wellbeing', value: scenario.timeline.year5.happiness },
  { key: 'relationships', value: scenario.timeline.year5.relationships },
  { key: 'career', value: scenario.timeline.year5.career },
  { key: 'financial', value: scenario.timeline.year5.financial },
  { key: 'health', value: scenario.timeline.year5.health }
];

export default function EnhancedScenarioCard({ scenario, onChatClick, isSelected }: EnhancedScenarioCardProps) {
  const config = PERSONALITY_CONFIG[scenario.personality];
  const metrics = getLifeMetrics(scenario);
  
  return (
    <div className={`
      relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg
      ${config.bgColor} ${config.borderColor}
      ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{config.avatar}</div>
          <div>
            <h3 className={`font-bold text-lg ${config.textColor}`}>
              {config.name}
            </h3>
            <p className="text-sm text-gray-600 max-w-[200px]">
              {config.description}
            </p>
          </div>
        </div>
        
        <ProbabilityBadge 
          probability={scenario.probability} 
          size="sm" 
          variant="compact"
        />
      </div>

      {/* Life Metrics - Visual Gauges */}
      <div className="space-y-3 mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Life Outlook in 5 Years:
        </div>
        {metrics.map(({ key, value }) => (
          <LifeGauge
            key={key}
            metric={key as any}
            value={value}
            size="sm"
          />
        ))}
      </div>

      {/* Key Highlights */}
      {scenario.keyMilestones && scenario.keyMilestones.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</div>
          <div className="space-y-1">
            {scenario.keyMilestones.slice(0, 2).map((milestone, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Risks/Opportunities */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {scenario.risks && scenario.risks.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Main Risk:</div>
            <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              {scenario.risks[0]}
            </div>
          </div>
        )}
        
        {scenario.opportunities && scenario.opportunities.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Key Opportunity:</div>
            <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              {scenario.opportunities[0]}
            </div>
          </div>
        )}
      </div>

      {/* Chat Button */}
      <button
        onClick={onChatClick}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
          bg-gradient-to-r ${config.gradient} text-white
          hover:shadow-md hover:scale-[1.02] transform
        `}
      >
        💬 Chat with {config.name}
      </button>

      {/* Timeline Tabs (collapsed by default) */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-center">
          <button className="text-xs text-gray-500 hover:text-gray-700">
            View 10 & 15 year outlook →
          </button>
        </div>
      </div>
    </div>
  );
}