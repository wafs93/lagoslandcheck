/**
 * Pure verification functions. No HTTP layer. Callable directly from any
 * server context (route handlers, server actions, etc).
 *
 * This file replaces the in-route logic that used self-fetch over HTTP,
 * which was unreliable on Vercel due to cold-start timeouts.
 */

import OpenAI from 'openai'
import { supabaseAdmin } from './supabase'
import { CheckResult } from './types'

// Helper: format a structured error log so failures are visible in Vercel logs
function logErr(check: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined
  console.error(`[CHECK_FAIL] ${check} :: ${msg}`, stack ? `\n${stack}` : '')
}

// ─── CHECK 1: Satellite imagery via GPT-4o Vision ────────────────────────────
export async function checkSatellite(lat: number, lng: number): Promise<CheckResult & { land_type?: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set')
    if (!process.env.GOOGLE_MAPS_API_KEY) throw new Error('GOOGLE_MAPS_API_KEY not set')

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=hybrid&key=${process.env.GOOGLE_MAPS_API_KEY}`

    const imgRes = await fetch(mapUrl, { signal: AbortSignal.timeout(8000) })
    if (!imgRes.ok) throw new Error(`Maps Static API ${imgRes.status}`)

    const contentType = imgRes.headers.get('content-type') || 'image/png'
    if (!contentType.includes('image')) {
      throw new Error('Maps API returned non-image — check billing/key')
    }

    const imgBuffer = await imgRes.arrayBuffer()
    const base64 = Buffer.from(imgBuffer).toString('base64')
    const dataUrl = `data:${contentType};base64,${base64}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          {
            type: 'text',
            text: `Analyse this satellite image of a location in Lagos, Nigeria at coordinates ${lat}, ${lng}.

Answer precisely:
1. Is this VACANT/EMPTY land OR is there a BUILDING/STRUCTURE already on it?
2. If building exists: what type? (bungalow, 2-storey house, commercial building, uncompleted structure, compound with fence)
3. Any water body, swamp or drainage channel visible within 100m?
4. What is the land cover? (rooftop, sandy soil, vegetation, concrete/paved)
5. Is there visible road access to this location?

This is critical for land fraud prevention in Nigeria — be very precise about buildings.

Respond ONLY with valid JSON no markdown:
{"status":"clear|caution|critical","land_type":"vacant_land|has_building|unclear","structure_description":"describe building or null","summary":"One sentence starting with what this location IS","details":"2-3 sentences covering all findings"}`
          }
        ]
      }]
    })

    const text = response.choices[0].message.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in GPT-4o response')

    const parsed = JSON.parse(jsonMatch[0])
    let summary = parsed.summary || ''
    if (parsed.land_type === 'has_building') {
      summary = `Building detected — ${parsed.structure_description || 'existing structure visible on this parcel'}. This is NOT vacant land.`
    } else if (parsed.land_type === 'vacant_land') {
      summary = `Vacant land confirmed. ${parsed.summary}`
    }

    return {
      id: 'satellite',
      name: 'Satellite imagery',
      status: parsed.status,
      summary,
      details: parsed.details,
      land_type: parsed.land_type,
    }
  } catch (err) {
    logErr('satellite', err)
    return {
      id: 'satellite',
      name: 'Satellite imagery',
      status: 'caution',
      summary: 'Satellite analysis unavailable.',
      details: `Could not retrieve or analyse satellite imagery. Verify land type physically before payment. (${err instanceof Error ? err.message : 'unknown'})`,
    }
  }
}

