'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

type CheckStatus = 'queued' | 'running' | 'clear' | 'caution' | 'critical'

interface Check {
  id: string
  name: string
  status: CheckStatus
  summary: string
  details: string
}

const CHECK_NAMES: Record<string, string> = {
  satellite: 'Satellite imagery',
  gazette: 'Gazette & govt acquisition',
  flood: 'Flood & drainage risk',
  litigation: 'Court litigation search',
  luc: 'Land Use Charge status',
  fraud: 'Fraud zone & Omo Onile alert',
}

function ReportContent() {
  const params = useSearchParams()
  const router = useRouter()
  const lat = params.get('lat')
  const lng = params.get('lng')

  const [phase, setPhase] = useState<'loading' | 'report'>('loading')
  const [checks, setChecks] = useState<Check[]>(
    Object.keys(CHECK_NAMES).map(id => ({
      id, name: CHECK_NAMES[id], status: 'queued', summary: '', details: ''
    }))
  )
  const [expanded, setExpanded] = useState<string | null>('gazette')
  const [overall, setOverall] = useState<'CLEAR' | 'CAUTION' | 'CRITICAL'>('CAUTION')

  useEffect(() => {
    if (!lat || !lng) return
    runVerification()
  }, [lat, lng])

  const runVerification = async () => {
    // Set all to running
    setChecks(prev => prev.map(c => ({ ...c, status: 'running' })))

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: parseFloat(lat!), lng: parseFloat(lng!) })
      })
      const data = await res.json()

      // Stagger the reveal for UX effect
      data.checks.forEach((check: Check, i: number) => {
        setTimeout(() => {
          setChecks(prev => prev.map(c => c.id === check.id ? check : c))
        }, i * 350)
      })

      setTimeout(() => {
        setOverall(data.overall)
        setPhase('report')
      }, data.checks.length * 350 + 500)

    } catch {
      // On error show a safe fallback
      setPhase('report')
    }
  }

  const verdictConfig = {
    CLEAR: { bg: '#EAF3DE', border: '#3B6D11', label: 'ALL CHECKS PASSED', title: 'Land appears clear', color: '#27500A' },
    CAUTION: { bg: '#FAEEDA', border: '#854F0B', label: 'PROCEED WITH CAUTION', title: 'Concerns detected', color: '#633806' },
    CRITICAL: { bg: '#FCEBEB', border: '#A32D2D', label: 'DO NOT PROCEED', title: 'Critical flags found', color: '#791F1F' },
  }

  const vc = verdictConfig[overall]

  const dotColor = (s: CheckStatus) => {
    if (s === 'clear') return '#3B6D11'
    if (s === 'caution') return '#EF9F27'
    if (s === 'critical') return '#E24B4A'
    return '#ccc'
  }

  const badgeStyle = (s: CheckStatus): React.CSSProperties => {
    if (s === 'clear') return { background: '#C0DD97', color: '#27500A' }
    if (s === 'caution') return { background: '#FAC775', color: '#633806' }
    if (s === 'critical') return { background: '#F7C1C1', color: '#791F1F' }
    return { background: '#eee', color: '#888' }
  }

  const badgeLabel = (s: CheckStatus, id: string) => {
    if (s === 'queued') return 'QUEUED'
    if (s === 'running') return 'CHECKING…'
    if (s === 'clear') return id === 'litigation' ? 'NO MATCH' : 'CLEAR'
    if (s === 'caution') return id === 'luc' ? 'GAP DETECTED' : 'CAUTION'
    return 'CRITICAL'
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#f9f9f7' }}>
      {/* Logo bar */}
      <div style={{ padding: '1.25rem 1.5rem', background: '#fff', borderBottom: '0.5px solid #e5e5e0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, background: '#0F6E56', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
        </div>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>LagosLandCheck</span>
      </div>

      {/* Loading phase */}
      {phase === 'loading' && (
        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#888', background: '#f3f3f0', padding: '4px 10px', borderRadius: 4, display: 'inline-block', marginBottom: '0.75rem' }}>
            {lat}° N, {lng}° E
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 22, marginBottom: '1.5rem', color: '#111' }}>
            Running 6 checks in parallel…
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {checks.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 8, border: '0.5px solid',
                borderColor: c.status === 'running' ? '#9FE1CB' : '#e5e5e0',
                background: c.status === 'running' ? '#E1F5EE' : '#fff',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: c.status === 'running' ? '#9FE1CB' : '#f3f3f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: c.status === 'running' ? 'spin 1s linear infinite' : 'none'
                }}>
                  {c.status === 'running'
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5"><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#888', marginTop: 2 }}>
                    {c.status === 'queued' ? 'Queued' : 'Running…'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report phase */}
      {phase === 'report' && (
        <div>
          {/* Verdict */}
          <div style={{ padding: '1.25rem 1.5rem', background: '#fff', borderBottom: '0.5px solid #e5e5e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#888', background: '#f3f3f0', padding: '4px 10px', borderRadius: 4 }}>
                {lat}° N, {lng}° E
              </span>
              <span style={{ fontSize: 11, color: '#aaa' }}>
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: 12, background: vc.bg, border: `0.5px solid ${vc.border}` }}>
              <div style={{ fontSize: 10, fontFamily: 'DM Mono', letterSpacing: 1, color: vc.border, marginBottom: 6 }}>
                {vc.label}
              </div>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: vc.color, marginBottom: 6 }}>
                {vc.title}
              </div>
              <div style={{ fontSize: 12, color: vc.color, lineHeight: 1.7 }}>
                {overall === 'CAUTION'
                  ? '2 of 6 checks raised concerns. Do not pay any money until a licensed lawyer confirms title status.'
                  : overall === 'CLEAR'
                  ? 'All 6 checks passed. Continue with standard legal due diligence before completing any transaction.'
                  : 'Critical flags detected. We strongly advise against proceeding without professional legal advice.'}
              </div>
            </div>
          </div>

          {/* Check cards */}
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: 10, fontFamily: 'DM Mono', letterSpacing: 1, color: '#aaa', marginBottom: '0.75rem' }}>
              CHECK RESULTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {checks.map(c => (
                <div key={c.id}
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  style={{
                    background: '#fff', borderRadius: 12, padding: '14px 16px',
                    border: `0.5px solid ${expanded === c.id ? '#999' : '#e5e5e0'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor(c.status), flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontFamily: 'DM Mono', fontWeight: 500, padding: '3px 8px', borderRadius: 4, ...badgeStyle(c.status) }}>
                      {badgeLabel(c.status, c.id)}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"
                      style={{ transform: expanded === c.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                  {expanded === c.id && c.details && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #eee', fontSize: 12, color: '#555', lineHeight: 1.7 }}>
                      {c.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '0 1.5rem 2.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{ width: '100%', padding: 13, background: '#0F6E56', border: 'none', borderRadius: 8, fontFamily: 'Syne', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              Download PDF report
            </button>
            <button onClick={() => router.push('/')} style={{ width: '100%', padding: 12, background: '#fff', border: '0.5px solid #ddd', borderRadius: 8, fontFamily: 'Syne', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Run another verification
            </button>
            <button style={{ width: '100%', padding: 12, background: '#fff', border: '0.5px solid #ddd', borderRadius: 8, fontFamily: 'Syne', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Find a Lagos property lawyer
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'Syne' }}>Loading…</div>}>
      <ReportContent />
    </Suspense>
  )
}
