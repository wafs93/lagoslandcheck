'use client'

import { useState } from 'react'
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
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '0.5px solid #e5e5e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <div style={{
            width: 32, height: 32, background: '#0F6E56', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>
            LagosLandCheck
          </span>
          <span style={{
            fontSize: 10, fontFamily: 'DM Mono', background: '#E1F5EE',
            color: '#0F6E56', padding: '2px 6px', borderRadius: 4, marginLeft: 2
          }}>BETA</span>
        </div>

        <h1 style={{
          fontFamily: 'Instrument Serif', fontSize: 28, lineHeight: 1.25,
          marginBottom: '0.5rem', color: '#111'
        }}>
          Verify Lagos land<br />
          before you <em style={{ fontStyle: 'italic', color: '#0F6E56' }}>lose a kobo.</em>
        </h1>

        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: '1rem' }}>
          6 automated checks — gazette acquisitions, flood risk, fraud zones,
          litigation, LUC status, satellite imagery — delivered as a plain-English
          risk report in under 2 minutes.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Gazette DB', 'NIMET flood zones', 'Omo Onile alerts', 'Court records', 'LUC status', 'Satellite AI'].map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontFamily: 'DM Mono', padding: '4px 10px',
              borderRadius: 20, border: '0.5px solid #ccc', color: '#555'
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Input Panel */}
      <InputPanel onSubmit={handleSubmit} />

      {/* Disclaimer */}
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <p style={{
          fontSize: 11, color: '#999', lineHeight: 1.7,
          borderTop: '0.5px solid #eee', paddingTop: '1rem'
        }}>
          LagosLandCheck is a pre-screening intelligence tool. It does not replace a
          physical Land Registry search by a licensed lawyer. Use this report to identify
          red flags before committing money — not as final proof of title.
        </p>
      </div>
    </main>
  )
}
