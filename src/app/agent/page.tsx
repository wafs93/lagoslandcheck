'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'agent'
  content: string
  type?: 'text' | 'verification' | 'tool_working'
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
}

const QUICK_PROMPTS = [
  { label: 'Verify land in Lekki', msg: 'I want to verify land in Lekki Phase 1, Lagos' },
  { label: 'Ajah area risks', msg: 'What are the fraud risks for buying land in Ajah?' },
  { label: 'Rural land in Epe', msg: 'I want to buy land in a rural area near Epe, how do I verify it?' },
  { label: 'Check my C of O', msg: 'How do I know if my Certificate of Occupancy is genuine?' },
  { label: 'What is Omo Onile?', msg: 'What is Omo Onile and how do I protect myself?' },
  { label: 'Ibeju-Lekki risks', msg: 'I want to buy land in Ibeju-Lekki near the Free Trade Zone' },
]

const statusColors = {
  clear: { bg: '#ECFDF5', text: '#065F46', dot: '#22C55E', badge: '#D1FAE5' },
  caution: { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B', badge: '#FEF3C7' },
  critical: { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444', badge: '#FEE2E2' },
  error: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF', badge: '#F3F4F6' },
}

const verdictConfig = {
  CLEAR: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', label: 'ALL CLEAR' },
  CAUTION: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: 'PROCEED WITH CAUTION' },
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', label: 'DO NOT PROCEED' },
}

export default function AgentPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([{
    role: 'agent',
    content: "Hello! I'm the Lagos Land Agent — your AI assistant for verifying land in Lagos before you buy.\n\nI can verify any land in Lagos — urban estates, rural areas, even remote bush land near Epe or Badagry. I understand all location formats:\n\n• Street address or estate name\n• Google Maps pin link\n• What3Words (///word.word.word)\n• Survey plan coordinates\n• GPS coordinates in any format\n\nI'll run all 6 checks — gazette acquisitions, flood risk, Omo Onile alerts, court cases, LUC status, and satellite imagery — and explain what every result means for you.\n\nWhat land do you want to verify?",
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
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'text') {
              fullText += data.content
              setStreamingText(fullText)
            }

            else if (data.type === 'tool_start') {
              const toolLabels: Record<string, string> = {
                geocode_address: 'Looking up address on Google Maps...',
                extract_coordinates_from_link: 'Extracting coordinates...',
                run_verification: 'Running all 6 checks in parallel...',
                get_area_intelligence: 'Loading area intelligence...',
              }
              setToolWorking(toolLabels[data.tool] || 'Working...')
            }

            else if (data.type === 'verification_start') {
              setToolWorking('Running satellite imagery, gazette, flood, court, LUC and fraud checks...')
            }

            else if (data.type === 'verification_result') {
              verificationData = data.data
              setToolWorking(null)
            }

            else if (data.type === 'tool_result') {
              setToolWorking(null)
            }

            else if (data.type === 'done') {
              setLoading(false)
              setStreamingText('')
              setToolWorking(null)
              if (fullText || verificationData) {
                setMessages(prev => [...prev, {
                  role: 'agent',
                  content: fullText,
                  type: verificationData ? 'verification' : 'text',
                  verification: verificationData || undefined,
                  timestamp: new Date()
                }])
              }
            }

            else if (data.type === 'error') {
              setLoading(false)
              setStreamingText('')
              setToolWorking(null)
              setMessages(prev => [...prev, {
                role: 'agent',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
              }])
            }
          } catch { /* skip malformed lines */ }
        }
      }
    } catch {
      setLoading(false)
      setMessages(prev => [...prev, {
        role: 'agent',
        content: 'Connection error. Please check your internet and try again.',
        timestamp: new Date()
      }])
    }
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F9FAFB; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .msg-appear { animation: fadeIn 0.3s ease both; }
        textarea { resize: none; }
        textarea:focus { outline: none; box-shadow: 0 0 0 2px rgba(10,92,69,0.2); }
        .check-row:hover { background: rgba(0,0,0,0.02); }
        .quick-chip:hover { background: #E8F7F1 !important; border-color: #0A5C45 !important; color: #0A5C45 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '4px 0' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div style={{ width: 1, height: 20, background: '#E5E7EB' }} />
        <div style={{ width: 32, height: 32, background: '#0A5C45', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Lagos Land Agent</div>
          <div style={{ fontSize: 11, color: '#22C55E', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Online · AI-powered verification
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['Gazette', 'Flood', 'Fraud', 'LUC', 'Court', 'AI'].map(t => (
            <span key={t} style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", background: '#F0FDF4', color: '#065F46', border: '0.5px solid #BBF7D0', padding: '3px 8px', borderRadius: 4 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: 760, margin: '0 auto', width: '100%' }}>

        {/* Quick prompts — show only at start */}
        {messages.length === 1 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#9CA3AF', letterSpacing: '1px', marginBottom: 10 }}>QUICK START</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p.label} className="quick-chip" onClick={() => sendMessage(p.msg)} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', cursor: 'pointer', fontFamily: "'Syne', sans-serif", transition: 'all 0.15s' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="msg-appear" style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>

            {/* Avatar */}
            {msg.role === 'agent' && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
            )}

            <div style={{ maxWidth: '80%', minWidth: 60 }}>
              {/* Text bubble */}
              {msg.content && (
                <div style={{
                  background: msg.role === 'user' ? '#0A5C45' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#111827',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '12px 16px',
                  fontSize: 14,
                  lineHeight: 1.65,
                  border: msg.role === 'agent' ? '1px solid #E5E7EB' : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  {formatContent(msg.content)}
                </div>
              )}

              {/* Verification result card */}
              {msg.verification && (
                <div style={{ marginTop: 10 }}>
                  <VerificationCard
                    result={msg.verification}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                </div>
              )}

              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.timestamp.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming text */}
        {streamingText && (
          <div className="msg-appear" style={{ marginBottom: '1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style={{ background: '#fff', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', fontSize: 14, lineHeight: 1.65, border: '1px solid #E5E7EB', maxWidth: '80%', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {formatContent(streamingText)}
              <span style={{ display: 'inline-block', width: 2, height: 14, background: '#0A5C45', marginLeft: 2, animation: 'pulse 1s infinite', verticalAlign: 'middle' }} />
            </div>
          </div>
        )}

        {/* Tool working indicator */}
        {toolWorking && (
          <div className="msg-appear" style={{ marginBottom: '1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0A5C45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', fontSize: 13, color: '#065F46', border: '1px solid #BBF7D0', fontFamily: "'JetBrains Mono', monospace" }}>
              {toolWorking}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '1rem 1.5rem', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Location input hints */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {['Paste Google Maps link', 'Type What3Words', 'Enter address', 'Ask any question'].map(h => (
              <span key={h} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#9CA3AF', background: '#F9FAFB', border: '0.5px solid #E5E7EB', padding: '3px 8px', borderRadius: 4 }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type an address, paste a Google Maps link, or ask any question about Lagos land..."
              rows={2}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                fontSize: 14,
                fontFamily: "'Syne', sans-serif",
                background: '#fff',
                color: '#111827',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: loading || !input.trim() ? '#E5E7EB' : '#0A5C45',
                border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s'
              }}
            >
              {loading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#fff' : '#9CA3AF'} strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
          <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 8, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            Pre-screening only — not legal advice · Always use a licensed lawyer for final due diligence
          </p>
        </div>
      </div>
    </div>
  )
}

function VerificationCard({ result, expanded, setExpanded }: {
  result: VerificationResult,
  expanded: string | null,
  setExpanded: (id: string | null) => void
}) {
  const vc = verdictConfig[result.overall as keyof typeof verdictConfig] || verdictConfig.CAUTION

  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Verdict header */}
      <div style={{ background: vc.bg, borderBottom: `1px solid ${vc.border}`, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: vc.text, letterSpacing: '1px', fontWeight: 600 }}>{vc.label}</span>
          {result.confidence !== 'high' && (
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 4 }}>
              {result.confidence === 'medium' ? 'MEDIUM CONFIDENCE' : 'LOW CONFIDENCE — USE PRECISE ADDRESS'}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: vc.text }}>{result.location_label}</p>
      </div>

      {/* Checks */}
      <div style={{ padding: '8px 0' }}>
        {result.checks.map((check, i) => {
          const sc = statusColors[check.status] || statusColors.error
          const isExpanded = expanded === check.id
          return (
            <div key={check.id} className="check-row" style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: i < result.checks.length - 1 ? '0.5px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
              onClick={() => setExpanded(isExpanded ? null : check.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>{check.name}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: '2px 8px', borderRadius: 4, background: sc.badge, color: sc.text, fontWeight: 600 }}>
                  {check.status.toUpperCase()}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4, paddingLeft: 17 }}>{check.summary}</p>
              {isExpanded && (
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
        <a href="/" style={{ flex: 1, padding: '9px 0', background: '#0A5C45', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
          View full report →
        </a>
        <button style={{ flex: 1, padding: '9px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Find a lawyer
        </button>
      </div>
    </div>
  )
}
