'use client'
import React, { useState, useEffect } from 'react'

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconSatellite = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7L17 3M17 3L21 7M17 3V13"/><path d="M3 17L7 21M7 21L11 17M7 21V11"/>
    <circle cx="12" cy="12" r="3"/><path d="M7.5 7.5L16.5 16.5" opacity="0.4"/>
  </svg>
)
const IconScroll = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconWater = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 2 4 10 4 14a8 8 0 0 0 16 0C20 10 12 2 12 2z"/>
  </svg>
)
const IconScales = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L9 6"/>
    <path d="M15 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L18 6"/><path d="M3 6h18"/>
  </svg>
)
const IconShield = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconCheck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconArrow = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconMapPin = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconAlert = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

// ─── Shield Logo ──────────────────────────────────────────────────────────────
const Logo = ({ variant = 'dark' }: { variant?: 'dark' | 'light' }) => {
  const stroke = variant === 'dark' ? '#CFAF6E' : '#07382C'
  const fill = variant === 'dark' ? 'rgba(207,175,110,0.1)' : 'rgba(7,56,44,0.07)'
  const textColor = variant === 'dark' ? '#fff' : '#07382C'
  const subColor = '#CFAF6E'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="34" height="34" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
        <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M13 22 L19.5 29 L31 16" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: textColor, letterSpacing: '-0.3px', lineHeight: 1.1 }}>LagosLandCheck</div>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: subColor, letterSpacing: '2px', marginTop: 1 }}>VERIFICATION INTELLIGENCE</div>
      </div>
    </div>
  )
}

