'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Check {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

const verdictConfig = {
  CLEAR:    { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', label: '✅ All Clear',            sub: 'No major issues found. Continue with standard legal due diligence.' },
  CAUTION:  { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: '⚠️ Proceed with Caution', sub: 'Concerns detected. Do not pay any money before consulting a lawyer.' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', label: '🚫 Do Not Proceed',       sub: 'Critical flags found. Strongly advise against proceeding.' },
}

const statusConfig = {
  clear:    { color: '#22C55E', bg: '#ECFDF5', badge: '#D1FAE5', text: '#065F46', label: 'CLEAR' },
  caution:  { color: '#F59E0B', bg: '#FFFBEB', badge: '#FEF3C7', text: '#92400E', label: 'CAUTION' },
  critical: { color: '#EF4444', bg: '#FEF2F2', badge: '#FEE2E2', text: '#991B1B', label: 'CRITICAL' },
  queued:   { color: '#D1D5DB', bg: '#F9FAFB', badge: '#F3F4F6', text: '#6B7280', label: 'QUEUED' },
  running:  { color: '#60A5FA', bg: '#EFF6FF', badge: '#DBEAFE', text: '#1D4ED8', label: 'CHECKING' },
}

const PAYSTACK_KEY = 'pk_live_24d75de9079f18d337d6f0d8910e39ee4cd3415a'
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
const checkIcons: Record<string, string> = { satellite: '🛰️', gazette: '📜', flood: '🌊', litigation: '⚖️', luc: '🧾', fraud: '🚨' }

function generatePDF(checks: Check[], overall: string, lat: string, lng: string, locationLabel: string) {
  const vc = verdictConfig[overall as keyof typeof verdictConfig] || verdictConfig.CAUTION
  const date = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
  const latNum = parseFloat(lat) || 0
  const lngNum = parseFloat(lng) || 0

  const satelliteUrl = latNum && lngNum
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latNum},${lngNum}&zoom=20&size=640x400&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null

  const dotColor = (s: string) => ({ clear: '#22C55E', caution: '#F59E0B', critical: '#EF4444' }[s] || '#D1D5DB')
  const badgeBg  = (s: string) => ({ clear: '#D1FAE5', caution: '#FEF3C7', critical: '#FEE2E2' }[s] || '#F3F4F6')
  const badgeTxt = (s: string) => ({ clear: '#065F46', caution: '#92400E', critical: '#991B1B' }[s] || '#6B7280')
  const badgeLbl = (s: string) => ({ clear: 'CLEAR', caution: 'CAUTION', critical: 'HIGH RISK' }[s] || s.toUpperCase())

  const vdLabel = overall === 'CLEAR' ? '✅ ALL CLEAR' : overall === 'CAUTION' ? '⚠️ PROCEED WITH CAUTION' : '🚫 DO NOT PROCEED'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LagosLandCheck — ${refNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',Arial,sans-serif;color:#111827;background:#fff;font-size:13px}
  
  .cover{min-height:100vh;background:#07382C;display:flex;flex-direction:column;page-break-after:always}
  .cover-top{padding:32px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1)}
  .logo-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff}
  .logo-sub{font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,0.4);letter-spacing:1.5px}
  .cover-ref{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);text-align:right;line-height:1.8}
  .cover-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 40px}
  .cover-title{font-family:'Syne',sans-serif;font-size:44px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:12px;letter-spacing:-1px}
  .cover-title span{color:#CFAF6E}
  .cover-verdict{border-radius:16px;padding:20px 40px;margin:32px 0;display:inline-block;border:1px solid ${vc.border};background:${vc.bg}}
  .verdict-label{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:${vc.text}}
  .verdict-sub{font-size:13px;color:${vc.text};opacity:0.8;margin-top:6px}
  .cover-pills{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .pill{font-family:'JetBrains Mono',monospace;font-size:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);padding:6px 14px;border-radius:20px}
  .cover-foot{padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center}
  .foot-text{font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(255,255,255,0.3);line-height:1.8}
  
  .page{padding:40px;max-width:760px;margin:0 auto}
  .page-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:2px solid #0A5C45;margin-bottom:28px}
  .ph-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#0A5C45}
  .ph-ref{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:right;line-height:1.8}
  .label{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;letter-spacing:1.5px;margin-bottom:8px;text-transform:uppercase}
  
  .verdict-card{border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid ${vc.border};background:${vc.bg}}
  .vc-main{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:${vc.text};margin-bottom:4px}
  .vc-sub{font-size:12px;color:${vc.text};opacity:0.8;margin-bottom:12px}
  .risk-bar{display:flex;gap:4px;margin-bottom:4px}
  .risk-seg{flex:1;height:5px;border-radius:3px}
  .risk-labels{display:flex;justify-content:space-between;margin-bottom:12px}
  .risk-label{font-family:'JetBrains Mono',monospace;font-size:8px;color:${vc.text};opacity:0.5}
  .vc-tags{display:flex;gap:8px;flex-wrap:wrap}
  .vc-tag{font-family:'JetBrains Mono',monospace;font-size:9px;background:rgba(0,0,0,0.06);color:${vc.text};padding:3px 10px;border-radius:4px}
  
  .sat-img{width:100%;border-radius:10px;margin-bottom:6px;border:1px solid #E5E7EB;display:block}
  .sat-cap{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:center;margin-bottom:24px}
  
  .check-card{border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;margin-bottom:8px;page-break-inside:avoid}
  .check-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .check-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
  .check-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;color:#111827;flex:1}
  .check-badge{font-family:'JetBrains Mono',monospace;font-size:8px;padding:3px 9px;border-radius:4px;font-weight:700}
  .check-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .check-summary{font-size:12px;color:#6B7280;line-height:1.6;padding-left:42px;margin-bottom:6px}
  .check-details{font-size:11px;color:#374151;line-height:1.7;padding:10px 12px;background:#F9FAFB;border-radius:6px;margin-left:42px;border-left:3px solid #E5E7EB}
  
  .summary-box{background:#F8FAF9;border:1px solid #E5E7EB;border-radius:10px;padding:16px 18px;margin-bottom:24px}
  .summary-text{font-size:12px;color:#374151;line-height:1.8}
  
  .steps{margin-bottom:24px}
  .step{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:0.5px solid #F3F4F6}
  .step:last-child{border:none}
  .step-num{width:22px;height:22px;border-radius:50%;background:#0A5C45;color:#fff;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .step-body{font-size:12px;color:#374151;line-height:1.6}
  .step-body strong{color:#111827;display:block;margin-bottom:2px}
  
  .disclaimer{background:#FFF8F0;border:1px solid #FED7AA;border-radius:10px;padding:14px 16px;margin-bottom:24px}
  .disc-title{font-family:'JetBrains Mono',monospace;font-size:9px;color:#92400E;letter-spacing:1px;margin-bottom:6px;font-weight:600}
  .disc-text{font-size:10px;color:#92400E;line-height:1.75}
  
  .footer{border-top:1px solid #E5E7EB;padding-top:16px;display:flex;align-items:center;justify-content:space-between}
  .footer-brand{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:#0A5C45}
  .footer-meta{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9CA3AF;text-align:right;line-height:1.8}
  
  @media print{
    .cover{min-height:100vh}
    .page{padding:24px}
    @page{margin:8mm;size:A4}
    .check-card{page-break-inside:avoid}
  }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-top">
    <div>
      <div class="logo-name">LagosLandCheck</div>
      <div class="logo-sub">LAND VERIFICATION INTELLIGENCE</div>
    </div>
    <div class="cover-ref">
      <strong style="color:rgba(255,255,255,0.8);display:block">VERIFICATION CERTIFICATE</strong>
      Ref: ${refNo}<br>${date} · ${time}
    </div>
  </div>
  <div class="cover-hero">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:20px">AI-POWERED LAND PRE-SCREENING REPORT</div>
    <div class="cover-title">Lagos Land<br><span>Verification</span><br>Report</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:32px;max-width:400px;line-height:1.7">6 automated checks using satellite imagery, public databases, and AI analysis</div>
    <div class="cover-verdict">
      <div class="verdict-label">${vdLabel}</div>
      <div class="verdict-sub">${vc.sub}</div>
    </div>
    <div class="cover-pills">
      ${latNum && lngNum ? `<span class="pill">📍 ${latNum.toFixed(5)}°N, ${lngNum.toFixed(5)}°E</span>` : ''}
      <span class="pill">📅 ${date}</span>
      <span class="pill">⚡ 6 checks completed</span>
      <span class="pill">🔒 ${refNo}</span>
    </div>
  </div>
  <div class="cover-foot">
    <div class="foot-text">lagoslandcheck.com<br>Pre-screening only · Not legal advice<br>Always engage a licensed Lagos property lawyer</div>
  </div>
</div>

<!-- REPORT PAGE -->
<div class="page">
  <div class="page-header">
    <span class="ph-name">LagosLandCheck</span>
    <div class="ph-ref">Ref: ${refNo} · ${date}<br>lagoslandcheck.com</div>
  </div>

  <!-- Verdict -->
  <div class="label">OVERALL RISK ASSESSMENT</div>
  <div class="verdict-card">
    <div class="vc-main">${vdLabel}</div>
    <div class="vc-sub">${vc.sub}</div>
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
    <div class="vc-tags">
      <span class="vc-tag">📅 ${date} · ${time}</span>
      ${latNum && lngNum ? `<span class="vc-tag">📍 ${latNum.toFixed(5)}°N, ${lngNum.toFixed(5)}°E</span>` : ''}
      <span class="vc-tag">🔒 ${refNo}</span>
      ${locationLabel ? `<span class="vc-tag">📌 ${locationLabel.slice(0, 60)}</span>` : ''}
    </div>
  </div>

  <!-- Satellite -->
  ${satelliteUrl ? `
  <div class="label">SATELLITE IMAGERY · ZOOM 20 · HYBRID VIEW</div>
  <img src="${satelliteUrl}" class="sat-img" alt="Satellite view" />
  <div class="sat-cap">🛰️ AI-analysed satellite view · ${latNum.toFixed(5)}°N, ${lngNum.toFixed(5)}°E · Source: Google Maps Hybrid</div>
  ` : ''}

  <!-- 6 Checks -->
  <div class="label">6-POINT VERIFICATION RESULTS</div>
  ${checks.map(c => `
  <div class="check-card">
    <div class="check-header">
      <div class="check-icon" style="background:${badgeBg(c.status)}">${checkIcons[c.id] || '🔍'}</div>
      <span class="check-name">${c.name}</span>
      <span class="check-badge" style="background:${badgeBg(c.status)};color:${badgeTxt(c.status)}">${badgeLbl(c.status)}</span>
      <div class="check-dot" style="background:${dotColor(c.status)}"></div>
    </div>
    <div class="check-summary">${c.summary}</div>
    ${c.details ? `<div class="check-details">${c.details}</div>` : ''}
  </div>
  `).join('')}

  <!-- Summary -->
  <div class="label" style="margin-top:24px">PLAIN ENGLISH SUMMARY</div>
  <div class="summary-box">
    <div class="summary-text">
      ${overall === 'CLEAR'
        ? '<strong>This land appears clear of major issues.</strong> Our 6 automated checks found no gazette acquisitions, active court disputes, known fraud zone flags, or flood risk concerns at this coordinate. The satellite imagery confirms the land characteristics.<br><br>This pre-screening result is encouraging. However, this does not replace a full physical Land Registry search. Instruct a licensed Lagos property lawyer to conduct a formal title search before any payment.'
        : overall === 'CAUTION'
        ? '<strong>This land has raised concerns that require investigation before proceeding.</strong> One or more of our 6 checks returned a caution result. This may indicate proximity to a gazette acquisition corridor, a Land Use Charge gap, or an area with known community disputes.<br><br><strong>Do not pay any money before consulting a property lawyer.</strong> The findings in this report should be used as a starting point for deeper due diligence.'
        : '<strong>This land has critical flags indicating serious risk.</strong> Our checks have identified serious concerns that could result in total loss of investment if this transaction proceeds.<br><br><strong>Do not proceed under any circumstances without full legal investigation.</strong> Engage a licensed Lagos property lawyer immediately.'}
    </div>
  </div>

  <!-- Next Steps -->
  <div class="label">RECOMMENDED NEXT STEPS</div>
  <div class="steps">
    <div class="step"><div class="step-num">1</div><div class="step-body"><strong>Engage a Lagos property lawyer</strong>Show them this report and instruct a full Land Registry title search at Lagos State Land Registry, Alausa.</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-body"><strong>Request the original C of O</strong>Never accept photocopies alone. Verify the Certificate of Occupancy file number at the Land Registry.</div></div>
    <div class="step"><div class="step-num">3</div><div class="step-body"><strong>Check Land Use Charge status</strong>Visit landusecharge.lagosstate.gov.ng or instruct your lawyer to verify LUC payment history since 2018.</div></div>
    <div class="step"><div class="step-num">4</div><div class="step-body"><strong>Engage a licensed surveyor</strong>Instruct a SURCON-registered surveyor to verify beacon numbers on-site against OSGOF records.</div></div>
  </div>

  <!-- Disclaimer -->
  <div class="disclaimer">
    <div class="disc-title">⚠️ IMPORTANT LEGAL DISCLAIMER</div>
    <div class="disc-text">This report is a pre-screening intelligence tool generated by LagosLandCheck. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed Nigerian property lawyer. All findings are based on publicly available databases and satellite imagery at the time of generation. LagosLandCheck accepts no liability for decisions made solely on the basis of this report. Always engage a qualified Nigerian property solicitor before completing any land transaction.</div>
  </div>

  <div class="footer">
    <div class="footer-brand">LagosLandCheck · lagoslandcheck.com</div>
    <div class="footer-meta">${refNo} · ${date}<br>Pre-screening only · Not legal advice</div>
  </div>
</div>
</body></html>`

  const win = window.open('', '_blank')
  if (!win) { alert('Allow popups to download PDF. Check your browser popup blocker.'); return }
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => { try { win.focus(); win.print() } catch (e) { console.error(e) } }, 1500)
}

function ReportContent() {
  const params = useSearchParams()
  const rawLat = params.get('lat')
  const rawLng = params.get('lng')
  const paid = params.get('paid') === '1'

  // Try to get real coords - from URL or from sessionStorage
  const [lat, setLat] = useState<string>('')
  const [lng, setLng] = useState<string>('')
  const [locationLabel, setLocationLabel] = useState<string>('')
  const [checks, setChecks] = useState<Check[]>([])
  const [overall, setOverall] = useState<string>('CAUTION')
  const [loading, setLoading] = useState(true)
  const [paidState, setPaidState] = useState(paid)
  const [email, setEmail] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [imgZoom, setImgZoom] = useState(false)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  useEffect(() => {
    // Try sessionStorage first for full result
    const stored = sessionStorage.getItem('llc_result')
    if (stored) {
      try {
        const r = JSON.parse(stored)
        if (r.lat && r.lng && r.lat !== 0 && r.lng !== 0) {
          setLat(String(r.lat))
          setLng(String(r.lng))
          setLocationLabel(r.location_label || '')
          setChecks(r.checks || [])
          setOverall(r.overall || 'CAUTION')
          setLoading(false)
          return
        }
      } catch { /* fall through */ }
    }

    // Use URL params
    const urlLat = rawLat && rawLat !== '0' && rawLat !== 'undefined' ? rawLat : null
    const urlLng = rawLng && rawLng !== '0' && rawLng !== 'undefined' ? rawLng : null

    if (urlLat && urlLng) {
      setLat(urlLat)
      setLng(urlLng)
      // Fetch fresh data
      fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: parseFloat(urlLat), lng: parseFloat(urlLng) })
      }).then(r => r.json()).then(data => {
        if (data.checks) {
          setChecks(data.checks)
          const hasCritical = data.checks.some((c: Check) => c.status === 'critical')
          const hasCaution = data.checks.some((c: Check) => c.status === 'caution')
          setOverall(hasCritical ? 'CRITICAL' : hasCaution ? 'CAUTION' : 'CLEAR')
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [rawLat, rawLng])

  const initPaystack = () => {
    if (!isValidEmail(email)) return
    setPayLoading(true)
    const s = document.createElement('script')
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.onload = () => {
      try {
        const h = (window as any).PaystackPop.setup({
          key: PAYSTACK_KEY, email, amount: 250000, currency: 'NGN',
          ref: `llc_report_${Date.now()}`,
          callback: () => { setPaidState(true); setPayLoading(false) },
          onClose: () => setPayLoading(false)
        })
        h.openIframe()
      } catch { setPayLoading(false) }
    }
    s.onerror = () => setPayLoading(false)
    document.head.appendChild(s)
  }

  const vc = verdictConfig[overall as keyof typeof verdictConfig] || verdictConfig.CAUTION
  const hasCoords = lat && lng && lat !== '0' && lng !== '0'
  const satelliteUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x360&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAF9', fontFamily: "'Syne',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A5C45" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <p style={{ color: '#6B7280', fontSize: 14 }}>Loading report...</p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Syne',sans-serif", background: '#F8FAF9', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
        .card{background:#fff;border-radius:16px;border:1px solid #E5E7EB;box-shadow:0 1px 8px rgba(0,0,0,0.05)}
      `}</style>

      {/* Header */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => window.history.back()}
          style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#374151' }}>← Back</button>
        <div style={{ width: 32, height: 32, background: '#0A5C45', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>LagosLandCheck</span>
        {hasCoords && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'monospace', color: '#9CA3AF' }}>
            {parseFloat(lat).toFixed(4)}°N {parseFloat(lng).toFixed(4)}°E
          </span>
        )}
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* No coords warning */}
        {!hasCoords && (
          <div className="appear card" style={{ padding: '1.5rem', marginBottom: '1rem', background: '#FFF8F0', border: '1px solid #FED7AA' }}>
            <p style={{ fontSize: 14, color: '#92400E', fontWeight: 600, marginBottom: 6 }}>⚠️ Location data missing</p>
            <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
              Please go back to the agent and verify a land location first. Use a Google Maps link for best results.
            </p>
            <a href="/agent" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: '#0A5C45', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Go to Agent →
            </a>
          </div>
        )}

        {/* Verdict */}
        <div className="appear card" style={{ background: vc.bg, border: `1px solid ${vc.border}`, marginBottom: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 10, fontFamily: 'monospace', color: vc.text, letterSpacing: '1.5px', opacity: 0.7, marginBottom: 5 }}>OVERALL RISK ASSESSMENT</p>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 600, color: vc.text, marginBottom: 4 }}>{vc.label}</div>
              <p style={{ fontSize: 13, color: vc.text, opacity: 0.8, lineHeight: 1.6 }}>{vc.sub}</p>
            </div>
            {hasCoords && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: vc.text, opacity: 0.6 }}>COORDINATES</div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: vc.text, opacity: 0.8, marginTop: 4 }}>{parseFloat(lat).toFixed(5)}°N</div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: vc.text, opacity: 0.8 }}>{parseFloat(lng).toFixed(5)}°E</div>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: 4 }}>
            {(['CLEAR','CAUTION','CRITICAL'] as const).map(s => (
              <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: overall === s ? (s==='CLEAR'?'#22C55E':s==='CAUTION'?'#F59E0B':'#EF4444') : '#E5E7EB' }} />
            ))}
          </div>
        </div>

        {/* Satellite */}
        {hasCoords && satelliteUrl && (
          <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ background: '#0A1628', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>🛰️ Satellite · zoom 20 · hybrid</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Tap to zoom</span>
            </div>
            <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setImgZoom(true)}>
              <img src={satelliteUrl} alt="Satellite" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
            </div>
          </div>
        )}

        {/* Zoom lightbox */}
        {imgZoom && hasCoords && (
          <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
            <div style={{ maxWidth: 700, width: '100%' }}>
              <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`}
                alt="HD" style={{ width: '100%', borderRadius: 12 }} />
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontFamily: 'monospace' }}>Tap to close</p>
            </div>
          </div>
        )}

        {/* Checks */}
        {checks.length > 0 && (
          <div className="appear" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#6B7280', letterSpacing: '1.5px' }}>6 CHECK RESULTS</p>
              <span style={{ fontSize: 10, fontFamily: 'monospace', background: paidState ? '#D1FAE5' : '#FEF3C7', color: paidState ? '#065F46' : '#92400E', padding: '2px 8px', borderRadius: 4 }}>
                {paidState ? '✓ UNLOCKED' : 'FREE PREVIEW'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {checks.map(check => {
                const sc = statusConfig[check.status as keyof typeof statusConfig] || statusConfig.queued
                const isOpen = expanded === check.id && paidState
                return (
                  <div key={check.id} className="card" style={{ overflow: 'hidden', cursor: paidState ? 'pointer' : 'default' }}
                    onClick={() => paidState && setExpanded(isOpen ? null : check.id)}>
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                          {checkIcons[check.id] || '🔍'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{check.name}</span>
                            <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: sc.badge, color: sc.text, fontWeight: 700 }}>{sc.label}</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{check.summary}</p>
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
                      </div>
                      {isOpen && check.details && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #F3F4F6' }}>
                          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.75 }}>{check.details}</p>
                        </div>
                      )}
                      {!paidState && check.details && (
                        <div style={{ marginTop: 8, position: 'relative' }}>
                          <p style={{ fontSize: 12, color: '#374151', filter: 'blur(4px)', userSelect: 'none', lineHeight: 1.75 }}>{check.details}</p>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 10, fontFamily: 'monospace', background: '#0A5C45', color: '#fff', padding: '3px 12px', borderRadius: 10 }}>🔒 Unlock — ₦2,500</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Paywall */}
        {!paidState && (
          <div className="appear card" style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', border: 'none', padding: '1.5rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 6 }}>UNLOCK FULL REPORT</p>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 20, color: '#fff', fontWeight: 600, marginBottom: 8 }}>Get the complete verification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: '1.25rem' }}>
              {['📋 Full details for all 6 checks', '🛰️ Satellite imagery analysis', '📍 Exact gazette distances', '⚖️ Court case details', '📄 PDF certificate', '✅ Share with lawyer'].map(f => (
                <div key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{f}</div>
              ))}
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && initPaystack()}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${email && !isValidEmail(email) ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.25)'}`, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, marginBottom: 10 }} />
            <button onClick={initPaystack} disabled={payLoading || !isValidEmail(email)}
              style={{ width: '100%', padding: '14px 0', background: isValidEmail(email) ? 'linear-gradient(135deg,#CFAF6E,#B8942A)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isValidEmail(email) ? 'pointer' : 'not-allowed', fontFamily: "'Syne',sans-serif" }}>
              {payLoading ? '⏳ Opening payment...' : '🔓 Unlock Full Report — ₦2,500'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 8, fontFamily: 'monospace' }}>Secure via Paystack · Card, bank transfer, USSD</p>
          </div>
        )}

        {/* Paid - Download */}
        {paidState && (
          <div className="appear card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 10 }}>EXPORT YOUR REPORT</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => generatePDF(checks, overall, lat, lng, locationLabel)}
                style={{ flex: 1, padding: '12px 0', background: '#0A5C45', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                📄 Download PDF
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`LagosLandCheck Report\nLocation: ${locationLabel || `${lat},${lng}`}\nRisk: ${overall}\n\nVerify at lagoslandcheck.com`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, padding: '12px 0', background: '#25D366', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                💬 Share on WhatsApp
              </a>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', lineHeight: 1.8 }}>
          Pre-screening only · Not legal advice<br/>
          Always engage a licensed Lagos property lawyer for final due diligence
        </p>
      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ReportContent />
    </Suspense>
  )
}
