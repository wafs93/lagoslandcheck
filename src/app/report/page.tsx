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
  const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      clear: '#065F46', caution: '#92400E', critical: '#991B1B', queued: '#6B7280', running: '#1D4ED8'
    }
    const bgs: Record<string, string> = {
      clear: '#D1FAE5', caution: '#FEF3C7', critical: '#FEE2E2', queued: '#F3F4F6', running: '#DBEAFE'
    }
    return `<span style="font-size:9px;font-family:monospace;padding:2px 8px;border-radius:4px;background:${bgs[status]||'#F3F4F6'};color:${colors[status]||'#6B7280'};font-weight:700">${status.toUpperCase()}</span>`
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>LagosLandCheck Verification Report — ${refNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Syne', Arial, sans-serif; color: #111827; background: #fff; padding: 32px; max-width: 700px; margin: 0 auto; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0A5C45; }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-box { width: 36px; height: 36px; background: #0A5C45; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-name { font-size: 18px; font-weight: 700; color: #0A5C45; }
  .ref { font-size: 10px; font-family: monospace; color: #6B7280; text-align: right; }
  .verdict { border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; border: 1px solid ${vc.border}; background: ${vc.bg}; }
  .verdict-label { font-size: 18px; font-weight: 700; color: ${vc.text}; margin-bottom: 4px; }
  .verdict-sub { font-size: 12px; color: ${vc.text}; opacity: 0.85; }
  .meta { display: flex; gap: 12px; margin-top: 10px; }
  .meta-tag { font-size: 10px; font-family: monospace; background: rgba(0,0,0,0.07); color: ${vc.text}; padding: 3px 8px; border-radius: 4px; }
  .satellite { width: 100%; border-radius: 10px; margin-bottom: 20px; border: 1px solid #E5E7EB; }
  .section-title { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace; }
  .check { padding: 12px 0; border-bottom: 0.5px solid #F3F4F6; }
  .check:last-child { border-bottom: none; }
  .check-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .check-name { font-size: 13px; font-weight: 600; flex: 1; color: #111827; }
  .check-summary { font-size: 12px; color: #6B7280; line-height: 1.55; padding-left: 18px; margin-bottom: 4px; }
  .check-details { font-size: 11px; color: #374151; line-height: 1.7; padding-left: 18px; background: #F9FAFB; padding: 8px 12px 8px 30px; border-radius: 6px; margin-top: 4px; }
  .disclaimer { font-size: 10px; color: #9CA3AF; line-height: 1.7; margin-top: 24px; padding-top: 16px; border-top: 1px solid #F3F4F6; font-family: monospace; }
  .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E5E7EB; }
  .footer-brand { font-size: 11px; color: #0A5C45; font-weight: 600; }
  .footer-ref { font-size: 10px; color: #9CA3AF; font-family: monospace; }
  @media print {
    body { padding: 16px; }
    @page { margin: 10mm; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div>
        <div class="logo-name">LagosLandCheck</div>
        <div style="font-size:10px;color:#6B7280;font-family:monospace">Land Verification Intelligence</div>
      </div>
    </div>
    <div class="ref">
      <div style="font-weight:700;color:#111;font-size:11px">VERIFICATION CERTIFICATE</div>
      <div>Ref: ${refNo}</div>
      <div>Date: ${date}</div>
    </div>
  </div>

  <div class="verdict">
    <div class="verdict-label">${vc.label}</div>
    <div class="verdict-sub">${vc.sub}</div>
    <div class="meta">
      <span class="meta-tag">${date}</span>
      <span class="meta-tag">${parseFloat(lat).toFixed(5)}°N, ${parseFloat(lng).toFixed(5)}°E</span>
    </div>
  </div>

  ${satelliteUrl ? `<img src="${satelliteUrl}" class="satellite" alt="Satellite view" />` : ''}
  ${streetViewUrl ? `
  <p style="font-size:10px;font-family:monospace;color:#9CA3AF;letter-spacing:1px;margin-bottom:6px;margin-top:4px">STREET VIEW · GROUND LEVEL</p>
  <img src="${streetViewUrl}" class="satellite" alt="Street view" style="border-radius:10px;width:100%;margin-bottom:20px;border:1px solid #E5E7EB;" />
  ` : ''}

  <div class="section-title">6-Point Verification Results</div>
  <div style="border:1px solid #E5E7EB;border-radius:12px;padding:4px 16px;margin-bottom:20px">
    ${checks.map(c => {
      const dotColors: Record<string, string> = { clear: '#22C55E', caution: '#F59E0B', critical: '#EF4444', queued: '#D1D5DB', running: '#60A5FA' }
      return `<div class="check">
        <div class="check-header">
          <div class="dot" style="background:${dotColors[c.status]||'#D1D5DB'}"></div>
          <span class="check-name">${c.name}</span>
          ${statusBadge(c.status)}
        </div>
        <div class="check-summary">${c.summary}</div>
        ${c.details ? `<div class="check-details">${c.details}</div>` : ''}
      </div>`
    }).join('')}
  </div>

  <div class="disclaimer">
    <strong>IMPORTANT DISCLAIMER:</strong> This report is a pre-screening intelligence tool generated by LagosLandCheck. It does not constitute legal advice and does not replace a physical Land Registry search by a licensed property lawyer. The information in this report is based on available databases and satellite imagery at the time of generation. LagosLandCheck accepts no liability for decisions made solely on the basis of this report. Always engage a qualified Nigerian property lawyer before completing any land transaction.
    <br><br>
    <strong>Recommended next step:</strong> Present this report to a licensed property solicitor and instruct them to conduct a full Land Registry search at the Lagos State Land Registry, Alausa.
  </div>

  <div class="footer">
    <div class="footer-brand">LagosLandCheck · lagoslandcheck.vercel.app</div>
    <div class="footer-ref">Ref: ${refNo} · ${date}</div>
  </div>
</body>
</html>`

  // Open in new window and trigger print
  const win = window.open('', '_blank')
  if (!win) {
    alert('Please allow popups to download the PDF report.')
    return
  }
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    setTimeout(() => {
      win.print()
    }, 500)
  }
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
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
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
