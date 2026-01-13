-- Buyer Profiles Table (linked to users)
CREATE TABLE buyer_profiles (
    buyer_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to main users table
    user_id UUID UNIQUE NOT NULL 
        REFERENCES users(id) ON DELETE CASCADE,

    -- Profile nickname / display name and avatar
    username VARCHAR(50),                        -- editable profile nickname / display name
    profile_image_url TEXT,                       -- URL of buyer profile photo

    -- Business / organization info
    buyer_type VARCHAR(30) DEFAULT 'Individual',  -- Individual / Trader / Company
    organization_name VARCHAR(150),               -- optional for individuals
    business_type VARCHAR(50),                    -- e.g., Wholesale, Retail, Export
    company_registration_number VARCHAR(50),
    tax_id VARCHAR(50),                           -- optional tax number

    -- Contact info
    contact_person VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    preferred_language VARCHAR(20) DEFAULT 'English',

    -- Financial info
    rating NUMERIC(3,2) DEFAULT 0.00,            -- buyer rating
    credit_limit NUMERIC(15,2) DEFAULT 0.00,
    payment_terms VARCHAR(50),                    -- e.g., Cash, Credit 30 days
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),

    -- Preferences
    preferred_crops TEXT[],                       -- array of crop names or categories

    -- Operational info
    trading_experience_years INT DEFAULT 0,

    -- Profile timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE buyer_profiles IS 
'Stores buyer-specific profile nickname, profile image, business, financial, operational, and contact information, fully independent of users table.';
