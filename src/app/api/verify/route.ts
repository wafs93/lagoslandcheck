export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CheckResult, VerifyResponse } from '@/lib/types'
import OpenAI from 'openai'

// ─── CHECK 1: Satellite imagery via GPT-4o Vision ────────────────────────────
async function checkSatellite(lat: number, lng: number): Promise<CheckResult> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Fetch the satellite image first to verify it's valid
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=satellite&key=${process.env.GOOGLE_MAPS_API_KEY}`

    // Convert to base64 so we don't rely on URL access from OpenAI servers
    const imgRes = await fetch(mapUrl)
    if (!imgRes.ok) throw new Error(`Maps API returned ${imgRes.status}`)

    const contentType = imgRes.headers.get('content-type') || 'image/png'

    // Check it's actually an image not an error page
    if (!contentType.includes('image')) {
      throw new Error('Maps API returned non-image response — check billing/API key')
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
          {
            type: 'image_url',
            image_url: { url: dataUrl }
          },
          {
            type: 'text',
            text: `You are analysing a satellite image of a location in Lagos, Nigeria at coordinates ${lat}, ${lng}.

Carefully examine this image and determine:

1. LAND TYPE: Is this VACANT/EMPTY land, or is there already a BUILDING or STRUCTURE on it?
2. STRUCTURE DETAIL: If a building exists, describe it (e.g. "residential bungalow", "2-storey house", "commercial building", "uncompleted structure")
3. WATER RISK: Any visible water body, swamp, marshy ground, or drainage channel within 100m?
4. LAND COVER: What do you see? (rooftop, concrete, sandy soil, vegetation, etc.)
5. ACCESS: Is there visible road access?

This is critical for land fraud prevention in Nigeria. Be very precise about whether a building exists.

