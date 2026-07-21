'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildPdfHtml } from '@/lib/pdf-template'
import Footer from '@/components/Footer'

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

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
const checkIcons: Record<string, string> = { satellite: '🛰️', gazette: '📜', flood: '🌊', litigation: '⚖️', luc: '🧾', fraud: '🚨' }

function teaser(details: string, status: string): string {
  if (!details) return status === 'clear' ? 'No issues detected on this check.' : 'Findings available — unlock to read.'
  const firstSentence = details.split(/[.!?]/)[0]
  if (firstSentence.length > 110) return firstSentence.slice(0, 107) + '...'
  return firstSentence + '.'
}

function generatePDF(checks: Check[], overall: string, lat: string, lng: string, locationLabel: string) {
  const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
  const html = buildPdfHtml({ checks, overall, lat, lng, locationLabel, refNo })
  const win = window.open('', '_blank')
  if (!win) { alert('Allow popups to download PDF. Check your browser popup blocker.'); return }
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => { try { win.focus(); win.print() } catch (e) { console.error(e) } }, 1500)
}

type ReportTier = 'instant' | 'verified'

function ReportContent() {
  const params = useSearchParams()
  const rawLat = params.get('lat')
  const rawLng = params.get('lng')
  const paymentRefParam = params.get('paymentRef')

  const [lat, setLat] = useState<string>('')
  const [lng, setLng] = useState<string>('')
  const [locationLabel, setLocationLabel] = useState<string>('')
  const [checks, setChecks] = useState<Check[]>([])
  const [overall, setOverall] = useState<string>('CAUTION')
  const [loading, setLoading] = useState(true)
  const [paidState, setPaidState] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const [email, setEmail] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [requestTier, setRequestTier] = useState<ReportTier>('instant')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [imgZoom, setImgZoom] = useState(false)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  useEffect(() => {
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

    const urlLat = rawLat && rawLat !== '0' && rawLat !== 'undefined' ? rawLat : null
    const urlLng = rawLng && rawLng !== '0' && rawLng !== 'undefined' ? rawLng : null

    if (urlLat && urlLng) {
      setLat(urlLat)
      setLng(urlLng)
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

  useEffect(() => {
    if (!paymentRefParam || paidState || !lat || !lng) return
    ;(async () => {
      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentRef: paymentRefParam,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            overall,
          }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setPaidState(true)
          setUnlockError('')
          return
        }
        setUnlockError(data?.error || 'Payment verification failed.')
      } catch {
        setUnlockError('Could not verify payment reference.')
      }
    })()
  }, [paymentRefParam, paidState, lat, lng, overall])

  const initPaystack = () => {
    if (!isValidEmail(email) || !PAYSTACK_KEY) return
    const amountKobo = requestTier === 'verified' ? 3000000 : 500000
    setPayLoading(true)
    const s = document.createElement('script')
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.onload = () => {
      try {
        const handlePaymentSuccess = async (reference: string) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentRef: reference,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                overall,
                requestTier,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || !verifyData.success) {
              setPayLoading(false)
              alert(verifyData?.error || 'Payment verification failed. Please contact support.')
              return
            }

            setPaidState(true)
            setUnlockError('')
            setPayLoading(false)
          } catch {
            setPayLoading(false)
            alert('Could not verify payment. Please contact support with your payment reference.')
            return
          }
          // Fire-and-forget — email delivery is a bonus, not blocking
          const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
          fetch('/api/send-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              refNo,
              paymentRef: reference,
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              locationLabel: locationLabel || `${lat}, ${lng}`,
              overall,
              checks,
              requestTier,
            })
          }).catch(err => console.error('[REPORT_EMAIL_FAIL]', err))
        }

        const paystackCallback = (response: { reference: string }) => {
          void handlePaymentSuccess(response.reference)
        }

        const h = (window as any).PaystackPop.setup({
          key: PAYSTACK_KEY, email, amount: amountKobo, currency: 'NGN',
          ref: `llc_report_${Date.now()}`,
          callback: paystackCallback,
          onClose: () => setPayLoading(false)
        })
        h.openIframe()
      } catch {
        setPayLoading(false)
        alert('Could not open payment. Please try again.')
      }
    }
    s.onerror = () => setPayLoading(false)
    document.head.appendChild(s)
  }

  const vc = verdictConfig[overall as keyof typeof verdictConfig] || verdictConfig.CAUTION
  const hasCoords = lat && lng && lat !== '0' && lng !== '0'
  const satelliteUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x360&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null

  const cautionCount = checks.filter(c => c.status === 'caution' || c.status === 'critical').length

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

      <nav style={{
        background: '#07382C',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 1.25rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z"
              fill="rgba(207,175,110,0.1)" stroke="#CFAF6E" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M13 22 L19.5 29 L31 16"
              stroke="#CFAF6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>LagosLandCheck</div>
            <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#CFAF6E', letterSpacing: '2px', marginTop: 1 }}>VERIFICATION INTELLIGENCE</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="/contact" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Contact</a>
          <a href="/agent" style={{ padding: '7px 14px', background: 'rgba(207,175,110,0.15)', border: '1px solid rgba(207,175,110,0.3)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#CFAF6E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            Run a check
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {unlockError && (
          <div className="appear card" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <p style={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.6 }}>{unlockError}</p>
          </div>
        )}

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

        {imgZoom && hasCoords && (
          <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
            <div style={{ maxWidth: 700, width: '100%' }}>
              <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`}
                alt="HD" style={{ width: '100%', borderRadius: 12 }} />
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontFamily: 'monospace' }}>Tap to close</p>
            </div>
          </div>
        )}

        {/* 6 Checks — same single-CTA pattern as agent page */}
        {checks.length > 0 && (
          <div className="appear" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#6B7280', letterSpacing: '1.5px' }}>6 CHECK RESULTS</p>
              <span style={{ fontSize: 10, fontFamily: 'monospace', background: paidState ? '#D1FAE5' : '#FEF3C7', color: paidState ? '#065F46' : '#92400E', padding: '2px 8px', borderRadius: 4 }}>
                {paidState ? '✓ FULL ACCESS' : 'PREVIEW MODE'}
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
                        {!paidState ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 11, fontFamily: 'monospace', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>LOCKED</span>
                          </div>
                        ) : (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
                        )}
                      </div>
                      {isOpen && check.details && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #F3F4F6' }}>
                          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.75 }}>{check.details}</p>
                        </div>
                      )}
                      {!paidState && check.details && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px dashed #E5E7EB' }}>
                          <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.6, fontStyle: 'italic' }}>
                            <span style={{ color: '#6B7280', fontWeight: 600, fontStyle: 'normal' }}>Preview: </span>
                            {teaser(check.details, check.status)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!paidState && checks.length > 0 && (
          <div className="appear card" style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', border: 'none', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)' }} />

            <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#CFAF6E', letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>UNLOCK FULL REPORT</p>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
              Unlock all 6 detailed findings
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.5 }}>
              {cautionCount > 0
                ? `${cautionCount} ${cautionCount === 1 ? 'check has' : 'checks have'} flagged concerns. Read the full evidence and lawyer-ready details.`
                : 'Read the full evidence and lawyer-ready breakdown for each check.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
              {[
                { i: '📋', t: 'Full details on all 6 checks' },
                { i: '🛰️', t: 'Satellite analysis breakdown' },
                { i: '📍', t: 'Exact gazette distances' },
                { i: '⚖️', t: 'Court case references' },
                { i: '📄', t: 'Branded PDF certificate' },
                { i: '💬', t: 'Share via WhatsApp / email' },
              ].map(f => (
                <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ fontSize: 13 }}>{f.i}</span>
                  <span>{f.t}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 10, marginBottom: 12, border: '1px solid rgba(207,175,110,0.25)' }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 2 }}>ONE-TIME · NO SUBSCRIPTION</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  ₦5,000
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8 }}>for the complete report</span>
                </div>
              </div>
            </div>

            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && initPaystack()}
              placeholder="your@email.com — receipt + report sent here"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${email && !isValidEmail(email) ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.25)'}`, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, marginBottom: 10 }} />
            <button onClick={initPaystack} disabled={payLoading || !isValidEmail(email)}
              style={{ width: '100%', padding: '15px 0', background: isValidEmail(email) ? 'linear-gradient(135deg,#CFAF6E,#B8942A)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isValidEmail(email) ? 'pointer' : 'not-allowed', fontFamily: "'Syne',sans-serif", boxShadow: isValidEmail(email) ? '0 4px 12px rgba(207,175,110,0.3)' : 'none' }}>
              {payLoading ? '⏳ Opening payment...' : '🔓 Unlock Full Report — ₦5,000'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 10, fontFamily: 'monospace' }}>Secure via Paystack · Card · Bank transfer · USSD</p>
          </div>
        )}

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
      <Footer />
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
