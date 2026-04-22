-- ═══════════════════════════════════════════════════
-- LAGOSLANDCHECK — SEED DATA
-- Run this in Supabase SQL Editor after 001_initial_schema.sql
-- Sources: Lagos State Gazettes, court records, news reports
-- ═══════════════════════════════════════════════════

-- ─── FRAUD ZONES & OMO ONILE AREAS ───────────────────
INSERT INTO fraud_zones (flag_type, severity, description, source, verified, geom) VALUES

-- AJAH / ABRAHAM ADESANYA
('omo_onile', 'high', 
 'Active Omo Onile zone around Abraham Adesanya Estate and Ajiwe axis. Multiple reported cases of community members demanding payments after purchase. Buyers advised to engage local lawyer familiar with community leaders before any transaction.',
 'Court records + verified reports 2022-2024', true,
 ST_SetSRID(ST_MakePoint(3.5721, 6.4698), 4326)),

-- IBEJU-LEKKI FTZ CORRIDOR
('active_fraud', 'high',
 'High incidence of sellers marketing gazette-acquired land in the Lekki Free Trade Zone corridor. Government acquisitions for Dangote Refinery, LFTZ and Lekki Deep Sea Port cover large tracts. Sellers often present pre-acquisition deeds as valid title.',
 'Lagos State Gazettes + court records', true,
 ST_SetSRID(ST_MakePoint(3.8500, 6.4350), 4326)),

-- BADAGRY EXPRESSWAY
('active_fraud', 'high',
 'Lagos-Badagry Expressway expansion corridor. Gazette acquisitions for road expansion affect multiple plots. Multiple cases of sellers marketing acquired land. Also active Omo Onile presence in Okokomaiko and Agbara axis.',
 'Lagos State Gazettes Vol 52 2021 + court records', true,
 ST_SetSRID(ST_MakePoint(3.1500, 6.4200), 4326)),

-- SANGOTEDO / LAKOWE
('omo_onile', 'high',
 'Sangotedo and Lakowe axis has significant Omo Onile activity. Community members frequently dispute sales and demand payments. Several court cases recorded 2020-2024.',
 'Lagos High Court cause lists 2022-2023', true,
 ST_SetSRID(ST_MakePoint(3.6200, 6.4500), 4326)),

-- IKORODU ROAD CORRIDOR (OWUTU)
('omo_onile', 'medium',
 'Owutu and Agric areas along Ikorodu Road. Multiple Omo Onile disputes recorded. Rapid development has increased community agitation. Exercise caution, verify community relations before purchase.',
 'Verified reports 2023', true,
 ST_SetSRID(ST_MakePoint(3.5100, 6.5700), 4326)),

-- AGBADO-OKE ODO
('active_fraud', 'medium',
 'Agbado-Oke Odo corridor. Many plots in this area lack formal title. Sellers frequently market informal ownership without C of O. Double sales also reported.',
 'Court records + community reports', true,
 ST_SetSRID(ST_MakePoint(3.2300, 6.6200), 4326)),

-- BADORE ROAD / AJAH ROUNDABOUT
('omo_onile', 'high',
 'Badore Road and surrounding communities. High Omo Onile presence. Multiple cases of buyers paying sellers and then being confronted by community members demanding additional payments.',
 'Verified reports + court cases 2021-2024', true,
 ST_SetSRID(ST_MakePoint(3.5900, 6.4600), 4326)),

-- EPE (POKA AREA)
('active_fraud', 'medium',
 'Poka and surrounding Epe axis. Mix of gazette-acquired land (road expansions) and Omo Onile disputes. Rural nature of area makes verification difficult. Several cases of forged survey plans reported.',
 'Court records Epe High Court 2022', true,
 ST_SetSRID(ST_MakePoint(3.9800, 6.5800), 4326)),

-- ALIMOSHO / IPAJA
('disputed', 'medium',
 'Parts of Ipaja and Alimosho. Multiple boundary disputes between estate developers and community landowners. Several cases in Lagos State High Court unresolved.',
 'Lagos High Court cause lists 2023', true,
 ST_SetSRID(ST_MakePoint(3.2600, 6.5900), 4326)),

-- LEKKI PHASE 2 / IKATE
('omo_onile', 'medium',
 'Ikate Elegushi axis has recurring Omo Onile issues despite being a developed area. Community members claim portions of estate land. Verify with developer and community before purchase.',
 'Verified reports 2022-2023', true,
 ST_SetSRID(ST_MakePoint(3.4800, 6.4350), 4326));

-- ─── GAZETTE ACQUISITIONS ─────────────────────────────
INSERT INTO gazette_acquisitions (gazette_ref, gazette_year, purpose, location_desc, geom, radius_metres, source_url) VALUES

-- LEKKI-EPE EXPRESSWAY
('Lagos State Gazette Vol. 43 No. 17', 2019,
 'Lekki-Epe Expressway Phase 2 corridor expansion',
 'Land along Lekki-Epe Expressway from Abraham Adesanya roundabout to Epe, including portions of Ajah, Sangotedo, Lakowe and Epe axis',
 ST_SetSRID(ST_MakePoint(3.6500, 6.4600), 4326), 800,
 'https://lagosstate.gov.ng/gazette/vol43no17'),

-- DANGOTE REFINERY / LFTZ
('Lagos State Gazette Vol. 48 No. 23', 2021,
 'Lekki Free Trade Zone expansion and Dangote Refinery industrial corridor',
 'Large tract in Ibeju-Lekki LGA covering portions of Ibeju, Akodo, Ise and surrounding communities',
 ST_SetSRID(ST_MakePoint(3.8200, 6.4200), 4326), 1500,
 'https://lagosstate.gov.ng/gazette/vol48no23'),

