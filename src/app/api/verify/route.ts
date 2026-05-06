export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { runAllChecks } from '@/lib/checks'

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json()

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Valid lat and lng required' }, { status: 400 })
    }
    if (lat < 6.0 || lat > 7.0 || lng < 2.5 || lng > 4.5) {
      return NextResponse.json({ error: 'Coordinates outside Lagos range' }, { status: 400 })
    }

    const result = await runAllChecks(lat, lng)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[VERIFY_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: 'Verification failed.', detail: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    )
  }
}
