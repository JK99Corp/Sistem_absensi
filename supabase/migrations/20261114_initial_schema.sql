-- =====================================================================
-- PT. JAYA KEDHATON ENTERPRISE ATTENDANCE & PAYROLL DATABASE SCHEMA
-- Migration: 20261114_initial_schema.sql
-- Database: PostgreSQL 15+ (Supabase)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: PROYEK JAYA KEDHATON
CREATE TABLE IF NOT EXISTS public.projek (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(50) UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    lokasi TEXT,
    status VARCHAR(30) DEFAULT 'Berjalan', -- 'Berjalan', 'Selesai', 'Ditunda'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.projek IS 'Daftar master proyek aktif PT. Jaya Kedhaton';

-- 3. TABEL: MASTER PEKERJA & KARYAWAN
CREATE TABLE IF NOT EXISTS public.karyawan (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(50) UNIQUE,              -- contoh: 'STAFF-001', 'KANCIL-013'
    nama TEXT NOT NULL,
    kategori VARCHAR(50) NOT NULL,        -- 'Staff Kantor' / 'Pekerja Harian'
    posisi VARCHAR(50) NOT NULL,          -- 'STAFF KANTOR', 'TUKANG', 'MANDOR', 'SEMI TUKANG', dll
    uid VARCHAR(50) UNIQUE,               -- UID Fisik Kartu RFID
    no_hp VARCHAR(30) DEFAULT '-',
    status VARCHAR(30) DEFAULT 'Aktif',   -- 'Aktif' / 'Diarsipkan'
    upah_harian NUMERIC(12, 2) DEFAULT 0,
    pokok NUMERIC(12, 2) DEFAULT 0,       -- Gaji pokok bulanan untuk staf kantor
    tarif_lembur NUMERIC(12, 2) DEFAULT 0,
    tgl_gabung DATE DEFAULT CURRENT_DATE,
    projek_default TEXT DEFAULT '-',
    deleted_at TIMESTAMPTZ,              -- Soft delete timestamp
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_karyawan_kode ON public.karyawan(kode);
CREATE INDEX IF NOT EXISTS idx_karyawan_uid ON public.karyawan(uid);
CREATE INDEX IF NOT EXISTS idx_karyawan_status ON public.karyawan(status);
CREATE INDEX IF NOT EXISTS idx_karyawan_kategori ON public.karyawan(kategori);

COMMENT ON TABLE public.karyawan IS 'Master data seluruh karyawan staf kantor dan pekerja harian';

-- 4. TABEL: PERANGKAT IoT DUAL-ESP32
CREATE TABLE IF NOT EXISTS public.device_absensi (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(50) UNIQUE NOT NULL,    -- contoh: 'KANTORJK_01'
    lokasi TEXT NOT NULL,
    tipe VARCHAR(100) NOT NULL,          -- 'Dual ESP32 (RFID + Cam)'
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(20) DEFAULT 'Online', -- 'Online' / 'Offline'
    terakhir_aktif TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.device_absensi IS 'Daftar perangkat hardware presensi IoT Dual-ESP32';

-- 5. TABEL: LOG ABSENSI HARIAN
CREATE TABLE IF NOT EXISTS public.absensi_log (
    id BIGSERIAL PRIMARY KEY,
    karyawan_id BIGINT REFERENCES public.karyawan(id) ON DELETE SET NULL,
    uid VARCHAR(50) NOT NULL,
    nama TEXT NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME NOT NULL,
    jam_pulang TIME,
    status_masuk VARCHAR(50) DEFAULT 'Tepat Waktu', -- 'Tepat Waktu' / 'Terlambat X Mnt'
    lembur_jam NUMERIC(4, 2) DEFAULT 0,
    device_kode VARCHAR(50) REFERENCES public.device_absensi(kode) ON DELETE SET NULL,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_absensi_tanggal ON public.absensi_log(tanggal);
CREATE INDEX IF NOT EXISTS idx_absensi_karyawan ON public.absensi_log(karyawan_id);
CREATE INDEX IF NOT EXISTS idx_absensi_uid ON public.absensi_log(uid);

COMMENT ON TABLE public.absensi_log IS 'Riwayat log tap absensi real-time dari mesin IoT';

-- 6. TABEL: TRANSAKSI UPAH (FORM TRANSAKSI PERIODE)
CREATE TABLE IF NOT EXISTS public.transaksi_upah (
    id BIGSERIAL PRIMARY KEY,
    kode_pekerja VARCHAR(50),
    nama_pekerja TEXT NOT NULL,
    posisi VARCHAR(50) NOT NULL,
    upah_per_hari NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tgl_mulai DATE NOT NULL,
    tgl_selesai DATE NOT NULL,
    periode_teks TEXT NOT NULL,
    total_hari NUMERIC(6, 2) DEFAULT 0,
    total_lembur NUMERIC(6, 2) DEFAULT 0,
    total_kotor NUMERIC(14, 2) DEFAULT 0,
    kasbon NUMERIC(14, 2) DEFAULT 0,
    sisa_diterima NUMERIC(14, 2) DEFAULT 0,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_pekerja_periode UNIQUE (kode_pekerja, tgl_mulai, tgl_selesai)
);

CREATE INDEX IF NOT EXISTS idx_transaksi_periode ON public.transaksi_upah(tgl_mulai, tgl_selesai);
CREATE INDEX IF NOT EXISTS idx_transaksi_kode ON public.transaksi_upah(kode_pekerja);

COMMENT ON TABLE public.transaksi_upah IS 'Header transaksi penggajian pekerja mingguan/dua-mingguan';

-- 7. TABEL: RINCIAN ALOKASI PROYEK TRANSAKSI
CREATE TABLE IF NOT EXISTS public.transaksi_upah_detail (
    id BIGSERIAL PRIMARY KEY,
    transaksi_id BIGINT NOT NULL REFERENCES public.transaksi_upah(id) ON DELETE CASCADE,
    projek_nama TEXT NOT NULL,
    hari NUMERIC(6, 2) DEFAULT 0,
    lembur NUMERIC(6, 2) DEFAULT 0,
    makan NUMERIC(12, 2) DEFAULT 0,
    insentif NUMERIC(12, 2) DEFAULT 0,
    subtotal NUMERIC(14, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transaksi_detail_parent ON public.transaksi_upah_detail(transaksi_id);

COMMENT ON TABLE public.transaksi_upah_detail IS 'Detail alokasi multi-proyek per pekerja dalam 1 slip transaksi';

-- 8. TABEL: AUDIT LOG KEAMANAN & AKTIVITAS PIMPINAN
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    nama TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    aksi VARCHAR(50) NOT NULL,
    keterangan TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_waktu ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_aksi ON public.audit_logs(aksi);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(username);

COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail untuk pengawasan direksi';

-- 9. ENABLE ROW LEVEL SECURITY (RLS) FOR ENTERPRISE SECURITY
ALTER TABLE public.projek ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karyawan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_upah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_upah_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES (AUTHENTICATED SERVICE ACCESS)
CREATE POLICY "Allow authenticated read on projek" ON public.projek FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated full on karyawan" ON public.karyawan FOR ALL TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated full on absensi_log" ON public.absensi_log FOR ALL TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated full on transaksi_upah" ON public.transaksi_upah FOR ALL TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated full on transaksi_upah_detail" ON public.transaksi_upah_detail FOR ALL TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated full on audit_logs" ON public.audit_logs FOR ALL TO authenticated, anon USING (true);
