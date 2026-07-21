export const REPORT_PRICE_KOBO = 500000

export function buildReportSignature(lat: number, lng: number): string {
  const safeLat = Number(lat).toFixed(6)
  const safeLng = Number(lng).toFixed(6)
  return `${safeLat},${safeLng}`
}
