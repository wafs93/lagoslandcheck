'use client'

import { useState, useRef } from 'react'
import Footer from '@/components/Footer'
import { computeDisplayVerdict } from '@/lib/pdf-template'
import { theme, fontDisplay, fontBody, fontMono, GOOGLE_FONTS_IMPORT } from '@/lib/theme'

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

type ReportTier = 'instant' | 'verified'

type Stage = 'input' | 'processing' | 'results'

const CHECKS_CONFIG = [
  { id: 'satellite',  icon: '🛰️', name: 'Satellite imagery',         label: 'Analyzing satellite imagery...' },
  { id: 'gazette',    icon: '📜', name: 'Gazette & govt acquisition', label: 'Checking Lagos State gazettes...' },
  { id: 'flood',      icon: '🌊', name: 'Flood & drainage risk',      label: 'Checking flood risk zones...' },
  { id: 'litigation', icon: '⚖️', name: 'Court litigation',           label: 'Searching court disputes...' },
  { id: 'luc',        icon: '🧾', name: 'Land Use Charge status',     label: 'Verifying LUC compliance...' },
  { id: 'fraud',      icon: '🚨', name: 'Fraud zone & Omo Onile',     label: 'Scanning fraud database...' },
]

// Verdict stamp styling — a single color drives the rotated ink-stamp per level.
// Caution and critical intentionally share stamp red (only the wording differs);
// clear uses registry green; a partial (locked/pending) verdict is neutral ink-soft.
const RISK_CONFIG = {
  CLEAR:    { color: theme.registryGreen, label: 'CLEAR',    title: 'Clear',                sub: 'No major issues found. Continue with standard legal due diligence.' },
  CAUTION:  { color: theme.stampRed,      label: 'CAUTION',  title: 'Proceed with Caution',  sub: 'Concerns detected. Do not pay any money before consulting a lawyer.' },
  CRITICAL: { color: theme.stampRed,      label: 'CRITICAL', title: 'Do Not Proceed',        sub: 'Critical flags found. Strongly advise against proceeding.' },
  PARTIAL:  { color: theme.inkSoft,       label: 'PARTIAL',  title: 'Partial Assessment',    sub: '' },
}

// Per-check evidence-log status styling. 'locked' reads as a SEALED mark
// (Instant tier), 'pending' as a dashed lagoon-blue mini-stamp (Verified tier,
// manual review not yet complete).
const STATUS_CONFIG = {
  clear:    { color: theme.registryGreen, label: 'CLEAR' },
  caution:  { color: theme.stampRed,      label: 'CAUTION' },
  critical: { color: theme.stampRed,      label: 'CRITICAL' },
  running:  { color: theme.lagoonBlue,    label: 'CHECKING' },
  queued:   { color: theme.inkSoft,       label: 'QUEUED' },
  locked:   { color: theme.inkSoft,       label: 'SEALED' },
  pending:  { color: theme.lagoonBlue,    label: 'PENDING' },
}

// Rotated ink-stamp — the overall verdict. Replaces the old colored banner.
function VerdictStamp({ color, label, size = 104 }: { color: string; label: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', border: `3px solid ${color}`, color,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(-8deg)', flexShrink: 0, fontFamily: fontMono, textTransform: 'uppercase',
    }}>
      <span style={{ fontSize: size * 0.09, letterSpacing: 2, opacity: 0.75 }}>LLC</span>
      <span style={{ fontSize: size * 0.145, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.1 }}>{label}</span>
      <span style={{ fontSize: size * 0.08, letterSpacing: 1.5, opacity: 0.6, marginTop: 2 }}>VERIFIED</span>
    </div>
  )
}

