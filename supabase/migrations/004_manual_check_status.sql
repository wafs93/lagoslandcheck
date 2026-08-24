ALTER TABLE verification_reports
  ADD COLUMN IF NOT EXISTS manual_court_status TEXT CHECK (manual_court_status IN ('clear', 'caution', 'critical')),
  ADD COLUMN IF NOT EXISTS manual_luc_status TEXT CHECK (manual_luc_status IN ('clear', 'caution', 'critical'));
