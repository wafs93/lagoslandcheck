'use client'

import { useState, useRef } from 'react'
import Footer from '@/components/Footer'

interface CheckResult {
  id: string
  name: string
  status: 'clear' | 'caution' | 'critical' | 'running' | 'queued'
  summary: string
  details: string
}

interface VerificationResult {
  overall: 'CLEAR' | 'CAUTION' | 'CRITICAL'
  location_label: string
  confidence: 'high' | 'medium' | 'low'
  checks: CheckResult[]
  lat?: number
  lng?: number
  reportId?: string
}

type Stage = 'input' | 'processing' | 'results'

const CHECKS_CONFIG = [
  { id: 'satellite',  icon: '🛰️', name: 'Satellite imagery',         label: 'Analyzing satellite imagery...' },
  { id: 'gazette',    icon: '📜', name: 'Gazette & govt acquisition', label: 'Checking Lagos State gazettes...' },
  { id: 'flood',      icon: '🌊', name: 'Flood & drainage risk',      label: 'Checking flood risk zones...' },
  { id: 'litigation', icon: '⚖️', name: 'Court litigation',           label: 'Searching court disputes...' },
  { id: 'luc',        icon: '🧾', name: 'Land Use Charge status',     label: 'Verifying LUC compliance...' },
  { id: 'fraud',      icon: '🚨', name: 'Fraud zone & Omo Onile',     label: 'Scanning fraud database...' },
]

