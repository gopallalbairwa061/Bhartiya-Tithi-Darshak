
import { NextResponse } from 'next/server';
import { getPanchangForMonth as getPanchangData } from '@/services/panchang';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (year === null || month === null) {
      return NextResponse.json({ message: 'Year and month parameters are required' }, { status: 400 });
    }

    // API receives month as 1-12, but service expects 0-11
    const panchangData = await getPanchangData(parseInt(year, 10), parseInt(month, 10) - 1, { fromApi: true });
    
    return NextResponse.json(panchangData);
  } catch (error) {
    console.error('API Error fetching panchang data:', error);
    return NextResponse.json({ message: 'Failed to fetch panchang data' }, { status: 500 });
  }
}
