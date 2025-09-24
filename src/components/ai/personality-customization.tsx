'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Slider from '@/components/ui/slider';
import Badge from '@/components/ui/badge';

export interface CustomPersonality {
  name: string;
  traits: {
    optimism: number;
    riskTolerance: number;
    emotionalIntelligence: number;
    analytical: number;
    adventure: number;
  };
  description: string;
  systemPrompt: string;
}

interface PersonalityCustomizationProps {
  onPersonalityChange: (personality: CustomPersonality) => void;
  initialPersonality?: CustomPersonality;
}

const presets = [
  { name: 'Optimist', traits: { optimism: 90, riskTolerance: 70, emotionalIntelligence: 85, analytical: 60, adventure: 75 } },
  { name: 'Realist', traits: { optimism: 60, riskTolerance: 50, emotionalIntelligence: 75, analytical: 80, adventure: 55 } },
  { name: 'Cautious', traits: { optimism: 45, riskTolerance: 30, emotionalIntelligence: 70, analytical: 85, adventure: 35 } },
  { name: 'Adventurer', traits: { optimism: 80, riskTolerance: 90, emotionalIntelligence: 70, analytical: 55, adventure: 95 } }
];

const traitLabels = {
  optimism: 'Optimism',
  riskTolerance: 'Risk Tolerance',
  emotionalIntelligence: 'Emotional Intelligence', 
  analytical: 'Analytical Thinking',
  adventure: 'Adventure Seeking'
};

export default function PersonalityCustomization({ onPersonalityChange, initialPersonality }: PersonalityCustomizationProps) {
  const [traits, setTraits] = useState(initialPersonality?.traits || {
    optimism: 75, riskTolerance: 60, emotionalIntelligence: 80, analytical: 70, adventure: 65
  });
  const [name, setName] = useState(initialPersonality?.name || 'Custom Future Self');

  const updateTrait = (traitId: string, value: number) => {
    const newTraits = { ...traits, [traitId]: value };
    setTraits(newTraits);
    onPersonalityChange(generatePersonality(newTraits, name));
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setTraits(preset.traits);
    setName(preset.name);
    onPersonalityChange(generatePersonality(preset.traits, preset.name));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Customize Your Future Self</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-4 gap-2">
          {presets.map(preset => (
            <Button key={preset.name} variant="outline" onClick={() => applyPreset(preset)} className="text-sm">
              {preset.name}
            </Button>
          ))}
        </div>

        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded" placeholder="Future self name..."
        />

        <div className="space-y-4">
          {Object.entries(traitLabels).map(([key, label]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{label}</span>
                <Badge variant="outline">{traits[key as keyof typeof traits]}%</Badge>
              </div>
              <Slider
                value={[traits[key as keyof typeof traits]]}
                onValueChange={([value]) => updateTrait(key, value)}
                max={100} step={5}
              />
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">{name}</h3>
          <p className="text-sm text-gray-700">{generateDescription(traits)}</p>
        </div>

      </CardContent>
    </Card>
  );
}

function generatePersonality(traits: Record<string, number>, name: string): CustomPersonality {
  return {
    name,
    traits: traits as CustomPersonality['traits'],
    description: generateDescription(traits),
    systemPrompt: generateSystemPrompt(traits, name)
  };
}

function generateDescription(traits: Record<string, number>): string {
  const parts = [];
  if (traits.optimism > 75) parts.push("highly optimistic and positive");
  else if (traits.optimism < 40) parts.push("cautious and realistic");
  
  if (traits.riskTolerance > 75) parts.push("willing to take bold risks");
  else if (traits.riskTolerance < 40) parts.push("prefers safe, stable choices");
  
  if (traits.emotionalIntelligence > 75) parts.push("deeply empathetic");
  if (traits.analytical > 75) parts.push("logical and data-driven");
  
  return `You are ${parts.join(", ")}.`;
}

function generateSystemPrompt(traits: Record<string, number>, name: string): string {
  let prompt = `You are ${name}, the user's future self speaking from experience. `;
  
  if (traits.optimism > 75) prompt += "You're optimistic and focus on opportunities. ";
  else if (traits.optimism < 40) prompt += "You're realistic about challenges and difficulties. ";
  
  if (traits.riskTolerance > 75) prompt += "You encourage bold decisions and calculated risks. ";
  else if (traits.riskTolerance < 40) prompt += "You advocate for careful planning and stability. ";
  
  if (traits.emotionalIntelligence > 75) prompt += "You're empathetic and consider emotional impacts. ";
  if (traits.analytical > 75) prompt += "You provide logical, data-driven insights. ";
  
  return prompt + "Speak as someone who lived through similar decisions.";
}