const RISK_CONFIG = {
  CLEAR:    { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', label: '🟢 Low Risk',    sub: 'No major issues found. Continue with standard legal due diligence.' },
  CAUTION:  { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: '🟡 Medium Risk', sub: 'Concerns detected. Do not pay any money before consulting a lawyer.' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', label: '🔴 High Risk',   sub: 'Critical flags found. Strongly advise against proceeding.' },
}

const STATUS_CONFIG = {
  clear:    { color: '#22C55E', bg: '#ECFDF5', badge: '#D1FAE5', text: '#065F46', label: 'CLEAR' },
  caution:  { color: '#F59E0B', bg: '#FFFBEB', badge: '#FEF3C7', text: '#92400E', label: 'CAUTION' },
  critical: { color: '#EF4444', bg: '#FEF2F2', badge: '#FEE2E2', text: '#991B1B', label: 'HIGH RISK' },
  running:  { color: '#60A5FA', bg: '#EFF6FF', badge: '#DBEAFE', text: '#1D4ED8', label: 'CHECKING' },
  queued:   { color: '#D1D5DB', bg: '#F9FAFB', badge: '#F3F4F6', text: '#6B7280', label: 'QUEUED' },
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

// First sentence of details, used as teaser on locked cards
function teaser(details: string, status: string): string {
  if (!details) return status === 'clear' ? 'No issues detected on this check.' : 'Findings available — unlock to read.'
  const firstSentence = details.split(/[.!?]/)[0]
  if (firstSentence.length > 110) return firstSentence.slice(0, 107) + '...'
  return firstSentence + '.'
}

function StreetViewTab({ url, lat, lng }: { url: string | null; lat?: number; lng?: number }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [nearestUrl, setNearestUrl] = useState<string | null>(null)
  const [nearestDist, setNearestDist] = useState<number | null>(null)

  const tryNearest = async () => {
    if (!lat || !lng || !GOOGLE_MAPS_KEY) return
    const offsets = [[0.002,0],[-0.002,0],[0,0.002],[0,-0.002],[0.001,0.001],[-0.001,0.001],[0.001,-0.001],[-0.001,-0.001]]
    for (const [dlat, dlng] of offsets) {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat+dlat},${lng+dlng}&key=${GOOGLE_MAPS_KEY}`)
        const data = await res.json()
        if (data.status === 'OK') {
          const dist = Math.round(Math.sqrt(((dlat)*111000)**2 + ((dlng)*111000)**2))
          setNearestUrl(`https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${lat+dlat},${lng+dlng}&fov=90&pitch=0&key=${GOOGLE_MAPS_KEY}`)
          setNearestDist(dist)
          return
        }
      } catch { /* continue */ }
    }
  }

  if (!url) return (
    <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1628', color: 'rgba(255,255,255,0.5)', gap: 10 }}>
      <span style={{ fontSize: 32 }}>🗺️</span>
      <span style={{ fontSize: 13 }}>No Street View available</span>
      {lat && lng && (
        <a href={`https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer"
          style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12, textDecoration: 'none' }}>
          Open in Google Maps →
        </a>
      )}
    </div>
  )

  return (
    <div style={{ position: 'relative', minHeight: 240 }}>
      {status === 'loading' && !nearestUrl && (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1628', gap: 10, position: 'absolute', inset: 0, zIndex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>Loading street view...</span>
        </div>
      )}
      {!nearestUrl && (
        <img src={url} alt="Street view"
          style={{ width: '100%', height: 240, objectFit: 'cover', display: status === 'error' ? 'none' : 'block' }}
          onLoad={() => setStatus('ok')}
          onError={() => { setStatus('error'); tryNearest() }} />
      )}
      {nearestUrl && (
        <div style={{ position: 'relative' }}>
          <img src={nearestUrl} alt="Nearest street view" style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.75)', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: '#fff', fontFamily: 'monospace' }}>
            📷 Nearest road view · {nearestDist}m from this location
          </div>
        </div>
      )}
      {status === 'error' && !nearestUrl && (
        <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1628', color: 'rgba(255,255,255,0.5)', gap: 10 }}>
          <span style={{ fontSize: 36 }}>🗺️</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>No Street View coverage here</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>Common in Lagos residential streets</span>
          {lat && lng && (
            <a href={`https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer"
              style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12, textDecoration: 'none' }}>
              Open in Google Maps →
            </a>
          )}
        </div>
      )}
      {status === 'ok' && !nearestUrl && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: 'monospace' }}>
          📷 Street View · Ground level
        </div>
      )}
    </div>
  )
}

export default function AgentPage() {
  const [stage, setStage] = useState<Stage>('input')
  const [input, setInput] = useState('')
  const [processingStep, setProcessingStep] = useState(0)
  const [processingChecks, setProcessingChecks] = useState<string[]>([])
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [imgZoom, setImgZoom] = useState(false)
  const [activeTab, setActiveTab] = useState<'satellite' | 'street'>('satellite')
  const [paid, setPaid] = useState(false)
  const [email, setEmail] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{role:'user'|'agent';text:string}[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const runVerification = async (userInput: string) => {
    if (!userInput.trim()) return
    setStage('processing')
    setProcessingStep(0)
    setProcessingChecks([])

    const steps = ['locate', ...CHECKS_CONFIG.map(c => c.id)]
    const animate = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 800))
        setProcessingStep(i + 1)
        setProcessingChecks(prev => [...prev, steps[i]])
      }
    }
    animate()

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userInput }] })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let verificationData: VerificationResult | null = null

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          for (const line of decoder.decode(value).split('\n')) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'verification_result') verificationData = data.data
            } catch { /* skip */ }
          }
        }
      }

      if (verificationData) {
        sessionStorage.setItem('llc_result', JSON.stringify(verificationData))
        setResult(verificationData)
        setActiveTab('satellite')
        setStage('results')
      } else {
        setResult({
          overall: 'CAUTION',
          location_label: userInput.slice(0, 60),
          confidence: 'low',
          checks: CHECKS_CONFIG.map(c => ({
            id: c.id, name: c.name, status: 'caution' as const,
            summary: 'Could not complete check. Try a Google Maps link.',
            details: 'For best results, paste a Google Maps link with coordinates.'
          }))
        })
        setActiveTab('satellite')
        setStage('results')
      }
    } catch {
      setStage('results')
      setResult({
        overall: 'CAUTION',
        location_label: userInput.slice(0, 60),
        confidence: 'low',
        checks: CHECKS_CONFIG.map(c => ({
          id: c.id, name: c.name, status: 'caution' as const,
          summary: 'Connection error. Please try again.',
          details: ''
        }))
      })
    }
  }

  const initPaystack = () => {
    if (!isValidEmail(email) || !PAYSTACK_KEY) return
    if (!result?.lat || !result?.lng) return
    setPayLoading(true)
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => {
      try {
        const handler = (window as any).PaystackPop.setup({
          key: PAYSTACK_KEY,
          email,
          amount: 500000,
          currency: 'NGN',
          ref: `llc_${Date.now()}`,
          callback: async (response: { reference: string }) => {
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentRef: response.reference,
                  lat: result.lat,
                  lng: result.lng,
                  overall: result.overall,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok || !verifyData.success) {
                setPayLoading(false)
                alert(verifyData?.error || 'Payment verification failed. Please contact support.')
                return
              }

              setPaid(true)
              setPayLoading(false)
            } catch {
              setPayLoading(false)
              alert('Could not verify payment. Please contact support with your payment reference.')
              return
            }
            sessionStorage.setItem('llc_ref', response.reference)
            sessionStorage.setItem('llc_email', email)
            if (result) sessionStorage.setItem('llc_result', JSON.stringify(result))
            // Fire-and-forget — email delivery is a bonus
            if (result?.lat && result?.lng) {
              const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
              fetch('/api/send-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  refNo,
                  paymentRef: response.reference,
                  lat: result.lat,
                  lng: result.lng,
                  locationLabel: result.location_label,
                  overall: result.overall,
                  checks: result.checks,
                })
              }).catch(err => console.error('[REPORT_EMAIL_FAIL]', err))
            }
          },
          onClose: () => setPayLoading(false)
        })
        handler.openIframe()
      } catch {
        setPayLoading(false)
      }
    }
    script.onerror = () => setPayLoading(false)
    document.head.appendChild(script)
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setChatLoading(true)
    try {
      const context = result ? `User verified: ${result.location_label}. Risk: ${result.overall}.` : ''
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: context ? `${context}\n\nQuestion: ${msg}` : msg }] })
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let text = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          for (const line of decoder.decode(value).split('\n')) {
            if (!line.startsWith('data: ')) continue
            try { const d = JSON.parse(line.slice(6)); if (d.type === 'text') text += d.content } catch { /* skip */ }
          }
        }
      }
      setChatMessages(prev => [...prev, { role: 'agent', text: text || 'Could not get response. Please try again.' }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'agent', text: 'Connection error. Please try again.' }])
    }
    setChatLoading(false)
  }

  const openReport = () => {
    const lat = result?.lat || 0
    const lng = result?.lng || 0
    const ref = sessionStorage.getItem('llc_ref') || ''
    const paymentQuery = ref ? `&paymentRef=${encodeURIComponent(ref)}` : ''
    window.open(`/report?lat=${lat}&lng=${lng}${paymentQuery}`, '_blank')
  }

  const satelliteUrl = result?.lat && result?.lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${result.lat},${result.lng}&zoom=20&size=640x640&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null
  const streetViewUrl = result?.lat && result?.lng
    ? `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${result.lat},${result.lng}&fov=90&pitch=0&key=${GOOGLE_MAPS_KEY}`
    : null

  const rc = result ? RISK_CONFIG[result.overall] : null
  const hasBuilding = result?.checks.find(c => c.id === 'satellite')?.summary?.toLowerCase().includes('building')

  // Count of cautions/criticals — used in the unlock CTA copy
  const cautionCount = result?.checks.filter(c => c.status === 'caution' || c.status === 'critical').length || 0

  return (
    <div style={{ fontFamily: "'Syne',sans-serif", background: '#F8FAF9', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
        .card{background:#fff;border-radius:16px;border:1px solid #E5E7EB;box-shadow:0 1px 8px rgba(0,0,0,0.05)}
        textarea:focus,input:focus{outline:none!important}
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#07382C', padding: '0 1.25rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 0 rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => stage === 'input' ? window.location.href = '/' : setStage('input')}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '5px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer' }}>
            ← {stage === 'input' ? 'Home' : 'New check'}
          </button>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
              <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z" fill="rgba(207,175,110,0.1)" stroke="#CFAF6E" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M13 22 L19.5 29 L31 16" stroke="#CFAF6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', fontFamily: "'Syne',sans-serif" }}>LagosLandCheck</span>
          </a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
            {stage === 'input' ? 'Ready' : stage === 'processing' ? 'Analyzing...' : 'Report ready'}
          </span>
        </div>
      </nav>

      {/* STAGE 1: INPUT */}
      {stage === 'input' && (
        <div style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1rem' }} className="appear">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(10,92,69,0.08)', border: '1px solid rgba(10,92,69,0.15)', borderRadius: 24, padding: '5px 14px', fontSize: 10, fontFamily: 'monospace', color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 14 }}>
              6 CHECKS · UNDER 2 MINUTES · NO SITE VISIT
            </div>
            <h1 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(24px,5vw,36px)', fontWeight: 600, color: '#111827', lineHeight: 1.2, marginBottom: 10 }}>
              Where is the land<br/>you want to verify?
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>Paste a Google Maps link, coordinates, or any Lagos address.</p>
          </div>

          <div className="card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runVerification(input) } }}
                placeholder="e.g. https://maps.google.com/?q=6.4698,3.5721 or 'Plot 14, Thomas Estate, Ajah'"
                rows={3}
                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: "'Syne',sans-serif", color: '#111827', background: '#FAFAFA', lineHeight: 1.6, resize: 'none', display: 'block', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#0A5C45'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '10px 0' }}>
                {[
                  { label: '🔗 Maps link', val: 'https://maps.google.com/?q=6.5244,3.3792' },
                  { label: '📍 Address', val: 'Plot 14, Thomas Estate, Ajah, Lagos' },
                  { label: '📐 Coordinates', val: '6.4698, 3.5721' },
                ].map(ex => (
                  <button key={ex.label} onClick={() => setInput(ex.val)}
                    style={{ fontSize: 11, padding: '5px 12px', borderRadius: 16, border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#6B7280', cursor: 'pointer', fontFamily: 'monospace' }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => runVerification(input)} disabled={!input.trim()}
              style={{ width: '100%', padding: '16px 0', background: input.trim() ? 'linear-gradient(135deg,#0A5C45,#07382C)' : '#E5E7EB', border: 'none', fontSize: 15, fontWeight: 700, color: input.trim() ? '#fff' : '#9CA3AF', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'Syne',sans-serif" }}>
              {input.trim() ? '🔍 Analyze This Land' : 'Paste location above to continue'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.25rem' }}>
            {[{ icon: '🛰️', t: '6 checks', s: 'Satellite + databases' }, { icon: '⚡', t: 'Under 2 min', s: 'Real-time results' }, { icon: '🌍', t: 'Works abroad', s: 'No site visit' }].map(f => (
              <div key={f.t} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{f.t}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 2 }}>{f.s}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 10 }}>6 CHECKS WE RUN</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CHECKS_CONFIG.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#F9FAFB', borderRadius: 9 }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: '1.25rem', fontFamily: 'monospace', lineHeight: 1.8 }}>
            Powered by Lagos public data + satellite analysis<br/>
            Used by diaspora buyers · Lawyers · Estate professionals
          </p>
        </div>
      )}

      {/* STAGE 2: PROCESSING */}
      {stage === 'processing' && (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '2.5rem 1rem' }} className="appear">
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#0A5C45,#07382C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 2s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10" opacity="0.3"/></svg>
              </div>
              <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 6 }}>Analyzing the land</h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace' }}>{input.slice(0, 55)}{input.length > 55 ? '...' : ''}</p>
            </div>

            <div style={{ background: '#F3F4F6', borderRadius: 8, height: 6, marginBottom: '1.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#0A5C45,#5DCAA5)', borderRadius: 8, width: `${Math.min(100, (processingStep / 7) * 100)}%`, transition: 'width 0.6s ease' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ id: 'locate', icon: '📍', label: 'Locating land on the map...' }, ...CHECKS_CONFIG.map(c => ({ id: c.id, icon: c.icon, label: c.label }))].map((step, i) => {
                const done = processingChecks.includes(step.id)
                const active = processingStep === i + 1 && !done
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: done ? '#F0FDF4' : active ? '#EFF6FF' : '#F9FAFB', border: `1px solid ${done ? '#BBF7D0' : active ? '#BFDBFE' : '#F3F4F6'}`, transition: 'all 0.3s' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? '#22C55E' : active ? '#3B82F6' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        : active ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                        : <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700 }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: 13, color: done ? '#065F46' : active ? '#1D4ED8' : '#9CA3AF', fontWeight: done || active ? 500 : 400 }}>
                      {step.icon} {step.label}
                    </span>
                    {done && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#22C55E', fontFamily: 'monospace' }}>✓</span>}
                    {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#3B82F6', fontFamily: 'monospace', animation: 'pulse 1s infinite' }}>...</span>}
                  </div>
                )
              })}
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: '1.5rem', fontFamily: 'monospace' }}>Under 2 minutes · Do not close this page</p>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULTS */}
      {stage === 'results' && result && rc && (
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '1.25rem 1rem 4rem' }}>

          {/* Risk Score */}
          <div className="appear card" style={{ background: rc.bg, border: `1px solid ${rc.border}`, marginBottom: '1rem', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: 'monospace', color: rc.text, letterSpacing: '1.5px', opacity: 0.7, marginBottom: 5 }}>OVERALL RISK ASSESSMENT</p>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600, color: rc.text, marginBottom: 4 }}>{rc.label}</div>
                <p style={{ fontSize: 13, color: rc.text, opacity: 0.8, lineHeight: 1.6, maxWidth: 360 }}>{rc.sub}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: rc.text, opacity: 0.6, marginBottom: 4 }}>LOCATION</div>
                <div style={{ fontSize: 12, color: rc.text, fontWeight: 500, maxWidth: 200, lineHeight: 1.4 }}>{result.location_label}</div>
                {result.lat && result.lng && (
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: rc.text, opacity: 0.5, marginTop: 4 }}>
                    {result.lat.toFixed(4)}°N, {result.lng.toFixed(4)}°E
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 4 }}>
              {(['CLEAR','CAUTION','CRITICAL'] as const).map(s => (
                <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: result.overall === s ? (s === 'CLEAR' ? '#22C55E' : s === 'CAUTION' ? '#F59E0B' : '#EF4444') : '#E5E7EB' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['Low Risk', 'Medium Risk', 'High Risk'].map(l => (
                <span key={l} style={{ fontSize: 9, color: rc.text, opacity: 0.5, fontFamily: 'monospace' }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Image Viewer */}
          {(satelliteUrl || streetViewUrl) && (
            <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { id: 'satellite' as const, label: '🛰️ Satellite', show: !!satelliteUrl },
                  { id: 'street' as const, label: '📷 Street View', show: !!streetViewUrl },
                ].filter(t => t.show).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: '10px 14px', background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #CFAF6E' : '2px solid transparent', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {tab.label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ padding: '10px 10px', fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', alignSelf: 'center' }}>
                  {result.lat?.toFixed(4)}°N {result.lng?.toFixed(4)}°E
                </div>
              </div>

              <div style={{ display: activeTab === 'satellite' ? 'block' : 'none' }}>
                {satelliteUrl ? (
                  <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setImgZoom(true)}>
                    <img src={satelliteUrl} alt="Satellite" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: 'monospace' }}>
                      🛰️ Tap to zoom · AI analysed · zoom 20
                    </div>
                    {hasBuilding && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.92)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>
                        ⚠️ BUILDING DETECTED
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ height: 260, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'monospace' }}>
                    Satellite image not available for this location
                  </div>
                )}
              </div>

              {activeTab === 'street' && (
                <StreetViewTab key="sv" url={streetViewUrl} lat={result.lat} lng={result.lng} />
              )}
            </div>
          )}

          {/* Zoom lightbox */}
          {imgZoom && result.lat && result.lng && (
            <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
              <div style={{ maxWidth: 700, width: '100%' }}>
                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${result.lat},${result.lng}&zoom=20&size=640x640&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`}
                  alt="HD Satellite" style={{ width: '100%', borderRadius: 12 }} />
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontFamily: 'monospace' }}>Tap anywhere to close</p>
              </div>
            </div>
          )}

          {/* 6 Checks — NEW DESIGN: locked cards show teaser + lock icon, NO per-card price */}
          <div className="appear" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#6B7280', letterSpacing: '1.5px' }}>6 RISK CHECKS</p>
              <span style={{ fontSize: 10, fontFamily: 'monospace', background: paid ? '#D1FAE5' : '#FEF3C7', color: paid ? '#065F46' : '#92400E', padding: '2px 8px', borderRadius: 4 }}>
                {paid ? '✓ FULL ACCESS' : 'PREVIEW MODE'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.checks.map(check => {
                const sc = STATUS_CONFIG[check.status] || STATUS_CONFIG.queued
                const isOpen = expanded === check.id && paid
                const checkIcon = CHECKS_CONFIG.find(c => c.id === check.id)?.icon || '🔍'
                return (
                  <div key={check.id} className="card" style={{ overflow: 'hidden', cursor: paid ? 'pointer' : 'default', transition: 'all 0.2s' }}
                    onClick={() => paid && setExpanded(isOpen ? null : check.id)}>
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>{checkIcon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{check.name}</span>
                            <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: sc.badge, color: sc.text, fontWeight: 700 }}>{sc.label}</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{check.summary}</p>
                        </div>
                        {!paid ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 11, fontFamily: 'monospace', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>LOCKED</span>
                          </div>
                        ) : (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color, flexShrink: 0 }} />
                        )}
                      </div>
                      {isOpen && paid && check.details && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #F3F4F6' }}>
                          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.75 }}>{check.details}</p>
                        </div>
                      )}
                      {!paid && check.details && (
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

          {/* SINGLE PAYWALL CTA — one price, one button */}
          {!paid && (
            <div className="appear card" style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', border: 'none', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              {/* Gold accent stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)' }} />

              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#CFAF6E', letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>UNLOCK FULL REPORT</p>
              <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
                Unlock all 6 detailed findings
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.5 }}>
                {cautionCount > 0
                  ? `${cautionCount} ${cautionCount === 1 ? 'check has' : 'checks have'} flagged concerns. Read the full evidence, gazette references, and lawyer-ready details.`
                  : 'Read the full evidence, distance measurements, and lawyer-ready breakdown for each check.'}
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

              {/* Price row */}
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
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${email && !isValidEmail(email) ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.25)'}`, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontFamily: "'Syne',sans-serif", marginBottom: 4 }} />
              {email && !isValidEmail(email) && (
                <p style={{ fontSize: 11, color: 'rgba(239,68,68,0.8)', marginBottom: 6, fontFamily: 'monospace' }}>Please enter a valid email address</p>
              )}
              <div style={{ marginBottom: isValidEmail(email) ? 10 : 0 }} />

              <button onClick={initPaystack} disabled={payLoading || !isValidEmail(email)}
                style={{ width: '100%', padding: '15px 0', background: isValidEmail(email) ? 'linear-gradient(135deg,#CFAF6E,#B8942A)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isValidEmail(email) ? 'pointer' : 'not-allowed', fontFamily: "'Syne',sans-serif", boxShadow: isValidEmail(email) ? '0 4px 12px rgba(207,175,110,0.3)' : 'none' }}>
                {payLoading ? '⏳ Opening payment...' : '🔓 Unlock Full Report — ₦5,000'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 10, fontFamily: 'monospace' }}>
                Secure via Paystack · Card · Bank transfer · USSD
              </p>
            </div>
          )}

          {/* Payment Success + Export */}
          {paid && (
            <div className="appear card" style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid #BBF7D0', background: '#F0FDF4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>Payment successful!</div>
                  <div style={{ fontSize: 12, color: '#059669' }}>Full report unlocked. We've also sent a copy to <strong>{email}</strong></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={openReport}
                  style={{ flex: 1, padding: '12px 0', background: '#0A5C45', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  📄 Download PDF Report
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`LagosLandCheck Report\n\nLocation: ${result.location_label}\nRisk: ${result.overall}\n\nVerify at lagoslandcheck.com`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '12px 0', background: '#25D366', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  💬 Share on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Ask follow-up */}
          <div className="appear card" style={{ overflow: 'hidden' }}>
            <button onClick={() => setChatOpen(!chatOpen)}
              style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: '#0A5C45', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Ask the Lagos Land Agent</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Follow-up questions about this land</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ transform: chatOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}><path d="M9 18l6-6-6-6"/></svg>
            </button>
            {chatOpen && (
              <div style={{ borderTop: '1px solid #F3F4F6', padding: '0 14px 14px' }}>
                <div style={{ maxHeight: 260, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {chatMessages.length === 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, paddingTop: 8 }}>
                      {['What does the gazette result mean?', 'Is this area safe?', 'What should I ask my lawyer?'].map(q => (
                        <button key={q} onClick={() => setChatInput(q)}
                          style={{ fontSize: 12, padding: '7px 12px', borderRadius: 16, border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#374151', cursor: 'pointer' }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                      <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? '#0A5C45' : '#F9FAFB', color: m.role === 'user' ? '#fff' : '#111827', fontSize: 13, lineHeight: 1.6, border: m.role === 'agent' ? '1px solid #E5E7EB' : 'none' }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ padding: '9px 13px', borderRadius: '4px 16px 16px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace', display: 'inline-block' }}>Thinking...</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about this land..."
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: "'Syne',sans-serif" }} />
                  <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()}
                    style={{ width: 38, height: 38, borderRadius: '50%', background: chatInput.trim() ? '#0A5C45' : '#E5E7EB', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={chatInput.trim() ? '#fff' : '#9CA3AF'} strokeWidth="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', marginTop: '1.25rem', fontFamily: 'monospace', lineHeight: 1.8 }}>
            Pre-screening only · Not legal advice<br/>
            Always engage a licensed Lagos property lawyer for final due diligence
          </p>
        </div>
      )}
      {stage === 'results' && <Footer />}
    </div>
  )
}
