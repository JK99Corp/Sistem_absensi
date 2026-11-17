#!/bin/bash
# PT. Jaya Kedhaton Enterprise System
# One-Click Launcher for macOS (Finder Double-Clickable)

cd "$(dirname "$0")"

echo "========================================================"
echo "  SISTEM ABSENSI JAYA KEDHATON (KEDHATON GROUP) - macOS"
echo "========================================================"
echo ""
echo "Sedang menyiapkan server presentasi lokal..."
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[INFO] Node.js tidak terdeteksi di macOS. Membuka versi pratinjau statis..."
    open "preview/dashboard.html"
    exit 0
fi

echo "[OK] Node.js siap."
echo "[OK] Menjalankan server di http://localhost:8000 ..."
echo "[OK] Membuka browser..."
echo ""
echo "========================================================"
echo " JANGAN TUTUP JENDELA TERMINAL INI SELAMA PRESENTASI"
echo " (Tekan Ctrl+C jika ingin mematikan server)"
echo "========================================================"
echo ""

# Buka browser setelah jeda 1 detik agar server siap
(sleep 1 && open "http://localhost:8000/dashboard") &
node server.js

if [ $? -ne 0 ]; then
    echo ""
    echo "Server terhenti. Membuka versi pratinjau cadangan..."
    open "preview/dashboard.html"
fi
