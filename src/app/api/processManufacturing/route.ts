import { NextResponse } from 'next/server';
import processManufacturingData from './processManufacturing.json';

export async function GET() {
  return NextResponse.json(processManufacturingData);
}
