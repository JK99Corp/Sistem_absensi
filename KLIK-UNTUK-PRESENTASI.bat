@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sistem Absensi Jaya Kedhaton - Server Absensi Digital

echo ========================================================
echo   SISTEM ABSENSI JAYA KEDHATON (KEDHATON GROUP)
echo ========================================================
echo.
echo Sedang menyiapkan server presentasi lokal...
echo.

set "NODE_CMD=node"
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [INFO] Node.js tidak terdeteksi. Membuka versi presentasi statis...
        start "" "%~dp0preview\dashboard.html"
        pause
        exit /b
    )
)

echo [OK] Node.js siap.
echo [OK] Menjalankan server di http://localhost:8000 ...
echo [OK] Membuka browser...
echo.
echo ========================================================
echo  JANGAN TUTUP JENDELA INI SELAMA PRESENTASI BERLANGSUNG
echo  (Tekan Ctrl+C jika ingin mematikan server)
echo ========================================================
echo.

start "" http://localhost:8000/dashboard
"%NODE_CMD%" server.js

if %errorlevel% neq 0 (
    echo.
    echo Server terhenti. Membuka versi pratinjau cadangan...
    start "" "%~dp0preview\dashboard.html"
)

pause
