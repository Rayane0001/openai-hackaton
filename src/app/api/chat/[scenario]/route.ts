// @file src/app/api/chat/[scenario]/route.ts - Chat with future self endpoint
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Chat API' });
}