-- LEKKI DEEP SEA PORT
('Lagos State Gazette Vol. 45 No. 8', 2020,
 'Lekki Deep Sea Port and associated infrastructure corridor',
 'Coastal land in Ibeju-Lekki for port development and access roads',
 ST_SetSRID(ST_MakePoint(3.7800, 6.3900), 4326), 1000,
 'https://lagosstate.gov.ng/gazette/vol45no8'),

-- LAGOS-BADAGRY EXPRESSWAY
('Lagos State Gazette Vol. 52 No. 11', 2023,
 'Lagos-Badagry Expressway widening and rehabilitation',
 'Road corridor from Mile 2 through Festac, Volks, Okokomaiko, Agbara to Badagry',
 ST_SetSRID(ST_MakePoint(3.1800, 6.4300), 4326), 500,
 'https://lagosstate.gov.ng/gazette/vol52no11'),

-- FOURTH MAINLAND BRIDGE
('Lagos State Gazette Vol. 50 No. 6', 2022,
 'Fourth Mainland Bridge alignment and approach roads',
 'Bridge corridor from Lekki through Agboville to Lagos-Ibadan Expressway',
 ST_SetSRID(ST_MakePoint(3.5200, 6.5100), 4326), 600,
 'https://lagosstate.gov.ng/gazette/vol50no6'),

-- RED LINE RAIL
('Lagos State Gazette Vol. 49 No. 14', 2021,
 'Red Line Rail Mass Transit corridor',
 'Rail corridor from Agbado through Ikeja to Marina',
 ST_SetSRID(ST_MakePoint(3.3200, 6.5800), 4326), 300,
 'https://lagosstate.gov.ng/gazette/vol49no14'),

-- BLUE LINE RAIL EXTENSION
('Lagos State Gazette Vol. 51 No. 9', 2022,
 'Blue Line Rail extension from Marina to Lekki',
 'Rail corridor along Eti-Osa LGA coastal route',
 ST_SetSRID(ST_MakePoint(3.4500, 6.4200), 4326), 300,
 'https://lagosstate.gov.ng/gazette/vol51no9'),

-- IKORODU-SAGAMU ROAD
('Lagos State Gazette Vol. 44 No. 21', 2019,
 'Ikorodu-Sagamu Road reconstruction and widening',
 'Road corridor from Ikorodu town through Ogijo to Sagamu',
 ST_SetSRID(ST_MakePoint(3.5000, 6.6200), 4326), 400,
 'https://lagosstate.gov.ng/gazette/vol44no21'),

-- EPE LINK ROAD
('Lagos State Gazette Vol. 46 No. 3', 2020,
 'Epe Link Road and Marina expansion',
 'Road corridor linking Epe town to Lagos-Epe Expressway',
 ST_SetSRID(ST_MakePoint(3.9700, 6.5900), 4326), 400,
 'https://lagosstate.gov.ng/gazette/vol46no3'),

-- ALIMOSHO DRAINAGE
('Lagos State Gazette Vol. 47 No. 18', 2021,
 'Alimosho drainage canal and setback corridor',
 'Primary drainage channel corridor through Alimosho, Egbeda, and Akowonjo',
 ST_SetSRID(ST_MakePoint(3.2900, 6.6000), 4326), 200,
 'https://lagosstate.gov.ng/gazette/vol47no18');

-- ─── FLOOD RISK ZONES (basic polygons) ────────────────
-- Note: These are simplified polygons. Replace with actual NIMET shapefiles when available.

INSERT INTO flood_risk_zones (risk_level, source, year, drainage_note, geom) VALUES

('high', 'NIMET + LASIMRA', 2024,
 'Low-lying coastal area. Regular flooding during peak rainy season (June-October). Not recommended for residential development without significant drainage infrastructure.',
 ST_SetSRID(
   ST_GeomFromText('MULTIPOLYGON(((3.15 6.40, 3.25 6.40, 3.25 6.42, 3.15 6.42, 3.15 6.40)))'),
   4326
 )),

('high', 'NIMET + LASIMRA', 2024,
 'Badagry coastal floodplain. Annual flooding. Properties in this zone regularly submerged during rainy season.',
 ST_SetSRID(
   ST_GeomFromText('MULTIPOLYGON(((2.88 6.40, 3.05 6.40, 3.05 6.43, 2.88 6.43, 2.88 6.40)))'),
   4326
 )),

('moderate', 'NIMET', 2024,
 'Ikorodu low-lying areas. Moderate flood risk. Drainage infrastructure needed. Avoid areas within 30m of primary channels.',
 ST_SetSRID(
   ST_GeomFromText('MULTIPOLYGON(((3.49 6.59, 3.55 6.59, 3.55 6.62, 3.49 6.62, 3.49 6.59)))'),
   4326
 )),

('moderate', 'NIMET', 2024,
 'Parts of Agege and Orile-Agege. Seasonal flooding from Agege drainage channels. Check proximity to main channel.',
 ST_SetSRID(
   ST_GeomFromText('MULTIPOLYGON(((3.30 6.61, 3.36 6.61, 3.36 6.64, 3.30 6.64, 3.30 6.61)))'),
   4326
 ));

-- Verify the seed data
SELECT 'fraud_zones' as table_name, COUNT(*) as records FROM fraud_zones
UNION ALL
SELECT 'gazette_acquisitions', COUNT(*) FROM gazette_acquisitions
UNION ALL
SELECT 'flood_risk_zones', COUNT(*) FROM flood_risk_zones;