// ─── CHECK 2: Gazette & government acquisition ───────────────────────────────
export async function checkGazette(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_gazette_acquisition', {
      p_lat: lat, p_lng: lng, p_radius_metres: 500,
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'gazette',
        name: 'Gazette & govt acquisition',
        status: 'clear',
        summary: 'No government acquisition found within 500m.',
        details: 'No Lagos State Gazette records match this coordinate within a 500m radius. This does not eliminate the possibility of ungazetted acquisitions — confirm with a lawyer.',
      }
    }
    const nearest = data[0]
    const isCritical = nearest.distance_metres < 100
    return {
      id: 'gazette',
      name: 'Gazette & govt acquisition',
      status: isCritical ? 'critical' : 'caution',
      summary: `Gazette acquisition detected ${Math.round(nearest.distance_metres)}m from this coordinate.`,
      details: `Lagos State Gazette ${nearest.gazette_ref} (${nearest.gazette_year}) records an acquisition in this area for: ${nearest.purpose}. The recorded boundary falls ${Math.round(nearest.distance_metres)}m from your coordinate. Verify exact survey plan against gazette description before any payment.`,
    }
  } catch (err) {
    logErr('gazette', err)
    return {
      id: 'gazette',
      name: 'Gazette & govt acquisition',
      status: 'caution',
      summary: 'Gazette database temporarily unavailable.',
      details: `Could not query the gazette database (${err instanceof Error ? err.message : 'unknown'}). This check must be completed manually with a lawyer.`,
    }
  }
}

// ─── CHECK 3: Flood & drainage risk ──────────────────────────────────────────
export async function checkFlood(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_flood_risk', { p_lat: lat, p_lng: lng })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'flood',
        name: 'Flood & drainage risk',
        status: 'clear',
        summary: 'No flood risk zone detected.',
        details: 'Coordinate does not fall within a mapped flood risk polygon. Standard precautions apply during peak rainy season (June-October).',
      }
    }
    const zone = data[0]
    const statusMap: Record<string, 'clear' | 'caution' | 'critical'> = {
      low: 'clear', moderate: 'caution', high: 'critical', unbuildable: 'critical',
    }
    return {
      id: 'flood',
      name: 'Flood & drainage risk',
      status: statusMap[zone.risk_level] || 'caution',
      summary: `${zone.risk_level.charAt(0).toUpperCase() + zone.risk_level.slice(1)} flood risk zone.`,
      details: zone.risk_level === 'unbuildable'
        ? 'This coordinate falls within an area classified as unbuildable due to flood risk. Building here may violate Lagos State planning regulations.'
        : `NIMET flood assessment classifies this area as ${zone.risk_level} risk. ${zone.drainage_note || 'Confirm drainage conditions with LASIMRA before purchasing.'}`,
    }
  } catch (err) {
    logErr('flood', err)
    return {
      id: 'flood',
      name: 'Flood & drainage risk',
      status: 'caution',
      summary: 'Flood risk data temporarily unavailable.',
      details: `Could not query flood risk database (${err instanceof Error ? err.message : 'unknown'}). Verify manually with LASIMRA or NIMET flood maps.`,
    }
  }
}

// ─── CHECK 4: Court litigation ────────────────────────────────────────────────
export async function checkLitigation(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_litigation', {
      p_lat: lat, p_lng: lng, p_radius_metres: 300,
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'litigation',
        name: 'Court litigation search',
        status: 'clear',
        summary: 'No active cases found in published cause lists.',
        details: 'No cases matching this location were found in Lagos State Judiciary published cause lists. Note: this is not a complete court search. Instruct a lawyer to search at Lagos High Court registries.',
      }
    }
    return {
      id: 'litigation',
      name: 'Court litigation search',
      status: 'caution',
      summary: `${data.length} potential case match(es) found.`,
      details: `${data.length} case(s) found in Lagos State Judiciary records that may relate to this area: ${data[0].case_title}. This requires a full court search by a qualified solicitor.`,
    }
  } catch (err) {
    logErr('litigation', err)
    return {
      id: 'litigation',
      name: 'Court litigation search',
      status: 'caution',
      summary: 'Court records search unavailable.',
      details: `Could not query court records database (${err instanceof Error ? err.message : 'unknown'}). A lawyer must conduct a full court search.`,
    }
  }
}

