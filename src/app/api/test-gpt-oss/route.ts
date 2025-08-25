// @file src/app/api/test-gpt-oss/route.ts
// Test endpoint to verify GPT-OSS integration

import { NextRequest, NextResponse } from 'next/server';
import { callGptOss } from '@/lib/gpt-oss';

export async function POST(request: NextRequest) {
  try {
    const { prompt = "Hello, test message", personality = "realistic" } = await request.json();

    console.log('🧪 Testing GPT-OSS with prompt:', prompt);

    // Test GPT-OSS call
    const response = await callGptOss(prompt, personality, 'medium', 'chat');

    if (response) {
      return NextResponse.json({
        success: true,
        data: {
          message: response.message,
          reasoning: response.reasoning,
          model: 'llama3.2:3b',
          personality,
          status: 'AI response generated successfully'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'GPT-OSS not available or failed',
        fallback: 'Mock response would be used in production',
        status: 'Fallback mode activated'
      });
    }

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}