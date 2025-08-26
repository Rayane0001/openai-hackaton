// @file src/components/ui/probability-badge.tsx
// Fuzzy probability display instead of precise percentages

interface ProbabilityBadgeProps {
  probability: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

const getProbabilityLevel = (probability: number) => {
  if (probability >= 80) return {
    label: 'Very Likely',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🎯'
  };
  if (probability >= 60) return {
    label: 'Quite Possible',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '✨'
  };
  if (probability >= 40) return {
    label: 'Possible',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🤔'
  };
  if (probability >= 20) return {
    label: 'Less Certain',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🌤️'
  };
  return {
    label: 'Uncertain',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❓'
  };
};

export default function ProbabilityBadge({ 
  probability, 
  size = 'md', 
  variant = 'default' 
}: ProbabilityBadgeProps) {
  const level = getProbabilityLevel(probability);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border ${level.color} ${sizeClasses[size]} font-medium`}>
        <span>{level.icon}</span>
        <span>{level.label}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border ${level.color} ${sizeClasses[size]} font-medium`}>
      <span className="text-lg">{level.icon}</span>
      <span>{level.label}</span>
    </div>
  );
}