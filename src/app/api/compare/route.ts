// @file src/app/api/compare/route.ts - Multi-scenario comparison endpoint
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: 'Compare API' });
}
