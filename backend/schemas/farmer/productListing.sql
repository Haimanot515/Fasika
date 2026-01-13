CREATE TABLE marketplace_listings (
  listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  seller_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  -- Section A: Product Identity
  product_category VARCHAR(30) NOT NULL
    CHECK (product_category IN ('CROPS','LIVESTOCK','DAIRY','POULTRY','INPUTS','PROCESSED')),

  product_name VARCHAR(100) NOT NULL,
  variety_or_breed VARCHAR(100),

  -- Dynamic Attributes (JSON for flexibility)
  dynamic_attributes JSONB,

  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL
    CHECK (unit IN ('KG','QUINTAL','LITER','PIECE','HEAD','CRATE','BERCHA')),

  -- Section B: Quality & Pricing
  quality_grade VARCHAR(30)
    CHECK (quality_grade IN ('STANDARD','GRADE_1','ORGANIC','EXPORT','ECX')),

  price_per_unit NUMERIC(12,2) NOT NULL CHECK (price_per_unit > 0),
  negotiability VARCHAR(20)
    CHECK (negotiability IN ('FIXED','NEGOTIABLE','AUCTION')),

  bulk_discount JSONB,

  -- Section C: Location & Availability
  region VARCHAR(50) NOT NULL,
  zone VARCHAR(50),
  woreda VARCHAR(50),
  kebele VARCHAR(50),

  availability_start_ec DATE NOT NULL,
  availability_end_ec DATE,

  -- Section D: Logistics
  delivery_option VARCHAR(30) NOT NULL
    CHECK (delivery_option IN ('PICKUP','LOCAL_DELIVERY','NATIONAL_SHIPPING','BOTH')),

  delivery_radius_km INTEGER,
  transport_provided BOOLEAN DEFAULT false,
  storage_condition VARCHAR(30)
    CHECK (storage_condition IN ('AMBIENT','COLD_STORAGE','COOP_WAREHOUSE','ECX_SILO')),

  packaging_type VARCHAR(50),

  -- Section E: Seller Info Snapshot
  seller_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100),
  cooperative_name VARCHAR(150),
  certifications JSONB,

  -- Section F: Media
  primary_image_url TEXT NOT NULL,
  gallery_urls TEXT[],
  video_url TEXT,
  document_urls TEXT[],

  -- Status & Metadata
  status VARCHAR(20) DEFAULT 'ACTIVE'
    CHECK (status IN ('DRAFT','ACTIVE','SOLD_OUT','EXPIRED','SUSPENDED')),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
