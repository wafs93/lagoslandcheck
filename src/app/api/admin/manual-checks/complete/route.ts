export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/admin-auth'

interface CompleteBody {
  reportId: string
  manualCourtFinding?: string
  manualLucFinding?: string
  completedBy?: string
}

export async function POST(req: NextRequest) {
  const auth = requireAdminAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body: CompleteBody = await req.json()
    const reportId = typeof body.reportId === 'string' ? body.reportId.trim() : ''
    const manualCourtFinding = typeof body.manualCourtFinding === 'string' ? body.manualCourtFinding.trim() : ''
    const manualLucFinding = typeof body.manualLucFinding === 'string' ? body.manualLucFinding.trim() : ''
    const completedBy = typeof body.completedBy === 'string' ? body.completedBy.trim() : ''

    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 })
    }
    if (!manualCourtFinding && !manualLucFinding) {
      return NextResponse.json({ error: 'Provide at least one manual finding' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('verification_reports')
      .update({
        manual_status: 'completed',
        manual_court_finding: manualCourtFinding || null,
        manual_luc_finding: manualLucFinding || null,
        manual_completed_at: new Date().toISOString(),
        manual_completed_by: completedBy || 'admin',
      })
      .eq('id', reportId)
      .eq('request_tier', 'verified')
      .eq('manual_status', 'pending')
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('[ADMIN_MANUAL_CHECK_COMPLETE_ERROR]', { reportId, error })
      return NextResponse.json({ error: 'Could not update manual check' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Report not found or already completed' }, { status: 404 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('[ADMIN_MANUAL_CHECK_COMPLETE_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}