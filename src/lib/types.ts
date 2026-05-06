export type CheckStatus = 'clear' | 'caution' | 'critical' | 'error' | 'queued' | 'running'
export type OverallVerdict = 'CLEAR' | 'CAUTION' | 'CRITICAL'

export interface CheckResult {
  id: string
  name: string
  status: CheckStatus
  summary: string
  details: string
}

export interface VerifyRequest {
  lat: number
  lng: number
  photoUrl?: string
}

export interface VerifyResponse {
  overall: OverallVerdict
  checks: CheckResult[]
  reportId: string
  generatedAt: string
  coordinate: {
    lat: number
    lng: number
    label?: string
  }
}
