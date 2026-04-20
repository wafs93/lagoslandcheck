# LagosLandCheck

AI-powered Lagos land pre-screening tool. Runs 6 automated checks and returns a plain-English risk report.

## Stack
- **Next.js 14** (App Router) — frontend + API routes
- **Supabase** (PostgreSQL + PostGIS) — spatial database
- **OpenAI GPT-4o** — satellite image analysis
- **Google Maps API** — satellite tiles + geocoding
- **Vercel** — hosting + CI/CD

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local
# Fill in your API keys in .env.local

# 3. Run the Supabase migration
# Go to your Supabase project → SQL Editor → paste supabase/migrations/001_initial_schema.sql

# 4. Start dev server
npm run dev
```

## The 6 Checks

| # | Check | Data Source | Method |
|---|-------|-------------|--------|
| 1 | Satellite imagery | Google Maps Static API → GPT-4o Vision | AI analysis |
| 2 | Gazette & govt acquisition | Lagos State Gazettes (manually parsed) | PostGIS radius query |
| 3 | Flood & drainage risk | NIMET shapefiles | PostGIS polygon query |
| 4 | Court litigation | Lagos Judiciary (scraped) | PostGIS + full-text |
| 5 | Land Use Charge status | LUC portal (scraped) | PostGIS proximity |
| 6 | Fraud zone & Omo Onile | Manual DB + community | PostGIS radius query |

## Environment Variables

See `.env.local.example` for all required variables.

## Deployment

Push to GitHub → Vercel auto-deploys. Add env vars in Vercel dashboard.

## Disclaimer

LagosLandCheck is a pre-screening intelligence tool. It does not replace a physical Land Registry search by a licensed lawyer.
