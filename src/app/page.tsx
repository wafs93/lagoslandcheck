'use client'
import { useRouter } from 'next/navigation'
import InputPanel from '@/components/InputPanel'

export default function Home() {
  const router = useRouter()
  const handleSubmit = (lat: number, lng: number) => {
    router.push(`/report?lat=${lat}&lng=${lng}`)
  }

  return (
    <main style={{ fontFamily: 'Syne, sans-serif', background: '#f9f9f6' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.8}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}

        .pac-container{border-radius:12px!important;border:1px solid #e0e0d8!important;box-shadow:0 8px 32px rgba(0,0,0,.1)!important;font-family:'Syne',sans-serif!important;margin-top:4px!important;overflow:hidden!important}
        .pac-item{padding:10px 14px!important;font-size:13px!important;cursor:pointer!important;border-top:0.5px solid #f0f0ec!important}
        .pac-item:hover,.pac-item-selected{background:#f0faf5!important}
        .pac-matched{color:#0F6E56!important;font-weight:600!important}
        .pac-icon{display:none!important}
        .pac-item-query{font-size:13px!important}

        /* ── LAYOUT ── */
        .layout{display:flex;flex-direction:column}
        .col-left{width:100%;position:relative;overflow:hidden;min-height:92vh;display:flex;flex-direction:column}
        .col-right{width:100%;background:#fff}

        @media(min-width:960px){
          .layout{flex-direction:row;min-height:100vh}
          .col-left{width:52%;min-height:100vh;position:sticky;top:0;height:100vh}
          .col-right{width:48%;overflow-y:auto}
          .hero-pb{padding-bottom:36%!important}
          .h1-size{font-size:46px!important}
          .stats-row{justify-content:flex-start!important}
          .hero-align{align-items:flex-start!important;text-align:left!important;padding-left:2.5rem!important;padding-right:2rem!important}
          .badge-center{margin-left:0!important}
          .vs-grid{grid-template-columns:1fr 1fr!important}
          .who-grid{grid-template-columns:1fr 1fr!important}
          .steps-grid{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      <div className="layout">

        {/* ══ LEFT: DARK HERO ══ */}
        <div className="col-left">
          {/* Sky */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#040c18 0%,#081422 28%,#0b1c30 50%,#0f2618 72%,#0a1e12 100%)'}}/>

          {/* Stars */}
          {[[7,4],[14,10],[21,3],[30,7],[41,4],[54,10],[62,5],[70,8],[81,3],[90,6],[4,17],[18,21],[32,14],[46,18],[57,13],[68,20],[77,15],[87,19],[95,12],[11,27],[24,31],[37,24],[50,28],[63,25],[75,30],[84,26],[93,23],[3,36],[16,39],[29,33],[44,37],[59,34],[8,42],[22,44],[38,40],[52,43],[67,41],[79,45],[91,38]].map(([x,y],i)=>(
            <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:i%4===0?2:1,height:i%4===0?2:1,background:'#fff',borderRadius:'50%',opacity:.25+(i%4)*.15,animation:`twinkle ${2+(i%3)}s ease-in-out infinite`,animationDelay:`${(i%7)*.3}s`}}/>
          ))}

          {/* Moon */}
          <div style={{position:'absolute',top:'6%',right:'8%',width:38,height:38,background:'radial-gradient(circle at 33% 33%,#fffef0,#eec84a)',borderRadius:'50%',boxShadow:'0 0 20px 5px rgba(235,190,60,.12)'}}/>

          {/* Skyline */}
          <div style={{position:'absolute',bottom:0,left:0,right:0}}>
            <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style={{display:'block',width:'100%'}} preserveAspectRatio="xMidYMax slice">
              <defs>
                <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#193658"/><stop offset="100%" stopColor="#0d2035"/></linearGradient>
                <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#11271a"/><stop offset="100%" stopColor="#080f0a"/></linearGradient>
                <linearGradient id="b3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c4878"/><stop offset="100%" stopColor="#102b50"/></linearGradient>
                <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#091c30" stopOpacity=".95"/><stop offset="100%" stopColor="#030a14"/></linearGradient>
              </defs>
              {/* Water */}
              <rect x="0" y="230" width="800" height="70" fill="url(#wt)"/>
              <line x1="0" y1="245" x2="800" y2="245" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
              <line x1="0" y1="262" x2="800" y2="262" stroke="rgba(255,255,255,.02)" strokeWidth="1"/>
              {/* BG */}
              <rect x="0" y="198" width="45" height="36" fill="#08172a" opacity=".7"/>
              <rect x="50" y="185" width="38" height="50" fill="#08172a" opacity=".7"/>
              <rect x="690" y="192" width="50" height="42" fill="#08172a" opacity=".7"/>
              <rect x="748" y="202" width="52" height="32" fill="#08172a" opacity=".7"/>
              {/* L1 */}
              <rect x="14" y="82" width="42" height="152" fill="url(#b1)"/>
              <rect x="16" y="80" width="38" height="4" fill="#1c4878"/>
              <rect x="21" y="91" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="33" y="91" width="8" height="8" fill="rgba(85,145,215,.18)"/><rect x="21" y="106" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="33" y="106" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="21" y="121" width="8" height="8" fill="rgba(85,145,215,.15)"/><rect x="33" y="121" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="21" y="136" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="33" y="136" width="8" height="8" fill="rgba(85,145,215,.18)"/><rect x="21" y="151" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="33" y="151" width="8" height="8" fill="rgba(255,212,85,.38)"/><rect x="21" y="166" width="8" height="8" fill="rgba(85,145,215,.15)"/><rect x="33" y="166" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="21" y="181" width="8" height="8" fill="rgba(255,212,85,.42)"/><rect x="33" y="181" width="8" height="8" fill="rgba(85,145,215,.18)"/>
              <line x1="35" y1="80" x2="35" y2="58" stroke="#1c4878" strokeWidth="1.5"/>
              <circle cx="35" cy="56" r="2.5" fill="#ff2222" opacity=".9" style={{animation:'blink 2s infinite'}}/>
              {/* L2 */}
              <rect x="64" y="118" width="68" height="116" fill="url(#b2)"/>
              <rect x="68" y="128" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="82" y="128" width="9" height="11" fill="rgba(75,135,205,.14)"/><rect x="96" y="128" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="110" y="128" width="9" height="11" fill="rgba(255,208,80,.30)"/><rect x="68" y="146" width="9" height="11" fill="rgba(75,135,205,.14)"/><rect x="82" y="146" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="96" y="146" width="9" height="11" fill="rgba(255,208,80,.30)"/><rect x="110" y="146" width="9" height="11" fill="rgba(75,135,205,.14)"/><rect x="68" y="164" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="82" y="164" width="9" height="11" fill="rgba(255,208,80,.30)"/><rect x="96" y="164" width="9" height="11" fill="rgba(75,135,205,.14)"/><rect x="110" y="164" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="68" y="182" width="9" height="11" fill="rgba(255,208,80,.30)"/><rect x="82" y="182" width="9" height="11" fill="rgba(75,135,205,.14)"/><rect x="96" y="182" width="9" height="11" fill="rgba(255,208,80,.32)"/><rect x="110" y="182" width="9" height="11" fill="rgba(255,208,80,.30)"/>
              {/* L3 slim */}
              <rect x="142" y="54" width="32" height="180" fill="url(#b3)"/>
              <rect x="144" y="52" width="28" height="4" fill="#265888"/>
              <rect x="148" y="63" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="63" width="9" height="9" fill="rgba(105,170,240,.2)"/><rect x="148" y="79" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="161" y="79" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="148" y="95" width="9" height="9" fill="rgba(105,170,240,.16)"/><rect x="161" y="95" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="148" y="111" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="111" width="9" height="9" fill="rgba(105,170,240,.2)"/><rect x="148" y="127" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="161" y="127" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="148" y="143" width="9" height="9" fill="rgba(105,170,240,.16)"/><rect x="161" y="143" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="148" y="159" width="9" height="9" fill="rgba(255,222,110,.45)"/><rect x="161" y="159" width="9" height="9" fill="rgba(105,170,240,.2)"/><rect x="148" y="175" width="9" height="9" fill="rgba(255,222,110,.42)"/><rect x="161" y="175" width="9" height="9" fill="rgba(255,222,110,.45)"/>
              <line x1="158" y1="52" x2="158" y2="30" stroke="#265888" strokeWidth="1.5"/>
              <circle cx="158" cy="28" r="2.5" fill="#ff2222" opacity=".85" style={{animation:'blink 2.4s infinite'}}/>
              {/* CENTER hero */}
              <rect x="298" y="18" width="58" height="216" fill="url(#b3)"/>
              <rect x="302" y="16" width="50" height="5" fill="#2a62b0"/>
              <polygon points="327,16 314,0 340,0" fill="#1c4878"/>
              <rect x="306" y="27" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="27" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="27" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="43" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="43" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="43" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="306" y="59" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="320" y="59" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="59" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="75" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="75" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="75" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="306" y="91" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="91" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="91" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="306" y="107" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="107" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="107" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="123" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="320" y="123" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="123" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="306" y="139" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="139" width="10" height="9" fill="rgba(110,180,248,.2)"/><rect x="334" y="139" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="306" y="155" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="320" y="155" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="334" y="155" width="10" height="9" fill="rgba(110,180,248,.16)"/><rect x="306" y="171" width="10" height="9" fill="rgba(255,225,120,.46)"/><rect x="320" y="171" width="10" height="9" fill="rgba(255,225,120,.42)"/><rect x="334" y="171" width="10" height="9" fill="rgba(255,225,120,.46)"/>
              <line x1="327" y1="0" x2="327" y2="-16" stroke="#2a62b0" strokeWidth="2"/>
              <circle cx="327" cy="-17" r="3" fill="#ff1111" opacity=".95" style={{animation:'blink 1.7s infinite'}}/>
              {/* Twins */}
              <rect x="368" y="80" width="36" height="154" fill="url(#b1)"/>
              <rect x="414" y="80" width="36" height="154" fill="url(#b1)"/>
              <rect x="370" y="130" width="72" height="6" fill="#1c4878" opacity=".85"/>
              <rect x="373" y="90" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="385" y="90" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="419" y="90" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="431" y="90" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="373" y="106" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="385" y="106" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="419" y="106" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="431" y="106" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="373" y="122" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="385" y="122" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="419" y="122" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="431" y="122" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="373" y="143" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="385" y="143" width="8" height="9" fill="rgba(255,212,85,.35)"/><rect x="419" y="143" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="431" y="143" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="373" y="159" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="385" y="159" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="419" y="159" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="431" y="159" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="373" y="175" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="385" y="175" width="8" height="9" fill="rgba(85,148,212,.16)"/><rect x="419" y="175" width="8" height="9" fill="rgba(255,212,85,.38)"/><rect x="431" y="175" width="8" height="9" fill="rgba(255,212,85,.35)"/>
              {/* R cluster */}
              <rect x="520" y="95" width="52" height="139" fill="url(#b2)"/>
              <rect x="525" y="105" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="537" y="105" width="7" height="10" fill="rgba(62,128,195,.13)"/><rect x="549" y="105" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="561" y="105" width="7" height="10" fill="rgba(255,202,75,.30)"/><rect x="525" y="122" width="7" height="10" fill="rgba(255,202,75,.30)"/><rect x="537" y="122" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="549" y="122" width="7" height="10" fill="rgba(62,128,195,.13)"/><rect x="561" y="122" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="525" y="139" width="7" height="10" fill="rgba(62,128,195,.13)"/><rect x="537" y="139" width="7" height="10" fill="rgba(255,202,75,.30)"/><rect x="549" y="139" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="561" y="139" width="7" height="10" fill="rgba(62,128,195,.13)"/><rect x="525" y="156" width="7" height="10" fill="rgba(255,202,75,.32)"/><rect x="537" y="156" width="7" height="10" fill="rgba(255,202,75,.30)"/><rect x="549" y="156" width="7" height="10" fill="rgba(62,128,195,.13)"/><rect x="561" y="156" width="7" height="10" fill="rgba(255,202,75,.32)"/>
              <rect x="581" y="57" width="40" height="177" fill="url(#b3)"/>
              <rect x="584" y="55" width="34" height="4" fill="#265888"/>
              <rect x="587" y="65" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="65" width="10" height="9" fill="rgba(105,172,242,.19)"/><rect x="587" y="81" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="81" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="97" width="10" height="9" fill="rgba(105,172,242,.16)"/><rect x="601" y="97" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="113" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="113" width="10" height="9" fill="rgba(105,172,242,.19)"/><rect x="587" y="129" width="10" height="9" fill="rgba(255,222,110,.40)"/><rect x="601" y="129" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="145" width="10" height="9" fill="rgba(105,172,242,.16)"/><rect x="601" y="145" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="587" y="161" width="10" height="9" fill="rgba(255,222,110,.43)"/><rect x="601" y="161" width="10" height="9" fill="rgba(105,172,242,.19)"/><rect x="587" y="177" width="10" height="9" fill="rgba(255,222,110,.40)"/><rect x="601" y="177" width="10" height="9" fill="rgba(255,222,110,.43)"/>
              <line x1="601" y1="55" x2="601" y2="32" stroke="#265888" strokeWidth="1.5"/>
              <circle cx="601" cy="30" r="2.5" fill="#ff2222" opacity=".85" style={{animation:'blink 2.1s infinite'}}/>
              <rect x="632" y="125" width="58" height="109" fill="#0a1c2c"/>
              <rect x="637" y="135" width="7" height="10" fill="rgba(255,195,70,.28)"/><rect x="649" y="135" width="7" height="10" fill="rgba(52,118,178,.1)"/><rect x="661" y="135" width="7" height="10" fill="rgba(255,195,70,.28)"/><rect x="673" y="135" width="7" height="10" fill="rgba(255,195,70,.26)"/><rect x="684" y="135" width="7" height="10" fill="rgba(52,118,178,.1)"/><rect x="637" y="152" width="7" height="10" fill="rgba(255,195,70,.26)"/><rect x="649" y="152" width="7" height="10" fill="rgba(255,195,70,.28)"/><rect x="661" y="152" width="7" height="10" fill="rgba(52,118,178,.1)"/><rect x="673" y="152" width="7" height="10" fill="rgba(255,195,70,.28)"/><rect x="684" y="152" width="7" height="10" fill="rgba(255,195,70,.26)"/><rect x="637" y="169" width="7" height="10" fill="rgba(52,118,178,.1)"/><rect x="649" y="169" width="7" height="10" fill="rgba(255,195,70,.28)"/><rect x="661" y="169" width="7" height="10" fill="rgba(255,195,70,.26)"/><rect x="673" y="169" width="7" height="10" fill="rgba(52,118,178,.1)"/><rect x="684" y="169" width="7" height="10" fill="rgba(255,195,70,.28)"/>
              <rect x="702" y="78" width="40" height="156" fill="url(#b1)"/>
              <rect x="705" y="76" width="34" height="4" fill="#1c4878"/>
              <rect x="709" y="86" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="86" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="709" y="101" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="101" width="9" height="8" fill="rgba(255,212,100,.38)"/><rect x="709" y="116" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="722" y="116" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="709" y="131" width="9" height="8" fill="rgba(255,212,100,.38)"/><rect x="722" y="131" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="709" y="146" width="9" height="8" fill="rgba(255,212,100,.40)"/><rect x="722" y="146" width="9" height="8" fill="rgba(255,212,100,.38)"/><rect x="709" y="161" width="9" height="8" fill="rgba(82,144,218,.15)"/><rect x="722" y="161" width="9" height="8" fill="rgba(255,212,100,.40)"/>
              <line x1="722" y1="76" x2="722" y2="54" stroke="#1c4878" strokeWidth="1.5"/>
              <circle cx="722" cy="52" r="2.5" fill="#ff4444" opacity=".75" style={{animation:'blink 2.8s infinite'}}/>
              <rect x="752" y="142" width="47" height="92" fill="url(#b2)"/>
              <rect x="757" y="152" width="7" height="10" fill="rgba(255,198,72,.28)"/><rect x="769" y="152" width="7" height="10" fill="rgba(52,115,175,.1)"/><rect x="781" y="152" width="7" height="10" fill="rgba(255,198,72,.28)"/><rect x="757" y="169" width="7" height="10" fill="rgba(52,115,175,.1)"/><rect x="769" y="169" width="7" height="10" fill="rgba(255,198,72,.28)"/><rect x="781" y="169" width="7" height="10" fill="rgba(255,198,72,.26)"/><rect x="757" y="186" width="7" height="10" fill="rgba(255,198,72,.28)"/><rect x="769" y="186" width="7" height="10" fill="rgba(255,198,72,.26)"/><rect x="781" y="186" width="7" height="10" fill="rgba(52,115,175,.1)"/>
              {/* Ground */}
              <rect x="0" y="233" width="800" height="4" fill="#071508" opacity=".95"/>
              {/* Reflections */}
              <rect x="35" y="236" width="2" height="38" fill="rgba(255,198,72,.1)"/>
              <rect x="158" y="236" width="2" height="34" fill="rgba(255,198,72,.1)"/>
              <rect x="327" y="236" width="3" height="46" fill="rgba(255,198,72,.12)"/>
              <rect x="386" y="236" width="2" height="38" fill="rgba(255,198,72,.08)"/>
              <rect x="422" y="236" width="2" height="38" fill="rgba(255,198,72,.08)"/>
              <rect x="601" y="236" width="2" height="42" fill="rgba(255,198,72,.1)"/>
              <rect x="722" y="236" width="2" height="36" fill="rgba(255,198,72,.08)"/>
            </svg>
          </div>

          {/* Horizon glow */}
          <div style={{position:'absolute',bottom:'24%',left:'50%',transform:'translateX(-50%)',width:'50%',height:44,background:'radial-gradient(ellipse,rgba(15,110,86,.16) 0%,transparent 70%)',filter:'blur(10px)'}}/>

          {/* Nav */}
          <nav style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.25rem 2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,background:'#0F6E56',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(15,110,86,.55)'}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{fontWeight:700,fontSize:16,color:'#fff',letterSpacing:'-.3px'}}>LagosLandCheck</span>
              <span style={{fontSize:9,fontFamily:'DM Mono,monospace',background:'rgba(15,110,86,.28)',color:'#5DCAA5',border:'.5px solid rgba(93,202,165,.35)',padding:'2px 7px',borderRadius:4}}>BETA</span>
            </div>
            <a href="#guide" style={{fontSize:11,color:'rgba(255,255,255,.4)',textDecoration:'none',fontFamily:'DM Mono,monospace'}}>Guide ↓</a>
          </nav>

          {/* Hero text */}
          <div className="hero-pb hero-align" style={{position:'relative',zIndex:10,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1rem 2rem 0',textAlign:'center',paddingBottom:'40%'}}>
            <div className="badge-center" style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(15,110,86,.18)',border:'.5px solid rgba(93,202,165,.32)',borderRadius:20,padding:'5px 13px',fontSize:10,fontFamily:'DM Mono,monospace',color:'#5DCAA5',letterSpacing:'1.5px',marginBottom:'1.1rem'}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#5DCAA5',animation:'blink 1.5s infinite',display:'inline-block'}}/>
              LAGOS LAND INTELLIGENCE
            </div>
            <h1 className="h1-size" style={{fontFamily:'Instrument Serif,serif',fontSize:'clamp(28px,5vw,48px)',lineHeight:1.12,color:'#fff',marginBottom:'.9rem',maxWidth:500}}>
              Verify Lagos land<br/>before you{' '}
              <em style={{fontStyle:'italic',color:'#5DCAA5',textShadow:'0 0 24px rgba(93,202,165,.35)'}}>lose a kobo.</em>
            </h1>
            <p style={{fontSize:'clamp(12px,2vw,14px)',color:'rgba(255,255,255,.5)',lineHeight:1.75,maxWidth:380,marginBottom:'1.5rem'}}>
              The only instant automated pre-screening tool for Lagos land. 6 checks in under 2 minutes.
            </p>
            <div className="stats-row" style={{display:'flex',gap:9,flexWrap:'wrap',justifyContent:'center',marginBottom:'1.25rem'}}>
              {[{n:'$4B+',l:'fraud lost/yr Nigeria'},{n:'1,500+',l:'Lagos fraud cases'},{n:'2 min',l:'vs 48hr competitors'}].map(s=>(
                <div key={s.n} style={{background:'rgba(255,255,255,.07)',backdropFilter:'blur(6px)',border:'.5px solid rgba(255,255,255,.11)',borderRadius:9,padding:'8px 13px',textAlign:'center'}}>
                  <div style={{fontSize:15,fontWeight:700,color:'#5DCAA5'}}>{s.n}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.36)',fontFamily:'DM Mono,monospace',marginTop:1,whiteSpace:'nowrap'}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center'}}>
              {['Gazette DB','NIMET flood','Omo Onile','Court records','LUC','Satellite AI'].map(t=>(
                <span key={t} style={{fontSize:9,fontFamily:'DM Mono,monospace',padding:'4px 10px',borderRadius:20,border:'.5px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.35)',background:'rgba(255,255,255,.04)'}}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT: WHITE PANEL ══ */}
        <div className="col-right">
          {/* Mobile drag handle */}
          <div style={{display:'flex',justifyContent:'center',padding:'10px 0 0'}}>
            <div style={{width:32,height:4,borderRadius:2,background:'#e0e0d8'}}/>
          </div>

          {/* Input */}
          <div style={{padding:'1rem 1.75rem 0'}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:3}}>VERIFY A PROPERTY</p>
            <h2 style={{fontFamily:'Instrument Serif,serif',fontSize:21,color:'#111',marginBottom:2}}>Where is the land?</h2>
            <p style={{fontSize:12,color:'#aaa',marginTop:3,lineHeight:1.6,marginBottom:0}}>Type the area or address below — works like Google Maps.</p>
          </div>
          <InputPanel onSubmit={handleSubmit}/>

          {/* ── LAGOS MAP ── */}
          <div style={{margin:'0 1.75rem 1.5rem',borderRadius:14,overflow:'hidden',border:'.5px solid #e8e8e2',boxShadow:'0 2px 12px rgba(0,0,0,.06)'}}>
            <div style={{padding:'10px 14px',background:'#f7f7f4',borderBottom:'.5px solid #e8e8e2',display:'flex',alignItems:'center',gap:8}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#0F6E56"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span style={{fontSize:11,fontFamily:'DM Mono,monospace',color:'#0F6E56',letterSpacing:'1px'}}>LAGOS, NIGERIA</span>
            </div>
            <iframe
              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&center=6.5244,3.3792&zoom=11&maptype=satellite"
              width="100%"
              height="200"
              style={{border:0,display:'block'}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lagos Nigeria Map"
            />
            <div style={{padding:'8px 14px',background:'#f7f7f4',borderTop:'.5px solid #e8e8e2'}}>
              <p style={{fontSize:10,color:'#aaa',fontFamily:'DM Mono,monospace',lineHeight:1.5}}>Lagos State · 6.5244°N, 3.3792°E · Pop. ~25M</p>
            </div>
          </div>

          {/* ── HOW IT WORKS ── */}
          <div style={{padding:'0 1.75rem 1.5rem',borderTop:'.5px solid #f0f0ea'}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:3,paddingTop:'1.25rem'}}>HOW IT WORKS</p>
            <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:19,color:'#111',marginBottom:'1rem'}}>6 checks, all in parallel</h3>
            {[
              {n:'01',name:'Satellite imagery',desc:'GPT-4o Vision analyses the land — swamp, water, encroachment, setback violations.',tag:'AI',tc:'#1a5fa0'},
              {n:'02',name:'Gazette & govt acquisition',desc:'All Lagos State Gazettes parsed. Any govt acquisition within 500m of your land?',tag:'CRITICAL',tc:'#8b1a1a'},
              {n:'03',name:'Flood & drainage risk',desc:'NIMET flood shapefiles + Lagos drainage plan. Flags unbuildable zones and 30m setbacks.',tag:'GIS',tc:'#0F6E56'},
              {n:'04',name:'Court litigation',desc:'Lagos Judiciary cause lists scraped. Active property disputes near your coordinate?',tag:'LEGAL',tc:'#7a4800'},
              {n:'05',name:'Land Use Charge status',desc:'LUC portal checked. No payments since 2018+ = amber flag. Outstanding LUC is a charge on the land.',tag:'LUC',tc:'#0F6E56'},
              {n:'06',name:'Fraud zone & Omo Onile',desc:'Curated fraud zone DB from court records + lawyer submissions. 500m radius check.',tag:'ALERT',tc:'#8b1a1a'},
            ].map(c=>(
              <div key={c.n} style={{display:'flex',gap:12,padding:'9px 5px',borderRadius:7,marginBottom:2}}>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'#ccc',minWidth:20,paddingTop:2}}>{c.n}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:500,color:'#111'}}>{c.name}</span>
                    <span style={{fontSize:9,fontFamily:'DM Mono,monospace',padding:'2px 6px',borderRadius:4,background:`${c.tc}14`,color:c.tc,fontWeight:500}}>{c.tag}</span>
                  </div>
                  <p style={{fontSize:11,color:'#999',lineHeight:1.6}}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── LAND BUYING GUIDE ── */}
          <div id="guide" style={{margin:'0 1.75rem 1.5rem',padding:'1.25rem',background:'linear-gradient(135deg,#f0faf5 0%,#e8f5ee 100%)',borderRadius:14,border:'.5px solid #c5e8d5'}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:3}}>BUYER'S GUIDE</p>
            <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:19,color:'#0a2a18',marginBottom:'1rem'}}>How to safely buy land in Lagos</h3>
            {[
              {step:'1',title:'Run LagosLandCheck first',desc:'Before anything else — before meeting agents, before viewing the land — run our 6 checks. This costs almost nothing and eliminates the biggest fraud risks instantly.',icon:'🔍',highlight:true},
              {step:'2',title:'Hire a licensed Lagos lawyer',desc:'Engage a property solicitor registered with the Nigerian Bar Association. Never use the seller\'s lawyer. Expect to pay 5–10% of property value in legal fees.',icon:'⚖'},
              {step:'3',title:'Search the Land Registry',desc:'Your lawyer must conduct a physical search at the Lagos State Land Registry, Alausa. This confirms the title, any encumbrances, and ownership history.',icon:'📋'},
              {step:'4',title:'Verify the survey plan',desc:'Obtain a Registered Survey Plan from the seller. Cross-check the beacon numbers and boundaries with a licensed surveyor. Fake survey plans are common.',icon:'📐'},
              {step:'5',title:'Confirm no gazette acquisition',desc:'Our check flags risks, but your lawyer must also physically verify with the Ministry of Lands that no government acquisition order exists for the parcel.',icon:'📰'},
              {step:'6',title:'Check LUC clearance',desc:'Request a Land Use Charge clearance certificate from the seller. Outstanding LUC is a charge on the land and transfers to you at purchase.',icon:'🧾'},
              {step:'7',title:'Due diligence on the vendor',desc:'Verify the seller\'s identity. If it\'s a company, search CAC (Corporate Affairs Commission). Check for outstanding court orders against the vendor.',icon:'👤'},
              {step:'8',title:'Governor\'s Consent or C of O',desc:'Insist on a Certificate of Occupancy or Governor\'s Consent as the minimum title document. Reject "Deed of Assignment only" without underlying C of O.',icon:'📜'},
            ].map(s=>(
              <div key={s.step} style={{display:'flex',gap:12,marginBottom:'0.9rem',padding:s.highlight?'10px 12px':'6px 0',background:s.highlight?'rgba(15,110,86,.08)':'transparent',borderRadius:s.highlight?10:0,border:s.highlight?'.5px solid rgba(15,110,86,.2)':'none'}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:s.highlight?'#0F6E56':'#e8f0ec',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13}}>
                  {s.highlight ? <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5"/></svg> : s.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:s.highlight?'#0F6E56':'#111',marginBottom:3,display:'flex',alignItems:'center',gap:6}}>
                    Step {s.step}: {s.title}
                    {s.highlight && <span style={{fontSize:9,fontFamily:'DM Mono,monospace',background:'#0F6E56',color:'#fff',padding:'1px 6px',borderRadius:4}}>START HERE</span>}
                  </div>
                  <p style={{fontSize:11,color:s.highlight?'#1a5a3a':'#888',lineHeight:1.65}}>{s.desc}</p>
                </div>
              </div>
            ))}
            <div style={{marginTop:'0.75rem',padding:'10px 12px',background:'rgba(255,165,0,.08)',borderRadius:9,border:'.5px solid rgba(255,165,0,.25)'}}>
              <p style={{fontSize:11,color:'#7a4800',lineHeight:1.65,fontWeight:500}}>⚠ Never pay any money — not even a "token deposit" — before completing Steps 1–5. This is the most common way Nigerians lose money to land fraud.</p>
            </div>
          </div>

          {/* ── VS COMPETITORS ── */}
          <div style={{margin:'0 1.75rem 1.5rem',padding:'1.25rem',background:'#0F2A1A',borderRadius:14}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'rgba(255,255,255,.45)',marginBottom:3}}>VS COMPETITORS</p>
            <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:18,color:'#fff',marginBottom:'0.875rem'}}>Instant vs 24–48 hours</h3>
            <div className="vs-grid" style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
              <div>
                <div style={{fontSize:9,fontFamily:'DM Mono,monospace',color:'rgba(255,255,255,.35)',marginBottom:6}}>OTHERS</div>
                {['24–48 hour wait','Manual human review','₦15,000–₦50,000 upfront','No instant red-flag check'].map(x=>(
                  <div key={x} style={{display:'flex',gap:7,marginBottom:5}}><span style={{color:'rgba(255,255,255,.25)',fontSize:11}}>✕</span><span style={{fontSize:11,color:'rgba(255,255,255,.45)',lineHeight:1.5}}>{x}</span></div>
                ))}
              </div>
              <div>
                <div style={{fontSize:9,fontFamily:'DM Mono,monospace',color:'#9FE1CB',marginBottom:6}}>LAGOSLANDCHECK</div>
                {['Under 2 minutes','Fully automated AI + GIS','Fraction of the cost','Know before you negotiate'].map(x=>(
                  <div key={x} style={{display:'flex',gap:7,marginBottom:5}}><span style={{color:'#5DCAA5',fontSize:11}}>✓</span><span style={{fontSize:11,color:'rgba(255,255,255,.8)',lineHeight:1.5}}>{x}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHO IT'S FOR ── */}
          <div style={{padding:'0 1.75rem 1.5rem'}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:3}}>WHO IT'S FOR</p>
            <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:18,color:'#111',marginBottom:'0.875rem'}}>Built for diaspora & locals</h3>
            <div className="who-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[
                {e:'✈',t:'Diaspora buyers',d:'UK, US, Canada. Your rep takes a photo — we extract GPS and run all 6 checks instantly.'},
                {e:'⚖',t:'Property lawyers',d:'Pre-screen before advising clients. Flag issues before the Land Registry search.'},
                {e:'🏡',t:'Lagos locals',d:'Know about gazette acquisitions and flood risk before paying a single naira deposit.'},
                {e:'🏢',t:'Estate agents',d:'Protect your reputation. Screen every listing before presenting to clients.'},
              ].map(w=>(
                <div key={w.t} style={{background:'#f7f7f4',borderRadius:10,padding:'12px'}}>
                  <div style={{fontSize:18,marginBottom:4}}>{w.e}</div>
                  <div style={{fontSize:12,fontWeight:500,color:'#111',marginBottom:3}}>{w.t}</div>
                  <div style={{fontSize:11,color:'#999',lineHeight:1.55}}>{w.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PROBLEM STATS ── */}
          <div style={{margin:'0 1.75rem 1.5rem',padding:'1.25rem',background:'#f7f7f4',borderRadius:14}}>
            <p style={{fontSize:10,fontFamily:'DM Mono,monospace',letterSpacing:'1.5px',color:'#0F6E56',marginBottom:3}}>THE SCALE OF THE PROBLEM</p>
            <h3 style={{fontFamily:'Instrument Serif,serif',fontSize:18,color:'#111',marginBottom:'0.875rem'}}>Why this tool had to be built</h3>
            {[{s:'$4B+',t:'lost to property scams annually in Nigeria'},{s:'1,500+',t:'land fraud petitions in Lagos since 2020'},{s:'3%',t:'of Nigerians hold valid, verifiable land titles'},{s:'20%',t:'of disputes from double sales or forged documents'}].map(x=>(
              <div key={x.s} style={{display:'flex',gap:12,alignItems:'center',marginBottom:'0.55rem'}}>
                <span style={{fontWeight:700,fontSize:16,color:'#0F6E56',minWidth:50}}>{x.s}</span>
                <span style={{fontSize:12,color:'#666',lineHeight:1.55}}>{x.t}</span>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div style={{padding:'0 1.75rem 1rem',textAlign:'center'}}>
            <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{width:'100%',padding:13,background:'#0F6E56',border:'none',borderRadius:10,fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,color:'#fff',cursor:'pointer'}}>
              Run a verification →
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{padding:'0.75rem 1.75rem 0',display:'flex',gap:8,alignItems:'flex-start'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={{fontSize:10,color:'#bbb',lineHeight:1.7,margin:0,fontFamily:'DM Mono,monospace'}}>Pre-screening tool only. Does not replace a physical Land Registry search by a licensed lawyer. Use to identify red flags before committing money.</p>
          </div>

          {/* ── FOOTER ── */}
          <footer style={{margin:'1.5rem 1.75rem 0',paddingTop:'1rem',paddingBottom:'2rem',borderTop:'.5px solid #f0f0ea',display:'flex',flexDirection:'column',gap:6,alignItems:'center',textAlign:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:22,height:22,background:'#0F6E56',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{fontWeight:700,fontSize:13,color:'#333'}}>LagosLandCheck</span>
            </div>
            <p style={{fontSize:10,color:'#bbb',fontFamily:'DM Mono,monospace'}}>Lagos land pre-screening intelligence · Beta 2026</p>
            <p style={{fontSize:10,color:'#ccc',fontFamily:'DM Mono,monospace'}}>
              Designed by{' '}
              <a href="https://wafsdesign.com" target="_blank" rel="noopener noreferrer" style={{color:'#0F6E56',textDecoration:'none',fontWeight:500}}>
                WafsDesign
              </a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
