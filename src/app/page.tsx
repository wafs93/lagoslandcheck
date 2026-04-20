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
        @keyframes pulse { 0%,100%{opacity:0.8} 50%{opacity:0.4} }
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Night sky */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050d1a 0%, #0a1628 35%, #0d2137 55%, #1a3a2a 80%, #0f2a1a 100%)' }} />

        {/* Stars */}
        {[[8,5],[15,12],[22,3],[31,8],[42,4],[55,11],[63,6],[71,9],[82,3],[91,7],[5,18],[19,22],[33,15],[47,19],[58,14],[69,21],[78,16],[88,20],[96,13],[12,28],[25,32],[38,25],[51,29],[64,26],[76,31],[85,27]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:i%3===0?2:1, height:i%3===0?2:1, background:'#fff', borderRadius:'50%', opacity:0.4+(i%4)*0.15, animation:`twinkle ${2+(i%3)}s ease-in-out infinite`, animationDelay:`${(i%5)*0.4}s` }} />
        ))}

        {/* Moon */}
        <div style={{ position:'absolute', top:'8%', right:'12%', width:48, height:48, background:'radial-gradient(circle at 35% 35%, #fffbe6, #f5d76e)', borderRadius:'50%', boxShadow:'0 0 30px 8px rgba(245,215,110,0.15)' }} />

        {/* Lagos SVG Skyline */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%' }} preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a3a5c"/><stop offset="100%" stopColor="#0d2137"/></linearGradient>
              <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#152e1f"/><stop offset="100%" stopColor="#0a1e14"/></linearGradient>
              <linearGradient id="b3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a5c8a"/><stop offset="100%" stopColor="#1a3a5c"/></linearGradient>
              <linearGradient id="wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2137" stopOpacity="0.9"/><stop offset="100%" stopColor="#050d1a"/></linearGradient>
            </defs>

            {/* Water */}
            <rect x="0" y="290" width="1440" height="110" fill="url(#wtr)"/>
            <line x1="0" y1="310" x2="1440" y2="310" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <line x1="0" y1="335" x2="1440" y2="335" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>

            {/* Far background */}
            <rect x="0" y="230" width="80" height="70" fill="#0a1825" opacity="0.8"/>
            <rect x="90" y="210" width="60" height="90" fill="#0a1825" opacity="0.8"/>
            <rect x="1290" y="225" width="70" height="75" fill="#0a1825" opacity="0.8"/>
            <rect x="1370" y="240" width="70" height="60" fill="#0a1825" opacity="0.8"/>

            {/* LEFT CLUSTER */}
            <rect x="30" y="90" width="55" height="210" fill="url(#b1)"/>
            <rect x="32" y="88" width="51" height="4" fill="#2a5c8a"/>
            <rect x="38" y="100" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="100" width="10" height="10" fill="rgba(100,160,220,0.2)"/><rect x="38" y="118" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="54" y="118" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="136" width="10" height="10" fill="rgba(100,160,220,0.15)"/><rect x="54" y="136" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="154" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="54" y="154" width="10" height="10" fill="rgba(100,160,220,0.2)"/><rect x="38" y="172" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="172" width="10" height="10" fill="rgba(255,220,100,0.35)"/><rect x="38" y="190" width="10" height="10" fill="rgba(100,160,220,0.15)"/><rect x="54" y="190" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="38" y="208" width="10" height="10" fill="rgba(255,220,100,0.4)"/><rect x="54" y="208" width="10" height="10" fill="rgba(100,160,220,0.2)"/>
            <line x1="57" y1="88" x2="57" y2="60" stroke="#2a5c8a" strokeWidth="2"/>
            <circle cx="57" cy="58" r="3" fill="#ff4444" opacity="0.9" style={{animation:'pulse 2s infinite'}}/>

            <rect x="95" y="140" width="85" height="160" fill="url(#b2)"/>
            <rect x="100" y="150" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="116" y="150" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="132" y="150" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="148" y="150" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="100" y="170" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="116" y="170" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="132" y="170" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="148" y="170" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="100" y="190" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="116" y="190" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="132" y="190" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="148" y="190" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="100" y="210" width="11" height="13" fill="rgba(255,220,100,0.35)"/><rect x="116" y="210" width="11" height="13" fill="rgba(100,160,220,0.15)"/><rect x="132" y="210" width="11" height="13" fill="rgba(255,220,100,0.3)"/><rect x="148" y="210" width="11" height="13" fill="rgba(255,220,100,0.35)"/>

            <rect x="190" y="65" width="42" height="235" fill="url(#b3)"/>
            <rect x="192" y="63" width="38" height="5" fill="#3a7cbf"/>
            <rect x="197" y="75" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="75" width="12" height="11" fill="rgba(100,180,255,0.2)"/><rect x="197" y="93" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="214" y="93" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="197" y="111" width="12" height="11" fill="rgba(100,180,255,0.15)"/><rect x="214" y="111" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="197" y="129" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="129" width="12" height="11" fill="rgba(100,180,255,0.2)"/><rect x="197" y="147" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="214" y="147" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="197" y="165" width="12" height="11" fill="rgba(100,180,255,0.15)"/><rect x="214" y="165" width="12" height="11" fill="rgba(255,230,120,0.4)"/><rect x="197" y="183" width="12" height="11" fill="rgba(255,230,120,0.45)"/><rect x="214" y="183" width="12" height="11" fill="rgba(100,180,255,0.2)"/>
            <line x1="211" y1="63" x2="211" y2="35" stroke="#3a7cbf" strokeWidth="2"/>
            <circle cx="211" cy="33" r="3" fill="#ff4444" opacity="0.8" style={{animation:'pulse 2.5s infinite'}}/>

            <rect x="243" y="160" width="65" height="140" fill="#122a1a"/>
            <rect x="248" y="170" width="10" height="12" fill="rgba(255,200,80,0.28)"/><rect x="262" y="170" width="10" height="12" fill="rgba(60,120,180,0.1)"/><rect x="276" y="170" width="10" height="12" fill="rgba(255,200,80,0.28)"/><rect x="290" y="170" width="10" height="12" fill="rgba(255,200,80,0.25)"/><rect x="248" y="190" width="10" height="12" fill="rgba(60,120,180,0.1)"/><rect x="262" y="190" width="10" height="12" fill="rgba(255,200,80,0.28)"/><rect x="276" y="190" width="10" height="12" fill="rgba(255,200,80,0.25)"/><rect x="290" y="190" width="10" height="12" fill="rgba(60,120,180,0.1)"/><rect x="248" y="210" width="10" height="12" fill="rgba(255,200,80,0.28)"/><rect x="262" y="210" width="10" height="12" fill="rgba(255,200,80,0.25)"/><rect x="276" y="210" width="10" height="12" fill="rgba(60,120,180,0.1)"/><rect x="290" y="210" width="10" height="12" fill="rgba(255,200,80,0.28)"/>

            {/* CENTER - Hero tower */}
            <rect x="480" y="105" width="52" height="195" fill="#122a3a"/>
            <rect x="488" y="90" width="36" height="15" fill="#122a3a"/>
            <rect x="496" y="75" width="20" height="15" fill="#122a3a"/>
            <rect x="485" y="115" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="115" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="485" y="133" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="133" width="13" height="12" fill="rgba(255,200,90,0.3)"/><rect x="485" y="151" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="503" y="151" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="485" y="169" width="13" height="12" fill="rgba(255,200,90,0.3)"/><rect x="503" y="169" width="13" height="12" fill="rgba(80,150,210,0.12)"/><rect x="485" y="187" width="13" height="12" fill="rgba(255,200,90,0.32)"/><rect x="503" y="187" width="13" height="12" fill="rgba(255,200,90,0.3)"/>

            <rect x="545" y="25" width="72" height="275" fill="url(#b3)"/>
            <rect x="550" y="23" width="62" height="6" fill="#4a8fd4"/>
            <polygon points="581,23 566,0 596,0" fill="#2a5c8a"/>
            <rect x="553" y="35" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="35" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="35" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="53" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="53" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="53" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="553" y="71" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="571" y="71" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="71" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="89" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="89" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="89" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="553" y="107" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="107" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="107" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="553" y="125" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="125" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="125" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="143" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="571" y="143" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="143" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="553" y="161" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="161" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="589" y="161" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="179" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="571" y="179" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="179" width="13" height="11" fill="rgba(120,190,255,0.15)"/><rect x="553" y="197" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="571" y="197" width="13" height="11" fill="rgba(255,230,130,0.4)"/><rect x="589" y="197" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="553" y="215" width="13" height="11" fill="rgba(120,190,255,0.2)"/><rect x="571" y="215" width="13" height="11" fill="rgba(255,230,130,0.45)"/><rect x="589" y="215" width="13" height="11" fill="rgba(255,230,130,0.4)"/>
            <line x1="581" y1="0" x2="581" y2="-20" stroke="#4a8fd4" strokeWidth="2"/>
            <circle cx="581" cy="-21" r="4" fill="#ff3333" opacity="0.9" style={{animation:'pulse 1.8s infinite'}}/>

            {/* Twin towers */}
            <rect x="632" y="95" width="44" height="205" fill="url(#b1)"/>
            <rect x="688" y="95" width="44" height="205" fill="url(#b1)"/>
            <rect x="634" y="165" width="88" height="8" fill="#2a5c8a" opacity="0.8"/>
            <rect x="637" y="105" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="105" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="105" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="105" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="637" y="123" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="651" y="123" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="123" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="707" y="123" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="141" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="141" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="693" y="141" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="141" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="180" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="180" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="180" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="707" y="180" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="637" y="198" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="651" y="198" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="693" y="198" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="198" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="637" y="216" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="651" y="216" width="10" height="11" fill="rgba(100,160,220,0.15)"/><rect x="693" y="216" width="10" height="11" fill="rgba(255,220,100,0.35)"/><rect x="707" y="216" width="10" height="11" fill="rgba(255,220,100,0.35)"/>

            {/* RIGHT CLUSTER */}
            <rect x="860" y="115" width="62" height="185" fill="url(#b2)"/>
            <rect x="865" y="125" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="879" y="125" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="893" y="125" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="907" y="125" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="865" y="144" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="879" y="144" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="893" y="144" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="907" y="144" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="865" y="163" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="879" y="163" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="893" y="163" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="907" y="163" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="865" y="182" width="9" height="12" fill="rgba(255,210,90,0.3)"/><rect x="879" y="182" width="9" height="12" fill="rgba(255,210,90,0.28)"/><rect x="893" y="182" width="9" height="12" fill="rgba(70,140,200,0.12)"/><rect x="907" y="182" width="9" height="12" fill="rgba(255,210,90,0.3)"/>

            <rect x="933" y="70" width="50" height="230" fill="url(#b3)"/>
            <rect x="936" y="68" width="44" height="5" fill="#3a7cbf"/>
            <rect x="939" y="78" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="78" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="939" y="95" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="956" y="95" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="939" y="112" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="956" y="112" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="939" y="129" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="129" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="939" y="146" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="956" y="146" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="939" y="163" width="12" height="10" fill="rgba(100,170,240,0.15)"/><rect x="956" y="163" width="12" height="10" fill="rgba(255,230,120,0.45)"/><rect x="939" y="180" width="12" height="10" fill="rgba(255,230,120,0.4)"/><rect x="956" y="180" width="12" height="10" fill="rgba(255,230,120,0.45)"/>
            <line x1="958" y1="68" x2="958" y2="42" stroke="#3a7cbf" strokeWidth="2"/>
            <circle cx="958" cy="40" r="3" fill="#ff4444" opacity="0.8" style={{animation:'pulse 2.2s infinite'}}/>

            <rect x="993" y="145" width="72" height="155" fill="#0e2030"/>
            <rect x="998" y="155" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1012" y="155" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1026" y="155" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1040" y="155" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1054" y="155" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="998" y="174" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1012" y="174" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1026" y="174" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1040" y="174" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1054" y="174" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="998" y="193" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1012" y="193" width="9" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1026" y="193" width="9" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1040" y="193" width="9" height="12" fill="rgba(60,130,190,0.1)"/><rect x="1054" y="193" width="9" height="12" fill="rgba(255,200,80,0.28)"/>

            <rect x="1075" y="95" width="48" height="205" fill="url(#b1)"/>
            <rect x="1078" y="93" width="42" height="5" fill="#2a5c8a"/>
            <rect x="1081" y="103" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="103" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1081" y="120" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="120" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1081" y="137" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1097" y="137" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1081" y="154" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1097" y="154" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1081" y="171" width="11" height="10" fill="rgba(255,220,110,0.38)"/><rect x="1097" y="171" width="11" height="10" fill="rgba(255,220,110,0.35)"/><rect x="1081" y="188" width="11" height="10" fill="rgba(90,160,230,0.14)"/><rect x="1097" y="188" width="11" height="10" fill="rgba(255,220,110,0.38)"/>
            <line x1="1099" y1="93" x2="1099" y2="65" stroke="#2a5c8a" strokeWidth="2"/>
            <circle cx="1099" cy="63" r="3" fill="#ff5555" opacity="0.7" style={{animation:'pulse 3s infinite'}}/>

            <rect x="1133" y="165" width="58" height="135" fill="url(#b2)"/>
            <rect x="1138" y="175" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1151" y="175" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1164" y="175" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1177" y="175" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1138" y="194" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1151" y="194" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1164" y="194" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1177" y="194" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1138" y="213" width="8" height="12" fill="rgba(255,200,80,0.28)"/><rect x="1151" y="213" width="8" height="12" fill="rgba(255,200,80,0.25)"/><rect x="1164" y="213" width="8" height="12" fill="rgba(60,120,180,0.1)"/><rect x="1177" y="213" width="8" height="12" fill="rgba(255,200,80,0.28)"/>

            {/* Ground line */}
            <rect x="0" y="295" width="1440" height="5" fill="#0a1e14" opacity="0.9"/>

            {/* Light reflections in water */}
            <rect x="55" y="298" width="3" height="50" fill="rgba(255,200,80,0.12)"/>
            <rect x="211" y="298" width="3" height="45" fill="rgba(255,200,80,0.12)"/>
            <rect x="581" y="298" width="4" height="60" fill="rgba(255,200,80,0.15)"/>
            <rect x="654" y="298" width="3" height="50" fill="rgba(255,200,80,0.1)"/>
            <rect x="700" y="298" width="3" height="50" fill="rgba(255,200,80,0.1)"/>
            <rect x="958" y="298" width="3" height="55" fill="rgba(255,200,80,0.12)"/>
            <rect x="1099" y="298" width="3" height="45" fill="rgba(255,200,80,0.1)"/>
          </svg>
        </div>

        {/* Green horizon glow */}
        <div style={{ position:'absolute', bottom:'22%', left:'50%', transform:'translateX(-50%)', width:'60%', height:60, background:'radial-gradient(ellipse, rgba(15,110,86,0.2) 0%, transparent 70%)', filter:'blur(15px)' }} />

        {/* CONTENT */}
        <div style={{ position:'relative', zIndex:10, flex:1, display:'flex', flexDirection:'column' }}>
          {/* Nav */}
          <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34, height:34, background:'#0F6E56', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(15,110,86,0.5)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.3px' }}>LagosLandCheck</span>
              <span style={{ fontSize:9, fontFamily:'DM Mono,monospace', background:'rgba(15,110,86,0.3)', color:'#5DCAA5', border:'0.5px solid rgba(93,202,165,0.4)', padding:'2px 7px', borderRadius:4 }}>BETA</span>
            </div>
          </nav>

          {/* Hero */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1rem 1.5rem 0', textAlign:'center', paddingBottom:'38%' }}>
            <div style={{ display:'inline-block', background:'rgba(15,110,86,0.15)', border:'0.5px solid rgba(93,202,165,0.3)', borderRadius:20, padding:'5px 14px', fontSize:11, fontFamily:'DM Mono,monospace', color:'#5DCAA5', letterSpacing:'1.5px', marginBottom:'1.25rem' }}>
              LAGOS LAND INTELLIGENCE
            </div>
            <h1 style={{ fontFamily:'Instrument Serif,serif', fontSize:'clamp(30px,7vw,50px)', lineHeight:1.15, color:'#fff', marginBottom:'1rem', maxWidth:560 }}>
              Verify Lagos land before you{' '}
              <em style={{ fontStyle:'italic', color:'#5DCAA5', textShadow:'0 0 30px rgba(93,202,165,0.4)' }}>lose a kobo.</em>
            </h1>
            <p style={{ fontSize:'clamp(13px,3vw,15px)', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:420, marginBottom:'1.5rem' }}>
              6 automated checks — gazette acquisitions, flood risk, fraud zones, litigation, LUC status, satellite AI — in under 2 minutes.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {['Gazette DB','NIMET flood zones','Omo Onile alerts','Court records','LUC status','Satellite AI'].map(tag => (
                <span key={tag} style={{ fontSize:11, fontFamily:'DM Mono,monospace', padding:'5px 12px', borderRadius:20, border:'0.5px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.45)', background:'rgba(255,255,255,0.05)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INPUT CARD */}
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', marginTop:-32, position:'relative', zIndex:20, boxShadow:'0 -8px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 0' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'#e0e0dc' }} />
        </div>
        <div style={{ padding:'1rem 1.5rem 0' }}>
          <p style={{ fontSize:11, fontFamily:'DM Mono,monospace', letterSpacing:'1.5px', color:'#0F6E56', marginBottom:4 }}>VERIFY A PROPERTY</p>
          <h2 style={{ fontFamily:'Instrument Serif,serif', fontSize:22, color:'#111', marginBottom:0 }}>Submit land location</h2>
        </div>
        <InputPanel onSubmit={handleSubmit} />
        <div style={{ padding:'0 1.5rem 2.5rem' }}>
          <div style={{ borderTop:'0.5px solid #eee', paddingTop:'1rem', display:'flex', gap:10, alignItems:'flex-start' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={{ fontSize:11, color:'#aaa', lineHeight:1.7, margin:0 }}>LagosLandCheck is a pre-screening intelligence tool. It does not replace a physical Land Registry search by a licensed lawyer.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
