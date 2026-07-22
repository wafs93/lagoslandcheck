export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type RequestTier = 'instant' | 'verified'
type ManualStatus = 'not_required' | 'pending' | 'completed'

function normalizeCoord(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

export async function GET(req: NextRequest) {
  try {
    const paymentRef = req.nextUrl.searchParams.get('paymentRef')?.trim() || ''
    const latParam = req.nextUrl.searchParams.get('lat')?.trim() || ''
    const lngParam = req.nextUrl.searchParams.get('lng')?.trim() || ''

    if (!paymentRef || !latParam || !lngParam) {
      return NextResponse.json({ error: 'Missing paymentRef/lat/lng' }, { status: 400 })
    }

    const lat = Number(latParam)
    const lng = Number(lngParam)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('verification_reports')
      .select('lat, lng, request_tier, manual_status, manual_court_finding, manual_luc_finding, manual_completed_at')
      .eq('payment_ref', paymentRef)
      .maybeSingle()

    if (error) {
      console.error('[REPORT_STATUS_FETCH_ERROR]', { paymentRef, lat, lng, error })
      return NextResponse.json({ error: 'Could not fetch report status' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const requestedLat = normalizeCoord(lat)
    const requestedLng = normalizeCoord(lng)
    const storedLat = normalizeCoord(Number(data.lat))
    const storedLng = normalizeCoord(Number(data.lng))

    if (storedLat !== requestedLat || storedLng !== requestedLng) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const requestTier: RequestTier = data.request_tier === 'verified' ? 'verified' : 'instant'
    const manualStatus: ManualStatus = data.manual_status === 'completed'
      ? 'completed'
      : data.manual_status === 'pending'
        ? 'pending'
        : 'not_required'

    if (manualStatus === 'completed') {
      return NextResponse.json({
        success: true,
        requestTier,
        manualStatus,
        manualCompletedAt: data.manual_completed_at || null,
        manualCourtFinding: data.manual_court_finding || '',
        manualLucFinding: data.manual_luc_finding || '',
      })
    }

    return NextResponse.json({
      success: true,
      requestTier,
      manualStatus,
      manualCompletedAt: null,
    })
  } catch (err) {
    console.error('[REPORT_STATUS_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}