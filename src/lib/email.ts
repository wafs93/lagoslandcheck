/**
 * Resend email client for LagosLandCheck.
 *
 * Configuration:
 * - RESEND_API_KEY must be set in Vercel environment variables
 * - Domain verification: resend.com/domains → Add Domain → lagoslandcheck.com
 *   → add the 3 DNS records (SPF, DKIM, MX) at your registrar → wait 10min → Verify
 * - Once verified, set RESEND_DOMAIN_VERIFIED=true in Vercel to switch sender
 *   from onboarding@resend.dev to support@lagoslandcheck.com
 *
 * Strategy: Option A — inline styled HTML emails with deep-link back to /report
 * for PDF re-download. Mirrors Stripe/Paystack receipt UX. No attachment bloat.
 */

import { Resend } from 'resend'

const FROM_VERIFIED = 'LagosLandCheck <support@lagoslandcheck.com>'
const FROM_FALLBACK = 'LagosLandCheck <onboarding@resend.dev>'
const REPLY_TO = 'support@lagoslandcheck.com'
const INTERNAL_INBOX = 'support@lagoslandcheck.com'

const FROM = process.env.RESEND_DOMAIN_VERIFIED === 'true' ? FROM_VERIFIED : FROM_FALLBACK

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not set in environment')
  return new Resend(key)
}

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

interface CheckRow {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

const STATUS_COLOR: Record<string, string> = {
  clear: '#15803D',
  caution: '#B45309',
  critical: '#991B1B',
}

const STATUS_BG: Record<string, string> = {
  clear: '#DCFCE7',
  caution: '#FEF3C7',
  critical: '#FEE2E2',
}

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR',
  caution: 'CAUTION',
  critical: 'HIGH RISK',
}