// ─── Verification UI Mockup ──────────────────────────────────────────────────
const VerificationMockup = () => {
  const [step, setStep] = useState(0)
  const checks = [
    { id: 'sat', label: 'Satellite imagery', status: 'clear', icon: <IconSatellite size={13} color="#15803D" /> },
    { id: 'gaz', label: 'Gazette acquisition', status: 'clear', icon: <IconScroll size={13} color="#15803D" /> },
    { id: 'fld', label: 'Flood & drainage', status: 'caution', icon: <IconWater size={13} color="#B45309" /> },
    { id: 'lit', label: 'Court litigation', status: 'clear', icon: <IconScales size={13} color="#15803D" /> },
    { id: 'luc', label: 'Land Use Charge', status: 'clear', icon: <IconShield size={13} color="#15803D" /> },
    { id: 'frz', label: 'Fraud zone alert', status: 'clear', icon: <IconAlert size={13} color="#15803D" /> },
  ]

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % (checks.length + 2)), 800)
    return () => clearInterval(t)
  }, [])

  const completedChecks = checks.slice(0, Math.min(step, checks.length))
  const isComplete = step > checks.length

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E5E7EB',
      boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: 420,
    }}>
      {/* Header bar */}
      <div style={{ background: '#07382C', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isComplete ? '#4ADE80' : '#CFAF6E', transition: 'background 0.3s' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#fff', letterSpacing: '1px' }}>
            {isComplete ? 'REPORT READY' : 'ANALYZING...'}
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>LLC-DEMO</span>
      </div>

      {/* Map area */}
      <div style={{
        height: 160,
        background: '#0A1F18',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(207,175,110,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(207,175,110,0.06) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Land parcels */}
        {[
          { t: '18%', l: '12%', w: '28%', h: '30%', active: true },
          { t: '18%', l: '44%', w: '22%', h: '40%', active: false },
          { t: '52%', l: '12%', w: '18%', h: '30%', active: false },
          { t: '52%', l: '34%', w: '32%', h: '28%', active: false },
          { t: '14%', l: '70%', w: '18%', h: '40%', active: false },
          { t: '57%', l: '70%', w: '18%', h: '24%', active: false },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.t, left: p.l, width: p.w, height: p.h,
            border: `1.5px solid ${p.active ? '#CFAF6E' : 'rgba(207,175,110,0.2)'}`,
            background: p.active ? 'rgba(207,175,110,0.12)' : 'transparent',
            transition: 'all 0.5s',
          }} />
        ))}
        {/* Red pin */}
        <div style={{
          position: 'absolute', top: '33%', left: '26%',
          width: 10, height: 10, borderRadius: '50%',
          background: '#EF4444',
          boxShadow: '0 0 0 4px rgba(239,68,68,0.25)',
        }} />
        {/* Coord tag */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(0,0,0,0.7)', borderRadius: 4,
          padding: '3px 8px',
          fontFamily: 'monospace', fontSize: 9, color: '#fff', letterSpacing: '0.5px',
        }}>6.5244°N · 3.3792°E · Z20</div>
        {/* Scanning line */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(207,175,110,0.5),transparent)',
          top: `${(step / (checks.length + 2)) * 100}%`,
          transition: 'top 0.8s linear',
        }} />
      </div>

      {/* Location row */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconMapPin size={14} color="#07382C" />
        <span style={{ fontSize: 12, color: '#374151', flex: 1, fontFamily: "'Inter',sans-serif" }}>Plot 14, Thomas Estate, Ajah, Lagos</span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '1px' }}>VERIFIED</span>
      </div>

      {/* Checks list */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '1.5px', marginBottom: 10 }}>6-POINT VERIFICATION</div>
        {checks.map((c, i) => {
          const done = i < completedChecks.length
          const active = i === completedChecks.length && !isComplete
          const statusColor = c.status === 'clear' ? '#15803D' : '#B45309'
          const statusBg = c.status === 'clear' ? '#DCFCE7' : '#FEF3C7'
          return (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 0', borderBottom: i < 5 ? '1px solid #F9FAFB' : 'none',
              opacity: done || active ? 1 : 0.35,
              transition: 'opacity 0.4s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: done ? statusBg : active ? '#EFF6FF' : '#F9FAFB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.3s',
              }}>
                {done ? c.icon : active
                  ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', animation: 'pulse 1s infinite' }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D1D5DB' }} />
                }
              </div>
              <span style={{ flex: 1, fontSize: 12, color: '#374151', fontFamily: "'Inter',sans-serif" }}>{c.label}</span>
              {done && (
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  padding: '2px 7px', borderRadius: 4,
                  background: statusBg, color: statusColor,
                }}>{c.status === 'clear' ? 'CLEAR' : 'CAUTION'}</span>
              )}
            </div>
          )
        })}
        {isComplete && (
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: 'linear-gradient(135deg,#0A5C45,#07382C)',
            borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <IconCheck size={14} color="#4ADE80" />
            <span style={{ fontSize: 12, color: '#fff', fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>Report ready · ₦2,500 to unlock</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [showSample, setShowSample] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: '#fff', color: '#111827' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        .a1{animation:fadeUp .5s ease .05s both}
        .a2{animation:fadeUp .5s ease .15s both}
        .a3{animation:fadeUp .5s ease .25s both}
        .a4{animation:fadeUp .5s ease .35s both}
        a{text-decoration:none}
        .nav-link{font-size:14px;color:rgba(255,255,255,0.65);transition:color .15s;cursor:pointer;font-weight:500}
        .nav-link:hover{color:#fff}
        .hover-lift{transition:transform .2s,box-shadow .2s}
        .hover-lift:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.12)!important}
        .check-row{transition:background .15s}
        .check-row:hover{background:#F9FAFB}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important}
          .mock-hide{display:none!important}
          .how-grid{grid-template-columns:1fr!important}
          .checks-grid{grid-template-columns:1fr!important}
          .footer-cols{grid-template-columns:1fr 1fr!important}
          .diaspora-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:1fr 1fr!important}
          .cred-strip{display:none!important}
          .pricing-feats{grid-template-columns:1fr!important}
          .consequences-grid{grid-template-columns:1fr 1fr!important}
          .trust-grid{grid-template-columns:1fr 1fr!important}
          .cta-band{flex-direction:column!important;text-align:center!important}
        }
        @media(max-width:640px){
          .hero-headline{font-size:clamp(30px,9vw,48px)!important}
          .hero-sub{font-size:15px!important}
          .hero-stat-row{gap:1.25rem!important}
          .hero-ctas{flex-direction:column!important;align-items:stretch!important}
          .hero-ctas a, .hero-ctas button{justify-content:center!important;text-align:center!important}
          .how-grid{grid-template-columns:1fr!important}
          .footer-cols{grid-template-columns:1fr!important;gap:1.5rem!important}
          .trust-row{flex-wrap:wrap!important;gap:1rem!important;padding-top:16px!important}
          .diaspora-grid{grid-template-columns:1fr!important;gap:2rem!important}
          .checks-grid{grid-template-columns:1fr!important}
          .consequences-grid{grid-template-columns:1fr!important}
          .trust-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:1fr!important}
          .pricing-feats{grid-template-columns:1fr!important}
          .nav-desktop{display:none!important}
          .cred-strip{display:none!important}
          .section-pad{padding:60px 1.25rem!important}
          .hero-pad{padding:56px 1.25rem 80px!important}
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#07382C',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2rem',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <Logo variant="dark" />

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            {[['How it works', '#how-it-works'], ['Checks', '#checks'], ['Pricing', '#pricing']].map(([l, h]) => (
              <a key={l} href={h} className="nav-link" style={{ fontSize: 13 }}>{l}</a>
            ))}
          </div>
          <a href="/contact" className="nav-link" style={{ fontSize: 13 }}>Contact</a>
          <a href="/agent" style={{
            padding: '7px 16px',
            background: 'rgba(207,175,110,0.15)',
            border: '1px solid rgba(207,175,110,0.3)',
            borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#CFAF6E',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
            Run a check
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-pad" style={{
        background: '#07382C',
        padding: '80px 2rem 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle dot grid — not glowing blobs */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(207,175,110,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent,#fff)', pointerEvents: 'none' }} />

        <div className="hero-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4rem', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}>
          {/* Left */}
          <div>
            <div className="a1" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(207,175,110,0.12)',
              border: '1px solid rgba(207,175,110,0.2)',
              borderRadius: 40, padding: '5px 14px',
              fontFamily: 'monospace', fontSize: 11, color: '#CFAF6E', letterSpacing: '1.5px',
              marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              AI-POWERED LAND VERIFICATION · LAGOS
            </div>

            <h1 className="a2 hero-headline" style={{
              fontFamily: "'Lora',serif",
              fontSize: 'clamp(36px,4.5vw,62px)',
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
              color: '#fff',
              marginBottom: 20,
            }}>
              Verify land<br />before you pay.<br />
              <span style={{ color: '#CFAF6E', fontStyle: 'italic' }}>Every time.</span>
            </h1>

            <p className="a3 hero-sub" style={{
              fontSize: 17, color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.75, maxWidth: 440, marginBottom: 36,
            }}>
              Six automated checks in under 2 minutes. Gazette acquisitions, satellite imagery, flood maps, court records, LUC status, and fraud zone alerts — before you commit a single naira.
            </p>

            <div className="a4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="/agent" style={{
                padding: '13px 28px',
                background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
                borderRadius: 10, fontSize: 15, fontWeight: 700,
                color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(207,175,110,0.25)',
                transition: 'all .2s',
              }}>
                Verify a land — free
                <IconArrow size={14} color="#fff" />
              </a>
              <button onClick={() => setShowSample(true)} style={{
                padding: '13px 24px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 10, fontSize: 15, fontWeight: 500,
                color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                transition: 'all .2s',
              }}>
                View sample report
              </button>
            </div>

            {/* Trust row — clean, no emoji */}
            <div className="trust-row hero-stat-row" style={{
              display: 'flex', alignItems: 'center', gap: '1.75rem',
              paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
              {[
                { n: '< 2 min', l: 'Verification time' },
                { n: '6 checks', l: 'Data sources' },
                { n: '₦2,500', l: 'Full report' },
              ].map(s => (
                <div key={s.n}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: '#CFAF6E', lineHeight: 1.1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'monospace', letterSpacing: '0.5px' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Verification mockup */}
          <div className="mock-hide" style={{ display: 'flex', justifyContent: 'center' }}>
            <VerificationMockup />
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY STRIP ─────────────────────────────── */}
      <section className="cred-strip" style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', padding: '18px 2rem' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF', letterSpacing: '1px' }}>
            TRUSTED BY DIASPORA BUYERS IN UK · US · CANADA · GERMANY
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {[
              ['Paystack secured', 'payments'],
              ['Supabase PostGIS', 'database'],
              ['GPT-4o Vision', 'AI analysis'],
              ['Resend', 'delivery'],
            ].map(([n, l]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{n}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="section-pad" style={{ padding: '100px 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0A5C45', letterSpacing: '2px', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1.15, maxWidth: 560 }}>
              Three steps. Under two minutes.<br />
              <span style={{ color: '#0A5C45' }}>No site visit required.</span>
            </h2>
          </div>

          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px' }}>
            {[
              {
                n: '01',
                title: 'Submit the location',
                desc: 'Paste a Google Maps link, type an address, or enter GPS coordinates. Our AI agent extracts the coordinate automatically — any format works.',
                icon: <IconMapPin size={20} color="#0A5C45" />,
              },
              {
                n: '02',
                title: 'AI runs 6 checks',
                desc: 'Satellite imagery, gazette records, flood maps, court cause lists, LUC status, and fraud zone alerts — all queried simultaneously against live Lagos State databases.',
                icon: <IconSatellite size={20} color="#0A5C45" />,
              },
              {
                n: '03',
                title: 'Receive your report',
                desc: 'Get a CLEAR, CAUTION, or CRITICAL verdict with full evidence for each check. Unlock the 3-page PDF intelligence dossier for ₦2,500 and share with your lawyer.',
                icon: <IconScroll size={20} color="#0A5C45" />,
              },
            ].map((s, i) => (
              <div key={s.n} style={{
                padding: '36px 40px',
                background: i === 1 ? '#07382C' : '#F9FAFB',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 28, right: 32,
                  fontFamily: 'monospace', fontSize: 36, fontWeight: 700,
                  color: i === 1 ? 'rgba(207,175,110,0.1)' : 'rgba(0,0,0,0.04)',
                }}>{s.n}</div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: i === 1 ? 'rgba(207,175,110,0.15)' : '#EEF9F4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {React.cloneElement(s.icon, { color: i === 1 ? '#CFAF6E' : '#0A5C45' })}
                </div>
                <h3 style={{
                  fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700,
                  color: i === 1 ? '#fff' : '#111827',
                  marginBottom: 10, letterSpacing: '-0.2px',
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: i === 1 ? 'rgba(255,255,255,0.6)' : '#6B7280', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 CHECKS ─────────────────────────────────────── */}
      <section id="checks" className="section-pad" style={{ padding: '100px 2rem', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D64545', letterSpacing: '2px', marginBottom: 12 }}>6 RISKS WE DETECT</div>
              <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1.15 }}>
                Every fraud pattern<br />in Lagos — checked.
              </h2>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 340, lineHeight: 1.75 }}>
              Each check targets a real fraud pattern that has cost Lagos buyers millions. All six run simultaneously.
            </p>
          </div>

          <div className="checks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2 }}>
            {[
              {
                n: '01', check: 'Gazette & acquisition',
                risk: '"Government has already claimed this land"',
                desc: "The most common Lagos fraud. Sellers market gazette-acquired land knowing buyers won't check. We query every Lagos State Gazette within 500m.",
                tag: 'CRITICAL', tagColor: '#991B1B', tagBg: '#FEE2E2',
                icon: <IconScroll size={18} color="#991B1B" />,
              },
              {
                n: '02', check: 'Fraud zone & Omo Onile',
                risk: '"This land already has community disputes"',
                desc: 'Active fraud zones and known community agitation areas. Buying here without knowing means you may face extortion after purchase.',
                tag: 'HIGH RISK', tagColor: '#991B1B', tagBg: '#FEE2E2',
                icon: <IconAlert size={18} color="#991B1B" />,
              },
              {
                n: '03', check: 'Flood & drainage risk',
                risk: '"This land floods every rainy season"',
                desc: 'NIMET flood shapefiles and Lagos drainage master plan. Many cheap plots are seasonal floodplains disguised as dry land.',
                tag: 'GIS CHECK', tagColor: '#065F46', tagBg: '#D1FAE5',
                icon: <IconWater size={18} color="#065F46" />,
              },
              {
                n: '04', check: 'Court litigation',
                risk: '"Someone is suing over this land right now"',
                desc: 'Active disputes in Lagos State Judiciary cause lists. A court order can invalidate your purchase after you have paid.',
                tag: 'LEGAL', tagColor: '#92400E', tagBg: '#FEF3C7',
                icon: <IconScales size={18} color="#92400E" />,
              },
              {
                n: '05', check: 'Land Use Charge status',
                risk: '"Outstanding debt is attached to this land"',
                desc: 'Unpaid LUC transfers to the new buyer on purchase. A 4-year payment gap means you inherit a tax debt at acquisition.',
                tag: 'LUC', tagColor: '#065F46', tagBg: '#D1FAE5',
                icon: <IconShield size={18} color="#065F46" />,
              },
              {
                n: '06', check: 'Satellite imagery',
                risk: '"There is already a building on this plot"',
                desc: "GPT-4o Vision analyses the exact parcel at zoom 20. We've caught sellers marketing occupied land with existing structures as empty plots.",
                tag: 'AI VISION', tagColor: '#1D4ED8', tagBg: '#DBEAFE',
                icon: <IconSatellite size={18} color="#1D4ED8" />,
              },
            ].map(c => (
              <div key={c.n} className="check-row hover-lift" style={{
                background: '#fff', padding: '28px 32px',
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: c.tagBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{c.icon}</div>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                    padding: '3px 8px', borderRadius: 4,
                    background: c.tagBg, color: c.tagColor,
                  }}>{c.tag}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 6 }}>{c.check}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10, lineHeight: 1.35, fontFamily: "'Syne',sans-serif" }}>
                  {c.risk}
                </h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIASPORA SECTION ─────────────────────────────── */}
      <section className="section-pad" style={{ background: '#07382C', padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="diaspora-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#CFAF6E', letterSpacing: '2px', marginBottom: 16 }}>FOR DIASPORA BUYERS</div>
              <h2 style={{
                fontFamily: "'Lora',serif",
                fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 600,
                color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20,
              }}>
                Buying from abroad?<br />
                <em style={{ color: '#CFAF6E' }}>Built for you.</em>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 32 }}>
                You cannot visit. You do not know who to trust. The agent is pressuring you. Your family says just buy it. We built LagosLandCheck for exactly this situation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
                {[
                  ['No site visit needed', 'Share a Google Maps link. We handle the rest.'],
                  ['Works from any country', 'Run a full 6-check verification from London, Toronto, or Houston.'],
                  ['Show your lawyer', 'Download the PDF dossier and share it as your starting point for due diligence.'],
                  ['Know before the pressure starts', '₦2,500 buys you the facts before anyone can rush you.'],
                ].map(([t, d]) => (
                  <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(207,175,110,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <IconCheck size={10} color="#CFAF6E" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{t}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/agent" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
                borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#fff',
              }}>
                Verify my land now
                <IconArrow size={14} color="#fff" />
              </a>
            </div>

            {/* Right: stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { stat: '< 2 min', label: 'Average report time', desc: 'From location submission to complete 6-check report.' },
                { stat: '₦2,500', label: 'One-time cost', desc: 'No account, no subscription. Receipt and report emailed instantly.' },
                { stat: '6 checks', label: 'Simultaneous data sources', desc: 'Satellite, gazette, flood, court, LUC, and fraud — all in parallel.' },
                { stat: '100%', label: 'Remote — no site visit', desc: 'All you need is a location. Works from anywhere in the world.' },
              ].map(s => (
                <div key={s.stat} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '20px 24px',
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 600,
                    color: '#CFAF6E', flexShrink: 0, minWidth: 80,
                  }}>{s.stat}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="section-pad" style={{ padding: '100px 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0A5C45', letterSpacing: '2px', marginBottom: 16 }}>PRICING</div>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 600, letterSpacing: '-0.8px', marginBottom: 14 }}>
            ₦2,500 today.<br />Or millions lost tomorrow.
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, marginBottom: 56 }}>
            The average Lagos land fraud loss is ₦8–₦50 million. A full LagosLandCheck report costs less than a taxi ride.
          </p>

          <div style={{
            background: '#F9FAFB', border: '1px solid #E5E7EB',
            borderRadius: 16, padding: '40px', textAlign: 'left',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', letterSpacing: '1px', marginBottom: 6 }}>FULL INTELLIGENCE REPORT</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, color: '#0A5C45', lineHeight: 1 }}>₦2,500</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>One-time · No account · No subscription</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', letterSpacing: '1px', marginBottom: 6 }}>FREE PREVIEW</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: '#374151' }}>₦0</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Risk verdict + summaries</div>
              </div>
            </div>

            <div className="pricing-feats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 28 }}>
              {[
                [true, 'Risk verdict (CLEAR / CAUTION / CRITICAL)'],
                [true, '6 check results with status'],
                [true, 'One-line summary per check'],
                [false, 'Full evidence for every check'],
                [false, 'Satellite image analysis'],
                [false, 'Gazette distances and references'],
                [false, 'Court case details if found'],
                [false, 'PDF dossier for your lawyer'],
              ].map(([free, feat], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: free ? '#D1FAE5' : 'rgba(207,175,110,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconCheck size={9} color={free ? '#065F46' : '#CFAF6E'} />
                  </div>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{feat as string}</span>
                </div>
              ))}
            </div>

            <a href="/agent" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '15px 0',
              background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
              borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#fff',
              boxShadow: '0 4px 12px rgba(207,175,110,0.25)',
            }}>
              Start free · Unlock for ₦2,500
              <IconArrow size={14} color="#fff" />
            </a>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 14, fontFamily: 'monospace' }}>
              Secure via Paystack · Card · Bank transfer · USSD
            </p>
          </div>
        </div>
      </section>

      {/* ── CONSEQUENCES ─────────────────────────────────── */}
      <section style={{ background: '#F9FAFB', padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D64545', letterSpacing: '2px', marginBottom: 12 }}>REAL CONSEQUENCES</div>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
              What happens when you<br />skip verification?
            </h2>
          </div>

          <div className="consequences-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 2, marginBottom: 32 }}>
            {[
              {
                icon: <IconScroll size={22} color="#991B1B" />,
                title: 'You buy gazette-acquired land',
                desc: "The government acquired the land for road expansion. The seller knew. The government demolishes your structure with no compensation.",
                cost: 'Average loss: ₦8M–₦45M',
              },
              {
                icon: <IconAlert size={22} color="#991B1B" />,
                title: 'Omo Onile demand levies',
                desc: 'Community members arrive after purchase demanding "community levies." When you refuse, construction is halted by force.',
                cost: 'Average loss: ₦2M–₦15M',
              },
              {
                icon: <IconWater size={22} color="#92400E" />,
                title: 'You build on a floodplain',
                desc: 'The land looked dry in January. By June, your foundation is underwater. A seasonal floodplain mapped by NIMET for years.',
                cost: 'Average loss: ₦5M–₦20M',
              },
              {
                icon: <IconScales size={22} color="#991B1B" />,
                title: 'Someone else already owns it',
                desc: 'The seller showed the same C of O to 4 buyers. One gets the land. The other 3 get nothing.',
                cost: 'Average loss: Full purchase price',
              },
            ].map(s => (
              <div key={s.title} style={{
                background: '#fff', padding: '28px 28px',
                borderTop: '3px solid #FEE2E2',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: '#FEF2F2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 14 }}>{s.desc}</p>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#991B1B', fontWeight: 700 }}>{s.cost}</div>
              </div>
            ))}
          </div>

          {/* CTA band */}
          <div className="cta-band" style={{
            background: '#07382C', borderRadius: 12, padding: '36px 44px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 6 }}>
                LagosLandCheck catches all of these — in 2 minutes.
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                ₦2,500 for a full report. Compare that to what you stand to lose.
              </p>
            </div>
            <a href="/agent" style={{
              padding: '13px 28px',
              background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
              borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#fff',
              display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
            }}>
              Check before you pay
              <IconArrow size={14} color="#fff" />
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 2rem', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 2 }}>
            {[
              { icon: <IconShield size={18} color="#0A5C45" />, title: 'No documents stored', desc: 'No survey plans or personal documents are stored permanently. Your query is processed and deleted.' },
              { icon: <IconScroll size={18} color="#0A5C45" />, title: 'Encrypted in transit', desc: 'All requests are encrypted. We never share your property search data with third parties.' },
              { icon: <IconScales size={18} color="#0A5C45" />, title: 'Pre-screening, not legal advice', desc: 'Our reports are intelligence tools. Always engage a licensed Lagos property lawyer for final due diligence.' },
              { icon: <IconSatellite size={18} color="#0A5C45" />, title: 'Built for diaspora buyers', desc: 'Trusted by Nigerians in the UK, US, Canada, and Germany who cannot visit land before buying.' },
            ].map(t => (
              <div key={t.title} style={{
                padding: '28px 28px',
                background: '#F9FAFB',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: '#EEF9F4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section style={{ background: '#07382C', padding: '100px 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Lora',serif",
            fontSize: 'clamp(30px,4vw,48px)', fontWeight: 600,
            color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16,
          }}>
            Verify before you pay.<br />
            <em style={{ color: '#CFAF6E' }}>Every single time.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 36 }}>
            Takes 2 minutes. Works from anywhere. No account needed to start.
          </p>
          <a href="/agent" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 40px',
            background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
            borderRadius: 10, fontSize: 16, fontWeight: 700, color: '#fff',
            marginBottom: 24, boxShadow: '0 4px 16px rgba(207,175,110,0.25)',
          }}>
            Check a land now — free
            <IconArrow size={16} color="#fff" />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No account needed', 'Works from abroad', 'Results in 2 minutes'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <IconCheck size={12} color="#4ADE80" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ background: '#040E09', padding: '56px 2rem 32px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ marginBottom: 14 }}><Logo variant="dark" /></div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, maxWidth: 280, fontFamily: "'Inter',sans-serif" }}>
                AI-powered land pre-screening intelligence for Lagos, Nigeria. Protecting buyers from fraud since 2026.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', marginBottom: 14 }}>PRODUCT</div>
              {[['How it works', '#how-it-works'], ['Run a check', '/agent'], ['Pricing', '#pricing']].map(([l, h]) => (
                <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 9, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', marginBottom: 14 }}>LEGAL</div>
              {[
                ['Terms of service', '/terms'],
                ['Privacy policy', '/privacy'],
                ['Refund policy', '/refund-policy'],
                ['Contact', '/contact'],
                ['support@lagoslandcheck.com', 'mailto:support@lagoslandcheck.com'],
              ].map(([l, h]) => (
                <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 9, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
              Pre-screening only — not a substitute for legal due diligence by a licensed Lagos property lawyer.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
              Designed by <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{ color: '#CFAF6E', textDecoration: 'none', fontWeight: 600 }}>WafsDesign</a>
            </p>
          </div>
        </div>
      </footer>

      {/* ── SAMPLE MODAL ─────────────────────────────────── */}
      {showSample && (
        <div onClick={() => setShowSample(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, maxWidth: 540, width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', padding: '18px 22px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: 3 }}>SAMPLE REPORT · DEMO COORDINATE</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 17, color: '#fff', fontWeight: 600 }}>Plot 14, Thomas Estate, Ajah</div>
              </div>
              <button onClick={() => setShowSample(false)} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#92400E', letterSpacing: '1px', marginBottom: 5 }}>OVERALL VERDICT</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 20, color: '#92400E', fontWeight: 600 }}>Proceed with Caution</div>
                <div style={{ fontSize: 12, color: '#92400E', marginTop: 4, opacity: 0.8 }}>2 of 6 checks raised concerns</div>
              </div>
              {[
                { name: 'Satellite imagery', status: 'caution', summary: 'Building detected — residential structure visible. This is NOT vacant land.', c: '#F59E0B', bg: '#FEF3C7', t: '#92400E', icon: <IconSatellite size={13} color="#F59E0B" /> },
                { name: 'Gazette acquisition', status: 'caution', summary: 'Gazette Vol. 43 No. 17 (2019) records acquisition 380m from coordinate.', c: '#F59E0B', bg: '#FEF3C7', t: '#92400E', icon: <IconScroll size={13} color="#F59E0B" /> },
                { name: 'Flood & drainage risk', status: 'clear', summary: 'Low flood risk zone. No primary drainage channel within 30m.', c: '#22C55E', bg: '#D1FAE5', t: '#065F46', icon: <IconWater size={13} color="#22C55E" /> },
                { name: 'Court litigation', status: 'clear', summary: 'No active cases in published Lagos Judiciary cause lists.', c: '#22C55E', bg: '#D1FAE5', t: '#065F46', icon: <IconScales size={13} color="#22C55E" /> },
                { name: 'Land Use Charge', status: 'clear', summary: 'LUC payments current. Last payment 2025.', c: '#22C55E', bg: '#D1FAE5', t: '#065F46', icon: <IconShield size={13} color="#22C55E" /> },
                { name: 'Fraud zone & Omo Onile', status: 'clear', summary: 'No active fraud flags within 500m.', c: '#22C55E', bg: '#D1FAE5', t: '#065F46', icon: <IconAlert size={13} color="#22C55E" /> },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '.5px solid #F3F4F6', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{c.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: c.bg, color: c.t, fontWeight: 700 }}>{c.status.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>{c.summary}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '14px', background: 'rgba(207,175,110,0.06)', borderRadius: 10, border: '1px solid rgba(207,175,110,0.2)', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Full details, evidence, and PDF dossier</p>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#0A5C45', marginBottom: 4 }}>₦2,500</div>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>One-time · Secure via Paystack</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
