// @file src/components/decision/decision-form.tsx
// Form for inputting new decisions with context

'use client';

import { useState } from 'react';
import { Decision } from '@/lib/types';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

interface DecisionFormProps {
  onSubmit: (decision: Partial<Decision>) => void;
  isLoading?: boolean;
  initialData?: Partial<Decision>;
}

const categories = [
  { id: 'career', name: 'Career', icon: '💼', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { id: 'financial', name: 'Financial', icon: '💰', color: 'bg-green-50 border-green-200 text-green-700' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🏠', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { id: 'health', name: 'Health', icon: '🏃', color: 'bg-orange-50 border-orange-200 text-orange-700' }
];

const urgencyLevels = [
  { id: 'low', name: 'Low Priority', description: 'Can wait months', color: 'bg-gray-50' },
  { id: 'medium', name: 'Medium', description: 'Within weeks', color: 'bg-yellow-50' },
  { id: 'high', name: 'Urgent', description: 'Within days', color: 'bg-red-50' }
];

export default function DecisionForm({ onSubmit, isLoading = false, initialData }: DecisionFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    urgency: (initialData?.urgency || 'medium') as 'low' | 'medium' | 'high',
    timeline: initialData?.timeline || '',
    constraints: initialData?.constraints?.join(', ') || '',
    alternatives: initialData?.alternatives?.join(', ') || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category as Decision['category'],
      urgency: formData.urgency as Decision['urgency'],
      timeline: formData.timeline.trim() || 'No specific timeline',
      constraints: formData.constraints ? formData.constraints.split(',').map(c => c.trim()).filter(Boolean) : [],
      alternatives: formData.alternatives ? formData.alternatives.split(',').map(a => a.trim()).filter(Boolean) : []
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Describe Your Decision</h2>
            <p className="text-sm text-gray-600 mt-1">
              Provide details so our AI can give you the best analysis
            </p>
          </div>

          {/* Title */}
          <Input
              label="Decision Title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Should I accept this job offer?"
              error={errors.title}
              required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Provide context, details, and what makes this decision important..."
                maxLength={1000}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                  <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateField('category', cat.id)}
                      className={cn(
                          "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all",
                          formData.category === cat.id ? cat.color : "border-gray-200 hover:border-gray-300"
                      )}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
              ))}
            </div>
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Urgency</label>
            <div className="grid grid-cols-3 gap-3">
              {urgencyLevels.map((level) => (
                  <button
                      key={level.id}
                      type="button"
                      onClick={() => updateField('urgency', level.id as 'low' | 'medium' | 'high')}
                      className={cn(
                          "p-3 rounded-lg border-2 text-center transition-all",
                          formData.urgency === level.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                      )}
                  >
                    <div className="font-medium text-sm">{level.name}</div>
                    <div className="text-xs text-gray-500">{level.description}</div>
                  </button>
              ))}
            </div>
          </div>

          {/* Timeline & Constraints */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
                label="Timeline (optional)"
                value={formData.timeline}
                onChange={(e) => updateField('timeline', e.target.value)}
                placeholder="e.g., Within 3 months"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Constraints (optional)
              </label>
              <input
                  value={formData.constraints}
                  onChange={(e) => updateField('constraints', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Budget, location, family... (comma separated)"
              />
            </div>
          </div>

          {/* Alternatives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternatives (optional)
            </label>
            <input
                value={formData.alternatives}
                onChange={(e) => updateField('alternatives', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Other options you're considering... (comma separated)"
            />
          </div>

          {/* Submit */}
          <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="lg"
          >
            {isLoading ? 'Generating Analysis...' : 'Analyze My Decision 🔮'}
          </Button>
        </form>
      </Card>
  );
}