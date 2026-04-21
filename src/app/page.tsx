'use client'
import { useRouter } from 'next/navigation'
import InputPanel from '@/components/InputPanel'

export default function Home() {
  const router = useRouter()
  const go = (lat: number, lng: number) => router.push(`/report?lat=${lat}&lng=${lng}`)

  return (
    <main style={{ fontFamily:'Syne,sans-serif', background:'#f8f8f5', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.85}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes draw{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
        @keyframes shimmer{0%{opacity:.4}50%{opacity:.9}100%{opacity:.4}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#f8f8f5}
        .pac-container{border-radius:12px!important;border:1px solid #e0e0d8!important;box-shadow:0 8px 32px rgba(0,0,0,.1)!important;font-family:'Syne',sans-serif!important;margin-top:4px!important}
        .pac-item{padding:10px 14px!important;font-size:13px!important;cursor:pointer!important;border-top:.5px solid #f0f0ec!important}
        .pac-item:hover,.pac-item-selected{background:#f0faf5!important}
        .pac-matched{color:#0F6E56!important;font-weight:600!important}
        .pac-icon{display:none!important}
        .section{max-width:620px;margin:0 auto;padding:0 1.25rem}
        @media(min-width:680px){.section{padding:0 2rem}}
        .card{background:#fff;border-radius:16px;border:.5px solid #e8e8e2;overflow:hidden;margin-bottom:1rem;box-shadow:0 1px 8px rgba(0,0,0,.04)}
        .step-card:hover{border-color:#9FE1CB!important;background:#fafffe!important}
        .btn-ghost:hover{background:#e8f5ee!important;color:#0F6E56!important;border-color:#9FE1CB!important}
      `}</style>

      {/* ══ HERO ══ */}
      <div style={{position:'relative',overflow:'hidden',background:'linear-gradient(180deg,#040c18 0%,#081525 30%,#0c1d30 52%,#102618 72%,#0a1e12 100%)',paddingBottom:'38%',minHeight:'92vw',maxHeight:'100vh'}}>
        {/* Stars */}
        {[[7,5],[14,11],[22,4],[31,8],[42,5],[55,11],[62,6],[71,9],[82,4],[91,7],[5,19],[18,23],[33,15],[47,20],[57,14],[68,22],[77,16],[88,20],[95,13],[12,29],[24,33],[38,26],[51,30],[64,27],[75,32],[85,28]].map(([x,y],i)=>(
          <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:i%3===0?2:1,height:i%3===0?2:1,background:'#fff',borderRadius:'50%',opacity:.25+(i%4)*.15,animation:`twinkle ${2+(i%3)}s ease-in-out infinite`,animationDelay:`${(i%7)*.3}s`}}/>
        ))}
        <div style={{position:'absolute',top:'8%',right:'8%',width:36,height:36,background:'radial-gradient(circle at 33% 33%,#fffef0,#eebc40)',borderRadius:'50%',boxShadow:'0 0 18px 4px rgba(225,175,50,.12)'}}/>

        {/* Skyline */}
        <div style={{position:'absolute',bottom:0,left:0,right:0}}>
          <svg viewBox="0 0 800 280" style={{display:'block',width:'100%'}} preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#193658"/><stop offset="100%" stopColor="#0d2035"/></linearGradient>
              <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#11271a"/><stop offset="100%" stopColor="#080f0a"/></linearGradient>
              <linearGradient id="b3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c4878"/><stop offset="100%" stopColor="#102b50"/></linearGradient>
              <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#091c30" stopOpacity=".95"/><stop offset="100%" stopColor="#030a14"/></linearGradient>
            </defs>
            <rect x="0" y="215" width="800" height="65" fill="url(#wt)"/>
            <line x1="0" y1="228" x2="800" y2="228" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
            <rect x="0" y="188" width="42" height="30" fill="#08172a" opacity=".7"/>
            <rect x="48" y="175" width="36" height="43" fill="#08172a" opacity=".7"/>
            <rect x="692" y="182" width="48" height="36" fill="#08172a" opacity=".7"/>
            <rect x="748" y="194" width="52" height="24" fill="#08172a" opacity=".7"/>
            <rect x="14" y="80" width="42" height="138" fill="url(#b1)"/>
            <rect x="16" y="78" width="38" height="3" fill="#1c4878"/>
            <rect x="20" y="88" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="32" y="88" width="8" height="8" fill="rgba(85,145,215,.18)"/><rect x="20" y="103" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="32" y="103" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="20" y="118" width="8" height="8" fill="rgba(85,145,215,.15)"/><rect x="32" y="118" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="20" y="133" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="32" y="133" width="8" height="8" fill="rgba(85,145,215,.18)"/><rect x="20" y="148" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="32" y="148" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="20" y="163" width="8" height="8" fill="rgba(85,145,215,.15)"/><rect x="32" y="163" width="8" height="8" fill="rgba(255,212,85,.42)"/>
            <line x1="35" y1="78" x2="35" y2="56" stroke="#1c4878" strokeWidth="1.5"/>
            <circle cx="35" cy="54" r="2.5" fill="#ff2222" opacity=".9" style={{animation:'blink 2s infinite'}}/>
            <rect x="64" y="115" width="68" height="103" fill="url(#b2)"/>
            <rect x="68" y="125" width="9" height="10" fill="rgba(255,208,80,.32)"/><rect x="82" y="125" width="9" height="10" fill="rgba(75,135,205,.14)"/><rect x="96" y="125" width="9" height="10" fill="rgba(255,208,80,.32)"/><rect x="110" y="125" width="9" height="10" fill="rgba(255,208,80,.30)"/><rect x="68" y="142" width="9" height="10" fill="rgba(75,135,205,.14)"/><rect x="82" y="142" width="9" height="10" fill="rgba(255,208,80,.32)"/><rect x="96" y="142" width="9" height="10" fill="rgba(255,208,80,.30)"/><rect x="110" y="142" width="9" height="10" fill="rgba(75,135,205,.14)"/><rect x="68" y="159" width="9" height="10" fill="rgba(255,208,80,.32)"/><rect x="82" y="159" width="9" height="10" fill="rgba(255,208,80,.30)"/><rect x="96" y="159" width="9" height="10" fill="rgba(75,135,205,.14)"/><rect x="110" y="159" width="9" height="10" fill="rgba(255,208,80,.32)"/>
            <rect x="142" y="52" width="32" height="166" fill="url(#b3)"/>
            <rect x="144" y="50" width="28" height="3" fill="#265888"/>
            <rect x="148" y="60" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="60" width="9" height="9" fill="rgba(105,170,240,.2)"/><rect x="148" y="76" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="161" y="76" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="148" y="92" width="9" height="9" fill="rgba(105,170,240,.16)"/><rect x="161" y="92" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="148" y="108" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="108" width="9" height="9" fill="rgba(105,170,240,.2)"/><rect x="148" y="124" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="161" y="124" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="148" y="140" width="9" height="9" fill="rgba(105,170,240,.16)"/><rect x="161" y="140" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="148" y="156" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="156" width="9" height="9" fill="rgba(105,170,240,.2)"/>
            <line x1="158" y1="50" x2="158" y2="28" stroke="#265888" strokeWidth="1.5"/>
            <circle cx="158" cy="26" r="2.5" fill="#ff2222" opacity=".85" style={{animation:'blink 2.4s infinite'}}/>
            <rect x="298" y="16" width="58" height="202" fill="url(#b3)"/>
            <rect x="302" y="14" width="50" height="4" fill="#2a62b0"/>
            <polygon points="327,14 314,0 340,0" fill="#1c4878"/>
            <rect x="306" y="24" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="24" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="24" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="40" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="40" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="40" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="306" y="56" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="320" y="56" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="56" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="72" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="72" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="72" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="306" y="88" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="88" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="88" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="306" y="104" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="104" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="104" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="120" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="320" y="120" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="120" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="306" y="136" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="136" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="136" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="152" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="152" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="152" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="306" y="168" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="168" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="168" width="10" height="9" fill="rgba(255,225,120,.46)"/>
            <line x1="327" y1="0" x2="327" y2="-14" stroke="#2a62b0" strokeWidth="2"/>
            <circle cx="327" cy="-15" r="3" fill="#ff1111" opacity=".95" style={{animation:'blink 1.7s infinite'}}/>
            <rect x="368" y="78" width="36" height="140" fill="url(#b1)"/>
            <rect x="414" y="78" width="36" height="140" fill="url(#b1)"/>
            <rect x="370" y="124" width="72" height="5" fill="#1c4878" opacity=".85"/>
            <rect x="373" y="88" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="385" y="88" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="419" y="88" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="431" y="88" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="373" y="103" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="385" y="103" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="419" y="103" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="431" y="103" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="373" y="118" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="385" y="118" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="419" y="118" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="431" y="118" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="373" y="136" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="385" y="136" width="8" height="8" fill="rgba(255,212,85,.35)"/><rect x="419" y="136" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="431" y="136" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="373" y="151" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="385" y="151" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="419" y="151" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="431" y="151" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="373" y="166" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="385" y="166" width="8" height="8" fill="rgba(85,148,212,.16)"/><rect x="419" y="166" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="431" y="166" width="8" height="8" fill="rgba(255,212,85,.35)"/>
            <rect x="520" y="92" width="52" height="126" fill="url(#b2)"/>
            <rect x="525" y="102" width="7" height="9" fill="rgba(255,202,75,.32)"/><rect x="537" y="102" width="7" height="9" fill="rgba(62,128,195,.13)"/><rect x="549" y="102" width="7" height="9" fill="rgba(255,202,75,.32)"/><rect x="561" y="102" width="7" height="9" fill="rgba(255,202,75,.30)"/><rect x="525" y="118" width="7" height="9" fill="rgba(255,202,75,.30)"/><rect x="537" y="118" width="7" height="9" fill="rgba(255,202,75,.32)"/><rect x="549" y="118" width="7" height="9" fill="rgba(62,128,195,.13)"/><rect x="561" y="118" width="7" height="9" fill="rgba(255,202,75,.32)"/><rect x="525" y="134" width="7" height="9" fill="rgba(62,128,195,.13)"/><rect x="537" y="134" width="7" height="9" fill="rgba(255,202,75,.30)"/><rect x="549" y="134" width="7" height="9" fill="rgba(255,202,75,.32)"/><rect x="561" y="134" width="7" height="9" fill="rgba(62,128,195,.13)"/>
            <rect x="581" y="55" width="40" height="163" fill="url(#b3)"/>
            <rect x="584" y="53" width="34" height="3" fill="#265888"/>
            <rect x="587" y="62" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="62" width="10" height="9" fill="rgba(105,172,242,.19)"/><rect x="587" y="78" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="78" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="94" width="10" height="9" fill="rgba(105,172,242,.16)"/><rect x="601" y="94" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="110" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="110" width="10" height="9" fill="rgba(105,172,242,.19)"/><rect x="587" y="126" width="10" height="9" fill="rgba(255,222,110,.40)"/><rect x="601" y="126" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="142" width="10" height="9" fill="rgba(105,172,242,.16)"/><rect x="601" y="142" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="158" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="158" width="10" height="9" fill="rgba(105,172,242,.19)"/>
            <line x1="601" y1="53" x2="601" y2="30" stroke="#265888" strokeWidth="1.5"/>
            <circle cx="601" cy="28" r="2.5" fill="#ff2222" opacity=".85" style={{animation:'blink 2.1s infinite'}}/>
            <rect x="632" y="120" width="58" height="98" fill="#0a1c2c"/>
            <rect x="637" y="130" width="7" height="9" fill="rgba(255,195,70,.28)"/><rect x="649" y="130" width="7" height="9" fill="rgba(52,118,178,.1)"/><rect x="661" y="130" width="7" height="9" fill="rgba(255,195,70,.28)"/><rect x="673" y="130" width="7" height="9" fill="rgba(255,195,70,.26)"/><rect x="684" y="130" width="7" height="9" fill="rgba(52,118,178,.1)"/><rect x="637" y="146" width="7" height="9" fill="rgba(255,195,70,.26)"/><rect x="649" y="146" width="7" height="9" fill="rgba(255,195,70,.28)"/><rect x="661" y="146" width="7" height="9" fill="rgba(52,118,178,.1)"/><rect x="673" y="146" width="7" height="9" fill="rgba(255,195,70,.28)"/><rect x="684" y="146" width="7" height="9" fill="rgba(255,195,70,.26)"/>
            <rect x="702" y="76" width="40" height="142" fill="url(#b1)"/>
            <rect x="705" y="74" width="34" height="3" fill="#1c4878"/>
            <rect x="709" y="84" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="84" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="709" y="99" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="99" width="9" height="8" fill="rgba(255,212,100,.38)"/><rect x="709" y="114" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="722" y="114" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="709" y="129" width="9" height="8" fill="rgba(255,212,100,.38)"/><rect x="722" y="129" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="709" y="144" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="144" width="9" height="8" fill="rgba(255,212,100,.38)"/>
            <line x1="722" y1="74" x2="722" y2="52" stroke="#1c4878" strokeWidth="1.5"/>
            <circle cx="722" cy="50" r="2.5" fill="#ff4444" opacity=".75" style={{animation:'blink 2.8s infinite'}}/>
            <rect x="752" y="140" width="47" height="78" fill="url(#b2)"/>
            <rect x="757" y="150" width="7" height="9" fill="rgba(255,198,72,.28)"/><rect x="769" y="150" width="7" height="9" fill="rgba(52,115,175,.1)"/><rect x="781" y="150" width="7" height="9" fill="rgba(255,198,72,.28)"/><rect x="757" y="166" width="7" height="9" fill="rgba(52,115,175,.1)"/><rect x="769" y="166" width="7" height="9" fill="rgba(255,198,72,.28)"/><rect x="781" y="166" width="7" height="9" fill="rgba(255,198,72,.26)"/>
            <rect x="0" y="218" width="800" height="4" fill="#071508" opacity=".95"/>
            <rect x="35" y="221" width="2" height="35" fill="rgba(255,198,72,.1)"/>
            <rect x="158" y="221" width="2" height="31" fill="rgba(255,198,72,.1)"/>
            <rect x="327" y="221" width="3" height="42" fill="rgba(255,198,72,.12)"/>
            <rect x="386" y="221" width="2" height="35" fill="rgba(255,198,72,.08)"/>
            <rect x="422" y="221" width="2" height="35" fill="rgba(255,198,72,.08)"/>
            <rect x="601" y="221" width="2" height="38" fill="rgba(255,198,72,.1)"/>
            <rect x="722" y="221" width="2" height="33" fill="rgba(255,198,72,.08)"/>
          </svg>
        </div>

        {/* Horizon glow */}
        <div style={{position:'absolute',bottom:'26%',left:'50%',transform:'translateX(-50%)',width:'50%',height:40,background:'radial-gradient(ellipse,rgba(15,110,86,.15) 0%,transparent 70%)',filter:'blur(10px)'}}/>

        {/* Nav */}
        <nav style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.25rem 1.5rem',maxWidth:720,margin:'0 auto',width:'100%'}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:30,height:30,background:'#0F6E56',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 14px rgba(15,110,86,.55)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{fontWeight:700,fontSize:15,color:'#fff',letterSpacing:'-.3px'}}>LagosLandCheck</span>
            <span style={{fontSize:9,fontFamily:'DM Mono,monospace',background:'rgba(15,110,86,.28)',color:'#5DCAA5',border:'.5px solid rgba(93,202,165,.35)',padding:'2px 6px',borderRadius:4}}>BETA</span>
          </div>
          <a href="#guide" style={{fontSize:11,color:'rgba(255,255,255,.4)',textDecoration:'none',fontFamily:'DM Mono,monospace',display:'none'}}>Guide</a>
        </nav>

        {/* Hero text */}
        <div style={{position:'relative',zIndex:10,textAlign:'center',padding:'0.5rem 1.5rem 0',maxWidth:580,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(15,110,86,.18)',border:'.5px solid rgba(93,202,165,.32)',borderRadius:20,padding:'4px 12px',fontSize:10,fontFamily:'DM Mono,monospace',color:'#5DCAA5',letterSpacing:'1.5px',marginBottom:'1rem'}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#5DCAA5',animation:'blink 1.5s infinite',display:'inline-block'}}/>
            LAGOS LAND INTELLIGENCE
          </div>
          <h1 style={{fontFamily:'Instrument Serif,serif',fontSize:'clamp(26px,7vw,52px)',lineHeight:1.12,color:'#fff',marginBottom:'.75rem'}}>
            Verify Lagos land before you{' '}
            <em style={{fontStyle:'italic',color:'#5DCAA5',textShadow:'0 0 22px rgba(93,202,165,.35)'}}>lose a kobo.</em>
          </h1>
          <p style={{fontSize:'clamp(12px,3vw,14px)',color:'rgba(255,255,255,.5)',lineHeight:1.75,marginBottom:'1.25rem'}}>
            6 automated checks in under 2 minutes — not 48 hours.
          </p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginBottom:'1rem'}}>
            {[{n:'$4B+',l:'fraud/yr Nigeria'},{n:'1,500+',l:'Lagos cases'},{n:'2 min',l:'vs 48hr others'}].map(s=>(
              <div key={s.n} style={{background:'rgba(255,255,255,.07)',backdropFilter:'blur(6px)',border:'.5px solid rgba(255,255,255,.11)',borderRadius:9,padding:'7px 12px',textAlign:'center'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#5DCAA5'}}>{s.n}</div>
                <div style={{fontSize:9,color:'rgba(255,255,255,.35)',fontFamily:'DM Mono,monospace',marginTop:1,whiteSpace:'nowrap'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ INPUT CARD ══ */}
      <div className="section" style={{marginTop:-28,position:'relative',zIndex:20}}>
        <div className="card" style={{borderRadius:20,boxShadow:'0 4px 24px rgba(0,0,0,.1)'}}>
          <div style={{padding:'1.1rem 1.75rem 0'}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:2}}>VERIFY A PROPERTY</p>
            <h2 style={{fontFamily:'Instrument Serif,serif',fontSize:20,color:'#111',marginBottom:2}}>Where is the land?</h2>
            <p style={{fontSize:12,color:'#aaa',lineHeight:1.55}}>Type the address or area name — it works like Google Maps.</p>
          </div>
          <InputPanel onSubmit={go}/>
        </div>
      </div>

      {/* ══ TAGS ══ */}
      <div className="section" style={{paddingTop:'1rem',paddingBottom:'.5rem'}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
          {['Gazette DB','NIMET flood zones','Omo Onile alerts','Court records','LUC status','Satellite AI'].map(t=>(
            <span key={t} style={{fontSize:11,fontFamily:'DM Mono,monospace',padding:'5px 12px',borderRadius:20,border:'.5px solid #e0e0d8',color:'#888',background:'#fff'}}>{t}</span>
          ))}
        </div>
      </div>

      {/* ══ ANIMATED LAGOS MAP ══ */}
      <div className="section" style={{paddingTop:'1.5rem',paddingBottom:'.5rem'}}>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'14px 18px 10px',borderBottom:'.5px solid #f0f0ea',display:'flex',alignItems:'center',gap:8}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#0F6E56"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span style={{fontSize:11,fontFamily:'DM Mono,monospace',color:'#0F6E56',letterSpacing:'1px',fontWeight:500}}>LAGOS STATE, NIGERIA</span>
            <span style={{marginLeft:'auto',fontSize:10,fontFamily:'DM Mono,monospace',color:'#bbb'}}>6.5244°N 3.3792°E</span>
          </div>
          {/* Animated SVG map illustration */}
          <div style={{background:'#0d1f2d',padding:'1.5rem 1rem',position:'relative',overflow:'hidden'}}>
            <svg viewBox="0 0 500 280" style={{width:'100%',display:'block'}} xmlns="http://www.w3.org/2000/svg">
              {/* Ocean / water base */}
              <rect width="500" height="280" fill="#0d1f2d"/>
              {/* Water shimmer lines */}
              <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(30,100,160,.3)" strokeWidth="1" strokeDasharray="8,6"/>
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(30,100,160,.25)" strokeWidth="1" strokeDasharray="12,8"/>
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(30,100,160,.2)" strokeWidth="1" strokeDasharray="6,10"/>

              {/* Lagos Lagoon - stylised */}
              <ellipse cx="250" cy="160" rx="220" ry="60" fill="rgba(15,60,120,.5)" stroke="rgba(30,100,180,.3)" strokeWidth="1"/>
              <ellipse cx="250" cy="160" rx="200" ry="50" fill="rgba(10,45,100,.4)"/>

              {/* Atlantic Ocean label area */}
              <text x="250" y="258" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:9,fill:'rgba(100,160,220,.5)',letterSpacing:'3px'}}>BIGHT OF BENIN</text>

              {/* Lagos Island - main */}
              <path d="M 180,130 Q 200,118 230,120 Q 270,118 300,122 Q 320,124 315,135 Q 310,145 290,148 Q 260,152 230,150 Q 200,148 185,142 Z" fill="#1a3a22" stroke="rgba(93,202,165,.4)" strokeWidth="1"/>

              {/* Victoria Island */}
              <path d="M 290,128 Q 320,120 360,122 Q 385,124 382,134 Q 378,144 355,147 Q 325,150 300,146 Q 288,140 290,128 Z" fill="#1a3a22" stroke="rgba(93,202,165,.35)" strokeWidth="1"/>

              {/* Lekki Peninsula */}
              <path d="M 355,130 Q 390,122 430,128 Q 460,132 470,142 Q 465,152 440,155 Q 410,158 380,152 Q 358,146 355,130 Z" fill="#152e1a" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>

              {/* Ikoyi */}
              <path d="M 240,120 Q 265,112 285,114 Q 298,116 295,126 Q 292,134 272,136 Q 250,138 242,130 Z" fill="#1e4228" stroke="rgba(93,202,165,.35)" strokeWidth="1"/>

              {/* Mainland */}
              <path d="M 60,80 Q 120,65 200,68 Q 280,65 360,70 Q 420,73 450,82 Q 460,95 440,105 Q 400,115 340,118 Q 270,122 200,120 Q 130,118 90,112 Q 62,105 60,80 Z" fill="#1a3a22" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>

              {/* Apapa port */}
              <rect x="148" y="108" width="28" height="18" rx="2" fill="#122a18" stroke="rgba(93,202,165,.4)" strokeWidth="1"/>
              <rect x="152" y="112" width="6" height="10" fill="rgba(255,200,80,.2)"/>
              <rect x="161" y="112" width="6" height="10" fill="rgba(255,200,80,.15)"/>
              <rect x="170" y="112" width="5" height="10" fill="rgba(255,200,80,.2)"/>

              {/* Third Mainland Bridge */}
              <path d="M 200,118 Q 210,130 215,145 Q 218,155 215,162" fill="none" stroke="rgba(255,220,100,.5)" strokeWidth="2" strokeDasharray="4,3"/>
              <path d="M 200,118 Q 205,126 208,138 Q 210,148 208,158" fill="none" stroke="rgba(255,220,100,.3)" strokeWidth="1" strokeDasharray="3,4"/>

              {/* Carter Bridge */}
              <line x1="200" y1="148" x2="200" y2="118" stroke="rgba(255,220,100,.45)" strokeWidth="1.5" strokeDasharray="3,3"/>

              {/* Roads on Island */}
              <line x1="195" y1="134" x2="310" y2="134" stroke="rgba(255,255,255,.12)" strokeWidth="1.5"/>
              <line x1="240" y1="120" x2="240" y2="148" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
              <line x1="270" y1="119" x2="270" y2="147" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>

              {/* Lekki Expressway */}
              <line x1="355" y1="138" x2="468" y2="144" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" strokeDasharray="6,4"/>

              {/* KEY LOCATION PINS with pulse */}
              {/* Lagos Island / Eko */}
              <circle cx="230" cy="135" r="12" fill="rgba(15,110,86,.15)" style={{animation:'pulse-ring 2s ease-out infinite'}}/>
              <circle cx="230" cy="135" r="5" fill="#0F6E56" stroke="#5DCAA5" strokeWidth="1.5"/>
              <circle cx="230" cy="135" r="2" fill="#fff"/>

              {/* Victoria Island */}
              <circle cx="335" cy="136" r="10" fill="rgba(15,110,86,.12)" style={{animation:'pulse-ring 2s ease-out infinite',animationDelay:'.4s'}}/>
              <circle cx="335" cy="136" r="4" fill="#0F6E56" stroke="#5DCAA5" strokeWidth="1.5"/>
              <circle cx="335" cy="136" r="1.5" fill="#fff"/>

              {/* Lekki */}
              <circle cx="415" cy="140" r="9" fill="rgba(15,110,86,.12)" style={{animation:'pulse-ring 2s ease-out infinite',animationDelay:'.8s'}}/>
              <circle cx="415" cy="140" r="4" fill="#0F6E56" stroke="#5DCAA5" strokeWidth="1.5"/>
              <circle cx="415" cy="140" r="1.5" fill="#fff"/>

              {/* Ikeja (mainland) */}
              <circle cx="200" cy="85" r="9" fill="rgba(15,110,86,.12)" style={{animation:'pulse-ring 2s ease-out infinite',animationDelay:'1.2s'}}/>
              <circle cx="200" cy="85" r="4" fill="#0F6E56" stroke="#5DCAA5" strokeWidth="1.5"/>
              <circle cx="200" cy="85" r="1.5" fill="#fff"/>

              {/* Labels */}
              <text x="230" y="128" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(93,202,165,.9)',fontWeight:'bold'}}>LAGOS ISLAND</text>
              <text x="335" y="129" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(93,202,165,.8)'}}>VICTORIA IS.</text>
              <text x="418" y="132" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(93,202,165,.75)'}}>LEKKI</text>
              <text x="200" y="78" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(93,202,165,.8)'}}>IKEJA</text>
              <text x="148" y="104" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(255,200,80,.6)'}}>APAPA</text>
              <text x="250" y="175" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:8,fill:'rgba(30,100,180,.7)',letterSpacing:'1px'}}>LAGOS LAGOON</text>

              {/* Compass rose */}
              <g transform="translate(462,28)">
                <circle r="14" fill="rgba(15,110,86,.15)" stroke="rgba(93,202,165,.3)" strokeWidth="1"/>
                <text x="0" y="-6" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:8,fill:'rgba(93,202,165,.8)',fontWeight:'bold'}}>N</text>
                <text x="0" y="11" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:6,fill:'rgba(93,202,165,.5)'}}>S</text>
                <text x="-9" y="3" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:6,fill:'rgba(93,202,165,.5)'}}>W</text>
                <text x="9" y="3" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:6,fill:'rgba(93,202,165,.5)'}}>E</text>
                <line x1="0" y1="-10" x2="0" y2="-4" stroke="rgba(93,202,165,.8)" strokeWidth="1.5"/>
              </g>

              {/* Scale bar */}
              <g transform="translate(30,260)">
                <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(93,202,165,.5)" strokeWidth="1.5"/>
                <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(93,202,165,.5)" strokeWidth="1.5"/>
                <line x1="40" y1="-3" x2="40" y2="3" stroke="rgba(93,202,165,.5)" strokeWidth="1.5"/>
                <text x="20" y="-6" textAnchor="middle" style={{fontFamily:'DM Mono,monospace',fontSize:7,fill:'rgba(93,202,165,.6)'}}>~20km</text>
              </g>
            </svg>
          </div>
          <div style={{padding:'10px 18px 12px',background:'#f9f9f6',borderTop:'.5px solid #f0f0ea',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontSize:10,color:'#aaa',fontFamily:'DM Mono,monospace'}}>Lagos State · Pop. ~25 million · 3,345 km²</p>
            <p style={{fontSize:10,color:'#aaa',fontFamily:'DM Mono,monospace'}}>Nigeria, West Africa</p>
          </div>
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div className="section" style={{paddingTop:'1.5rem'}}>
        <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:4}}>HOW IT WORKS</p>
        <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:20,color:'#111',marginBottom:'1rem'}}>6 checks run simultaneously</h3>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {[
            {n:'01',name:'Satellite imagery',desc:'GPT-4o Vision analyses the land — swamp, water body, encroachment, setback violations.',tag:'AI',tc:'#1a5fa0'},
            {n:'02',name:'Gazette & govt acquisition',desc:'All Lagos State Gazettes parsed into our database. Any government acquisition within 500m?',tag:'CRITICAL',tc:'#8b1a1a'},
            {n:'03',name:'Flood & drainage risk',desc:'NIMET flood shapefiles + Lagos drainage master plan. Flags unbuildable zones and 30m setbacks.',tag:'GIS',tc:'#0F6E56'},
            {n:'04',name:'Court litigation',desc:'Lagos Judiciary cause lists scraped and indexed. Any active property disputes nearby?',tag:'LEGAL',tc:'#7a4800'},
            {n:'05',name:'Land Use Charge status',desc:'LUC portal checked by address. No payments since 2018+ is an immediate amber flag.',tag:'LUC',tc:'#0F6E56'},
            {n:'06',name:'Fraud zone & Omo Onile',desc:'Curated DB of fraud zones from court records and verified lawyer submissions. 500m radius.',tag:'ALERT',tc:'#8b1a1a'},
          ].map(c=>(
            <div key={c.n} className="card" style={{display:'flex',gap:12,padding:'12px 16px'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'#ccc',minWidth:22,paddingTop:2}}>{c.n}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:500,color:'#111'}}>{c.name}</span>
                  <span style={{fontSize:9,fontFamily:'DM Mono,monospace',padding:'2px 6px',borderRadius:4,background:`${c.tc}14`,color:c.tc,fontWeight:500}}>{c.tag}</span>
                </div>
                <p style={{fontSize:12,color:'#999',lineHeight:1.6}}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ LAND BUYING GUIDE ══ */}
      <div className="section" style={{paddingTop:'1.5rem'}} id="guide">
        <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:4}}>BUYER'S GUIDE</p>
        <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:20,color:'#111',marginBottom:'0.3rem'}}>How to safely buy land in Lagos</h3>
        <p style={{fontSize:12,color:'#aaa',marginBottom:'1rem',lineHeight:1.6}}>Follow these 8 steps in order. Skipping any one of them is how people lose millions.</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[
            {s:'1',title:'Run LagosLandCheck first',desc:'Before meeting agents or viewing the land — run our 6 checks. Eliminates the biggest fraud risks instantly at almost zero cost.',icon:'🔍',hi:true},
            {s:'2',title:'Hire your own licensed lawyer',desc:'Engage a property solicitor from the Nigerian Bar Association. Never use the seller\'s lawyer. Budget 5–10% of property value in legal fees.',icon:'⚖'},
            {s:'3',title:'Search the Land Registry',desc:'Your lawyer must conduct a physical search at the Lagos State Land Registry, Alausa. Confirms title, ownership history, and any charges.',icon:'📋'},
            {s:'4',title:'Verify the survey plan',desc:'Get a Registered Survey Plan from the seller. Cross-check beacon numbers with a licensed surveyor. Fake survey plans are extremely common.',icon:'📐'},
            {s:'5',title:'Confirm no gazette acquisition',desc:'Our check flags risks, but your lawyer must also verify physically with the Ministry of Lands. No government acquisition order should exist.',icon:'📰'},
            {s:'6',title:'Get LUC clearance certificate',desc:'Request a Land Use Charge clearance from the seller. Outstanding LUC transfers to you at purchase — it is a legal charge on the land.',icon:'🧾'},
            {s:'7',title:'Due diligence on the vendor',desc:'Verify the seller\'s identity documents. If it\'s a company, search at CAC (Corporate Affairs Commission). Check for court orders against the vendor.',icon:'👤'},
            {s:'8',title:'Insist on C of O or Governor\'s Consent',desc:'Minimum acceptable title: Certificate of Occupancy or Governor\'s Consent. Reject "Deed of Assignment only" without an underlying C of O.',icon:'📜'},
          ].map(st=>(
            <div key={st.s} className="card step-card" style={{display:'flex',gap:12,padding:'14px 16px',border:st.hi?'.5px solid rgba(15,110,86,.3)!important':'',background:st.hi?'linear-gradient(135deg,#f0faf5,#eaf7f0)':'',transition:'all .2s'}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:st.hi?'#0F6E56':'#f0f0ea',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:st.hi?0:14}}>
                {st.hi ? <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg> : st.icon}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600,color:st.hi?'#0F6E56':'#111'}}>Step {st.s}: {st.title}</span>
                  {st.hi && <span style={{fontSize:9,fontFamily:'DM Mono,monospace',background:'#0F6E56',color:'#fff',padding:'2px 6px',borderRadius:4,flexShrink:0}}>START HERE</span>}
                </div>
                <p style={{fontSize:12,color:st.hi?'#1a5a3a':'#888',lineHeight:1.65}}>{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,padding:'12px 16px',background:'rgba(255,140,0,.07)',borderRadius:12,border:'.5px solid rgba(255,140,0,.25)'}}>
          <p style={{fontSize:12,color:'#7a4800',lineHeight:1.65,fontWeight:500}}>⚠ Never pay any money — not even a "token deposit" — before completing Steps 1–5. This is the most common way Nigerians lose money to land fraud.</p>
        </div>
      </div>

      {/* ══ VS COMPETITORS ══ */}
      <div className="section" style={{paddingTop:'1.5rem'}}>
        <div className="card" style={{background:'#0F2A1A',border:'none',padding:'1.25rem 1.5rem'}}>
          <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'rgba(255,255,255,.4)',marginBottom:3}}>VS COMPETITORS</p>
          <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:19,color:'#fff',marginBottom:'1rem'}}>Instant vs 24–48 hours</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div>
              <div style={{fontSize:9,fontFamily:'DM Mono,monospace',color:'rgba(255,255,255,.3)',marginBottom:8}}>OTHERS</div>
              {['24–48hr wait','Manual review','₦15k–₦50k upfront','No instant check'].map(x=>(
                <div key={x} style={{display:'flex',gap:7,marginBottom:6}}>
                  <span style={{color:'rgba(255,255,255,.2)',fontSize:11,flexShrink:0}}>✕</span>
                  <span style={{fontSize:12,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{x}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:9,fontFamily:'DM Mono,monospace',color:'#9FE1CB',marginBottom:8}}>LAGOSLANDCHECK</div>
              {['Under 2 minutes','Automated AI + GIS','Fraction of cost','Know before you pay'].map(x=>(
                <div key={x} style={{display:'flex',gap:7,marginBottom:6}}>
                  <span style={{color:'#5DCAA5',fontSize:11,flexShrink:0}}>✓</span>
                  <span style={{fontSize:12,color:'rgba(255,255,255,.8)',lineHeight:1.5}}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ WHO IT'S FOR ══ */}
      <div className="section" style={{paddingTop:'1.5rem'}}>
        <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:4}}>WHO IT'S FOR</p>
        <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:20,color:'#111',marginBottom:'1rem'}}>Built for diaspora and locals</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            {e:'✈',t:'Diaspora buyers',d:'UK, US, Canada. Your rep takes a photo — we extract GPS and run all 6 checks.'},
            {e:'⚖',t:'Property lawyers',d:'Pre-screen before advising clients. Flag issues before the Land Registry search.'},
            {e:'🏡',t:'Lagos locals',d:'Know about gazette and flood risk before paying any deposit to any agent.'},
            {e:'🏢',t:'Estate agents',d:'Protect your reputation. Screen every listing before presenting to clients.'},
          ].map(w=>(
            <div key={w.t} className="card" style={{padding:'14px'}}>
              <div style={{fontSize:20,marginBottom:6}}>{w.e}</div>
              <div style={{fontSize:13,fontWeight:500,color:'#111',marginBottom:4}}>{w.t}</div>
              <div style={{fontSize:11,color:'#999',lineHeight:1.55}}>{w.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FINAL CTA ══ */}
      <div className="section" style={{paddingTop:'1.5rem',textAlign:'center'}}>
        <div className="card" style={{padding:'1.5rem',textAlign:'center'}}>
          <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:20,color:'#111',marginBottom:6}}>Ready to verify a property?</h3>
          <p style={{fontSize:13,color:'#aaa',marginBottom:'1rem'}}>Takes under 2 minutes. No account needed.</p>
          <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{width:'100%',padding:13,background:'#0F6E56',border:'none',borderRadius:10,fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,color:'#fff',cursor:'pointer'}}>
            Run a verification →
          </button>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="section">
        <footer style={{paddingTop:'1rem',paddingBottom:'2.5rem',borderTop:'.5px solid #e8e8e2',marginTop:'1.5rem',display:'flex',flexDirection:'column',gap:6,alignItems:'center',textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:24,height:24,background:'#0F6E56',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{fontWeight:700,fontSize:14,color:'#333'}}>LagosLandCheck</span>
          </div>
          <p style={{fontSize:10,color:'#bbb',fontFamily:'DM Mono,monospace'}}>Lagos land pre-screening intelligence · Beta 2026</p>
          <p style={{fontSize:10,color:'#bbb',fontFamily:'DM Mono,monospace'}}>
            Pre-screening only — not a substitute for legal due diligence
          </p>
          <p style={{fontSize:11,color:'#aaa',fontFamily:'DM Mono,monospace',marginTop:4}}>
            Designed by{' '}
            <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{color:'#0F6E56',textDecoration:'none',fontWeight:600}}>
              WafsDesign
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
