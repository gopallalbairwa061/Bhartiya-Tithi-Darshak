
import { NextResponse } from 'next/server';
import { getFestivalsForYear as getFestivalsData } from '@/services/festivals';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    if (!year) {
      return NextResponse.json({ error: 'Year is required' }, { status: 400 });
    }

    const festivals = await getFestivalsData(parseInt(year, 10), { fromApi: true });
    return NextResponse.json(festivals);
  } catch (error) {
    console.error('API Error fetching yearly festivals:', error);
    return NextResponse.json({ error: 'Failed to fetch yearly festivals' }, { status: 500 });
  }
}
