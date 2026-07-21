ALTER TABLE verification_reports
  ADD COLUMN IF NOT EXISTS payment_ref TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS payment_amount_kobo INTEGER,
  ADD COLUMN IF NOT EXISTS payment_email TEXT,
  ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS verification_reports_payment_ref_unique
  ON verification_reports (payment_ref)
  WHERE payment_ref IS NOT NULL;
