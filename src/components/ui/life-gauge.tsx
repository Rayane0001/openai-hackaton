// @file src/components/ui/life-gauge.tsx
// Visual gauge component with qualitative labels and icons

interface LifeGaugeProps {
  metric: 'wellbeing' | 'relationships' | 'career' | 'financial' | 'health';
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const METRIC_CONFIG = {
  wellbeing: {
    icon: '🌟',
    label: 'Personal Wellbeing',
    color: {
      low: 'bg-red-400',
      medium: 'bg-yellow-400', 
      high: 'bg-green-400'
    }
  },
  relationships: {
    icon: '💖',
    label: 'Relationships & Family',
    color: {
      low: 'bg-red-400',
      medium: 'bg-orange-400',
      high: 'bg-pink-400'
    }
  },
  career: {
    icon: '🚀',
    label: 'Professional Situation',
    color: {
      low: 'bg-red-400',
      medium: 'bg-blue-400',
      high: 'bg-purple-400'
    }
  },
  financial: {
    icon: '🛡️',
    label: 'Financial Security',
    color: {
      low: 'bg-red-400',
      medium: 'bg-yellow-400',
      high: 'bg-emerald-400'
    }
  },
  health: {
    icon: '💪',
    label: 'Health & Energy',
    color: {
      low: 'bg-red-400',
      medium: 'bg-orange-400',
      high: 'bg-green-400'
    }
  }
};

const getQualitativeLabel = (value: number): string => {
  if (value >= 75) return 'Strong';
  if (value >= 50) return 'Moderate';
  if (value >= 25) return 'Growing';
  return 'Developing';
};

const getColorLevel = (value: number): 'low' | 'medium' | 'high' => {
  if (value >= 70) return 'high';
  if (value >= 40) return 'medium';
  return 'low';
};

export default function LifeGauge({ metric, value, showLabel = true, size = 'md' }: LifeGaugeProps) {
  const config = METRIC_CONFIG[metric];
  const qualitativeLabel = getQualitativeLabel(value);
  const colorLevel = getColorLevel(value);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3', 
    lg: 'h-4'
  };
  
  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={iconSizes[size]}>{config.icon}</span>
            <span className="text-sm font-medium text-gray-700">
              {config.label}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {qualitativeLabel}
          </span>
        </div>
      )}
      
      {/* Visual gauge */}
      <div className="relative">
        <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${config.color[colorLevel]} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
        
        {/* Subtle value indicator */}
        <div 
          className="absolute top-0 w-0.5 h-full bg-white/60 rounded-full transition-all duration-700"
          style={{ left: `${Math.min(98, Math.max(1, value))}%` }}
        />
      </div>
    </div>
  );
}