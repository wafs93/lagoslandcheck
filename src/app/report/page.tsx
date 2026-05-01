'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type CheckStatus = 'queued' | 'running' | 'clear' | 'caution' | 'critical'

interface Check {
  id: string
  name: string
  status: CheckStatus
  summary: string
  details: string
}

const statusConfig = {
  clear: { color: '#22C55E', bg: '#ECFDF5', badge: '#D1FAE5', text: '#065F46', label: 'CLEAR' },
  caution: { color: '#F59E0B', bg: '#FFFBEB', badge: '#FEF3C7', text: '#92400E', label: 'CAUTION' },
  critical: { color: '#EF4444', bg: '#FEF2F2', badge: '#FEE2E2', text: '#991B1B', label: 'CRITICAL' },
  queued: { color: '#D1D5DB', bg: '#F9FAFB', badge: '#F3F4F6', text: '#6B7280', label: 'QUEUED' },
  running: { color: '#60A5FA', bg: '#EFF6FF', badge: '#DBEAFE', text: '#1D4ED8', label: 'CHECKING' },
}

const verdictConfig = {
  CLEAR: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', label: '✅ All Clear', sub: 'No major issues found. Continue with standard legal due diligence.' },
  CAUTION: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: '⚠️ Proceed with Caution', sub: 'Concerns detected. Do not pay any money before consulting a lawyer.' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', label: '🚫 Do Not Proceed', sub: 'Critical flags found. Strongly advise against proceeding without professional legal advice.' },
}

declare global { interface Window { PaystackPop: any } }

