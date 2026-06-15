# Como Rodar o Projeto

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm + yarn (`npm install -g yarn`)

---

## Setup Rápido (Recomendado)

Clone o repositório e execute o script de setup:

```powershell
git clone https://github.com/Narahq1/catalogo_digital.git
cd catalogo_digital
powershell -ExecutionPolicy Bypass -File setup.ps1
```

O script instala tudo automaticamente. Depois disso:

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
yarn dev
```

---

## Setup Manual (passo a passo)

### 1. Variáveis de Ambiente

```powershell
# Backend
copy backend\.env.example backend\.env

# Frontend
copy frontend\.env.example frontend\.env.local
```

Abra `backend\.env` e preencha:

```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_digital
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
JWT_SECRET=qualquer_string_longa_e_secreta
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=SEU_CLIENT_ID
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
SESSION_SECRET=outra_string_secreta
```

### 2. Banco de Dados

```powershell
# Criar banco
psql -U postgres -c "CREATE DATABASE catalogo_digital;"

# Rodar migrations
psql -U postgres -d catalogo_digital -f database\migrations.sql

# Rodar seeds (dados iniciais)
psql -U postgres -d catalogo_digital -f database\seeds.sql
```

### 3. Instalar Dependências

```powershell
cd backend && npm install
cd ..\frontend && yarn install
```

### 4. Rodar

```powershell
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
yarn dev
```

---

## URLs de Acesso

| Página | URL |
|--------|-----|
| Catálogo público | http://localhost:3000/catalogo |
| Login | http://localhost:3000/login |
| Cadastro | http://localhost:3000/cadastro |
| Dashboard (empresa) | http://localhost:3000/dashboard |
| Gerenciar produtos | http://localhost:3000/dashboard/produtos |

## Contas de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Empresa (Admin) | admin@catalogo.com | Admin@123 |
| Cliente | user@catalogo.com | User@123 |

---

## Solução de Problemas Comuns

**Erro de conexão com banco / login não funciona**
→ O arquivo `backend\.env` não existe ou está incompleto.
→ Copie `backend\.env.example` para `backend\.env` e preencha as credenciais.

**Dashboard redireciona para login**
→ Normal se você não fez login. Use as credenciais acima.
→ Clientes são redirecionados para `/catalogo` automaticamente.

**Porta já em uso**
→ Mude `PORT=4000` no `backend\.env` e atualize `NEXT_PUBLIC_API_URL` no `frontend\.env.local`.
