export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { sendContactForm, sendContactAck } from '@/lib/email'

const VALID_TOPICS = [
  'Refund request',
  'Report issue / inaccurate data',
  'Technical problem',
  'Payment problem',
  'Partnership inquiry',
  'Press / media',
  'Other',
]

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, message, _hp } = await req.json()

    // Honeypot — bots will fill _hp, humans won't see it
    if (_hp) {
      return NextResponse.json({ success: true })
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!topic || !VALID_TOPICS.includes(topic)) {
      return NextResponse.json({ error: 'Please select a valid topic.' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide a message (at least 10 characters).' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long (max 5000 characters).' }, { status: 400 })
    }

    // Send to support inbox
    const internal = await sendContactForm({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic,
      message: message.trim(),
    })

    if (!internal.success) {
      return NextResponse.json(
        { error: 'Could not send message. Please email support@lagoslandcheck.com directly.' },
        { status: 500 }
      )
    }

    // Send acknowledgement to user (non-blocking — log if fails)
    sendContactAck(email.trim().toLowerCase(), name.trim()).catch(err =>
      console.error('[ACK_FAIL]', err)
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[CONTACT_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please email support@lagoslandcheck.com directly.' },
      { status: 500 }
    )
  }
}
