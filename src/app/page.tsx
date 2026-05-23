'use client'
import React, { useState } from 'react'

// ─── SVG Icon Components ──────────────────────────────────────────────────────

const IconSatellite = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7L17 3M17 3L21 7M17 3V13"/>
    <path d="M3 17L7 21M7 21L11 17M7 21V11"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M7.5 7.5L16.5 16.5" opacity="0.4"/>
  </svg>
)

const IconScroll = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const IconWater = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 2 4 10 4 14a8 8 0 0 0 16 0C20 10 12 2 12 2z"/>
    <path d="M12 14c0 1.66-1.34 3-3 3" opacity="0.5"/>
  </svg>
)

const IconScales = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21"/>
    <path d="M3 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L9 6"/>
    <path d="M15 6l3 6c0 1.66 1.34 3 3 3s3-1.34 3-3L18 6"/>
    <path d="M3 6h18"/>
    <path d="M9 21H3M21 21h-6"/>
  </svg>
)

const IconReceipt = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2h16v22l-3-2-2 2-2-2-2 2-2-2-3 2V2z"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
  </svg>
)

const IconAlert = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const IconShield = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconMapPin = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconGlobe = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const IconFile = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const IconLock = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconCheck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconArrowRight = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconBuilding = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1"/>
    <path d="M9 22V12h6v10"/>
    <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>
  </svg>
)

const IconUsers = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

// ─── LLC Logo SVG ─────────────────────────────────────────────────────────────

