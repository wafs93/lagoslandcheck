export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/admin-auth'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LagosLandCheck <support@lagoslandcheck.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lagoslandcheck.com'

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
      .select('id, payment_email, lat, lng, payment_ref, location_label')
      .maybeSingle()

    if (error) {
      console.error('[ADMIN_MANUAL_CHECK_COMPLETE_ERROR]', { reportId, error })
      return NextResponse.json({ error: 'Could not update manual check' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Report not found or already completed' }, { status: 404 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[ADMIN_MANUAL_CHECK_COMPLETE_EMAIL_SKIPPED] Missing RESEND_API_KEY')
    } else if (!data.payment_email || !data.payment_ref || typeof data.lat !== 'number' || typeof data.lng !== 'number') {
      console.warn('[ADMIN_MANUAL_CHECK_COMPLETE_EMAIL_SKIPPED] Missing recipient/report fields', {
        reportId: data.id,
        hasEmail: !!data.payment_email,
        hasPaymentRef: !!data.payment_ref,
        hasLatLng: typeof data.lat === 'number' && typeof data.lng === 'number',
      })
    } else {
      const resend = new Resend(apiKey)
      const reportUrl = `${SITE_URL}/report?lat=${data.lat}&lng=${data.lng}&paymentRef=${encodeURIComponent(data.payment_ref)}`
      const label = data.location_label || `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`
      const subject = 'Your LagosLandCheck Verified report update is ready'
      const html = `
        <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.6">
          <h2 style="margin:0 0 8px">Your Verified report has been updated</h2>
          <p style="margin:0 0 12px">Our team completed manual court and LUC verification for <strong>${label}</strong>.</p>
          <p style="margin:0 0 16px">Open your report to view the updated findings:</p>
          <p style="margin:0 0 20px"><a href="${reportUrl}" style="background:#07382C;color:#fff;text-decoration:none;padding:10px 14px;border-radius:6px;display:inline-block">View updated report</a></p>
          <p style="font-size:12px;color:#6b7280">If the button does not work, copy this link:<br>${reportUrl}</p>
        </div>
      `

      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.payment_email,
        replyTo: 'support@lagoslandcheck.com',
        subject,
        html,
      })

      if (emailError) {
        console.error('[ADMIN_MANUAL_CHECK_COMPLETE_EMAIL_FAIL]', { reportId: data.id, error: emailError })
      } else {
        console.log('[ADMIN_MANUAL_CHECK_COMPLETE_EMAIL_SENT]', { reportId: data.id, email: data.payment_email })
      }
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