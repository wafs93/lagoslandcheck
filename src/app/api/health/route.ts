export const maxDuration = 10

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { error } = await db
      .from('fraud_zones')
      .select('id')
      .limit(1)

    if (error) {
      console.error('[HEALTH_SUPABASE_ERROR]', error)
      return NextResponse.json(
        { status: 'error', timestamp: new Date().toISOString() },
        { status: 500 }
      )
    }

    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[HEALTH_ROUTE_ERROR]', err)
    return NextResponse.json(
      { status: 'error', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
