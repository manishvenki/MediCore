@echo off
title MediCore Healthcare Launcher
cls

echo ============================================================
echo   MEDICORE - Healthcare Management Platform
echo   Healthcare Management, Simplified.
echo ============================================================
echo.
echo Starting MediCore Backend API and Frontend Client...
echo.

REM Verify Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Launching Backend Server on port 5000...
start "MediCore Server API (Port 5000)" cmd /k "cd server && npm run dev"

echo [2/3] Launching Frontend Client on port 5173...
start "MediCore Client App (Port 5173)" cmd /k "cd client && npm run dev"

echo [3/3] Opening MediCore in browser (waiting 4 seconds for bootstrap)...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ============================================================
echo   MediCore is now running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   Health:   http://localhost:5000/api/health
echo.
echo   Demo Admin Credentials:
echo   Email:    admin@medicore.com
echo   Password: Admin@123
echo ============================================================
echo.
echo You can keep this window open or close it. The servers are running
echo in their own dedicated terminal windows.
pause
