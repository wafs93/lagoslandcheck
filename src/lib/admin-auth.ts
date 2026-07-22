import { timingSafeEqual } from 'node:crypto'
import { NextRequest } from 'next/server'

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

export function requireAdminAuth(req: NextRequest): AdminAuthResult {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) {
    console.error('[ADMIN_AUTH_MISSING_PASSWORD]')
    return { ok: false, status: 500, error: 'Admin auth is not configured' }
  }

  const provided = req.headers.get('x-admin-password') ?? ''
  const providedBuffer = Buffer.from(provided)
  const configuredBuffer = Buffer.from(configured)

  if (providedBuffer.length !== configuredBuffer.length) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  if (!timingSafeEqual(providedBuffer, configuredBuffer)) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  return { ok: true }
}