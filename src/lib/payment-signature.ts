export type ReportTier = 'instant' | 'verified'

export const REPORT_PRICE_KOBO: Record<ReportTier, number> = {
  instant: 500000,
  verified: 3000000,
}

export function buildReportSignature(lat: number, lng: number): string {
  const safeLat = Number(lat).toFixed(6)
  const safeLng = Number(lng).toFixed(6)
  return `${safeLat},${safeLng}`
}
