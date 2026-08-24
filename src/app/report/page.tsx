'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildPdfHtml, computeDisplayVerdict } from '@/lib/pdf-template'
import Footer from '@/components/Footer'
import { theme, fontDisplay, fontBody, fontMono, GOOGLE_FONTS_IMPORT } from '@/lib/theme'

interface Check {
  id: string
  name: string
  status: string
  summary: string
  details: string
}

// Verdict stamp styling — a single color drives the rotated ink-stamp per level.
// Caution and critical intentionally share stamp red (only the wording differs);
// clear uses registry green; a partial (locked/pending) verdict is neutral ink-soft.
const verdictConfig = {
  CLEAR:    { color: theme.registryGreen, label: 'CLEAR',    title: 'Clear',                sub: 'No major issues found. Continue with standard legal due diligence.' },
  CAUTION:  { color: theme.stampRed,      label: 'CAUTION',  title: 'Proceed with Caution',  sub: 'Concerns detected. Do not pay any money before consulting a lawyer.' },
  CRITICAL: { color: theme.stampRed,      label: 'CRITICAL', title: 'Do Not Proceed',        sub: 'Critical flags found. Strongly advise against proceeding.' },
  PARTIAL:  { color: theme.inkSoft,       label: 'PARTIAL',  title: 'Partial Assessment',    sub: '' },
}

