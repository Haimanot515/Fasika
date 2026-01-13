CREATE TABLE languages (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,   -- am, om, ti, en
  name VARCHAR(50) NOT NULL,          -- Amharic, Afaan Oromo
  local_name VARCHAR(50),             -- አማርኛ, Afaan Oromoo
  is_active BOOLEAN DEFAULT true
);
