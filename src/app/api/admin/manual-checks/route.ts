export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('verification_reports')
      .select('id, created_at, lat, lng, location_label, owner_name, request_tier, manual_status')
      .eq('request_tier', 'verified')
      .eq('manual_status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[ADMIN_MANUAL_CHECKS_LIST_ERROR]', error)
      return NextResponse.json({ error: 'Could not load manual checks queue' }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch (err) {
    console.error('[ADMIN_MANUAL_CHECKS_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}