// Per-check evidence-log status styling. 'locked' reads as a SEALED mark
// (Instant tier), 'pending' as a dashed lagoon-blue mini-stamp (Verified tier,
// manual review not yet complete).
const statusConfig = {
  clear:    { color: theme.registryGreen, label: 'CLEAR' },
  caution:  { color: theme.stampRed,      label: 'CAUTION' },
  critical: { color: theme.stampRed,      label: 'CRITICAL' },
  queued:   { color: theme.inkSoft,       label: 'QUEUED' },
  running:  { color: theme.lagoonBlue,    label: 'CHECKING' },
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
const checkIcons: Record<string, string> = { satellite: '🛰️', gazette: '📜', flood: '🌊', litigation: '⚖️', luc: '🧾', fraud: '🚨' }

function generatePDF(
  checks: Check[],
  overall: string,
  lat: string,
  lng: string,
  locationLabel: string,
  tier: ReportTier,
  manualStatusPayload: ManualStatusPayload | null
) {
  const refNo = `LLC-${Date.now().toString(36).toUpperCase()}`
  const html = buildPdfHtml({
    checks,
    overall,
    lat,
    lng,
    locationLabel,
    refNo,
    tier,
    manualStatus: manualStatusPayload?.manualStatus,
    manualCourtFinding: manualStatusPayload?.manualCourtFinding,
    manualLucFinding: manualStatusPayload?.manualLucFinding,
    manualCourtStatus: manualStatusPayload?.manualCourtStatus,
    manualLucStatus: manualStatusPayload?.manualLucStatus,
    manualCompletedAt: manualStatusPayload?.manualCompletedAt,
  })
  const win = window.open('', '_blank')
  if (!win) { alert('Allow popups to download PDF. Check your browser popup blocker.'); return }
  win.document.open()
  win.document.write(html)
  win.document.close()
  setTimeout(() => { try { win.focus(); win.print() } catch (e) { console.error(e) } }, 1500)
}

type ReportTier = 'instant' | 'verified'
type ManualStatus = 'not_required' | 'pending' | 'completed'

interface ManualStatusPayload {
  requestTier: ReportTier
  manualStatus: ManualStatus
  manualCompletedAt: string | null
  manualCourtFinding?: string
  manualLucFinding?: string
  manualCourtStatus?: string
  manualLucStatus?: string
}

function formatManualDate(value: string | null): string {
  if (!value) return 'recently'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'recently'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ReportContent() {
  const params = useSearchParams()
  const rawLat = params.get('lat')
  const rawLng = params.get('lng')
  const paymentRefParam = params.get('paymentRef')
  const requestTierParam = params.get('requestTier')

  const [lat, setLat] = useState<string>('')
  const [lng, setLng] = useState<string>('')
  const [locationLabel, setLocationLabel] = useState<string>('')
  const [checks, setChecks] = useState<Check[]>([])
  const [overall, setOverall] = useState<string>('CAUTION')
  const [loading, setLoading] = useState(true)
  const [paidState, setPaidState] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const [email, setEmail] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [requestTier, setRequestTier] = useState<ReportTier>('instant')
  const [paidTier, setPaidTier] = useState<ReportTier | null>(null)
  const [statusPaymentRef, setStatusPaymentRef] = useState<string>(paymentRefParam || '')
  const [manualStatusPayload, setManualStatusPayload] = useState<ManualStatusPayload | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [imgZoom, setImgZoom] = useState(false)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  useEffect(() => {
    if (requestTierParam === 'verified') {
      setRequestTier('verified')
      return
    }
    if (requestTierParam === 'instant') {
      setRequestTier('instant')
    }
  }, [requestTierParam])

  useEffect(() => {
    const storedOwnerName = sessionStorage.getItem('llc_owner_name')
    if (storedOwnerName) {
      setOwnerName(storedOwnerName)
    }

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
            requestTier: requestTierParam === 'verified' ? 'verified' : 'instant',
          }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setPaidState(true)
          setPaidTier(requestTierParam === 'verified' ? 'verified' : 'instant')
          setStatusPaymentRef(paymentRefParam)
          setUnlockError('')
          return
        }
        setUnlockError(data?.error || 'Payment verification failed.')
      } catch {
        setUnlockError('Could not verify payment reference.')
      }
    })()
  }, [paymentRefParam, requestTierParam, paidState, lat, lng, overall])

  useEffect(() => {
    if (!paidState || !statusPaymentRef || !lat || !lng) return
    ;(async () => {
      try {
        const res = await fetch(
          `/api/report-status?paymentRef=${encodeURIComponent(statusPaymentRef)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
        )
        const data = await res.json()
        if (!res.ok || !data?.success) return

        const payload: ManualStatusPayload = {
          requestTier: data.requestTier === 'verified' ? 'verified' : 'instant',
          manualStatus: data.manualStatus === 'completed' ? 'completed' : data.manualStatus === 'pending' ? 'pending' : 'not_required',
          manualCompletedAt: data.manualCompletedAt || null,
        }

        if (payload.manualStatus === 'completed') {
          payload.manualCourtFinding = typeof data.manualCourtFinding === 'string' ? data.manualCourtFinding : ''
          payload.manualLucFinding = typeof data.manualLucFinding === 'string' ? data.manualLucFinding : ''
          payload.manualCourtStatus = typeof data.manualCourtStatus === 'string' ? data.manualCourtStatus : ''
          payload.manualLucStatus = typeof data.manualLucStatus === 'string' ? data.manualLucStatus : ''
        }

        setRequestTier(payload.requestTier)
        setPaidTier(payload.requestTier)
        setManualStatusPayload(payload)
      } catch {
        // Keep fallback UI messaging if report-status fetch fails.
      }
    })()
  }, [paidState, statusPaymentRef, lat, lng])

  const initPaystack = () => {
    if (!isValidEmail(email) || !PAYSTACK_KEY) return
    const amountKobo = requestTier === 'verified' ? 5000000 : 500000
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
            setPaidTier(requestTier)
            setStatusPaymentRef(reference)
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
              ownerName,
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

  // Verdict is derived only from checks actually visible for the purchased tier —
  // litigation/LUC only count once manual_status is 'completed', never from the
  // automated fallback while still pending or entirely locked (Instant tier).
  const effectiveDisplayTier: ReportTier = paidTier || manualStatusPayload?.requestTier || requestTier
  const displayVerdict = checks.length > 0
    ? computeDisplayVerdict(checks, effectiveDisplayTier, {
        manualStatus: manualStatusPayload?.manualStatus,
        manualCourtStatus: manualStatusPayload?.manualCourtStatus,
        manualLucStatus: manualStatusPayload?.manualLucStatus,
      })
    : null
  const vc = displayVerdict ? {
    ...verdictConfig[displayVerdict.level],
    sub: displayVerdict.level === 'PARTIAL'
      ? (displayVerdict.reason === 'verified-pending'
          ? '4 of 6 checks clear. Manual court and Land Use Charge review is in progress — full verdict will be available once complete.'
          : '4 of 6 checks clear. Court litigation and Land Use Charge status require the Verified Report for a complete risk verdict.')
      : verdictConfig[displayVerdict.level].sub,
  } : verdictConfig.CAUTION
  const hasCoords = lat && lng && lat !== '0' && lng !== '0'
  const satelliteUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x360&maptype=hybrid&key=${GOOGLE_MAPS_KEY}`
    : null

  // Concern count among the 4 unlocked automated checks only — never counts a
  // locked/pending litigation or LUC result the buyer hasn't actually unlocked.
  const cautionCount = checks.filter(c => (c.id === 'satellite' || c.id === 'gazette' || c.id === 'flood' || c.id === 'fraud') && (c.status === 'caution' || c.status === 'critical')).length
  const tierPriceNaira = requestTier === 'verified' ? 50000 : 5000
  const tierName = requestTier === 'verified' ? 'Verified Report' : 'Instant Report'

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.paper, fontFamily: fontBody }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.inkGreen} strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <p style={{ color: theme.inkSoft, fontSize: 14 }}>Loading report...</p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: fontBody, background: theme.paper, minHeight: '100vh' }}>
      <style>{`
        ${GOOGLE_FONTS_IMPORT}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
        .card{background:#fff;border-radius:4px;border:1px solid rgba(23,27,20,0.12);box-shadow:0 1px 8px rgba(15,43,34,0.05)}
      `}</style>

      <nav style={{
        background: theme.inkGreen,
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
              fill={`${theme.gold}1A`} stroke={theme.gold} strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M13 22 L19.5 29 L31 16"
              stroke={theme.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>LagosLandCheck</div>
            <div style={{ fontFamily: fontMono, fontSize: 7, color: theme.gold, letterSpacing: '2px', marginTop: 1 }}>VERIFICATION INTELLIGENCE</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {statusPaymentRef && (
            <span style={{ fontSize: 11, color: theme.gold, fontFamily: fontMono, letterSpacing: 1 }}>
              REF {statusPaymentRef.slice(-10).toUpperCase()}
            </span>
          )}
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="/contact" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Contact</a>
          <a href="/agent" style={{ padding: '7px 14px', background: `${theme.gold}26`, border: `1px solid ${theme.gold}4D`, borderRadius: 4, fontSize: 13, fontWeight: 600, color: theme.gold, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.registryGreen, display: 'inline-block' }} />
            Run a check
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* Case header */}
        {hasCoords && (
          <div className="appear" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 2, marginBottom: 6 }}>CASE FILE</p>
                <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(20px,4vw,28px)', fontWeight: 600, color: theme.ink, lineHeight: 1.25 }}>
                  {locationLabel || `${parseFloat(lat).toFixed(4)}°N, ${parseFloat(lng).toFixed(4)}°E`}
                </h1>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 1.5, marginBottom: 3 }}>COORDINATES</div>
                <div style={{ fontSize: 12, fontFamily: fontMono, color: theme.ink }}>{parseFloat(lat).toFixed(4)}°N, {parseFloat(lng).toFixed(4)}°E</div>
              </div>
            </div>
          </div>
        )}

        {unlockError && (
          <div className="appear card" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: `${theme.stampRed}14`, border: `1px solid ${theme.stampRed}66` }}>
            <p style={{ fontSize: 12, color: theme.stampRed, lineHeight: 1.6 }}>{unlockError}</p>
          </div>
        )}

        {!hasCoords && (
          <div className="appear card" style={{ padding: '1.5rem', marginBottom: '1rem', background: `${theme.lagoonBlue}14`, border: `1px solid ${theme.lagoonBlue}66` }}>
            <p style={{ fontSize: 14, color: theme.ink, fontWeight: 600, marginBottom: 6 }}>⚠️ Location data missing</p>
            <p style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 1.6 }}>
              Please go back to the agent and verify a land location first. Use a Google Maps link for best results.
            </p>
            <a href="/agent" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: theme.inkGreen, borderRadius: 4, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Go to Agent →
            </a>
          </div>
        )}

        {/* Verdict block — ink stamp, not a colored banner */}
        {paidState ? (
          <div className="appear card" style={{ marginBottom: '1rem', padding: '1.5rem', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictStamp color={vc.color} label={vc.label} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 1.5, marginBottom: 6 }}>OVERALL RISK ASSESSMENT</p>
              <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: theme.ink, marginBottom: 6 }}>{vc.title}</div>
              <p style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 1.6 }}>{vc.sub}</p>
              {displayVerdict?.reason === 'instant-locked' && (
                <a href="/agent" style={{ fontSize: 11, color: theme.inkGreen, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                  Upgrade to Verified Report →
                </a>
              )}
            </div>
          </div>
        ) : (
          checks.length > 0 && (
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
          )
        )}

        {hasCoords && satelliteUrl && (
          <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ background: '#0A1F19', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontFamily: fontMono, color: 'rgba(255,255,255,0.6)' }}>🛰️ Satellite · zoom 20 · hybrid</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: fontMono, color: 'rgba(255,255,255,0.3)' }}>Tap to zoom</span>
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
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontFamily: fontMono }}>Tap to close</p>
            </div>
          </div>
        )}

        {/* Evidence log — 6 numbered check entries */}
        {checks.length > 0 && (
          <div className="appear card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(23,27,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkSoft, letterSpacing: 2 }}>EVIDENCE LOG · 6 CHECKS</p>
              <span style={{ fontSize: 10, fontFamily: fontMono, color: paidState ? theme.registryGreen : theme.inkSoft, letterSpacing: 1, fontWeight: 600 }}>
                {paidState ? '✓ FULL ACCESS' : 'PREVIEW MODE'}
              </span>
            </div>
            {checks.map((check, i) => {
              const needsManualCheck = check.id === 'litigation' || check.id === 'luc'
              const effectiveTier = paidState ? (paidTier || manualStatusPayload?.requestTier || requestTier) : null
              const completedAtLabel = formatManualDate(manualStatusPayload?.manualCompletedAt || null)

              let displayStatus = check.status
              let displaySummary = check.summary
              let displayDetails = check.details
              let isLockedCard = false

              if (needsManualCheck && effectiveTier === 'instant') {
                isLockedCard = true
                displayStatus = 'locked'
                displaySummary = ''
                displayDetails = ''
              } else if (needsManualCheck && effectiveTier === 'verified') {
                if (manualStatusPayload?.manualStatus === 'completed') {
                  const manualStatusValue = check.id === 'litigation'
                    ? manualStatusPayload.manualCourtStatus
                    : manualStatusPayload.manualLucStatus
                  const finding = check.id === 'litigation'
                    ? (manualStatusPayload.manualCourtFinding || 'No court finding provided.')
                    : (manualStatusPayload.manualLucFinding || 'No LUC finding provided.')
                  displayStatus = manualStatusValue || 'caution'
                  displaySummary = `Manually verified by LagosLandCheck on ${completedAtLabel}.`
                  displayDetails = finding
                } else {
                  displayStatus = 'pending'
                  displaySummary = 'Manual verification pending — results will be added within 24-48 hours.'
                  displayDetails = ''
                }
              }

              const sc = statusConfig[displayStatus as keyof typeof statusConfig] || statusConfig.queued
              const isOpen = expanded === check.id && paidState
              return (
                <div key={check.id}
                  style={{ display: 'flex', gap: 16, padding: '16px 18px', borderBottom: i < checks.length - 1 ? '1px solid rgba(23,27,20,0.08)' : 'none', cursor: paidState && !isLockedCard ? 'pointer' : 'default' }}
                  onClick={() => paidState && !isLockedCard && setExpanded(isOpen ? null : check.id)}>
                  <div style={{ fontFamily: fontMono, fontSize: 13, fontWeight: 600, color: theme.inkSoft, flexShrink: 0, width: 22, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.ink, marginBottom: paidState ? 4 : 0 }}>{check.name}</div>
                    {paidState && (
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
                    {isOpen && !isLockedCard && displayDetails && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px dashed rgba(23,27,20,0.15)' }}>
                        <p style={{ fontSize: 12, color: theme.ink, lineHeight: 1.75 }}>{displayDetails}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    {!paidState ? (
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
        )}

        {!paidState && checks.length > 0 && (
          <div className="appear card" style={{ background: `linear-gradient(135deg,${theme.inkGreen},${theme.inkGreenDeep})`, border: 'none', padding: '1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${theme.gold} 0%,${theme.gold} 30%,transparent 30%,transparent 70%,${theme.gold} 70%)` }} />

            <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.gold, letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>UNSEAL THE FULL REPORT</p>
            <h3 style={{ fontFamily: fontDisplay, fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
              Unseal all 6 detailed findings
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 4, marginBottom: 12, border: `1px solid ${theme.gold}40` }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: fontMono, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 2 }}>ONE-TIME · NO SUBSCRIPTION</div>
                <div style={{ fontFamily: fontDisplay, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  ₦{tierPriceNaira.toLocaleString()}
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8 }}>{tierName}</span>
                </div>
              </div>
            </div>

            <input
              type="text"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              placeholder="Property owner's full name or company name (optional)"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, marginBottom: 6, fontFamily: fontBody }}
            />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 10, lineHeight: 1.6 }}>
              Optional but recommended: Lagos court record search is name-based, not address-based.
            </p>

            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && initPaystack()}
              placeholder="your@email.com — receipt + report sent here"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: `1.5px solid ${email && !isValidEmail(email) ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.25)'}`, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, marginBottom: 10, fontFamily: fontBody }} />
            <button onClick={initPaystack} disabled={payLoading || !isValidEmail(email)}
              style={{ width: '100%', padding: '15px 0', background: isValidEmail(email) ? `linear-gradient(135deg,${theme.gold},#A8863F)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isValidEmail(email) ? 'pointer' : 'not-allowed', fontFamily: fontBody, boxShadow: isValidEmail(email) ? `0 4px 12px ${theme.gold}4D` : 'none' }}>
              {payLoading ? 'Opening payment...' : `Unseal ${tierName} — ₦${tierPriceNaira.toLocaleString()}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 10, fontFamily: fontMono }}>Secure via Paystack · Card · Bank transfer · USSD</p>
          </div>
        )}

        {paidState && (
          <div className="appear card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 10, fontFamily: fontMono, color: theme.inkGreen, letterSpacing: '1.5px', marginBottom: 10 }}>EXPORT YOUR REPORT</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => generatePDF(checks, overall, lat, lng, locationLabel, paidTier || requestTier, manualStatusPayload)}
                style={{ flex: 1, padding: '12px 0', background: theme.inkGreen, border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: fontBody }}>
                📄 Download PDF
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`LagosLandCheck Report\nLocation: ${locationLabel || `${lat},${lng}`}\nRisk: ${overall}\n\nVerify at lagoslandcheck.com`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, padding: '12px 0', background: '#25D366', borderRadius: 4, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: fontBody }}>
                💬 Share on WhatsApp
              </a>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: theme.inkSoft, fontFamily: fontMono, lineHeight: 1.8 }}>
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
