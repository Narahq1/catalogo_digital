-- =============================================================
-- Catálogo Digital Minimalista — Seeds (dados iniciais)
-- Senhas geradas com bcrypt cost=10
--   admin@catalogo.com  → Admin@123
--   user@catalogo.com   → User@123
-- =============================================================

INSERT INTO users (id, name, email, password_hash, role) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Administrador Sistema',
    'admin@catalogo.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Usuário Padrão',
    'user@catalogo.com',
    '$2b$10$TBZ5J2lER8QJVg1C.nrEOO5m5L7IHqhKMBREi0YcMEFiWRNFq3K0a',
    'user'
)
ON CONFLICT (email) DO NOTHING;

-- Produtos de exemplo vinculados ao admin
INSERT INTO products (user_id, name, description, price, image_url, category) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Plano Starter',
    'Ideal para startups em fase inicial. Inclui painel de controle, suporte por e-mail e até 3 usuários.',
    99.90,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    'Planos'
),
(
    'a0000000-0000-0000-0000-000000000001',
    'Plano Growth',
    'Para empresas em expansão. Usuários ilimitados, relatórios avançados e suporte prioritário.',
    299.90,
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    'Planos'
),
(
    'a0000000-0000-0000-0000-000000000001',
    'Consultoria Express',
    'Sessão de 2h com especialista em growth hacking para alavancar seu negócio digital.',
    450.00,
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    'Serviços'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Landing Page Profissional',
    'Design e desenvolvimento de landing page de alta conversão com integração a CRM.',
    1200.00,
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
    'Serviços'
);
