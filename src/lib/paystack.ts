import { supabaseAdmin } from './supabase'
import { REPORT_PRICE_KOBO, ReportTier, buildReportSignature } from './payment-signature'

type OverallVerdict = 'CLEAR' | 'CAUTION' | 'CRITICAL'

interface VerifyTransactionData {
  status?: string
  amount?: number
  reference?: string
  currency?: string
  customer?: { email?: string | null } | null
}

interface VerifyTransactionResponse {
  status: boolean
  message?: string
  data?: VerifyTransactionData
}

export interface VerifyAndRecordPaymentArgs {
  paymentRef: string
  lat: number
  lng: number
  overall: OverallVerdict
  resultsJson: Record<string, unknown>
  requestTier?: ReportTier
  paymentEmail?: string
}

export interface VerifyAndRecordPaymentResult {
  ok: boolean
  status: number
  error?: string
  reused?: boolean
}

function getPaystackSecret(): string {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY not configured')
  return secret
}

async function verifyPaystackTransaction(paymentRef: string): Promise<VerifyTransactionResponse> {
  const secret = getPaystackSecret()
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentRef)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    const rawBody = await res.text()
    let paystackMessage: string | undefined
    try {
      const parsed = JSON.parse(rawBody) as { message?: string }
      if (typeof parsed?.message === 'string') paystackMessage = parsed.message
    } catch {
      // Keep rawBody for diagnostics when Paystack doesn't return JSON.
    }

    console.error('[PAYSTACK_VERIFY_ERROR]', {
      status: res.status,
      paymentRef,
      message: paystackMessage ?? null,
      body: rawBody,
    })

    throw new Error(
      `Paystack verify failed: ${res.status}${paystackMessage ? ` (${paystackMessage})` : ''}`,
    )
  }
  return res.json()
}

async function fetchExistingByReference(paymentRef: string) {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('verification_reports')
    .select('id, lat, lng, results_json')
    .eq('payment_ref', paymentRef)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

function extractSignature(row: { lat: number; lng: number; results_json: any } | null): string | null {
  if (!row) return null
  const fromJson = row.results_json?.report_signature
  if (typeof fromJson === 'string' && fromJson) return fromJson
  if (typeof row.lat === 'number' && typeof row.lng === 'number') {
    return buildReportSignature(row.lat, row.lng)
  }
  return null
}

export async function verifyAndRecordPayment(args: VerifyAndRecordPaymentArgs): Promise<VerifyAndRecordPaymentResult> {
  const { paymentRef, lat, lng, overall, resultsJson, paymentEmail, requestTier = 'instant' } = args

  let verification: VerifyTransactionResponse
  try {
    verification = await verifyPaystackTransaction(paymentRef)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not verify payment'
    return { ok: false, status: 502, error: msg }
  }

  const tx = verification.data
  if (!verification.status || !tx) {
    return { ok: false, status: 402, error: 'Payment verification failed' }
  }
  if (tx.status !== 'success') {
    return { ok: false, status: 402, error: 'Transaction not successful' }
  }
  if (tx.amount !== REPORT_PRICE_KOBO[requestTier]) {
    return { ok: false, status: 402, error: 'Invalid payment amount' }
  }
  if (tx.reference !== paymentRef) {
    return { ok: false, status: 402, error: 'Reference mismatch' }
  }

  const reportSignature = buildReportSignature(lat, lng)
  const existing = await fetchExistingByReference(paymentRef)
  if (existing) {
    const existingSig = extractSignature(existing)
    if (existingSig && existingSig !== reportSignature) {
      return { ok: false, status: 409, error: 'Payment reference already used for a different report' }
    }
    return { ok: true, status: 200, reused: true }
  }

  const db = supabaseAdmin()
  const { error: insertError } = await db.from('verification_reports').insert({
    lat,
    lng,
    overall,
    payment_ref: paymentRef,
    payment_status: tx.status,
    payment_amount_kobo: tx.amount,
    payment_email: paymentEmail || tx.customer?.email || null,
    payment_verified_at: new Date().toISOString(),
    results_json: {
      ...resultsJson,
      payment_ref: paymentRef,
      report_signature: reportSignature,
    },
  })

  if (insertError) {
    const maybeExisting = await fetchExistingByReference(paymentRef)
    const existingSig = extractSignature(maybeExisting as any)
    if (existingSig && existingSig === reportSignature) {
      return { ok: true, status: 200, reused: true }
    }
    return {
      ok: false,
      status: 500,
      error: insertError.message || 'Failed to store verified payment reference',
    }
  }

  return { ok: true, status: 200, reused: false }
}
