import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=hybrid&key=${process.env.GOOGLE_MAPS_API_KEY}`

    const imgRes = await fetch(mapUrl)
    if (!imgRes.ok) throw new Error(`Maps API returned ${imgRes.status}`)
    const contentType = imgRes.headers.get('content-type') || 'image/png'
    if (!contentType.includes('image')) throw new Error('Maps API returned non-image')

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
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    let summary = parsed.summary || ''
    if (parsed.land_type === 'has_building') {
      summary = `⚠️ Building detected — ${parsed.structure_description || 'existing structure visible on this parcel'}. This is NOT vacant land.`
    } else if (parsed.land_type === 'vacant_land') {
      summary = `Vacant land confirmed. ${parsed.summary}`
    }

    return NextResponse.json({
      id: 'satellite',
      name: 'Satellite imagery',
      status: parsed.status,
      summary,
      details: parsed.details,
      land_type: parsed.land_type
    })

  } catch (err) {
    console.error('Satellite API error:', err)
    return NextResponse.json({
      id: 'satellite',
      name: 'Satellite imagery',
      status: 'caution',
      summary: 'Satellite analysis could not complete.',
      details: `Could not retrieve or analyse satellite imagery: ${err instanceof Error ? err.message : 'Unknown error'}`
    }, { status: 200 })
  }
}
