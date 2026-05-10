-- Active RLS
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wilaya_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;

-- Politiques : lecture publique pour les tables non sensibles
CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public read" ON config FOR SELECT USING (true);
CREATE POLICY "Public read" ON promos FOR SELECT USING (true);
CREATE POLICY "Public read" ON wilaya_pricing FOR SELECT USING (true);
CREATE POLICY "Public read" ON settings FOR SELECT USING (true);

-- Tables
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  arabic VARCHAR(100),
  badge VARCHAR(100),
  price INT NOT NULL CHECK (price >= 0),
  img TEXT,
  img_before TEXT,
  img_after TEXT,
  img2 TEXT,
  img3 TEXT,
  description TEXT,
  util TEXT,
  dose TEXT,
  inst TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  thresh INT NOT NULL DEFAULT 3000,
  title TEXT NOT NULL DEFAULT 'Goutte Verte',
  description TEXT DEFAULT '',
  bg TEXT DEFAULT 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
  logo TEXT DEFAULT '',
  remote_config_url TEXT DEFAULT '',
  upsells JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO config (id, thresh, title, description, bg, logo, upsells) VALUES
(1, 3000, 'Goutte Verte', 'Soins premium pour vos plantes d''intérieur.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop', '',
 '[{"id":"reflet","label":"REFLET — Lustrant foliaire","price":350,"emoji":"✨"},{"id":"gift","label":"Emballage Cadeau Premium","price":200,"emoji":"🎁"}]')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  client TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  address TEXT NOT NULL,
  products TEXT NOT NULL,
  total TEXT NOT NULL,
  delivery TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  tg_notified BOOLEAN DEFAULT FALSE,
  utm TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promos (
  id TEXT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('fixed','percent')),
  value INT NOT NULL CHECK (value > 0),
  min_cart INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wilaya_pricing (
  wilaya_code INT PRIMARY KEY,
  price INT NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO settings (key, value) VALUES
  ('tg_token', ''), ('tg_chat', ''), ('meta_pixel', ''), ('meta_capi', ''),
  ('tiktok_pixel', ''), ('ga4_id', ''), ('wa_phone', ''),
  ('wa_msg', 'Bonjour, je souhaite me renseigner sur vos produits Goutte Verte 🌿'),
  ('wa_show', '1'), ('api_livraison', ''), ('api_key', ''), ('api_auto', '0')
ON CONFLICT (key) DO NOTHING;

-- Insérer les 58 wilayas avec tarifs par défaut
INSERT INTO wilaya_pricing (wilaya_code, price) VALUES
(1,1000),(2,800),(3,900),(4,800),(5,800),(6,800),(7,900),(8,1000),
(9,500),(10,500),(11,1200),(12,850),(13,850),(14,800),(15,500),
(16,400),(17,900),(18,800),(19,800),(20,850),(21,800),(22,850),
(23,800),(24,800),(25,800),(26,500),(27,800),(28,800),(29,800),
(30,1000),(31,800),(32,1000),(33,1200),(34,800),(35,500),(36,800),
(37,1200),(38,800),(39,1000),(40,800),(41,800),(42,500),(43,800),
(44,600),(45,1000),(46,850),(47,1000),(48,800),(49,1000),(50,1200),
(51,1000),(52,1000),(53,1200),(54,1200),(55,1000),(56,1200),(57,1000),(58,1200)
ON CONFLICT (wilaya_code) DO NOTHING;