// @file src/app/api/generate/route.ts - Scenario generation with GPT-OSS 20B
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Generate API' });
}
