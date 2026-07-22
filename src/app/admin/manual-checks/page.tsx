'use client'

import { FormEvent, useState } from 'react'

interface ManualCheckItem {
  id: string
  created_at: string
  lat: number
  lng: number
  location_label: string | null
  owner_name: string | null
  request_tier: 'instant' | 'verified'
  manual_status: 'not_required' | 'pending' | 'completed'
}

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ManualChecksAdminPage() {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ManualCheckItem[]>([])

  const [completedBy, setCompletedBy] = useState<Record<string, string>>({})
  const [courtById, setCourtById] = useState<Record<string, string>>({})
  const [lucById, setLucById] = useState<Record<string, string>>({})
  const [actionErrorById, setActionErrorById] = useState<Record<string, string>>({})
  const [savingById, setSavingById] = useState<Record<string, boolean>>({})

  const loadPending = async (adminPassword: string) => {
    setLoading(true)
    setUnlockError('')
    try {
      const res = await fetch('/api/admin/manual-checks', {
        method: 'GET',
        headers: { 'x-admin-password': adminPassword },
      })
      const data = await res.json()
      if (!res.ok) {
        setUnlockError(data?.error || 'Could not load queue')
        setIsUnlocked(false)
        return
      }
      setItems(Array.isArray(data?.items) ? data.items : [])
      setIsUnlocked(true)
    } catch {
      setUnlockError('Network error while loading queue')
      setIsUnlocked(false)
    } finally {
      setLoading(false)
    }
  }

  const onUnlock = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    await loadPending(password)
  }

  const markComplete = async (id: string) => {
    const manualCourtFinding = (courtById[id] || '').trim()
    const manualLucFinding = (lucById[id] || '').trim()
    const reviewer = (completedBy[id] || '').trim()

    if (!manualCourtFinding && !manualLucFinding) {
      setActionErrorById(prev => ({ ...prev, [id]: 'Enter court and/or LUC finding before completing.' }))
      return
    }

    setSavingById(prev => ({ ...prev, [id]: true }))
    setActionErrorById(prev => ({ ...prev, [id]: '' }))
    try {
      const res = await fetch('/api/admin/manual-checks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          reportId: id,
          manualCourtFinding,
          manualLucFinding,
          completedBy: reviewer,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setActionErrorById(prev => ({ ...prev, [id]: data?.error || 'Could not complete manual check' }))
        return
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch {
      setActionErrorById(prev => ({ ...prev, [id]: 'Network error while saving manual findings' }))
    } finally {
      setSavingById(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', padding: '24px 16px', fontFamily: "'Syne',sans-serif" }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#07382C', fontWeight: 800 }}>Manual Verification Queue</h1>
        <p style={{ marginTop: 8, color: '#4B5563', fontSize: 14 }}>
          Verified-tier requests pending manual court and LUC review.
        </p>

        {!isUnlocked ? (
          <form onSubmit={onUnlock} style={{ marginTop: 20, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16 }}>
            <label htmlFor="admin-password" style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 8 }}>
              Admin password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter ADMIN_PASSWORD"
              style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
            />
            {unlockError && <p style={{ marginTop: 10, color: '#B91C1C', fontSize: 13 }}>{unlockError}</p>}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              style={{
                marginTop: 12,
                background: '#07382C',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Checking...' : 'Unlock Queue'}
            </button>
          </form>
        ) : (
          <>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#4B5563', fontSize: 13 }}>
                Pending requests: {items.length}
              </p>
              <button
                onClick={() => loadPending(password)}
                disabled={loading}
                style={{ background: '#fff', border: '1px solid #D1D5DB', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {items.length === 0 ? (
              <div style={{ marginTop: 16, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, color: '#374151' }}>
                No pending verified-tier requests.
              </div>
            ) : (
              <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
                {items.map(item => (
                  <section key={item.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Requested: {formatDate(item.created_at)}</div>
                      <div style={{ fontSize: 14, color: '#111827' }}>
                        <strong>Address:</strong> {item.location_label || 'No location label provided'}
                      </div>
                      <div style={{ fontSize: 14, color: '#111827' }}>
                        <strong>Owner Name:</strong> {item.owner_name || 'Not provided'}
                      </div>
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        <strong>Coordinates:</strong> {Number(item.lat).toFixed(6)}, {Number(item.lng).toFixed(6)}
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                      <input
                        type="text"
                        value={completedBy[item.id] || ''}
                        onChange={e => setCompletedBy(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Reviewed by (optional)"
                        style={{ border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
                      />
                      <textarea
                        value={courtById[item.id] || ''}
                        onChange={e => setCourtById(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Court finding"
                        rows={3}
                        style={{ border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px', fontSize: 14, resize: 'vertical' }}
                      />
                      <textarea
                        value={lucById[item.id] || ''}
                        onChange={e => setLucById(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="LUC finding"
                        rows={3}
                        style={{ border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px', fontSize: 14, resize: 'vertical' }}
                      />
                      {actionErrorById[item.id] && (
                        <p style={{ margin: 0, color: '#B91C1C', fontSize: 13 }}>{actionErrorById[item.id]}</p>
                      )}
                      <button
                        onClick={() => markComplete(item.id)}
                        disabled={!!savingById[item.id]}
                        style={{
                          background: '#CFAF6E',
                          color: '#111827',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 14px',
                          fontWeight: 700,
                          cursor: savingById[item.id] ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {savingById[item.id] ? 'Saving...' : 'Mark Complete'}
                      </button>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}