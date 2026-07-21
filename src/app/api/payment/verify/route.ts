export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { verifyAndRecordPayment } from '@/lib/paystack'

const VALID_OVERALL = ['CLEAR', 'CAUTION', 'CRITICAL'] as const
type OverallVerdict = typeof VALID_OVERALL[number]

export async function POST(req: NextRequest) {
  try {
    const { paymentRef, lat, lng, overall } = await req.json()

    if (!paymentRef || typeof paymentRef !== 'string') {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 })
    }
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
    }

    const safeOverall: OverallVerdict = VALID_OVERALL.includes(overall) ? overall : 'CAUTION'

    const check = await verifyAndRecordPayment({
      paymentRef,
      lat,
      lng,
      overall: safeOverall,
      resultsJson: { source: 'unlock' },
    })

    if (!check.ok) {
      return NextResponse.json({ success: false, error: check.error }, { status: check.status })
    }

    return NextResponse.json({ success: true, reused: !!check.reused })
  } catch (err) {
    console.error('[PAYMENT_VERIFY_ROUTE_ERROR]', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
