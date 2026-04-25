'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'agent'
  content: string
  type?: 'text' | 'verification'
  verification?: VerificationResult
  timestamp: Date
}

interface CheckResult {
  id: string
  name: string
  status: 'clear' | 'caution' | 'critical' | 'error'
  summary: string
  details: string
}

interface VerificationResult {
  overall: string
  location_label: string
  confidence: string
  checks: CheckResult[]
  lat?: number
  lng?: number
}

const QUICK_PROMPTS = [
  { label: '🔍 Verify land in Lekki', msg: 'I want to verify land in Lekki Phase 1, Lagos' },
  { label: '⚠️ Ajah area risks', msg: 'What are the fraud risks for buying land in Ajah?' },
  { label: '🌿 Rural land near Epe', msg: 'I want to buy land in a rural area near Epe, how do I verify it?' },
  { label: '📄 Check my C of O', msg: 'How do I know if my Certificate of Occupancy is genuine?' },
  { label: '👥 What is Omo Onile?', msg: 'What is Omo Onile and how do I protect myself?' },
  { label: '🏭 Ibeju-Lekki risks', msg: 'I want to buy land in Ibeju-Lekki near the Free Trade Zone' },
]

const statusColors = {
  clear: { bg: '#ECFDF5', text: '#065F46', dot: '#22C55E', badge: '#D1FAE5', label: 'CLEAR' },
  caution: { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B', badge: '#FEF3C7', label: 'CAUTION' },
  critical: { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444', badge: '#FEE2E2', label: 'CRITICAL' },
  error: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF', badge: '#F3F4F6', label: 'UNKNOWN' },
}

const verdictConfig = {
  CLEAR: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', label: '✅ ALL CLEAR', icon: '✅' },
  CAUTION: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: '⚠️ PROCEED WITH CAUTION', icon: '⚠️' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', label: '🚫 DO NOT PROCEED', icon: '🚫' },
}

export default function AgentPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([{
    role: 'agent',
    content: "Hi! I'm your Lagos Land Agent 🏙️\n\nI verify land anywhere in Lagos — urban estates, rural areas, even remote bush land near Epe or Badagry.\n\nI accept:\n📍 Street address or estate name\n🔗 Google Maps link (paste it directly)\n📐 What3Words (///word.word.word)\n🗺️ Survey plan coordinates\n\nI'll run all 6 checks and show you a satellite image of the land.\n\nWhat land do you want to verify?",
    timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [toolWorking, setToolWorking] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, toolWorking])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setStreamingText('')
    setToolWorking(null)

    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role === 'agent' ? 'assistant' : 'user',
      content: m.content
    }))

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let verificationData: VerificationResult | null = null

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'text') { fullText += data.content; setStreamingText(fullText) }
            else if (data.type === 'tool_start') {
              const labels: Record<string, string> = {
                geocode_address: '📍 Looking up address...',
                extract_coordinates_from_input: '📐 Extracting coordinates...',
                run_verification: '🔍 Running all 6 checks...',
                get_area_intelligence: '🧠 Loading area intelligence...',
              }
              setToolWorking(labels[data.tool] || '⚙️ Working...')
            }
            else if (data.type === 'verification_start') setToolWorking('🛰️ Running satellite, gazette, flood, court, LUC and fraud checks in parallel...')
            else if (data.type === 'verification_result') { verificationData = data.data; setToolWorking(null) }
            else if (data.type === 'tool_result') setToolWorking(null)
            else if (data.type === 'done') {
              setLoading(false); setStreamingText(''); setToolWorking(null)
              if (fullText || verificationData) {
                setMessages(prev => [...prev, {
                  role: 'agent', content: fullText,
                  type: verificationData ? 'verification' : 'text',
                  verification: verificationData || undefined,
                  timestamp: new Date()
                }])
              }
            }
            else if (data.type === 'error') {
              setLoading(false); setStreamingText(''); setToolWorking(null)
              setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date() }])
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setLoading(false)
      setMessages(prev => [...prev, { role: 'agent', content: 'Connection error. Please try again.', timestamp: new Date() }])
    }
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const fmt = (text: string) => text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ))

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#F0F2F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .appear{animation:fadeIn 0.3s ease both}
        textarea{resize:none}
        textarea:focus{outline:none}
        .chip:hover{background:#E8F7F1!important;border-color:#0A5C45!important;color:#0A5C45!important}
        .check-item:hover{background:rgba(0,0,0,0.02)!important}
        .send-btn:hover{background:#085041!important}
        @media(max-width:640px){
          .hide-mobile{display:none!important}
          .msg-bubble{max-width:88%!important}
        }
      `}</style>

      {/* Header */}
      <div style={{ background: '#0A5C45', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <button onClick={() => router.push('/')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 10px', borderRadius: 6 }}>
          ← Back
        </button>
        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Lagos Land Agent</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Online · AI-powered · Satellite imagery
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }} className='hide-mobile'>
          {['Gazette', 'Flood', 'Fraud', 'LUC', 'Court', 'AI'].map(t => (
            <span key={t} style={{ fontSize: 9, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', padding: '3px 7px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', maxWidth: 700, margin: '0 auto', width: '100%' }}>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px', marginBottom: 8, textAlign: 'center' }}>QUICK START</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p.label} className="chip" onClick={() => sendMessage(p.msg)}
                  style={{ fontSize: 12, padding: '7px 14px', borderRadius: 20, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', cursor: 'pointer', fontFamily: "'Syne',sans-serif", transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="appear" style={{ marginBottom: '1rem', display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>

            {msg.role === 'agent' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
            )}

            <div style={{ maxWidth: '82%' }}>
              {msg.content && (
                <div style={{
                  background: msg.role === 'user' ? '#0A5C45' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#111827',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  padding: '10px 14px', fontSize: 14, lineHeight: 1.65,
                  border: msg.role === 'agent' ? '1px solid #E5E7EB' : 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                  {fmt(msg.content)}
                </div>
              )}

              {msg.verification && (
                <div style={{ marginTop: 8 }}>
                  <VerificationCard result={msg.verification} expanded={expanded} setExpanded={setExpanded} />
                </div>
              )}

              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, fontFamily: "'JetBrains Mono',monospace", textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'agent' ? 4 : 0 }}>
                {msg.timestamp.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming */}
        {streamingText && (
          <div className="appear" style={{ marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </div>
            <div style={{ background: '#fff', borderRadius: '4px 18px 18px 18px', padding: '10px 14px', fontSize: 14, lineHeight: 1.65, border: '1px solid #E5E7EB', maxWidth: '82%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {fmt(streamingText)}
              <span style={{ display: 'inline-block', width: 2, height: 14, background: '#0A5C45', marginLeft: 2, animation: 'pulse 0.8s infinite', verticalAlign: 'middle' }} />
            </div>
          </div>
        )}

        {/* Tool working */}
        {toolWorking && (
          <div className="appear" style={{ marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '4px 18px 18px 18px', padding: '9px 14px', fontSize: 12, color: '#065F46', border: '1px solid #BBF7D0', fontFamily: "'JetBrains Mono',monospace" }}>
              {toolWorking}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '0.875rem 1rem', position: 'sticky', bottom: 0, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {['📍 Paste Google Maps link', '📐 Type What3Words', '🏘️ Enter address', '❓ Ask any question'].map(h => (
              <span key={h} style={{ fontSize: 10, color: '#9CA3AF', background: '#F9FAFB', border: '0.5px solid #E5E7EB', padding: '3px 8px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", cursor: 'default' }}>{h}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Type an address, paste a Google Maps link, or ask any question..."
              rows={2} disabled={loading} ref={inputRef}
              style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: 14, fontSize: 14, fontFamily: "'Syne',sans-serif", background: '#fff', color: '#111827', lineHeight: 1.5, transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#0A5C45'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: '50%', background: loading || !input.trim() ? '#E5E7EB' : '#0A5C45', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
              {loading
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#fff' : '#9CA3AF'} strokeWidth="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              }
            </button>
          </div>
          <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace" }}>
            Pre-screening only · Not legal advice · Always use a licensed lawyer for final due diligence
          </p>
        </div>
      </div>
    </div>
  )
}

function VerificationCard({ result, expanded, setExpanded }: {
  result: VerificationResult
  expanded: string | null
  setExpanded: (id: string | null) => void
}) {
  const [imgZoom, setImgZoom] = useState(false)
  const vc = verdictConfig[result.overall as keyof typeof verdictConfig] || verdictConfig.CAUTION
  const satelliteCheck = result.checks?.find(c => c.id === 'satellite')
  const hasBuilding = satelliteCheck?.summary?.includes('Building detected') || satelliteCheck?.summary?.includes('building')

  const satelliteUrl = result.lat && result.lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${result.lat},${result.lng}&zoom=19&size=600x300&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  const satelliteUrlHD = result.lat && result.lng
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${result.lat},${result.lng}&zoom=19&size=640x640&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  return (
    <>
      {/* Lightbox */}
      {imgZoom && satelliteUrlHD && (
        <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
          <div style={{ position: 'relative', maxWidth: 640, width: '100%' }}>
            <img src={satelliteUrlHD} alt="Satellite HD" style={{ width: '100%', borderRadius: 12, display: 'block' }} />
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              🛰️ {result.lat?.toFixed(5)}°N, {result.lng?.toFixed(5)}°E
            </div>
            {hasBuilding && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                ⚠️ BUILDING DETECTED
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono',monospace" }}>
              Tap anywhere to close
            </div>
          </div>
        </div>
      )}

      <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

      {/* Satellite image — tap to zoom */}
      {satelliteUrl && (
        <div style={{ position: 'relative', background: '#0A1628', cursor: 'zoom-in' }} onClick={() => setImgZoom(true)}>
          <img
            src={satelliteUrl}
            alt="Satellite view"
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
            🛰️ SATELLITE · Tap to zoom
          </div>
          {hasBuilding && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
              ⚠️ BUILDING DETECTED
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '3px 8px', fontSize: 9, color: '#fff', fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(4px)' }}>
            {result.lat?.toFixed(4)}°N, {result.lng?.toFixed(4)}°E
          </div>
          {/* Zoom hint */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
            <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fff', backdropFilter: 'blur(4px)' }}>
              🔍 Click to zoom
            </div>
          </div>
        </div>
      )}

      {/* Verdict */}
      <div style={{ background: vc.bg, borderBottom: `1px solid ${vc.border}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: vc.text, letterSpacing: '1px', fontWeight: 600, marginBottom: 2 }}>{vc.label}</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: vc.text }}>{result.location_label}</p>
          </div>
          {result.confidence !== 'high' && (
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", background: '#FEF3C7', color: '#92400E', padding: '3px 7px', borderRadius: 4, fontWeight: 600 }}>
              {result.confidence?.toUpperCase()} CONFIDENCE
            </span>
          )}
        </div>
      </div>

      {/* Checks */}
      <div>
        {result.checks?.map((check, i) => {
          const sc = statusColors[check.status] || statusColors.error
          const isOpen = expanded === check.id
          return (
            <div key={check.id} className="check-item"
              style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: i < result.checks.length - 1 ? '0.5px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
              onClick={() => setExpanded(isOpen ? null : check.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>{check.name}</span>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", padding: '2px 8px', borderRadius: 4, background: sc.badge, color: sc.text, fontWeight: 600 }}>{sc.label}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3, paddingLeft: 17, lineHeight: 1.5 }}>{check.summary}</p>
              {isOpen && (
                <div style={{ marginTop: 8, paddingLeft: 17, paddingTop: 8, borderTop: '0.5px solid #F3F4F6' }}>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>{check.details}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8 }}>
        <a href={`/report?lat=${result.lat}&lng=${result.lng}`} style={{ flex: 1, padding: '10px 0', background: '#0A5C45', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
          View full report →
        </a>
        <button style={{ flex: 1, padding: '10px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Find a lawyer
        </button>
      </div>
    </div>
    </>
  )
}
