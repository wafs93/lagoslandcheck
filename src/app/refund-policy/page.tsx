'use client'

import Link from 'next/link'
import Footer from '@/components/Footer'

const SECTIONS = [
  {
    n: '01',
    title: 'Eligibility for refunds',
    body: `LagosLandCheck offers refunds in the following specific circumstances:

(a) Our automated verification system fails to return real data. If all six checks return "temporarily unavailable" or equivalent system error messages, you are entitled to a full refund.

(b) Duplicate charges. If you have been charged twice for the same Paystack reference within a 24-hour period, the duplicate charge will be refunded.

(c) Wrong coordinate processed due to system error. If we processed a coordinate substantially different from the location you submitted (and this was caused by our coordinate extraction logic), you are entitled to a full refund.

(d) Service unavailable. If the platform was unavailable when you attempted to view your report and remained unavailable for more than 4 hours, you are entitled to a refund.`,
  },
  {
    n: '02',
    title: 'What is NOT eligible for a refund',
    body: `Refunds will not be issued in the following circumstances:

(a) Disagreement with check results. Our reports reflect the data available in public registries and satellite imagery. We do not refund based on user disagreement with factual findings.

(b) "CAUTION" results on Land Use Charge. Most Lagos plots do not have LUC records in our database. A CAUTION result is the correct, honest output — it prompts you to verify directly with the LUC office. This is the report doing its job, not a defect.

(c) Issues discovered later by your lawyer. Our reports are pre-screening intelligence, not a full title search. Issues discovered through subsequent Land Registry searches do not constitute report errors.

(d) Buyer's remorse. Once a report is generated and delivered, the work has been performed and the refund is not available simply because you changed your mind.

(e) Requests beyond 48 hours. Refund requests submitted more than 48 hours after payment will not be processed except in cases of demonstrated system failure (Section 01).`,
  },
  {
    n: '03',
    title: 'How to request a refund',
    body: `To request a refund:

1. Email support@lagoslandcheck.com within 48 hours of payment.

2. Include in your email:
   • Your Paystack reference number (begins with "llc_")
   • The report reference number (begins with "LLC-")
   • The email address used for the purchase
   • A clear description of why you are requesting the refund
   • Screenshots if relevant (e.g. error messages, all-failed check screens)

3. Eligibility check. We will respond within 24 hours (Mon–Sat) confirming whether your request qualifies under Sections 01–02 above.

4. If approved, refunds are processed via Paystack to the original payment method within 5–10 business days.`,
  },
  {
    n: '04',
    title: 'Processing time',
    body: `Once approved, refunds are submitted to Paystack within 1 business day. The actual time funds appear in your account depends on Paystack and your card issuer:

• Nigerian Naira cards (Verve, GTB, Access, etc.): typically 3–7 business days
• International cards (Visa, Mastercard): typically 5–10 business days
• Bank transfers: typically 1–3 business days

You will receive an email confirmation when the refund is submitted. If after 10 business days the refund has not appeared in your account, contact your card issuer first, then email us with the Paystack refund reference.`,
  },
  {
    n: '05',
    title: 'Pricing & charges',
    body: `Our standard verification report costs ₦2,500 NGN. This price includes:

• All six automated checks (satellite, gazette, flood, litigation, LUC, fraud zone)
• Full PDF report download (re-downloadable indefinitely)
• Email delivery of the report with permanent re-download link
• Email support for questions about the report

There are no recurring charges. LagosLandCheck does not store payment information — all payment processing is handled by Paystack. If you see unexpected recurring charges, this is not from us; check your statement for the original merchant and contact Paystack support immediately.`,
  },
  {
    n: '06',
    title: 'Disputes & chargebacks',
    body: `If you believe you have been incorrectly charged, please email us before initiating a Paystack chargeback. Direct communication is faster (24h response) and avoids the formal dispute process.

If you proceed directly to chargeback without contacting us first, we reserve the right to:
• Provide Paystack with full transaction logs, IP records, report delivery confirmation, and email proof of report receipt
• Decline future service from the email address and payment method involved

We have never lost a chargeback dispute because every report is delivered with timestamped proof. Please email support@lagoslandcheck.com first — we will resolve genuine issues fairly.`,
  },
  {
    n: '07',
    title: 'Liability limitation',
    body: `LagosLandCheck provides pre-screening intelligence based on publicly available databases and satellite analysis. We do not guarantee the accuracy or completeness of underlying public data sources (Lagos State Gazette, LASIMRA, court cause lists, etc.).

Our reports explicitly state that they do not constitute legal advice and do not replace a physical Land Registry title search by a licensed Nigerian property lawyer.

By using LagosLandCheck, you acknowledge that:
• You will not rely solely on our reports for purchase decisions
• You will engage a qualified property lawyer before completing any land transaction
• Our maximum liability for any single transaction is the amount paid for that report (₦2,500)
• We are not liable for losses arising from your decision to purchase land based on our reports`,
  },
]

