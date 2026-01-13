-- ───── ENUMS ─────
CREATE TYPE account_status_enum AS ENUM ('Pending', 'Active', 'Suspended', 'Banned');
CREATE TYPE verification_method_enum AS ENUM ('EMAIL', 'SMS', 'VOICE');
CREATE TYPE mfa_status_enum AS ENUM ('Pending', 'Enabled', 'Disabled');

-- ───── USERS TABLE ─────
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,               -- Public identifier
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash TEXT,

    role VARCHAR(50) NOT NULL,                         -- 'Farmer', 'Buyer', 'Admin'
    account_status account_status_enum NOT NULL DEFAULT 'Pending',

    token_version INT DEFAULT 1,                       -- For JWT invalidation

    -- ───── Verification / OTP ─────
    verification_method verification_method_enum,
    verification_code_hash TEXT,
    verification_jti VARCHAR(50),
    verification_expires TIMESTAMP,
    verification_attempts INT DEFAULT 5,
    verification_used_at TIMESTAMP,
    last_otp_sent_at TIMESTAMP,
    pending_count INT DEFAULT 0,

    -- ───── MFA ─────
    mfa_status mfa_status_enum DEFAULT 'Pending',
    mfa_methods TEXT[] DEFAULT '{}',                   -- ['OTP','PIN','Biometric','QR']

    -- ───── Password Reset ─────
    reset_code_hash TEXT,
    reset_expires TIMESTAMP,
    reset_attempts INT DEFAULT 5,
    last_reset_sent_at TIMESTAMP,
    reset_required BOOLEAN DEFAULT FALSE,

    -- ───── Login Security ─────
    failed_login_attempts INT DEFAULT 0,
    failed_attempts_reset_at TIMESTAMP,
    failed_change_password_attempts INT DEFAULT 0,
    last_password_reset_at TIMESTAMP,

    -- ───── Security Questions / MFA Extras ─────
    security_question_1_hash TEXT,
    security_question_2_hash TEXT,
    security_question_3_hash TEXT,
    biometric_enabled BOOLEAN DEFAULT FALSE,
    qr_enabled BOOLEAN DEFAULT FALSE,
    qr_last_verified TIMESTAMP,

    -- ───── COMMON CONSENTS (REQUIRED AT REGISTRATION) ─────
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    privacy_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    communication_consent BOOLEAN NOT NULL DEFAULT FALSE,
    platform_rules_accepted BOOLEAN NOT NULL DEFAULT FALSE,

    general_consented_at TIMESTAMP,
    consent_ip VARCHAR(64),
    consent_user_agent TEXT,

    -- ───── Suspension / Ban ─────
    suspension_end TIMESTAMP,

    -- ───── Timestamps ─────
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ───── USER CONSENTS TABLE ─────
CREATE TABLE user_consents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    consent_type VARCHAR(50),
    accepted BOOLEAN,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ───── INDEXES ─────
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
CREATE UNIQUE INDEX idx_users_email ON users(email);
