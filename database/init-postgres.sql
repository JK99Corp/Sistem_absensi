-- ============================================================================
-- SKEMA BASIS DATA POSTGRESQL RESMI: SISTEM ABSENSI PT JAYA KEDHATON
-- Kompatibel dengan: PostgreSQL 13+, Supabase, Neon, Railway, Render, Aiven, RDS
-- Dibuat otomatis untuk migrasi hosting cloud
-- ============================================================================

-- Bersihkan tabel lama jika ada (urutan penghapusan memperhatikan relasi foreign key)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS absensi CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS karyawan CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. TABEL PENGGUNA & HAK AKSES (Multi-Role Authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'keuangan' CHECK (role IN ('superadmin', 'keuangan', 'hrd', 'operator')),
    status VARCHAR(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    remember_token VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. TABEL MASTER DATA KARYAWAN (Dengan Soft Delete & Multi-Projek)
-- ----------------------------------------------------------------------------
CREATE TABLE karyawan (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(50) NOT NULL DEFAULT 'Pekerja Harian' CHECK (kategori IN ('Staff Kantor', 'Pekerja Harian')),
    projek VARCHAR(100) NOT NULL DEFAULT '-',
    uid_rfid VARCHAR(32) UNIQUE,
    gaji_pokok INTEGER NOT NULL DEFAULT 0,
    upah_harian INTEGER NOT NULL DEFAULT 120000,
    tarif_lembur INTEGER NOT NULL DEFAULT 25000,
    no_hp VARCHAR(20),
    alamat TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_karyawan_uid_rfid ON karyawan(uid_rfid);
CREATE INDEX idx_karyawan_kategori ON karyawan(kategori);
CREATE INDEX idx_karyawan_projek ON karyawan(projek);
CREATE INDEX idx_karyawan_status ON karyawan(status);

-- ----------------------------------------------------------------------------
-- 3. TABEL PERANGKAT IOT (Dual-ESP32 RFID + Cam OV5640)
-- ----------------------------------------------------------------------------
CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    kode_device VARCHAR(32) UNIQUE NOT NULL,
    lokasi VARCHAR(100) NOT NULL,
    tipe VARCHAR(50) NOT NULL DEFAULT 'Dual ESP32 (RFID + Cam)',
    ip_address VARCHAR(45),
    api_key VARCHAR(128) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Online' CHECK (status IN ('Online', 'Offline')),
    last_ping TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_kode ON devices(kode_device);
CREATE INDEX idx_devices_api_key ON devices(api_key);

-- ----------------------------------------------------------------------------
-- 4. TABEL TRANSAKSI ABSENSI HARIAN & INTEGRASI FINANSIAL
-- ----------------------------------------------------------------------------
CREATE TABLE absensi (
    id BIGSERIAL PRIMARY KEY,
    karyawan_id BIGINT NOT NULL REFERENCES karyawan(id) ON DELETE RESTRICT,
    uid_rfid VARCHAR(32) NOT NULL,
    device_id BIGINT REFERENCES devices(id) ON DELETE SET NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_pulang TIME,
    status_masuk VARCHAR(20) NOT NULL DEFAULT 'Tepat Waktu' CHECK (status_masuk IN ('Tepat Waktu', 'Terlambat')),
    menit_keterlambatan SMALLINT NOT NULL DEFAULT 0,
    jam_lembur SMALLINT NOT NULL DEFAULT 0,
    status_lembur VARCHAR(30) NOT NULL DEFAULT 'Normal (0 Jam)',
    foto_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Composite index berkecepatan tinggi untuk filter rekapitulasi harian & bulanan
CREATE INDEX idx_absensi_tanggal_karyawan ON absensi(tanggal, karyawan_id);
CREATE INDEX idx_absensi_uid_rfid ON absensi(uid_rfid);
CREATE INDEX idx_absensi_tanggal ON absensi(tanggal);

-- ----------------------------------------------------------------------------
-- 5. TABEL AUDIT TRAIL / AUDIT LOG (Compliance Keamanan & Investigasi)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_username VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id BIGINT,
    payload_lama JSONB,
    payload_baru JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_created_action ON audit_logs(created_at, action);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_username);

-- ============================================================================
-- SEED DATA AWAL (DATA MASTER PT JAYA KEDHATON)
-- ============================================================================

-- 1. Akun Pengguna Resmi
-- Catatan: Password terenkripsi bcrypt default ($2y$10$...)
-- Default login:
-- superadmin / kedhaton2026!
-- admin.utama / adminutama123
-- staf.keuangan / keuangan123
-- staf.hrd / hrd123
INSERT INTO users (name, username, email, password, role, status) VALUES
('Direktur Utama', 'superadmin', 'direksi@jayakedhaton.com', '$2y$10$1rYj811fW5g3yZ6vX9o1.OPaG.V9569uElncI9aHwS0W9nK04Zf5y', 'superadmin', 'Aktif'),
('Admin Utama (Auditor)', 'admin.utama', 'audit@jayakedhaton.com', '$2y$10$7Zrq3E5ZcR2gO5FvL6h3.eqP9hC4B0.U4hZ6i4kU6aH0hK10Z9aZy', 'superadmin', 'Aktif'),
('Siti Aminah', 'staf.keuangan', 'keuangan@jayakedhaton.com', '$2y$10$9Urw2N8YdR4tV6MnH8i1.eR8lE7D2.W6jC8m7lS8bJ2mN32a1bCd', 'keuangan', 'Aktif'),
('Rendra Bagus', 'staf.hrd', 'hrd@jayakedhaton.com', '$2y$10$8Vtx1M7XcS3sU5LmG7h2.dQ7kD6C1.V5iB7l6kR7aI1lM21z0aBc', 'hrd', 'Aktif');

-- 2. Master Perangkat Dual-ESP32
INSERT INTO devices (kode_device, lokasi, tipe, ip_address, api_key, status, last_ping) VALUES
('KANTORJK_01', 'Pintu Masuk Utama', 'Dual ESP32 (RFID + Cam)', '192.168.1.100', 'jk_live_9f83a21b47c0e5d6a89c2f1e4b3d7a90f12c8e3b4a5d6e7f8a9b0c1d2e3f4a5b', 'Online', CURRENT_TIMESTAMP),
('KANTORJK_02', 'Pintu Area Pekerja Lapangan', 'Dual ESP32 (RFID Only)', '192.168.1.101', 'jk_live_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', 'Online', CURRENT_TIMESTAMP);

-- 3. Master Karyawan (Staff Kantor & Pekerja Harian dengan Projek Dinamis)
INSERT INTO karyawan (id, nama, kategori, projek, uid_rfid, gaji_pokok, upah_harian, tarif_lembur, no_hp, alamat, status) VALUES
(1, 'Dimas Arya Kedhaton', 'Staff Kantor', '-', '53492607', 3500000, 0, 30000, '0812-3456-7890', 'Surabaya', 'Aktif'),
(2, 'Akmal Zaidan', 'Staff Kantor', '-', '9491F306', 3200000, 0, 30000, '0812-9876-5432', 'Sidoarjo', 'Aktif'),
(3, 'Anom Arya', 'Staff Kantor', '-', 'A3B7C901', 3000000, 0, 30000, '0813-1122-3344', 'Gresik', 'Aktif'),
(4, 'Joko Susilo', 'Pekerja Harian', 'Projek A', '83A192B4', 0, 120000, 25000, '0857-1234-5678', 'Mojokerto', 'Aktif'),
(5, 'Slamet Riyadi', 'Pekerja Harian', 'Projek B', '47C201F8', 0, 120000, 25000, '0858-8765-4321', 'Pasuruan', 'Aktif'),
(6, 'Bambang Triyono', 'Pekerja Harian', 'Projek C', '19E873A2', 0, 110000, 25000, '0878-9988-7766', 'Malang', 'Aktif');

-- Set sequence karyawan_id agar id berikutnya otomatis mulai dari 7
SELECT setval(pg_get_serial_sequence('karyawan', 'id'), 6);

-- 4. Sample Transaksi Absensi Hari Ini
INSERT INTO absensi (karyawan_id, uid_rfid, device_id, tanggal, jam_masuk, jam_pulang, status_masuk, menit_keterlambatan, jam_lembur, status_lembur, foto_path) VALUES
(1, '53492607', 1, CURRENT_DATE, '07:45:00', '17:35:00', 'Tepat Waktu', 0, 0, 'Normal (0 Jam)', 'storage/absensi/sample1.jpg'),
(2, '9491F306', 1, CURRENT_DATE, '08:12:00', NULL, 'Tepat Waktu', 0, 0, 'Normal (0 Jam)', 'storage/absensi/sample2.jpg'),
(4, '83A192B4', 2, CURRENT_DATE, '07:10:00', '19:40:00', 'Tepat Waktu', 0, 2, 'Lembur', 'storage/absensi/sample3.jpg'),
(5, '47C201F8', 2, CURRENT_DATE, '07:42:00', NULL, 'Terlambat', 12, 0, 'Normal (0 Jam)', 'storage/absensi/sample4.jpg'),
(6, '19E873A2', 2, CURRENT_DATE, '07:05:00', '17:30:00', 'Tepat Waktu', 0, 0, 'Normal (0 Jam)', 'storage/absensi/sample5.jpg');

-- 5. Catatan Audit Log Awal
INSERT INTO audit_logs (user_username, action, target_entity, target_id, payload_lama, payload_baru, ip_address, user_agent) VALUES
('system', 'DATABASE_INITIALIZATION', 'System', 1, NULL, '{"status": "SUCCESS", "db": "PostgreSQL", "vendor": "Jaya Kedhaton Enterprise"}', '127.0.0.1', 'MigrationScript/PostgreSQL');

