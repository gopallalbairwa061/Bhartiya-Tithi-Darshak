
import { NextResponse } from 'next/server';
import { getFestivalsForMonth as getFestivalsData } from '@/services/festivals';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!year || !month) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 });
    }

    // API receives month as 1-12, but service expects 0-11
    const festivals = await getFestivalsData(parseInt(year, 10), parseInt(month, 10) - 1, { fromApi: true });
    return NextResponse.json(festivals);
  } catch (error) {
    console.error('API Error fetching monthly festivals:', error);
    return NextResponse.json({ error: 'Failed to fetch monthly festivals' }, { status: 500 });
  }
}
