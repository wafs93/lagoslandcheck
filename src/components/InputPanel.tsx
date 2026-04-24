'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onSubmit: (lat: number, lng: number) => void
}

declare global {
  interface Window { google: any; initMaps: () => void }
}

const isLagos = (lat: number, lng: number) =>
  lat >= 6.0 && lat <= 7.0 && lng >= 2.5 && lng <= 4.5

export default function InputPanel({ onSubmit }: Props) {
  const [searchVal, setSearchVal] = useState('')
  const [place, setPlace] = useState<{lat:number;lng:number;name:string}|null>(null)
  const [gpsState, setGpsState] = useState<'idle'|'loading'>('idle')
  const [searchState, setSearchState] = useState<'idle'|'loading'>('idle')
  const [error, setError] = useState('')
  const [mapsReady, setMapsReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) return
    if ((window as any).google?.maps?.places) { setMapsReady(true); return }
    ;(window as any).initMaps = () => setMapsReady(true)
    if (document.querySelector('script[data-maps]')) return
    const s = document.createElement('script')
    s.setAttribute('data-maps', '1')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initMaps`
    s.async = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!mapsReady || !inputRef.current || acRef.current) return
    try {
      acRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        bounds: new (window as any).google.maps.LatLngBounds(
          new (window as any).google.maps.LatLng(6.0, 2.5),
          new (window as any).google.maps.LatLng(7.0, 4.5)
        ),
        componentRestrictions: { country: 'ng' },
        fields: ['geometry','formatted_address','name'],
      })
      acRef.current.addListener('place_changed', () => {
        const p = acRef.current.getPlace()
        if (!p?.geometry?.location) return
        const lat = p.geometry.location.lat()
        const lng = p.geometry.location.lng()
        if (!isLagos(lat, lng)) { setError('Location outside Lagos.'); return }
        const name = p.formatted_address || p.name || ''
        setPlace({ lat, lng, name })
        setSearchVal(name)
        setError('')
      })
    } catch(e) { console.error('Autocomplete error:', e) }
  }, [mapsReady])

  // Fallback: server-side geocoding if Places autocomplete didn't fire
  const handleServerGeocode = async () => {
    if (!searchVal.trim() || place) return
    setSearchState('loading')
    setError('')
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(searchVal + ', Lagos, Nigeria')}`)
      const data = await res.json()
      if (data.lat && data.lng) {
        if (!isLagos(data.lat, data.lng)) {
          setError('This address is outside Lagos.')
          setSearchState('idle')
          return
        }
        setPlace({ lat: data.lat, lng: data.lng, name: data.formatted || searchVal })
        setError('')
      } else {
        setError('Address not found. Try a more specific address or paste a Google Maps link.')
      }
    } catch {
      setError('Search failed. Check your connection and try again.')
    }
    setSearchState('idle')
  }

  const handleGPS = () => {
    setError(''); setGpsState('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setGpsState('idle')
        if (!isLagos(lat, lng)) { setError('Location outside Lagos.'); return }
        onSubmit(lat, lng)
      },
      () => { setError('Could not get GPS. Allow location access and try again.'); setGpsState('idle') },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handlePhoto = async (file: File) => {
    setError('')
    try {
      const ExifReader = (await import('exifreader')).default
      const tags = await ExifReader.load(file)
      const lat = parseFloat(tags['GPSLatitude']?.description as string)
      const lng = parseFloat(tags['GPSLongitude']?.description as string)
      if (!lat || !lng) { setError('No GPS in photo. WhatsApp removes GPS — use address search instead.'); return }
      if (!isLagos(lat, lng)) { setError('Photo GPS is outside Lagos.'); return }
      onSubmit(lat, lng)
    } catch { setError('Could not read photo. Use address search instead.') }
  }

  const handleSubmit = () => {
    if (place) { onSubmit(place.lat, place.lng); return }
    if (searchVal.trim()) { handleServerGeocode(); return }
    setError('Please enter an address first.')
  }

  return (
    <div style={{ padding: '1rem 1.75rem 1.25rem' }}>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', zIndex:1 }}>
          {searchState === 'loading'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          }
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchVal}
          onChange={e => { setSearchVal(e.target.value); setPlace(null); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Search: Lekki Phase 1, Chevron Drive, Thomas Estate Ajah..."
          autoComplete="off"
          style={{
            width: '100%', padding: '13px 40px 13px 40px',
            border: place ? '1.5px solid #0F6E56' : '1.5px solid #e0e0d8',
            borderRadius: 12, fontSize: 14, fontFamily: 'Syne, sans-serif',
            outline: 'none', background: '#fff', color: '#111',
            transition: 'border-color 0.2s', display: 'block',
          }}
        />
        {place && (
          <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        )}
      </div>

      {/* Selected place */}
      {place && (
        <div style={{ padding:'8px 12px', background:'#E1F5EE', borderRadius:9, display:'flex', alignItems:'center', gap:8, marginBottom:10, border:'0.5px solid #9FE1CB' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#0F6E56" style={{flexShrink:0}}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span style={{ fontSize:11, color:'#0F6E56', fontFamily:'DM Mono,monospace', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{place.name}</span>
          <span style={{ fontSize:10, color:'#5DCAA5', fontFamily:'DM Mono,monospace', whiteSpace:'nowrap', flexShrink:0 }}>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
        </div>
      )}

      {/* Run button */}
      <button onClick={handleSubmit} disabled={searchState === 'loading'}
        style={{
          width: '100%', padding: '14px 0',
          background: searchVal.trim() ? '#0F6E56' : '#d4d4cc',
          border: 'none', borderRadius: 11,
          fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700,
          color: '#fff', cursor: searchVal.trim() ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s', marginBottom: 10,
        }}
      >
        {searchState === 'loading' ? 'Finding location...' : place ? 'Run all 6 checks →' : 'Search & verify →'}
      </button>

      {/* Secondary buttons */}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={handleGPS} disabled={gpsState==='loading'} style={{
          flex:1, padding:'9px 6px', background:'#f5f5f0',
          border:'0.5px solid #e0e0d8', borderRadius:9,
          fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:500,
          color:'#555', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
          </svg>
          {gpsState==='loading' ? 'Detecting...' : 'Use GPS'}
        </button>
        <button onClick={() => fileRef.current?.click()} style={{
          flex:1, padding:'9px 6px', background:'#f5f5f0',
          border:'0.5px solid #e0e0d8', borderRadius:9,
          fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:500,
          color:'#555', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Photo GPS
        </button>
        <button onClick={() => { if(place) onSubmit(place.lat, place.lng) }} 
          disabled={!place}
          style={{
            flex:1, padding:'9px 6px', 
            background: place ? '#0F6E56' : '#f5f5f0',
            border: place ? 'none' : '0.5px solid #e0e0d8',
            borderRadius:9,
            fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:500,
            color: place ? '#fff' : '#aaa', cursor: place ? 'pointer' : 'not-allowed',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Verify
        </button>
      </div>

      <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}}
        onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])}/>

      <p style={{ fontSize:10, color:'#bbb', lineHeight:1.65, marginTop:8, fontFamily:'DM Mono,monospace' }}>
        Tip: Type any Lagos address and press Enter, or paste a Google Maps link in the AI Agent
      </p>

      {error && (
        <div style={{ marginTop:8, padding:'9px 12px', background:'#FEF2F2', border:'0.5px solid #FCA5A5', borderRadius:8, fontSize:12, color:'#B91C1C', lineHeight:1.6 }}>
          {error}
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
