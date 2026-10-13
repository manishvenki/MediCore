# MediCore PowerShell Launcher
Clear-Host
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  MEDICORE - Healthcare Management Platform" -ForegroundColor White
Write-Host "  Healthcare Management, Simplified." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verify node installation
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not found in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$workspaceDir = $PSScriptRoot

Write-Host "[1/3] Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$workspaceDir\server`"; npm run dev"

Write-Host "[2/3] Starting Frontend Client (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$workspaceDir\client`"; npm run dev"

Write-Host "[3/3] Waiting 4 seconds for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "Opening MediCore portal in default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  MediCore is running successfully!" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "  Health:   http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host ""
Write-Host "  Demo Credentials:" -ForegroundColor Yellow
Write-Host "  Email:    admin@medicore.com" -ForegroundColor White
Write-Host "  Password: Admin@123" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan
