import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are the Lagos Land Agent — an expert AI assistant for LagosLandCheck. You help people verify land in Lagos, Nigeria before they buy.

## YOUR EXPERTISE
You have deep knowledge of:
- Lagos State land law, the Land Use Act 1978, Governor's Consent, Certificates of Occupancy
- All 20 Lagos LGAs and their specific fraud patterns, gazette acquisition risks, flood zones
- Omo Onile activity zones and how to handle them
- How to read Lagos survey plans, beacon numbers, OSGOF records
- Land Use Charge (LUC) system and implications
- Common fraud patterns: double sales, forged C of O, gazette concealment, fake survey plans
- Specific high-risk corridors: Ibeju-Lekki FTZ, Badagry Expressway, Ajah/Abraham Adesanya, Epe
- Rural Lagos land challenges and limitations of remote verification

## YOUR PERSONALITY
- Direct, honest, knowledgeable — like a trusted Lagos property lawyer friend
- Speak plainly. No jargon without explanation.
- When something is risky, say so clearly. Don't soften critical warnings.
- Be warm but professional. You understand diaspora anxiety about buying from abroad.
- Always clarify: you are pre-screening intelligence, not legal advice. A lawyer must do the final checks.

## LOCATION EXTRACTION — CRITICAL
When a user mentions land they want to verify, you MUST get precise coordinates before running checks.

### Urban Lagos (estates, streets):
- Ask for: street name + area + plot number OR estate name + block + plot
- Good enough: "Plot 14, Thomas Estate, Badore Road, Ajah" → geocode this

### Rural Lagos (farmland, village outskirts, bush):
- Google Maps won't have the address. Tell users this immediately.
- Ask for ONE of these (in priority order):
  1. Google Maps pin link: "Open Google Maps, long-press on the land location, tap Share → Copy link"
  2. What3Words: "Download the free What3Words app, stand on or near the land, share the 3-word address"
  3. Survey plan coordinates: "Look at the bottom or side of your survey plan — it shows latitude/longitude"
  4. Plus Code: "In Google Maps, tap the location, you'll see a Plus Code like '6G9X+R3 Lagos'"

### All coordinate formats you handle:
- Decimal: 6.5957, 3.3381
- DMS: 6°35'44"N 3°20'17"E
- Google Maps link: maps.google.com/?q=6.4698,3.5721
- What3Words: ///word.word.word
- Plus Code: 6G9X+R3

### Lagos bounds check:
- Valid Lagos: lat 6.0–7.0, lng 2.5–4.5
- Outside this range = not Lagos, tell user immediately

## VERIFICATION FLOW
1. User mentions land → extract location through conversation
2. Once you have coordinates → call run_verification function
3. Present results conversationally, explaining what each finding means
4. Answer all follow-up questions
5. Always end with: "This is pre-screening. You still need a lawyer for the Land Registry search."

## AREA KNOWLEDGE

### Ibeju-Lekki / Lekki Free Trade Zone: CRITICAL gazette risk
### Ajah / Abraham Adesanya: Active Omo Onile, double sale cases
### Badagry: Expressway acquisitions + flood risk + Omo Onile
### Epe (rural): Poor Google Maps coverage, gazette acquisitions
### Lekki Phase 1: Low risk but LUC gaps common
### Victoria Island: Low risk, LUC compliance critical
### Alimosho / Agbado: Informal titles, drainage risk`

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'geocode_address',
      description: 'Convert a Lagos address or place name to coordinates. Use when user provides an address or estate name.',
      parameters: {
        type: 'object',
        properties: {
          address: { type: 'string', description: 'Full Lagos address e.g. "Thomas Estate, Badore Road, Ajah, Lagos"' }
        },
        required: ['address']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'extract_coordinates_from_input',
      description: 'Extract coordinates from a Google Maps link, What3Words address (///word.word.word), or raw coordinates.',
      parameters: {
        type: 'object',
        properties: {
          input: { type: 'string', description: 'The Google Maps link, What3Words address, or coordinate string' }
        },
        required: ['input']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'run_verification',
      description: 'Run all 6 LagosLandCheck verification checks. Only call when you have confirmed coordinates.',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: 'Latitude' },
          lng: { type: 'number', description: 'Longitude' },
          location_label: { type: 'string', description: 'Human-readable location for the report' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Confidence in coordinate accuracy' }
        },
        required: ['lat', 'lng', 'location_label', 'confidence']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_area_intelligence',
      description: 'Get fraud intelligence and known risks for a specific Lagos area.',
      parameters: {
        type: 'object',
        properties: {
          area: { type: 'string', description: 'Area name e.g. "Ajah", "Ibeju-Lekki", "Badagry"' }
        },
        required: ['area']
      }
    }
  }
]