Respond ONLY with valid JSON:
{"status":"clear|caution|critical","land_type":"vacant_land|has_building|unclear","structure_description":"description or null","summary":"One clear sentence","details":"2-3 sentences with all findings"}`
          }
        ]
      }]
    })

    const text = response.choices[0].message.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      let summary = parsed.summary || ''
      if (parsed.land_type === 'has_building') {
        summary = `⚠️ Building detected — ${parsed.structure_description || 'existing structure visible on this parcel'}. This is NOT vacant land.`
      } else if (parsed.land_type === 'vacant_land') {
        summary = `Vacant land confirmed. ${parsed.summary}`
      }
      return {
        id: 'satellite', name: 'Satellite imagery',
        status: parsed.status, summary, details: parsed.details
      }
    }
    throw new Error('Could not parse GPT-4o response')

  } catch (err) {
    console.error('Satellite check error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return {
      id: 'satellite', name: 'Satellite imagery', status: 'caution',
      summary: 'Satellite analysis unavailable.',
      details: `Satellite imagery could not be retrieved or analysed (${msg}). Verify land type physically before any payment.`
    }
  }
}

// ─── CHECK 2: Gazette & government acquisition ────────────────────────────────
async function checkGazette(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_gazette_acquisition', {
      p_lat: lat, p_lng: lng, p_radius_metres: 500
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'gazette', name: 'Gazette & govt acquisition', status: 'clear',
        summary: 'No government acquisition found within 500m.',
        details: 'No Lagos State Gazette records match this coordinate within a 500m radius. This does not eliminate the possibility of ungazetted acquisitions — confirm with a lawyer.'
      }
    }
    const nearest = data[0]
    const isCritical = nearest.distance_metres < 100
    return {
      id: 'gazette', name: 'Gazette & govt acquisition',
      status: isCritical ? 'critical' : 'caution',
      summary: `Gazette acquisition detected ${Math.round(nearest.distance_metres)}m from this coordinate.`,
      details: `Lagos State Gazette ${nearest.gazette_ref} (${nearest.gazette_year}) records an acquisition in this area for: ${nearest.purpose}. The recorded boundary falls ${Math.round(nearest.distance_metres)}m from your coordinate. Verify exact survey plan against gazette description before any payment.`
    }
  } catch (err) {
    console.error('Gazette check error:', err)
    return {
      id: 'gazette', name: 'Gazette & govt acquisition', status: 'caution',
      summary: 'Gazette database temporarily unavailable.',
      details: 'Could not query the gazette database. This check must be completed manually with a lawyer.'
    }
  }
}

// ─── CHECK 3: Flood & drainage risk ──────────────────────────────────────────
async function checkFlood(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_flood_risk', { p_lat: lat, p_lng: lng })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'flood', name: 'Flood & drainage risk', status: 'clear',
        summary: 'No flood risk zone detected.',
        details: 'Coordinate does not fall within a mapped flood risk polygon. Standard precautions apply during peak rainy season (June-October).'
      }
    }
    const zone = data[0]
    const statusMap: Record<string, 'clear' | 'caution' | 'critical'> = {
      low: 'clear', moderate: 'caution', high: 'critical', unbuildable: 'critical'
    }
    return {
      id: 'flood', name: 'Flood & drainage risk',
      status: statusMap[zone.risk_level] || 'caution',
      summary: `${zone.risk_level.charAt(0).toUpperCase() + zone.risk_level.slice(1)} flood risk zone.`,
      details: zone.risk_level === 'unbuildable'
        ? 'This coordinate falls within an area classified as unbuildable due to flood risk. Building here may violate Lagos State planning regulations.'
        : `NIMET flood assessment classifies this area as ${zone.risk_level} risk. ${zone.drainage_note || 'Confirm drainage conditions with LASIMRA before purchasing.'}`
    }
  } catch (err) {
    console.error('Flood check error:', err)
    return {
      id: 'flood', name: 'Flood & drainage risk', status: 'caution',
      summary: 'Flood risk data temporarily unavailable.',
      details: 'Could not query flood risk database. Verify manually with LASIMRA or NIMET flood maps.'
    }
  }
}

// ─── CHECK 4: Court litigation ────────────────────────────────────────────────
async function checkLitigation(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_litigation', {
      p_lat: lat, p_lng: lng, p_radius_metres: 300
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'litigation', name: 'Court litigation search', status: 'clear',
        summary: 'No active cases found in published cause lists.',
        details: "No cases matching this location were found in Lagos State Judiciary published cause lists. Note: this is not a complete court search. Instruct a lawyer to search at Lagos High Court registries."
      }
    }
    return {
      id: 'litigation', name: 'Court litigation search', status: 'caution',
      summary: `${data.length} potential case match(es) found.`,
      details: `${data.length} case(s) found in Lagos State Judiciary records that may relate to this area: ${data[0].case_title}. This requires a full court search by a qualified solicitor.`
    }
  } catch (err) {
    console.error('Litigation check error:', err)
    return {
      id: 'litigation', name: 'Court litigation search', status: 'caution',
      summary: 'Court records search unavailable.',
      details: 'Could not query court records database. A lawyer must conduct a full court search.'
    }
  }
}

// ─── CHECK 5: Land Use Charge ─────────────────────────────────────────────────
async function checkLUC(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_luc_status', { p_lat: lat, p_lng: lng })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'luc', name: 'Land Use Charge status', status: 'caution',
        summary: 'No LUC record found.',
        details: 'No Land Use Charge record found for this property. Any land without an LUC record since 2018 is an amber flag. Request LUC clearance from the seller before exchanging contracts.'
      }
    }
    const record = data[0]
    const currentYear = new Date().getFullYear()
    const gap = currentYear - record.last_payment_year
    if (gap <= 1) {
      return {
        id: 'luc', name: 'Land Use Charge status', status: 'clear',
        summary: `LUC current. Last payment: ${record.last_payment_year}.`,
        details: `Land Use Charge records show consistent payment. Last confirmed payment year: ${record.last_payment_year}.`
      }
    }
    return {
      id: 'luc', name: 'Land Use Charge status', status: 'caution',
      summary: `LUC payment gap detected: ${gap} years outstanding.`,
      details: `LUC records found but last payment was ${record.last_payment_year} — a ${gap}-year gap. Outstanding LUC is a charge on the land and must be settled before title can transfer cleanly.`
    }
  } catch (err) {
    console.error('LUC check error:', err)
    return {
      id: 'luc', name: 'Land Use Charge status', status: 'caution',
      summary: 'LUC portal temporarily unavailable.',
      details: 'Could not retrieve Land Use Charge records. Verify directly at landusecharge.lagosstate.gov.ng'
    }
  }
}

// ─── CHECK 6: Fraud zone & Omo Onile ─────────────────────────────────────────
async function checkFraud(lat: number, lng: number): Promise<CheckResult> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.rpc('check_fraud_zones', {
      p_lat: lat, p_lng: lng, p_radius_metres: 500
    })
    if (error) throw error
    if (!data || data.length === 0) {
      return {
        id: 'fraud', name: 'Fraud zone & Omo Onile alert', status: 'clear',
        summary: 'No fraud zone flags within 500m.',
        details: 'No active fraud zone flags or known Omo Onile dispute areas within 500m. Continue with standard due diligence.'
      }
    }
    const flag = data[0]
    const isCritical = flag.severity === 'high'
    return {
      id: 'fraud', name: 'Fraud zone & Omo Onile alert',
      status: isCritical ? 'critical' : 'caution',
      summary: `${flag.flag_type === 'omo_onile' ? 'Known Omo Onile area' : 'Active fraud zone'} within ${Math.round(flag.distance_metres)}m.`,
      details: `${flag.description} Exercise extreme caution. Engage a lawyer with specific experience in Lagos land disputes before any engagement with sellers.`
    }
  } catch (err) {
    console.error('Fraud check error:', err)
    return {
      id: 'fraud', name: 'Fraud zone & Omo Onile alert', status: 'clear',
      summary: 'Fraud zone database unavailable.',
      details: 'Could not query fraud zone database.'
    }
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json()

    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Valid lat and lng required' }, { status: 400 })
    }

    const results = await Promise.allSettled([
      checkSatellite(lat, lng),
      checkGazette(lat, lng),
      checkFlood(lat, lng),
      checkLitigation(lat, lng),
      checkLUC(lat, lng),
      checkFraud(lat, lng),
    ])

    const checks: CheckResult[] = results.map(r =>
      r.status === 'fulfilled' ? r.value : {
        id: 'unknown', name: 'Unknown', status: 'caution' as const,
        summary: 'Check failed.', details: 'This check encountered an error.'
      }
    )

    const hasCritical = checks.some(c => c.status === 'critical')
    const hasCaution = checks.some(c => c.status === 'caution')
    const overall = hasCritical ? 'CRITICAL' : hasCaution ? 'CAUTION' : 'CLEAR'

    const response: VerifyResponse = {
      overall, checks,
      reportId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      coordinate: { lat, lng }
    }

    return NextResponse.json(response)

  } catch (err) {
    console.error('Verify route error:', err)
    return NextResponse.json({ error: 'Verification failed. Try again.' }, { status: 500 })
  }
}
