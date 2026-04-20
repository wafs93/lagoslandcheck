-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── GAZETTE ACQUISITIONS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gazette_acquisitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gazette_ref   TEXT NOT NULL,          -- e.g. "Vol. 43 No. 17"
  gazette_year  INTEGER NOT NULL,
  purpose       TEXT NOT NULL,          -- e.g. "Lekki-Epe Expressway corridor"
  location_desc TEXT,                   -- raw text from gazette
  geom          GEOMETRY(POINT, 4326),  -- PostGIS point (WGS84)
  radius_metres INTEGER DEFAULT 500,    -- uncertainty radius of gazette boundary
  source_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gazette_geom_idx ON gazette_acquisitions USING GIST(geom);

-- Function: check_gazette_acquisition
CREATE OR REPLACE FUNCTION check_gazette_acquisition(
  p_lat FLOAT, p_lng FLOAT, p_radius_metres INTEGER
)
RETURNS TABLE(gazette_ref TEXT, gazette_year INTEGER, purpose TEXT, distance_metres FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.gazette_ref,
    g.gazette_year,
    g.purpose,
    ST_Distance(
      g.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) AS distance_metres
  FROM gazette_acquisitions g
  WHERE ST_DWithin(
    g.geom::geography,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    p_radius_metres
  )
  ORDER BY distance_metres ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- ─── FLOOD RISK ZONES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flood_risk_zones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_level    TEXT NOT NULL CHECK (risk_level IN ('low','moderate','high','unbuildable')),
  source        TEXT DEFAULT 'NIMET',
  year          INTEGER,
  drainage_note TEXT,
  geom          GEOMETRY(MULTIPOLYGON, 4326),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS flood_geom_idx ON flood_risk_zones USING GIST(geom);

CREATE OR REPLACE FUNCTION check_flood_risk(p_lat FLOAT, p_lng FLOAT)
RETURNS TABLE(risk_level TEXT, drainage_note TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT f.risk_level, f.drainage_note
  FROM flood_risk_zones f
  WHERE ST_Contains(
    f.geom,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  )
  ORDER BY
    CASE f.risk_level
      WHEN 'unbuildable' THEN 1
      WHEN 'high' THEN 2
      WHEN 'moderate' THEN 3
      WHEN 'low' THEN 4
    END
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ─── COURT LITIGATION ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS court_cases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_title    TEXT NOT NULL,
  case_number   TEXT,
  court         TEXT,
  status        TEXT,
  location_desc TEXT,
  geom          GEOMETRY(POINT, 4326),
  scraped_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS litigation_geom_idx ON court_cases USING GIST(geom);

CREATE OR REPLACE FUNCTION check_litigation(
  p_lat FLOAT, p_lng FLOAT, p_radius_metres INTEGER
)
RETURNS TABLE(case_title TEXT, case_number TEXT, distance_metres FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.case_title,
    c.case_number,
    ST_Distance(
      c.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) AS distance_metres
  FROM court_cases c
  WHERE c.geom IS NOT NULL
    AND ST_DWithin(
      c.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_metres
    )
  ORDER BY distance_metres ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- ─── LAND USE CHARGE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS luc_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address    TEXT,
  last_payment_year   INTEGER,
  assessment_number   TEXT,
  geom                GEOMETRY(POINT, 4326),
  scraped_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS luc_geom_idx ON luc_records USING GIST(geom);

CREATE OR REPLACE FUNCTION check_luc_status(p_lat FLOAT, p_lng FLOAT)
RETURNS TABLE(property_address TEXT, last_payment_year INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT l.property_address, l.last_payment_year
  FROM luc_records l
  WHERE l.geom IS NOT NULL
    AND ST_DWithin(
      l.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      100
    )
  ORDER BY
    ST_Distance(
      l.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ─── FRAUD ZONES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fraud_zones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_type     TEXT NOT NULL CHECK (flag_type IN ('active_fraud','omo_onile','disputed')),
  severity      TEXT NOT NULL CHECK (severity IN ('low','medium','high')),
  description   TEXT,
  source        TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  geom          GEOMETRY(POINT, 4326),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS fraud_geom_idx ON fraud_zones USING GIST(geom);

CREATE OR REPLACE FUNCTION check_fraud_zones(
  p_lat FLOAT, p_lng FLOAT, p_radius_metres INTEGER
)
RETURNS TABLE(flag_type TEXT, severity TEXT, description TEXT, distance_metres FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.flag_type,
    f.severity,
    f.description,
    ST_Distance(
      f.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) AS distance_metres
  FROM fraud_zones f
  WHERE f.verified = TRUE
    AND ST_DWithin(
      f.geom::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_metres
    )
  ORDER BY distance_metres ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- ─── VERIFICATION REPORTS (audit log) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS verification_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat           FLOAT NOT NULL,
  lng           FLOAT NOT NULL,
  overall       TEXT NOT NULL CHECK (overall IN ('CLEAR','CAUTION','CRITICAL')),
  results_json  JSONB NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
