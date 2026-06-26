import { NextResponse } from 'next/server';

import { getMwthDirectusData, hasDirectusConfig } from '../../../lib/directus';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasDirectusConfig()) {
    return NextResponse.json({ configured: false, data: null });
  }

  try {
    const data = await getMwthDirectusData();
    return NextResponse.json({ configured: true, data });
  } catch (error) {
    console.error('Failed to load Directus data', error);
    return NextResponse.json(
      { configured: true, data: null, error: 'Failed to load Directus data' },
      { status: 502 },
    );
  }
}
