# =============================================================
# Setup Completo — Catalogo Digital
# Execute: powershell -ExecutionPolicy Bypass -File setup.ps1
# =============================================================
$ErrorActionPreference = "Continue"
$BASE = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  SETUP - CATALOGO DIGITAL" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# ── 1. Criar .env do backend ──────────────────────────────────
Write-Host "[1/4] Configurando variaveis de ambiente do backend..." -ForegroundColor Yellow

if (-not (Test-Path "$BASE\backend\.env")) {
    Copy-Item "$BASE\backend\.env.example" "$BASE\backend\.env"
    Write-Host "      .env criado em backend/" -ForegroundColor Green
    Write-Host "      IMPORTANTE: edite backend\.env com suas credenciais do banco!" -ForegroundColor Red
} else {
    Write-Host "      backend\.env ja existe, pulando." -ForegroundColor Green
}

# ── 2. Criar .env.local do frontend ──────────────────────────
Write-Host "[2/4] Configurando variaveis de ambiente do frontend..." -ForegroundColor Yellow

if (-not (Test-Path "$BASE\frontend\.env.local")) {
    Copy-Item "$BASE\frontend\.env.example" "$BASE\frontend\.env.local"
    Write-Host "      .env.local criado em frontend/" -ForegroundColor Green
} else {
    Write-Host "      frontend\.env.local ja existe, pulando." -ForegroundColor Green
}

# ── 3. Instalar dependencias ──────────────────────────────────
Write-Host "[3/4] Instalando dependencias do backend..." -ForegroundColor Yellow
Set-Location "$BASE\backend"
npm install
Write-Host "      Backend OK" -ForegroundColor Green

Write-Host "      Instalando dependencias do frontend..." -ForegroundColor Yellow
Set-Location "$BASE\frontend"
yarn install
Write-Host "      Frontend OK" -ForegroundColor Green

# ── 4. Banco de dados ─────────────────────────────────────────
Write-Host "[4/4] Configurando banco de dados..." -ForegroundColor Yellow

$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)
$psqlExe = $psqlPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($psqlExe) {
    $env:PGPASSWORD = "postgres"
    & $psqlExe -U postgres -c "CREATE DATABASE catalogo_digital;" 2>&1 | Out-Null
    & $psqlExe -U postgres -d catalogo_digital -f "$BASE\database\migrations.sql" 2>&1
    & $psqlExe -U postgres -d catalogo_digital -f "$BASE\database\seeds.sql" 2>&1
    Write-Host "      Banco configurado!" -ForegroundColor Green
} else {
    Write-Host "      PostgreSQL nao encontrado. Configure o banco manualmente." -ForegroundColor Red
    Write-Host "      Veja o arquivo COMO_RODAR.md para instrucoes." -ForegroundColor Red
}

# ── Resumo ────────────────────────────────────────────────────
Set-Location $BASE
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  SETUP CONCLUIDO!" -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Cyan
Write-Host "Para rodar o projeto, abra 2 terminais:" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    npm run dev     <- porta 4000" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    yarn dev        <- porta 3000" -ForegroundColor White
Write-Host ""
Write-Host "  Acesse: http://localhost:3000/catalogo" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Contas de teste:" -ForegroundColor Yellow
Write-Host "    Empresa: admin@catalogo.com / Admin@123" -ForegroundColor White
Write-Host "    Cliente: user@catalogo.com  / User@123" -ForegroundColor White
Write-Host ""