// ─── CHECK 5: Land Use Charge ─────────────────────────────────────────────────
export async function checkLUC(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_luc_status', { p_lat: lat, p_lng: lng })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'luc',
        name: 'Land Use Charge status',
        status: 'caution',
        summary: 'No LUC record found for this property.',
        details: 'No Land Use Charge record found for this property. Any land without an LUC record since 2018 is an amber flag. Request LUC clearance from the seller before exchanging contracts.',
      }
    }
    const record = data[0]
    const currentYear = new Date().getFullYear()
    const gap = currentYear - record.last_payment_year
    if (gap <= 1) {
      return {
        id: 'luc',
        name: 'Land Use Charge status',
        status: 'clear',
        summary: `LUC current. Last payment: ${record.last_payment_year}.`,
        details: `Land Use Charge records show consistent payment. Last confirmed payment year: ${record.last_payment_year}.`,
      }
    }
    return {
      id: 'luc',
      name: 'Land Use Charge status',
      status: 'caution',
      summary: `LUC payment gap detected: ${gap} years outstanding.`,
      details: `LUC records found but last payment was ${record.last_payment_year} — a ${gap}-year gap. Outstanding LUC is a charge on the land and must be settled before title can transfer cleanly.`,
    }
  } catch (err) {
    logErr('luc', err)
    return {
      id: 'luc',
      name: 'Land Use Charge status',
      status: 'caution',
      summary: 'LUC portal temporarily unavailable.',
      details: `Could not retrieve Land Use Charge records (${err instanceof Error ? err.message : 'unknown'}). Verify directly at landusecharge.lagosstate.gov.ng`,
    }
  }
}

// ─── CHECK 6: Fraud zone & Omo Onile ─────────────────────────────────────────
export async function checkFraud(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_fraud_zones', {
      p_lat: lat, p_lng: lng, p_radius_metres: 500,
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'fraud',
        name: 'Fraud zone & Omo Onile alert',
        status: 'clear',
        summary: 'No fraud zone flags within 500m.',
        details: 'No active fraud zone flags or known Omo Onile dispute areas within 500m. Continue with standard due diligence.',
      }
    }
    const flag = data[0]
    const isCritical = flag.severity === 'high'
    return {
      id: 'fraud',
      name: 'Fraud zone & Omo Onile alert',
      status: isCritical ? 'critical' : 'caution',
      summary: `${flag.flag_type === 'omo_onile' ? 'Known Omo Onile area' : 'Active fraud zone'} within ${Math.round(flag.distance_metres)}m.`,
      details: `${flag.description} Exercise extreme caution. Engage a lawyer with specific experience in Lagos land disputes before any engagement with sellers.`,
    }
  } catch (err) {
    logErr('fraud', err)
    return {
      id: 'fraud',
      name: 'Fraud zone & Omo Onile alert',
      status: 'caution',
      summary: 'Fraud zone database temporarily unavailable.',
      details: `Could not query fraud zone database (${err instanceof Error ? err.message : 'unknown'}). Verify with local estate agents familiar with the area.`,
    }
  }
}

// ─── ORCHESTRATOR ────────────────────────────────────────────────────────────
export interface RunChecksResult {
  overall: 'CLEAR' | 'CAUTION' | 'CRITICAL'
  checks: CheckResult[]
  reportId: string
  generatedAt: string
  coordinate: { lat: number; lng: number }
}

export async function runAllChecks(lat: number, lng: number): Promise<RunChecksResult> {
  const results = await Promise.allSettled([
    checkSatellite(lat, lng),
    checkGazette(lat, lng),
    checkFlood(lat, lng),
    checkLitigation(lat, lng),
    checkLUC(lat, lng),
    checkFraud(lat, lng),
  ])

  const checkIds = ['satellite', 'gazette', 'flood', 'litigation', 'luc', 'fraud']
  const checkNames = ['Satellite imagery', 'Gazette & govt acquisition', 'Flood & drainage risk', 'Court litigation search', 'Land Use Charge status', 'Fraud zone & Omo Onile alert']

  const checks: CheckResult[] = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : {
      id: checkIds[i],
      name: checkNames[i],
      status: 'caution' as const,
      summary: 'Check failed unexpectedly.',
      details: r.status === 'rejected' ? `Error: ${String(r.reason)}` : 'Unknown error.',
    }
  )

  const hasCritical = checks.some(c => c.status === 'critical')
  const hasCaution = checks.some(c => c.status === 'caution')
  const overall = hasCritical ? 'CRITICAL' : hasCaution ? 'CAUTION' : 'CLEAR'

  return {
    overall,
    checks,
    reportId: `LLC-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    coordinate: { lat, lng },
  }
}
