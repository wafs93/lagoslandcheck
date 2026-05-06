import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are the Lagos Land Check AI Agent. You help users verify land in Lagos, Nigeria before they buy it.

Your job:
1. Extract coordinates from any location input (Google Maps link, address, coordinates)
2. Call run_verification with those coordinates
3. Return the results

COORDINATE EXTRACTION RULES:
- Google Maps link with ?q=lat,lng → extract those numbers
- Google Maps link with @lat,lng → extract those numbers  
- Plain address → geocode it using the geocode_address tool
- What3Words → use what3words API
- Decimal coordinates → use directly

IMPORTANT: Always extract coordinates FIRST, then call run_verification.
Never call run_verification without valid lat/lng numbers.
Lagos coordinates range: lat 6.0-7.0, lng 2.5-4.5`

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'geocode_address',
      description: 'Convert a Lagos address to coordinates using Google Geocoding API',
      parameters: {
        type: 'object',
        properties: {
          address: { type: 'string', description: 'The address to geocode' }
        },
        required: ['address']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'run_verification',
      description: 'Run all 6 land verification checks for a coordinate',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: 'Latitude (6.0-7.0 for Lagos)' },
          lng: { type: 'number', description: 'Longitude (2.5-4.5 for Lagos)' },
          location_label: { type: 'string', description: 'Human readable location name' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
        },
        required: ['lat', 'lng', 'location_label', 'confidence']
      }
    }
  }
]

function extractCoordsFromInput(input: string): { lat: number; lng: number } | null {
  // ?q=lat,lng
  const qMatch = input.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }

  // @lat,lng
  const atMatch = input.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

  // /place/@lat,lng or place/lat,lng
  const placeMatch = input.match(/place\/([^/]+)\/@?(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (placeMatch) return { lat: parseFloat(placeMatch[2]), lng: parseFloat(placeMatch[3]) }

  // Plain decimal coordinates
  const decMatch = input.match(/^(-?\d{1,2}\.?\d*)[,\s]+(-?\d{1,3}\.?\d*)$/)
  if (decMatch) return { lat: parseFloat(decMatch[1]), lng: parseFloat(decMatch[2]) }

  return null
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted: string } | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Lagos, Nigeria')}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location
      if (lat >= 6.0 && lat <= 7.0 && lng >= 2.5 && lng <= 4.5) {
        return { lat, lng, formatted: data.results[0].formatted_address }
      }
    }
    return null
  } catch {
    return null
  }
}

async function runVerification(lat: number, lng: number, locationLabel: string, confidence: string) {
  // Use the internal API directly instead of HTTP to avoid self-calling issues on Vercel
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://lagoslandcheck.com'

    const [satelliteRes, verifyRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/satellite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
        signal: AbortSignal.timeout(55000)
      }).then(r => r.json()),
      fetch(`${baseUrl}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, skipSatellite: true }),
        signal: AbortSignal.timeout(20000)
      }).then(r => r.json())
    ])

    const satelliteResult = satelliteRes.status === 'fulfilled' ? satelliteRes.value : {
      id: 'satellite', name: 'Satellite imagery', status: 'caution',
      summary: 'Satellite check timed out. Verify land type physically.',
      details: 'The satellite analysis took too long. Please try again or verify the land type manually.'
    }

    const verifyData = verifyRes.status === 'fulfilled' ? verifyRes.value : null

    if (verifyData?.checks) {
      const checks = verifyData.checks.map((c: { id: string }) =>
        c.id === 'satellite' ? satelliteResult : c
      )
      const hasCritical = checks.some((c: { status: string }) => c.status === 'critical')
      const hasCaution = checks.some((c: { status: string }) => c.status === 'caution')
      return {
        overall: hasCritical ? 'CRITICAL' : hasCaution ? 'CAUTION' : 'CLEAR',
        checks, location_label: locationLabel, confidence, lat, lng
      }
    }

    // Fallback with satellite at least
    return {
      overall: 'CAUTION',
      location_label: locationLabel,
      confidence, lat, lng,
      checks: [
        satelliteResult,
        { id: 'gazette', name: 'Gazette & govt acquisition', status: 'caution', summary: 'Database temporarily unavailable.', details: 'Could not query gazette database. Verify with a lawyer.' },
        { id: 'flood', name: 'Flood & drainage risk', status: 'caution', summary: 'Flood data temporarily unavailable.', details: 'Verify manually with LASIMRA flood maps.' },
        { id: 'litigation', name: 'Court litigation', status: 'caution', summary: 'Court records temporarily unavailable.', details: 'A lawyer must conduct a full court search.' },
        { id: 'luc', name: 'Land Use Charge status', status: 'caution', summary: 'LUC portal temporarily unavailable.', details: 'Verify at landusecharge.lagosstate.gov.ng' },
        { id: 'fraud', name: 'Fraud zone & Omo Onile', status: 'caution', summary: 'Fraud database temporarily unavailable.', details: 'Verify with local estate agents familiar with the area.' }
      ]
    }
  } catch (err) {
    console.error('Verification error:', err)
    return {
      overall: 'CAUTION', location_label: locationLabel, confidence, lat, lng,
      checks: Array(6).fill(null).map((_, i) => ({
        id: ['satellite', 'gazette', 'flood', 'litigation', 'luc', 'fraud'][i],
        name: ['Satellite imagery', 'Gazette & govt acquisition', 'Flood & drainage risk', 'Court litigation', 'Land Use Charge status', 'Fraud zone & Omo Onile'][i],
        status: 'caution',
        summary: 'Check failed. Please try again.',
        details: 'An error occurred during verification. Please retry.'
      }))
    }
  }
}

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  const { messages } = await req.json()
  const userInput = messages[messages.length - 1]?.content || ''

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send({ type: 'status', message: 'Extracting location...' })

        // Try direct coordinate extraction first (fast path)
        const directCoords = extractCoordsFromInput(userInput)

        if (directCoords) {
          const { lat, lng } = directCoords
          send({ type: 'status', message: `Found coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` })
          send({ type: 'verification_start' })
          const result = await runVerification(lat, lng, userInput.slice(0, 80), 'high')
          send({ type: 'verification_result', data: result })
          send({ type: 'done' })
          controller.close()
          return
        }

        // Use GPT-4o for complex inputs
        send({ type: 'status', message: 'Analyzing location input...' })

        const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userInput }
        ]

        let iterations = 0
        while (iterations < 5) {
          iterations++
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: chatMessages,
            tools,
            tool_choice: 'auto',
            max_tokens: 1000
          })

          const msg = response.choices[0].message
          chatMessages.push(msg)

          if (!msg.tool_calls?.length) {
            send({ type: 'text', content: msg.content || 'Verification complete.' })
            break
          }

          for (const tc of msg.tool_calls) {
            const args = JSON.parse(tc.function.arguments)

            if (tc.function.name === 'geocode_address') {
              send({ type: 'status', message: 'Geocoding address...' })
              const geo = await geocodeAddress(args.address)
              const result = geo
                ? { success: true, lat: geo.lat, lng: geo.lng, formatted: geo.formatted }
                : { success: false, error: 'Address not found in Lagos' }
              chatMessages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) })
            }

            else if (tc.function.name === 'run_verification') {
              send({ type: 'status', message: 'Running 6 checks...' })
              send({ type: 'verification_start' })
              const result = await runVerification(
                args.lat, args.lng, args.location_label, args.confidence
              )
              send({ type: 'verification_result', data: result })
              send({ type: 'done' })
              controller.close()
              return
            }
          }
        }

        send({ type: 'done' })
        controller.close()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        send({ type: 'error', message: msg })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
