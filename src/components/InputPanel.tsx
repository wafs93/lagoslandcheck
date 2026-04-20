'use client'

import { useState, useRef } from 'react'

interface Props {
  onSubmit: (lat: number, lng: number, photoUrl?: string) => void
}

const LAGOS_BOUNDS = { latMin: 6.0, latMax: 7.0, lngMin: 2.5, lngMax: 4.5 }

function isValidLagos(lat: number, lng: number): boolean {
  return lat >= LAGOS_BOUNDS.latMin && lat <= LAGOS_BOUNDS.latMax &&
         lng >= LAGOS_BOUNDS.lngMin && lng <= LAGOS_BOUNDS.lngMax
}

export default function InputPanel({ onSubmit }: Props) {
  const [tab, setTab] = useState<'photo' | 'gps' | 'coord'>('photo')
  const [coordInput, setCoordInput] = useState('')
  const [error, setError] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // --- GPS detect ---
  const handleGPS = () => {
    setError('')
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false)
        const { latitude: lat, longitude: lng } = pos.coords
        if (!isValidLagos(lat, lng)) {
          setError('Location detected outside Lagos. Please verify your coordinates.')
          return
        }
        onSubmit(lat, lng)
      },
      () => {
        setGpsLoading(false)
        setError('Could not detect location. Allow location access and try again.')
      }
    )
  }

  // --- Photo upload ---
  const handlePhoto = async (file: File) => {
    setError('')
    try {
      // Dynamic import so ExifReader only loads client-side
      const ExifReader = (await import('exifreader')).default
      const tags = await ExifReader.load(file)
      const lat = tags['GPSLatitude']?.description
      const lng = tags['GPSLongitude']?.description
      if (lat && lng) {
        const latNum = parseFloat(lat as string)
        const lngNum = parseFloat(lng as string)
        if (!isValidLagos(latNum, lngNum)) {
          setError('GPS coordinates in photo are outside Lagos.')
          return
        }
        onSubmit(latNum, lngNum)
      } else {
        setError('No GPS data found in photo. Try GPS detect or enter coordinates manually.')
      }
    } catch {
      setError('Could not read photo. Try another method.')
    }
  }

  // --- Coordinate parse ---
  const parseCoordinates = (input: string): [number, number] | null => {
    const clean = input.trim()
    // Decimal: 6.5957, 3.3381
    const decimal = clean.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/)
    if (decimal) return [parseFloat(decimal[1]), parseFloat(decimal[2])]
    // DMS: 6°35'44.5"N 3°20'17.2"E
    const dms = clean.match(/(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/)
    if (dms) {
      const lat = parseInt(dms[1]) + parseInt(dms[2]) / 60 + parseFloat(dms[3]) / 3600
      const lng = parseInt(dms[5]) + parseInt(dms[6]) / 60 + parseFloat(dms[7]) / 3600
      return [dms[4] === 'S' ? -lat : lat, dms[8] === 'W' ? -lng : lng]
    }
    return null
  }

  const handleCoordSubmit = async () => {
    setError('')
    const parsed = parseCoordinates(coordInput)
    if (parsed) {
      const [lat, lng] = parsed
      if (!isValidLagos(lat, lng)) {
        setError('Coordinates are outside Lagos bounds (lat 6–7, lng 2.5–4.5).')
        return
      }
      onSubmit(lat, lng)
      return
    }
    // If not parseable as coords, treat as address — geocode via API
    if (coordInput.length > 5) {
      try {
        const res = await fetch(`/api/geocode?address=${encodeURIComponent(coordInput + ', Lagos, Nigeria')}`)
        const data = await res.json()
        if (data.lat && data.lng) {
          if (!isValidLagos(data.lat, data.lng)) {
            setError('Address resolved outside Lagos.')
            return
          }
          onSubmit(data.lat, data.lng)
        } else {
          setError('Could not find this address. Try decimal coordinates instead.')
        }
      } catch {
        setError('Geocoding failed. Check your connection and try again.')
      }
    } else {
      setError('Enter coordinates or a full Lagos address.')
    }
  }

  const tabStyle = (t: string) => ({
    flex: 1, padding: '8px 4px',
    background: tab === t ? '#f3f3f0' : 'transparent',
    border: 'none',
    fontFamily: 'Syne, sans-serif',
    fontSize: 11, fontWeight: 500,
    color: tab === t ? '#111' : '#888',
    cursor: 'pointer',
    borderRight: '0.5px solid #e5e5e0',
  } as React.CSSProperties)

  return (
    <div style={{ padding: '1.25rem 1.5rem' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', border: '0.5px solid #ddd', borderRadius: 8, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <button style={tabStyle('photo')} onClick={() => setTab('photo')}>Photo upload</button>
        <button style={tabStyle('gps')} onClick={() => setTab('gps')}>GPS detect</button>
        <button style={{ ...tabStyle('coord'), borderRight: 'none' }} onClick={() => setTab('coord')}>Coordinates</button>
      </div>

      {/* Photo tab */}
      {tab === 'photo' && (
        <div>
          <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          <div onClick={() => fileRef.current?.click()} style={{
            border: '1.5px dashed #ccc', borderRadius: 12, padding: '2rem 1rem',
            textAlign: 'center', cursor: 'pointer', marginBottom: '1rem'
          }}>
            <div style={{
              width: 40, height: 40, background: '#E1F5EE', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Drop photo or tap to upload</div>
            <div style={{ fontSize: 12, color: '#888' }}>EXIF GPS extracted automatically · Works with photos taken on-site</div>
          </div>
          <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: '1rem' }}>
            Abroad? Ask your rep on the land to take a photo and WhatsApp it to you. Upload it here — GPS coordinates are extracted from the image metadata automatically.
          </p>
          <button onClick={() => fileRef.current?.click()} style={primaryBtn}>Choose photo →</button>
        </div>
      )}

      {/* GPS tab */}
      {tab === 'gps' && (
        <div>
          <button onClick={handleGPS} disabled={gpsLoading} style={{
            width: '100%', padding: 12, background: '#f3f3f0',
            border: '0.5px solid #ddd', borderRadius: 8,
            fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: '1rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            {gpsLoading ? 'Detecting…' : 'Detect my location'}
          </button>
          <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: '1rem' }}>
            Must be physically on the land. Accuracy: ±2–10m on mobile.<br/>
            Abroad? Share this page link with your rep — they tap the button and send you the result.
          </p>
          <button onClick={handleGPS} disabled={gpsLoading} style={primaryBtn}>
            {gpsLoading ? 'Detecting location…' : 'Detect & run verification →'}
          </button>
        </div>
      )}

      {/* Coordinates tab */}
      {tab === 'coord' && (
        <div>
          <input
            type="text"
            value={coordInput}
            onChange={e => setCoordInput(e.target.value)}
            placeholder="6.5957, 3.3381"
            style={{
              width: '100%', padding: '10px 12px',
              border: '0.5px solid #ddd', borderRadius: 8,
              fontFamily: 'DM Mono, monospace', fontSize: 13,
              marginBottom: '0.75rem', outline: 'none'
            }}
          />
          <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#aaa', lineHeight: 1.9, marginBottom: '1rem' }}>
            Accepts: 6.5957, 3.3381<br/>
            6°35'44"N 3°20'17"E<br/>
            Plot 14 Admiralty Way, Lekki Phase 1
          </div>
          <button onClick={handleCoordSubmit} style={primaryBtn}>Run verification →</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '1rem', padding: '10px 12px', background: '#FCEBEB',
          border: '0.5px solid #A32D2D', borderRadius: 8,
          fontSize: 12, color: '#791F1F', lineHeight: 1.6
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 13, background: '#0F6E56', border: 'none',
  borderRadius: 8, fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700,
  color: '#fff', cursor: 'pointer', letterSpacing: '0.3px'
}
