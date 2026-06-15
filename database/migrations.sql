-- =============================================================
-- Catálogo Digital Minimalista — Script de Migração
-- =============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- Tabela: users (Administradores)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user'
                  CHECK (role IN ('admin', 'user')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Tabela: products (Produtos do catálogo)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    price       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    image_url   TEXT,
    category    VARCHAR(100),
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------------
-- Tabela: analytics (Métricas de visualização)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics (
    id               BIGSERIAL    PRIMARY KEY,
    product_id       UUID         REFERENCES products(id) ON DELETE SET NULL,
    viewed_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    visitor_ip_hash  VARCHAR(64)
);

-- Índices para melhorar performance das consultas de dashboard
CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_viewed_at  ON analytics(viewed_at);
CREATE INDEX IF NOT EXISTS idx_products_user_id     ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