function generatePDF(checks: Check[], overall: string, lat: string, lng: string, satelliteUrl: string | null, streetViewUrl: string | null) {
  const vc = verdictConfig[overall as keyof typeof verdictConfig] || verdictConfig.CAUTION
  const date = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://lagoslandcheck.com/verify/${refNo}`

  const verdictColors = {
    CLEAR:    { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', dot: '#22C55E', label: 'ALL CLEAR',            icon: '✅' },
    CAUTION:  { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', dot: '#F59E0B', label: 'PROCEED WITH CAUTION', icon: '⚠️' },
    CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', dot: '#EF4444', label: 'DO NOT PROCEED',       icon: '🚫' },
  }
  const vd = verdictColors[overall as keyof typeof verdictColors] || verdictColors.CAUTION

  const dotColor = (s: string) => ({ clear: '#22C55E', caution: '#F59E0B', critical: '#EF4444' }[s] || '#D1D5DB')
  const badgeBg  = (s: string) => ({ clear: '#D1FAE5', caution: '#FEF3C7', critical: '#FEE2E2' }[s] || '#F3F4F6')
  const badgeTxt = (s: string) => ({ clear: '#065F46', caution: '#92400E', critical: '#991B1B' }[s] || '#6B7280')
  const badgeLbl = (s: string) => ({ clear: 'CLEAR',  caution: 'CAUTION',  critical: 'HIGH RISK' }[s] || s.toUpperCase())

  const checkIcons: Record<string, string> = {
    satellite: '🛰️', gazette: '📜', flood: '🌊', litigation: '⚖️', luc: '🧾', fraud: '🚨'
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LagosLandCheck — Verification Certificate ${refNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',Arial,sans-serif;color:#111827;background:#fff;font-size:13px;line-height:1.5}
  
  /* ── COVER PAGE ── */
  .cover{min-height:100vh;display:flex;flex-direction:column;background:#07382C;padding:0;page-break-after:always}
  .cover-top{padding:36px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1)}
  .cover-logo{display:flex;align-items:center;gap:12px}
  .cover-logo-box{width:40px;height:40px;background:#0A5C45;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.15)}
  .cover-logo-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px}
  .cover-logo-sub{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:1.5px}
  .cover-ref{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);text-align:right}
  .cover-ref strong{color:rgba(255,255,255,0.8);display:block;font-size:12px;margin-bottom:2px}
  .cover-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center}
  .cover-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:20px;text-transform:uppercase}
  .cover-title{font-family:'Syne',sans-serif;font-size:40px;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-1px;margin-bottom:12px}
  .cover-title span{color:#CFAF6E}
  .cover-subtitle{font-size:14px;color:rgba(255,255,255,0.55);max-width:400px;line-height:1.7;margin-bottom:40px}
  .cover-verdict{border-radius:16px;padding:20px 32px;margin-bottom:32px;border:1px solid ${vd.border};background:${vd.bg};display:inline-block}
  .cover-verdict-icon{font-size:32px;margin-bottom:8px}
  .cover-verdict-label{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:${vd.text};letter-spacing:-0.5px}
  .cover-verdict-sub{font-size:12px;color:${vd.text};opacity:0.8;margin-top:4px}
  .cover-meta{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
  .cover-meta-pill{font-family:'JetBrains Mono',monospace;font-size:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);padding:6px 14px;border-radius:20px}
  .cover-bottom{padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between}
  .cover-bottom-text{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,0.25);line-height:1.8}
  .cover-qr{width:60px;height:60px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden}

  /* ── REPORT PAGES ── */
  .page{padding:40px;max-width:760px;margin:0 auto}
  .page-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:2px solid #0A5C45;margin-bottom:28px}
  .page-header-logo{display:flex;align-items:center;gap:8px}
  .page-header-logo-box{width:28px;height:28px;background:#0A5C45;border-radius:6px;display:flex;align-items:center;justify-content:center}
  .page-header-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#0A5C45}
  .page-header-ref{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:right}
  
  .section-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px}
  .section-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#111827;margin-bottom:16px;letter-spacing:-0.3px}

  /* Verdict card */
  .verdict-card{border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid ${vd.border};background:${vd.bg}}
  .verdict-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .verdict-main{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:${vd.text}}
  .verdict-desc{font-size:12px;color:${vd.text};opacity:0.8;line-height:1.6;margin-bottom:12px}
  .verdict-tags{display:flex;gap:8px;flex-wrap:wrap}
  .verdict-tag{font-family:'JetBrains Mono',monospace;font-size:9px;background:rgba(0,0,0,0.06);color:${vd.text};padding:3px 10px;border-radius:4px}

  /* Satellite image */
  .sat-img{width:100%;border-radius:10px;margin-bottom:8px;border:1px solid #E5E7EB;display:block}
  .sat-cap{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:center;margin-bottom:24px}

  /* Check cards */
  .checks-grid{margin-bottom:24px}
  .check-card{border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;margin-bottom:8px;page-break-inside:avoid}
  .check-card-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .check-icon-box{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
  .check-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;color:#111827;flex:1}
  .check-badge{font-family:'JetBrains Mono',monospace;font-size:8px;padding:3px 9px;border-radius:4px;font-weight:700;letter-spacing:0.5px}
  .check-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .check-summary{font-size:12px;color:#6B7280;line-height:1.6;margin-bottom:6px;padding-left:42px}
  .check-details{font-size:11px;color:#374151;line-height:1.7;padding:10px 12px;background:#F9FAFB;border-radius:6px;margin-left:42px;border-left:3px solid #E5E7EB}

  /* Risk bar */
  .risk-bar{display:flex;gap:4px;margin:12px 0 4px}
  .risk-seg{flex:1;height:5px;border-radius:3px}
  .risk-labels{display:flex;justify-content:space-between}
  .risk-label{font-family:'JetBrains Mono',monospace;font-size:8px;color:#9CA3AF}

  /* Summary box */
  .summary-box{background:#F8FAF9;border:1px solid #E5E7EB;border-radius:10px;padding:16px 18px;margin-bottom:24px}
  .summary-text{font-size:12px;color:#374151;line-height:1.8}
  .summary-text strong{color:#111827}

  /* Disclaimer */
  .disclaimer{background:#FFF8F0;border:1px solid #FED7AA;border-radius:10px;padding:14px 16px;margin-bottom:24px}
  .disclaimer-title{font-family:'JetBrains Mono',monospace;font-size:9px;color:#92400E;letter-spacing:1px;margin-bottom:6px;font-weight:600}
  .disclaimer-text{font-size:10px;color:#92400E;line-height:1.75}

  /* Next steps */
  .next-steps{margin-bottom:24px}
  .step{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:0.5px solid #F3F4F6}
  .step:last-child{border-bottom:none}
  .step-num{width:22px;height:22px;border-radius:50%;background:#0A5C45;color:#fff;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .step-text{font-size:12px;color:#374151;line-height:1.6}
  .step-text strong{color:#111827;display:block;margin-bottom:2px}

  /* Footer */
  .report-footer{border-top:1px solid #E5E7EB;padding-top:16px;display:flex;align-items:center;justify-content:space-between;margin-top:8px}
  .footer-brand{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:#0A5C45}
  .footer-meta{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:right}

  @media print {
    .cover{min-height:100vh}
    .page{padding:24px}
    @page{margin:8mm;size:A4}
    .check-card{page-break-inside:avoid}
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════
     COVER PAGE
════════════════════════════════════════════ -->
<div class="cover">
  <div class="cover-top">
    <div class="cover-logo">
      <div class="cover-logo-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div>
        <div class="cover-logo-name">LagosLandCheck</div>
        <div class="cover-logo-sub">LAND VERIFICATION INTELLIGENCE</div>
      </div>
    </div>
    <div class="cover-ref">
      <strong>VERIFICATION CERTIFICATE</strong>
      <span>Ref: ${refNo}</span><br>
      <span>${date} · ${time}</span>
    </div>
  </div>

  <div class="cover-hero">
    <div class="cover-eyebrow">AI-Powered Land Pre-Screening Report</div>
    <div class="cover-title">Lagos Land<br><span>Verification</span><br>Report</div>
    <div class="cover-subtitle">6 automated checks completed using satellite imagery, public databases, and AI analysis</div>
    
    <div class="cover-verdict">
      <div class="cover-verdict-icon">${vd.label === 'ALL CLEAR' ? '✅' : vd.label === 'PROCEED WITH CAUTION' ? '⚠️' : '🚫'}</div>
      <div class="cover-verdict-label">${vd.label}</div>
      <div class="cover-verdict-sub">${vc.sub}</div>
    </div>

    <div class="cover-meta">
      <span class="cover-meta-pill">📍 ${parseFloat(lat).toFixed(5)}°N, ${parseFloat(lng).toFixed(5)}°E</span>
      <span class="cover-meta-pill">📅 ${date}</span>
      <span class="cover-meta-pill">⚡ 6 checks completed</span>
      <span class="cover-meta-pill">🔒 Ref: ${refNo}</span>
    </div>
  </div>

  <div class="cover-bottom">
    <div class="cover-bottom-text">
      lagoslandcheck.com<br>
      Pre-screening intelligence · Not legal advice<br>
      Always engage a licensed Lagos property lawyer
    </div>
    <div class="cover-qr">
      <img src="${qrUrl}" width="60" height="60" alt="QR" style="display:block" />
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     PAGE 2 — VERDICT + SATELLITE + CHECKS
════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">
      <div class="page-header-logo-box">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <span class="page-header-name">LagosLandCheck</span>
    </div>
    <div class="page-header-ref">
      Ref: ${refNo} · ${date}<br>
      lagoslandcheck.com
    </div>
  </div>

  <!-- Risk Verdict -->
  <div class="section-label">OVERALL RISK ASSESSMENT</div>
  <div class="verdict-card">
    <div class="verdict-row">
      <div class="verdict-main">${vd.label === 'ALL CLEAR' ? '✅' : vd.label === 'PROCEED WITH CAUTION' ? '⚠️' : '🚫'} ${vd.label}</div>
    </div>
    <div class="verdict-desc">${vc.sub}</div>
    <div class="risk-bar">
      <div class="risk-seg" style="background:${overall === 'CLEAR' ? '#22C55E' : '#E5E7EB'}"></div>
      <div class="risk-seg" style="background:${overall === 'CAUTION' ? '#F59E0B' : '#E5E7EB'}"></div>
      <div class="risk-seg" style="background:${overall === 'CRITICAL' ? '#EF4444' : '#E5E7EB'}"></div>
    </div>
    <div class="risk-labels">
      <span class="risk-label">Low Risk</span>
      <span class="risk-label">Medium Risk</span>
      <span class="risk-label">High Risk</span>
    </div>
    <div class="verdict-tags" style="margin-top:12px">
      <span class="verdict-tag">📅 ${date} · ${time}</span>
      <span class="verdict-tag">📍 ${parseFloat(lat).toFixed(5)}°N, ${parseFloat(lng).toFixed(5)}°E</span>
      <span class="verdict-tag">🔒 ${refNo}</span>
    </div>
  </div>

  <!-- Satellite Image -->
  ${satelliteUrl ? `
  <div class="section-label">SATELLITE IMAGERY</div>
  <img src="${satelliteUrl}" class="sat-img" alt="Satellite view of location" />
  <div class="sat-cap">🛰️ AI-analysed satellite view · Zoom level 19 · ${parseFloat(lat).toFixed(5)}°N, ${parseFloat(lng).toFixed(5)}°E · Source: Google Maps</div>
  ` : ''}

  <!-- 6 Checks -->
  <div class="section-label">6-POINT VERIFICATION RESULTS</div>
  <div class="checks-grid">
    ${checks.map(c => `
    <div class="check-card">
      <div class="check-card-header">
        <div class="check-icon-box" style="background:${badgeBg(c.status)}">${checkIcons[c.id] || '🔍'}</div>
        <span class="check-name">${c.name}</span>
        <span class="check-badge" style="background:${badgeBg(c.status)};color:${badgeTxt(c.status)}">${badgeLbl(c.status)}</span>
        <div class="check-dot" style="background:${dotColor(c.status)}"></div>
      </div>
      <div class="check-summary">${c.summary}</div>
      ${c.details ? `<div class="check-details">${c.details}</div>` : ''}
    </div>
    `).join('')}
  </div>

  <!-- Summary -->
  <div class="section-label">PLAIN ENGLISH SUMMARY</div>
  <div class="summary-box">
    <div class="summary-text">
      ${overall === 'CLEAR'
        ? `<strong>This land appears clear of major issues.</strong> Our 6 automated checks found no gazette acquisitions, active court disputes, known fraud zone flags, or flood risk concerns at this coordinate. The satellite imagery shows conditions consistent with the stated land type.<br><br>This pre-screening result is encouraging. However, this does not replace a full physical Land Registry search. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.`
        : overall === 'CAUTION'
        ? `<strong>This land has raised concerns that require investigation before proceeding.</strong> One or more of our 6 checks returned a caution result. This may indicate proximity to a gazette acquisition corridor, a Land Use Charge gap, or an area with known community disputes.<br><br><strong>Do not pay any money before consulting a property lawyer.</strong> The findings in this report should be used as a starting point for deeper due diligence.`
        : `<strong>This land has critical flags that strongly indicate risk of fraud or legal complications.</strong> Our checks have identified serious concerns that could result in loss of investment if this transaction proceeds.<br><br><strong>Do not proceed with this transaction without full legal investigation.</strong> Engage a licensed Lagos property lawyer immediately before taking any further steps.`
      }
    </div>
  </div>

  <!-- Next Steps -->
  <div class="section-label">RECOMMENDED NEXT STEPS</div>
  <div class="next-steps">
    ${[
      { n:1, title:'Engage a Lagos property lawyer', desc:'Show them this report and instruct a full Land Registry title search at the Lagos State Land Registry, Alausa.' },
      { n:2, title:'Request the original C of O', desc:'Never accept photocopies alone. Verify the Certificate of Occupancy file number at the Land Registry (nominal fee).' },
      { n:3, title:'Check Land Use Charge status', desc:'Visit landusecharge.lagosstate.gov.ng or instruct your lawyer to verify LUC payment history since 2018.' },
      { n:4, title:'Engage a licensed surveyor', desc:'Instruct a SURCON-registered surveyor to verify beacon numbers on-site against OSGOF records.' },
    ].map(s => `
    <div class="step">
      <div class="step-num">${s.n}</div>
      <div class="step-text"><strong>${s.title}</strong>${s.desc}</div>
    </div>`).join('')}
  </div>

  <!-- Disclaimer -->
  <div class="disclaimer">
    <div class="disclaimer-title">⚠️ IMPORTANT LEGAL DISCLAIMER</div>
    <div class="disclaimer-text">
      This report is a pre-screening intelligence tool generated by LagosLandCheck. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed Nigerian property lawyer. All findings are based on publicly available databases and satellite imagery at the time of generation. LagosLandCheck accepts no liability for decisions made solely on the basis of this report. Always engage a qualified Nigerian property solicitor before completing any land transaction.
    </div>
  </div>

  <div class="report-footer">
    <div class="footer-brand">LagosLandCheck · lagoslandcheck.com</div>
    <div class="footer-meta">
      ${refNo} · ${date}<br>
      Pre-screening only · Not legal advice
    </div>
  </div>
</div>

</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) {
    alert('Please allow popups to download the PDF. Check your browser popup blocker settings.')
    return
  }
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => {
    try { win.focus(); win.print() }
    catch (e) { console.error('Print failed:', e) }
  }, 1500)
}

function StreetViewImage({ url }: { url: string | null }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  if (!url) return (
    <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1628', color: 'rgba(255,255,255,0.4)', fontSize: 13, gap: 8 }}>
      <span style={{ fontSize: 32 }}>📷</span>
      <span>Street View not available for this location</span>
      <span style={{ fontSize: 11 }}>Switch to Interactive Map tab to explore the area</span>
    </div>
  )

  return (
    <div style={{ position: 'relative' }}>
      {status === 'loading' && (
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1628', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>Loading street view...</span>
        </div>
      )}
      <img
        src={url}
        alt="Street view"
        style={{ width: '100%', height: 260, objectFit: 'cover', display: status === 'error' ? 'none' : 'block' }}
        onLoad={() => setStatus('ok')}
        onError={() => setStatus('error')}
      />
      {status === 'error' && (
        <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1628', color: 'rgba(255,255,255,0.4)', fontSize: 13, gap: 10 }}>
          <span style={{ fontSize: 36 }}>📷</span>
          <span style={{ fontWeight: 500 }}>No Street View coverage here</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono',monospace" }}>Common in Lagos residential streets</span>
          <button
            onClick={() => window.open(`https://www.google.com/maps/@${url.match(/location=([^&]+)/)?.[1]?.replace(',', ',')},3a,75y,0h,90t/data=!3m1!1e3`, '_blank')}
            style={{ marginTop: 6, padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}>
            Open in Google Maps →
          </button>
        </div>
      )}
      {status === 'ok' && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
          📷 Street View · Ground level
        </div>
      )}
    </div>
  )
}

function ReportContent() {
  const params = useSearchParams()
  const router = useRouter()
  const lat = params.get('lat')
  const lng = params.get('lng')

  const [phase, setPhase] = useState<'loading' | 'report'>('loading')
  const [checks, setChecks] = useState<Check[]>([
    { id: 'satellite', name: 'Satellite imagery', status: 'queued', summary: '', details: '' },
    { id: 'gazette', name: 'Gazette & govt acquisition', status: 'queued', summary: '', details: '' },
    { id: 'flood', name: 'Flood & drainage risk', status: 'queued', summary: '', details: '' },
    { id: 'litigation', name: 'Court litigation', status: 'queued', summary: '', details: '' },
    { id: 'luc', name: 'Land Use Charge status', status: 'queued', summary: '', details: '' },
    { id: 'fraud', name: 'Fraud zone & Omo Onile', status: 'queued', summary: '', details: '' },
  ])
  const [overall, setOverall] = useState<'CLEAR' | 'CAUTION' | 'CRITICAL'>('CAUTION')
  const [paid, setPaid] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)

  useEffect(() => {
    // Check if already paid this session
    const paidKey = `paid_${lat}_${lng}`
    if (sessionStorage.getItem(paidKey)) setPaid(true)
  }, [lat, lng])

  useEffect(() => {
    if (!lat || !lng) return
    runVerification()
  }, [lat, lng])

  const runVerification = async () => {
    setChecks(prev => prev.map(c => ({ ...c, status: 'running' })))
    try {
      const [verifyRes, satelliteRes] = await Promise.all([
        fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: parseFloat(lat!), lng: parseFloat(lng!) })
        }),
        fetch('/api/satellite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: parseFloat(lat!), lng: parseFloat(lng!) })
        })
      ])

      const verifyData = await verifyRes.json()
      const satelliteData = await satelliteRes.json()

      // Merge satellite result
      const allChecks = verifyData.checks.map((c: Check) =>
        c.id === 'satellite' ? satelliteData : c
      )

      allChecks.forEach((check: Check, i: number) => {
        setTimeout(() => {
          setChecks(prev => prev.map(c => c.id === check.id ? check : c))
        }, i * 300)
      })

      setTimeout(() => {
        setOverall(verifyData.overall)
        setPhase('report')
      }, allChecks.length * 300 + 400)

    } catch {
      setPhase('report')
    }
  }

  const initPaystack = () => {
    if (!email) { setShowEmailInput(true); return }
    setPayLoading(true)

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => {
      const handler = window.PaystackPop.setup({
        key: 'pk_live_24d75de9079f18d337d6f0d8910e39ee4cd3415',
        email,
        amount: 250000, // ₦2,500 in kobo
        currency: 'NGN',
        ref: `llc_${lat}_${lng}_${Date.now()}`,
        metadata: {
          lat, lng,
          custom_fields: [
            { display_name: 'Property', variable_name: 'property', value: `${lat}, ${lng}` }
          ]
        },
        callback: (response: { reference: string }) => {
          // Payment successful
          setPaid(true)
          setPayLoading(false)
          const paidKey = `paid_${lat}_${lng}`
          sessionStorage.setItem(paidKey, response.reference)
        },
        onClose: () => setPayLoading(false)
      })
      handler.openIframe()
    }
    document.head.appendChild(script)
  }

  const vc = verdictConfig[overall]

  const satelliteUrl = lat && lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=640x360&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  const streetViewUrl = lat && lng
    ? `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${lat},${lng}&fov=90&pitch=0&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  const mapsEmbedUrl = lat && lng
    ? `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${lat},${lng}&zoom=19&maptype=satellite`
    : null

  const satelliteCheck = checks.find(c => c.id === 'satellite')
  const hasBuilding = satelliteCheck?.summary?.includes('Building') || satelliteCheck?.summary?.includes('building')
  const [activeView, setActiveView] = useState<'satellite' | 'street' | 'map'>('satellite')
  const [imgZoom, setImgZoom] = useState(false)

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#F9FAFB', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeIn 0.4s ease both}
        .check-row:hover{background:rgba(0,0,0,0.015)}
        .blur-content{filter:blur(5px);user-select:none;pointer-events:none}
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back
        </button>
        <div style={{ width: 1, height: 20, background: '#E5E7EB' }} />
        <div style={{ width: 28, height: 28, background: '#0A5C45', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>LagosLandCheck</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', fontFamily: "'JetBrains Mono',monospace" }}>
          {lat ? `${parseFloat(lat).toFixed(4)}°N` : ''} {lng ? `${parseFloat(lng).toFixed(4)}°E` : ''}
        </span>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '1.25rem 1rem' }}>

        {/* Loading state */}
        {phase === 'loading' && (
          <div className="appear">
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #E5E7EB', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A5C45" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Running 6 checks in parallel...</span>
              </div>
              {checks.map(c => {
                const sc = statusConfig[c.status]
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0, animation: c.status === 'running' ? 'pulse 1s infinite' : 'none' }} />
                    <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", padding: '2px 7px', borderRadius: 4, background: sc.badge, color: sc.text }}>{sc.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Report */}
        {phase === 'report' && (
          <div className="appear">

            {/* Image viewer with tabs */}
            {(satelliteUrl || streetViewUrl || mapsEmbedUrl) && (
              <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                {/* Tab bar */}
                <div style={{ display: 'flex', background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {([
                    { id: 'satellite', label: '🛰️ Satellite', show: !!satelliteUrl },
                    { id: 'street', label: '📷 Street View', show: !!streetViewUrl },
                    { id: 'map', label: '🗺️ Interactive Map', show: !!mapsEmbedUrl },
                  ] as Array<{id:'satellite'|'street'|'map',label:string,show:boolean}>).filter(t => t.show).map(tab => (
                    <button key={tab.id} onClick={() => setActiveView(tab.id)}
                      style={{ padding: '10px 14px', background: activeView === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderBottom: activeView === tab.id ? '2px solid #CFAF6E' : '2px solid transparent', color: activeView === tab.id ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: "'JetBrains Mono',monospace", cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                      {tab.label}
                    </button>
                  ))}
                  <div style={{ flex: 1 }} />
                  <div style={{ padding: '10px 12px', fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                    {lat ? `${parseFloat(lat).toFixed(5)}°N, ${parseFloat(lng!).toFixed(5)}°E` : ''}
                  </div>
                </div>

                {/* Satellite tab */}
                {activeView === 'satellite' && satelliteUrl && (
                  <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setImgZoom(true)}>
                    <img src={satelliteUrl} alt="Satellite view" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
                      Tap to zoom · AI-analysed
                    </div>
                    {hasBuilding && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                        ⚠️ BUILDING DETECTED
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                      zoom 19 · satellite
                    </div>
                  </div>
                )}

                {/* Street View tab */}
                {activeView === 'street' && streetViewUrl && (
                  <div style={{ position: 'relative' }}>
                    <img src={streetViewUrl} alt="Street view" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement!;
                        parent.innerHTML = '<div style="height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0A1628;color:rgba(255,255,255,0.4);font-size:13px;gap:8px"><span style=\"font-size:32px\">📷</span><span>No Street View available for this location</span><span style=\"font-size:11px\">Try the Interactive Map tab</span></div>'
                      }} />
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
                      📷 Street View · Ground level
                    </div>
                  </div>
                )}

                {/* Interactive Map tab */}
                {activeView === 'map' && mapsEmbedUrl && (
                  <div style={{ position: 'relative' }}>
                    <iframe src={mapsEmbedUrl} width="100%" height="260" style={{ border: 'none', display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
                      Pinch to zoom · Scroll to explore
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Zoom lightbox */}
            {imgZoom && satelliteUrl && (
              <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
                <div style={{ position: 'relative', maxWidth: 700, width: '100%' }}>
                  <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`} alt="HD Satellite" style={{ width: '100%', borderRadius: 12, display: 'block' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                    🛰️ HD View · zoom 20 · {lat ? parseFloat(lat).toFixed(5) : ''}°N, {lng ? parseFloat(lng).toFixed(5) : ''}°E
                  </div>
                  {hasBuilding && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                      ⚠️ BUILDING DETECTED
                    </div>
                  )}
                  <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>Tap anywhere to close</div>
                </div>
              </div>
            )}

            {/* Verdict */}
            <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: vc.text, fontFamily: "'Lora',serif", marginBottom: 4 }}>{vc.label}</div>
              <p style={{ fontSize: 13, color: vc.text, opacity: 0.85, lineHeight: 1.6 }}>{vc.sub}</p>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: 'rgba(0,0,0,0.06)', color: vc.text, padding: '3px 8px', borderRadius: 4 }}>
                  {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: 'rgba(0,0,0,0.06)', color: vc.text, padding: '3px 8px', borderRadius: 4 }}>
                  {lat ? `${parseFloat(lat).toFixed(4)}°N, ${parseFloat(lng!).toFixed(4)}°E` : ''}
                </span>
              </div>
            </div>

            {/* FREE: Check results — summary only */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>6 Check Results</span>
                {!paid && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 4 }}>FREE PREVIEW</span>}
                {paid && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: 4 }}>✓ FULL REPORT UNLOCKED</span>}
              </div>

              {checks.map((c, i) => {
                const sc = statusConfig[c.status] || statusConfig.queued
                const isOpen = expanded === c.id && paid
                return (
                  <div key={c.id} className="check-row"
                    style={{ borderBottom: i < checks.length - 1 ? '0.5px solid #F3F4F6' : 'none', cursor: paid ? 'pointer' : 'default', transition: 'background 0.1s' }}
                    onClick={() => paid && setExpanded(isOpen ? null : c.id)}>
                    <div style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>{c.name}</span>
                        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", padding: '2px 8px', borderRadius: 4, background: sc.badge, color: sc.text, fontWeight: 600 }}>{sc.label}</span>
                        {paid && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        )}
                      </div>
                      {/* Summary — always visible (free) */}
                      <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4, paddingLeft: 17, lineHeight: 1.55 }}>{c.summary}</p>
                      {/* Details — paid only */}
                      {isOpen && paid && (
                        <div style={{ marginTop: 8, paddingLeft: 17, paddingTop: 8, borderTop: '0.5px solid #F3F4F6' }}>
                          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.75 }}>{c.details}</p>
                        </div>
                      )}
                      {/* Blur teaser for unpaid */}
                      {!paid && c.details && (
                        <div style={{ marginTop: 4, paddingLeft: 17, position: 'relative' }}>
                          <p className="blur-content" style={{ fontSize: 12, color: '#374151', lineHeight: 1.75 }}>
                            {c.details || 'Detailed analysis available in the full report. Unlock to see specific risks, distances, and recommended actions for this check.'}
                          </p>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", background: '#0A5C45', color: '#fff', padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                              🔒 Unlock full details
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* PAYWALL — if not paid */}
            {!paid && (
              <div style={{ background: 'linear-gradient(135deg, #0A5C45, #0F7A5A)', borderRadius: 16, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 4px 24px rgba(10,92,69,0.25)' }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: 6 }}>UNLOCK FULL REPORT</div>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 20, color: '#fff', fontWeight: 600, marginBottom: 8 }}>Get the complete verification report</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Your free preview shows the verdict and summary. The full report includes:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: '1.25rem' }}>
                  {[
                    '📋 Full details for all 6 checks',
                    '🛰️ Satellite imagery analysis',
                    '📍 Exact distances to gazette acquisitions',
                    '⚖️ Court case details if found',
                    '📄 Downloadable PDF certificate',
                    '✅ Share with your lawyer',
                  ].map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Email input */}
                {showEmailInput && (
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email for receipt"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontFamily: "'Syne',sans-serif", outline: 'none', marginBottom: 10 }}
                    onKeyDown={e => e.key === 'Enter' && initPaystack()}
                  />
                )}

                <button onClick={initPaystack} disabled={payLoading}
                  style={{ width: '100%', padding: '14px 0', background: '#fff', border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700, color: '#0A5C45', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {payLoading
                    ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A5C45" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}><path d="M12 2a10 10 0 0 1 10 10"/></svg> Processing...</>
                    : <>🔓 Unlock Full Report — ₦2,500</>
                  }
                </button>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8, fontFamily: "'JetBrains Mono',monospace" }}>
                  Secure payment via Paystack · Card, bank transfer, USSD
                </p>
              </div>
            )}

            {/* PAID: Download PDF */}
            {paid && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #E5E7EB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, background: '#ECFDF5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>PDF Certificate ready</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>Download and share with your property lawyer</div>
                </div>
                <button
                  onClick={() => generatePDF(checks, overall, lat!, lng!, satelliteUrl, streetViewUrl)}
                  style={{ padding: '9px 16px', background: '#0A5C45', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Download PDF
                </button>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
              <button onClick={() => router.push('/agent')} style={{ flex: 1, padding: '12px 0', background: '#0A5C45', border: 'none', borderRadius: 11, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                Ask the AI Agent →
              </button>
              <button onClick={() => router.push('/')} style={{ flex: 1, padding: '12px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 11, fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                New verification
              </button>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.7, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace" }}>
              Pre-screening only · Not legal advice · Always engage a licensed lawyer for final due diligence
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'Syne' }}>Loading...</div>}>
      <ReportContent />
    </Suspense>
  )
}
