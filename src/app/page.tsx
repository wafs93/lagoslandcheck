'use client'
import React, { useState } from 'react'

export default function Home() {
  const [showSample, setShowSample] = useState(false)

  return (
    <div style={{ fontFamily:"'Syne',sans-serif", background:'#F8FAF9', color:'#111827' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#F8FAF9}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.8}}
        .fade-1{animation:fadeUp .6s ease .1s both}
        .fade-2{animation:fadeUp .6s ease .25s both}
        .fade-3{animation:fadeUp .6s ease .4s both}
        .fade-4{animation:fadeUp .6s ease .55s both}
        .cta-primary{background:#0A5C45!important;color:#fff!important;transition:all .2s!important}
        .cta-primary:hover{background:#07382C!important;transform:translateY(-1px)!important;box-shadow:0 8px 24px rgba(10,92,69,.3)!important}
        .cta-gold{background:linear-gradient(135deg,#CFAF6E,#B8942A)!important;color:#fff!important;transition:all .2s!important}
        .cta-gold:hover{transform:translateY(-1px)!important;box-shadow:0 8px 24px rgba(207,175,110,.35)!important}
        .check-card:hover{border-color:#0A5C45!important;box-shadow:0 4px 20px rgba(10,92,69,.08)!important}
        .step-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 32px rgba(0,0,0,.08)!important}
        .pac-container{border-radius:12px!important;border:1px solid #E5E7EB!important;box-shadow:0 8px 32px rgba(0,0,0,.1)!important;font-family:'Syne',sans-serif!important;margin-top:4px!important}
        .pac-item{padding:10px 14px!important;font-size:13px!important;cursor:pointer!important}
        .pac-item:hover,.pac-item-selected{background:#F0FDF4!important}
        .pac-matched{color:#0A5C45!important;font-weight:600!important}
        .pac-icon{display:none!important}
        @media(max-width:768px){
          .hero-headline{font-size:clamp(30px,8vw,48px)!important}
          .trust-bar{flex-wrap:wrap!important;gap:12px!important}
          .how-grid{grid-template-columns:1fr!important}
          .checks-grid{grid-template-columns:1fr!important}
          .diaspora-grid{grid-template-columns:1fr!important}
          .sample-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important;gap:2rem!important}
          .hero-ctas{flex-direction:column!important}
          .nav-links{display:none!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{background:'#07382C',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'.875rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px rgba(0,0,0,.2)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,background:'#0A5C45',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(255,255,255,.15)'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{fontWeight:700,fontSize:16,color:'#fff',letterSpacing:'-.3px'}}>LagosLandCheck</span>
          <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",background:'rgba(207,175,110,.2)',color:'#CFAF6E',border:'0.5px solid rgba(207,175,110,.4)',padding:'2px 7px',borderRadius:4}}>BETA</span>
        </div>
        <div className="nav-links" style={{display:'flex',gap:'2rem',alignItems:'center'}}>
          {[['How it works','#how-it-works'],['Fraud alerts','#fraud-alerts'],['Buyer guide','#buyer-guide']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:13,color:'rgba(255,255,255,.6)',textDecoration:'none',transition:'color .15s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.6)')}>{l}</a>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <a href="/agent" style={{padding:'7px 16px',background:'rgba(207,175,110,.15)',border:'1px solid rgba(207,175,110,.35)',borderRadius:8,fontSize:12,fontWeight:600,color:'#CFAF6E',textDecoration:'none',display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#4ADE80',animation:'blink 1.5s infinite',display:'inline-block'}}/>AI Agent
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{background:'#07382C',overflow:'hidden',position:'relative',minHeight:'92vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'4rem 1.5rem 6rem'}}>
        {/* Grid texture */}
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>
        {/* Glow */}
        <div style={{position:'absolute',bottom:'-5%',right:'-5%',width:'50vw',height:'50vw',background:'radial-gradient(circle,rgba(207,175,110,.07) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'10%',left:'-5%',width:'40vw',height:'40vw',background:'radial-gradient(circle,rgba(10,92,69,.25) 0%,transparent 65%)',pointerEvents:'none'}}/>

        {/* Stars */}
        {[[8,15],[22,8],[45,5],[67,12],[82,7],[12,35],[35,28],[58,22],[78,30],[90,18]].map(([x,y],i)=>(
          <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:i%3===0?2:1,height:i%3===0?2:1,background:'#fff',borderRadius:'50%',opacity:.3,animation:`twinkle ${2+(i%3)}s ease-in-out infinite`,animationDelay:`${i*.3}s`}}/>
        ))}

        <div style={{position:'relative',zIndex:10,maxWidth:760,width:'100%',textAlign:'center'}}>
          {/* Eyebrow */}
          <div className="fade-1" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(207,175,110,.12)',border:'1px solid rgba(207,175,110,.3)',borderRadius:24,padding:'6px 16px',fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#CFAF6E',letterSpacing:'1.5px',marginBottom:'1.5rem'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#4ADE80',animation:'pulse 2s infinite',display:'inline-block'}}/>
            PROTECT YOUR INVESTMENT BEFORE YOU PAY
          </div>

          {/* Headline */}
          <h1 className="hero-headline fade-2" style={{fontFamily:"'Lora',serif",fontSize:'clamp(32px,5.5vw,64px)',lineHeight:1.1,color:'#fff',marginBottom:'1.25rem',letterSpacing:'-1.5px',fontWeight:600}}>
            Don't lose millions to<br/>
            <span style={{color:'#CFAF6E',fontStyle:'italic'}}>Lagos land fraud.</span>
          </h1>

          {/* Sub */}
          <p className="fade-3" style={{fontSize:'clamp(15px,2vw,18px)',color:'rgba(255,255,255,.6)',lineHeight:1.8,maxWidth:520,margin:'0 auto 2rem'}}>
            6 AI-powered checks in under 2 minutes. Gazette acquisitions, flood risk, Omo Onile alerts, court cases, LUC status, satellite imagery — before you pay a single naira.
          </p>

          {/* CTAs */}
          <div className="hero-ctas fade-4" style={{display:'flex',gap:12,justifyContent:'center',marginBottom:'2.5rem',flexWrap:'wrap'}}>
            <a href="/agent" className="cta-gold" style={{padding:'14px 32px',borderRadius:10,fontSize:15,fontWeight:700,textDecoration:'none',cursor:'pointer',display:'inline-block'}}>
              🔍 Check a Land Now
            </a>
            <button onClick={()=>setShowSample(true)} style={{padding:'14px 28px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.2)',borderRadius:10,fontSize:15,fontWeight:500,color:'rgba(255,255,255,.85)',cursor:'pointer',transition:'all .2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.14)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.08)'}}>
              See Sample Report →
            </button>
          </div>

          {/* Trust bar */}
          <div className="trust-bar" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2rem',flexWrap:'wrap'}}>
            {[
              {icon:'🇬🇧🇺🇸🇨🇦',text:'Used by diaspora in UK, US & Canada'},
              {icon:'⚡',text:'Results in under 2 minutes'},
              {icon:'🔒',text:'No site visit required'},
            ].map(t=>(
              <div key={t.text} style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,.5)'}}>
                <span style={{fontSize:16}}>{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:80,background:'linear-gradient(transparent,#F8FAF9)',pointerEvents:'none'}}/>
      </section>

      {/* ── AGENT CTA ── */}
      <section id="verify" style={{background:'#F8FAF9',padding:'0 1.5rem 4rem'}}>
        <div style={{maxWidth:640,margin:'0 auto',marginTop:-32,position:'relative',zIndex:10}}>
          <div style={{background:'#fff',borderRadius:20,border:'1px solid #E5E7EB',boxShadow:'0 8px 48px rgba(0,0,0,.1)',overflow:'hidden'}}>
            <div style={{background:'linear-gradient(135deg,#0A5C45,#07382C)',padding:'1.5rem 1.75rem'}}>
              <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'rgba(255,255,255,.5)',letterSpacing:'1.5px',marginBottom:6}}>START YOUR VERIFICATION</p>
              <h2 style={{fontFamily:"'Lora',serif",fontSize:22,color:'#fff',fontWeight:600,marginBottom:8,lineHeight:1.3}}>Talk to the Lagos Land Agent</h2>
              <p style={{fontSize:13,color:'rgba(255,255,255,.6)',lineHeight:1.7,marginBottom:'1.25rem'}}>Our AI agent accepts any location format — address, Google Maps link, What3Words, survey plan coordinates, or GPS. It runs all 6 checks and shows you a satellite image of the land.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:'1.25rem'}}>
                {[
                  '📍 Type any address',
                  '🔗 Paste Google Maps link',
                  '📐 What3Words address',
                  '🗺️ Survey plan coordinates',
                ].map(h=>(
                  <span key={h} style={{fontSize:11,background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.75)',padding:'4px 10px',borderRadius:6,border:'0.5px solid rgba(255,255,255,.15)'}}>{h}</span>
                ))}
              </div>
              <a href="/agent" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'14px 0',background:'linear-gradient(135deg,#CFAF6E,#B8942A)',borderRadius:11,fontSize:15,fontWeight:700,color:'#fff',textDecoration:'none',boxShadow:'0 4px 16px rgba(207,175,110,.3)'}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#4ADE80',animation:'blink 1.5s infinite',display:'inline-block'}}/>
                Start verification with AI Agent →
              </a>
            </div>
            <div style={{padding:'1rem 1.75rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              {[
                {icon:'⚡',t:'Under 2 minutes'},
                {icon:'🌍',t:'Works from anywhere'},
                {icon:'🛰️',t:'Satellite imagery'},
                {icon:'📄',t:'PDF certificate'},
              ].map(f=>(
                <div key={f.t} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#6B7280'}}>
                  <span>{f.icon}</span>{f.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center',marginTop:'1rem'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{fontSize:11,color:'#9CA3AF',fontFamily:"'JetBrains Mono',monospace"}}>Pre-screening only · Not a substitute for legal due diligence</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{background:'#fff',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#0A5C45',letterSpacing:'1.5px',marginBottom:8}}>HOW IT WORKS</p>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:600,letterSpacing:'-.5px',marginBottom:'.75rem'}}>Three steps. Two minutes. Zero guesswork.</h2>
            <p style={{fontSize:15,color:'#6B7280',maxWidth:480,margin:'0 auto',lineHeight:1.7}}>No technical knowledge needed. Works for diaspora buyers who have never visited the land.</p>
          </div>
          <div className="how-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {n:'01',icon:'📍',title:'Paste the location',desc:'Type an address, paste a Google Maps link, share a What3Words pin, or use GPS coordinates. Any format works.',color:'#0A5C45'},
              {n:'02',icon:'⚡',title:'AI runs 6 checks',desc:'Satellite imagery, gazettes, flood maps, court records, LUC portal and fraud database — all checked simultaneously.',color:'#CFAF6E'},
              {n:'03',icon:'📋',title:'Get your risk report',desc:'Receive a plain-English verdict — CLEAR, CAUTION, or CRITICAL — with full details for each check. Unlock the PDF for ₦2,500.',color:'#0A5C45'},
            ].map((s,i)=>(
              <div key={s.n} className="step-card" style={{background:'#F8FAF9',borderRadius:16,padding:'1.75rem',border:'1px solid #F3F4F6',transition:'all .2s',cursor:'default',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:12,right:16,fontFamily:"'JetBrains Mono',monospace",fontSize:32,fontWeight:700,color:'rgba(0,0,0,.04)'}}>{s.n}</div>
                <div style={{fontSize:32,marginBottom:14}}>{s.icon}</div>
                <h3 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:13,color:'#6B7280',lineHeight:1.7}}>{s.desc}</p>
                {i < 2 && (
                  <div style={{position:'absolute',right:-12,top:'50%',transform:'translateY(-50%)',fontSize:20,color:'#D1D5DB',display:'none'}}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 RISK CHECKS ── */}
      <section id="fraud-alerts" style={{background:'#F8FAF9',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{marginBottom:'2.5rem'}}>
            <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#D64545',letterSpacing:'1.5px',marginBottom:8}}>6 RISKS WE DETECT</p>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:600,letterSpacing:'-.5px',marginBottom:'.75rem'}}>Every way sellers can cheat you — we check it.</h2>
            <p style={{fontSize:15,color:'#6B7280',maxWidth:520,lineHeight:1.7}}>Each check targets a real fraud pattern that has cost Lagos buyers millions.</p>
          </div>
          <div className="checks-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {[
              {n:'01',risk:'Government has already taken this land',check:'Gazette & acquisition',desc:'The most common fraud in Lagos. Sellers market gazette-acquired land knowing buyers won\'t check. We query every Lagos State Gazette within 500m.',tag:'CRITICAL',tagColor:'#D64545',tagBg:'#FEF2F2',icon:'🏛'},
              {n:'02',risk:'This land already has Omo Onile problems',check:'Fraud zone & Omo Onile',desc:'Active fraud zones and known community agitation areas. Buying here without knowing means you may face violent extortion after purchase.',tag:'HIGH RISK',tagColor:'#D64545',tagBg:'#FEF2F2',icon:'👥'},
              {n:'03',risk:'This land floods every rainy season',check:'Flood & drainage risk',desc:'NIMET flood shapefiles + Lagos drainage master plan. Many "cheap plots" are seasonal floodplains disguised as dry land.',tag:'GIS CHECK',tagColor:'#065F46',tagBg:'#ECFDF5',icon:'💧'},
              {n:'04',risk:'Someone is suing over this land right now',check:'Court litigation',desc:'Active property disputes in Lagos State Judiciary cause lists. A court order could invalidate your purchase entirely.',tag:'LEGAL',tagColor:'#92400E',tagBg:'#FFFBEB',icon:'⚖️'},
              {n:'05',risk:'Outstanding debt is attached to this land',check:'Land Use Charge status',desc:'Unpaid LUC transfers to the new buyer. A 4-year payment gap = you inherit a tax debt on top of your purchase price.',tag:'LUC',tagColor:'#065F46',tagBg:'#ECFDF5',icon:'🧾'},
              {n:'06',risk:'There\'s already a building on this "vacant land"',check:'Satellite imagery',desc:'GPT-4o Vision analyses the exact parcel. We\'ve caught sellers marketing occupied land with existing structures as "empty plots ready to build".',tag:'AI VISION',tagColor:'#1D4ED8',tagBg:'#EFF6FF',icon:'🛰️'},
            ].map(c=>(
              <div key={c.n} className="check-card" style={{background:'#fff',borderRadius:14,border:'1px solid #E5E7EB',padding:'1.25rem',transition:'all .2s',cursor:'default'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontSize:24}}>{c.icon}</span>
                  <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",padding:'3px 8px',borderRadius:5,background:c.tagBg,color:c.tagColor,fontWeight:700}}>{c.tag}</span>
                </div>
                <p style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#9CA3AF',marginBottom:5,letterSpacing:'.5px'}}>{c.check}</p>
                <h3 style={{fontSize:14,fontWeight:700,color:'#111827',marginBottom:8,lineHeight:1.35}}>"{c.risk}"</h3>
                <p style={{fontSize:12,color:'#6B7280',lineHeight:1.65}}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORT ── */}
      {showSample && (
        <div onClick={()=>setShowSample(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',cursor:'zoom-out'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:20,maxWidth:580,width:'100%',maxHeight:'90vh',overflowY:'auto',cursor:'default'}}>
            <div style={{background:'linear-gradient(135deg,#0A5C45,#07382C)',padding:'1.25rem 1.5rem',borderRadius:'20px 20px 0 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'rgba(255,255,255,.5)',letterSpacing:'1px',marginBottom:2}}>SAMPLE VERIFICATION REPORT</p>
                <h3 style={{fontFamily:"'Lora',serif",fontSize:18,color:'#fff'}}>Plot 14, Thomas Estate, Ajah</h3>
              </div>
              <button onClick={()=>setShowSample(false)} style={{background:'rgba(255,255,255,.15)',border:'none',borderRadius:8,width:32,height:32,cursor:'pointer',color:'#fff',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
            </div>
            <div style={{padding:'1.25rem'}}>
              {/* Risk score */}
              <div style={{background:'#FFFBEB',border:'1px solid #FCD34D',borderRadius:12,padding:'1rem 1.25rem',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:'#92400E',letterSpacing:'1px',marginBottom:3}}>OVERALL RISK LEVEL</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:'#92400E'}}>⚠️ CAUTION</div>
                  <div style={{fontSize:12,color:'#92400E',marginTop:3}}>2 of 6 checks raised concerns</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:'#9CA3AF',marginBottom:3}}>RISK SCORE</div>
                  <div style={{fontSize:32,fontWeight:700,color:'#F59E0B',fontFamily:"'Syne',sans-serif"}}>42<span style={{fontSize:16,color:'#D1D5DB'}}>/100</span></div>
                </div>
              </div>
              {/* Satellite */}
              <div style={{borderRadius:10,overflow:'hidden',marginBottom:'1rem',background:'#0A1628',height:160,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',border:'1px solid #E5E7EB'}}>
                <div style={{textAlign:'center',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>
                  🛰️ Satellite image loads on real report
                </div>
                <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,.6)',borderRadius:5,padding:'3px 8px',fontSize:9,color:'#fff',fontFamily:"'JetBrains Mono',monospace"}}>6.4698°N, 3.5721°E</div>
              </div>
              {/* Checks */}
              {[
                {name:'Satellite imagery',status:'caution',summary:'⚠️ Building detected — residential structure visible. This is NOT vacant land.',color:'#F59E0B',badge:'#FEF3C7',text:'#92400E'},
                {name:'Gazette acquisition',status:'caution',summary:'Gazette Vol. 43 No. 17 (2019) records acquisition 380m from coordinate.',color:'#F59E0B',badge:'#FEF3C7',text:'#92400E'},
                {name:'Flood & drainage risk',status:'clear',summary:'Low flood risk zone. No primary drainage channel within 30m.',color:'#22C55E',badge:'#D1FAE5',text:'#065F46'},
                {name:'Court litigation',status:'clear',summary:'No active cases in published Lagos Judiciary cause lists.',color:'#22C55E',badge:'#D1FAE5',text:'#065F46'},
                {name:'Land Use Charge',status:'clear',summary:'LUC payments current. Last payment 2025.',color:'#22C55E',badge:'#D1FAE5',text:'#065F46'},
                {name:'Fraud zone & Omo Onile',status:'clear',summary:'No active fraud flags within 500m.',color:'#22C55E',badge:'#D1FAE5',text:'#065F46'},
              ].map(c=>(
                <div key={c.name} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 0',borderBottom:'.5px solid #F3F4F6'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:c.color,flexShrink:0,marginTop:4}}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:500,color:'#111'}}>{c.name}</span>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",padding:'2px 7px',borderRadius:4,background:c.badge,color:c.text,fontWeight:700}}>{c.status.toUpperCase()}</span>
                    </div>
                    <p style={{fontSize:12,color:'#6B7280',lineHeight:1.55}}>{c.summary}</p>
                  </div>
                </div>
              ))}
              <div style={{marginTop:'1rem',padding:'1rem',background:'rgba(207,175,110,.08)',borderRadius:10,border:'1px solid rgba(207,175,110,.3)',textAlign:'center'}}>
                <p style={{fontSize:13,color:'#92400E',fontWeight:500,marginBottom:8}}>Full details, expert explanations + PDF certificate</p>
                <div style={{fontSize:20,fontWeight:700,color:'#0A5C45',marginBottom:4}}>₦2,500</div>
                <p style={{fontSize:11,color:'#9CA3AF'}}>One-time · Secure via Paystack</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample report trigger section */}
      <section style={{background:'#fff',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'3rem',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:280}}>
            <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#0A5C45',letterSpacing:'1.5px',marginBottom:8}}>SAMPLE REPORT</p>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(24px,3.5vw,36px)',fontWeight:600,letterSpacing:'-.5px',marginBottom:'1rem',lineHeight:1.2}}>See exactly what you get before you pay.</h2>
            <p style={{fontSize:14,color:'#6B7280',lineHeight:1.75,marginBottom:'1.5rem'}}>Every report includes a risk score, satellite image, and plain-English explanations for all 6 checks. No legal jargon. No confusion.</p>
            <button onClick={()=>setShowSample(true)} className="cta-primary" style={{padding:'13px 28px',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>
              Preview sample report →
            </button>
          </div>
          {/* Mock report preview */}
          <div style={{flex:1,minWidth:280,background:'#F8FAF9',borderRadius:16,border:'1px solid #E5E7EB',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.06)'}}>
            <div style={{background:'#0A5C45',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:11,color:'#fff',fontWeight:600}}>Verification Report</span>
              <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",background:'rgba(245,158,11,.2)',color:'#FCD34D',padding:'2px 7px',borderRadius:4}}>CAUTION</span>
            </div>
            <div style={{padding:'12px 14px'}}>
              <div style={{background:'#FFFBEB',borderRadius:8,padding:'10px 12px',marginBottom:10,border:'.5px solid #FCD34D'}}>
                <div style={{fontSize:10,color:'#92400E',fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>RISK SCORE</div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:24,fontWeight:700,color:'#F59E0B'}}>42</div>
                  <div style={{flex:1,height:6,background:'#F3F4F6',borderRadius:3,overflow:'hidden'}}>
                    <div style={{width:'42%',height:'100%',background:'linear-gradient(90deg,#22C55E,#F59E0B)',borderRadius:3}}/>
                  </div>
                  <div style={{fontSize:10,color:'#9CA3AF'}}>100</div>
                </div>
              </div>
              {[{n:'Satellite',s:'caution'},{n:'Gazette',s:'caution'},{n:'Flood risk',s:'clear'},{n:'Court',s:'clear'},{n:'LUC',s:'clear'},{n:'Fraud zone',s:'clear'}].map(c=>(
                <div key={c.n} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:'.5px solid #F9FAFB'}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:c.s==='clear'?'#22C55E':'#F59E0B',flexShrink:0}}/>
                  <span style={{flex:1,fontSize:12,color:'#374151'}}>{c.n}</span>
                  <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:c.s==='clear'?'#065F46':'#92400E',background:c.s==='clear'?'#D1FAE5':'#FEF3C7',padding:'2px 6px',borderRadius:3,fontWeight:600}}>{c.s.toUpperCase()}</span>
                </div>
              ))}
              <div style={{marginTop:10,padding:'8px 12px',background:'rgba(207,175,110,.08)',borderRadius:8,textAlign:'center',border:'.5px solid rgba(207,175,110,.3)'}}>
                <span style={{fontSize:11,color:'#92400E',fontWeight:500}}>🔒 Unlock full details — </span>
                <span style={{fontSize:11,fontWeight:700,color:'#0A5C45'}}>₦2,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIASPORA SECTION ── */}
      <section style={{background:'#07382C',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div className="diaspora-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
            <div>
              <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#CFAF6E',letterSpacing:'1.5px',marginBottom:8}}>FOR DIASPORA NIGERIANS</p>
              <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(26px,3.5vw,40px)',fontWeight:600,color:'#fff',letterSpacing:'-.5px',marginBottom:'1rem',lineHeight:1.2}}>
                Buying land from abroad?<br/>
                <span style={{fontStyle:'italic',color:'#CFAF6E'}}>We're built for you.</span>
              </h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,.6)',lineHeight:1.8,marginBottom:'1.5rem'}}>
                You can't visit. You don't know who to trust. The agent is pressuring you. Your family back home is saying "just buy it." We know this situation — and we built LagosLandCheck specifically for it.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:'2rem'}}>
                {[
                  {icon:'📍',t:'No site visit needed',d:'Your rep takes a photo, shares a Google Maps link, or gives you a What3Words address. That\'s all we need.'},
                  {icon:'🌍',t:'Works from anywhere',d:'Run a full verification from London, Toronto, or Houston. The report is in your inbox in 2 minutes.'},
                  {icon:'📄',t:'Show your lawyer',d:'Download the PDF certificate and send it to your Lagos property lawyer as a starting point for due diligence.'},
                  {icon:'⚡',t:'Know before the agent pressures you',d:'Have the facts before anyone can rush you into a decision. ₦2,500 vs potentially millions lost.'},
                ].map(f=>(
                  <div key={f.t} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <div style={{width:36,height:36,background:'rgba(207,175,110,.15)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16,border:'1px solid rgba(207,175,110,.2)'}}>{f.icon}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'#fff',marginBottom:2}}>{f.t}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}>{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/agent" className="cta-gold" style={{padding:'13px 28px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',display:'inline-block'}}>
                Verify my land now →
              </a>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'rgba(255,255,255,.3)',letterSpacing:'1px',marginBottom:4}}>DIASPORA BUYERS ARE SAYING</p>
              {[
                {quote:"I was about to transfer ₦18M for a plot in Ajah. LagosLandCheck showed it was in a known Omo Onile zone. I pulled out. Best ₦2,500 I ever spent.",name:"Adebayo O.",loc:"Manchester, UK",flag:"🇬🇧"},
                {quote:"My agent kept rushing me. I pasted the Google Maps link into the agent, got the report in 2 minutes, shared it with my lawyer. Saved months of stress.",name:"Ngozi A.",loc:"Toronto, Canada",flag:"🇨🇦"},
                {quote:"The satellite check showed there was already a building on the 'empty plot' I was being sold. I would never have known from the photos the agent sent.",name:"Emeka C.",loc:"Houston, USA",flag:"🇺🇸"},
              ].map(t=>(
                <div key={t.name} style={{background:'rgba(255,255,255,.06)',borderRadius:12,padding:'1.1rem 1.25rem',border:'1px solid rgba(255,255,255,.08)'}}>
                  <p style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.7,marginBottom:10,fontStyle:'italic'}}>"{t.quote}"</p>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:16}}>{t.flag}</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:'#fff'}}>{t.name}</div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,.4)',fontFamily:"'JetBrains Mono',monospace"}}>{t.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICE ANCHOR ── */}
      <section style={{background:'#F8FAF9',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:640,margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#0A5C45',letterSpacing:'1.5px',marginBottom:8}}>PRICING</p>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:600,letterSpacing:'-.5px',marginBottom:'1rem'}}>₦2,500 today or millions lost tomorrow.</h2>
          <p style={{fontSize:15,color:'#6B7280',lineHeight:1.75,marginBottom:'2.5rem'}}>The average Lagos land fraud loss is ₦8–₦50 million. A full LagosLandCheck report costs less than a taxi ride in Lagos.</p>
          <div style={{background:'#fff',borderRadius:20,border:'1px solid #E5E7EB',padding:'2rem',boxShadow:'0 4px 24px rgba(0,0,0,.06)',marginBottom:'1.5rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',flexWrap:'wrap',gap:12}}>
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#9CA3AF',letterSpacing:'1px',marginBottom:4}}>FREE PREVIEW</div>
                <div style={{fontSize:16,fontWeight:600,color:'#111'}}>Risk verdict + summary</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#9CA3AF',letterSpacing:'1px',marginBottom:4}}>FULL REPORT</div>
                <div style={{fontSize:32,fontWeight:700,color:'#0A5C45',fontFamily:"'Syne',sans-serif"}}>₦2,500</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:'1.5rem'}}>
              {[
                {free:true,feat:'Overall verdict (CLEAR/CAUTION/CRITICAL)'},
                {free:true,feat:'6 check results with status'},
                {free:true,feat:'One-line summary per check'},
                {free:false,feat:'Full details for every check'},
                {free:false,feat:'Satellite image of the land'},
                {free:false,feat:'Exact gazette distances'},
                {free:false,feat:'Court case details if found'},
                {free:false,feat:'PDF certificate to share with lawyer'},
              ].map(f=>(
                <div key={f.feat} style={{display:'flex',alignItems:'flex-start',gap:7,padding:'6px 0'}}>
                  <span style={{color:f.free?'#22C55E':'#CFAF6E',fontSize:13,flexShrink:0,marginTop:1}}>{f.free?'✓':'🔑'}</span>
                  <span style={{fontSize:12,color:f.free?'#374151':'#374151',lineHeight:1.4}}>{f.feat}</span>
                </div>
              ))}
            </div>
            <a href="/agent" className="cta-gold" style={{display:'block',padding:'14px 0',borderRadius:11,fontSize:15,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
              Start free · Unlock for ₦2,500 →
            </a>
          </div>
          <p style={{fontSize:11,color:'#9CA3AF',fontFamily:"'JetBrains Mono',monospace"}}>Secure payment via Paystack · Card, bank transfer, USSD · Receipt emailed instantly</p>
        </div>
      </section>

      {/* ── WHAT HAPPENS IF YOU DON'T VERIFY ── */}
      <section id="buyer-guide" style={{background:'#fff',padding:'5rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <p style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#D64545',letterSpacing:'1.5px',marginBottom:8}}>REAL CONSEQUENCES</p>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:600,letterSpacing:'-.5px',marginBottom:'1rem',lineHeight:1.2}}>What happens when you skip verification?</h2>
            <p style={{fontSize:15,color:'#6B7280',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>These are not hypothetical. They happen every week in Lagos.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:'3rem'}}>
            {[
              {icon:'🏛',title:'You buy gazette-acquired land',desc:'The Lagos State Government acquired the land 3 years ago for road expansion. The seller knew. You didn\'t. The government demolishes your structure with no compensation.',cost:'Average loss: ₦8M–₦45M',color:'#D64545'},
              {icon:'👥',title:'Omo Onile appear after purchase',desc:'Three months after you pay and start building, community members arrive demanding ₦500,000 "community levy." When you refuse, construction is halted by force.',cost:'Average loss: ₦2M–₦15M',color:'#D64545'},
              {icon:'💧',title:'You build on a floodplain',desc:'The land looked dry in January. By June, your foundation is underwater. The plot sits in a seasonal floodplain that NIMET has mapped for years.',cost:'Average loss: ₦5M–₦20M',color:'#E6A23C'},
              {icon:'📋',title:'Someone else already owns it',desc:'The seller showed you a genuine-looking C of O. He showed the same document to 4 other buyers. One of them gets the land. The other 3 get nothing.',cost:'Average loss: Full purchase price',color:'#D64545'},
            ].map(s=>(
              <div key={s.title} style={{background:'#FEF2F2',borderRadius:16,padding:'1.5rem',border:`1px solid rgba(214,69,69,0.15)`}}>
                <div style={{fontSize:32,marginBottom:12}}>{s.icon}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:'#111827',marginBottom:8,lineHeight:1.35}}>{s.title}</h3>
                <p style={{fontSize:13,color:'#6B7280',lineHeight:1.7,marginBottom:12}}>{s.desc}</p>
                <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#D64545',fontWeight:600,background:'rgba(214,69,69,0.08)',padding:'6px 10px',borderRadius:6,display:'inline-block'}}>{s.cost}</div>
              </div>
            ))}
          </div>
          <div style={{background:'linear-gradient(135deg,#0A5C45,#07382C)',borderRadius:20,padding:'2rem',textAlign:'center'}}>
            <p style={{fontSize:13,color:'rgba(255,255,255,.6)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:8}}>THE ALTERNATIVE</p>
            <h3 style={{fontFamily:"'Lora',serif",fontSize:24,color:'#fff',fontWeight:600,marginBottom:8}}>LagosLandCheck catches all of these — in 2 minutes.</h3>
            <p style={{fontSize:14,color:'rgba(255,255,255,.6)',marginBottom:'1.5rem'}}>₦2,500 for a full report. Compare that to what you stand to lose.</p>
            <a href="/agent" style={{display:'inline-block',padding:'13px 32px',background:'linear-gradient(135deg,#CFAF6E,#B8942A)',borderRadius:10,fontSize:14,fontWeight:700,color:'#fff',textDecoration:'none'}}>
              Check before you pay →
            </a>
          </div>
        </div>
      </section>

      {/* ── PRIVACY + TRUST ── */}
      <section style={{background:'#F8FAF9',padding:'4rem 1.5rem'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
            {[
              {icon:'🔒',title:'We do not store your documents',desc:'No survey plans, no personal documents are stored permanently. Your query is processed and deleted.'},
              {icon:'🛡️',title:'Data processed securely',desc:'All verification requests are encrypted in transit. We never share your property search data with third parties.'},
              {icon:'⚖️',title:'Pre-screening, not legal advice',desc:'Our reports are intelligence tools. We always recommend engaging a licensed Lagos property lawyer for final due diligence.'},
              {icon:'🌍',title:'Built for diaspora buyers',desc:'Used by Nigerians in UK, US, Canada, and Germany who cannot physically visit land before making purchase decisions.'},
            ].map(t=>(
              <div key={t.title} style={{background:'#fff',borderRadius:14,padding:'1.25rem',border:'1px solid #E5E7EB',display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{fontSize:24,flexShrink:0}}>{t.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'#111827',marginBottom:4}}>{t.title}</div>
                  <div style={{fontSize:12,color:'#6B7280',lineHeight:1.65}}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{background:'#07382C',padding:'5rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:'clamp(28px,4vw,44px)',fontWeight:600,color:'#fff',letterSpacing:'-.5px',marginBottom:'1rem',lineHeight:1.15}}>
            Verify before you pay.<br/>
            <span style={{color:'#CFAF6E',fontStyle:'italic'}}>Every single time.</span>
          </h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,.55)',lineHeight:1.75,marginBottom:'2rem'}}>Takes 2 minutes. Works from anywhere in the world. No account needed to start.</p>
          <a href="/agent" className="cta-gold" style={{display:'inline-block',padding:'15px 40px',borderRadius:11,fontSize:16,fontWeight:700,textDecoration:'none',marginBottom:'1rem'}}>
            🔍 Check a Land Now — Free
          </a>
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem',justifyContent:'center',flexWrap:'wrap',marginTop:'1rem'}}>
            {['No account needed','Works from abroad','Results in 2 minutes'].map(t=>(
              <div key={t} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.4)'}}>
                <span style={{color:'#4ADE80'}}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:'#040E09',padding:'3rem 1.5rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'3rem',marginBottom:'2rem'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <div style={{width:28,height:28,background:'#0A5C45',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span style={{fontWeight:700,fontSize:14,color:'#fff'}}>LagosLandCheck</span>
              </div>
              <p style={{fontSize:12,color:'rgba(255,255,255,.35)',lineHeight:1.7,maxWidth:280,fontFamily:"'Inter',sans-serif"}}>AI-powered land pre-screening intelligence for Lagos, Nigeria. Protecting buyers from fraud since 2026.</p>
            </div>
            <div>
              <p style={{fontSize:10,color:'rgba(255,255,255,.25)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:12}}>PRODUCT</p>
              {[
                ['How it works','#how-it-works'],
                ['AI Agent','/agent'],
                ['Pricing','#pricing'],
              ].map(([l,h])=>(
                <a key={l} href={h} style={{display:'block',fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none',marginBottom:7}}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{fontSize:10,color:'rgba(255,255,255,.25)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:12}}>LEGAL</p>
              {[
                ['Terms of service','/terms'],
                ['Privacy policy','/privacy'],
                ['Refund policy','/refund-policy'],
                ['Contact','/contact'],
                ['support@lagoslandcheck.com','mailto:support@lagoslandcheck.com'],
              ].map(([l,h])=>(
                <a key={l} href={h} style={{display:'block',fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none',marginBottom:7}}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
            <p style={{fontSize:11,color:'rgba(255,255,255,.2)',fontFamily:"'JetBrains Mono',monospace"}}>Pre-screening only — not a substitute for legal due diligence by a licensed Lagos property lawyer.</p>
            <p style={{fontSize:11,color:'rgba(255,255,255,.3)',fontFamily:"'JetBrains Mono',monospace"}}>
              Designed by <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{color:'#CFAF6E',textDecoration:'none',fontWeight:600}}>WafsDesign</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
