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

import { REPORT_PRICE_KOBO, ReportTier } from './payment-signature'
import { theme } from './theme'

export interface Check {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

export type ManualStatus = 'not_required' | 'pending' | 'completed'

interface PdfArgs {
  checks: Check[]
  overall: string
  lat: string | number
  lng: string | number
  locationLabel: string
  refNo?: string
  tier?: ReportTier
  manualStatus?: ManualStatus
  manualCourtFinding?: string
  manualLucFinding?: string
  manualCourtStatus?: string
  manualLucStatus?: string
  manualCompletedAt?: string | null
}

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR', caution: 'CAUTION', critical: 'HIGH RISK', locked: 'SEALED', pending: 'PENDING',
}

// Caution and critical intentionally share stamp red; only the label differs.
const STATUS_COLOR: Record<string, string> = {
  clear: theme.registryGreen, caution: theme.stampRed, critical: theme.stampRed, locked: theme.inkSoft, pending: theme.lagoonBlue,
}

function formatManualDate(value: string | null | undefined): string {
  if (!value) return 'recently'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'recently'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Applies the same tier-visibility rules as the on-screen report: litigation/LUC
// never show an automated CLEAR/CAUTION result — instant tier renders them as
// locked, verified tier sources them from the manual review pipeline.
export function applyTierVisibility(checks: Check[], args: Omit<PdfArgs, 'checks' | 'overall' | 'lat' | 'lng' | 'locationLabel'>): Check[] {
  const tier: ReportTier = args.tier === 'verified' ? 'verified' : 'instant'
  return checks.map(c => {
    const needsManualCheck = c.id === 'litigation' || c.id === 'luc'
    if (!needsManualCheck) return c

    if (tier === 'instant') {
      return {
        ...c,
        status: 'locked',
        summary: 'Included in the Verified Report — requires manual registry search.',
        details: '',
      }
    }

    if (args.manualStatus === 'completed') {
      const manualStatusValue = c.id === 'litigation' ? args.manualCourtStatus : args.manualLucStatus
      const finding = c.id === 'litigation'
        ? (args.manualCourtFinding || 'No court finding provided.')
        : (args.manualLucFinding || 'No LUC finding provided.')
      return {
        ...c,
        status: manualStatusValue || 'caution',
        summary: `Manually verified by LagosLandCheck on ${formatManualDate(args.manualCompletedAt)}.`,
        details: finding,
      }
    }

    return {
      ...c,
      status: 'pending',
      summary: 'Manual verification pending — results will be added within 24-48 hours.',
      details: '',
    }
  })
}

const AUTOMATED_CHECK_IDS = ['satellite', 'gazette', 'flood', 'fraud']

export type DisplayVerdictLevel = 'CLEAR' | 'CAUTION' | 'CRITICAL' | 'PARTIAL'
export type DisplayVerdictReason = 'instant-locked' | 'verified-pending' | null

export interface DisplayVerdict {
  level: DisplayVerdictLevel
  reason: DisplayVerdictReason
}

// The single source of truth for the top-level risk verdict shown across the
// on-screen report and the PDF. Litigation/LUC results must never surface
// through this verdict unless they're actually visible on the report the
// buyer paid for — an Instant Report's verdict is derived only from the 4
// unlocked automated checks; a Verified Report's verdict only counts
// litigation/LUC once manual review is completed (never the automated
// fallback while manual_status is still pending).
export function computeDisplayVerdict(
  checks: Check[],
  tier: ReportTier,
  manual?: { manualStatus?: ManualStatus; manualCourtStatus?: string; manualLucStatus?: string }
): DisplayVerdict {
  const automatedChecks = checks.filter(c => AUTOMATED_CHECK_IDS.includes(c.id))
  const automatedHasCritical = automatedChecks.some(c => c.status === 'critical')
  const automatedHasCaution = automatedChecks.some(c => c.status === 'caution')

  if (automatedHasCritical) return { level: 'CRITICAL', reason: null }
  if (automatedHasCaution) return { level: 'CAUTION', reason: null }

  if (tier === 'instant') {
    return { level: 'PARTIAL', reason: 'instant-locked' }
  }

  if (manual?.manualStatus !== 'completed') {
    return { level: 'PARTIAL', reason: 'verified-pending' }
  }

  const manualHasCritical = manual.manualCourtStatus === 'critical' || manual.manualLucStatus === 'critical'
  const manualHasCaution = manual.manualCourtStatus === 'caution' || manual.manualLucStatus === 'caution'

  if (manualHasCritical) return { level: 'CRITICAL', reason: null }
  if (manualHasCaution) return { level: 'CAUTION', reason: null }
  return { level: 'CLEAR', reason: null }
}

// Shield logo SVG — Option C
const SHIELD_SVG = (color: string, fill: string) =>
  `<svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
    <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z" fill="${fill}" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M13 22 L19.5 29 L31 16" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

export function buildPdfHtml(args: PdfArgs): string {
  const { lat, lng, locationLabel, refNo } = args
  const tier: ReportTier = args.tier === 'verified' ? 'verified' : 'instant'
  const checks = applyTierVisibility(args.checks, args)
  const reportCostNaira = REPORT_PRICE_KOBO[tier] / 100
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  const ref = refNo || `LLC-${Date.now().toString(36).toUpperCase()}`
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat) || 0
  const lngNum = typeof lng === 'number' ? lng : parseFloat(lng) || 0
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const satelliteUrl = latNum && lngNum && apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latNum},${lngNum}&zoom=20&size=720x420&maptype=hybrid&markers=color:red%7C${latNum},${lngNum}&key=${apiKey}`
    : ''

  const displayVerdict = computeDisplayVerdict(checks, tier, {
    manualStatus: args.manualStatus,
    manualCourtStatus: args.manualCourtStatus,
    manualLucStatus: args.manualLucStatus,
  })

  // Verdict is rendered as a bordered ink-stamp, not a colored banner — a single
  // color per level drives the stamp border/text, matching the on-screen report.
  const verdictMap = {
    CLEAR: { label: 'CLEAR', stamp: 'CLEARED', sub: 'No major issues detected across the six automated checks.', color: theme.registryGreen },
    CAUTION: { label: 'CAUTION', stamp: 'CAUTION', sub: 'Concerns detected. Do not transfer funds before legal verification is complete.', color: theme.stampRed },
    CRITICAL: { label: 'CRITICAL', stamp: 'CRITICAL', sub: 'Critical risk flags identified. Strongly advise against this transaction without full legal review.', color: theme.stampRed },
    PARTIAL: {
      label: 'PARTIAL', stamp: 'PARTIAL',
      sub: displayVerdict.reason === 'verified-pending'
        ? '4 of 6 checks clear. Manual court and Land Use Charge review is in progress — full verdict will be available once complete.'
        : '4 of 6 checks clear. Court litigation and Land Use Charge status require the Verified Report for a complete risk verdict.',
      color: theme.inkSoft,
    },
  }
  const v = verdictMap[displayVerdict.level]
  const verdictTitle = displayVerdict.level === 'CLEAR' ? 'Cleared'
    : displayVerdict.level === 'CAUTION' ? 'Proceed with Caution'
    : displayVerdict.level === 'CRITICAL' ? 'Do Not Proceed'
    : 'Partial Assessment'

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
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:'IBM Plex Sans',-apple-system,Arial,sans-serif;color:#171B14;background:#fff;font-size:10.5pt;line-height:1.5;-webkit-font-smoothing:antialiased}

  /* ─────────  COVER PAGE  ───────── */
  .cover{
    height:100vh;min-height:1050px;
    background:#0F2B22;color:#fff;
    display:flex;flex-direction:column;
    page-break-after:always;
    position:relative;overflow:hidden
  }

  /* Gold accent stripe top */
  .cover::before{
    content:'';position:absolute;top:0;left:0;right:0;height:5px;
    background:linear-gradient(90deg,#C7A65C 0%,#C7A65C 35%,transparent 35%,transparent 65%,#C7A65C 65%)
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
  .logo-wordmark{font-family:'Fraunces',serif;font-weight:600;font-size:17pt;letter-spacing:-0.4px}
  .logo-sub{font-family:'IBM Plex Mono',monospace;font-size:8pt;color:#C7A65C;letter-spacing:2px;margin-top:2px}

  .meta-block{font-family:'IBM Plex Mono',monospace;font-size:8.5pt;color:rgba(255,255,255,.5);text-align:right;line-height:2}
  .meta-ref{color:#C7A65C;font-weight:600;font-size:10pt}

  /* Cover body — fills the space between header and footer */
  .cover-body{
    flex:1;display:flex;flex-direction:column;justify-content:space-between;
    padding:44px 44px 28px;
    position:relative;z-index:1
  }

  .doc-eyebrow{
    font-family:'IBM Plex Mono',monospace;font-size:9pt;
    color:#C7A65C;letter-spacing:3px;
    margin-bottom:20px;
    display:flex;align-items:center;gap:10px
  }
  .doc-eyebrow::before{content:'';display:inline-block;width:20px;height:1.5px;background:#C7A65C;opacity:0.6}

  .doc-title{
    font-family:'Fraunces',serif;font-size:38pt;font-weight:600;line-height:1.05;
    letter-spacing:-1px;margin-bottom:12px;max-width:640px
  }
  .doc-title-accent{color:#C7A65C;font-style:italic}

  .doc-sub{
    font-size:13pt;color:rgba(255,255,255,.55);
    font-weight:400;max-width:500px;line-height:1.6;
    margin-bottom:40px
  }

  /* Large verdict block — bordered ink-stamp, not a colored banner */
  .verdict-hero{
    display:flex;align-items:center;gap:24px;
    padding:24px 32px;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.14);
    border-radius:4px;
    margin-bottom:36px;
    max-width:600px
  }
  .verdict-stamp{
    width:88px;height:88px;border-radius:50%;flex-shrink:0;
    border:3px solid ${v.color};color:${v.color};
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    transform:rotate(-8deg);
    font-family:'IBM Plex Mono',monospace;text-transform:uppercase
  }
  .verdict-stamp-llc{font-size:6.5pt;letter-spacing:2px;opacity:.75}
  .verdict-stamp-label{font-size:12pt;font-weight:700;letter-spacing:.5px;line-height:1.15;margin:2px 0}
  .verdict-stamp-verified{font-size:6pt;letter-spacing:1.5px;opacity:.6}
  .verdict-eyebrow{
    font-family:'IBM Plex Mono',monospace;font-size:8pt;
    color:#C7A65C;letter-spacing:2.5px;font-weight:600;
    margin-bottom:8px
  }
  .verdict-title{
    font-family:'Fraunces',serif;font-size:22pt;font-weight:600;color:#fff;
    line-height:1.15;letter-spacing:-0.3px;margin-bottom:8px
  }
  .verdict-sub{font-size:11pt;color:rgba(255,255,255,.7);line-height:1.5}

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
  .stat-n{font-size:24pt;font-weight:800;color:#C7A65C;line-height:1;margin-bottom:4px}
  .stat-label{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.35);letter-spacing:1.5px}

  /* Subject parcel summary on cover */
  .cover-parcel{
    border-top:1px solid rgba(255,255,255,.08);
    padding-top:24px;
    display:flex;gap:40px;flex-wrap:wrap
  }
  .cp-item{display:flex;flex-direction:column;gap:4px}
  .cp-key{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.3);letter-spacing:1.5px}
  .cp-val{font-size:11pt;font-weight:600;color:rgba(255,255,255,.85)}

  .cover-footer{
    padding:22px 44px;
    border-top:1px solid rgba(255,255,255,.07);
    display:flex;justify-content:space-between;align-items:center;
    font-family:'IBM Plex Mono',monospace;font-size:8pt;
    color:rgba(255,255,255,.3);
    position:relative;z-index:1
  }

  /* ─────────  CONTENT PAGES  ───────── */
  .page{padding:36px 44px;max-width:860px;margin:0 auto;page-break-after:always}
  .page:last-child{page-break-after:auto}

  .page-head{
    display:flex;align-items:center;justify-content:space-between;
    padding-bottom:12px;border-bottom:2px solid #0F2B22;margin-bottom:24px
  }
  .ph-brand{font-family:'Fraunces',serif;font-weight:600;font-size:12pt;color:#0F2B22;letter-spacing:-0.3px}
  .ph-sub{font-family:'IBM Plex Mono',monospace;font-size:7pt;color:#6B6A5E;letter-spacing:1.5px;margin-top:1px}
  .ph-meta{font-family:'IBM Plex Mono',monospace;font-size:8pt;color:#6B6A5E;text-align:right;line-height:1.7}
  .ph-meta strong{color:#171B14;font-weight:600}

  .section-tag{
    font-family:'IBM Plex Mono',monospace;font-size:8pt;color:#6B6A5E;
    letter-spacing:2px;font-weight:600;margin-bottom:12px;text-transform:uppercase;
    display:flex;align-items:center;gap:8px
  }
  .section-tag::before{content:'';width:14px;height:1.5px;background:#C7A65C;display:inline-block}

  /* Satellite image */
  .sat-image{
    width:100%;border-radius:6px;overflow:hidden;
    margin-bottom:20px;border:1px solid #DDD5C0;
    position:relative
  }
  .sat-image img{width:100%;height:auto;display:block;max-height:300px;object-fit:cover}
  .sat-tag{
    position:absolute;top:8px;left:8px;
    background:rgba(0,0,0,0.7);color:#fff;
    font-family:'IBM Plex Mono',monospace;font-size:7.5pt;
    padding:4px 9px;border-radius:4px;letter-spacing:0.5px
  }

  /* Subject card */
  .subject-grid{
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:0;border:1px solid #DDD5C0;border-radius:8px;
    overflow:hidden;margin-bottom:20px
  }
  .subject-cell{
    padding:12px 16px;border-right:1px solid #DDD5C0;background:#FAF7EE
  }
  .subject-cell:last-child{border-right:none}
  .sc-key{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:#6B6A5E;letter-spacing:1px;margin-bottom:4px}
  .sc-val{font-size:10pt;color:#171B14;font-weight:600;line-height:1.3}

  /* Verdict bar on page 2 — small ink-stamp, not a colored banner */
  .verdict-bar{
    display:flex;align-items:center;gap:18px;
    padding:18px 20px;
    background:#FAF7EE;border:1px solid #DDD5C0;border-radius:4px;margin-bottom:20px
  }
  .vb-stamp{
    width:56px;height:56px;border-radius:50%;flex-shrink:0;
    border:2.5px solid ${v.color};color:${v.color};
    display:flex;align-items:center;justify-content:center;
    transform:rotate(-8deg);
    font-family:'IBM Plex Mono',monospace;text-transform:uppercase;
    font-size:7pt;font-weight:700;letter-spacing:.5px;text-align:center
  }
  .vb-label{font-size:15pt;font-weight:600;font-family:'Fraunces',serif;color:#171B14;letter-spacing:-0.3px;line-height:1.15}
  .vb-sub{font-size:9.5pt;color:#6B6A5E;margin-top:3px}

  /* Legal alert */
  .alert{
    padding:14px 18px;background:#F6E2DC;border:1px solid #E0AA9B;
    border-radius:6px;margin-bottom:20px;
    display:flex;gap:12px;align-items:flex-start
  }
  .alert-icon{font-size:16pt;flex-shrink:0;line-height:1}
  .alert-body{flex:1;font-size:9.5pt;color:#78372B;line-height:1.55}
  .alert-body strong{color:#5C2A1F;display:block;font-size:10pt;margin-bottom:3px}

  /* Summary */
  .summary-block{
    padding:16px 20px;background:#FAF7EE;
    border-left:3px solid #0F2B22;border-radius:0 6px 6px 0;
    margin-bottom:20px
  }
  .summary-text{font-size:10pt;color:#171B14;line-height:1.75}
  .summary-text strong{color:#0F2B22;font-weight:700}

  /* Verification matrix — evidence-log entries */
  .matrix{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
  .mcard{border:1px solid #DDD5C0;border-radius:2px;padding:14px 16px;background:#fff;page-break-inside:avoid}
  .mcard-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .mcard-num{
    font-family:'IBM Plex Mono',monospace;font-size:10pt;font-weight:600;
    color:#6B6A5E;flex-shrink:0;width:20px
  }
  .mcard-name{flex:1;font-size:10.5pt;font-weight:700;color:#171B14}
  .mcard-pill{
    font-family:'IBM Plex Mono',monospace;font-size:7pt;
    font-weight:700;padding:3px 8px;border-radius:2px;letter-spacing:1px;
    border:1.5px solid;background:transparent;transform:rotate(-3deg);display:inline-block
  }
  .mcard-summary{font-size:9pt;color:#6B6A5E;line-height:1.55;margin-bottom:6px}
  .mcard-detail{font-size:8.5pt;color:#171B14;line-height:1.65;padding-top:8px;border-top:1px dashed #DDD5C0}

  .matrix-foot{
    font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:#6B6A5E;
    text-align:center;margin-top:12px;padding-top:10px;
    border-top:1px dashed #DDD5C0;letter-spacing:0.5px
  }

  /* Actions */
  .action{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #FAF7EE}
  .action:last-child{border:none}
  .action-num{
    font-family:'IBM Plex Mono',monospace;font-size:9pt;font-weight:700;
    color:#fff;background:#0F2B22;width:24px;height:24px;
    border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0
  }
  .action-title{font-size:10pt;font-weight:700;color:#171B14;margin-bottom:2px}
  .action-desc{font-size:9pt;color:#6B6A5E;line-height:1.55}

  /* Auth strip */
  .auth-strip{
    background:#0F2B22;color:#fff;padding:14px 20px;
    border-radius:6px;margin-bottom:20px;
    display:flex;align-items:center;justify-content:space-between;gap:20px
  }
  .auth-label{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:rgba(255,255,255,.4);letter-spacing:2px;margin-bottom:4px}
  .auth-val{font-family:'IBM Plex Mono',monospace;font-size:12pt;font-weight:600;color:#C7A65C;letter-spacing:1px}
  .auth-verify{font-family:'IBM Plex Mono',monospace;font-size:8pt;color:rgba(255,255,255,.5);text-align:right}
  .auth-verify strong{color:#fff;display:block;margin-bottom:2px}

  /* Disclaimer */
  .disclaimer{
    padding:14px 16px;border:1px solid #DDD5C0;
    border-radius:6px;background:#FAF7EE;margin-bottom:16px
  }
  .disc-tag{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;color:#171B14;letter-spacing:1.5px;font-weight:600;margin-bottom:6px}
  .disc-text{font-size:8.5pt;color:#6B6A5E;line-height:1.65}

  .doc-foot{
    padding-top:16px;border-top:1px solid #DDD5C0;
    display:flex;justify-content:space-between;align-items:center;
    font-family:'IBM Plex Mono',monospace;font-size:8pt;color:#6B6A5E
  }
  .doc-foot strong{color:#0F2B22;font-weight:700}

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
      ${SHIELD_SVG('#C7A65C', 'rgba(199,166,92,0.12)')}
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
      <div class="verdict-stamp">
        <div class="verdict-stamp-llc">LLC</div>
        <div class="verdict-stamp-label">${v.stamp}</div>
        <div class="verdict-stamp-verified">VERIFIED</div>
      </div>
      <div>
        <div class="verdict-eyebrow">RISK VERDICT</div>
        <div class="verdict-title">${verdictTitle}</div>
        <div class="verdict-sub">${v.sub}</div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat">
        <div class="stat-n">6</div>
        <div class="stat-label">CHECKS RUN</div>
      </div>
      <div class="stat">
        <div class="stat-n" style="color:${clearCount > 0 ? '#7FBE9C' : '#C7A65C'}">${clearCount}</div>
        <div class="stat-label">CLEARED</div>
      </div>
      <div class="stat">
        <div class="stat-n" style="color:${cautionCount > 0 ? '#E08A73' : '#7FBE9C'}">${cautionCount}</div>
        <div class="stat-label">FLAGGED</div>
      </div>
      <div class="stat">
        <div class="stat-n">₦${reportCostNaira.toLocaleString()}</div>
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
    <div class="vb-stamp">${v.stamp}</div>
    <div style="flex:1">
      <div class="vb-label">${verdictTitle}</div>
      <div class="vb-sub">${v.sub}</div>
    </div>
  </div>

  ${displayVerdict.level !== 'CLEAR' ? `
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
      ${displayVerdict.level === 'CLEAR'
        ? `Our six automated checks returned no major flags for this coordinate. No gazette acquisitions, court records, fraud zone alerts, or flood-risk classifications matched. The satellite analysis is consistent with stated land use.<br><br>This pre-screening result is encouraging but does not replace a physical Land Registry search. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.`
        : displayVerdict.level === 'CAUTION'
          ? `One or more automated checks have returned cautionary findings on this parcel. This may indicate proximity to a gazette acquisition corridor, a Land Use Charge gap, prior litigation in the area, or known community disputes.<br><br><strong>Do not transfer funds before consulting a licensed Lagos property lawyer.</strong> Use the findings in this report as a starting point for deeper due diligence.`
          : displayVerdict.level === 'CRITICAL'
            ? `This parcel has triggered critical risk flags during automated screening. Proceeding without full legal investigation could result in total loss of investment.<br><br><strong>Do not proceed without engaging a licensed Lagos property lawyer immediately.</strong>`
            : displayVerdict.reason === 'verified-pending'
              ? `The four automated checks in this report — satellite imagery, gazette and government acquisition, flood and drainage risk, and fraud zone alerts — returned no flags for this coordinate. Manual court litigation and Land Use Charge verification is still in progress and will be added to this report within 24-48 hours.<br><br>A complete risk verdict will be available once manual verification is complete. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.`
              : `The four automated checks included in this Instant Report — satellite imagery, gazette and government acquisition, flood and drainage risk, and fraud zone alerts — returned no flags for this coordinate. Court litigation search and Land Use Charge status are not included in this tier and require the Verified Report for a complete risk verdict.<br><br>This partial result is encouraging but is not a full assessment. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.`
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

  <div class="section-tag">EVIDENCE LOG · SIX-POINT VERIFICATION MATRIX</div>
  <div class="matrix">
    ${checks.map((c, i) => {
      const status = (c.status || 'caution').toLowerCase()
      const color = STATUS_COLOR[status] || theme.inkSoft
      const label = STATUS_LABEL[status] || status.toUpperCase()
      const num = String(i + 1).padStart(2, '0')

      return `
      <div class="mcard">
        <div class="mcard-head">
          <div class="mcard-num">${num}</div>
          <div class="mcard-name">${escapeHtml(c.name)}</div>
          <div class="mcard-pill" style="border-color:${color};color:${color}">${label}</div>
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