// Small rotated stamp badge used on each evidence-log row for clear/caution/critical.
function MiniStamp({ color, label }: { color: string; label: string }) {
  return (
    <div style={{
      padding: '3px 9px', borderRadius: 3, border: `1.5px solid ${color}`, color,
      fontFamily: fontMono, fontSize: 9, fontWeight: 700, letterSpacing: 1,
      transform: 'rotate(-4deg)', display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  )
}

// Circular seal mark — used for a check locked behind the Verified Report
// (Instant tier, label "SEALED") and, with the generic "LOCKED" label, for
// the whole report before any payment has been made.
function SealedMark({ label = 'SEALED' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.inkSoft, flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: fontMono, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{label}</span>
    </div>
  )
}

// Dashed lagoon-blue mini-stamp for a manual check still awaiting review (Verified tier).
function PendingMark() {
  return (
    <div style={{
      padding: '3px 9px', borderRadius: 3, border: `1.5px dashed ${theme.lagoonBlue}`, color: theme.lagoonBlue,
      fontFamily: fontMono, fontSize: 9, fontWeight: 700, letterSpacing: 1, display: 'inline-block',
    }}>
      PENDING
    </div>
  )
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

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
    <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1F19', color: 'rgba(255,255,255,0.5)', gap: 10 }}>
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
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1F19', gap: 10, position: 'absolute', inset: 0, zIndex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: fontMono }}>Loading street view...</span>
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
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.75)', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: '#fff', fontFamily: fontMono }}>
            📷 Nearest road view · {nearestDist}m from this location
          </div>
        </div>
      )}
      {status === 'error' && !nearestUrl && (
        <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A1F19', color: 'rgba(255,255,255,0.5)', gap: 10 }}>
          <span style={{ fontSize: 36 }}>🗺️</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>No Street View coverage here</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: fontMono }}>Common in Lagos residential streets</span>
          {lat && lng && (
            <a href={`https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer"
              style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12, textDecoration: 'none' }}>
              Open in Google Maps →
            </a>
          )}
        </div>
      )}
      {status === 'ok' && !nearestUrl && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: fontMono }}>
          📷 Street View · Ground level
        </div>
      )}
    </div>
  )
}

export default function AgentPage() {
  const [stage, setStage] = useState<Stage>('input')
  const [input, setInput] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [processingStep, setProcessingStep] = useState(0)
  const [processingChecks, setProcessingChecks] = useState<string[]>([])
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [imgZoom, setImgZoom] = useState(false)
  const [activeTab, setActiveTab] = useState<'satellite' | 'street'>('satellite')
  const [paid, setPaid] = useState(false)
  const [paidTier, setPaidTier] = useState<ReportTier | null>(null)
  const [email, setEmail] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [requestTier, setRequestTier] = useState<ReportTier>('instant')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{role:'user'|'agent';text:string}[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const paystackInitInFlight = useRef(false)
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
    const emailValid = isValidEmail(email)
    const hasPaystackKey = Boolean(PAYSTACK_KEY)
    const lat = result?.lat
    const lng = result?.lng

    if (!emailValid || !hasPaystackKey) return
    if (!lat || !lng) return
    if (paystackInitInFlight.current || payLoading) return
    paystackInitInFlight.current = true

    const amountKobo = requestTier === 'verified' ? 5000000 : 500000
    setPayLoading(true)

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => {
      try {
        const handlePaymentSuccess = async (reference: string) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentRef: reference,
                lat: result.lat,
                lng: result.lng,
                overall: result.overall,
                requestTier,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || !verifyData.success) {
              setPayLoading(false)
              paystackInitInFlight.current = false
              alert(verifyData?.error || 'Payment verification failed. Please contact support.')
              return
            }

            setPaidTier(requestTier)
            setPaid(true)
            setPayLoading(false)
            paystackInitInFlight.current = false
          } catch {
            setPayLoading(false)
            paystackInitInFlight.current = false
            alert('Could not verify payment. Please contact support with your payment reference.')
            return
          }

          sessionStorage.setItem('llc_ref', reference)
          sessionStorage.setItem('llc_email', email)
          sessionStorage.setItem('llc_owner_name', ownerName)
          if (result) sessionStorage.setItem('llc_result', JSON.stringify(result))

          if (result?.lat && result?.lng) {
            const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
            fetch('/api/send-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email, refNo, paymentRef: reference,
                lat: result.lat, lng: result.lng,
                locationLabel: result.location_label,
                ownerName,
                overall: result.overall,
                checks: result.checks, requestTier,
              })
            }).catch(err => console.error('[REPORT_EMAIL_FAIL]', err))
          }
        }

        const paystackCallback = (response: { reference: string }) => {
          void handlePaymentSuccess(response.reference)
        }

        const handler = (window as any).PaystackPop.setup({
          key: PAYSTACK_KEY,
          email,
          amount: amountKobo,
          currency: 'NGN',
          ref: `llc_${Date.now()}`,
          callback: paystackCallback,
          onClose: () => {
            setPayLoading(false)
            paystackInitInFlight.current = false
          }
        })

        handler.openIframe()
      } catch {
        setPayLoading(false)
        paystackInitInFlight.current = false
        alert('Could not open payment. Please try again.')
      }
    }

    script.onerror = () => {
      setPayLoading(false)
      paystackInitInFlight.current = false
    }
    document.head.appendChild(script)
  }

  const startNewCheck = () => {
    setPaid(false)
    setPaidTier(null)
    setRequestTier('instant')
    sessionStorage.removeItem('llc_ref')
    sessionStorage.removeItem('llc_email')
    sessionStorage.removeItem('llc_result')
    setStage('input')
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
    const tier = paidTier || requestTier
    const paymentQuery = ref ? `&paymentRef=${encodeURIComponent(ref)}` : ''
    const tierQuery = `&requestTier=${encodeURIComponent(tier)}`
    window.open(`/report?lat=${lat}&lng=${lng}${paymentQuery}${tierQuery}`, '_blank')
  }

  const satelliteUrl = result?.lat && result?.lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${result.lat},${result.lng}&zoom=20&size=640x640&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null
  const streetViewUrl = result?.lat && result?.lng
    ? `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${result.lat},${result.lng}&fov=90&pitch=0&key=${GOOGLE_MAPS_KEY}`
    : null

  // Verdict is derived only from checks actually visible for the purchased tier —
  // agent page never learns whether manual review has completed, so a paid
  // Verified report always reads as "pending" here (the /report page has the
  // real manual-status data and resolves this to a full verdict once complete).
  const effectiveDisplayTier: ReportTier = paidTier || requestTier
  const displayVerdict = result ? computeDisplayVerdict(result.checks, effectiveDisplayTier) : null
  const rc = displayVerdict ? {
    ...RISK_CONFIG[displayVerdict.level],
    sub: displayVerdict.level === 'PARTIAL'
      ? (displayVerdict.reason === 'verified-pending'
          ? '4 of 6 checks clear. Manual court and Land Use Charge review is in progress — full verdict will be available once complete.'
          : '4 of 6 checks clear. Court litigation and Land Use Charge status require the Verified Report for a complete risk verdict.')
      : RISK_CONFIG[displayVerdict.level].sub,
  } : null
  const hasBuilding = result?.checks.find(c => c.id === 'satellite')?.summary?.toLowerCase().includes('building')
  const tierPriceNaira = requestTier === 'verified' ? 50000 : 5000
  const tierName = requestTier === 'verified' ? 'Verified Report' : 'Instant Report'

  // Count of cautions/criticals among the 4 unlocked automated checks — used
  // both for the unlock CTA copy and the pre-payment locked summary card, so
  // it never counts a locked/pending litigation or LUC result the buyer
  // hasn't actually unlocked.
  const cautionCount = result?.checks.filter(c => (c.id === 'satellite' || c.id === 'gazette' || c.id === 'flood' || c.id === 'fraud') && (c.status === 'caution' || c.status === 'critical')).length || 0

  return (
    <div style={{ fontFamily: fontBody, background: theme.paper, minHeight: '100vh' }}>
      <style>{`
        ${GOOGLE_FONTS_IMPORT}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
        .card{background:#fff;border-radius:4px;border:1px solid rgba(23,27,20,0.12);box-shadow:0 1px 8px rgba(15,43,34,0.05)}
        textarea:focus,input:focus{outline:none!important}
      `}</style>

      {/* TOPBAR */}
      <nav style={{ background: theme.inkGreen, padding: '0 1.25rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 0 rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => stage === 'input' ? window.location.href = '/' : startNewCheck()}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '5px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', fontFamily: fontBody }}>
            ← {stage === 'input' ? 'Home' : 'New check'}
          </button>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
              <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z" fill={`${theme.gold}1A`} stroke={theme.gold} strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M13 22 L19.5 29 L31 16" stroke={theme.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: fontDisplay }}>LagosLandCheck</span>
          </a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {stage === 'results' && result?.reportId && (
            <span style={{ fontSize: 11, color: theme.gold, fontFamily: fontMono, letterSpacing: 1 }}>
              {result.reportId}
            </span>
          )}
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.registryGreen, animation: 'pulse 2s infinite', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: fontMono }}>
            {stage === 'input' ? 'Ready' : stage === 'processing' ? 'Analyzing...' : 'Report ready'}
          </span>
        </div>
      </nav>

      {/* STAGE 1: INPUT */}
      {stage === 'input' && (
        <div style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1rem' }} className="appear">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(15,43,34,0.08)', border: '1px solid rgba(15,43,34,0.15)', borderRadius: 24, padding: '5px 14px', fontSize: 10, fontFamily: fontMono, color: '#0F2B22', letterSpacing: '1.5px', marginBottom: 14 }}>
              6 CHECKS · UNDER 2 MINUTES · NO SITE VISIT
            </div>
            <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(24px,5vw,36px)', fontWeight: 600, color: '#171B14', lineHeight: 1.2, marginBottom: 10 }}>
              Where is the land<br/>you want to verify?
            </h1>
            <p style={{ fontSize: 14, color: '#6B6A5E', lineHeight: 1.7 }}>Paste a Google Maps link, coordinates, or any Lagos address.</p>
          </div>

          <div className="card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runVerification(input) } }}
                placeholder="e.g. https://maps.google.com/?q=6.4698,3.5721 or 'Plot 14, Thomas Estate, Ajah'"
                rows={3}
                style={{ width: '100%', border: '1.5px solid rgba(23,27,20,0.14)', borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: fontBody, color: '#171B14', background: '#EDE6D3', lineHeight: 1.6, resize: 'none', display: 'block', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#0F2B22'} onBlur={e => e.target.style.borderColor = 'rgba(23,27,20,0.14)'} />
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="Property owner's full name or company name (optional)"
                  style={{ width: '100%', border: '1.5px solid rgba(23,27,20,0.14)', borderRadius: 12, padding: '11px 14px', fontSize: 14, fontFamily: fontBody, color: '#171B14', background: '#EDE6D3' }}
                />
                <p style={{ marginTop: 6, fontSize: 11, color: '#6B6A5E', lineHeight: 1.6 }}>
                  Optional but recommended: Lagos court record search is name-based, not address-based.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '10px 0' }}>
                {[
                  { label: '🔗 Maps link', val: 'https://maps.google.com/?q=6.5244,3.3792' },
                  { label: '📍 Address', val: 'Plot 14, Thomas Estate, Ajah, Lagos' },
                  { label: '📐 Coordinates', val: '6.4698, 3.5721' },
                ].map(ex => (
                  <button key={ex.label} onClick={() => setInput(ex.val)}
                    style={{ fontSize: 11, padding: '5px 12px', borderRadius: 16, border: '1px solid rgba(23,27,20,0.14)', background: '#EDE6D3', color: '#6B6A5E', cursor: 'pointer', fontFamily: fontMono }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => runVerification(input)} disabled={!input.trim()}
              style={{ width: '100%', padding: '16px 0', background: input.trim() ? 'linear-gradient(135deg,#0F2B22,#0A1F19)' : 'rgba(23,27,20,0.14)', border: 'none', fontSize: 15, fontWeight: 700, color: input.trim() ? '#fff' : '#6B6A5E', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: fontBody }}>
              {input.trim() ? '🔍 Analyze This Land' : 'Paste location above to continue'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.25rem' }}>
            {[{ icon: '🛰️', t: '6 checks', s: 'Satellite + databases' }, { icon: '⚡', t: 'Under 2 min', s: 'Real-time results' }, { icon: '🌍', t: 'Works abroad', s: 'No site visit' }].map(f => (
              <div key={f.t} style={{ background: '#fff', border: '1px solid rgba(23,27,20,0.14)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#171B14' }}>{f.t}</div>
                <div style={{ fontSize: 10, color: '#6B6A5E', fontFamily: fontMono, marginTop: 2 }}>{f.s}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: 10, fontFamily: fontMono, color: '#0F2B22', letterSpacing: '1.5px', marginBottom: 10 }}>6 CHECKS WE RUN</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CHECKS_CONFIG.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#EDE6D3', borderRadius: 9 }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, color: '#171B14', flex: 1 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#6B6A5E', marginTop: '1.25rem', fontFamily: fontMono, lineHeight: 1.8 }}>
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
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#0F2B22,#0A1F19)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 2s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10" opacity="0.3"/></svg>
              </div>
              <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: '#171B14', marginBottom: 6 }}>Analyzing the land</h2>
              <p style={{ fontSize: 12, color: '#6B6A5E', fontFamily: fontMono }}>{input.slice(0, 55)}{input.length > 55 ? '...' : ''}</p>
            </div>

            <div style={{ background: '#EDE6D3', borderRadius: 8, height: 6, marginBottom: '1.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: `linear-gradient(90deg,${theme.inkGreen},${theme.gold})`, borderRadius: 8, width: `${Math.min(100, (processingStep / 7) * 100)}%`, transition: 'width 0.6s ease' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[{ id: 'locate', icon: '📍', label: 'Locating land on the map...' }, ...CHECKS_CONFIG.map(c => ({ id: c.id, icon: c.icon, label: c.label }))].map((step, i) => {
                const done = processingChecks.includes(step.id)
                const active = processingStep === i + 1 && !done
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: done ? '#E8F3EC' : active ? '#EAF3F7' : '#EDE6D3', border: `1px solid ${done ? '#BFE0CC' : active ? '#BFDDE7' : '#EDE6D3'}`, transition: 'all 0.3s' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? '#3E8A63' : active ? '#6FA8C7' : 'rgba(23,27,20,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        : active ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                        : <span style={{ fontSize: 9, color: '#6B6A5E', fontWeight: 700 }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: 13, color: done ? '#3E8A63' : active ? '#6FA8C7' : '#6B6A5E', fontWeight: done || active ? 500 : 400 }}>
                      {step.icon} {step.label}
                    </span>
                    {done && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#3E8A63', fontFamily: fontMono }}>✓</span>}
                    {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6FA8C7', fontFamily: fontMono, animation: 'pulse 1s infinite' }}>...</span>}
                  </div>
                )
              })}
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#6B6A5E', marginTop: '1.5rem', fontFamily: fontMono }}>Under 2 minutes · Do not close this page</p>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULTS — case file */}
      {stage === 'results' && result && rc && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.25rem 1rem 4rem' }}>

          {/* Case header */}
          <div className="appear" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 2, marginBottom: 6 }}>CASE FILE</p>
                <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(20px,4vw,28px)', fontWeight: 600, color: theme.ink, lineHeight: 1.25 }}>
                  {result.location_label}
                </h1>
              </div>
              {result.lat && result.lng && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 1.5, marginBottom: 3 }}>COORDINATES</div>
                  <div style={{ fontSize: 12, fontFamily: fontMono, color: theme.ink }}>{result.lat.toFixed(4)}°N, {result.lng.toFixed(4)}°E</div>
                </div>
              )}
            </div>
          </div>

          {/* Verdict block — ink stamp, not a colored banner */}
          {paid ? (
            <div className="appear card" style={{ marginBottom: '1rem', padding: '1.5rem', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <VerdictStamp color={rc.color} label={rc.label} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 1.5, marginBottom: 6 }}>OVERALL RISK ASSESSMENT</p>
                <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: theme.ink, marginBottom: 6 }}>{rc.title}</div>
                <p style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 1.6 }}>{rc.sub}</p>
                {displayVerdict?.reason === 'instant-locked' && (
                  <a href="/agent" style={{ fontSize: 11, color: theme.inkGreen, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                    Upgrade to Verified Report →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="appear card" style={{ marginBottom: '1rem', padding: '1.5rem', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', border: '1px dashed rgba(23,27,20,0.25)' }}>
              <div style={{ color: theme.inkSoft, flexShrink: 0 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 1.5, marginBottom: 6 }}>VERIFICATION SUMMARY · SEALED</p>
                <div style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: theme.ink }}>
                  6 checks completed — {cautionCount === 0 ? 'no concerns flagged' : `${cautionCount} concern${cautionCount === 1 ? '' : 's'} flagged`}
                </div>
                <p style={{ fontSize: 12, color: theme.inkSoft, marginTop: 6 }}>Unlock the full report to see the risk verdict and detailed findings.</p>
              </div>
            </div>
          )}

          {/* Image Viewer */}
          {(satelliteUrl || streetViewUrl) && (
            <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: '#0A1F19', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { id: 'satellite' as const, label: '🛰️ Satellite', show: !!satelliteUrl },
                  { id: 'street' as const, label: '📷 Street View', show: !!streetViewUrl },
                ].filter(t => t.show).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: '10px 14px', background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #C7A65C' : '2px solid transparent', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: fontMono, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {tab.label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ padding: '10px 10px', fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: fontMono, alignSelf: 'center' }}>
                  {result.lat?.toFixed(4)}°N {result.lng?.toFixed(4)}°E
                </div>
              </div>

              <div style={{ display: activeTab === 'satellite' ? 'block' : 'none' }}>
                {satelliteUrl ? (
                  <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setImgZoom(true)}>
                    <img src={satelliteUrl} alt="Satellite" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: fontMono }}>
                      🛰️ Tap to zoom · AI analysed · zoom 20
                    </div>
                    {hasBuilding && paid && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: `${theme.stampRed}EB`, borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: fontMono, fontWeight: 700 }}>
                        ⚠️ BUILDING DETECTED
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ height: 260, background: '#0A1F19', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: fontMono }}>
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
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontFamily: fontMono }}>Tap anywhere to close</p>
              </div>
            </div>
          )}

          {/* Evidence log — 6 numbered check entries */}
          <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(23,27,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 2 }}>EVIDENCE LOG · 6 CHECKS</p>
              <span style={{ fontSize: 10, fontFamily: fontMono, color: paid ? theme.registryGreen : theme.inkSoft, letterSpacing: 1, fontWeight: 600 }}>
                {paid ? '✓ FULL ACCESS' : 'PREVIEW MODE'}
              </span>
            </div>
            {result.checks.map((check, i) => {
              const needsManualCheck = check.id === 'litigation' || check.id === 'luc'
              const effectivePaidTier = paid ? paidTier : null

              let displayStatus: keyof typeof STATUS_CONFIG = check.status
              let displaySummary = check.summary
              let displayDetails = check.details
              let isLockedCard = false

              if (needsManualCheck && effectivePaidTier === 'instant') {
                isLockedCard = true
                displayStatus = 'locked'
                displaySummary = ''
                displayDetails = ''
              } else if (needsManualCheck && effectivePaidTier === 'verified') {
                displayStatus = 'pending'
                displaySummary = 'Manual verification pending — results will be added within 24-48 hours.'
                displayDetails = ''
              }

              const sc = STATUS_CONFIG[displayStatus] || STATUS_CONFIG.queued
              const isOpen = expanded === check.id && paid
              return (
                <div key={check.id}
                  style={{ display: 'flex', gap: 16, padding: '16px 18px', borderBottom: i < result.checks.length - 1 ? '1px solid rgba(23,27,20,0.08)' : 'none', cursor: paid && !isLockedCard ? 'pointer' : 'default', transition: 'background 0.15s' }}
                  onClick={() => paid && !isLockedCard && setExpanded(isOpen ? null : check.id)}>
                  <div style={{ fontFamily: fontMono, fontSize: 13, fontWeight: 600, color: theme.inkSoft, flexShrink: 0, width: 22, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.ink, marginBottom: paid ? 4 : 0 }}>{check.name}</div>
                    {paid && (
                      isLockedCard ? (
                        <>
                          <p style={{ fontSize: 12, color: theme.inkSoft, lineHeight: 1.5 }}>
                            Included in the Verified Report — requires manual registry search.
                          </p>
                          <a
                            href="/agent"
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 11, color: theme.inkGreen, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: 4 }}
                          >
                            Upgrade to Verified Report →
                          </a>
                        </>
                      ) : (
                        <p style={{ fontSize: 12, color: theme.inkSoft, lineHeight: 1.5 }}>{displaySummary}</p>
                      )
                    )}
                    {isOpen && paid && !isLockedCard && displayDetails && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px dashed rgba(23,27,20,0.15)' }}>
                        <p style={{ fontSize: 12, color: theme.ink, lineHeight: 1.75 }}>{displayDetails}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    {!paid ? (
                      <SealedMark label="LOCKED" />
                    ) : displayStatus === 'locked' ? (
                      <SealedMark />
                    ) : displayStatus === 'pending' ? (
                      <PendingMark />
                    ) : (
                      <MiniStamp color={sc.color} label={sc.label} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* SINGLE PAYWALL CTA — one price, one button */}
          {!paid && (
            <div className="appear card" style={{ background: `linear-gradient(135deg,${theme.inkGreen},${theme.inkGreenDeep})`, border: 'none', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              {/* Gold accent stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${theme.gold} 0%,${theme.gold} 30%,transparent 30%,transparent 70%,${theme.gold} 70%)` }} />

              <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.gold, letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>UNSEAL THE FULL REPORT</p>
              <h3 style={{ fontFamily: fontDisplay, fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
                Unseal all 6 detailed findings
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

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontFamily: fontMono, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 6 }}>
                  SELECT REPORT TYPE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setRequestTier('instant')}
                    style={{ textAlign: 'left', padding: '10px 11px', borderRadius: 4, border: requestTier === 'instant' ? `1.5px solid ${theme.gold}` : '1px solid rgba(255,255,255,0.2)', background: requestTier === 'instant' ? `${theme.gold}29` : 'rgba(255,255,255,0.07)', color: '#fff', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Instant Report</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>₦5,000 · Delivered immediately</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestTier('verified')}
                    style={{ textAlign: 'left', padding: '10px 11px', borderRadius: 4, border: requestTier === 'verified' ? `1.5px solid ${theme.gold}` : '1px solid rgba(255,255,255,0.2)', background: requestTier === 'verified' ? `${theme.gold}29` : 'rgba(255,255,255,0.07)', color: '#fff', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Verified Report</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>₦50,000 · Manual court + LUC, 24-48h</div>
                  </button>
                </div>
              </div>

              {/* Price row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 4, marginBottom: 12, border: `1px solid ${theme.gold}40` }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: fontMono, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 2 }}>ONE-TIME · NO SUBSCRIPTION</div>
                  <div style={{ fontFamily: fontDisplay, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                    ₦{tierPriceNaira.toLocaleString()}
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8 }}>{tierName}</span>
                  </div>
                </div>
              </div>

              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && initPaystack()}
                placeholder="your@email.com — receipt + report sent here"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: `1.5px solid ${email && !isValidEmail(email) ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.25)'}`, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontFamily: fontBody, marginBottom: 4 }} />
              {email && !isValidEmail(email) && (
                <p style={{ fontSize: 11, color: 'rgba(239,68,68,0.8)', marginBottom: 6, fontFamily: fontMono }}>Please enter a valid email address</p>
              )}
              <div style={{ marginBottom: isValidEmail(email) ? 10 : 0 }} />

              <button onClick={initPaystack} disabled={payLoading || !isValidEmail(email)}
                style={{ width: '100%', padding: '15px 0', background: isValidEmail(email) ? `linear-gradient(135deg,${theme.gold},#A8863F)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isValidEmail(email) ? 'pointer' : 'not-allowed', fontFamily: fontBody, boxShadow: isValidEmail(email) ? `0 4px 12px ${theme.gold}4D` : 'none' }}>
                {payLoading ? 'Opening payment...' : `Unseal ${tierName} — ₦${tierPriceNaira.toLocaleString()}`}
              </button>
              <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 10, fontFamily: fontMono }}>
                Secure via Paystack · Card · Bank transfer · USSD
              </p>
            </div>
          )}

          {/* Payment Success + Export */}
          {paid && (
            <div className="appear card" style={{ padding: '1.5rem', marginBottom: '1rem', border: `1px solid ${theme.registryGreen}4D`, background: `${theme.registryGreen}0F` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, background: theme.registryGreen, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.ink }}>Payment successful — case file sealed</div>
                  <div style={{ fontSize: 12, color: theme.inkSoft }}>Full report unlocked. We've also sent a copy to <strong>{email}</strong></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={openReport}
                  style={{ flex: 1, padding: '12px 0', background: theme.inkGreen, border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: fontBody }}>
                  📄 Download PDF Report
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`LagosLandCheck Report\n\nLocation: ${result.location_label}\nRisk: ${result.overall}\n\nVerify at lagoslandcheck.com`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: '12px 0', background: '#25D366', borderRadius: 4, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: fontBody }}>
                  💬 Share on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Ask follow-up */}
          <div className="appear card" style={{ overflow: 'hidden' }}>
            <button onClick={() => setChatOpen(!chatOpen)}
              style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: '#0F2B22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#171B14' }}>Ask the Lagos Land Agent</div>
                <div style={{ fontSize: 11, color: '#6B6A5E' }}>Follow-up questions about this land</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6A5E" strokeWidth="2" style={{ transform: chatOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}><path d="M9 18l6-6-6-6"/></svg>
            </button>
            {chatOpen && (
              <div style={{ borderTop: '1px solid #EDE6D3', padding: '0 14px 14px' }}>
                <div style={{ maxHeight: 260, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {chatMessages.length === 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, paddingTop: 8 }}>
                      {['What does the gazette result mean?', 'Is this area safe?', 'What should I ask my lawyer?'].map(q => (
                        <button key={q} onClick={() => setChatInput(q)}
                          style={{ fontSize: 12, padding: '7px 12px', borderRadius: 16, border: '1px solid rgba(23,27,20,0.14)', background: '#EDE6D3', color: '#171B14', cursor: 'pointer' }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                      <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? '#0F2B22' : '#EDE6D3', color: m.role === 'user' ? '#fff' : '#171B14', fontSize: 13, lineHeight: 1.6, border: m.role === 'agent' ? '1px solid rgba(23,27,20,0.14)' : 'none' }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ padding: '9px 13px', borderRadius: '4px 16px 16px 16px', background: '#EDE6D3', border: '1px solid rgba(23,27,20,0.14)', fontSize: 12, color: '#6B6A5E', fontFamily: fontMono, display: 'inline-block' }}>Thinking...</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about this land..."
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid rgba(23,27,20,0.14)', borderRadius: 10, fontSize: 13, fontFamily: fontBody }} />
                  <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()}
                    style={{ width: 38, height: 38, borderRadius: '50%', background: chatInput.trim() ? '#0F2B22' : 'rgba(23,27,20,0.14)', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={chatInput.trim() ? '#fff' : '#6B6A5E'} strokeWidth="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 10, color: '#6B6A5E', marginTop: '1.25rem', fontFamily: fontMono, lineHeight: 1.8 }}>
            Pre-screening only · Not legal advice<br/>
            Always engage a licensed Lagos property lawyer for final due diligence
          </p>
        </div>
      )}
      {stage === 'results' && <Footer />}
    </div>
  )
}
