#!/bin/bash
# ==============================================================================
# PT. JAYA KEDHATON ENTERPRISE - macOS SETUP & AI SKILL SYNCHRONIZER
# Menyiapkan dependensi, memasang ECC global plugin, dan memverifikasi sistem
# ==============================================================================

set -e

echo ""
echo "=================================================================="
echo "🏛️  SETUP SISTEM ABSENSI DIGITAL PT. JAYA KEDHATON (macOS)"
echo "=================================================================="
echo ""

# 1. Periksa Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ [ERROR] Node.js belum terpasang di Mac Anda."
    echo "   Silakan pasang Node.js (v18 ke atas) dari: https://nodejs.org"
    exit 1
fi

NODE_VER=$(node -v)
echo "✅ [1/4] Node.js terdeteksi: $NODE_VER"

# 2. Pasang dependensi proyek
echo "⏳ [2/4] Menginstal dependensi proyek..."
npm install --no-audit --no-fund

# 3. Sinkronisasi Plugin ECC Global ke Antigravity macOS
ECC_TARGET_DIR="$HOME/.gemini/config/plugins/ecc"
echo "⏳ [3/4] Memeriksa AI Skill Plugin ECC di Antigravity Mac..."

if [ -d "$ECC_TARGET_DIR" ] && [ -f "$ECC_TARGET_DIR/plugin.json" ]; then
    echo "✅ [3/4] Plugin ECC sudah aktif di: $ECC_TARGET_DIR"
else
    echo "📦 [3/4] Memasang ECC Global Plugin (312 Skills, 72 Agents, 122 Rules)..."
    TMP_ECC_DIR=$(mktemp -d)
    git clone --depth 1 https://github.com/affaan-m/ECC.git "$TMP_ECC_DIR" >/dev/null 2>&1
    
    cd "$TMP_ECC_DIR"
    npm install --ignore-scripts --no-audit --no-fund --loglevel=error >/dev/null 2>&1
    node scripts/install-apply.js --target antigravity-home --profile full --no-hooks >/dev/null 2>&1
    cd - >/dev/null
    
    rm -rf "$TMP_ECC_DIR"
    echo "✅ [3/4] Plugin ECC berhasil dipasang ke: $ECC_TARGET_DIR"
fi

# 4. Jalankan 4-Layer Test Suite
echo "⏳ [4/4] Menjalankan verifikasi sistem menyeluruh..."
npm run test:all

echo ""
echo "=================================================================="
echo "✨ SETUP SELESAI! Mac Anda sudah 100% siap dan setara dengan Windows."
echo "👉 Untuk menjalankan web: klik 2x 'KLIK-UNTUK-PRESENTASI.command'"
echo "   atau jalankan perintah: npm start"
echo "=================================================================="
echo ""
