import { NextRequest, NextResponse } from 'next/server';
import { AssessmentAnswer, UserProfile } from '@/lib/types';
import { calculateBigFive, inferValues, inferFears, inferGoals, determineDecisionStyle } from '@/lib/psychology';

export async function POST(request: NextRequest) {
  try {
    const { tier, answers, completion } = await request.json();
    const profile = await processAnswersToProfile(answers);
    const userId = generateUserId();

    return NextResponse.json({
      success: true,
      data: {
        userId,
        profile,
        precision: tier === 1 ? 60 : tier === 2 ? 80 : 95
      }
    });
  } catch (error) {
    console.error('Assessment API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save assessment' }, { status: 500 });
  }
}

async function processAnswersToProfile(answers: AssessmentAnswer[]): Promise<UserProfile> {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));

  // Try AI-enhanced processing first
  const enhancedProfile = await enhanceProfileWithAI(answerMap);
  if (enhancedProfile) return enhancedProfile;

  // Fallback to algorithmic processing
  const bigFive = calculateBigFive(answerMap);
  
  return {
    age: parseInt(String(answerMap.get('age') || '25')),
    occupation: String(answerMap.get('occupation') || 'Professional'),
    bigFive,
    values: inferValues(answerMap),
    fears: inferFears(answerMap), 
    goals: inferGoals(answerMap),
    decisionStyle: determineDecisionStyle(answerMap, bigFive)
  };
}

async function enhanceProfileWithAI(answerMap: Map<string, string | number>): Promise<UserProfile | null> {
  try {
    const answersText = Array.from(answerMap.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = `Analyze psychology assessment: ${answersText}
Provide Big Five scores, values, goals, fears, and decision style.`;

    const { callGptOss } = await import('@/lib/gpt-oss');
    const response = await callGptOss(prompt, 'realistic', 'high', 'assessment');
    
    if (response) {
      // Parse AI response into structured profile (simplified for now)
      const bigFive = calculateBigFive(answerMap);
      return {
        age: parseInt(String(answerMap.get('age') || '25')),
        occupation: String(answerMap.get('occupation') || 'Professional'),
        bigFive,
        values: inferValues(answerMap),
        fears: inferFears(answerMap),
        goals: inferGoals(answerMap),
        decisionStyle: determineDecisionStyle(answerMap, bigFive)
      };
    }
    return null;
  } catch {
    return null;
  }
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}