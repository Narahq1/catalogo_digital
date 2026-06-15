# =============================================================
# Setup Completo — Catalogo Digital
# =============================================================
$ErrorActionPreference = "Continue"
$BASE = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n=== CONFIGURANDO NPM ===" -ForegroundColor Cyan
npm config set fetch-retry-mintimeout 60000
npm config set fetch-retry-maxtimeout 600000
npm config set fetch-retries 10
npm config set fetch-timeout 600000
Write-Host "npm configurado." -ForegroundColor Green

# ── POSTGRESQL ────────────────────────────────────────────────
Write-Host "`n=== VERIFICANDO POSTGRESQL ===" -ForegroundColor Cyan
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe"
)
$psqlExe = $null
foreach ($p in $psqlPaths) {
    if (Test-Path $p) { $psqlExe = $p; break }
}

if ($psqlExe) {
    Write-Host "psql encontrado: $psqlExe" -ForegroundColor Green
    $env:PGPASSWORD = "postgres"
    $env:PATH = "$env:PATH;$(Split-Path $psqlExe)"

    Write-Host "Criando banco catalogo_digital..." -ForegroundColor Yellow
    & $psqlExe -U postgres -c "CREATE DATABASE catalogo_digital;" 2>&1 | Out-Null
    
    Write-Host "Executando migrations..." -ForegroundColor Yellow
    & $psqlExe -U postgres -d catalogo_digital -f "$BASE\database\migrations.sql" 2>&1
    
    Write-Host "Executando seeds..." -ForegroundColor Yellow
    & $psqlExe -U postgres -d catalogo_digital -f "$BASE\database\seeds.sql" 2>&1
    
    Write-Host "Banco de dados configurado!" -ForegroundColor Green
    
    # Atualizar .env com path correto
    $pgBin = Split-Path $psqlExe
} else {
    Write-Host "PostgreSQL nao encontrado em caminhos padrao." -ForegroundColor Yellow
    Write-Host "Tentando encontrar no PATH..." -ForegroundColor Yellow
    $found = Get-Command psql -ErrorAction SilentlyContinue
    if ($found) {
        Write-Host "psql no PATH: $($found.Source)" -ForegroundColor Green
        $env:PGPASSWORD = "postgres"
        & psql -U postgres -c "CREATE DATABASE catalogo_digital;" 2>&1 | Out-Null
        & psql -U postgres -d catalogo_digital -f "$BASE\database\migrations.sql" 2>&1
        & psql -U postgres -d catalogo_digital -f "$BASE\database\seeds.sql" 2>&1
        Write-Host "Banco de dados configurado!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: PostgreSQL nao encontrado. Configure o banco manualmente." -ForegroundColor Red
    }
}

# ── BACKEND ───────────────────────────────────────────────────
Write-Host "`n=== INSTALANDO DEPENDENCIAS DO BACKEND ===" -ForegroundColor Cyan
Set-Location "$BASE\backend"
if (-not (Test-Path "node_modules\express")) {
    npm install
} else {
    Write-Host "Backend ja instalado." -ForegroundColor Green
}

# ── FRONTEND ──────────────────────────────────────────────────
Write-Host "`n=== INSTALANDO DEPENDENCIAS DO FRONTEND ===" -ForegroundColor Cyan
Set-Location "$BASE\frontend"
if (-not (Test-Path "node_modules\next")) {
    Write-Host "Instalando frontend (pode demorar alguns minutos)..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Frontend ja instalado." -ForegroundColor Green
}

Write-Host "`n=== SETUP CONCLUIDO ===" -ForegroundColor Green
Write-Host "Para rodar o sistema:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend && npm run dev    (porta 4000)" -ForegroundColor White
Write-Host "  Frontend: cd frontend && npm run dev   (porta 3000)" -ForegroundColor White
Set-Location $BASE
