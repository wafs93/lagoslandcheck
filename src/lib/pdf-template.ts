/**
 * Improved PDF template for LagosLandCheck verification reports.
 *
 * Changes from v1:
 * - Cover page: eliminated the massive empty space — content now fills the page
 * - Logo: shield mark (Option C) replaces the "L" text box
 * - Cover page: risk verdict block is larger and more prominent
 * - Cover page: subject parcel metadata shown directly on cover (no empty space)
 * - Page 2: tighter spacing, satellite image is larger
 * - Check matrix: real SVG icons replace ASCII glyphs (§ ~ ⚖ # !)
 * - Typography: tighter line heights throughout
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

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR', caution: 'CAUTION', critical: 'HIGH RISK',
}

const STATUS_COLOR: Record<string, string> = {
  clear: '#15803D', caution: '#B45309', critical: '#991B1B',
}

const STATUS_BG: Record<string, string> = {
  clear: '#DCFCE7', caution: '#FEF3C7', critical: '#FEE2E2',
}

// SVG icons for each check — minimal outlined style
const CHECK_ICONS: Record<string, string> = {
  satellite: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7L17 3M17 3L21 7M17 3V13"/><path d="M3 17L7 21M7 21L11 17M7 21V11"/><circle cx="12" cy="12" r="3"/></svg>`,
  gazette: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  flood: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 4 10 4 14a8 8 0 0 0 16 0C20 10 12 2 12 2z"/></svg>`,
  litigation: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L9 6"/><path d="M15 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L18 6"/><path d="M3 6h18"/></svg>`,
  luc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16v22l-3-2-2 2-2-2-2 2-2-2-3 2V2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`,
  fraud: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
}

// Shield logo SVG — Option C
const SHIELD_SVG = (color: string, fill: string) =>
  `<svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
    <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z" fill="${fill}" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M13 22 L19.5 29 L31 16" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

export function buildPdfHtml({ checks, overall, lat, lng, locationLabel, refNo }: PdfArgs): string {
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  const ref = refNo || `LLC-${Date.now().toString(36).toUpperCase()}`
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat) || 0
  const lngNum = typeof lng === 'number' ? lng : parseFloat(lng) || 0
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const satelliteUrl = latNum && lngNum && apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latNum},${lngNum}&zoom=20&size=720x420&maptype=hybrid&markers=color:red%7C${latNum},${lngNum}&key=${apiKey}`
    : ''

  const verdictMap = {
    CLEAR: { label: 'CLEARED', sub: 'No major issues detected across the six automated checks.', color: '#15803D', bg: '#DCFCE7', border: '#86EFAC' },
    CAUTION: { label: 'PROCEED WITH CAUTION', sub: 'Concerns detected. Do not transfer funds before legal verification is complete.', color: '#B45309', bg: '#FEF3C7', border: '#FCD34D' },
    CRITICAL: { label: 'DO NOT PROCEED', sub: 'Critical risk flags identified. Strongly advise against this transaction without full legal review.', color: '#991B1B', bg: '#FEE2E2', border: '#FCA5A5' },
  }
  const v = verdictMap[overall as keyof typeof verdictMap] || verdictMap.CAUTION

  const cautionCount = checks.filter(c => c.status === 'caution' || c.status === 'critical').length
  const clearCount = checks.filter(c => c.status === 'clear').length

  // Only show description if it's a real human-readable label, not just coordinates or a URL
  const isJustCoords = !locationLabel || locationLabel.startsWith('http') || /^\d+\.\d+/.test(locationLabel.trim())
  const locationDisplay = isJustCoords ? '' : locationLabel.slice(0, 60)

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
  .cover{
    height:100vh;min-height:1050px;
    background:#07382C;color:#fff;
    display:flex;flex-direction:column;
    page-break-after:always;
    position:relative;overflow:hidden
  }

  /* Gold accent stripe top */
  .cover::before{
    content:'';position:absolute;top:0;left:0;right:0;height:5px;
    background:linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 35%,transparent 35%,transparent 65%,#CFAF6E 65%)
  }

  /* Subtle grid texture */
  .cover::after{
    content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
    background-size:48px 48px;pointer-events:none
  }

  .cover-header{
    padding:28px 44px;
    display:flex;align-items:center;justify-content:space-between;
    border-bottom:1px solid rgba(255,255,255,.07);
    position:relative;z-index:1
  }

  .logo-row{display:flex;align-items:center;gap:12px}
  .logo-wordmark{font-weight:800;font-size:17pt;letter-spacing:-0.4px}
  .logo-sub{font-family:'JetBrains Mono',monospace;font-size:8pt;color:#CFAF6E;letter-spacing:2px;margin-top:2px}

  .meta-block{font-family:'JetBrains Mono',monospace;font-size:8.5pt;color:rgba(255,255,255,.5);text-align:right;line-height:2}
  .meta-ref{color:#CFAF6E;font-weight:600;font-size:10pt}

  /* Cover body — fills the space between header and footer */
  .cover-body{
    flex:1;display:flex;flex-direction:column;justify-content:space-between;
    padding:44px 44px 28px;
    position:relative;z-index:1
  }

  .doc-eyebrow{
    font-family:'JetBrains Mono',monospace;font-size:9pt;
    color:#CFAF6E;letter-spacing:3px;
    margin-bottom:20px;
    display:flex;align-items:center;gap:10px
  }
  .doc-eyebrow::before{content:'';display:inline-block;width:20px;height:1.5px;background:#CFAF6E;opacity:0.6}

  .doc-title{
    font-size:38pt;font-weight:800;line-height:1.05;
    letter-spacing:-2px;margin-bottom:12px;max-width:640px
  }
  .doc-title-accent{color:#CFAF6E;font-style:italic}

  .doc-sub{
    font-size:13pt;color:rgba(255,255,255,.55);
    font-weight:400;max-width:500px;line-height:1.6;
    margin-bottom:40px
  }

  /* Large verdict block */
  .verdict-hero{
    padding:28px 36px;
    background:${v.bg};
    border-radius:8px;
    border-left:5px solid ${v.color};
    margin-bottom:36px;
    max-width:600px
  }
  .verdict-eyebrow{
    font-family:'JetBrains Mono',monospace;font-size:8pt;
    color:${v.color};letter-spacing:2.5px;font-weight:600;
    margin-bottom:8px
  }
  .verdict-label{
    font-size:26pt;font-weight:800;color:${v.color};
    line-height:1;letter-spacing:-1px;margin-bottom:10px
  }
  .verdict-sub{font-size:11pt;color:${v.color};opacity:0.85;line-height:1.5}

  /* Stats row */
  .stats-row{
    display:flex;gap:0;margin-bottom:36px;
    border:1px solid rgba(255,255,255,.1);
    border-radius:8px;overflow:hidden;max-width:560px
  }
  .stat{
    flex:1;padding:16px 20px;
    border-right:1px solid rgba(255,255,255,.08)
  }
  .stat:last-child{border-right:none}
  .stat-n{font-size:24pt;font-weight:800;color:#CFAF6E;line-height:1;margin-bottom:4px}
  .stat-label{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.35);letter-spacing:1.5px}

  /* Subject parcel summary on cover */
  .cover-parcel{
    border-top:1px solid rgba(255,255,255,.08);
    padding-top:24px;
    display:flex;gap:40px;flex-wrap:wrap
  }
  .cp-item{display:flex;flex-direction:column;gap:4px}
  .cp-key{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.3);letter-spacing:1.5px}
  .cp-val{font-size:11pt;font-weight:600;color:rgba(255,255,255,.85)}

  .cover-footer{
    padding:22px 44px;
    border-top:1px solid rgba(255,255,255,.07);
    display:flex;justify-content:space-between;align-items:center;
    font-family:'JetBrains Mono',monospace;font-size:8pt;
    color:rgba(255,255,255,.3);
    position:relative;z-index:1
  }

  /* ─────────  CONTENT PAGES  ───────── */
  .page{padding:36px 44px;max-width:860px;margin:0 auto;page-break-after:always}
  .page:last-child{page-break-after:auto}

  .page-head{
    display:flex;align-items:center;justify-content:space-between;
    padding-bottom:12px;border-bottom:2px solid #07382C;margin-bottom:24px
  }
  .ph-brand{font-weight:800;font-size:12pt;color:#07382C;letter-spacing:-0.3px}
  .ph-sub{font-family:'JetBrains Mono',monospace;font-size:7pt;color:#6B7280;letter-spacing:1.5px;margin-top:1px}
  .ph-meta{font-family:'JetBrains Mono',monospace;font-size:8pt;color:#6B7280;text-align:right;line-height:1.7}
  .ph-meta strong{color:#1A2332;font-weight:600}

  .section-tag{
    font-family:'JetBrains Mono',monospace;font-size:8pt;color:#6B7280;
    letter-spacing:2px;font-weight:600;margin-bottom:12px;text-transform:uppercase;
    display:flex;align-items:center;gap:8px
  }
  .section-tag::before{content:'';width:14px;height:1.5px;background:#CFAF6E;display:inline-block}

  /* Satellite image */
  .sat-image{
    width:100%;border-radius:6px;overflow:hidden;
    margin-bottom:20px;border:1px solid #E5E7EB;
    position:relative
  }
  .sat-image img{width:100%;height:auto;display:block;max-height:300px;object-fit:cover}
  .sat-tag{
    position:absolute;top:8px;left:8px;
    background:rgba(0,0,0,0.7);color:#fff;
    font-family:'JetBrains Mono',monospace;font-size:7.5pt;
    padding:4px 9px;border-radius:4px;letter-spacing:0.5px
  }

  /* Subject card */
  .subject-grid{
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:0;border:1px solid #E5E7EB;border-radius:8px;
    overflow:hidden;margin-bottom:20px
  }
  .subject-cell{
    padding:12px 16px;border-right:1px solid #E5E7EB;background:#FAFBFC
  }
  .subject-cell:last-child{border-right:none}
  .sc-key{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#9CA3AF;letter-spacing:1px;margin-bottom:4px}
  .sc-val{font-size:10pt;color:#1A2332;font-weight:600;line-height:1.3}

  /* Verdict bar on page 2 */
  .verdict-bar{
    display:flex;align-items:center;gap:16px;
    padding:16px 20px;
    background:${v.bg};border-radius:6px;
    border-left:4px solid ${v.color};margin-bottom:20px
  }
  .vb-label{font-size:16pt;font-weight:800;color:${v.color};letter-spacing:-0.5px;line-height:1.1}
  .vb-sub{font-size:9.5pt;color:${v.color};opacity:0.85;margin-top:3px}
  .vb-meter{display:flex;gap:4px;margin-left:auto;width:80px}
  .vb-seg{flex:1;height:5px;border-radius:3px}

  /* Legal alert */
  .alert{
    padding:14px 18px;background:#FEF3C7;border:1px solid #FCD34D;
    border-radius:6px;margin-bottom:20px;
    display:flex;gap:12px;align-items:flex-start
  }
  .alert-icon{font-size:16pt;flex-shrink:0;line-height:1}
  .alert-body{flex:1;font-size:9.5pt;color:#78350F;line-height:1.55}
  .alert-body strong{color:#7C2D12;display:block;font-size:10pt;margin-bottom:3px}

  /* Summary */
  .summary-block{
    padding:16px 20px;background:#F7F8FA;
    border-left:3px solid #07382C;border-radius:0 6px 6px 0;
    margin-bottom:20px
  }
  .summary-text{font-size:10pt;color:#1A2332;line-height:1.75}
  .summary-text strong{color:#07382C;font-weight:700}

  /* Verification matrix */
  .matrix{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
  .mcard{border:1px solid #E5E7EB;border-radius:6px;padding:14px 16px;background:#fff;page-break-inside:avoid}
  .mcard-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .mcard-icon{
    width:32px;height:32px;border-radius:6px;
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0
  }
  .mcard-name{flex:1;font-size:10.5pt;font-weight:700;color:#1A2332}
  .mcard-pill{
    font-family:'JetBrains Mono',monospace;font-size:7pt;
    font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:1px
  }
  .mcard-summary{font-size:9pt;color:#5C6B7A;line-height:1.55;margin-bottom:6px}
  .mcard-detail{font-size:8.5pt;color:#1A2332;line-height:1.65;padding-top:8px;border-top:1px dashed #E5E7EB}

  .matrix-foot{
    font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#9CA3AF;
    text-align:center;margin-top:12px;padding-top:10px;
    border-top:1px dashed #E5E7EB;letter-spacing:0.5px
  }

  /* Actions */
  .action{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #F1F3F5}
  .action:last-child{border:none}
  .action-num{
    font-family:'JetBrains Mono',monospace;font-size:9pt;font-weight:700;
    color:#fff;background:#07382C;width:24px;height:24px;
    border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0
  }
  .action-title{font-size:10pt;font-weight:700;color:#1A2332;margin-bottom:2px}
  .action-desc{font-size:9pt;color:#5C6B7A;line-height:1.55}

  /* Auth strip */
  .auth-strip{
    background:#07382C;color:#fff;padding:14px 20px;
    border-radius:6px;margin-bottom:20px;
    display:flex;align-items:center;justify-content:space-between;gap:20px
  }
  .auth-label{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.4);letter-spacing:2px;margin-bottom:4px}
  .auth-val{font-family:'JetBrains Mono',monospace;font-size:12pt;font-weight:600;color:#CFAF6E;letter-spacing:1px}
  .auth-verify{font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,.5);text-align:right}
  .auth-verify strong{color:#fff;display:block;margin-bottom:2px}

  /* Disclaimer */
  .disclaimer{
    padding:14px 16px;border:1px solid #E5E7EB;
    border-radius:6px;background:#F7F8FA;margin-bottom:16px
  }
  .disc-tag{font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#1A2332;letter-spacing:1.5px;font-weight:600;margin-bottom:6px}
  .disc-text{font-size:8.5pt;color:#5C6B7A;line-height:1.65}

  .doc-foot{
    padding-top:16px;border-top:1px solid #E5E7EB;
    display:flex;justify-content:space-between;align-items:center;
    font-family:'JetBrains Mono',monospace;font-size:8pt;color:#9CA3AF
  }
  .doc-foot strong{color:#07382C;font-weight:700}

  @media print{
    @page{margin:0;size:A4}
    .cover,.page{page-break-after:always}
    .mcard{page-break-inside:avoid}
  }
</style>
</head>
<body>

<!-- ═══ PAGE 1 — COVER (dense, no empty space) ═══ -->
<section class="cover">
  <!-- Header -->
  <div class="cover-header">
    <div class="logo-row">
      <!-- Shield logo mark -->
      ${SHIELD_SVG('#CFAF6E', 'rgba(207,175,110,0.12)')}
      <div>
        <div class="logo-wordmark">LagosLandCheck</div>
        <div class="logo-sub">VERIFICATION INTELLIGENCE</div>
      </div>
    </div>
    <div class="meta-block">
      <div class="meta-ref">${ref}</div>
      <div>${date}</div>
      <div>${time} WAT</div>
    </div>
  </div>

  <!-- Body — fills the page properly -->
  <div class="cover-body">
    <div class="doc-eyebrow">CONFIDENTIAL · LAND VERIFICATION DOSSIER</div>

    <h1 class="doc-title">
      Land<br>
      <span class="doc-title-accent">Verification</span><br>
      Intelligence Report
    </h1>

    <p class="doc-sub">
      Six-point automated screening using satellite imagery, public registries, and AI analysis. Prepared for pre-purchase due diligence.
    </p>

    <!-- Large verdict block -->
    <div class="verdict-hero">
      <div class="verdict-eyebrow">RISK VERDICT</div>
      <div class="verdict-label">${v.label}</div>
      <div class="verdict-sub">${v.sub}</div>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat">
        <div class="stat-n">6</div>
        <div class="stat-label">CHECKS RUN</div>
      </div>
      <div class="stat">
        <div class="stat-n" style="color:${clearCount > 0 ? '#4ADE80' : '#CFAF6E'}">${clearCount}</div>
        <div class="stat-label">CLEARED</div>
      </div>
      <div class="stat">
        <div class="stat-n" style="color:${cautionCount > 0 ? '#FB923C' : '#4ADE80'}">${cautionCount}</div>
        <div class="stat-label">FLAGGED</div>
      </div>
      <div class="stat">
        <div class="stat-n">₦2,500</div>
        <div class="stat-label">REPORT COST</div>
      </div>
    </div>

    <!-- Parcel on cover -->
    <div class="cover-parcel">
      <div class="cp-item">
        <div class="cp-key">COORDINATES</div>
        <div class="cp-val">${latNum.toFixed(4)}°N, ${lngNum.toFixed(4)}°E</div>
      </div>
      ${locationDisplay ? `<div class="cp-item">
        <div class="cp-key">DESCRIPTION</div>
        <div class="cp-val" style="max-width:260px;word-break:break-word">${escapeHtml(locationDisplay)}</div>
      </div>` : ''}
      <div class="cp-item">
        <div class="cp-key">REFERENCE</div>
        <div class="cp-val">${ref}</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="cover-footer">
    <div>lagoslandcheck.com · Pre-screening intelligence · Not legal advice</div>
    <div>${ref} · ${date}</div>
  </div>
</section>

<!-- ═══ PAGE 2 — EXECUTIVE ═══ -->
<section class="page">
  <div class="page-head">
    <div>
      <div class="ph-brand">LagosLandCheck</div>
      <div class="ph-sub">VERIFICATION INTELLIGENCE</div>
    </div>
    <div class="ph-meta">
      <strong>Ref ${ref}</strong><br>${date} · ${time}
    </div>
  </div>

  <div class="section-tag">SUBJECT PARCEL</div>
  <div class="subject-grid">
    <div class="subject-cell">
      <div class="sc-key">COORDINATES</div>
      <div class="sc-val">${latNum.toFixed(5)}°N<br>${lngNum.toFixed(5)}°E</div>
    </div>
    <div class="subject-cell">
      <div class="sc-key">IMAGERY SOURCE</div>
      <div class="sc-val">Google Hybrid<br>Zoom 20</div>
    </div>
    <div class="subject-cell">
      <div class="sc-key">GENERATED</div>
      <div class="sc-val">${date}<br>${time} WAT</div>
    </div>
  </div>

  <!-- Satellite image — larger than before -->
  ${satelliteUrl ? `
  <div class="sat-image">
    <img src="${satelliteUrl}" alt="Satellite imagery">
    <div class="sat-tag">SAT · HYBRID · Z20 · ${latNum.toFixed(4)}°N ${lngNum.toFixed(4)}°E</div>
  </div>` : ''}

  <div class="section-tag">RISK VERDICT</div>
  <div class="verdict-bar">
    <div style="flex:1">
      <div class="vb-label">${v.label}</div>
      <div class="vb-sub">${v.sub}</div>
    </div>
    <div class="vb-meter">
      <div class="vb-seg" style="background:${overall === 'CLEAR' ? '#15803D' : '#E5E7EB'}"></div>
      <div class="vb-seg" style="background:${overall === 'CAUTION' ? '#B45309' : '#E5E7EB'}"></div>
      <div class="vb-seg" style="background:${overall === 'CRITICAL' ? '#991B1B' : '#E5E7EB'}"></div>
    </div>
  </div>

  ${overall !== 'CLEAR' ? `
  <div class="alert">
    <div class="alert-icon">⚠</div>
    <div class="alert-body">
      <strong>LEGAL ADVISORY</strong>
      Do not transfer funds, sign a sale agreement, or pay survey fees on this parcel before a licensed Lagos property lawyer has completed a full Land Registry title search and reviewed the findings in this report.
    </div>
  </div>` : ''}

  <div class="section-tag">ANALYST SUMMARY</div>
  <div class="summary-block">
    <div class="summary-text">
      ${overall === 'CLEAR'
        ? `Our six automated checks returned no major flags for this coordinate. No gazette acquisitions, court records, fraud zone alerts, or flood-risk classifications matched. The satellite analysis is consistent with stated land use.<br><br>This pre-screening result is encouraging but does not replace a physical Land Registry search. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.`
        : overall === 'CAUTION'
          ? `One or more automated checks have returned cautionary findings on this parcel. This may indicate proximity to a gazette acquisition corridor, a Land Use Charge gap, prior litigation in the area, or known community disputes.<br><br><strong>Do not transfer funds before consulting a licensed Lagos property lawyer.</strong> Use the findings in this report as a starting point for deeper due diligence.`
          : `This parcel has triggered critical risk flags during automated screening. Proceeding without full legal investigation could result in total loss of investment.<br><br><strong>Do not proceed without engaging a licensed Lagos property lawyer immediately.</strong>`
      }
    </div>
  </div>

  <div class="doc-foot">
    <div><strong>LagosLandCheck</strong> · lagoslandcheck.com</div>
    <div>Page 2 / 3 · ${ref}</div>
  </div>
</section>

<!-- ═══ PAGE 3 — VERIFICATION MATRIX ═══ -->
<section class="page">
  <div class="page-head">
    <div>
      <div class="ph-brand">LagosLandCheck</div>
      <div class="ph-sub">VERIFICATION INTELLIGENCE</div>
    </div>
    <div class="ph-meta">
      <strong>Ref ${ref}</strong><br>${date} · ${time}
    </div>
  </div>

  <div class="section-tag">SIX-POINT VERIFICATION MATRIX</div>
  <div class="matrix">
    ${checks.map(c => {
      const status = (c.status || 'caution').toLowerCase()
      const color = STATUS_COLOR[status] || '#5C6B7A'
      const bg = STATUS_BG[status] || '#F1F3F5'
      const label = STATUS_LABEL[status] || status.toUpperCase()
      const icon = CHECK_ICONS[c.id] || CHECK_ICONS.gazette

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

  <div class="matrix-foot">
    CHECKS EXECUTED: 6 / 6 · SUPABASE POSTGIS + GPT-4O VISION · ${date} ${time} WAT
  </div>

  <div class="section-tag" style="margin-top:24px">RECOMMENDED ACTIONS</div>
  <div style="margin-bottom:20px">
    ${[
      ['Engage a licensed Lagos property lawyer', 'Provide a copy of this report and instruct a full Land Registry title search at the Lagos State Land Registry, Alausa.'],
      ['Verify the original Certificate of Occupancy', 'Never accept photocopies alone. Confirm the C of O file number directly at the Land Registry.'],
      ['Confirm Land Use Charge status', 'Verify LUC payment history since 2018 at landusecharge.lagosstate.gov.ng or via your solicitor.'],
      ['Commission a SURCON-registered surveyor', 'On-site verification of beacon numbers against OSGOF records and the seller\'s survey plan.'],
    ].map(([title, desc], i) => `
    <div class="action">
      <div class="action-num">${i+1}</div>
      <div>
        <div class="action-title">${title}</div>
        <div class="action-desc">${desc}</div>
      </div>
    </div>`).join('')}
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
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