export default function RefundPolicyPage() {
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
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 1.25rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 3 L38 9 L38 26 C38 35 22 42 22 42 C22 42 6 35 6 26 L6 9 Z"
              fill="rgba(207,175,110,0.1)" stroke="#CFAF6E" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M13 22 L19.5 29 L31 16"
              stroke="#CFAF6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>LagosLandCheck</div>
            <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#CFAF6E', letterSpacing: '2px', marginTop: 1 }}>VERIFICATION INTELLIGENCE</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="/contact" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Contact</a>
          <a href="/agent" style={{ padding: '7px 14px', background: 'rgba(207,175,110,0.15)', border: '1px solid rgba(207,175,110,0.3)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#CFAF6E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            Run a check
          </a>
        </div>
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
            ─── LEGAL · REFUND POLICY
          </div>
          <h1 style={{
            fontFamily: "'Lora',serif",
            fontSize: 'clamp(28px,5vw,42px)',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: 14,
          }}>
            Refund Policy
          </h1>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65,
            maxWidth: 580,
          }}>
            Effective from launch. Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            maxWidth: 580,
            marginTop: 8,
            fontFamily: 'Menlo,Consolas,monospace',
          }}>
            Applies to all transactions on lagoslandcheck.com
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
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 14 }}>
            LagosLandCheck is committed to fair dealing. We understand that paying for a verification report — even at ₦2,500 — represents trust placed in our service, and that trust deserves a clear, fair refund policy.
          </p>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>
            This policy explains <strong>when refunds are available, when they are not, and how to request one</strong>. For any question not covered here, email <a href="mailto:support@lagoslandcheck.com" style={{ color: '#07382C', fontWeight: 600 }}>support@lagoslandcheck.com</a> and we will respond within 24 hours.
          </p>
        </div>

        {SECTIONS.map(section => (
          <div key={section.n} className="appear" style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            padding: '28px 32px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
              <div style={{
                fontFamily: 'Menlo,Consolas,monospace',
                fontSize: 11,
                fontWeight: 700,
                color: '#CFAF6E',
                letterSpacing: '1.5px',
                padding: '4px 10px',
                background: '#FDF6E3',
                borderRadius: 4,
                flexShrink: 0,
              }}>{section.n}</div>
              <h2 style={{
                fontFamily: "'Lora',serif",
                fontSize: 21,
                fontWeight: 600,
                color: '#1A2332',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}>{section.title}</h2>
            </div>
            <div style={{
              fontSize: 13.5,
              color: '#374151',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
              paddingLeft: 4,
            }}>{section.body}</div>
          </div>
        ))}

        <div className="appear" style={{
          background: '#07382C',
          color: '#fff',
          borderRadius: 12,
          padding: '28px 32px',
          marginTop: 24,
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)',
          }} />
          <div style={{
            fontFamily: 'Menlo,Consolas,monospace',
            fontSize: 10,
            color: '#CFAF6E',
            letterSpacing: '2px',
            marginBottom: 8,
            fontWeight: 700,
          }}>NEED HELP?</div>
          <h3 style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, marginBottom: 10 }}>
            Have a refund question?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 18, maxWidth: 480 }}>
            Email us with your Paystack and report reference numbers. We respond within 24 hours, Monday to Saturday WAT.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="mailto:support@lagoslandcheck.com?subject=Refund%20request" style={{
              display: 'inline-block',
              padding: '11px 22px',
              background: '#CFAF6E',
              color: '#07382C',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 8,
              textDecoration: 'none',
              letterSpacing: '0.2px',
            }}>Email support →</a>
            <Link href="/contact" style={{
              display: 'inline-block',
              padding: '11px 22px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: 'none',
            }}>Contact form</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
