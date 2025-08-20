// @file src/app/api/assess/route.ts
// API route to save user assessment and profile

import { NextRequest, NextResponse } from 'next/server';
import { AssessmentAnswer, UserProfile, BigFiveScores } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { tier, answers, completion } = await request.json();

    // Process answers into structured profile
    const profile = processAnswersToProfile(answers);

    // Generate user ID (in real app, use proper auth)
    const userId = generateUserId();

    // Save to database (mock for now)
    const userProfile = {
      id: userId,
      name: 'Anonymous User',
      email: '',
      assessmentLevel: tier,
      assessmentCompletion: completion,
      profile: profile,
      createdAt: new Date()
    };

    // In real app: await saveUserProfile(userProfile);
    console.log('Saved user profile:', userProfile);

    return NextResponse.json({
      success: true,
      data: {
        userId: userId,
        profile: profile,
        precision: tier === 1 ? 60 : tier === 2 ? 80 : 95
      }
    });

  } catch (error) {
    console.error('Assessment API error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to save assessment' },
        { status: 500 }
    );
  }
}

function processAnswersToProfile(answers: AssessmentAnswer[]): UserProfile {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));

  // Extract Big Five scores
  const bigFive: BigFiveScores = {
    openness: getScaleValue(answerMap, 'openness', 50),
    conscientiousness: getScaleValue(answerMap, 'conscientiousness', 50),
    extraversion: getScaleValue(answerMap, 'extraversion', 50),
    agreeableness: getScaleValue(answerMap, 'agreeableness', 50),
    neuroticism: getScaleValue(answerMap, 'neuroticism', 50)
  };

  // Extract values and goals
  const values = extractArrayValue(answerMap, 'core_values');
  const goals = [String(answerMap.get('life_priorities') || 'Personal growth')];
  const fears = [String(answerMap.get('biggest_fear') || 'Uncertainty')];

  // Determine decision style
  const decisionStyle = mapDecisionStyle(String(answerMap.get('decision_style') || 'balanced'));

  return {
    age: parseInt(String(answerMap.get('age') || '25')),
    occupation: String(answerMap.get('occupation') || 'Professional'),
    bigFive,
    values,
    fears,
    goals,
    decisionStyle
  };
}

function getScaleValue(answerMap: Map<string, any>, key: string, defaultValue: number): number {
  const value = answerMap.get(key);
  if (typeof value === 'number') {
    return (value / 5) * 100; // Convert 1-5 scale to 0-100
  }
  return defaultValue;
}

function extractArrayValue(answerMap: Map<string, any>, key: string): string[] {
  const value = answerMap.get(key);
  if (typeof value === 'string') {
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }
  return [];
}

function mapDecisionStyle(style: string): 'analytical' | 'intuitive' | 'balanced' | 'spontaneous' {
  if (style.includes('Analytical')) return 'analytical';
  if (style.includes('Intuitive')) return 'intuitive';
  if (style.includes('Spontaneous')) return 'spontaneous';
  return 'balanced';
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}