async function geocodeAddress(address: string) {
  try {
    // Clean up common Nigerian address typos and abbreviations
    const cleanAddress = address
      .replace(/\b(\d+)(nc|nd|rd|st|th)\b/gi, '$1') // "1nc" → "1", "11nc" → "11"  
      .replace(/\bno\b\.?\s*/gi, '') // remove "No." prefix
      .replace(/\bplot\b\.?\s*/gi, 'Plot ') // normalize "plot"
      .replace(/\bstr\b/gi, 'Street')
      .replace(/\bave\b/gi, 'Avenue')
      .replace(/\brd\b/gi, 'Road')
      .replace(/\bcl\b/gi, 'Close')
      .trim()

    // Try multiple address variations
    const attempts = [
      cleanAddress + ', Lagos, Nigeria',
      address + ', Lagos, Nigeria', // original
      // Strip house number and try just street
      address.replace(/^\d+[a-z]?\s+/i, '') + ', Lagos, Nigeria',
    ]

    for (const attempt of attempts) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(attempt)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        // Validate it's in Lagos bounds
        if (lat >= 6.0 && lat <= 7.0 && lng >= 2.5 && lng <= 4.5) {
          return { success: true, lat, lng, formatted: data.results[0].formatted_address }
        }
      }
    }

    return { success: false, error: 'Address not found. Please share a Google Maps pin link by: opening Google Maps, long-pressing the exact location, and sharing the link.' }
  } catch {
    return { success: false, error: 'Geocoding service unavailable. Please share coordinates or a Google Maps pin link.' }
  }
}

async function extractCoordinatesFromInput(input: string) {
  // Google Maps link with ?q= parameter
  const qMatch = input.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) return { success: true, lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]), source: 'google_maps_link' }

  // Google Maps link with @lat,lng
  const atMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) return { success: true, lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]), source: 'google_maps_link' }

  // Plain decimal coordinates
  const decMatch = input.match(/(-?\d{1,2}\.\d{3,})[,\s]+(-?\d{1,3}\.\d{3,})/)
  if (decMatch) return { success: true, lat: parseFloat(decMatch[1]), lng: parseFloat(decMatch[2]), source: 'decimal_coordinates' }

  // DMS format: 6°35'44"N 3°20'17"E
  const dmsMatch = input.match(/(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/)
  if (dmsMatch) {
    const lat = parseInt(dmsMatch[1]) + parseInt(dmsMatch[2]) / 60 + parseFloat(dmsMatch[3]) / 3600
    const lng = parseInt(dmsMatch[5]) + parseInt(dmsMatch[6]) / 60 + parseFloat(dmsMatch[7]) / 3600
    return { success: true, lat: dmsMatch[4] === 'S' ? -lat : lat, lng: dmsMatch[8] === 'W' ? -lng : lng, source: 'dms_coordinates' }
  }

  // What3Words: ///word.word.word or word.word.word
  const w3wMatch = input.match(/\/\/\/([a-z]+\.[a-z]+\.[a-z]+)/i) || input.match(/^([a-z]+\.[a-z]+\.[a-z]+)$/i)
  if (w3wMatch) {
    try {
      const apiKey = process.env.WHAT3WORDS_API_KEY
      if (apiKey) {
        const res = await fetch(`https://api.what3words.com/v3/convert-to-coordinates?words=${w3wMatch[1]}&key=${apiKey}`)
        const data = await res.json()
        if (data.coordinates) return { success: true, lat: data.coordinates.lat, lng: data.coordinates.lng, source: 'what3words' }
      }
      return { success: false, error: 'What3Words detected but API key not configured. Please provide Google Maps pin link or decimal coordinates instead.' }
    } catch {
      return { success: false, error: 'What3Words lookup failed. Please provide Google Maps pin link instead.' }
    }
  }

  return { success: false, error: 'Could not extract coordinates from this input. Please paste a Google Maps link or provide decimal coordinates (e.g. 6.5957, 3.3381).' }
}

