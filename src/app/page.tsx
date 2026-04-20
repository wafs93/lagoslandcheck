'use client'

import { useRouter } from 'next/navigation'
import InputPanel from '@/components/InputPanel'

export default function Home() {
  const router = useRouter()

  const handleSubmit = (lat: number, lng: number) => {
    router.push(`/report?lat=${lat}&lng=${lng}`)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#060e06', fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.25} 50%{opacity:0.85} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Desktop layout */
        @media (min-width: 900px) {
          .hero-wrap { flex-direction: row !important; min-height: 100vh; }
          .hero-left { width: 55% !important; min-height: 100vh !important; padding-bottom: 0 !important; }
          .hero-right { width: 45% !important; position: sticky !important; top: 0 !important; height: 100vh !important; overflow-y: auto !important; display: flex !important; flex-direction: column !important; justify-content: center !important; }
          .skyline-svg { height: 100vh !important; }
          .hero-text-pad { padding-bottom: 38% !important; }
          .stats-row { justify-content: flex-start !important; }
          .tags-row { justify-content: flex-start !important; }
          .hero-h1 { font-size: 52px !important; text-align: left !important; }
          .hero-p { text-align: left !important; }
          .hero-badge { margin-left: 0 !important; }
          .info-sections { display: block !important; }
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }

        /* Mobile */
        @media (max-width: 899px) {
          .info-sections { display: block; }
        }

        .check-hover:hover { background: rgba(255,255,255,0.03) !important; }
        .stat-hover:hover { border-color: rgba(93,202,165,0.5) !important; }
        .cta-green:hover { background: #085041 !important; }

        /* Google Places autocomplete dropdown */
        .pac-container {
          border-radius: 10px !important;
          border: 1px solid #e0e0dc !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
          font-family: 'Syne', sans-serif !important;
          margin-top: 4px !important;
        }
        .pac-item { padding: 10px 14px !important; font-size: 13px !important; cursor: pointer !important; }
        .pac-item:hover { background: #f0faf5 !important; }
        .pac-item-selected { background: #f0faf5 !important; }
        .pac-matched { color: #0F6E56 !important; font-weight: 600 !important; }
        .pac-icon { display: none !important; }
      `}</style>

      <div className="hero-wrap" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* ── LEFT: DARK HERO ── */}
        <div className="hero-left" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 0 }}>

          {/* Night sky */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050d1a 0%, #091525 30%, #0c1f35 52%, #122a1e 75%, #0d2018 100%)' }} />

          {/* Stars */}
          {[[7,4],[14,10],[21,3],[30,7],[41,4],[54,10],[62,5],[70,8],[81,3],[90,6],[4,17],[18,21],[32,14],[46,18],[57,13],[68,20],[77,15],[87,19],[95,12],[11,27],[24,31],[37,24],[50,28],[63,25],[75,30],[84,26],[93,23],[3,36],[16,39],[29,33],[44,37],[59,34]].map(([x,y],i) => (
            <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:i%4===0?2:1, height:i%4===0?2:1, background:'#fff', borderRadius:'50%', opacity:0.3+(i%4)*0.15, animation:`twinkle ${2+(i%3)}s ease-in-out infinite`, animationDelay:`${(i%7)*0.3}s` }} />
          ))}

          {/* Moon */}
          <div style={{ position:'absolute', top:'7%', right:'10%', width:40, height:40, background:'radial-gradient(circle at 33% 33%, #fffef0, #f0cc55)', borderRadius:'50%', boxShadow:'0 0 24px 6px rgba(240,200,80,0.12)' }} />

          {/* Skyline */}
          <div className="skyline-svg" style={{ position:'absolute', bottom:0, left:0, right:0 }}>
            <svg viewBox="0 0 1000 340" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%', height:'100%' }} preserveAspectRatio="xMidYMax slice">
              <defs>
                <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a3a5c"/><stop offset="100%" stopColor="#0d2137"/></linearGradient>
                <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#12291c"/><stop offset="100%" stopColor="#091812"/></linearGradient>
                <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e4a7a"/><stop offset="100%" stopColor="#122d52"/></linearGradient>
                <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1f35" stopOpacity="0.95"/><stop offset="100%" stopColor="#040c18"/></linearGradient>
              </defs>

              {/* Water */}
              <rect x="0" y="255" width="1000" height="85" fill="url(#wt)"/>
              <line x1="0" y1="270" x2="1000" y2="270" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
              <line x1="0" y1="292" x2="1000" y2="292" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>

              {/* BG silhouettes */}
              <rect x="0" y="215" width="55" height="45" fill="#09182a" opacity="0.8"/>
              <rect x="60" y="200" width="45" height="60" fill="#09182a" opacity="0.8"/>
              <rect x="870" y="210" width="55" height="50" fill="#09182a" opacity="0.8"/>
              <rect x="935" y="220" width="65" height="40" fill="#09182a" opacity="0.8"/>

              {/* LEFT - tower 1 */}
              <rect x="18" y="85" width="48" height="175" fill="url(#bg1)"/>
              <rect x="20" y="83" width="44" height="4" fill="#1e4a7a"/>
              <rect x="26" y="95" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="39" y="95" width="9" height="9" fill="rgba(90,150,220,0.18)"/><rect x="26" y="111" width="9" height="9" fill="rgba(255,215,90,0.38)"/><rect x="39" y="111" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="26" y="127" width="9" height="9" fill="rgba(90,150,220,0.15)"/><rect x="39" y="127" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="26" y="143" width="9" height="9" fill="rgba(255,215,90,0.38)"/><rect x="39" y="143" width="9" height="9" fill="rgba(90,150,220,0.18)"/><rect x="26" y="159" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="39" y="159" width="9" height="9" fill="rgba(255,215,90,0.38)"/><rect x="26" y="175" width="9" height="9" fill="rgba(90,150,220,0.15)"/><rect x="39" y="175" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="26" y="191" width="9" height="9" fill="rgba(255,215,90,0.42)"/><rect x="39" y="191" width="9" height="9" fill="rgba(90,150,220,0.18)"/>
              <line x1="42" y1="83" x2="42" y2="58" stroke="#1e4a7a" strokeWidth="1.5"/>
              <circle cx="42" cy="56" r="2.5" fill="#ff3333" opacity="0.9" style={{animation:'blink 2s infinite'}}/>

              {/* LEFT - tower 2 */}
              <rect x="76" y="130" width="75" height="130" fill="url(#bg2)"/>
              <rect x="81" y="140" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="96" y="140" width="10" height="12" fill="rgba(80,140,210,0.14)"/><rect x="111" y="140" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="126" y="140" width="10" height="12" fill="rgba(255,210,85,0.3)"/><rect x="81" y="159" width="10" height="12" fill="rgba(80,140,210,0.14)"/><rect x="96" y="159" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="111" y="159" width="10" height="12" fill="rgba(255,210,85,0.3)"/><rect x="126" y="159" width="10" height="12" fill="rgba(80,140,210,0.14)"/><rect x="81" y="178" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="96" y="178" width="10" height="12" fill="rgba(255,210,85,0.3)"/><rect x="111" y="178" width="10" height="12" fill="rgba(80,140,210,0.14)"/><rect x="126" y="178" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="81" y="197" width="10" height="12" fill="rgba(255,210,85,0.3)"/><rect x="96" y="197" width="10" height="12" fill="rgba(80,140,210,0.14)"/><rect x="111" y="197" width="10" height="12" fill="rgba(255,210,85,0.32)"/><rect x="126" y="197" width="10" height="12" fill="rgba(255,210,85,0.3)"/>

              {/* LEFT - slim tower */}
              <rect x="162" y="60" width="36" height="200" fill="url(#bg3)"/>
              <rect x="164" y="58" width="32" height="4" fill="#2a5a8a"/>
              <rect x="168" y="70" width="10" height="10" fill="rgba(255,225,115,0.45)"/><rect x="182" y="70" width="10" height="10" fill="rgba(110,175,245,0.2)"/><rect x="168" y="87" width="10" height="10" fill="rgba(255,225,115,0.42)"/><rect x="182" y="87" width="10" height="10" fill="rgba(255,225,115,0.45)"/><rect x="168" y="104" width="10" height="10" fill="rgba(110,175,245,0.16)"/><rect x="182" y="104" width="10" height="10" fill="rgba(255,225,115,0.42)"/><rect x="168" y="121" width="10" height="10" fill="rgba(255,225,115,0.45)"/><rect x="182" y="121" width="10" height="10" fill="rgba(110,175,245,0.2)"/><rect x="168" y="138" width="10" height="10" fill="rgba(255,225,115,0.42)"/><rect x="182" y="138" width="10" height="10" fill="rgba(255,225,115,0.45)"/><rect x="168" y="155" width="10" height="10" fill="rgba(110,175,245,0.16)"/><rect x="182" y="155" width="10" height="10" fill="rgba(255,225,115,0.42)"/><rect x="168" y="172" width="10" height="10" fill="rgba(255,225,115,0.45)"/><rect x="182" y="172" width="10" height="10" fill="rgba(110,175,245,0.2)"/><rect x="168" y="189" width="10" height="10" fill="rgba(255,225,115,0.42)"/><rect x="182" y="189" width="10" height="10" fill="rgba(255,225,115,0.45)"/>
              <line x1="180" y1="58" x2="180" y2="33" stroke="#2a5a8a" strokeWidth="1.5"/>
              <circle cx="180" cy="31" r="2.5" fill="#ff3333" opacity="0.85" style={{animation:'blink 2.4s infinite'}}/>

              {/* CENTER - hero tower */}
              <rect x="358" y="20" width="64" height="240" fill="url(#bg3)"/>
              <rect x="362" y="18" width="56" height="5" fill="#3070b8"/>
              <polygon points="390,18 376,0 404,0" fill="#1e4a7a"/>
              <rect x="366" y="30" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="381" y="30" width="11" height="10" fill="rgba(115,185,250,0.2)"/><rect x="396" y="30" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="366" y="47" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="381" y="47" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="396" y="47" width="11" height="10" fill="rgba(115,185,250,0.2)"/><rect x="366" y="64" width="11" height="10" fill="rgba(115,185,250,0.16)"/><rect x="381" y="64" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="396" y="64" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="366" y="81" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="381" y="81" width="11" height="10" fill="rgba(115,185,250,0.2)"/><rect x="396" y="81" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="366" y="98" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="381" y="98" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="396" y="98" width="11" height="10" fill="rgba(115,185,250,0.16)"/><rect x="366" y="115" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="381" y="115" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="396" y="115" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="366" y="132" width="11" height="10" fill="rgba(115,185,250,0.2)"/><rect x="381" y="132" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="396" y="132" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="366" y="149" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="381" y="149" width="11" height="10" fill="rgba(115,185,250,0.2)"/><rect x="396" y="149" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="366" y="166" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="381" y="166" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="396" y="166" width="11" height="10" fill="rgba(115,185,250,0.16)"/><rect x="366" y="183" width="11" height="10" fill="rgba(255,228,125,0.46)"/><rect x="381" y="183" width="11" height="10" fill="rgba(255,228,125,0.42)"/><rect x="396" y="183" width="11" height="10" fill="rgba(255,228,125,0.46)"/>
              <line x1="390" y1="0" x2="390" y2="-18" stroke="#3070b8" strokeWidth="2"/>
              <circle cx="390" cy="-19" r="3.5" fill="#ff2222" opacity="0.95" style={{animation:'blink 1.7s infinite'}}/>

              {/* CENTER - twin towers */}
              <rect x="435" y="88" width="40" height="172" fill="url(#bg1)"/>
              <rect x="487" y="88" width="40" height="172" fill="url(#bg1)"/>
              <rect x="437" y="145" width="80" height="7" fill="#1e4a7a" opacity="0.85"/>
              <rect x="440" y="98" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="453" y="98" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="492" y="98" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="505" y="98" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="440" y="115" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="453" y="115" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="492" y="115" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="505" y="115" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="440" y="132" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="453" y="132" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="492" y="132" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="505" y="132" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="440" y="158" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="453" y="158" width="9" height="10" fill="rgba(255,215,90,0.35)"/><rect x="492" y="158" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="505" y="158" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="440" y="175" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="453" y="175" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="492" y="175" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="505" y="175" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="440" y="192" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="453" y="192" width="9" height="10" fill="rgba(90,150,210,0.16)"/><rect x="492" y="192" width="9" height="10" fill="rgba(255,215,90,0.38)"/><rect x="505" y="192" width="9" height="10" fill="rgba(255,215,90,0.35)"/>

              {/* RIGHT cluster */}
              <rect x="600" y="105" width="57" height="155" fill="url(#bg2)"/>
              <rect x="605" y="115" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="618" y="115" width="8" height="11" fill="rgba(65,135,200,0.13)"/><rect x="631" y="115" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="644" y="115" width="8" height="11" fill="rgba(255,205,80,0.3)"/><rect x="605" y="133" width="8" height="11" fill="rgba(255,205,80,0.3)"/><rect x="618" y="133" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="631" y="133" width="8" height="11" fill="rgba(65,135,200,0.13)"/><rect x="644" y="133" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="605" y="151" width="8" height="11" fill="rgba(65,135,200,0.13)"/><rect x="618" y="151" width="8" height="11" fill="rgba(255,205,80,0.3)"/><rect x="631" y="151" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="644" y="151" width="8" height="11" fill="rgba(65,135,200,0.13)"/><rect x="605" y="169" width="8" height="11" fill="rgba(255,205,80,0.32)"/><rect x="618" y="169" width="8" height="11" fill="rgba(255,205,80,0.3)"/><rect x="631" y="169" width="8" height="11" fill="rgba(65,135,200,0.13)"/><rect x="644" y="169" width="8" height="11" fill="rgba(255,205,80,0.32)"/>

              <rect x="668" y="63" width="45" height="197" fill="url(#bg3)"/>
              <rect x="671" y="61" width="39" height="4" fill="#2a5a8a"/>
              <rect x="674" y="72" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="689" y="72" width="11" height="10" fill="rgba(110,175,245,0.19)"/><rect x="674" y="89" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="689" y="89" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="674" y="106" width="11" height="10" fill="rgba(110,175,245,0.16)"/><rect x="689" y="106" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="674" y="123" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="689" y="123" width="11" height="10" fill="rgba(110,175,245,0.19)"/><rect x="674" y="140" width="11" height="10" fill="rgba(255,225,115,0.4)"/><rect x="689" y="140" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="674" y="157" width="11" height="10" fill="rgba(110,175,245,0.16)"/><rect x="689" y="157" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="674" y="174" width="11" height="10" fill="rgba(255,225,115,0.43)"/><rect x="689" y="174" width="11" height="10" fill="rgba(110,175,245,0.19)"/><rect x="674" y="191" width="11" height="10" fill="rgba(255,225,115,0.4)"/><rect x="689" y="191" width="11" height="10" fill="rgba(255,225,115,0.43)"/>
              <line x1="690" y1="61" x2="690" y2="36" stroke="#2a5a8a" strokeWidth="1.5"/>
              <circle cx="690" cy="34" r="2.5" fill="#ff3333" opacity="0.85" style={{animation:'blink 2.1s infinite'}}/>

              <rect x="724" y="138" width="65" height="122" fill="#0c1e2e"/>
              <rect x="729" y="148" width="8" height="11" fill="rgba(255,198,75,0.28)"/><rect x="742" y="148" width="8" height="11" fill="rgba(55,125,185,0.1)"/><rect x="755" y="148" width="8" height="11" fill="rgba(255,198,75,0.28)"/><rect x="768" y="148" width="8" height="11" fill="rgba(255,198,75,0.26)"/><rect x="781" y="148" width="8" height="11" fill="rgba(55,125,185,0.1)"/><rect x="729" y="166" width="8" height="11" fill="rgba(255,198,75,0.26)"/><rect x="742" y="166" width="8" height="11" fill="rgba(255,198,75,0.28)"/><rect x="755" y="166" width="8" height="11" fill="rgba(55,125,185,0.1)"/><rect x="768" y="166" width="8" height="11" fill="rgba(255,198,75,0.28)"/><rect x="781" y="166" width="8" height="11" fill="rgba(255,198,75,0.26)"/><rect x="729" y="184" width="8" height="11" fill="rgba(55,125,185,0.1)"/><rect x="742" y="184" width="8" height="11" fill="rgba(255,198,75,0.28)"/><rect x="755" y="184" width="8" height="11" fill="rgba(255,198,75,0.26)"/><rect x="768" y="184" width="8" height="11" fill="rgba(55,125,185,0.1)"/><rect x="781" y="184" width="8" height="11" fill="rgba(255,198,75,0.28)"/>

              <rect x="800" y="88" width="44" height="172" fill="url(#bg1)"/>
              <rect x="803" y="86" width="38" height="4" fill="#1e4a7a"/>
              <rect x="807" y="97" width="10" height="9" fill="rgba(255,215,105,0.4)"/><rect x="821" y="97" width="10" height="9" fill="rgba(85,148,220,0.15)"/><rect x="807" y="113" width="10" height="9" fill="rgba(255,215,105,0.4)"/><rect x="821" y="113" width="10" height="9" fill="rgba(255,215,105,0.38)"/><rect x="807" y="129" width="10" height="9" fill="rgba(85,148,220,0.15)"/><rect x="821" y="129" width="10" height="9" fill="rgba(255,215,105,0.4)"/><rect x="807" y="145" width="10" height="9" fill="rgba(255,215,105,0.38)"/><rect x="821" y="145" width="10" height="9" fill="rgba(85,148,220,0.15)"/><rect x="807" y="161" width="10" height="9" fill="rgba(255,215,105,0.4)"/><rect x="821" y="161" width="10" height="9" fill="rgba(255,215,105,0.38)"/><rect x="807" y="177" width="10" height="9" fill="rgba(85,148,220,0.15)"/><rect x="821" y="177" width="10" height="9" fill="rgba(255,215,105,0.4)"/>
              <line x1="822" y1="86" x2="822" y2="61" stroke="#1e4a7a" strokeWidth="1.5"/>
              <circle cx="822" cy="59" r="2.5" fill="#ff5555" opacity="0.75" style={{animation:'blink 2.8s infinite'}}/>

              <rect x="855" y="155" width="53" height="105" fill="url(#bg2)"/>
              <rect x="860" y="165" width="7" height="11" fill="rgba(255,200,75,0.28)"/><rect x="872" y="165" width="7" height="11" fill="rgba(55,120,180,0.1)"/><rect x="884" y="165" width="7" height="11" fill="rgba(255,200,75,0.28)"/><rect x="896" y="165" width="7" height="11" fill="rgba(255,200,75,0.26)"/><rect x="860" y="183" width="7" height="11" fill="rgba(55,120,180,0.1)"/><rect x="872" y="183" width="7" height="11" fill="rgba(255,200,75,0.28)"/><rect x="884" y="183" width="7" height="11" fill="rgba(255,200,75,0.26)"/><rect x="896" y="183" width="7" height="11" fill="rgba(55,120,180,0.1)"/><rect x="860" y="201" width="7" height="11" fill="rgba(255,200,75,0.28)"/><rect x="872" y="201" width="7" height="11" fill="rgba(255,200,75,0.26)"/><rect x="884" y="201" width="7" height="11" fill="rgba(55,120,180,0.1)"/><rect x="896" y="201" width="7" height="11" fill="rgba(255,200,75,0.28)"/>

              {/* Ground */}
              <rect x="0" y="258" width="1000" height="4" fill="#091a0d" opacity="0.95"/>

              {/* Reflections */}
              <rect x="42" y="261" width="2" height="42" fill="rgba(255,200,75,0.1)"/>
              <rect x="180" y="261" width="2" height="38" fill="rgba(255,200,75,0.1)"/>
              <rect x="390" y="261" width="3" height="52" fill="rgba(255,200,75,0.12)"/>
              <rect x="455" y="261" width="2" height="42" fill="rgba(255,200,75,0.08)"/>
              <rect x="497" y="261" width="2" height="42" fill="rgba(255,200,75,0.08)"/>
              <rect x="690" y="261" width="2" height="48" fill="rgba(255,200,75,0.1)"/>
              <rect x="822" y="261" width="2" height="40" fill="rgba(255,200,75,0.09)"/>
            </svg>
          </div>

          {/* Horizon glow */}
          <div style={{ position:'absolute', bottom:'23%', left:'50%', transform:'translateX(-50%)', width:'55%', height:50, background:'radial-gradient(ellipse, rgba(15,110,86,0.18) 0%, transparent 70%)', filter:'blur(12px)' }} />

          {/* Nav */}
          <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34, height:34, background:'#0F6E56', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px rgba(15,110,86,0.55)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.3px' }}>LagosLandCheck</span>
              <span style={{ fontSize:9, fontFamily:'DM Mono,monospace', background:'rgba(15,110,86,0.3)', color:'#5DCAA5', border:'0.5px solid rgba(93,202,165,0.35)', padding:'2px 7px', borderRadius:4 }}>BETA</span>
            </div>
            <a href="#info" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', textDecoration:'none', fontFamily:'DM Mono,monospace', letterSpacing:'0.5px' }}>How it works ↓</a>
          </nav>

          {/* Hero text */}
          <div className="hero-text-pad" style={{ position:'relative', zIndex:10, flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1rem 2rem 0', textAlign:'center', paddingBottom:'40%' }}>
            <div className="hero-badge" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(15,110,86,0.18)', border:'0.5px solid rgba(93,202,165,0.35)', borderRadius:20, padding:'5px 14px', fontSize:11, fontFamily:'DM Mono,monospace', color:'#5DCAA5', letterSpacing:'1.5px', marginBottom:'1.25rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#5DCAA5', animation:'blink 1.5s infinite', display:'inline-block' }}/>
              LAGOS LAND INTELLIGENCE
            </div>

            <h1 className="hero-h1" style={{ fontFamily:'Instrument Serif,serif', fontSize:'clamp(30px,5.5vw,54px)', lineHeight:1.12, color:'#fff', marginBottom:'1rem', maxWidth:560 }}>
              Verify Lagos land<br/>before you{' '}
              <em style={{ fontStyle:'italic', color:'#5DCAA5', textShadow:'0 0 28px rgba(93,202,165,0.35)' }}>lose a kobo.</em>
            </h1>

            <p className="hero-p" style={{ fontSize:'clamp(13px,2.2vw,15px)', color:'rgba(255,255,255,0.5)', lineHeight:1.75, maxWidth:420, marginBottom:'1.75rem' }}>
              The only instant automated pre-screening tool for Lagos land. 6 checks in under 2 minutes — not 48 hours like everyone else.
            </p>

            {/* Stats */}
            <div className="stats-row" style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:'1.5rem' }}>
              {[
                { n:'$4B+', l:'fraud lost in Nigeria/yr' },
                { n:'1,500+', l:'Lagos fraud cases since 2020' },
                { n:'< 2 min', l:'vs 24–48hrs for competitors' },
              ].map(s => (
                <div key={s.n} className="stat-hover" style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(6px)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'9px 15px', textAlign:'center', transition:'border-color 0.2s', cursor:'default' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:'#5DCAA5', fontFamily:'Syne,sans-serif' }}>{s.n}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.38)', fontFamily:'DM Mono,monospace', marginTop:2, whiteSpace:'nowrap' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="tags-row" style={{ display:'flex', flexWrap:'wrap', gap:7, justifyContent:'center' }}>
              {['Gazette DB','NIMET flood zones','Omo Onile alerts','Court records','LUC status','Satellite AI'].map(t => (
                <span key={t} style={{ fontSize:10, fontFamily:'DM Mono,monospace', padding:'4px 11px', borderRadius:20, border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.38)', background:'rgba(255,255,255,0.04)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT / BOTTOM: INPUT + INFO ── */}
        <div className="hero-right" style={{ background:'#fff', width:'100%' }}>

          {/* Mobile drag handle */}
          <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 0' }}>
            <div style={{ width:36, height:4, borderRadius:2, background:'#e0e0dc' }} />
          </div>

          {/* Input header */}
          <div style={{ padding:'1rem 2rem 0' }}>
            <p style={{ fontSize:10, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:4 }}>VERIFY A PROPERTY</p>
            <h2 style={{ fontFamily:'Instrument Serif,serif', fontSize:22, color:'#111', marginBottom:0 }}>Where is the land?</h2>
            <p style={{ fontSize:12, color:'#999', marginTop:4, lineHeight:1.6 }}>Type the address or area name below — it works like Google Maps.</p>
          </div>

          <InputPanel onSubmit={handleSubmit} />

          {/* Info sections */}
          <div id="info" className="info-sections" style={{ borderTop:'0.5px solid #f0f0ec' }}>

            {/* How it works */}
            <div style={{ padding:'1.5rem 2rem' }}>
              <p style={{ fontSize:10, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.4rem' }}>HOW IT WORKS</p>
              <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:19, color:'#111', marginBottom:'1rem' }}>6 checks, all at once</h3>
              {[
                { n:'01', name:'Satellite imagery', desc:'Satellite tile sent to GPT-4o Vision. Detects swamp, water, encroachment, setback violations.', tag:'AI', tc:'#1a5fa0' },
                { n:'02', name:'Gazette & govt acquisition', desc:'Every Lagos Gazette parsed into our DB. Any government acquisition within 500m?', tag:'CRITICAL', tc:'#8b1a1a' },
                { n:'03', name:'Flood & drainage risk', desc:'NIMET flood shapefiles + Lagos drainage master plan. Flags unbuildable zones.', tag:'GIS', tc:'#0F6E56' },
                { n:'04', name:'Court litigation', desc:'Lagos Judiciary cause lists scraped and indexed. Any disputes near your land?', tag:'LEGAL', tc:'#7a4800' },
                { n:'05', name:'Land Use Charge', desc:'LUC portal checked by address. Payment gap since 2018 = immediate amber flag.', tag:'LUC', tc:'#0F6E56' },
                { n:'06', name:'Fraud zone & Omo Onile', desc:'Curated fraud zone database from court records. 500m radius check.', tag:'ALERT', tc:'#8b1a1a' },
              ].map(c => (
                <div key={c.n} className="check-hover" style={{ display:'flex', gap:12, padding:'10px 6px', borderRadius:7, transition:'background 0.15s', marginBottom:2 }}>
                  <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#ccc', minWidth:22, paddingTop:1 }}>{c.n}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:500, color:'#111' }}>{c.name}</span>
                      <span style={{ fontSize:9, fontFamily:'DM Mono,monospace', padding:'2px 6px', borderRadius:4, background:`${c.tc}15`, color:c.tc, fontWeight:500 }}>{c.tag}</span>
                    </div>
                    <p style={{ fontSize:11, color:'#999', lineHeight:1.6 }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats block */}
            <div style={{ margin:'0 2rem', padding:'1.25rem', background:'#f7f7f4', borderRadius:14, marginBottom:'1.5rem' }}>
              <p style={{ fontSize:10, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.4rem' }}>WHY THIS EXISTS</p>
              <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:18, color:'#111', marginBottom:'0.875rem' }}>The problem is enormous</h3>
              {[
                { s:'$4B+', t:'lost to property scams annually in Nigeria' },
                { s:'1,500+', t:'fraud petitions in Lagos since 2020' },
                { s:'3%', t:'of Nigerians hold valid land titles' },
                { s:'20%', t:'of disputes from double sales or fake documents' },
              ].map(x => (
                <div key={x.s} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:'0.6rem' }}>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color:'#0F6E56', minWidth:52 }}>{x.s}</span>
                  <span style={{ fontSize:12, color:'#666', lineHeight:1.55 }}>{x.t}</span>
                </div>
              ))}
            </div>

            {/* VS */}
            <div style={{ margin:'0 2rem', padding:'1.25rem', background:'#0F6E56', borderRadius:14, marginBottom:'1.5rem' }}>
              <p style={{ fontSize:10, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'rgba(255,255,255,0.55)', marginBottom:'0.4rem' }}>VS COMPETITORS</p>
              <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:18, color:'#fff', marginBottom:'0.875rem' }}>Instant vs 24–48 hours</h3>
              <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono,monospace', color:'rgba(255,255,255,0.4)', marginBottom:6 }}>OTHERS (LandSafe, LandVerify…)</div>
                  {['24–48 hour wait','Manual human review','₦15k–₦50k upfront','No instant red-flag check'].map(x => (
                    <div key={x} style={{ display:'flex', gap:7, marginBottom:5 }}>
                      <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>✕</span>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>{x}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:10, fontFamily:'DM Mono,monospace', color:'#9FE1CB', marginBottom:6 }}>LAGOSLANDCHECK</div>
                  {['Under 2 minutes','Fully automated AI & GIS','Fraction of the cost','Know before you negotiate'].map(x => (
                    <div key={x} style={{ display:'flex', gap:7, marginBottom:5 }}>
                      <span style={{ color:'#5DCAA5', fontSize:11 }}>✓</span>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Who it's for */}
            <div style={{ padding:'0 2rem 1.5rem' }}>
              <p style={{ fontSize:10, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.4rem' }}>WHO IT'S FOR</p>
              <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:18, color:'#111', marginBottom:'0.875rem' }}>Built for diaspora & locals</h3>
              <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { e:'✈', t:'Diaspora buyers', d:'UK, US, Canada. Your rep takes a photo — we extract GPS and run all 6 checks.' },
                  { e:'⚖', t:'Property lawyers', d:'Pre-screen before advising clients. Flag issues before the Land Registry search.' },
                  { e:'🏡', t:'Lagos locals', d:'Know about gazette acquisitions and flood risk before paying a deposit.' },
                  { e:'🏢', t:'Estate agents', d:'Protect your reputation. Screen properties before listing them.' },
                ].map(w => (
                  <div key={w.t} style={{ background:'#f7f7f4', borderRadius:10, padding:'12px' }}>
                    <div style={{ fontSize:18, marginBottom:5 }}>{w.e}</div>
                    <div style={{ fontSize:12, fontWeight:500, color:'#111', marginBottom:4 }}>{w.t}</div>
                    <div style={{ fontSize:11, color:'#999', lineHeight:1.55 }}>{w.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding:'0 2rem 1rem', textAlign:'center' }}>
              <button className="cta-green" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={{ width:'100%', padding:13, background:'#0F6E56', border:'none', borderRadius:10, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer', transition:'background 0.2s' }}>
                Run a verification →
              </button>
            </div>

            {/* Disclaimer */}
            <div style={{ padding:'0.75rem 2rem 2.5rem', display:'flex', gap:8, alignItems:'flex-start' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <p style={{ fontSize:10, color:'#bbb', lineHeight:1.7, margin:0, fontFamily:'DM Mono,monospace' }}>Pre-screening tool only. Does not replace a physical Land Registry search by a licensed lawyer.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
