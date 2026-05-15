'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    n: '01',
    title: 'Who we are & what this policy covers',
    body: `LagosLandCheck ("we," "us," "our," or "the Service") operates lagoslandcheck.com. We are based in Lagos, Nigeria.

This Privacy Policy explains:
• What personal data we collect about you
• How we use it
• Who we share it with
• Your rights under the Nigerian Data Protection Regulation (NDPR), the Nigerian Data Protection Act 2023, and (where applicable) the EU/UK GDPR for our diaspora users

This policy applies to data collected through lagoslandcheck.com and any associated emails or PDF deliveries. It does not apply to third-party services we link to (Paystack, Google Maps, etc.) — those have their own privacy policies.

For questions about this policy or to exercise any of your rights, contact support@lagoslandcheck.com.`,
  },
  {
    n: '02',
    title: 'What data we collect',
    body: `We collect the minimum data needed to provide the Service:

(a) Email address — when you pay for a report. Used to deliver the report and reply to support enquiries.

(b) Name — when you fill out the contact form. Used to address you personally in replies.

(c) Coordinates and addresses you submit — to run the six verification checks. We retain these for analytics, fraud detection, and to allow you to re-download past reports.

(d) Payment metadata — Paystack handles all card processing. We receive only: payment reference, success/failure status, transaction amount, and timestamp. We DO NOT receive or store your card number, CVV, PIN, or full bank details.

(e) Email engagement data — when we send you an email via Resend, Resend tracks delivery status (delivered, opened, clicked, bounced). We use this to detect deliverability issues.

(f) Server logs — IP address, browser type, pages visited, timestamps. Retained for 30 days for security and debugging.

(g) Cookies — we use only essential cookies (session management, payment flow). We do NOT use advertising trackers, retargeting pixels, or behavioural analytics cookies. We do not currently use Google Analytics.

We do NOT collect:
• Biometric data
• National Identification Numbers (NIN)
• Bank account details
• Health, religion, or political information
• Children's data (the Service is not intended for users under 18)`,
  },
  {
    n: '03',
    title: 'How we use your data',
    body: `We use your data only for these specific purposes:

(a) Service delivery — running the six checks, generating the report, emailing it to you, providing access to re-download.

(b) Support — responding to your contact form submissions and email enquiries.

(c) Payment processing — confirming your payment with Paystack and issuing receipts.

(d) Fraud prevention — identifying abusive use of the Service (e.g., automated scraping, duplicate payment attempts).

(e) Marketing emails (only with your explicit consent) — if you opt in via the checkbox at payment, we may send occasional emails about new features, Lagos property news, fraud alerts, and product updates. Frequency: no more than 2 emails per month. Every marketing email includes a one-click unsubscribe link.

(f) Service improvement — aggregated, anonymized analytics about which areas of Lagos are most checked, common risk patterns, etc. This data is never linked to identifiable individuals.

We do NOT:
• Sell your data to anyone, ever
• Share your data with property developers, estate agents, or third-party marketers
• Use your data for profiling beyond legitimate fraud prevention
• Make automated decisions about you that have legal effect`,
  },
  {
    n: '04',
    title: 'Who we share data with',
    body: `Your data is shared only with the third-party service providers we need to operate the Service:

(a) Paystack (paystack.com) — handles all card and payment processing. Subject to Paystack's Privacy Policy.

(b) Resend (resend.com) — sends transactional and marketing emails. Subject to Resend's Privacy Policy.

(c) Supabase (supabase.com) — stores coordinates, report references, and check results. Hosted in EU (Frankfurt) data centres. Subject to Supabase's Privacy Policy.

(d) Google Cloud (google.com) — provides Google Maps Static API for satellite imagery. Subject to Google's Privacy Policy.

(e) OpenAI (openai.com) — performs AI satellite image analysis (GPT-4o). Images and coordinates sent to OpenAI are subject to OpenAI's API data policy, which states API data is not used for model training.

(f) Vercel (vercel.com) — hosts the website. Subject to Vercel's Privacy Policy.

We have selected these providers in part because they are GDPR / NDPR compliant.

We do NOT share data with:
• Lagos State Government registries (we only READ from public databases — we don't share customer information with them)
• Property lawyers, surveyors, or estate agents
• Advertising networks
• Data brokers`,
  },
  {
    n: '05',
    title: 'How long we keep your data',
    body: `We keep different categories of data for different periods:

(a) Report data (coordinates, check results, reference numbers) — retained indefinitely to allow you to re-download past reports. Deletable on request.

(b) Email addresses from purchases — retained for 24 months after the last purchase, then automatically deleted unless you have opted in to marketing emails (in which case retained until you unsubscribe).

(c) Contact form submissions — retained for 24 months to enable continuity of support conversations, then deleted.

(d) Payment metadata — retained for 7 years as required by Nigerian tax and financial regulations.

(e) Server logs — automatically deleted after 30 days.

(f) Email engagement data (delivery, open, click) — retained for 90 days by Resend, then deleted.

You can request earlier deletion of any of the above (except payment metadata, which we are legally required to retain) by emailing support@lagoslandcheck.com.`,
  },
  {
    n: '06',
    title: 'Your rights',
    body: `Under the Nigerian Data Protection Act 2023, the NDPR, and (for applicable users) the EU/UK GDPR, you have the following rights:

(a) Access — request a copy of all personal data we hold about you.

(b) Correction — request that we correct inaccurate or incomplete data.

(c) Deletion ("right to be forgotten") — request that we delete your data, subject to legal retention requirements (e.g., payment records).

(d) Restriction — request that we limit how we process your data.

(e) Objection — object to specific uses of your data, particularly marketing.

(f) Portability — request your data in a machine-readable format.

(g) Withdraw consent — at any time, for any consent you have given (e.g., marketing emails — just click unsubscribe).

(h) Complaint — lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe we have mishandled your data.

To exercise any of these rights, email support@lagoslandcheck.com with your request. We respond within 30 days as required by law. You do not need to give a reason, and exercising these rights is free.`,
  },
  {
    n: '07',
    title: 'Marketing emails & how to opt out',
    body: `We send two types of email:

(a) Transactional emails — reports, payment receipts, support replies, password resets (if applicable). These are not marketing emails and are always sent because they are essential to the Service.

(b) Marketing emails — new features, product updates, fraud alerts, occasional Lagos property news. We send these ONLY if you ticked the marketing opt-in checkbox at payment.

If you opted in but want to opt out:
• Click the "Unsubscribe" link at the bottom of any marketing email — instant, no questions asked
• Or email support@lagoslandcheck.com asking to be unsubscribed

Opting out of marketing emails does NOT affect your access to the Service or any transactional emails about reports you have already paid for. You can re-subscribe later by emailing support.`,
  },
  {
    n: '08',
    title: 'Data security',
    body: `We take reasonable security measures, including:

• HTTPS encryption on all pages
• Encrypted storage for sensitive data (Supabase encrypts at rest)
• Access controls — only authorized personnel can access user data
• Secret rotation — API keys are rotated when leaked or suspected
• Vendor selection — we use providers (Paystack, Resend, Supabase) that meet industry security standards
• No card storage — payment details are never on our servers; they go directly to Paystack

No system is 100% secure. If a data breach occurs that may compromise your personal data, we will notify you within 72 hours as required by Nigerian law, and notify the NDPC.

To report a security concern, email support@lagoslandcheck.com with "SECURITY" in the subject line.`,
  },
  {
    n: '09',
    title: 'International users',
    body: `LagosLandCheck is operated from Nigeria. If you access the Service from outside Nigeria (e.g., as a diaspora buyer in the UK, US, EU, or elsewhere), your data may be transferred to and processed in:

• Nigeria (our base of operations)
• Frankfurt, Germany (Supabase database hosting, Resend EU region)
• Ireland (Resend processing region for some flows)
• United States (OpenAI API, Vercel hosting, Google Cloud)

Where we transfer data internationally, we rely on:
• Standard Contractual Clauses with EU vendors
• Adequacy decisions (where applicable)
• Vendor compliance with GDPR / NDPR

For EU/UK users specifically: the legal basis for our processing is contract performance (delivering the report you paid for) and legitimate interest (running the business, preventing fraud).`,
  },
  {
    n: '10',
    title: 'Changes to this policy',
    body: `We may update this Privacy Policy from time to time. Material changes (those affecting your rights or how we use your data) will be notified by:

• Updating the "Last updated" date at the top of this page
• Emailing past customers about significant changes affecting them
• Posting a notice on the homepage for at least 14 days for major changes

Minor updates (clarifications, typo fixes) may be made without notice. Your continued use of the Service after changes are posted constitutes acceptance of the updated policy.`,
  },
  {
    n: '11',
    title: 'Contact & data protection',
    body: `For any privacy-related question or request:

Email: support@lagoslandcheck.com
Subject line tip: include "PRIVACY" or "DATA REQUEST" for faster routing
Response time: within 30 days as required by law (typically within 24–48 hours in practice)

If you believe we have not handled your privacy concerns adequately, you may complain to:

Nigeria Data Protection Commission (NDPC)
Website: ndpc.gov.ng
Email: info@ndpc.gov.ng

For EU/UK users: you may also complain to your local data protection authority.`,
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Syne',-apple-system,sans-serif", background: '#F8FAF9', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeUp .4s ease both}
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
        <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Privacy Policy</span>
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
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Menlo,Consolas,monospace',
            fontSize: 10,
            color: '#CFAF6E',
            letterSpacing: '2.5px',
            marginBottom: 14,
            fontWeight: 700,
          }}>
            ─── LEGAL · PRIVACY POLICY
          </div>
          <h1 style={{
            fontFamily: "'Lora',serif",
            fontSize: 'clamp(28px,5vw,42px)',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: 14,
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65,
            maxWidth: 580,
          }}>
            We respect your privacy. This policy explains what we collect, why, and how to control your data. Compliant with the Nigerian Data Protection Act 2023, NDPR, and GDPR.
          </p>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            marginTop: 12,
            fontFamily: 'Menlo,Consolas,monospace',
          }}>
            Effective: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px' }}>
        <div className="appear" style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          marginTop: -32,
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 2,
          marginBottom: 28,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingBottom: 14,
            borderBottom: '1px solid #E5E7EB',
            marginBottom: 18,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#07382C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#CFAF6E', fontFamily: 'Menlo,monospace', fontWeight: 700, fontSize: 13,
            }}>§</div>
            <div style={{ fontSize: 13, color: '#5C6B7A', lineHeight: 1.5 }}>
              <strong style={{ color: '#1A2332' }}>Short version:</strong> We collect only what we need to deliver your report. We never sell your data. Marketing emails are opt-in only. You can request deletion any time.
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#5C6B7A', lineHeight: 1.6 }}>
            We&apos;ve written this Privacy Policy in plain language wherever possible. If anything is unclear, email <a href="mailto:support@lagoslandcheck.com" style={{ color: '#07382C', fontWeight: 600 }}>support@lagoslandcheck.com</a> and we&apos;ll explain.
          </p>
        </div>

        {SECTIONS.map(s => (
          <div key={s.n} className="appear" style={{
            background: '#fff',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            padding: '24px 28px',
            marginBottom: 14,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px dashed #E5E7EB',
            }}>
              <span style={{
                fontFamily: 'Menlo,Consolas,monospace',
                fontSize: 11,
                color: '#CFAF6E',
                fontWeight: 700,
                letterSpacing: '1px',
              }}>{s.n}</span>
              <h2 style={{
                fontFamily: "'Lora',serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#1A2332',
                letterSpacing: '-0.3px',
              }}>{s.title}</h2>
            </div>
            <div style={{
              fontSize: 13.5,
              color: '#374151',
              lineHeight: 1.75,
              whiteSpace: 'pre-line',
            }}>{s.body}</div>
          </div>
        ))}

        <div style={{
          background: '#07382C',
          color: '#fff',
          borderRadius: 10,
          padding: '24px 28px',
          marginTop: 24,
          marginBottom: 40,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'Menlo,Consolas,monospace',
            fontSize: 10,
            color: '#CFAF6E',
            letterSpacing: '2px',
            marginBottom: 10,
          }}>DATA REQUESTS · PRIVACY QUESTIONS</div>
          <a href="mailto:support@lagoslandcheck.com" style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '-0.2px',
          }}>support@lagoslandcheck.com</a>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 6,
            fontFamily: 'Menlo,Consolas,monospace',
          }}>Subject: PRIVACY · Replies within 24h</div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '0 0 60px',
          fontSize: 11,
          color: '#9CA3AF',
          fontFamily: 'Menlo,Consolas,monospace',
          lineHeight: 1.8,
        }}>
          See also: <Link href="/terms" style={{ color: '#07382C', textDecoration: 'none' }}>Terms of Service</Link> · <Link href="/refund-policy" style={{ color: '#07382C', textDecoration: 'none' }}>Refund Policy</Link><br />
          LagosLandCheck · lagoslandcheck.com
        </div>
      </div>
    </div>
  )
}
