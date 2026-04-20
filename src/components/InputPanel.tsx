'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onSubmit: (lat: number, lng: number, photoUrl?: string) => void
}

const LAGOS_CENTER = { lat: 6.5244, lng: 3.3792 }

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export default function InputPanel({ onSubmit }: Props) {
  const [mode, setMode] = useState<'search' | 'gps' | 'photo'>('search')
  const [searchVal, setSearchVal] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mapsReady, setMapsReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const LAGOS_BOUNDS = { latMin: 6.0, latMax: 7.0, lngMin: 2.5, lngMax: 4.5 }
  const isValidLagos = (lat: number, lng: number) =>
    lat >= LAGOS_BOUNDS.latMin && lat <= LAGOS_BOUNDS.latMax &&
    lng >= LAGOS_BOUNDS.lngMin && lng <= LAGOS_BOUNDS.lngMax

  // Load Google Maps Places API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || typeof window === 'undefined') return

    window.initGoogleMaps = () => {
      setMapsReady(true)
    }

    if (window.google?.maps?.places) {
      setMapsReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Init autocomplete once Maps is ready and input is in DOM
  useEffect(() => {
    if (!mapsReady || !inputRef.current || mode !== 'search') return
    if (autocompleteRef.current) return

    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(6.0, 2.5),
      new window.google.maps.LatLng(7.0, 4.5)
    )

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      bounds,
      strictBounds: false,
      componentRestrictions: { country: 'ng' },
      fields: ['geometry', 'formatted_address', 'name'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      if (!place?.geometry?.location) return
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setSelectedPlace({ lat, lng, name: place.formatted_address || place.name })
      setSearchVal(place.formatted_address || place.name || '')
      setError('')
    })
  }, [mapsReady, mode])

  const handleGPS = () => {
    setError('')
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false)
        const { latitude: lat, longitude: lng } = pos.coords
        if (!isValidLagos(lat, lng)) {
          setError('Location detected outside Lagos.')
          return
        }
        onSubmit(lat, lng)
      },
      () => {
        setGpsLoading(false)
        setError('Could not detect location. Allow location access and try again.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handlePhoto = async (file: File) => {
    setError('')
    try {
      const ExifReader = (await import('exifreader')).default
      const tags = await ExifReader.load(file)
      const lat = tags['GPSLatitude']?.description
      const lng = tags['GPSLongitude']?.description
      if (lat && lng) {
        const latNum = parseFloat(lat as string)
        const lngNum = parseFloat(lng as string)
        if (!isValidLagos(latNum, lngNum)) {
          setError('GPS in photo is outside Lagos. Use address search instead.')
          return
        }
        onSubmit(latNum, lngNum)
      } else {
        setError('No GPS data in this photo. Most WhatsApp photos lose GPS — use address search instead.')
      }
    } catch {
      setError('Could not read photo. Use address search instead.')
    }
  }

  const handleSubmit = () => {
    if (!selectedPlace) {
      setError('Please select a location from the dropdown suggestions.')
      return
    }
    if (!isValidLagos(selectedPlace.lat, selectedPlace.lng)) {
      setError('This location is outside Lagos. Please search for a Lagos address.')
      return
    }
    onSubmit(selectedPlace.lat, selectedPlace.lng)
  }

  return (
    <div style={{ padding: '1rem 1.5rem 1.25rem' }}>

      {/* PRIMARY: Address search */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); setSelectedPlace(null) }}
            placeholder="Search: Lekki Phase 1, Chevron Drive, Ajah..."
            style={{
              width: '100%', padding: '13px 12px 13px 38px',
              border: selectedPlace ? '1.5px solid #0F6E56' : '1.5px solid #ddd',
              borderRadius: 10, fontSize: 14,
              fontFamily: 'Syne, sans-serif',
              outline: 'none', transition: 'border-color 0.2s',
              background: '#fff',
            }}
          />
          {selectedPlace && (
            <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
          )}
        </div>

        {selectedPlace && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: '#E1F5EE', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#0F6E56">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span style={{ fontSize: 11, color: '#0F6E56', fontFamily: 'DM Mono, monospace', flex: 1 }}>{selectedPlace.name}</span>
          </div>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedPlace}
        style={{
          width: '100%', padding: 14,
          background: selectedPlace ? '#0F6E56' : '#ccc',
          border: 'none', borderRadius: 10,
          fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700,
          color: '#fff', cursor: selectedPlace ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s', marginBottom: '1rem',
        }}
      >
        {selectedPlace ? 'Run 6 checks →' : 'Search for a location above'}
      </button>

      {/* SECONDARY OPTIONS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: error ? '0.75rem' : 0 }}>
        <button
          onClick={handleGPS}
          disabled={gpsLoading}
          style={{
            flex: 1, padding: '10px 8px',
            background: '#f8f8f5', border: '0.5px solid #e0e0dc',
            borderRadius: 8, fontFamily: 'Syne, sans-serif',
            fontSize: 12, fontWeight: 500, color: '#555',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
          </svg>
          {gpsLoading ? 'Detecting…' : 'Use my GPS'}
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          style={{
            flex: 1, padding: '10px 8px',
            background: '#f8f8f5', border: '0.5px solid #e0e0dc',
            borderRadius: 8, fontFamily: 'Syne, sans-serif',
            fontSize: 12, fontWeight: 500, color: '#555',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
          Photo GPS
        </button>
      </div>

      <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />

      <p style={{ fontSize: 11, color: '#bbb', lineHeight: 1.6, marginTop: 8, fontFamily: 'DM Mono, monospace' }}>
        GPS & Photo work best when physically on the land. For diaspora: use address search.
      </p>

      {error && (
        <div style={{ marginTop: '0.75rem', padding: '10px 12px', background: '#FCEBEB', border: '0.5px solid #A32D2D', borderRadius: 8, fontSize: 12, color: '#791F1F', lineHeight: 1.6 }}>
          {error}
        </div>
      )}
    </div>
  )
}