const LLCLogo = ({ variant = 'dark', size = 'md' }: { variant?: 'dark' | 'light', size?: 'sm' | 'md' | 'lg' }) => {
  const goldColor = '#CFAF6E'
  const textColor = variant === 'dark' ? '#ffffff' : '#07382C'
  const iconBg = variant === 'dark' ? 'rgba(207,175,110,0.12)' : 'rgba(7,56,44,0.08)'
  const iconBorder = variant === 'dark' ? 'rgba(207,175,110,0.35)' : 'rgba(7,56,44,0.2)'
  const sizes = { sm: { box: 28, font: 13, wfont: 13 }, md: { box: 36, font: 17, wfont: 15 }, lg: { box: 48, font: 22, wfont: 18 } }
  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'sm' ? 8 : 10 }}>
      {/* Monogram block */}
      <div style={{
        width: s.box, height: s.box,
        border: `1.5px solid ${iconBorder}`,
        borderRadius: 6,
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: s.font,
          color: goldColor,
          letterSpacing: '-1px',
          lineHeight: 1,
        }}>LLC</span>
        {/* Tiny pin dot top-right */}
        <div style={{
          position: 'absolute',
          top: 3,
          right: 3,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: goldColor,
          opacity: 0.7,
        }} />
      </div>
      {/* Wordmark */}
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: s.wfont,
          color: textColor,
          letterSpacing: '-0.4px',
          lineHeight: 1.1,
        }}>
          LagosLandCheck
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8,
          color: goldColor,
          letterSpacing: '1.8px',
          marginTop: 1,
          opacity: 0.8,
        }}>
          VERIFICATION INTELLIGENCE
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [showSample, setShowSample] = useState(false)

  return (
    <div style={{ fontFamily: "'Syne',sans-serif", background: '#F8FAF9', color: '#111827' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#F8FAF9}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.5}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
        .fade-1{animation:fadeUp .6s ease .1s both}
        .fade-2{animation:fadeUp .6s ease .25s both}
        .fade-3{animation:fadeUp .6s ease .4s both}
        .fade-4{animation:fadeUp .6s ease .55s both}
        .cta-primary{background:#0A5C45!important;color:#fff!important;transition:all .2s!important}
        .cta-primary:hover{background:#07382C!important;transform:translateY(-1px)!important;box-shadow:0 8px 24px rgba(10,92,69,.3)!important}
        .cta-gold{background:linear-gradient(135deg,#CFAF6E,#B8942A)!important;color:#fff!important;transition:all .2s!important}
        .cta-gold:hover{transform:translateY(-1px)!important;box-shadow:0 8px 24px rgba(207,175,110,.35)!important}
        .check-card{transition:all .2s!important}
        .check-card:hover{border-color:#0A5C45!important;transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(10,92,69,.08)!important}
        .step-card{transition:all .25s!important}
        .step-card:hover{transform:translateY(-3px)!important;box-shadow:0 16px 40px rgba(0,0,0,.08)!important}
        .nav-link{color:rgba(255,255,255,.55);text-decoration:none;font-size:13px;transition:color .15s;font-weight:500}
        .nav-link:hover{color:#fff}
        @media(max-width:768px){
          .hero-headline{font-size:clamp(28px,8vw,48px)!important}
          .trust-bar{flex-wrap:wrap!important;gap:16px!important}
          .how-grid{grid-template-columns:1fr!important}
          .checks-grid{grid-template-columns:1fr!important}
          .diaspora-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important;gap:2rem!important}
          .hero-ctas{flex-direction:column!important;align-items:stretch!important}
          .nav-links{display:none!important}
          .pricing-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        background: '#07382C',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '.875rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,.25)',
      }}>
        <LLCLogo variant="dark" size="md" />

        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[['How it works', '#how-it-works'], ['Risk checks', '#fraud-alerts'], ['Pricing', '#pricing']].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>

        <a href="/agent" style={{
          padding: '8px 18px',
          background: 'rgba(207,175,110,.12)',
          border: '1px solid rgba(207,175,110,.3)',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          color: '#CFAF6E',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          transition: 'all .2s',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
          AI Agent
        </a>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: '#07382C',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem 7rem',
      }}>
        {/* Coordinate grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Scanning line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(207,175,110,.15),transparent)',
          animation: 'scan 6s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Radial glows */}
        <div style={{ position: 'absolute', bottom: '-8%', right: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle,rgba(207,175,110,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', left: '-8%', width: '45vw', height: '45vw', background: 'radial-gradient(circle,rgba(10,92,69,.3) 0%,transparent 65%)', pointerEvents: 'none' }} />

        {/* Star field */}
        {[[8,15],[22,8],[45,5],[67,12],[82,7],[12,35],[35,28],[58,22],[78,30],[90,18],[15,55],[70,48]].map(([x,y],i)=>(
          <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: i%3===0?2:1, height: i%3===0?2:1, background: '#fff', borderRadius: '50%', opacity: .25, animation: `twinkle ${2.5+(i%3)}s ease-in-out infinite`, animationDelay: `${i*.3}s` }} />
        ))}

        {/* Coordinate labels — GIS atmosphere */}
        <div style={{ position: 'absolute', top: 20, left: 24, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.15)', letterSpacing: '1px', pointerEvents: 'none' }}>6.5244°N · 3.3792°E</div>
        <div style={{ position: 'absolute', bottom: 100, right: 24, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.15)', letterSpacing: '1px', pointerEvents: 'none' }}>LAGOS STATE · WGS84</div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 760, width: '100%', textAlign: 'center' }}>

          {/* Eyebrow */}
          <div className="fade-1" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(207,175,110,.1)',
            border: '1px solid rgba(207,175,110,.25)',
            borderRadius: 24,
            padding: '6px 16px',
            fontSize: 10,
            fontFamily: "'JetBrains Mono',monospace",
            color: '#CFAF6E',
            letterSpacing: '1.5px',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            PROTECT YOUR INVESTMENT BEFORE YOU PAY
          </div>

          {/* Headline */}
          <h1 className="hero-headline fade-2" style={{
            fontFamily: "'Lora',serif",
            fontSize: 'clamp(32px,5.5vw,64px)',
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: '1.25rem',
            letterSpacing: '-1.5px',
            fontWeight: 600,
          }}>
            Don't lose millions to<br />
            <span style={{ color: '#CFAF6E', fontStyle: 'italic' }}>Lagos land fraud.</span>
          </h1>

          {/* Sub */}
          <p className="fade-3" style={{
            fontSize: 'clamp(15px,2vw,18px)',
            color: 'rgba(255,255,255,.6)',
            lineHeight: 1.8,
            maxWidth: 520,
            margin: '0 auto 2rem',
          }}>
            6 AI-powered checks in under 2 minutes. Gazette acquisitions, flood risk, Omo Onile alerts, court cases, LUC status, satellite imagery — before you pay a single naira.
          </p>

          {/* CTAs */}
          <div className="hero-ctas fade-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <a href="/agent" style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(207,175,110,.3)',
              transition: 'all .2s',
            }}>
              Verify a Land Now
              <IconArrowRight size={15} color="#fff" />
            </a>
            <button onClick={() => setShowSample(true)} style={{
              padding: '14px 28px',
              background: 'rgba(255,255,255,.07)',
              border: '1px solid rgba(255,255,255,.15)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              color: 'rgba(255,255,255,.8)',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <IconFile size={15} color="rgba(255,255,255,.6)" />
              View sample report
            </button>
          </div>

          {/* Trust bar — SVG icons instead of flag emoji */}
          <div className="trust-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: <IconGlobe size={14} color="rgba(255,255,255,.4)" />, text: 'Used by diaspora in UK, US & Canada' },
              { icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: 'Results in under 2 minutes' },
              { icon: <IconLock size={14} color="rgba(255,255,255,.4)" />, text: 'No site visit required' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
                {t.icon}
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade to page bg */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent,#F8FAF9)', pointerEvents: 'none' }} />
      </section>

      {/* ── AGENT CTA CARD ── */}
      <section id="verify" style={{ background: '#F8FAF9', padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', marginTop: -36, position: 'relative', zIndex: 10 }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 48px rgba(0,0,0,.1)',
            overflow: 'hidden',
          }}>
            <div style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', padding: '1.5rem 1.75rem' }}>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.4)', letterSpacing: '1.5px', marginBottom: 6 }}>LAND INTELLIGENCE ENGINE</p>
              <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, color: '#fff', fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
                Talk to the Lagos Land Agent
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Accepts any location format — address, Google Maps link, GPS coordinates, or survey plan details. Runs all 6 checks and shows satellite imagery of the parcel.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                {['Any address', 'Google Maps link', 'GPS coordinates', 'Survey plan'].map(h => (
                  <span key={h} style={{
                    fontSize: 11,
                    background: 'rgba(255,255,255,.08)',
                    color: 'rgba(255,255,255,.7)',
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '0.5px solid rgba(255,255,255,.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                    <IconMapPin size={10} color="rgba(255,255,255,.5)" />
                    {h}
                  </span>
                ))}
              </div>
              <a href="/agent" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 0',
                background: 'linear-gradient(135deg,#CFAF6E,#B8942A)',
                borderRadius: 11,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(207,175,110,.3)',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
                Start verification with AI Agent
                <IconArrowRight size={15} color="#fff" />
              </a>
            </div>
            <div style={{ padding: '1rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderTop: '1px solid #F3F4F6' }}>
              {[
                { icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, t: 'Under 2 minutes' },
                { icon: <IconGlobe size={13} color="#9CA3AF" />, t: 'Works from anywhere' },
                { icon: <IconSatellite size={13} color="#9CA3AF" />, t: 'Satellite imagery' },
                { icon: <IconFile size={13} color="#9CA3AF" />, t: 'PDF report' },
              ].map(f => (
                <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                  {f.icon} {f.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: '1rem' }}>
            <IconShield size={13} color="#9CA3AF" />
            <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'JetBrains Mono',monospace" }}>Pre-screening only · Not a substitute for legal due diligence</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, letterSpacing: '-.5px', marginBottom: '.75rem' }}>
              Three steps. Two minutes. Zero guesswork.
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              No technical knowledge needed. Works for diaspora buyers who have never visited the land.
            </p>
          </div>

          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              {
                n: '01',
                icon: <IconMapPin size={28} color="#0A5C45" />,
                title: 'Paste the location',
                desc: 'Type an address, paste a Google Maps link, or use GPS coordinates. Any format works — our AI extracts the coordinate automatically.',
              },
              {
                n: '02',
                icon: <IconSatellite size={28} color="#CFAF6E" />,
                title: 'AI runs 6 checks',
                desc: 'Satellite imagery, gazette records, flood maps, court cause lists, LUC portal, and fraud database — all queried simultaneously.',
              },
              {
                n: '03',
                icon: <IconFile size={28} color="#0A5C45" />,
                title: 'Get your risk report',
                desc: 'Receive a CLEAR, CAUTION, or CRITICAL verdict with full details for each check. Unlock the PDF dossier for ₦2,500.',
              },
            ].map((s, i) => (
              <div key={s.n} className="step-card" style={{
                background: '#F8FAF9',
                borderRadius: 16,
                padding: '1.75rem',
                border: '1px solid #EAECEF',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 700, color: 'rgba(0,0,0,.03)' }}>{s.n}</div>
                <div style={{ marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>{s.desc}</p>
                {i < 2 && (
                  <div style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, background: '#fff', borderRadius: '50%', border: '1px solid #EAECEF', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <IconArrowRight size={10} color="#D1D5DB" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 RISK CHECKS ── */}
      <section id="fraud-alerts" style={{ background: '#F8FAF9', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#D64545', letterSpacing: '1.5px', marginBottom: 8 }}>6 RISKS WE DETECT</p>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, letterSpacing: '-.5px', marginBottom: '.75rem' }}>
              Every way sellers can cheat you — we check it.
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 520, lineHeight: 1.7 }}>
              Each check targets a real fraud pattern that has cost Lagos buyers millions.
            </p>
          </div>

          <div className="checks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {[
              { n: '01', risk: 'Government has already taken this land', check: 'Gazette & acquisition', desc: "The most common fraud in Lagos. Sellers market gazette-acquired land knowing buyers won't check. We query every Lagos State Gazette within 500m.", tag: 'CRITICAL', tagColor: '#D64545', tagBg: '#FEF2F2', icon: <IconBuilding size={22} color="#D64545" /> },
              { n: '02', risk: 'This land already has Omo Onile problems', check: 'Fraud zone & Omo Onile', desc: 'Active fraud zones and known community agitation areas. Buying here without knowing means you may face violent extortion after purchase.', tag: 'HIGH RISK', tagColor: '#D64545', tagBg: '#FEF2F2', icon: <IconUsers size={22} color="#D64545" /> },
              { n: '03', risk: 'This land floods every rainy season', check: 'Flood & drainage risk', desc: 'NIMET flood shapefiles + Lagos drainage master plan. Many "cheap plots" are seasonal floodplains disguised as dry land.', tag: 'GIS CHECK', tagColor: '#065F46', tagBg: '#ECFDF5', icon: <IconWater size={22} color="#0A5C45" /> },
              { n: '04', risk: 'Someone is suing over this land right now', check: 'Court litigation', desc: 'Active property disputes in Lagos State Judiciary cause lists. A court order could invalidate your purchase entirely.', tag: 'LEGAL', tagColor: '#92400E', tagBg: '#FFFBEB', icon: <IconScales size={22} color="#92400E" /> },
              { n: '05', risk: 'Outstanding debt is attached to this land', check: 'Land Use Charge status', desc: 'Unpaid LUC transfers to the new buyer. A 4-year payment gap means you inherit a tax debt on top of your purchase price.', tag: 'LUC', tagColor: '#065F46', tagBg: '#ECFDF5', icon: <IconReceipt size={22} color="#0A5C45" /> },
              { n: '06', risk: "There's already a building on this vacant land", check: 'Satellite imagery', desc: "GPT-4o Vision analyses the exact parcel. We've caught sellers marketing occupied land with existing structures as empty plots ready to build.", tag: 'AI VISION', tagColor: '#1D4ED8', tagBg: '#EFF6FF', icon: <IconSatellite size={22} color="#1D4ED8" /> },
            ].map(c => (
              <div key={c.n} className="check-card" style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '1.25rem', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.icon}
                  </div>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", padding: '3px 8px', borderRadius: 5, background: c.tagBg, color: c.tagColor, fontWeight: 700 }}>{c.tag}</span>
                </div>
                <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: '#9CA3AF', marginBottom: 5, letterSpacing: '.5px' }}>{c.check}</p>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8, lineHeight: 1.35 }}>"{c.risk}"</h3>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORT MODAL ── */}
      {showSample && (
        <div onClick={() => setShowSample(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', cursor: 'default' }}>
            <div style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', padding: '1.25rem 1.5rem', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.4)', letterSpacing: '1px', marginBottom: 2 }}>SAMPLE VERIFICATION REPORT</p>
                <h3 style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#fff' }}>Plot 14, Thomas Estate, Ajah</h3>
              </div>
              <button onClick={() => setShowSample(false)} style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: '#92400E', letterSpacing: '1px', marginBottom: 4 }}>OVERALL RISK LEVEL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#92400E' }}>Proceed with Caution</div>
                  <div style={{ fontSize: 12, color: '#92400E', opacity: 0.8 }}>· 2 of 6 checks raised concerns</div>
                </div>
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: '1rem', background: '#0A1628', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
                  <IconSatellite size={28} color="rgba(255,255,255,.2)" />
                  <div style={{ marginTop: 8 }}>Satellite image loads on real report</div>
                  <div style={{ marginTop: 4, fontSize: 10, color: 'rgba(255,255,255,.2)' }}>6.4698°N · 3.5721°E · zoom 20</div>
                </div>
              </div>
              {[
                { name: 'Satellite imagery', status: 'caution', summary: 'Building detected — residential structure visible. This is NOT vacant land.', color: '#F59E0B', badge: '#FEF3C7', text: '#92400E', icon: <IconSatellite size={14} color="#F59E0B" /> },
                { name: 'Gazette acquisition', status: 'caution', summary: 'Gazette Vol. 43 No. 17 (2019) records acquisition 380m from coordinate.', color: '#F59E0B', badge: '#FEF3C7', text: '#92400E', icon: <IconScroll size={14} color="#F59E0B" /> },
                { name: 'Flood & drainage risk', status: 'clear', summary: 'Low flood risk zone. No primary drainage channel within 30m.', color: '#22C55E', badge: '#D1FAE5', text: '#065F46', icon: <IconWater size={14} color="#22C55E" /> },
                { name: 'Court litigation', status: 'clear', summary: 'No active cases in published Lagos Judiciary cause lists.', color: '#22C55E', badge: '#D1FAE5', text: '#065F46', icon: <IconScales size={14} color="#22C55E" /> },
                { name: 'Land Use Charge', status: 'clear', summary: 'LUC payments current. Last payment 2025.', color: '#22C55E', badge: '#D1FAE5', text: '#065F46', icon: <IconReceipt size={14} color="#22C55E" /> },
                { name: 'Fraud zone & Omo Onile', status: 'clear', summary: 'No active fraud flags within 500m.', color: '#22C55E', badge: '#D1FAE5', text: '#065F46', icon: <IconAlert size={14} color="#22C55E" /> },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '.5px solid #F3F4F6' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: c.badge, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{c.name}</span>
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", padding: '2px 7px', borderRadius: 4, background: c.badge, color: c.text, fontWeight: 700 }}>{c.status.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>{c.summary}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(207,175,110,.06)', borderRadius: 10, border: '1px solid rgba(207,175,110,.25)', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Full details, evidence, and PDF dossier</p>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0A5C45', marginBottom: 4 }}>₦2,500</div>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>One-time · Secure via Paystack</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SAMPLE REPORT TRIGGER ── */}
      <section style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>SAMPLE REPORT</p>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 600, letterSpacing: '-.5px', marginBottom: '1rem', lineHeight: 1.2 }}>
              See exactly what you get before you pay.
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              Every report includes a risk verdict, satellite image, and plain-English explanations for all 6 checks. No legal jargon.
            </p>
            <button onClick={() => setShowSample(true)} className="cta-primary" style={{ padding: '13px 28px', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Preview sample report
              <IconArrowRight size={14} color="#fff" />
            </button>
          </div>

          {/* Clean mock report preview — no emoji */}
          <div style={{ flex: 1, minWidth: 280, background: '#F8FAF9', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.06)' }}>
            <div style={{ background: '#0A5C45', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid rgba(207,175,110,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#CFAF6E', fontFamily: 'monospace', fontWeight: 800 }}>LLC</span>
                </div>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>Verification Report</span>
              </div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", background: 'rgba(245,158,11,.2)', color: '#FCD34D', padding: '2px 7px', borderRadius: 4 }}>CAUTION</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ background: '#FFFBEB', borderRadius: 8, padding: '10px 12px', marginBottom: 10, border: '.5px solid #FCD34D' }}>
                <div style={{ fontSize: 10, color: '#92400E', fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>RISK VERDICT · PROCEED WITH CAUTION</div>
                <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg,#22C55E,#F59E0B)', borderRadius: 3 }} />
                </div>
              </div>
              {[
                { n: 'Satellite', s: 'caution', icon: <IconSatellite size={11} color="#F59E0B" /> },
                { n: 'Gazette', s: 'caution', icon: <IconScroll size={11} color="#F59E0B" /> },
                { n: 'Flood risk', s: 'clear', icon: <IconWater size={11} color="#22C55E" /> },
                { n: 'Court records', s: 'clear', icon: <IconScales size={11} color="#22C55E" /> },
                { n: 'LUC status', s: 'clear', icon: <IconReceipt size={11} color="#22C55E" /> },
                { n: 'Fraud zone', s: 'clear', icon: <IconAlert size={11} color="#22C55E" /> },
              ].map(c => (
                <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '.5px solid #F9FAFB' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: c.s === 'clear' ? '#D1FAE5' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ flex: 1, fontSize: 12, color: '#374151' }}>{c.n}</span>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: c.s === 'clear' ? '#065F46' : '#92400E', background: c.s === 'clear' ? '#D1FAE5' : '#FEF3C7', padding: '2px 6px', borderRadius: 3, fontWeight: 600 }}>{c.s.toUpperCase()}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(207,175,110,.06)', borderRadius: 8, textAlign: 'center', border: '.5px solid rgba(207,175,110,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <IconLock size={12} color="#0A5C45" />
                <span style={{ fontSize: 11, color: '#374151' }}>Unlock full details — </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A5C45' }}>₦2,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIASPORA SECTION ── */}
      <section style={{ background: '#07382C', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="diaspora-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#CFAF6E', letterSpacing: '1.5px', marginBottom: 8 }}>FOR DIASPORA NIGERIANS</p>
              <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginBottom: '1rem', lineHeight: 1.2 }}>
                Buying land from abroad?<br />
                <span style={{ fontStyle: 'italic', color: '#CFAF6E' }}>We're built for you.</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                You can't visit. You don't know who to trust. The agent is pressuring you. Your family back home is saying "just buy it." We know this situation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: '2rem' }}>
                {[
                  { icon: <IconMapPin size={16} color="#CFAF6E" />, t: 'No site visit needed', d: 'Your rep takes a photo, shares a Google Maps link, or gives coordinates. That's all we need.' },
                  { icon: <IconGlobe size={16} color="#CFAF6E" />, t: 'Works from anywhere', d: 'Run a full verification from London, Toronto, or Houston in 2 minutes.' },
                  { icon: <IconFile size={16} color="#CFAF6E" />, t: 'Show your lawyer', d: 'Download the PDF dossier and send it to your Lagos property lawyer as a starting point.' },
                  { icon: <IconShield size={16} color="#CFAF6E" />, t: 'Know before the pressure hits', d: '₦2,500 for the facts before anyone can rush you into a decision worth millions.' },
                ].map(f => (
                  <div key={f.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, background: 'rgba(207,175,110,.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(207,175,110,.2)' }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{f.t}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/agent" style={{ padding: '13px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#CFAF6E,#B8942A)', color: '#fff' }}>
                Verify my land now
                <IconArrowRight size={14} color="#fff" />
              </a>
            </div>

            {/* Trust indicators — replacing fake testimonials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.25)', letterSpacing: '1px', marginBottom: 4 }}>WHY DIASPORA BUYERS USE US</p>

              {[
                { stat: '< 2 min', label: 'Average verification time', desc: 'From location input to full 6-check report.' },
                { stat: '₦2,500', label: 'Full report cost', desc: 'One-time. No account. No subscription. Receipt emailed instantly.' },
                { stat: '6 checks', label: 'Simultaneous data sources', desc: 'Satellite, gazette, flood, court, LUC, and fraud — run in parallel.' },
                { stat: '100%', label: 'Remote — no site visit', desc: 'Works from any country. All you need is a location.' },
              ].map(t => (
                <div key={t.stat} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '1rem 1.25rem', border: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#CFAF6E', flexShrink: 0, minWidth: 70 }}>{t.stat}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background: '#F8FAF9', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>PRICING</p>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, letterSpacing: '-.5px', marginBottom: '1rem' }}>
            ₦2,500 today or millions lost tomorrow.
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            The average Lagos land fraud loss is ₦8–₦50 million. A full verification report costs less than a taxi ride.
          </p>

          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,.06)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#9CA3AF', letterSpacing: '1px', marginBottom: 4 }}>FREE PREVIEW</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>Risk verdict + summary</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#9CA3AF', letterSpacing: '1px', marginBottom: 4 }}>FULL INTELLIGENCE REPORT</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#0A5C45', fontFamily: "'Syne',sans-serif" }}>₦2,500</div>
              </div>
            </div>

            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
              {[
                { free: true, feat: 'Overall verdict (CLEAR/CAUTION/CRITICAL)' },
                { free: true, feat: '6 check results with status' },
                { free: true, feat: 'One-line summary per check' },
                { free: false, feat: 'Full details for every check' },
                { free: false, feat: 'Satellite imagery analysis' },
                { free: false, feat: 'Exact gazette distances & references' },
                { free: false, feat: 'Court case details if found' },
                { free: false, feat: 'PDF dossier to share with lawyer' },
              ].map(f => (
                <div key={f.feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '6px 0' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: f.free ? '#D1FAE5' : 'rgba(207,175,110,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <IconCheck size={9} color={f.free ? '#065F46' : '#CFAF6E'} />
                  </div>
                  <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{f.feat}</span>
                </div>
              ))}
            </div>

            <a href="/agent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', background: 'linear-gradient(135deg,#CFAF6E,#B8942A)', borderRadius: 11, fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(207,175,110,.25)' }}>
              Start free · Unlock for ₦2,500
              <IconArrowRight size={15} color="#fff" />
            </a>
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'JetBrains Mono',monospace" }}>
            Secure payment via Paystack · Card, bank transfer, USSD · Receipt emailed instantly
          </p>
        </div>
      </section>

      {/* ── REAL CONSEQUENCES ── */}
      <section id="buyer-guide" style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#D64545', letterSpacing: '1.5px', marginBottom: 8 }}>REAL CONSEQUENCES</p>
            <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, letterSpacing: '-.5px', marginBottom: '1rem', lineHeight: 1.2 }}>
              What happens when you skip verification?
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>These are not hypothetical. They happen every week in Lagos.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: '3rem' }}>
            {[
              { icon: <IconBuilding size={28} color="#D64545" />, title: 'You buy gazette-acquired land', desc: "The Lagos State Government acquired the land 3 years ago for road expansion. The seller knew. You didn't. The government demolishes your structure with no compensation.", cost: 'Average loss: ₦8M–₦45M' },
              { icon: <IconUsers size={28} color="#D64545" />, title: 'Omo Onile appear after purchase', desc: 'Three months after you pay and start building, community members arrive demanding ₦500,000 "community levy." When you refuse, construction is halted by force.', cost: 'Average loss: ₦2M–₦15M' },
              { icon: <IconWater size={28} color="#E6A23C" />, title: 'You build on a floodplain', desc: 'The land looked dry in January. By June, your foundation is underwater. The plot sits in a seasonal floodplain that NIMET has mapped for years.', cost: 'Average loss: ₦5M–₦20M' },
              { icon: <IconScroll size={28} color="#D64545" />, title: 'Someone else already owns it', desc: "The seller showed you a genuine-looking C of O. He showed the same document to 4 other buyers. One of them gets the land. The other 3 get nothing.", cost: 'Average loss: Full purchase price' },
            ].map(s => (
              <div key={s.title} style={{ background: '#FEF2F2', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(214,69,69,0.12)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(214,69,69,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8, lineHeight: 1.35 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</p>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: '#D64545', fontWeight: 600, background: 'rgba(214,69,69,0.06)', padding: '6px 10px', borderRadius: 6, display: 'inline-block' }}>{s.cost}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg,#0A5C45,#07382C)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px', marginBottom: 8 }}>THE ALTERNATIVE</p>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 24, color: '#fff', fontWeight: 600, marginBottom: 8 }}>LagosLandCheck catches all of these — in 2 minutes.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: '1.5rem' }}>₦2,500 for a full report. Compare that to what you stand to lose.</p>
            <a href="/agent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: 'linear-gradient(135deg,#CFAF6E,#B8942A)', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
              Check before you pay
              <IconArrowRight size={14} color="#fff" />
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section style={{ background: '#F8FAF9', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {[
              { icon: <IconLock size={20} color="#0A5C45" />, title: 'No documents stored', desc: 'No survey plans or personal documents are stored permanently. Your query is processed and deleted.' },
              { icon: <IconShield size={20} color="#0A5C45" />, title: 'Encrypted in transit', desc: 'All verification requests are encrypted. We never share your property search data with third parties.' },
              { icon: <IconScales size={20} color="#0A5C45" />, title: 'Pre-screening, not legal advice', desc: 'Our reports are intelligence tools. Always engage a licensed Lagos property lawyer for final due diligence.' },
              { icon: <IconGlobe size={20} color="#0A5C45" />, title: 'Built for diaspora buyers', desc: 'Used by Nigerians in UK, US, Canada, and Germany who cannot physically visit land before purchasing.' },
            ].map(t => (
              <div key={t.title} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1px solid #E5E7EB', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(10,92,69,0.1)' }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: '#07382C', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginBottom: '1rem', lineHeight: 1.15 }}>
            Verify before you pay.<br />
            <span style={{ color: '#CFAF6E', fontStyle: 'italic' }}>Every single time.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Takes 2 minutes. Works from anywhere in the world. No account needed to start.
          </p>
          <a href="/agent" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 40px', background: 'linear-gradient(135deg,#CFAF6E,#B8942A)', borderRadius: 11, fontSize: 16, fontWeight: 700, textDecoration: 'none', color: '#fff', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(207,175,110,.25)' }}>
            Check a Land Now — Free
            <IconArrowRight size={16} color="#fff" />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No account needed', 'Works from abroad', 'Results in 2 minutes'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
                <IconCheck size={12} color="#4ADE80" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040E09', padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <LLCLogo variant="dark" size="sm" />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', lineHeight: 1.7, maxWidth: 280, fontFamily: "'Inter',sans-serif" }}>
                AI-powered land pre-screening intelligence for Lagos, Nigeria. Protecting buyers from fraud since 2026.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px', marginBottom: 12 }}>PRODUCT</p>
              {[['How it works', '#how-it-works'], ['AI Agent', '/agent'], ['Pricing', '#pricing']].map(([l, h]) => (
                <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none', marginBottom: 7 }}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px', marginBottom: 12 }}>LEGAL</p>
              {[
                ['Terms of service', '/terms'],
                ['Privacy policy', '/privacy'],
                ['Refund policy', '/refund-policy'],
                ['Contact', '/contact'],
                ['support@lagoslandcheck.com', 'mailto:support@lagoslandcheck.com'],
              ].map(([l, h]) => (
                <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none', marginBottom: 7 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.18)', fontFamily: "'JetBrains Mono',monospace" }}>
              Pre-screening only — not a substitute for legal due diligence by a licensed Lagos property lawyer.
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', fontFamily: "'JetBrains Mono',monospace" }}>
              Designed by <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{ color: '#CFAF6E', textDecoration: 'none', fontWeight: 600 }}>WafsDesign</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
