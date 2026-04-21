'use client'
import { useRouter } from 'next/navigation'
import InputPanel from '@/components/InputPanel'

export default function Home() {
  const router = useRouter()
  const go = (lat: number, lng: number) => router.push(`/report?lat=${lat}&lng=${lng}`)

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#fff', color: '#111827' }}>

      {/* ══════════════════════════════════════════
          HERO — dark, full-width, editorial
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#080E18', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Subtle grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        {/* Green radial glow bottom-left */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(10,92,69,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Amber accent top-right */}
        <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* NAV */}
        <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#0A5C45', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>LagosLandCheck</span>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", background: 'rgba(93,202,165,0.15)', color: '#5DCAA5', border: '0.5px solid rgba(93,202,165,0.3)', padding: '2px 7px', borderRadius: 4 }}>BETA</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#how" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>How it works</a>
            <a href="#guide" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Buyer guide</a>
            <a href="#verify" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#0A5C45', padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(93,202,165,0.3)' }}>Verify land →</a>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem 6rem', maxWidth: 860, margin: '0 auto', width: '100%' }}>
          
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(93,202,165,0.1)', border: '0.5px solid rgba(93,202,165,0.25)', borderRadius: 20, padding: '5px 14px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#5DCAA5', letterSpacing: '1.5px', marginBottom: '1.5rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5DCAA5', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
            LAGOS LAND INTELLIGENCE
          </div>

          <h1 className="fade-up fade-up-1" style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.08, color: '#fff', marginBottom: '1.25rem', letterSpacing: '-1px' }}>
            Verify Lagos land<br/>
            before you{' '}
            <span style={{ color: '#5DCAA5', fontStyle: 'italic' }}>lose a kobo.</span>
          </h1>

          <p className="fade-up fade-up-2" style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 520, marginBottom: '2.5rem' }}>
            6 automated checks in under 2 minutes. Gazette acquisitions, flood risk, fraud zones, litigation, LUC status, satellite AI — all in one report.
          </p>

          {/* Stats row */}
          <div className="fade-up fade-up-3" style={{ display: 'flex', gap: '1px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
            {[{ n: '$4B+', l: 'fraud lost yearly in Nigeria' }, { n: '1,500+', l: 'Lagos fraud petitions since 2020' }, { n: '< 2 min', l: 'vs. 24–48 hrs for competitors' }].map((s, i) => (
              <div key={i} style={{ padding: '14px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none', flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#5DCAA5', marginBottom: 4 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 12 }}>
            <a href="#verify" style={{ padding: '13px 28px', background: '#0A5C45', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', cursor: 'pointer', display: 'inline-block' }}>
              Verify a property →
            </a>
            <a href="#how" style={{ padding: '13px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'inline-block' }}>
              See how it works
            </a>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, #fff)', pointerEvents: 'none' }} />
      </section>

      {/* ══════════════════════════════════════════
          VERIFY FORM — clean white card
      ══════════════════════════════════════════ */}
      <section id="verify" style={{ background: '#fff', padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 4px 40px rgba(0,0,0,0.07)', overflow: 'hidden', marginTop: -40, position: 'relative', zIndex: 10 }}>
            {/* Card header */}
            <div style={{ background: '#0A5C45', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(93,202,165,0.7)', letterSpacing: '1.5px', marginBottom: 2 }}>STEP 1 OF YOUR DUE DILIGENCE</p>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, color: '#fff', fontWeight: 600 }}>Where is the land?</h2>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Gazette', 'Flood', 'Fraud', 'LUC', 'Court', 'AI'].map(t => (
                  <span key={t} style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", background: 'rgba(93,202,165,0.15)', color: '#5DCAA5', padding: '3px 7px', borderRadius: 4 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              <p style={{ fontSize: 12, color: '#9CA3AF', padding: '0.75rem 1.75rem 0', lineHeight: 1.6 }}>Type the area, street or address below — works like Google Maps search.</p>
              <InputPanel onSubmit={go} />
            </div>
          </div>

          {/* Trust note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: '1.25rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>Pre-screening only — not a substitute for legal due diligence</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6 CHECKS — editorial grid
      ══════════════════════════════════════════ */}
      <section id="how" style={{ background: '#F9FAFB', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem', maxWidth: 560 }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.5px' }}>6 checks run simultaneously.<br/><span style={{ color: '#0A5C45' }}>Your results in 2 minutes.</span></h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginTop: '1rem', lineHeight: 1.7 }}>Every check runs in parallel — we never make you wait for one before starting the next.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { n: '01', name: 'Satellite imagery', desc: 'GPT-4o Vision analyses the exact parcel — water bodies, swamp, encroachment, road setback violations, land cover type.', tag: 'AI', tc: '#1a5fa0', bg: '#EFF6FF' },
              { n: '02', name: 'Gazette acquisition', desc: 'Every Lagos State Gazette parsed into our database. PostGIS query: any government acquisition within 500m of your coordinate?', tag: 'CRITICAL', tc: '#991B1B', bg: '#FEF2F2' },
              { n: '03', name: 'Flood & drainage risk', desc: 'NIMET flood risk shapefiles + Lagos drainage master plan. Flags unbuildable zones and 30m drainage channel setbacks.', tag: 'GIS', tc: '#065F46', bg: '#ECFDF5' },
              { n: '04', name: 'Court litigation', desc: 'Lagos State Judiciary cause lists scraped and indexed. Returns any active property disputes near your coordinate.', tag: 'LEGAL', tc: '#92400E', bg: '#FFFBEB' },
              { n: '05', name: 'Land Use Charge', desc: 'LUC portal checked by address. No payments recorded since 2018+ = immediate amber flag. Outstanding LUC is a charge on the land.', tag: 'LUC', tc: '#065F46', bg: '#ECFDF5' },
              { n: '06', name: 'Fraud zone & Omo Onile', desc: 'Curated database of known Lagos fraud zones from court records and verified lawyer submissions. 500m radius check.', tag: 'ALERT', tc: '#991B1B', bg: '#FEF2F2' },
            ].map(c => (
              <div key={c.n} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem', transition: 'box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#D1D5DB', fontWeight: 500 }}>{c.n}</span>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", padding: '3px 8px', borderRadius: 5, background: c.bg, color: c.tc, fontWeight: 600 }}>{c.tag}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>{c.name}</h3>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LAGOS MAP — illustrated section
      ══════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>COVERAGE AREA</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '1rem' }}>Every inch of Lagos State covered.</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, marginBottom: '1.5rem' }}>From Badagry to Epe, from Lagos Island to Ikorodu — our checks cover all 20 LGAs of Lagos State.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { area: 'Lagos Island / Eko', note: 'High gazette density, C of O verification critical' },
                { area: 'Victoria Island & Ikoyi', note: 'Premium titles, LUC compliance checked' },
                { area: 'Lekki / Ajah corridor', note: 'Active Omo Onile zones, multiple fraud alerts' },
                { area: 'Epe & Ibeju-Lekki', note: 'Significant gazette acquisition risk — Free Trade Zone' },
                { area: 'Mainland & Ajeromi', note: 'Flood risk zones, drainage setback checks critical' },
              ].map(a => (
                <div key={a.area} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #F3F4F6' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A5C45" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{a.area}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{a.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Lagos Map SVG */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ background: '#0A1628', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#5DCAA5', letterSpacing: '1px' }}>LAGOS STATE · NIGERIA</span>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>6.52°N 3.38°E</span>
            </div>
            <svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', background: '#0d1f35' }}>
              {/* Ocean */}
              <rect width="480" height="320" fill="#0d1f35"/>
              <line x1="0" y1="70" x2="480" y2="70" stroke="rgba(30,90,160,.2)" strokeWidth="1" strokeDasharray="8,6"/>
              <line x1="0" y1="110" x2="480" y2="110" stroke="rgba(30,90,160,.15)" strokeWidth="1" strokeDasharray="12,8"/>
              <text x="240" y="298" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fill: 'rgba(80,140,220,.4)', letterSpacing: '3px' }}>BIGHT OF BENIN · ATLANTIC</text>

              {/* Lagoon */}
              <ellipse cx="240" cy="188" rx="210" ry="58" fill="rgba(15,55,120,.45)" stroke="rgba(30,90,180,.25)" strokeWidth="1"/>
              <text x="240" y="200" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fill: 'rgba(80,140,220,.5)', letterSpacing: '1px' }}>LAGOS LAGOON</text>

              {/* Mainland */}
              <path d="M 50,85 Q 120,70 210,72 Q 290,70 360,75 Q 420,78 440,88 Q 448,100 430,112 Q 390,124 320,128 Q 250,132 180,130 Q 110,128 70,120 Q 48,112 50,85 Z" fill="#1a3a24" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>

              {/* Lagos Island */}
              <path d="M 168,152 Q 190,140 222,142 Q 262,140 292,145 Q 310,148 306,160 Q 301,172 278,175 Q 248,178 218,176 Q 188,174 172,165 Z" fill="#1a3a24" stroke="rgba(93,202,165,.45)" strokeWidth="1.5"/>

              {/* Victoria Island */}
              <path d="M 282,148 Q 312,140 352,143 Q 375,146 372,157 Q 368,168 344,171 Q 312,174 290,168 Q 276,161 282,148 Z" fill="#1a3a24" stroke="rgba(93,202,165,.4)" strokeWidth="1"/>

              {/* Lekki */}
              <path d="M 346,152 Q 382,144 420,150 Q 448,155 450,165 Q 446,175 420,178 Q 388,181 360,175 Q 342,167 346,152 Z" fill="#152e1c" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>

              {/* Ikoyi */}
              <path d="M 228,142 Q 256,134 276,136 Q 290,138 287,150 Q 284,160 262,162 Q 240,164 230,155 Z" fill="#1e4228" stroke="rgba(93,202,165,.35)" strokeWidth="1"/>

              {/* Third Mainland Bridge */}
              <path d="M 195,128 Q 205,145 210,162 Q 212,172 210,180" fill="none" stroke="rgba(255,220,100,.55)" strokeWidth="2" strokeDasharray="4,3"/>

              {/* Carter Bridge */}
              <line x1="190" y1="150" x2="190" y2="128" stroke="rgba(255,220,100,.45)" strokeWidth="1.5" strokeDasharray="3,3"/>

              {/* Lekki Expressway */}
              <line x1="342" y1="162" x2="448" y2="168" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" strokeDasharray="5,4"/>

              {/* Roads */}
              <line x1="182" y1="160" x2="300" y2="160" stroke="rgba(255,255,255,.1)" strokeWidth="1.5"/>
              <line x1="232" y1="142" x2="232" y2="174" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
              <line x1="264" y1="140" x2="264" y2="172" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>

              {/* Apapa port */}
              <rect x="136" y="120" width="26" height="16" rx="2" fill="#0e2218" stroke="rgba(93,202,165,.4)" strokeWidth="1"/>
              <rect x="140" y="124" width="5" height="9" fill="rgba(255,200,80,.2)"/>
              <rect x="148" y="124" width="5" height="9" fill="rgba(255,200,80,.15)"/>
              <rect x="156" y="124" width="4" height="9" fill="rgba(255,200,80,.2)"/>

              {/* PINS with pulse */}
              {[
                { cx: 220, cy: 161, label: 'LAGOS IS.', delay: '0s' },
                { cx: 322, cy: 160, label: 'VICTORIA IS.', delay: '0.3s' },
                { cx: 392, cy: 163, label: 'LEKKI', delay: '0.6s' },
                { cx: 200, cy: 95, label: 'IKEJA', delay: '0.9s' },
                { cx: 148, cy: 115, label: 'APAPA', delay: '1.2s' },
                { cx: 400, cy: 90, label: 'IKORODU', delay: '1.5s' },
              ].map(p => (
                <g key={p.label}>
                  <circle cx={p.cx} cy={p.cy} r="14" fill="rgba(10,92,69,0)" stroke="rgba(93,202,165,.6)" strokeWidth="1" style={{ animation: `pulse-pin 2s ease-out infinite`, animationDelay: p.delay }} />
                  <circle cx={p.cx} cy={p.cy} r="5" fill="#0A5C45" stroke="#5DCAA5" strokeWidth="1.5"/>
                  <circle cx={p.cx} cy={p.cy} r="2" fill="#fff"/>
                  <text x={p.cx} y={p.cy - 12} textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, fill: 'rgba(93,202,165,.9)', fontWeight: 'bold', letterSpacing: '0.5px' }}>{p.label}</text>
                </g>
              ))}

              {/* Scan line effect */}
              <rect x="0" y="0" width="480" height="2" fill="rgba(93,202,165,.12)" style={{ animation: 'scan 4s linear infinite' }}/>

              {/* Compass */}
              <g transform="translate(450,34)">
                <circle r="16" fill="rgba(10,92,69,.2)" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>
                <text x="0" y="-5" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fill: 'rgba(93,202,165,.9)', fontWeight: 'bold' }}>N</text>
                <text x="0" y="12" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 6, fill: 'rgba(93,202,165,.4)' }}>S</text>
                <text x="-10" y="3" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 6, fill: 'rgba(93,202,165,.4)' }}>W</text>
                <text x="10" y="3" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 6, fill: 'rgba(93,202,165,.4)' }}>E</text>
                <line x1="0" y1="-12" x2="0" y2="-6" stroke="rgba(93,202,165,.8)" strokeWidth="1.5"/>
              </g>

              {/* Scale */}
              <g transform="translate(24,300)">
                <line x1="0" y1="0" x2="38" y2="0" stroke="rgba(93,202,165,.45)" strokeWidth="1.5"/>
                <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(93,202,165,.45)" strokeWidth="1.5"/>
                <line x1="38" y1="-3" x2="38" y2="3" stroke="rgba(93,202,165,.45)" strokeWidth="1.5"/>
                <text x="19" y="-6" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, fill: 'rgba(93,202,165,.5)' }}>~20km</text>
              </g>
            </svg>
            <div style={{ background: '#0A1628', padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>Lagos State · 3,345 km²</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>Population ~25M</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LAND BUYING GUIDE
      ══════════════════════════════════════════ */}
      <section id="guide" style={{ background: '#F9FAFB', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>BUYER'S GUIDE</p>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>How to safely buy land in Lagos.</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 520 }}>Follow these 8 steps in order. Each one exists because people have lost millions by skipping it.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            {[
              { s: '1', title: 'Run LagosLandCheck first', desc: 'Before meeting any agent or viewing the land — run our 6 automated checks. Eliminates the biggest fraud risks at almost zero cost.', tag: 'START HERE', tagBg: '#ECFDF5', tagColor: '#065F46', hi: true },
              { s: '2', title: 'Hire your own licensed lawyer', desc: 'Engage a solicitor registered with the Nigerian Bar Association. Never use the seller\'s lawyer. Budget 5–10% of property value in legal fees.', tag: 'LEGAL' },
              { s: '3', title: 'Search the Land Registry', desc: 'Your lawyer must conduct a physical search at Lagos State Land Registry, Alausa — confirms title, ownership history, and any encumbrances.', tag: 'LEGAL' },
              { s: '4', title: 'Verify the survey plan', desc: 'Get a Registered Survey Plan from the seller. Cross-check beacon numbers with a licensed surveyor. Fake survey plans are extremely common in Lagos.', tag: 'SURVEY' },
              { s: '5', title: 'Confirm no gazette acquisition', desc: 'Our check flags risks but your lawyer must also verify physically with the Ministry of Lands that no government acquisition order exists for the parcel.', tag: 'GAZETTE' },
              { s: '6', title: 'Get LUC clearance certificate', desc: 'Request a Land Use Charge clearance from the seller. Outstanding LUC constitutes a legal charge on the land and transfers to you at purchase.', tag: 'LUC' },
              { s: '7', title: 'Due diligence on the vendor', desc: 'Verify the seller\'s identity documents. If a company, search at CAC. Check for outstanding court orders or judgements against the vendor.', tag: 'VERIFY' },
              { s: '8', title: 'Insist on C of O or Governor\'s Consent', desc: 'Minimum acceptable title: Certificate of Occupancy or Governor\'s Consent. Reject Deed of Assignment alone without an underlying C of O.', tag: 'TITLE' },
            ].map((st, i) => (
              <div key={st.s} style={{ display: 'flex', gap: 0, borderBottom: i < 7 ? '1px solid #F3F4F6' : 'none', background: st.hi ? '#F0FDF4' : '#fff', padding: '1.25rem 1.5rem', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: st.hi ? '#0A5C45' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: st.hi ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {st.hi ? '✓' : st.s}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: st.hi ? '#065F46' : '#111827' }}>{st.title}</span>
                    {st.tag && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", padding: '2px 7px', borderRadius: 4, background: st.tagBg || '#F3F4F6', color: st.tagColor || '#6B7280', fontWeight: 600, flexShrink: 0 }}>{st.tag}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: st.hi ? '#15803D' : '#6B7280', lineHeight: 1.65 }}>{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: '1rem 1.25rem', background: '#FFFBEB', borderRadius: 12, border: '1px solid #FDE68A', display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
            <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.65, fontWeight: 500 }}>Never pay any money — not even a "token deposit" — before completing Steps 1–5. This is the most common way Nigerians lose money to land fraud.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO IT'S FOR
      ══════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#0A5C45', letterSpacing: '1.5px', marginBottom: 8 }}>WHO IT'S FOR</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 600, letterSpacing: '-0.5px' }}>Built for every player in the transaction.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { e: '✈', t: 'Diaspora buyers', d: 'UK, US, Canada, Germany. Your rep takes a photo on the land — we extract GPS coordinates and run all 6 checks instantly. No visit needed.' },
              { e: '⚖', t: 'Property lawyers', d: 'Pre-screen before advising clients. Flag gazette acquisitions and LUC gaps before commissioning a full Land Registry search.' },
              { e: '🏡', t: 'Lagos buyers', d: 'Know about government acquisitions, flood risk, and Omo Onile alerts before paying any deposit to any agent or seller.' },
              { e: '🏢', t: 'Estate agents', d: 'Protect your reputation. Screen every listing before presenting to clients. Avoid selling gazette-acquired land unknowingly.' },
            ].map(w => (
              <div key={w.t} style={{ background: '#F9FAFB', borderRadius: 14, padding: '1.5rem', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{w.e}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>{w.t}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65 }}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VS COMPETITORS — dark section
      ══════════════════════════════════════════ */}
      <section style={{ background: '#080E18', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#5DCAA5', letterSpacing: '1.5px', marginBottom: 8 }}>THE DIFFERENCE</p>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Instant. Not 48 hours.</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', lineHeight: 1.7 }}>Every other land verification service in Nigeria requires 24–48 hours and charges ₦15,000–₦50,000 upfront. LagosLandCheck runs in under 2 minutes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '2rem' }}>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', letterSpacing: '1px' }}>OTHERS</p>
              {['24–48 hour wait time', 'Manual human review', '₦15,000–₦50,000 upfront', 'No instant red-flag detection', 'Lagos-only, limited coverage'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, marginBottom: 12, textAlign: 'left' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, lineHeight: 1 }}>✕</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{x}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(10,92,69,0.15)', padding: '2rem', border: '1px solid rgba(93,202,165,0.15)' }}>
              <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#5DCAA5', marginBottom: '1.25rem', letterSpacing: '1px' }}>LAGOSLANDCHECK</p>
              {['Under 2 minutes', 'Fully automated AI + GIS', 'Fraction of the cost', 'Know before you negotiate', 'All 20 Lagos LGAs covered'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, marginBottom: 12, textAlign: 'left' }}>
                  <span style={{ color: '#5DCAA5', fontSize: 14, lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section style={{ background: '#0A5C45', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
            Don't pay a kobo without checking first.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2rem' }}>Takes under 2 minutes. No account required. Just enter the address.</p>
          <a href="#verify" style={{ display: 'inline-block', padding: '14px 36px', background: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#0A5C45', textDecoration: 'none' }}>
            Run a verification →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: '#080E18', padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, background: '#0A5C45', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>LagosLandCheck</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>Lagos land pre-screening intelligence<br/>Beta · 2026</p>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', marginBottom: 10 }}>PRODUCT</p>
                {['How it works', 'Buyer\'s guide', 'Verify land'].map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 6 }}>{l}</a>)}
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px', marginBottom: 10 }}>LEGAL</p>
                {['Disclaimer', 'Privacy', 'Terms'].map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 6 }}>{l}</a>)}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>Pre-screening only — not a substitute for legal due diligence by a licensed lawyer.</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
              Designed by{' '}
              <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{ color: '#5DCAA5', textDecoration: 'none', fontWeight: 600 }}>WafsDesign</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
