'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

const TOPICS = [
  'Refund request',
  'Report issue / inaccurate data',
  'Technical problem',
  'Payment problem',
  'Partnership inquiry',
  'Press / media',
  'Other',
]

const FAQS = [
  {
    q: 'I paid but did not receive my report email — what should I do?',
    a: 'Check your spam folder first (especially Gmail Promotions tab). Reports are sent within 30 seconds of payment confirmation from support@lagoslandcheck.com. If after 10 minutes you still cannot find it, email us with your Paystack reference (starts with "llc_") and we will resend immediately. The report link in the email is permanent — you can re-download the PDF anytime by clicking it.',
  },
  {
    q: 'The satellite check says "building detected" but the seller told me it is vacant land — who is right?',
    a: 'Trust the satellite. Our AI analyses high-resolution Google Earth imagery (zoom level 20, current within weeks) and identifies physical structures with high accuracy. If the seller is claiming vacant land but the satellite shows a building, this is a major red flag — either the seller is misrepresenting the parcel, you are looking at the wrong coordinates, or there is a boundary dispute. Do not pay any deposit until you physically visit the site with a surveyor.',
  },
  {
    q: 'Can I get a refund if the report shows everything as CLEAR but I find out later the land has problems?',
    a: 'Our six checks are pre-screening intelligence, not a guarantee of clean title. They cover public databases (gazettes, court records, LUC, fraud zones) and satellite analysis — but they do not replace a physical Land Registry title search by a licensed lawyer. The report disclaimer makes this clear. We only issue refunds when our checks fail to return real data (rare). See our refund policy for full terms.',
  },
  {
    q: 'How accurate is the gazette and government acquisition check?',
    a: 'Our gazette database covers Lagos State Gazette publications and major government acquisition records within a 500-metre radius of your coordinate. Records are updated regularly but may not reflect very recent ungazetted acquisitions. A CLEAR result means no records match — it does NOT mean none exist. Always have a lawyer conduct a formal Land Registry search before any transaction.',
  },
  {
    q: 'Why is my Land Use Charge check showing CAUTION even on legitimate land?',
    a: 'Most Lagos plots do not have LUC records in our database yet. A CAUTION result on LUC simply means "no record found, request clearance from the seller." It is not an accusation of fraud — it is a prompt to verify directly with LUC office or via landusecharge.lagosstate.gov.ng before completing your purchase.',
  },
  {
    q: 'Do you verify land outside Lagos State?',
    a: 'Not currently. Our databases (Lagos State Gazette, LASIMRA flood maps, LASEPA fraud zones) are Lagos-specific. We plan to expand to Ogun, Abuja and Port Harcourt — join the waitlist by emailing us with your target location.',
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const canSubmit = name.trim().length >= 2 && isValidEmail(email) && message.trim().length >= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message, _hp: hp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSent(true)
      } else {
        setError(data.error || 'Something went wrong. Please email support@lagoslandcheck.com directly.')
      }
    } catch {
      setError('Connection error. Please email support@lagoslandcheck.com directly.')
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Syne',-apple-system,sans-serif", background: '#F8FAF9', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
        input:focus,textarea:focus,select:focus{outline:none!important;border-color:#0A5C45!important}
      `}</style>

      <nav style={{
        background: '#07382C',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <Link href="/" style={{
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 7,
          padding: '5px 12px',
          color: '#fff',
          fontSize: 12,
          textDecoration: 'none',
        }}>← Home</Link>
        <div style={{ width: 28, height: 28, background: '#0A5C45', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Contact Support</span>
      </nav>

      <section style={{
        background: '#07382C',
        color: '#fff',
        padding: '48px 24px 64px',
        position: 'relative',
        borderBottom: '3px solid #CFAF6E',
      }}>
        <div style={{
          position: 'absolute',
          bottom: -3,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)',
        }} />
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Menlo,Consolas,monospace',
            fontSize: 10,
            color: '#CFAF6E',
            letterSpacing: '2.5px',
            marginBottom: 14,
            fontWeight: 700,
          }}>
            ─── CUSTOMER SUPPORT
          </div>
          <h1 style={{
            fontFamily: "'Lora',serif",
            fontSize: 'clamp(28px,5vw,42px)',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: 14,
          }}>
            We&apos;re here to help.
          </h1>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.65,
            maxWidth: 540,
          }}>
            Questions about a report you&apos;ve received? Need a refund? Spotted incorrect data? Get in touch and we&apos;ll respond within 24 hours, Monday to Saturday.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div className="appear" style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          marginTop: -32,
          padding: '24px 28px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 2,
          marginBottom: 32,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            <div>
              <div style={tagStyle}>EMAIL</div>
              <a href="mailto:support@lagoslandcheck.com?subject=Help%20with%20my%20LagosLandCheck%20report" style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#07382C',
                textDecoration: 'none',
                display: 'block',
                marginTop: 6,
              }}>
                support@lagoslandcheck.com
              </a>
              <p style={{ fontSize: 12, color: '#5C6B7A', marginTop: 4 }}>Click to open in your mail app</p>
            </div>
            <div>
              <div style={tagStyle}>RESPONSE TIME</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginTop: 6 }}>Within 24 hours</div>
              <p style={{ fontSize: 12, color: '#5C6B7A', marginTop: 4, fontFamily: 'Menlo,Consolas,monospace' }}>Mon–Sat · WAT</p>
            </div>
            <div>
              <div style={tagStyle}>LOCATION</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginTop: 6 }}>Lagos, Nigeria</div>
              <p style={{ fontSize: 12, color: '#5C6B7A', marginTop: 4 }}>Operating in WAT (UTC+1)</p>
            </div>
          </div>
        </div>

        <div className="appear" style={cardStyle}>
          <div style={tagStyle}>SEND A MESSAGE</div>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#1A2332', marginTop: 6, marginBottom: 6 }}>
            Tell us what&apos;s going on
          </h2>
          <p style={{ fontSize: 13, color: '#5C6B7A', marginBottom: 22, lineHeight: 1.6 }}>
            We read every message. For paid reports, include your reference number (starts with <code style={codeStyle}>LLC-</code>) so we can find it fast.
          </p>

          {sent ? (
            <div style={{
              padding: 24,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 10,
              textAlign: 'center',
            }}>
              <div style={{
                width: 48,
                height: 48,
                margin: '0 auto 12px',
                background: '#22C55E',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>Message received</h3>
              <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
                Thanks for reaching out. We&apos;ll reply to <strong>{email}</strong> within 24 hours. Check your spam folder if you don&apos;t see our reply — Gmail sometimes filters us into Promotions.
              </p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); setTopic(TOPICS[0]) }} style={{
                marginTop: 16,
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #065F46',
                borderRadius: 8,
                color: '#065F46',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>YOUR NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Adaeze Okonkwo"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>WHAT&apos;S THIS ABOUT?</label>
                <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={labelStyle}>YOUR MESSAGE</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us the full story. If you've paid for a report, include your reference number (LLC-XXXXXX) so we can find it quickly."
                  rows={6}
                  required
                  style={{ ...inputStyle, fontFamily: "'Syne',sans-serif", resize: 'vertical', minHeight: 120 }}
                />
                <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right', fontFamily: 'Menlo,Consolas,monospace', marginTop: 4 }}>
                  {message.length} / 5000
                </div>
              </div>

              <input
                type="text"
                name="company"
                value={hp}
                onChange={e => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' }}
              />

              {error && (
                <div style={{
                  padding: 12,
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  color: '#991B1B',
                  fontSize: 13,
                  marginBottom: 12,
                }}>{error}</div>
              )}

              <button type="submit" disabled={!canSubmit || loading} style={{
                width: '100%',
                padding: '14px 0',
                background: canSubmit && !loading ? 'linear-gradient(135deg,#0A5C45,#07382C)' : '#E5E7EB',
                color: canSubmit && !loading ? '#fff' : '#9CA3AF',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                fontFamily: "'Syne',sans-serif",
                letterSpacing: '0.2px',
              }}>
                {loading ? 'Sending...' : 'Send message →'}
              </button>
              <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 10, fontFamily: 'Menlo,Consolas,monospace' }}>
                Or email us directly: support@lagoslandcheck.com
              </p>
            </form>
          )}
        </div>

        <div className="appear" style={cardStyle}>
          <div style={tagStyle}>FREQUENTLY ASKED</div>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#1A2332', marginTop: 6, marginBottom: 18 }}>
            Common questions
          </h2>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div key={i} style={{
                borderBottom: i < FAQS.length - 1 ? '1px solid #F1F3F5' : 'none',
                paddingBottom: isOpen ? 16 : 0,
              }}>
                <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{
                  width: '100%',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 12,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', flex: 1, lineHeight: 1.5 }}>
                    {faq.q}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C6B7A" strokeWidth="2" style={{
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                  }}>
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
                {isOpen && (
                  <p style={{
                    fontSize: 13,
                    color: '#374151',
                    lineHeight: 1.75,
                    paddingRight: 24,
                  }}>{faq.a}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="appear" style={{ ...cardStyle, background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <div style={{ ...tagStyle, color: '#92400E' }}>REFUND POLICY · SUMMARY</div>
          <h2 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 600, color: '#78350F', marginTop: 6, marginBottom: 14 }}>
            When you can request a refund
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'If our automated checks failed to return real data (e.g. all 6 returned "temporarily unavailable")',
              'If you received the wrong report due to a coordinate extraction error on our end',
              'If you were charged twice for the same Paystack reference',
              'Refund requests must be made within 48 hours of payment with the LLC- reference number',
            ].map((item, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: i < 3 ? '1px dashed #FDE68A' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 13,
                color: '#78350F',
                lineHeight: 1.6,
              }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#FDE68A',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'Menlo,Consolas,monospace',
                  flexShrink: 0,
                  marginTop: 1,
                }}>{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/refund-policy" style={{
            display: 'inline-block',
            marginTop: 18,
            padding: '8px 16px',
            background: '#78350F',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 8,
            textDecoration: 'none',
          }}>Read full refund policy →</Link>
        </div>

        <div style={{ height: 32 }} />
      </div>

      <Footer />
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: '24px 28px',
  marginBottom: 24,
}

const tagStyle: React.CSSProperties = {
  fontSize: 10,
  fontFamily: 'Menlo,Consolas,monospace',
  color: '#5C6B7A',
  letterSpacing: '2px',
  fontWeight: 700,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontFamily: 'Menlo,Consolas,monospace',
  color: '#5C6B7A',
  letterSpacing: '1.5px',
  fontWeight: 700,
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #E5E7EB',
  borderRadius: 9,
  fontSize: 14,
  color: '#1A2332',
  background: '#FAFAFA',
  fontFamily: "'Syne',-apple-system,sans-serif",
  transition: 'border-color 0.15s',
}

const codeStyle: React.CSSProperties = {
  background: '#F1F3F5',
  padding: '1px 6px',
  borderRadius: 4,
  fontFamily: 'Menlo,Consolas,monospace',
  fontSize: 12,
  color: '#07382C',
}