export async function sendReportEmail({
  to,
  refNo,
  locationLabel,
  overall,
  lat,
  lng,
  checks,
  reportUrl,
}: {
  to: string
  refNo: string
  locationLabel: string
  overall: 'CLEAR' | 'CAUTION' | 'CRITICAL'
  lat: number
  lng: number
  checks: CheckRow[]
  reportUrl: string
}): Promise<EmailResult> {
  try {
    const verdictMap = {
      CLEAR: { label: 'Cleared', sub: 'No major issues detected across the six automated checks.', color: '#15803D', bg: '#DCFCE7' },
      CAUTION: { label: 'Proceed with Caution', sub: 'Concerns detected. Do not transfer funds before legal verification is complete.', color: '#B45309', bg: '#FEF3C7' },
      CRITICAL: { label: 'Do Not Proceed', sub: 'Critical risk flags identified. Strongly advise against this transaction without full legal review.', color: '#991B1B', bg: '#FEE2E2' },
    }
    const v = verdictMap[overall]

    const checksHtml = checks.map(c => {
      const status = (c.status || 'caution').toLowerCase()
      const color = STATUS_COLOR[status] || '#5C6B7A'
      const bg = STATUS_BG[status] || '#F1F3F5'
      const label = STATUS_LABEL[status] || status.toUpperCase()
      return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #E5E7EB">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:12px;vertical-align:top">
                <div style="font-size:14px;font-weight:700;color:#1A2332;margin-bottom:3px">${escapeHtml(c.name)}</div>
                <div style="font-size:13px;color:#5C6B7A;line-height:1.5">${escapeHtml(c.summary)}</div>
              </td>
              <td style="vertical-align:top;width:90px;text-align:right">
                <span style="display:inline-block;font-family:Menlo,Consolas,monospace;font-size:10px;font-weight:700;padding:4px 9px;border-radius:4px;background:${bg};color:${color};letter-spacing:1px">${label}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    }).join('')

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  body{font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A2332;background:#F7F8FA;margin:0;padding:24px 16px;line-height:1.5}
  table{border-collapse:collapse}
  a{color:#07382C;text-decoration:none}
  .wrap{max-width:620px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)}
  .head{background:#07382C;color:#fff;padding:28px 32px;border-bottom:3px solid #CFAF6E}
  .brand{font-size:18px;font-weight:800;letter-spacing:-0.2px}
  .brand-sub{font-size:10px;color:#CFAF6E;letter-spacing:2px;margin-top:4px;font-family:Menlo,Consolas,monospace}
  .body{padding:32px}
  .h1{font-size:22px;font-weight:700;color:#1A2332;margin:0 0 6px;letter-spacing:-0.3px}
  .ref{font-family:Menlo,Consolas,monospace;font-size:11px;color:#5C6B7A;letter-spacing:1px}
  .verdict-box{padding:18px 22px;background:${v.bg};border-left:4px solid ${v.color};border-radius:0 6px 6px 0;margin:22px 0}
  .verdict-label{font-size:10px;color:${v.color};font-family:Menlo,Consolas,monospace;letter-spacing:1.5px;font-weight:700;margin-bottom:6px}
  .verdict-val{font-size:20px;font-weight:800;color:${v.color};margin-bottom:6px;letter-spacing:-0.3px}
  .verdict-text{font-size:13px;color:${v.color};opacity:0.85;line-height:1.55}
  .section-tag{font-size:10px;font-family:Menlo,Consolas,monospace;color:#5C6B7A;letter-spacing:2px;font-weight:700;margin-top:28px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #E5E7EB}
  .meta-row{display:block;padding:10px 0;font-size:13px;color:#1A2332;border-bottom:1px dashed #E5E7EB}
  .meta-key{display:inline-block;width:110px;color:#5C6B7A;font-family:Menlo,Consolas,monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase}
  .cta-wrap{margin:28px 0;text-align:center}
  .cta{display:inline-block;padding:14px 28px;background:#07382C;color:#fff !important;font-weight:700;font-size:14px;border-radius:8px;text-decoration:none;letter-spacing:0.2px}
  .cta-note{font-size:11px;color:#5C6B7A;margin-top:10px;font-family:Menlo,Consolas,monospace}
  .actions-block{margin:24px 0;padding:20px 22px;background:#F7F8FA;border-radius:8px;border-left:3px solid #07382C}
  .actions-block h3{font-size:11px;color:#07382C;margin:0 0 12px;font-family:Menlo,Consolas,monospace;letter-spacing:1.5px;font-weight:700}
  .actions-block ol{margin:0;padding-left:20px;color:#374151;font-size:13px;line-height:1.7}
  .actions-block li{margin-bottom:6px}
  .disclaimer{font-size:11px;color:#5C6B7A;line-height:1.6;margin-top:24px;padding-top:20px;border-top:1px solid #E5E7EB}
  .foot{padding:22px 32px;background:#F7F8FA;border-top:1px solid #E5E7EB;font-size:11px;color:#5C6B7A;font-family:Menlo,Consolas,monospace;line-height:1.8}
  @media (max-width:640px){
    body{padding:0}
    .wrap{border-radius:0;box-shadow:none}
    .body{padding:24px 20px}
    .head{padding:24px 20px}
    .foot{padding:20px}
  }
</style></head>
<body><div class="wrap">
  <div class="head">
    <div class="brand">LagosLandCheck</div>
    <div class="brand-sub">VERIFICATION INTELLIGENCE</div>
  </div>
  <div class="body">
    <h1 class="h1">Your verification report is ready</h1>
    <div class="ref">Reference: ${escapeHtml(refNo)}</div>

    <div class="verdict-box">
      <div class="verdict-label">RISK VERDICT</div>
      <div class="verdict-val">${v.label}</div>
      <div class="verdict-text">${v.sub}</div>
    </div>

    <div class="section-tag">SUBJECT PARCEL</div>
    <div class="meta-row"><span class="meta-key">Coordinates</span> <span style="font-family:Menlo,Consolas,monospace">${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E</span></div>
    <div class="meta-row"><span class="meta-key">Description</span> ${escapeHtml(locationLabel || 'Not provided')}</div>
    <div class="meta-row"><span class="meta-key">Checks run</span> 6 of 6</div>
    <div class="meta-row"><span class="meta-key">Reference</span> <span style="font-family:Menlo,Consolas,monospace">${escapeHtml(refNo)}</span></div>

    <div class="section-tag">SIX-POINT VERIFICATION RESULTS</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${checksHtml}
    </table>

    <div class="cta-wrap">
      <a href="${escapeHtml(reportUrl)}" class="cta">View Full Report &amp; Download PDF →</a>
      <div class="cta-note">Permanent link · Re-download anytime · No expiry</div>
    </div>

    <div class="actions-block">
      <h3>RECOMMENDED NEXT STEPS</h3>
      <ol>
        <li>Forward this report to a licensed Lagos property lawyer</li>
        <li>Instruct a full Land Registry title search at Alausa</li>
        <li>Verify the Certificate of Occupancy directly at the Land Registry</li>
        <li>Commission a SURCON-registered surveyor for on-site beacon verification</li>
      </ol>
    </div>

    <div class="disclaimer">
      <strong>Disclaimer:</strong> This report is a pre-screening intelligence tool generated by LagosLandCheck. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed Nigerian property lawyer. All findings are based on publicly available databases and satellite imagery at the time of generation. Always engage a qualified solicitor before completing any land transaction.
    </div>
  </div>
  <div class="foot">
    Need help? Reply to this email or contact <a href="mailto:support@lagoslandcheck.com">support@lagoslandcheck.com</a><br>
    LagosLandCheck · lagoslandcheck.com · ${escapeHtml(refNo)}
  </div>
</div></body></html>`

    const text = `Your LagosLandCheck verification report is ready.

Reference: ${refNo}
Verdict: ${v.label.toUpperCase()}
Location: ${locationLabel}
Coordinates: ${lat.toFixed(5)}N, ${lng.toFixed(5)}E

SIX-POINT VERIFICATION RESULTS:
${checks.map(c => `  ${c.name}: ${(c.status || '').toUpperCase()} - ${c.summary}`).join('\n')}

View the full report and download PDF anytime:
${reportUrl}

RECOMMENDED NEXT STEPS:
1. Forward this report to a licensed Lagos property lawyer
2. Instruct a full Land Registry title search at Alausa
3. Verify the Certificate of Occupancy at the Land Registry
4. Commission a SURCON-registered surveyor for beacon verification

Disclaimer: This is a pre-screening tool and does not replace legal advice.

Reply to this email if you have questions: support@lagoslandcheck.com
LagosLandCheck · lagoslandcheck.com`

    const client = getClient()
    const { data, error } = await client.emails.send({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject: `Your LagosLandCheck Report · ${refNo}`,
      html,
      text,
    })

    if (error) {
      console.error('[EMAIL_REPORT_ERROR]', error)
      return { success: false, error: error.message }
    }
    return { success: true, id: data?.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[EMAIL_REPORT_EXCEPTION]', msg)
    return { success: false, error: msg }
  }
}

export async function sendContactForm({
  name,
  email,
  topic,
  message,
}: {
  name: string
  email: string
  topic: string
  message: string
}): Promise<EmailResult> {
  try {
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#1A2332;background:#F7F8FA;margin:0;padding:24px}
  .wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)}
  .head{background:#07382C;color:#fff;padding:20px 28px;border-bottom:3px solid #CFAF6E}
  .head-label{font-size:10px;color:#CFAF6E;letter-spacing:2px;font-family:Menlo,Consolas,monospace;margin-bottom:4px;font-weight:700}
  .head-title{font-size:16px;font-weight:700}
  .body{padding:22px 28px}
  .row{padding:10px 0;border-bottom:1px dashed #E5E7EB}
  .row:last-child{border:none}
  .key{font-size:10px;font-family:Menlo,Consolas,monospace;color:#5C6B7A;letter-spacing:1.5px;margin-bottom:4px;text-transform:uppercase}
  .val{font-size:14px;color:#1A2332}
  .msg{background:#F7F8FA;padding:14px 18px;border-radius:6px;font-size:14px;color:#1A2332;line-height:1.6;white-space:pre-wrap;margin-top:6px}
</style></head>
<body><div class="wrap">
  <div class="head">
    <div class="head-label">NEW INQUIRY · LAGOSLANDCHECK</div>
    <div class="head-title">Contact form submission</div>
  </div>
  <div class="body">
    <div class="row"><div class="key">Name</div><div class="val">${escapeHtml(name)}</div></div>
    <div class="row"><div class="key">Email</div><div class="val"><a href="mailto:${escapeHtml(email)}" style="color:#07382C">${escapeHtml(email)}</a></div></div>
    <div class="row"><div class="key">Topic</div><div class="val">${escapeHtml(topic)}</div></div>
    <div class="row"><div class="key">Message</div><div class="msg">${escapeHtml(message)}</div></div>
  </div>
</div></body></html>`

    const client = getClient()
    const { data, error } = await client.emails.send({
      from: FROM,
      to: INTERNAL_INBOX,
      replyTo: email,
      subject: `[${topic}] ${name} via lagoslandcheck.com`,
      html,
      text: `New contact form submission from ${name} <${email}>\n\nTopic: ${topic}\n\nMessage:\n${message}\n\n-- Reply directly to this email to respond.`,
    })

    if (error) {
      console.error('[EMAIL_CONTACT_ERROR]', error)
      return { success: false, error: error.message }
    }
    return { success: true, id: data?.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[EMAIL_CONTACT_EXCEPTION]', msg)
    return { success: false, error: msg }
  }
}

export async function sendContactAck(to: string, name: string): Promise<EmailResult> {
  try {
    const firstName = name.split(' ')[0]
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#1A2332;background:#F7F8FA;margin:0;padding:24px}
  .wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)}
  .head{background:#07382C;color:#fff;padding:24px 28px;border-bottom:3px solid #CFAF6E}
  .brand{font-size:16px;font-weight:800}
  .sub{font-size:10px;color:#CFAF6E;letter-spacing:2px;font-family:Menlo,Consolas,monospace;margin-top:3px;font-weight:700}
  .body{padding:28px}
  p{font-size:14px;line-height:1.7;color:#374151;margin:12px 0}
  code{background:#F7F8FA;padding:2px 6px;border-radius:4px;font-family:Menlo,Consolas,monospace;font-size:12px}
  .foot{padding:18px 28px;background:#F7F8FA;border-top:1px solid #E5E7EB;font-size:11px;color:#5C6B7A;font-family:Menlo,Consolas,monospace;line-height:1.7}
</style></head>
<body><div class="wrap">
  <div class="head">
    <div class="brand">LagosLandCheck</div>
    <div class="sub">VERIFICATION INTELLIGENCE</div>
  </div>
  <div class="body">
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>Thanks for reaching out — we've received your message and will reply within 24 hours (Monday–Saturday, West Africa Time).</p>
    <p>If your inquiry relates to a report you've already paid for, including your reference number (starts with <code>LLC-</code>) in your reply helps us locate it faster.</p>
    <p style="color:#5C6B7A;font-size:13px;margin-top:24px">— The LagosLandCheck team</p>
  </div>
  <div class="foot">
    LagosLandCheck · lagoslandcheck.com<br>
    This is an automated acknowledgement. A team member will reply personally.
  </div>
</div></body></html>`

    const client = getClient()
    const { data, error } = await client.emails.send({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject: 'We received your message — LagosLandCheck',
      html,
      text: `Hi ${firstName},\n\nThanks for reaching out. We received your message and will reply within 24 hours (Monday-Saturday WAT).\n\nIf this relates to a paid report, please include your LLC- reference number in your reply.\n\n-- The LagosLandCheck team\nlagoslandcheck.com`,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
