export const maxDuration = 60

import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { runAllChecks } from '@/lib/checks'

const SYSTEM_PROMPT = `You are the Lagos Land Check AI Agent. You help users verify land in Lagos, Nigeria before they buy it.

Your job:
1. Extract coordinates from any location input (Google Maps link, address, coordinates)
2. Call run_verification with those coordinates

COORDINATE EXTRACTION RULES:
- Google Maps link with ?q=lat,lng → extract those numbers
- Google Maps link with @lat,lng → extract those numbers
- Plain address → geocode it using the geocode_address tool
- Decimal coordinates → use directly

IMPORTANT: Always extract coordinates FIRST, then call run_verification.
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
  // ?q=lat,lng or &q=lat,lng
  const qMatch = input.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }

  // @lat,lng
  const atMatch = input.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

  // /place/.../@lat,lng
  const placeMatch = input.match(/place\/[^/]+\/@?(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (placeMatch) return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) }

  // Plain "lat,lng" or "lat, lng"
  const decMatch = input.trim().match(/^(-?\d{1,2}\.?\d*)[,\s]+(-?\d{1,3}\.?\d*)$/)
  if (decMatch) return { lat: parseFloat(decMatch[1]), lng: parseFloat(decMatch[2]) }

  return null
}

function isLagos(lat: number, lng: number): boolean {
  return lat >= 6.0 && lat <= 7.0 && lng >= 2.5 && lng <= 4.5
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted: string } | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Lagos, Nigeria')}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const data = await res.json()
    if (data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location
      if (isLagos(lat, lng)) {
        return { lat, lng, formatted: data.results[0].formatted_address }
      }
    }
    return null
  } catch (err) {
    console.error('[GEOCODE_ERROR]', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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

        // FAST PATH: direct coordinate extraction (skip GPT-4o entirely)
        const directCoords = extractCoordsFromInput(userInput)

        if (directCoords && isLagos(directCoords.lat, directCoords.lng)) {
          const { lat, lng } = directCoords
          send({ type: 'status', message: `Found coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` })
          send({ type: 'verification_start' })

          // Direct function call — NO HTTP, NO timeout fragility
          const result = await runAllChecks(lat, lng)

          send({
            type: 'verification_result',
            data: {
              overall: result.overall,
              location_label: userInput.slice(0, 80),
              confidence: 'high',
              lat,
              lng,
              checks: result.checks,
              reportId: result.reportId,
              generatedAt: result.generatedAt,
            }
          })
          send({ type: 'done' })
          controller.close()
          return
        }

        // GPT-4o PATH: complex inputs (addresses, what3words, etc)
        send({ type: 'status', message: 'Analysing location with AI...' })

        const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userInput }
        ]

        let iterations = 0
        let resolvedLat: number | null = null
        let resolvedLng: number | null = null
        let resolvedLabel = userInput.slice(0, 80)
        let resolvedConfidence: 'high' | 'medium' | 'low' = 'medium'

        while (iterations < 5) {
          iterations++
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: chatMessages,
            tools,
            tool_choice: 'auto',
            max_tokens: 500
          })

          const msg = response.choices[0].message
          chatMessages.push(msg)

          if (!msg.tool_calls?.length) {
            // Model is done. If we never resolved coords, send a friendly error.
            if (!resolvedLat || !resolvedLng) {
              send({
                type: 'error',
                message: 'Could not extract a Lagos location from that input. Try a Google Maps link or a more specific address.'
              })
              controller.close()
              return
            }
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
              if (geo) resolvedLabel = geo.formatted
              chatMessages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) })
            }

            else if (tc.function.name === 'run_verification') {
              if (!isLagos(args.lat, args.lng)) {
                chatMessages.push({
                  role: 'tool',
                  tool_call_id: tc.id,
                  content: JSON.stringify({ success: false, error: 'Coordinates outside Lagos' })
                })
                continue
              }
              resolvedLat = args.lat
              resolvedLng = args.lng
              resolvedLabel = args.location_label || resolvedLabel
              resolvedConfidence = args.confidence || 'medium'
              break
            }
          }

          if (resolvedLat && resolvedLng) break
        }

        if (resolvedLat && resolvedLng) {
          send({ type: 'status', message: 'Running 6 checks...' })
          send({ type: 'verification_start' })

          const result = await runAllChecks(resolvedLat, resolvedLng)

          send({
            type: 'verification_result',
            data: {
              overall: result.overall,
              location_label: resolvedLabel,
              confidence: resolvedConfidence,
              lat: resolvedLat,
              lng: resolvedLng,
              checks: result.checks,
              reportId: result.reportId,
              generatedAt: result.generatedAt,
            }
          })
        }

        send({ type: 'done' })
        controller.close()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error('[AGENT_STREAM_ERROR]', err)
        send({ type: 'error', message: msg })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
