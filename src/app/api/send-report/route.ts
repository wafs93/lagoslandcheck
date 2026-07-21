export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyAndRecordPayment } from '@/lib/paystack'

interface CheckPayload {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

interface RequestBody {
  email: string
  refNo: string
  paymentRef: string
  lat: number
  lng: number
  locationLabel: string
  overall: 'CLEAR' | 'CAUTION' | 'CRITICAL'
  checks: CheckPayload[]
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LagosLandCheck <support@lagoslandcheck.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lagoslandcheck.com'

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR', caution: 'CAUTION', critical: 'HIGH RISK',
}

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  clear:    { bg: '#DCFCE7', text: '#15803D' },
  caution:  { bg: '#FEF3C7', text: '#B45309' },
  critical: { bg: '#FEE2E2', text: '#991B1B' },
}

const VERDICT_CONFIG = {
  CLEAR: { label: 'CLEARED', color: '#15803D', bg: '#DCFCE7', sub: 'No major issues detected across the six automated checks.' },
  CAUTION: { label: 'PROCEED WITH CAUTION', color: '#B45309', bg: '#FEF3C7', sub: 'Concerns detected. Do not transfer funds before legal verification is complete.' },
  CRITICAL: { label: 'DO NOT PROCEED', color: '#991B1B', bg: '#FEE2E2', sub: 'Critical risk flags identified. Strongly advise against this transaction without full legal review.' },
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailHtml(body: RequestBody): string {
  const { refNo, paymentRef, locationLabel, lat, lng, overall, checks } = body
  const v = VERDICT_CONFIG[overall]
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const deepLink = `${SITE_URL}/report?lat=${lat}&lng=${lng}&paymentRef=${encodeURIComponent(paymentRef)}&ref=${refNo}`
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const mapImg = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=560x280&maptype=hybrid&markers=color:red%7C${lat},${lng}&key=${apiKey}`
    : ''

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  body{margin:0;padding:0;background:#F7F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A2332;-webkit-font-smoothing:antialiased}
  .wrap{max-width:640px;margin:0 auto;background:#fff}
  .head{background:#07382C;padding:28px 32px;color:#fff;border-bottom:3px solid #CFAF6E}
  .brand{font-size:18px;font-weight:800;letter-spacing:-0.3px}
  .brand-sub{font-size:10px;color:#CFAF6E;letter-spacing:2px;font-family:Menlo,Monaco,monospace;margin-top:4px}
  .ref-bar{padding:14px 32px;background:#F7F8FA;border-bottom:1px solid #E5E7EB;font-family:Menlo,Monaco,monospace;font-size:11px;color:#5C6B7A;letter-spacing:0.5px}
  .ref-bar strong{color:#1A2332;font-weight:600}
  .body{padding:32px}
  h1{margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:-0.4px;color:#1A2332}
  .lede{font-size:14px;color:#5C6B7A;line-height:1.6;margin:0 0 24px}
  .verdict{background:${v.bg};border-left:4px solid ${v.color};padding:18px 22px;border-radius:0 6px 6px 0;margin:0 0 24px}
  .verdict-label{font-size:10px;font-family:Menlo,monospace;color:${v.color};letter-spacing:2px;font-weight:600;margin-bottom:4px}
  .verdict-title{font-size:18px;font-weight:800;color:${v.color};letter-spacing:-0.3px;line-height:1.2;margin-bottom:6px}
  .verdict-sub{font-size:13px;color:${v.color};opacity:0.9;line-height:1.5}
  .subject{border:1px solid #E5E7EB;border-radius:6px;overflow:hidden;margin:0 0 24px}
  .subject-img{width:100%;display:block;height:auto}
  .subject-body{padding:16px 20px;background:#fafbfc}
  .srow{display:table;width:100%;padding:6px 0;border-bottom:1px dashed #E5E7EB}
  .srow:last-child{border:none}
  .skey{display:table-cell;font-size:10px;font-family:Menlo,monospace;color:#5C6B7A;letter-spacing:1px;text-transform:uppercase}
  .sval{display:table-cell;font-size:12px;font-family:Menlo,monospace;color:#1A2332;font-weight:500;text-align:right}
  .section-tag{font-size:10px;font-family:Menlo,monospace;color:#5C6B7A;letter-spacing:2px;font-weight:600;margin:0 0 12px;text-transform:uppercase}
  .check{border:1px solid #E5E7EB;border-radius:6px;padding:14px 16px;margin-bottom:8px}
  .check-head{display:table;width:100%;margin-bottom:6px}
  .check-name{display:table-cell;font-size:14px;font-weight:700;color:#1A2332;vertical-align:middle}
  .check-pill{display:table-cell;text-align:right;vertical-align:middle;width:90px}
  .pill{display:inline-block;font-size:9px;font-family:Menlo,monospace;font-weight:700;padding:3px 8px;border-radius:3px;letter-spacing:1px}
  .check-summary{font-size:13px;color:#374151;line-height:1.5;margin:0 0 6px}
  .check-details{font-size:12px;color:#5C6B7A;line-height:1.6;padding-top:8px;border-top:1px dashed #E5E7EB}
  .cta-wrap{margin:28px 0;text-align:center}
  .cta{display:inline-block;background:#07382C;color:#ffffff !important;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.2px}
  .cta-sub{font-size:11px;color:#5C6B7A;margin-top:10px;font-family:Menlo,monospace;line-height:1.6}
  .actions{background:#F7F8FA;border-radius:6px;padding:18px 22px;margin:24px 0}
  .actions h3{margin:0 0 10px;font-size:11px;font-family:Menlo,monospace;color:#07382C;letter-spacing:1.5px;font-weight:600}
  .actions ol{margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:1.8}
  .disclaimer{font-size:11px;color:#5C6B7A;line-height:1.6;padding:14px 0;border-top:1px solid #E5E7EB;margin-top:24px}
  .foot{padding:20px 32px;background:#F7F8FA;border-top:1px solid #E5E7EB;font-size:11px;color:#5C6B7A;font-family:Menlo,monospace;line-height:1.8}
  .foot a{color:#07382C;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="head">
    <div class="brand">LagosLandCheck</div>
    <div class="brand-sub">VERIFICATION INTELLIGENCE</div>
  </div>
  <div class="ref-bar">REF · <strong>${refNo}</strong> &nbsp;·&nbsp; ${date.toUpperCase()}</div>
  <div class="body">
    <h1>Your verification report is ready</h1>
    <p class="lede">Six automated checks were run on the location below. Findings are summarised in this email, and the full PDF version is available at the secure link further down.</p>

    <div class="verdict">
      <div class="verdict-label">RISK VERDICT</div>
      <div class="verdict-title">${v.label}</div>
      <div class="verdict-sub">${v.sub}</div>
    </div>

    <div class="section-tag">SUBJECT PARCEL</div>
    <div class="subject">
      ${mapImg ? `<img src="${mapImg}" alt="Satellite imagery" class="subject-img">` : ''}
      <div class="subject-body">
        <div class="srow"><span class="skey">Coordinates</span><span class="sval">${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E</span></div>
        ${locationLabel ? `<div class="srow"><span class="skey">Description</span><span class="sval">${escapeHtml(locationLabel.slice(0,50))}</span></div>` : ''}
        <div class="srow"><span class="skey">Reference</span><span class="sval">${refNo}</span></div>
        <div class="srow"><span class="skey">Generated</span><span class="sval">${date}</span></div>
      </div>
    </div>

    <div class="section-tag">SIX-POINT VERIFICATION</div>
    ${checks.map(c => {
      const status = (c.status || 'caution').toLowerCase()
      const sc = STATUS_COLOR[status] || STATUS_COLOR.caution
      const label = STATUS_LABEL[status] || status.toUpperCase()
      return `
      <div class="check">
        <div class="check-head">
          <div class="check-name">${escapeHtml(c.name)}</div>
          <div class="check-pill"><span class="pill" style="background:${sc.bg};color:${sc.text}">${label}</span></div>
        </div>
        <div class="check-summary">${escapeHtml(c.summary)}</div>
        ${c.details ? `<div class="check-details">${escapeHtml(c.details)}</div>` : ''}
      </div>`
    }).join('')}

    <div class="cta-wrap">
      <a href="${deepLink}" class="cta">Download PDF Report</a>
      <div class="cta-sub">Opens your full dossier-format report.<br>Bookmark the link to re-download anytime.</div>
    </div>

    <div class="actions">
      <h3>RECOMMENDED NEXT STEPS</h3>
      <ol>
        <li>Forward this report to a licensed Lagos property lawyer</li>
        <li>Instruct a full Land Registry title search at Alausa</li>
        <li>Verify the Certificate of Occupancy directly at the Land Registry</li>
        <li>Commission a SURCON-registered surveyor for on-site beacon verification</li>
      </ol>
    </div>

    <div class="disclaimer">
      <strong>Legal disclaimer:</strong> This report is a pre-screening intelligence tool. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed Nigerian property lawyer. LagosLandCheck accepts no liability for decisions made solely on the basis of this report.
    </div>
  </div>

  <div class="foot">
    Questions? Reply to this email or contact <a href="mailto:support@lagoslandcheck.com">support@lagoslandcheck.com</a><br>
    LagosLandCheck · <a href="${SITE_URL}">lagoslandcheck.com</a> · Ref ${refNo}
  </div>
</div>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { email, refNo, paymentRef, lat, lng, overall, checks } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!refNo || !paymentRef) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
    }
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
    }
    if (!Array.isArray(checks) || checks.length !== 6) {
      return NextResponse.json({ error: 'Invalid checks payload' }, { status: 400 })
    }
    if (!['CLEAR', 'CAUTION', 'CRITICAL'].includes(overall)) {
      return NextResponse.json({ error: 'Invalid overall verdict' }, { status: 400 })
    }

    const paymentCheck = await verifyAndRecordPayment({
      paymentRef,
      lat,
      lng,
      overall,
      paymentEmail: email,
      resultsJson: {
        source: 'send-report',
        refNo,
        locationLabel,
        overall,
        checks,
      },
    })
    if (!paymentCheck.ok) {
      return NextResponse.json(
        { success: false, error: paymentCheck.error || 'Payment verification failed' },
        { status: paymentCheck.status }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[SEND_REPORT_NO_KEY] RESEND_API_KEY not configured in env')
      return NextResponse.json({ error: 'Email service not configured. Add RESEND_API_KEY to Vercel.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const html = buildEmailHtml(body)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: 'support@lagoslandcheck.com',
      subject: `Your LagosLandCheck Report · ${refNo}`,
      html,
    })

    if (error) {
      console.error('[SEND_REPORT_FAIL]', { refNo, paymentRef, email, error })
      return NextResponse.json(
        { success: false, error: 'Email delivery failed.', detail: error.message },
        { status: 500 }
      )
    }

    console.log('[REPORT_SENT]', { refNo, paymentRef, email, emailId: data?.id })
    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (err) {
    console.error('[SEND_REPORT_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
