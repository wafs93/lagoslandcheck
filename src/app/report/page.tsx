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

// Paystack public key from env
declare global { interface Window { PaystackPop: any } }

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

  // Satellite image URL
  const satelliteUrl = lat && lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x280&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  const satelliteCheck = checks.find(c => c.id === 'satellite')
  const hasBuilding = satelliteCheck?.summary?.includes('Building') || satelliteCheck?.summary?.includes('building')

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

            {/* Satellite image */}
            {satelliteUrl && (
              <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: '1rem', border: '1px solid #E5E7EB', position: 'relative', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <img src={satelliteUrl} alt="Satellite view" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
                  🛰️ SATELLITE VIEW
                </div>
                {hasBuilding && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                    ⚠️ BUILDING DETECTED
                  </div>
                )}
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
                <button style={{ padding: '9px 16px', background: '#0A5C45', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
