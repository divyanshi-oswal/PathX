import { NextResponse } from 'next/server';
import groceriesData from './groceries.json';

export async function GET() {
  return NextResponse.json(groceriesData);
}
