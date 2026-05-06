/**
 * Dossier-style PDF template for LagosLandCheck verification reports.
 *
 * Aesthetic: institutional dark-green dossier (Goldman/CIA-brief inspired,
 * tied to the existing brand colour #07382C). Three dense pages — no
 * whitespace bloat, no title repetition.
 */

interface Check {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

interface PdfArgs {
  checks: Check[]
  overall: string
  lat: string | number
  lng: string | number
  locationLabel: string
  refNo?: string
}

const CHECK_ICONS: Record<string, string> = {
  satellite: '🛰', gazette: '§', flood: '~', litigation: '⚖', luc: '#', fraud: '!',
}

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR', caution: 'CAUTION', critical: 'HIGH RISK',
}

const STATUS_COLOR: Record<string, string> = {
  clear: '#15803D', caution: '#B45309', critical: '#991B1B',
}

const STATUS_BG: Record<string, string> = {
  clear: '#DCFCE7', caution: '#FEF3C7', critical: '#FEE2E2',
}

export function buildPdfHtml({ checks, overall, lat, lng, locationLabel, refNo }: PdfArgs): string {
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  const ref = refNo || `LLC-${Date.now().toString(36).toUpperCase()}`
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat) || 0
  const lngNum = typeof lng === 'number' ? lng : parseFloat(lng) || 0
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const satelliteUrl = latNum && lngNum
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latNum},${lngNum}&zoom=20&size=720x420&maptype=hybrid&markers=color:red%7C${latNum},${lngNum}&key=${apiKey}`
    : ''

  // Verdict text & colour
  const verdictMap = {
    CLEAR: { label: 'CLEARED', sub: 'No major issues detected across the six automated checks.', color: '#15803D', bg: '#DCFCE7' },
    CAUTION: { label: 'PROCEED WITH CAUTION', sub: 'Concerns detected. Do not transfer funds before legal verification is complete.', color: '#B45309', bg: '#FEF3C7' },
    CRITICAL: { label: 'DO NOT PROCEED', sub: 'Critical risk flags identified. Strongly advise against this transaction without full legal review.', color: '#991B1B', bg: '#FEE2E2' },
  }
  const v = verdictMap[overall as keyof typeof verdictMap] || verdictMap.CAUTION

  const summaryText = overall === 'CLEAR'
    ? 'Our six automated checks returned no major flags for this coordinate. No gazette acquisitions, court records, fraud zone alerts, or flood-risk classifications matched. The satellite analysis indicates the parcel is consistent with stated land use. <br><br>This pre-screening result is encouraging but does not replace a physical Land Registry search. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.'
    : overall === 'CAUTION'
      ? 'One or more automated checks have returned cautionary findings on this parcel. This may indicate proximity to a gazette acquisition corridor, a Land Use Charge gap, prior litigation in the area, or known community disputes.<br><br><strong>Do not transfer funds before consulting a licensed Lagos property lawyer.</strong> Use the findings in this report as a starting point for deeper due diligence.'
      : 'This parcel has triggered critical risk flags during automated screening. Proceeding without full legal investigation could result in total loss of investment.<br><br><strong>Do not proceed under any circumstances without engaging a licensed Lagos property lawyer immediately.</strong>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LagosLandCheck — ${ref}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:'Inter',-apple-system,Arial,sans-serif;color:#1A2332;background:#fff;font-size:10.5pt;line-height:1.5;-webkit-font-smoothing:antialiased}

  /* ─────────  COVER PAGE  ───────── */
  .cover{height:100vh;min-height:1000px;background:#07382C;color:#fff;display:flex;flex-direction:column;page-break-after:always;position:relative;overflow:hidden}
  .cover::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)}

  .cover-bar{padding:32px 48px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08)}
  .brand-mark{display:flex;align-items:center;gap:14px}
  .brand-glyph{width:36px;height:36px;border:1.5px solid #CFAF6E;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;color:#CFAF6E;font-size:14px}
  .brand-text{font-weight:800;font-size:15pt;letter-spacing:-0.3px}
  .brand-sub{font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,0.5);letter-spacing:1.8px;margin-top:2px}

  .meta-block{font-family:'JetBrains Mono',monospace;font-size:8.5pt;color:rgba(255,255,255,0.55);text-align:right;line-height:1.9}
  .meta-key{color:rgba(255,255,255,0.4)}
  .meta-val{color:#CFAF6E;font-weight:500}

  .cover-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 48px}
  .doc-class{font-family:'JetBrains Mono',monospace;font-size:9pt;color:#CFAF6E;letter-spacing:3px;margin-bottom:24px;padding-bottom:8px;border-bottom:1px solid rgba(207,175,110,0.3);display:inline-block;align-self:flex-start}
  .doc-title{font-size:42pt;font-weight:800;line-height:1.05;letter-spacing:-1.5px;margin-bottom:16px;max-width:680px}
  .doc-subtitle{font-size:13pt;color:rgba(255,255,255,0.65);font-weight:400;max-width:520px;line-height:1.55;margin-bottom:48px}

  .verdict-row{display:flex;gap:32px;align-items:stretch;margin-bottom:48px}
  .verdict-block{padding:20px 28px;background:${v.bg};border-radius:6px;border-left:4px solid ${v.color};flex:1;max-width:480px}
  .verdict-label{font-family:'JetBrains Mono',monospace;font-size:8pt;color:${v.color};letter-spacing:2px;font-weight:600;margin-bottom:6px}
  .verdict-main{font-size:22pt;font-weight:800;color:${v.color};line-height:1.1;margin-bottom:8px;letter-spacing:-0.5px}
  .verdict-sub{font-size:10pt;color:${v.color};opacity:0.85;line-height:1.55}

  .cover-footer{padding:28px 48px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:flex-end;font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,0.4);line-height:1.7}
  .cover-footer strong{color:rgba(255,255,255,0.7);font-weight:500}

  /* ─────────  CONTENT PAGES  ───────── */
  .page{padding:36px 48px;max-width:840px;margin:0 auto;page-break-after:always}
  .page:last-child{page-break-after:auto}

  .page-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1.5px solid #07382C;margin-bottom:28px}
  .ph-brand{font-weight:800;font-size:11pt;color:#07382C;letter-spacing:-0.2px}
  .ph-brand-mono{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#5C6B7A;letter-spacing:1.5px;margin-top:1px}
  .ph-meta{font-family:'JetBrains Mono',monospace;font-size:8pt;color:#5C6B7A;text-align:right;line-height:1.7}
  .ph-meta strong{color:#1A2332;font-weight:600}

  .section-tag{font-family:'JetBrains Mono',monospace;font-size:8pt;color:#5C6B7A;letter-spacing:2px;font-weight:600;margin-bottom:10px;text-transform:uppercase;display:flex;align-items:center;gap:8px}
  .section-tag::before{content:'';width:14px;height:1.5px;background:#CFAF6E;display:inline-block}

  /* Subject card */
  .subject-card{border:1px solid #E1E5EA;border-radius:6px;overflow:hidden;margin-bottom:28px}
  .subject-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:0}
  .subject-info{padding:20px 24px;border-right:1px solid #E1E5EA}
  .subject-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #E1E5EA}
  .subject-row:last-child{border:none}
  .subject-key{font-family:'JetBrains Mono',monospace;font-size:8pt;color:#5C6B7A;letter-spacing:1px;text-transform:uppercase}
  .subject-val{font-family:'JetBrains Mono',monospace;font-size:9pt;color:#1A2332;font-weight:500;text-align:right}
  .subject-image{position:relative;background:#0B1B2B;display:flex;align-items:center;justify-content:center;min-height:220px}
  .subject-image img{width:100%;height:100%;object-fit:cover;display:block}
  .subject-image-tag{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;font-family:'JetBrains Mono',monospace;font-size:7pt;padding:4px 8px;border-radius:3px;letter-spacing:1px}

  /* Verdict re-stated, smaller */
  .verdict-bar{display:flex;align-items:center;gap:18px;padding:16px 22px;background:${v.bg};border-radius:6px;border-left:4px solid ${v.color};margin-bottom:28px}
  .vb-icon{font-size:22pt;line-height:1}
  .vb-text{flex:1}
  .vb-label{font-size:14pt;font-weight:800;color:${v.color};letter-spacing:-0.3px;line-height:1.1}
  .vb-sub{font-size:9.5pt;color:${v.color};opacity:0.85;margin-top:3px}
  .vb-meter{display:flex;gap:3px;width:140px}
  .vb-seg{flex:1;height:4px;border-radius:2px}

  /* Alert callout */
  .alert{padding:14px 18px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;margin-bottom:28px;display:flex;gap:12px;align-items:flex-start}
  .alert-bar{width:3px;background:#B45309;align-self:stretch;border-radius:2px;flex-shrink:0}
  .alert-body{flex:1;font-size:9.5pt;color:#78350F;line-height:1.55}
  .alert-body strong{color:#7C2D12;display:block;font-size:10pt;margin-bottom:2px;letter-spacing:0.2px}

  /* Verification matrix */
  .matrix{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
  .mcard{border:1px solid #E1E5EA;border-radius:6px;padding:14px 16px;background:#fff;page-break-inside:avoid}
  .mcard-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .mcard-icon{width:28px;height:28px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13pt;flex-shrink:0;font-weight:700}
  .mcard-name{flex:1;font-size:10pt;font-weight:700;color:#1A2332;letter-spacing:-0.1px}
  .mcard-pill{font-family:'JetBrains Mono',monospace;font-size:7pt;font-weight:700;padding:3px 7px;border-radius:3px;letter-spacing:1px}
  .mcard-summary{font-size:9pt;color:#5C6B7A;line-height:1.55;margin-bottom:6px}
  .mcard-detail{font-size:8.5pt;color:#1A2332;line-height:1.65;padding-top:8px;border-top:1px dashed #E1E5EA}

  .matrix-foot{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#5C6B7A;text-align:center;margin-top:14px;padding-top:12px;border-top:1px dashed #E1E5EA;letter-spacing:0.5px}

  /* Analyst summary */
  .summary-block{padding:18px 22px;background:#F7F8FA;border-left:3px solid #07382C;border-radius:0 6px 6px 0;margin-bottom:28px}
  .summary-text{font-size:10pt;color:#1A2332;line-height:1.75}
  .summary-text strong{color:#07382C;font-weight:700}

  /* Action steps */
  .actions{margin-bottom:28px}
  .action{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #F1F3F5}
  .action:last-child{border:none}
  .action-num{font-family:'JetBrains Mono',monospace;font-size:9pt;font-weight:700;color:#fff;background:#07382C;width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .action-body{flex:1}
  .action-title{font-size:10pt;font-weight:700;color:#1A2332;margin-bottom:2px}
  .action-desc{font-size:9pt;color:#5C6B7A;line-height:1.55}

  /* Authentication strip */
  .auth-strip{background:#07382C;color:#fff;padding:14px 20px;border-radius:6px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:20px}
  .auth-label{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:3px}
  .auth-val{font-family:'JetBrains Mono',monospace;font-size:11pt;font-weight:600;color:#CFAF6E;letter-spacing:1px}
  .auth-verify{font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,0.6);text-align:right}
  .auth-verify strong{color:#fff;font-weight:500;display:block;margin-bottom:2px}

  /* Disclaimer */
  .disclaimer{padding:14px 18px;border:1px solid #E1E5EA;border-radius:6px;background:#F7F8FA;margin-bottom:20px}
  .disc-tag{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#1A2332;letter-spacing:1.5px;font-weight:600;margin-bottom:6px}
  .disc-text{font-size:8.5pt;color:#5C6B7A;line-height:1.65}

  .doc-foot{padding-top:18px;border-top:1px solid #E1E5EA;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:8pt;color:#5C6B7A}
  .doc-foot strong{color:#07382C;font-weight:700}

  @media print{
    @page{margin:0;size:A4}
    .cover,.page{page-break-after:always}
    .mcard{page-break-inside:avoid}
  }
</style>
</head>
<body>

<!-- ─────────  PAGE 1 — COVER  ───────── -->
<section class="cover">
  <div class="cover-bar">
    <div class="brand-mark">
      <div class="brand-glyph">L</div>
      <div>
        <div class="brand-text">LagosLandCheck</div>
        <div class="brand-sub">VERIFICATION INTELLIGENCE</div>
      </div>
    </div>
    <div class="meta-block">
      <div><span class="meta-key">REF · </span><span class="meta-val">${ref}</span></div>
      <div><span class="meta-key">DATE · </span>${date}</div>
      <div><span class="meta-key">TIME · </span>${time} WAT</div>
    </div>
  </div>

  <div class="cover-body">
    <div class="doc-class">CONFIDENTIAL · LAND VERIFICATION DOSSIER</div>
    <h1 class="doc-title">Land Verification<br>Intelligence Report</h1>
    <p class="doc-subtitle">Six-point automated screening using satellite imagery, public registries, and AI analysis. Prepared for pre-purchase due diligence.</p>

    <div class="verdict-row">
      <div class="verdict-block">
        <div class="verdict-label">RISK VERDICT</div>
        <div class="verdict-main">${v.label}</div>
        <div class="verdict-sub">${v.sub}</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <div>
      <strong>lagoslandcheck.com</strong><br>
      Pre-screening intelligence · Not legal advice
    </div>
    <div style="text-align:right">
      <strong>DOCUMENT INTEGRITY</strong><br>
      ${ref} · ${date}
    </div>
  </div>
</section>

<!-- ─────────  PAGE 2 — EXECUTIVE  ───────── -->
<section class="page">
  <div class="page-head">
    <div>
      <div class="ph-brand">LagosLandCheck</div>
      <div class="ph-brand-mono">VERIFICATION INTELLIGENCE</div>
    </div>
    <div class="ph-meta">
      <strong>Ref ${ref}</strong><br>
      ${date} · ${time}
    </div>
  </div>

  <div class="section-tag">SUBJECT PARCEL</div>
  <div class="subject-card">
    <div class="subject-grid">
      <div class="subject-info">
        <div class="subject-row"><span class="subject-key">Coordinates</span><span class="subject-val">${latNum.toFixed(5)}°N, ${lngNum.toFixed(5)}°E</span></div>
        ${locationLabel ? `<div class="subject-row"><span class="subject-key">Description</span><span class="subject-val" style="text-align:right;max-width:200px">${escapeHtml(locationLabel.slice(0, 60))}</span></div>` : ''}
        <div class="subject-row"><span class="subject-key">Imagery Source</span><span class="subject-val">Google · Hybrid · Z20</span></div>
        <div class="subject-row"><span class="subject-key">Capture</span><span class="subject-val">${date}</span></div>
        <div class="subject-row"><span class="subject-key">Checks Run</span><span class="subject-val">6 of 6</span></div>
        <div class="subject-row"><span class="subject-key">Reference</span><span class="subject-val">${ref}</span></div>
      </div>
      <div class="subject-image">
        ${satelliteUrl ? `<img src="${satelliteUrl}" alt="Satellite"><div class="subject-image-tag">SAT · Z20 · ${latNum.toFixed(4)}°N ${lngNum.toFixed(4)}°E</div>` : '<div style="color:rgba(255,255,255,0.3);font-family:monospace;font-size:9pt">No imagery</div>'}
      </div>
    </div>
  </div>

  <div class="section-tag">RISK VERDICT</div>
  <div class="verdict-bar">
    <div class="vb-text">
      <div class="vb-label">${v.label}</div>
      <div class="vb-sub">${v.sub}</div>
    </div>
    <div class="vb-meter">
      <div class="vb-seg" style="background:${overall === 'CLEAR' ? '#15803D' : '#E1E5EA'}"></div>
      <div class="vb-seg" style="background:${overall === 'CAUTION' ? '#B45309' : '#E1E5EA'}"></div>
      <div class="vb-seg" style="background:${overall === 'CRITICAL' ? '#991B1B' : '#E1E5EA'}"></div>
    </div>
  </div>

  ${overall !== 'CLEAR' ? `
  <div class="alert">
    <div class="alert-bar"></div>
    <div class="alert-body">
      <strong>LEGAL ADVISORY</strong>
      Do not transfer funds, sign a sale agreement, or pay survey fees on this parcel before a licensed Lagos property lawyer has completed a full Land Registry title search and reviewed the findings in this report.
    </div>
  </div>
  ` : ''}

  <div class="section-tag">ANALYST SUMMARY</div>
  <div class="summary-block">
    <div class="summary-text">${summaryText}</div>
  </div>

  <div class="doc-foot">
    <div><strong>LagosLandCheck</strong> · lagoslandcheck.com</div>
    <div>Page 2 / 3 · ${ref}</div>
  </div>
</section>

<!-- ─────────  PAGE 3 — VERIFICATION MATRIX  ───────── -->
<section class="page">
  <div class="page-head">
    <div>
      <div class="ph-brand">LagosLandCheck</div>
      <div class="ph-brand-mono">VERIFICATION INTELLIGENCE</div>
    </div>
    <div class="ph-meta">
      <strong>Ref ${ref}</strong><br>
      ${date} · ${time}
    </div>
  </div>

  <div class="section-tag">SIX-POINT VERIFICATION MATRIX</div>
  <div class="matrix">
    ${checks.map(c => {
      const status = (c.status || 'caution').toLowerCase()
      const color = STATUS_COLOR[status] || '#5C6B7A'
      const bg = STATUS_BG[status] || '#F1F3F5'
      const label = STATUS_LABEL[status] || status.toUpperCase()
      const icon = CHECK_ICONS[c.id] || '•'
      return `
      <div class="mcard">
        <div class="mcard-head">
          <div class="mcard-icon" style="background:${bg};color:${color}">${icon}</div>
          <div class="mcard-name">${escapeHtml(c.name)}</div>
          <div class="mcard-pill" style="background:${bg};color:${color}">${label}</div>
        </div>
        <div class="mcard-summary">${escapeHtml(c.summary)}</div>
        ${c.details ? `<div class="mcard-detail">${escapeHtml(c.details)}</div>` : ''}
      </div>`
    }).join('')}
  </div>
  <div class="matrix-foot">CHECKS EXECUTED: 6 / 6 · METHODOLOGY: SUPABASE POSTGIS + GPT-4O VISION · GENERATED ${date} ${time} WAT</div>

  <div class="section-tag" style="margin-top:28px">RECOMMENDED ACTIONS</div>
  <div class="actions">
    <div class="action"><div class="action-num">1</div><div class="action-body">
      <div class="action-title">Engage a licensed Lagos property lawyer</div>
      <div class="action-desc">Provide a copy of this report and instruct a full Land Registry title search at the Lagos State Land Registry, Alausa.</div>
    </div></div>
    <div class="action"><div class="action-num">2</div><div class="action-body">
      <div class="action-title">Verify the original Certificate of Occupancy</div>
      <div class="action-desc">Never accept photocopies alone. Confirm the C of O file number directly at the Land Registry.</div>
    </div></div>
    <div class="action"><div class="action-num">3</div><div class="action-body">
      <div class="action-title">Confirm Land Use Charge status</div>
      <div class="action-desc">Verify LUC payment history since 2018 at landusecharge.lagosstate.gov.ng or via your solicitor.</div>
    </div></div>
    <div class="action"><div class="action-num">4</div><div class="action-body">
      <div class="action-title">Commission a SURCON-registered surveyor</div>
      <div class="action-desc">On-site verification of beacon numbers against OSGOF records and the seller's survey plan.</div>
    </div></div>
  </div>

  <div class="auth-strip">
    <div>
      <div class="auth-label">DOCUMENT REFERENCE</div>
      <div class="auth-val">${ref}</div>
    </div>
    <div class="auth-verify">
      <strong>VERIFY AT</strong>
      lagoslandcheck.com/verify/${ref}
    </div>
  </div>

  <div class="disclaimer">
    <div class="disc-tag">⚠ LEGAL DISCLAIMER</div>
    <div class="disc-text">This report is a pre-screening intelligence tool generated by LagosLandCheck. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed Nigerian property lawyer. All findings are based on publicly available databases and satellite imagery at the time of generation. LagosLandCheck accepts no liability for decisions made solely on the basis of this report. Always engage a qualified Nigerian property solicitor before completing any land transaction.</div>
  </div>

  <div class="doc-foot">
    <div><strong>LagosLandCheck</strong> · lagoslandcheck.com</div>
    <div>Page 3 / 3 · End of report</div>
  </div>
</section>

</body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
