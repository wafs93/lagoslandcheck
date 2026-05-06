export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { checkSatellite } from '@/lib/checks'

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json()
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Valid lat and lng required' }, { status: 400 })
    }

    const result = await checkSatellite(lat, lng)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[SATELLITE_ROUTE_ERROR]', err)
    return NextResponse.json({
      id: 'satellite',
      name: 'Satellite imagery',
      status: 'caution',
      summary: 'Satellite analysis could not complete.',
      details: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }, { status: 200 })
  }
}
