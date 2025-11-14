CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uma_musumes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  rarity VARCHAR(50),
  speed INTEGER,
  stamina INTEGER,
  power INTEGER,
  guts INTEGER,
  intelligence INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
