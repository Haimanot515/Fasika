CREATE TABLE farmer_profiles (
  farmer_profile_id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  profile_image_url TEXT,
  gender VARCHAR(10),
  date_of_birth DATE,
  preferred_language VARCHAR(20),
  farm_experience_years INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
