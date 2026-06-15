# Como Rodar o Projeto

## Pré-requisitos

- Node.js 18+
- PostgreSQL instalado e rodando
- npm ou yarn

---

## Passo 1 — Banco de Dados

Abra o terminal do PostgreSQL (psql) e execute:

```sql
CREATE DATABASE catalogo_digital;
```

Depois rode os scripts SQL nesta ordem:

```bash
psql -U postgres -d catalogo_digital -f database/migrations.sql
psql -U postgres -d catalogo_digital -f database/seeds.sql
```

Se sua senha do postgres for diferente de "postgres", edite também `backend/.env`.

---

## Passo 2 — Backend (API)

```bash
cd backend
npm install
npm run dev
```

A API estará disponível em: **http://localhost:4000**

---

## Passo 3 — Frontend (Interface)

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O site estará disponível em: **http://localhost:3000**

---

## Telas disponíveis

| URL                        | Descrição                    |
|----------------------------|------------------------------|
| http://localhost:3000/catalogo   | Catálogo público (clientes)  |
| http://localhost:3000/login      | Login do administrador       |
| http://localhost:3000/cadastro   | Cadastro de nova conta       |
| http://localhost:3000/dashboard  | Dashboard com métricas       |
| http://localhost:3000/dashboard/produtos | Gestão de produtos  |

---

## Contas de Teste (já no banco via seeds)

| Tipo  | Email               | Senha      |
|-------|---------------------|------------|
| Admin | admin@catalogo.com  | Admin@123  |
| User  | user@catalogo.com   | User@123   |

---

## Estrutura de Arquivos

```
catalogo_digital_/
├── database/
│   ├── migrations.sql     # Cria as tabelas
│   └── seeds.sql          # Dados iniciais (2 usuários + 4 produtos)
│
├── backend/
│   ├── .env               # Variáveis de ambiente (já configurado para dev)
│   ├── .env.example       # Template
│   ├── package.json
│   └── src/
│       ├── server.js      # Ponto de entrada
│       ├── app.js         # Express + middlewares + rotas
│       ├── config/db.js   # Pool do PostgreSQL
│       ├── middlewares/
│       │   └── auth.middleware.js    # JWT + roles
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── product.controller.js
│       │   └── dashboard.controller.js
│       └── routes/
│           ├── auth.routes.js
│           ├── product.routes.js
│           └── dashboard.routes.js
│
└── frontend/
    ├── .env.local         # URL da API
    ├── .env.example       # Template
    ├── package.json
    ├── tailwind.config.ts
    ├── next.config.ts
    └── src/
        ├── styles/globals.css
        ├── lib/
        │   ├── api.ts     # Axios configurado
        │   └── auth.ts    # Helpers de autenticação
        ├── components/
        │   ├── Logo.tsx
        │   ├── Sidebar.tsx
        │   ├── ProductCard.tsx
        │   ├── ProductFormModal.tsx
        │   └── EmptyState.tsx
        └── app/
            ├── layout.tsx
            ├── page.tsx             # Redireciona para /catalogo
            ├── login/page.tsx       # Tela 1: Login
            ├── cadastro/page.tsx    # Tela 2: Cadastro
            ├── catalogo/page.tsx    # Tela 4+5: Catálogo público + busca
            └── dashboard/
                ├── layout.tsx       # Guard de autenticação + Sidebar
                ├── page.tsx         # Tela 3: Dashboard com gráficos
                └── produtos/
                    └── page.tsx     # Tela 6: Gestão de produtos
```
