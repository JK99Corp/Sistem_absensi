# Sistem Absensi Digital Dual-ESP32 PT. Jaya Kedhaton

[![Enterprise CI Pipeline](https://github.com/JK99Corp/Sistem_absensi/actions/workflows/ci.yml/badge.svg)](https://github.com/JK99Corp/Sistem_absensi/actions)
![Node Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-emerald)
![Security Audit](https://img.shields.io/badge/Security_Audit-100%25_PASS-success)
![Architecture](https://img.shields.io/badge/Architecture-Clean_Layered_(Enterprise)-blue)
![Platform](https://img.shields.io/badge/Platform-Windows_%7C_macOS_%7C_Linux-indigo)

Platform terintegrasi absensi digital, monitoring perangkat Dual-ESP32 (RFID RC522 + Kamera ESP32-S3 OV5640), transaksi upah tukang & staf multi-proyek, kalkulasi kasbon & transfer, dan agregasi pengeluaran per proyek konstruksi **PT. Jaya Kedhaton**.

---

## 🚀 Panduan Membuka & Menjalankan Aplikasi

Aplikasi ini bersifat **Cross-Platform** dan mendukung **Dual-Mode** (Mode Server Interaktif dan Mode Pratinjau Statis Offline).

### 🖥️ Di Komputer Windows (1-Click)
Cukup **klik ganda (double-click)** file:
👉 **`KLIK-UNTUK-PRESENTASI.bat`**  
Server otomatis aktif dan browser default langsung terbuka ke `http://localhost:8000/dashboard`.

### 🍎 Di Komputer Mac / macOS (1-Click)
Cukup **klik ganda (double-click)** file di Finder:
👉 **`KLIK-UNTUK-PRESENTASI.command`**  
Terminal Mac akan otomatis mengaktifkan server lokal dan membuka browser Safari/Chrome.

### 🌐 Mode Offline (Tanpa Server / Standalone HTML)
Jika komputer tidak memiliki koneksi atau Node.js:
1. Buka folder **`preview/`**.
2. Klik ganda salah satu file:
   - `preview/dashboard.html` (Monitoring kehadiran & KPI)
   - `preview/upah.html` (Form transaksi upah & cetak slip gaji)
   - `preview/laporan-proyek.html` (Laporan pengeluaran per proyek)

---

## 🛠️ Perintah CLI & Pengujian Kualitas

```bash
# 1. Menjalankan server aplikasi
npm start

# 2. Menjalankan SELURUH suite pengujian otomasi (Syntax + Functional + Security + Integration)
npm run test:all

# 3. Pengujian spesifik
npm test                    # Pengujian fungsional backend & 10 bugfix patch
npm run test:security       # Pengujian ketahanan siber & penetrasi (28 skenario serangan)
npm run test:comprehensive  # Pengujian integrasi mendalam seluruh domain logic & API
```

---

## 🏛️ Arsitektur Sistem (Clean Layered Architecture)

Aplikasi dibangun dengan arsitektur enterprise berlapis:

```
├── .github/workflows/       # Otomasi CI/CD GitHub Actions (Multi-Node.js Matrix)
├── api/                     # Serverless Function Entry Point (Vercel deployment)
├── database/                # Persistensi data lokal atomik (storage.json)
├── preview/                 # Standalone offline presentation pages & client scripts
│   ├── master-data.js       # Master 255 pekerja resmi & 30 proyek konstruksi
│   ├── transaksi-upah.js    # Logika form transaksi, formula upah, & cetak slip
│   └── *.html               # Antarmuka dashboard, proyek, karyawan, & audit
├── public/                  # Aset statis publik (logo transparan, styling)
├── src/
│   ├── config/              # Konstanta & port environment
│   ├── controllers/         # Thin Dispatchers (HTTP request/response handlers)
│   ├── db/                  # Penyimpanan data atomik & in-memory cache
│   ├── middlewares/         # Interceptor otentikasi sesi & pembatasan akses RBAC
│   ├── routes/              # Declarative HTTP router & static asset dispatcher
│   ├── services/            # Domain Business Logic (karyawan, proyek, transaksi)
│   ├── utils/               # Sanitasi input & fungsi keamanan (anti-XSS)
│   └── views/               # Template engine antarmuka terisolasi
├── KLIK-UNTUK-PRESENTASI.bat     # 1-Click Launcher untuk Windows
├── KLIK-UNTUK-PRESENTASI.command # 1-Click Launcher untuk macOS
└── server.js                # Bootstrap HTTP server native (tanpa bloatware)
```

---

## 📑 Fitur-Fitur Utama Perusahaan

1. **Dashboard Monitoring Real-Time (`/dashboard`)**:
   - KPI Kehadiran Hari Ini, Staf Aktif, dan Status Perangkat Dual-ESP32.
   - Filter departemen/kategori dan live table presensi.
2. **Form Transaksi & Penggajian Multi-Proyek (`/upah`)**:
   - Database terintegrasi **255 pekerja resmi** dan **30 proyek konstruksi** PT. Jaya Kedhaton.
   - Perhitungan otomatis upah pokok harian, jam lembur, uang makan, **transport opsional**, dan **insentif opsional**.
   - Input **Kasbon (Rp)** dengan catatan keterangan keperluan.
   - Pembagian otomatis: **Nominal Transfer** dan **Sisa Diterima Tunai (Cash)**.
   - Modal cetak **Slip Gaji Resmi** dengan tanda tangan pekerja dan bendahara.
3. **Laporan Pengeluaran per Proyek (`/laporan-proyek`)**:
   - Agregasi pengeluaran riil setiap proyek dari alokasi jam kerja tukang/pekerja.
   - Modal detail rincian pekerja per proyek.
   - Ekspor laporan keuangan ke format **Microsoft Excel (CSV UTF-8)**.
4. **Data Karyawan & Soft-Delete (`/karyawan`)**:
   - Manajemen karyawan aktif dan tab arsip historis.
   - Sinkronisasi otomatis status kartu RFID saat arsip/pulihkan.
   - Validasi ketat pencegahan UID RFID ganda/duplikat dan gaji bernilai negatif.
5. **Log Aktivitas & Audit Forensik (`/audit-log`)**:
   - Proteksi hak akses khusus **Pimpinan** (`superadmin` & `admin.utama`).
   - Pencatatan forensik otomatis setiap operasi login, mutasi data, dan percobaan akses ilegal.

---

## 🔐 Akun Akses Default

| Peran / Jabatan | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `kedhaton2026!` | Akses Penuh Termasuk Log Audit Pimpinan |
| **Admin Utama** | `admin.utama` | `kedhaton2026!` | Akses Penuh Termasuk Log Audit Pimpinan |
| **Staf Keuangan** | `staf.keuangan` | `kedhaton2026!` | Operasional Keuangan & Upah Proyek |
| **Staf HRD** | `staf.hrd` | `kedhaton2026!` | Operasional Presensi & Karyawan |

---

&copy; 2026 PT. Jaya Kedhaton — Sistem Absensi Digital Enterprise Dual-ESP32.
