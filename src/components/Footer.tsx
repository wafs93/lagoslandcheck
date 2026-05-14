'use client'

/**
 * Site-wide footer for LagosLandCheck.
 * Imported by every page. Design matches the PDF dossier:
 * dark green base (#07382C) with gold accent stripe (#CFAF6E).
 */

import Link from 'next/link'
import React from 'react'

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/agent', label: 'Verify Land' },
  { href: '/contact', label: 'Contact' },
  { href: '/refund-policy', label: 'Refund Policy' },
]

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={accentStripeStyle} />
      <div style={containerStyle}>
        <div style={gridStyle}>
          <div>
            <div style={brandRowStyle}>
              <div style={brandGlyphStyle}>L</div>
              <div>
                <div style={brandTextStyle}>LagosLandCheck</div>
                <div style={brandSubStyle}>VERIFICATION INTELLIGENCE</div>
              </div>
            </div>
            <p style={brandDescStyle}>
              Pre-screening intelligence for Lagos land buyers. Six automated checks · Real-time satellite analysis · Lawyer-ready dossier.
            </p>
          </div>

          <div>
            <div style={sectionLabelStyle}>NAVIGATE</div>
            <ul style={listStyle}>
              {FOOTER_LINKS.map(link => (
                <li key={link.href} style={{ marginBottom: 9 }}>
                  <Link href={link.href} style={linkStyle}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={sectionLabelStyle}>SUPPORT</div>
            <a href="mailto:support@lagoslandcheck.com" style={emailLinkStyle}>
              support@lagoslandcheck.com
            </a>
            <div style={supportMetaStyle}>
              Replies within 24h<br />
              Monday–Saturday · WAT
            </div>
          </div>

          <div>
            <div style={sectionLabelStyle}>METHODOLOGY</div>
            <div style={methodologyStyle}>
              Lagos State Gazette · LASIMRA flood maps · State Judiciary cause lists · LASEPA fraud zone records · GPT-4o satellite analysis
            </div>
          </div>
        </div>

        <div style={bottomStripStyle}>
          <div style={copyStyle}>
            © {new Date().getFullYear()} LagosLandCheck · Pre-screening intelligence · Not legal advice
          </div>
          <div style={copyStyle}>Made in Lagos</div>
        </div>
      </div>
    </footer>
  )
}

const footerStyle: React.CSSProperties = {
  background: '#07382C',
  color: '#fff',
  marginTop: 60,
  borderTop: '3px solid #CFAF6E',
  position: 'relative',
}

const accentStripeStyle: React.CSSProperties = {
  position: 'absolute',
  top: -3,
  left: 0,
  right: 0,
  height: 3,
  background: 'linear-gradient(90deg,#CFAF6E 0%,#CFAF6E 30%,transparent 30%,transparent 70%,#CFAF6E 70%)',
  pointerEvents: 'none',
}

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '40px 24px 24px',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 32,
  marginBottom: 32,
}

const brandRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 10,
}

const brandGlyphStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: '1.5px solid #CFAF6E',
  borderRadius: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Menlo, Consolas, monospace',
  fontWeight: 700,
  color: '#CFAF6E',
  fontSize: 14,
}

const brandTextStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: '-0.2px',
}

const brandSubStyle: React.CSSProperties = {
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: 9,
  color: '#CFAF6E',
  letterSpacing: '1.8px',
  marginTop: 1,
  fontWeight: 600,
}

const brandDescStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.55)',
  lineHeight: 1.7,
  marginTop: 12,
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontFamily: 'Menlo, Consolas, monospace',
  color: '#CFAF6E',
  letterSpacing: '2px',
  marginBottom: 14,
  fontWeight: 700,
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  fontSize: 13,
  transition: 'color 0.15s',
}

const emailLinkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  display: 'block',
  marginBottom: 6,
}

const supportMetaStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.5)',
  fontFamily: 'Menlo, Consolas, monospace',
  lineHeight: 1.7,
}

const methodologyStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.65)',
  lineHeight: 1.7,
}

const bottomStripStyle: React.CSSProperties = {
  paddingTop: 22,
  borderTop: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 16,
}

const copyStyle: React.CSSProperties = {
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: 10,
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: '1px',
}