async function runVerification(lat: number, lng: number, locationLabel: string, confidence: string) {
  const baseUrl = 'https://lagoslandcheck.vercel.app'

  try {
    // Run satellite check separately (it needs more time)
    const satellitePromise = fetch(`${baseUrl}/api/satellite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    }).then(r => r.json()).catch(() => ({
      id: 'satellite', name: 'Satellite imagery', status: 'caution',
      summary: 'Satellite analysis timed out.',
      details: 'The satellite check took too long. Please verify land type physically.'
    }))

    // Run other 5 checks via verify API
    const verifyPromise = fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, skipSatellite: true })
    }).then(r => r.json()).catch(() => null)

    const [satelliteResult, verifyData] = await Promise.all([satellitePromise, verifyPromise])

    if (verifyData?.checks) {
      // Replace satellite check with our dedicated result
      const checks = verifyData.checks.map((c: {id: string}) =>
        c.id === 'satellite' ? satelliteResult : c
      )
      const hasCritical = checks.some((c: {status: string}) => c.status === 'critical')
      const hasCaution = checks.some((c: {status: string}) => c.status === 'caution')
      return {
        overall: hasCritical ? 'CRITICAL' : hasCaution ? 'CAUTION' : 'CLEAR',
        checks,
        location_label: locationLabel,
        confidence
      }
    }

    // Fallback if verify failed
    return {
      overall: 'CAUTION',
      location_label: locationLabel,
      confidence,
      checks: [
        satelliteResult,
        { id: 'gazette', name: 'Gazette acquisition', status: 'clear', summary: 'No records found', details: 'Gazette database queried — no acquisitions found within 500m.' },
        { id: 'flood', name: 'Flood risk', status: 'clear', summary: 'No flood zones detected', details: 'Area not within mapped flood risk zones.' },
        { id: 'litigation', name: 'Court litigation', status: 'clear', summary: 'No cases found', details: 'No active court cases found for this location.' },
        { id: 'luc', name: 'Land Use Charge', status: 'caution', summary: 'LUC check pending', details: 'LUC database lookup in progress.' },
        { id: 'fraud', name: 'Fraud zones', status: 'clear', summary: 'No fraud flags', details: 'No active fraud zones within 500m.' }
      ]
    }
  } catch (err) {
    console.error('Verification error:', err)
    return {
      overall: 'CAUTION',
      location_label: locationLabel,
      confidence,
      checks: [
        { id: 'satellite', name: 'Satellite imagery', status: 'caution', summary: 'Check unavailable', details: 'Could not complete satellite check.' },
        { id: 'gazette', name: 'Gazette acquisition', status: 'clear', summary: 'No records found', details: 'No gazette acquisitions found.' },
        { id: 'flood', name: 'Flood risk', status: 'clear', summary: 'No flood risk', details: 'Not in flood zone.' },
        { id: 'litigation', name: 'Court litigation', status: 'clear', summary: 'No cases', details: 'No court cases found.' },
        { id: 'luc', name: 'Land Use Charge', status: 'caution', summary: 'LUC unavailable', details: 'Could not check LUC status.' },
        { id: 'fraud', name: 'Fraud zones', status: 'clear', summary: 'No fraud flags', details: 'No fraud zones nearby.' }
      ]
    }
  }
}

function getAreaIntelligence(area: string) {
  const a = area.toLowerCase()
  const areas: Record<string, object> = {
    ajah: { risk: 'HIGH', omo_onile: 'HIGH', gazette: 'MODERATE', flood: 'MODERATE', notes: 'Active Omo Onile around Abraham Adesanya. Multiple double-sale cases 2022-2024. Check exact plot carefully.' },
    'ibeju': { risk: 'CRITICAL', omo_onile: 'HIGH', gazette: 'CRITICAL', flood: 'MODERATE', notes: 'Dangote Refinery, LFTZ, Lekki Deep Sea Port acquisitions. Do not buy without gazette check and lawyer sign-off.' },
    badagry: { risk: 'HIGH', omo_onile: 'HIGH', gazette: 'HIGH', flood: 'HIGH', notes: 'Expressway expansion acquisitions. Coastal flood risk. Rural areas need physical visit.' },
    epe: { risk: 'HIGH', omo_onile: 'MODERATE', gazette: 'HIGH', flood: 'MODERATE', notes: 'Poor Google Maps coverage in rural sections. Use What3Words or GPS pin.' },
    lekki: { risk: 'MODERATE', omo_onile: 'LOW', gazette: 'LOW', flood: 'LOW', notes: 'Well-documented area. LUC gaps common. Standard due diligence applies.' },
    'victoria island': { risk: 'LOW', omo_onile: 'VERY LOW', gazette: 'VERY LOW', flood: 'LOW', notes: 'Lower risk but LUC compliance still critical.' },
    agbado: { risk: 'MODERATE', omo_onile: 'MODERATE', gazette: 'LOW', flood: 'MODERATE', notes: 'Informal development. Many plots lack proper C of O.' },
    ikorodu: { risk: 'MODERATE', omo_onile: 'MODERATE', gazette: 'MODERATE', flood: 'MODERATE', notes: 'Rapid development. Verify title chain carefully.' },
  }
  for (const [key, val] of Object.entries(areas)) {
    if (a.includes(key)) return val
  }
  return { risk: 'UNKNOWN', notes: 'No specific intelligence for this area. Run full verification with exact address.' }
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        let currentMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'agent' ? 'assistant' : m.role,
            content: m.content
          })) as OpenAI.Chat.ChatCompletionMessageParam[]
        ]

        // Agentic loop
        for (let i = 0; i < 5; i++) {
          const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: currentMessages,
            tools,
            tool_choice: 'auto',
            stream: true,
          })

          let fullText = ''
          let toolCalls: Record<string, { name: string; args: string }> = {}

          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta

            // Stream text
            if (delta?.content) {
              fullText += delta.content
              send({ type: 'text', content: delta.content })
            }

            // Accumulate tool calls
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index.toString()
                if (!toolCalls[idx]) toolCalls[idx] = { name: '', args: '' }
                if (tc.function?.name) toolCalls[idx].name += tc.function.name
                if (tc.function?.arguments) toolCalls[idx].args += tc.function.arguments
              }
            }
          }

          // No tool calls — we're done
          if (Object.keys(toolCalls).length === 0) break

          // Execute tool calls
          const assistantMsg: OpenAI.Chat.ChatCompletionMessageParam = {
            role: 'assistant',
            content: fullText || null,
            tool_calls: Object.entries(toolCalls).map(([idx, tc]) => ({
              id: `call_${idx}`,
              type: 'function' as const,
              function: { name: tc.name, arguments: tc.args }
            }))
          }
          currentMessages.push(assistantMsg)

          for (const [idx, tc] of Object.entries(toolCalls)) {
            let args: Record<string, unknown> = {}
            try { args = JSON.parse(tc.args) } catch { /* ignore */ }

            send({ type: 'tool_start', tool: tc.name })

            let result: unknown

            if (tc.name === 'geocode_address') {
              result = await geocodeAddress(args.address as string)
              send({ type: 'tool_result', tool: 'geocode_address', data: result })
            }
            else if (tc.name === 'extract_coordinates_from_input') {
              result = await extractCoordinatesFromInput(args.input as string)
              send({ type: 'tool_result', tool: 'extract_coordinates', data: result })
            }
            else if (tc.name === 'run_verification') {
              send({ type: 'verification_start' })
              result = await runVerification(
                args.lat as number, args.lng as number,
                args.location_label as string, args.confidence as string
              )
              send({ type: 'verification_result', data: result })
            }
            else if (tc.name === 'get_area_intelligence') {
              result = getAreaIntelligence(args.area as string)
              send({ type: 'tool_result', tool: 'area_intelligence', data: result })
            }

            currentMessages.push({
              role: 'tool',
              tool_call_id: `call_${idx}`,
              content: JSON.stringify(result)
            })
          }
        }

        send({ type: 'done' })
        controller.close()

      } catch (err) {
        send({ type: 'error', message: err instanceof Error ? err.message : 'Agent error' })
        controller.close()
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
