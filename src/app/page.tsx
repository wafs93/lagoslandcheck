'use client'

import { useRouter } from 'next/navigation'
import InputPanel from '@/components/InputPanel'

export default function Home() {
  const router = useRouter()

  const handleSubmit = (lat: number, lng: number, photoUrl?: string) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      ...(photoUrl ? { photo: photoUrl } : {}),
    })
    router.push(`/report?${params.toString()}`)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0f0a', fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        .stat-card:hover { border-color: rgba(93,202,165,0.4) !important; }
        .check-row:hover { background: rgba(255,255,255,0.04) !important; }
        .cta-btn:hover { background: #085041 !important; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050d1a 0%, #0a1628 35%, #0d2137 55%, #1a3a2a 80%, #0f2a1a 100%)' }} />

        {/* Stars */}
        {[[8,5],[15,12],[22,3],[31,8],[42,4],[55,11],[63,6],[71,9],[82,3],[91,7],[5,18],[19,22],[33,15],[47,19],[58,14],[69,21],[78,16],[88,20],[96,13],[12,28],[25,32],[38,25],[51,29],[64,26],[76,31],[85,27]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:i%3===0?2:1, height:i%3===0?2:1, background:'#fff', borderRadius:'50%', opacity:0.4+(i%4)*0.15, animation:`twinkle ${2+(i%3)}s ease-in-out infinite`, animationDelay:`${(i%5)*0.4}s` }} />
        ))}

        {/* Moon */}
        <div style={{ position:'absolute', top:'8%', right:'8%', width:44, height:44, background:'radial-gradient(circle at 35% 35%, #fffbe6, #f5d76e)', borderRadius:'50%', boxShadow:'0 0 30px 8px rgba(245,215,110,0.15)' }} />

        {/* Skyline SVG */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 380" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%' }} preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a3a5c"/><stop offset="100%" stopColor="#0d2137"/></linearGradient>
              <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#152e1f"/><stop offset="100%" stopColor="#0a1e14"/></linearGradient>
              <linearGradient id="b3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a5c8a"/><stop offset="100%" stopColor="#1a3a5c"/></linearGradient>
              <linearGradient id="wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2137" stopOpacity="0.9"/><stop offset="100%" stopColor="#050d1a"/></linearGradient>
            </defs>
            <rect x="0" y="275" width="1440" height="105" fill="url(#wtr)"/>
            <line x1="0" y1="295" x2="1440" y2="295" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <line x1="0" y1="320" x2="1440" y2="320" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
            <rect x="0" y="230" width="80" height="50" fill="#0a1825" opacity="0.7"/>
            <rect x="90" y="210" width="60" height="70" fill="#0a1825" opacity="0.7"/>
            <rect x="1290" y="225" width="70" height="55" fill="#0a1825" opacity="0.7"/>
            <rect x="1370" y="240" width="70" height="40" fill="#0a1825" opacity="0.7"/>
            <rect x="30" y="95" width="55" height="185" fill="url(#b1)"/>
            <rect x="32" y="93" width="51" height="4" fill="#2a5c8a"/>
            <rect x="38" y="105" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="105" width="10" height="10" fill="rgba(100,160,220,0.2)"/><rect x="38" y="122" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="54" y="122" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="139" width="10" height="10" fill="rgba(100,160,220,0.15)"/><rect x="54" y="139" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="156" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="54" y="156" width="10" height="10" fill="rgba(100,160,220,0.2)"/><rect x="38" y="173" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="173" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="38" y="190" width="10" height="10" fill="rgba(100,160,220,0.15)"/><rect x="54" y="190" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="207" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="207" width="10" height="10" fill="rgba(100,160,220,0.2)"/>
            <line x1="57" y1="93" x2="57" y2="65" stroke="#2a5c8a" strokeWidth="2"/>
            <circle cx="57" cy="63" r="3" fill="#ff4444" opacity="0.9" style={{animation:'pulse 2s infinite'}}/>
            <rect x="95" y="145" width="85" height="135" fill="url(#b2)"/>
            <rect x="100" y="155" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="116" y="155" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="132" y="155" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="148" y="155" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="100" y="175" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="116" y="175" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="132" y="175" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="148" y="175" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="100" y="195" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="116" y="195" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="132" y="195" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="148" y="195" width="11" height="13" fill="rgba(255,220,100,0.3)"/>
            <rect x="190" y="70" width="42" height="210" fill="url(#b3)"/>
            <rect x="192" y="68" width="38" height="5" fill="#3a7cbf"/>
            <rect x="197" y="80" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="80" width="12" height="11" fill="rgba(100,180,255,0.2)"/><rect x="197" y="98" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="214" y="98" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="197" y="116" width="12" height="11" fill="rgba(100,180,255,0.15)"/><rect x="214" y="116" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="197" y="134" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="134" width="12" height="11" fill="rgba(100,180,255,0.2)"/><rect x="197" y="152" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="214" y="152" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="197" y="170" width="12" height="11" fill="rgba(100,180,255,0.15)"/><rect x="214" y="170" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="197" y="188" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="188" width="12" height="11" fill="rgba(100,180,255,0.2)"/>
            <line x1="211" y1="68" x2="211" y2="40" stroke="#3a7cbf" strokeWidth="2"/>
            <circle cx="211" cy="38" r="3" fill="#ff4444" opacity="0.8" style={{animation:'pulse 2.5s infinite'}}/>
            <rect x="480" y="110" width="52" height="170" fill="#122a3a"/>
            <rect x="488" y="95" width="36" height="15" fill="#122a3a"/>
            <rect x="496" y="80" width="20" height="15" fill="#122a3a"/>
            <rect x="485" y="118" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="118" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="485" y="136" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="136" width="13" height="12" fill="rgba(255,200,90,0.3)"/><rect x="485" y="154" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="503" y="154" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="485" y="172" width="13" height="12" fill="rgba(255,200,90,0.3)"/><rect x="503" y="172" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="485" y="190" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="190" width="13" height="12" fill="rgba(255,200,90,0.3)"/>
            <rect x="545" y="28" width="72" height="252" fill="url(#b3)"/>
            <rect x="550" y="26" width="62" height="6" fill="#4a8fd4"/>
            <polygon points="581,26 566,3 596,3" fill="#2a5c8a"/>
            <rect x="553" y="38" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="38" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="38" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="56" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="56" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="56" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="553" y="74" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="571" y="74" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="74" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="92" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="92" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="92" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="553" y="110" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="110" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="110" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="553" y="128" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="128" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="128" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="146" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="571" y="146" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="146" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="553" y="164" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="164" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="164" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="182" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="182" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="182" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="553" y="200" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="200" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="200" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="218" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="571" y="218" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="218" width="13" height="11" fill="rgba(255,230,130,0.4)"/>
            <line x1="581" y1="3" x2="581" y2="-17" stroke="#4a8fd4" strokeWidth="2"/>
            <circle cx="581" cy="-18" r="4" fill="#ff3333" opacity="0.9" style={{animation:'pulse 1.8s infinite'}}/>
            <rect x="632" y="98" width="44" height="182" fill="url(#b1)"/>
            <rect x="688" y="98" width="44" height="182" fill="url(#b1)"/>
            <rect x="634" y="158" width="88" height="8" fill="#2a5c8a" opacity="0.8"/>
            <rect x="637" y="108" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="108" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="108" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="108" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="637" y="126" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="651" y="126" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="126" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="707" y="126" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="144" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="144" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="693" y="144" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="144" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="170" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="170" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="170" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="707" y="170" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="188" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="651" y="188" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="188" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="188" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="637" y="206" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="206" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="693" y="206" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="206" width="10" height="11" fill="rgba(255,220,100,0.35)"/>
            <rect x="860" y="118" width="62" height="162" fill="url(#b2)"/>
            <rect x="865" y="128" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="879" y="128" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="893" y="128" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="907" y="128" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="865" y="147" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="879" y="147" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="893" y="147" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="907" y="147" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="865" y="166" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="879" y="166" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="893" y="166" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="907" y="166" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="865" y="185" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="879" y="185" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="893" y="185" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="907" y="185" width="9" height="12" fill="rgba(255,210,90,0.3)"/>
            <rect x="933" y="73" width="50" height="207" fill="url(#b3)"/>
            <rect x="936" y="71" width="44" height="5" fill="#3a7cbf"/>
            <rect x="939" y="81" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="81" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="939" y="98" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="956" y="98" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="939" y="115" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="956" y="115" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="939" y="132" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="132" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="939" y="149" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="956" y="149" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="939" y="166" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="956" y="166" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="939" y="183" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="183" width="12" height="10" fill="rgba(255,230,120,0.45)"/>
            <line x1="958" y1="71" x2="958" y2="45" stroke="#3a7cbf" strokeWidth="2"/>
            <circle cx="958" cy="43" r="3" fill="#ff4444" opacity="0.8" style={{animation:'pulse 2.2s infinite'}}/>
            <rect x="993" y="148" width="72" height="132" fill="#0e2030"/>
            <rect x="998" y="158" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1012" y="158" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1026" y="158" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1040" y="158" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1054" y="158" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="998" y="177" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1012" y="177" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1026" y="177" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1040" y="177" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1054" y="177" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="998" y="196" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1012" y="196" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1026" y="196" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1040" y="196" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1054" y="196" width="9" height="12" fill="rgba(255,200,80,0.28)"/>
            <rect x="1075" y="98" width="48" height="182" fill="url(#b1)"/>
            <rect x="1078" y="96" width="42" height="5" fill="#2a5c8a"/>
            <rect x="1081" y="106" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="106" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1081" y="123" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="123" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1081" y="140" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1097" y="140" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1081" y="157" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1097" y="157" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1081" y="174" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="174" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1081" y="191" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1097" y="191" width="11" height="10" fill="rgba(255,220,110,0.38)"/>
            <line x1="1099" y1="96" x2="1099" y2="68" stroke="#2a5c8a" strokeWidth="2"/>
            <circle cx="1099" cy="66" r="3" fill="#ff5555" opacity="0.7" style={{animation:'pulse 3s infinite'}}/>
            <rect x="1133" y="168" width="58" height="112" fill="url(#b2)"/>
            <rect x="1138" y="178" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1151" y="178" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1164" y="178" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1177" y="178" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1138" y="197" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1151" y="197" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1164" y="197" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1177" y="197" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1138" y="216" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1151" y="216" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1164" y="216" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1177" y="216" width="8" height="12" fill="rgba(255,200,80,0.28)"/>
            <rect x="0" y="280" width="1440" height="5" fill="#0a1e14" opacity="0.9"/>
            <rect x="57" y="283" width="3" height="45" fill="rgba(255,200,80,0.1)"/>
            <rect x="211" y="283" width="3" height="40" fill="rgba(255,200,80,0.1)"/>
            <rect x="581" y="283" width="4" height="55" fill="rgba(255,200,80,0.13)"/>
            <rect x="654" y="283" width="3" height="45" fill="rgba(255,200,80,0.09)"/>
            <rect x="700" y="283" width="3" height="45" fill="rgba(255,200,80,0.09)"/>
            <rect x="958" y="283" width="3" height="50" fill="rgba(255,200,80,0.1)"/>
            <rect x="1099" y="283" width="3" height="42" fill="rgba(255,200,80,0.09)"/>
          </svg>
        </div>

        {/* Green glow */}
        <div style={{ position:'absolute', bottom:'22%', left:'50%', transform:'translateX(-50%)', width:'60%', height:60, background:'radial-gradient(ellipse, rgba(15,110,86,0.2) 0%, transparent 70%)', filter:'blur(15px)' }} />

        {/* Nav */}
        <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, background:'#0F6E56', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(15,110,86,0.5)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.3px' }}>LagosLandCheck</span>
            <span style={{ fontSize:9, fontFamily:'DM Mono,monospace', background:'rgba(15,110,86,0.3)', color:'#5DCAA5', border:'0.5px solid rgba(93,202,165,0.4)', padding:'2px 7px', borderRadius:4 }}>BETA</span>
          </div>
          <a href="#how" style={{ fontSize:12, color:'rgba(255,255,255,0.45)', textDecoration:'none', fontFamily:'DM Mono,monospace' }}>How it works</a>
        </nav>

        {/* Hero text */}
        <div style={{ position:'relative', zIndex:10, flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1rem 1.5rem 0', textAlign:'center', paddingBottom:'35%' }}>
          <div style={{ display:'inline-block', background:'rgba(15,110,86,0.15)', border:'0.5px solid rgba(93,202,165,0.3)', borderRadius:20, padding:'5px 14px', fontSize:11, fontFamily:'DM Mono,monospace', color:'#5DCAA5', letterSpacing:'1.5px', marginBottom:'1.25rem' }}>
            LAGOS LAND INTELLIGENCE
          </div>
          <h1 style={{ fontFamily:'Instrument Serif,serif', fontSize:'clamp(28px,6vw,52px)', lineHeight:1.15, color:'#fff', marginBottom:'1rem', maxWidth:580 }}>
            Verify Lagos land<br/>before you{' '}
            <em style={{ fontStyle:'italic', color:'#5DCAA5', textShadow:'0 0 30px rgba(93,202,165,0.35)' }}>lose a kobo.</em>
          </h1>
          <p style={{ fontSize:'clamp(13px,2.5vw,15px)', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:400, marginBottom:'1.5rem' }}>
            The only instant automated pre-screening tool for Lagos land. 6 checks in under 2 minutes — not 48 hours.
          </p>

          {/* TRUST STATS */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:'1.5rem' }}>
            {[
              { num:'₦4B+', label:'Fraud prevented nationally' },
              { num:'1,500+', label:'Fraud cases in Lagos since 2020' },
              { num:'2 min', label:'vs 48hrs for competitors' },
            ].map(s => (
              <div key={s.num} className="stat-card" style={{ background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 16px', textAlign:'center', transition:'border-color 0.2s' }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#5DCAA5', fontFamily:'Syne,sans-serif' }}>{s.num}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'DM Mono,monospace', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
            {['Gazette DB','NIMET flood zones','Omo Onile alerts','Court records','LUC status','Satellite AI'].map(tag => (
              <span key={tag} style={{ fontSize:11, fontFamily:'DM Mono,monospace', padding:'5px 12px', borderRadius:20, border:'0.5px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.04)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INPUT CARD ── */}
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', marginTop:-32, position:'relative', zIndex:20, boxShadow:'0 -8px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 0' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'#e0e0dc' }} />
        </div>
        <div style={{ padding:'1rem 1.5rem 0' }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:4 }}>VERIFY A PROPERTY</p>
          <h2 style={{ fontFamily:'Instrument Serif,serif', fontSize:22, color:'#111', marginBottom:0 }}>Submit land location</h2>
        </div>
        <InputPanel onSubmit={handleSubmit} />

        {/* ── HOW IT WORKS ── */}
        <div id="how" style={{ padding:'0 1.5rem 2rem', borderTop:'0.5px solid #f0f0ec' }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.5rem', paddingTop:'1.5rem' }}>HOW IT WORKS</p>
          <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:20, color:'#111', marginBottom:'1.25rem' }}>6 checks run in parallel</h3>
          {[
            { num:'01', name:'Satellite imagery', desc:'Google Maps satellite tile analysed by GPT-4o Vision. Detects swamp, water bodies, encroachment, setback violations.', badge:'AI', badgeColor:'#3a7cbf' },
            { num:'02', name:'Gazette & govt acquisition', desc:'Every Lagos State Gazette parsed into our database. PostGIS query: any acquisition within 500m of your coordinate?', badge:'CRITICAL', badgeColor:'#A32D2D' },
            { num:'03', name:'Flood & drainage risk', desc:'NIMET annual flood risk shapefiles + Lagos drainage master plan. Flags unbuildable land and 30m drainage setbacks.', badge:'GIS', badgeColor:'#0F6E56' },
            { num:'04', name:'Court litigation search', desc:'Lagos State Judiciary cause lists and judgements scraped and indexed. Returns any property disputes near your coordinate.', badge:'LEGAL', badgeColor:'#854F0B' },
            { num:'05', name:'Land Use Charge status', desc:'LUC portal queried by address. Payment gaps since 2018 = immediate amber flag. Outstanding LUC is a charge on the land.', badge:'LUC', badgeColor:'#0F6E56' },
            { num:'06', name:'Fraud zone & Omo Onile alert', desc:'Manually curated database of known Lagos fraud zones from court records and verified lawyer submissions. 500m radius check.', badge:'ALERT', badgeColor:'#A32D2D' },
          ].map(c => (
            <div key={c.num} className="check-row" style={{ display:'flex', gap:14, padding:'12px 8px', borderRadius:8, transition:'background 0.15s', marginBottom:4 }}>
              <div style={{ fontFamily:'DM Mono,monospace', fontSize:12, color:'#ccc', minWidth:24, paddingTop:1 }}>{c.num}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:'#111' }}>{c.name}</span>
                  <span style={{ fontSize:9, fontFamily:'DM Mono,monospace', padding:'2px 6px', borderRadius:4, background:`${c.badgeColor}18`, color:c.badgeColor, fontWeight:500 }}>{c.badge}</span>
                </div>
                <p style={{ fontSize:12, color:'#888', lineHeight:1.65 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── WHY LAGOSLANDCHECK ── */}
        <div style={{ margin:'0 1.5rem', padding:'1.5rem', background:'#f8f8f5', borderRadius:16, marginBottom:'1.5rem' }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.5rem' }}>WHY THIS EXISTS</p>
          <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:20, color:'#111', marginBottom:'1rem' }}>The problem is real and enormous</h3>
          {[
            { stat:'$4B', text:'lost annually to property scams in Nigeria' },
            { stat:'1,500+', text:'land fraud petitions in Lagos alone since 2020' },
            { stat:'3%', text:'of Nigerians hold valid land titles — buyers are exposed' },
            { stat:'20%', text:'of land disputes stem from double sales or fake documents' },
          ].map(s => (
            <div key={s.stat} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'#0F6E56', minWidth:60 }}>{s.stat}</span>
              <span style={{ fontSize:13, color:'#555', lineHeight:1.6, paddingTop:3 }}>{s.text}</span>
            </div>
          ))}
          <p style={{ fontSize:12, color:'#999', lineHeight:1.7, marginTop:'0.75rem', fontStyle:'italic' }}>
            Sources: 2025 industry analysis, Lagos State records, Nigerian Institution of Estate Surveyors and Valuers.
          </p>
        </div>

        {/* ── WHO IT'S FOR ── */}
        <div style={{ padding:'0 1.5rem 2rem' }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:'0.5rem' }}>WHO IT'S FOR</p>
          <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:20, color:'#111', marginBottom:'1rem' }}>Built for diaspora and locals alike</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { icon:'✈', title:'Diaspora buyers', desc:'UK, US, Canada, Germany. You cannot visit. Your rep on the ground takes a photo — we extract the GPS and run all 6 checks.' },
              { icon:'⚖', title:'Property lawyers', desc:'Run pre-screening before you advise clients. Flag issues before the Land Registry search to save everyone time and cost.' },
              { icon:'🏡', title:'Lagos locals', desc:'Verify before you pay a deposit. Know about gazette acquisitions and flood risk before you commit to any agent.' },
              { icon:'🏢', title:'Estate agents', desc:'Protect your reputation. Screen properties before listing to avoid selling land with hidden government claims.' },
            ].map(w => (
              <div key={w.title} style={{ background:'#f8f8f5', borderRadius:12, padding:'14px 14px' }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{w.icon}</div>
                <div style={{ fontSize:13, fontWeight:500, color:'#111', marginBottom:5 }}>{w.title}</div>
                <div style={{ fontSize:11, color:'#888', lineHeight:1.6 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VS COMPETITORS ── */}
        <div style={{ margin:'0 1.5rem 2rem', padding:'1.5rem', background:'#0F6E56', borderRadius:16 }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'rgba(255,255,255,0.6)', marginBottom:'0.5rem' }}>THE DIFFERENCE</p>
          <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:20, color:'#fff', marginBottom:'1rem' }}>Instant vs 24–48 hours</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <div style={{ fontSize:11, fontFamily:'DM Mono,monospace', color:'rgba(255,255,255,0.5)', marginBottom:8 }}>OTHERS</div>
              {['24–48 hours wait','Manual human review','Pay ₦15,000–₦50,000 upfront','No instant red-flag check'].map(x => (
                <div key={x} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                  <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginTop:1 }}>✕</span>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>{x}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontFamily:'DM Mono,monospace', color:'#9FE1CB', marginBottom:8 }}>LAGOSLANDCHECK</div>
              {['Under 2 minutes','Fully automated AI','Fraction of the cost','Know before you negotiate'].map(x => (
                <div key={x} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                  <span style={{ color:'#5DCAA5', fontSize:12, marginTop:1 }}>✓</span>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div style={{ padding:'0 1.5rem 0', textAlign:'center' }}>
          <h3 style={{ fontFamily:'Instrument Serif,serif', fontSize:22, color:'#111', marginBottom:'0.5rem' }}>Ready to verify?</h3>
          <p style={{ fontSize:13, color:'#888', marginBottom:'1rem' }}>Scroll up and submit your land location.</p>
          <button className="cta-btn" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={{ width:'100%', padding:13, background:'#0F6E56', border:'none', borderRadius:10, fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer', transition:'background 0.15s', marginBottom:'1.5rem' }}>
            Run a verification →
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{ padding:'0 1.5rem 3rem' }}>
          <div style={{ borderTop:'0.5px solid #eee', paddingTop:'1rem', display:'flex', gap:10, alignItems:'flex-start' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={{ fontSize:11, color:'#aaa', lineHeight:1.7, margin:0 }}>LagosLandCheck is a pre-screening intelligence tool. It does not replace a physical Land Registry search by a licensed lawyer. Use this report to identify red flags before committing money — not as final proof of title.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
