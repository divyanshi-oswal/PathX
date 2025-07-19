import { NextResponse } from 'next/server';
import electronicsData from './electronics.json';

export async function GET() {
  return NextResponse.json(electronicsData);
}
