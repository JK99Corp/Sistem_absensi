-- ============================================================================
-- SKEMA BASIS DATA POSTGRESQL RESMI: SISTEM ABSENSI PT JAYA KEDHATON
-- Kompatibel dengan: PostgreSQL 13+, Supabase, Neon, Railway, Render, Aiven, RDS
-- Termasuk: Multi-Role Auth, 255 Master Karyawan (Staff & Pekerja Lapangan),
--           Dual-ESP32 IoT, Transaksi Absensi, Transaksi Upah Multi-Projek, & Audit Trail.
-- ============================================================================

-- Bersihkan tabel lama jika ada
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS transaksi_upah CASCADE;
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
-- 2. TABEL MASTER DATA KARYAWAN (Dengan Soft Delete, Posisi & Multi-Projek)
-- ----------------------------------------------------------------------------
CREATE TABLE karyawan (
    id BIGSERIAL PRIMARY KEY,
    kode_pekerja VARCHAR(50),
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(50) NOT NULL DEFAULT 'Pekerja Harian' CHECK (kategori IN ('Staff Kantor', 'Pekerja Harian')),
    posisi VARCHAR(50) NOT NULL DEFAULT 'TUKANG',
    projek VARCHAR(100) NOT NULL DEFAULT '-',
    uid_rfid VARCHAR(32) UNIQUE,
    gaji_pokok INTEGER NOT NULL DEFAULT 0,
    upah_harian INTEGER NOT NULL DEFAULT 120000,
    tarif_lembur INTEGER NOT NULL DEFAULT 15000,
    no_hp VARCHAR(20),
    alamat TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_karyawan_kode ON karyawan(kode_pekerja);
CREATE INDEX idx_karyawan_uid_rfid ON karyawan(uid_rfid);
CREATE INDEX idx_karyawan_kategori ON karyawan(kategori);
CREATE INDEX idx_karyawan_posisi ON karyawan(posisi);
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

CREATE INDEX idx_absensi_tanggal_karyawan ON absensi(tanggal, karyawan_id);
CREATE INDEX idx_absensi_uid_rfid ON absensi(uid_rfid);
CREATE INDEX idx_absensi_tanggal ON absensi(tanggal);

-- ----------------------------------------------------------------------------
-- 5. TABEL TRANSAKSI PENGGAJIAN & MULTI-PROYEK (Gaya Excel Ramah Awam)
-- ----------------------------------------------------------------------------
CREATE TABLE transaksi_upah (
    id BIGSERIAL PRIMARY KEY,
    periode_mulai DATE NOT NULL DEFAULT CURRENT_DATE - 6,
    periode_selesai DATE NOT NULL DEFAULT CURRENT_DATE,
    kode_pekerja VARCHAR(50),
    nama VARCHAR(255) NOT NULL,
    posisi VARCHAR(50) NOT NULL,
    upah_per_hari INTEGER NOT NULL DEFAULT 120000,
    kasbon INTEGER NOT NULL DEFAULT 0,
    total_hari INTEGER NOT NULL DEFAULT 0,
    total_lembur INTEGER NOT NULL DEFAULT 0,
    total_kotor INTEGER NOT NULL DEFAULT 0,
    total_bersih INTEGER NOT NULL DEFAULT 0,
    rincian_projek JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaksi_upah_periode ON transaksi_upah(periode_mulai, periode_selesai);
CREATE INDEX idx_transaksi_upah_kode ON transaksi_upah(kode_pekerja);

-- ----------------------------------------------------------------------------
-- 6. TABEL AUDIT TRAIL / AUDIT LOG (Compliance Keamanan & Investigasi)
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
-- SEED DATA AWAL (DATA MASTER RESMI PT JAYA KEDHATON)
-- ============================================================================

-- 1. Akun Pengguna Resmi
INSERT INTO users (name, username, email, password, role, status) VALUES
('Direktur Utama', 'superadmin', 'direksi@jayakedhaton.com', '$2y$10$1rYj811fW5g3yZ6vX9o1.OPaG.V9569uElncI9aHwS0W9nK04Zf5y', 'superadmin', 'Aktif'),
('Admin Utama (Auditor)', 'admin.utama', 'audit@jayakedhaton.com', '$2y$10$7Zrq3E5ZcR2gO5FvL6h3.eqP9hC4B0.U4hZ6i4kU6aH0hK10Z9aZy', 'superadmin', 'Aktif'),
('Siti Aminah', 'staf.keuangan', 'keuangan@jayakedhaton.com', '$2y$10$9Urw2N8YdR4tV6MnH8i1.eR8lE7D2.W6jC8m7lS8bJ2mN32a1bCd', 'keuangan', 'Aktif'),
('Rendra Bagus', 'staf.hrd', 'hrd@jayakedhaton.com', '$2y$10$8Vtx1M7XcS3sU5LmG7h2.dQ7kD6C1.V5iB7l6kR7aI1lM21z0aBc', 'hrd', 'Aktif');

-- 2. Master Perangkat Dual-ESP32
INSERT INTO devices (kode_device, lokasi, tipe, ip_address, api_key, status, last_ping) VALUES
('KANTORJK_01', 'Pintu Masuk Utama', 'Dual ESP32 (RFID + Cam)', '192.168.1.100', 'jk_live_9f83a21b47c0e5d6a89c2f1e4b3d7a90f12c8e3b4a5d6e7f8a9b0c1d2e3f4a5b', 'Online', CURRENT_TIMESTAMP),
('KANTORJK_02', 'Pintu Area Pekerja Lapangan', 'Dual ESP32 (RFID Only)', '192.168.1.101', 'jk_live_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', 'Online', CURRENT_TIMESTAMP);

-- 3. Master Karyawan (255 Karyawan: 3 Staff Kantor + 252 Pekerja Harian)
INSERT INTO karyawan (id, kode_pekerja, nama, kategori, posisi, projek, uid_rfid, gaji_pokok, upah_harian, tarif_lembur, no_hp, alamat, status) VALUES
(1, 'STAFF-001', 'Dimas Arya Kedhaton', 'Staff Kantor', 'Direktur Operasional', '-', '53492607', 3500000, 0, 30000, '0812-3456-7890', 'Samarinda', 'Aktif'),
(2, 'STAFF-002', 'Akmal Zaidan', 'Staff Kantor', 'Kepala Proyek', '-', '9491F306', 3200000, 0, 30000, '0812-9876-5432', 'Samarinda', 'Aktif'),
(3, 'STAFF-003', 'Anom Arya', 'Staff Kantor', 'Admin & Logistik', '-', 'A3B7C901', 3000000, 0, 30000, '0813-1122-3344', 'Samarinda', 'Aktif'),
(4, 'SUDIRO-001', 'IMAM MUHAMMAD SUDIRO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', '83A192B4', 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(5, 'SUDIRO-002', 'SUWITO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', '47C201F8', 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(6, 'SUDIRO-003', 'ARIS TARWADI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', '19E873A2', 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(7, 'SUDIRO-004', 'GUNARTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(8, 'SUDIRO-005', 'DAVID BAYU SETIAWAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(9, 'SUDIRO-006', 'ERVA BUDI SANTOSO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(10, 'SUDIRO-007', 'SUMADJI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(11, 'SUDIRO-008', 'MOH. MUKLIS', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(12, 'SUDIRO-009', 'SUNAR', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(13, 'SUDIRO-010', 'NARJUANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(14, 'SUDIRO-011', 'SURANI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(15, 'SUDIRO-012', 'PAULUS SUKAMTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(16, 'SUDIRO-013', 'DONI SETIAWAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(17, 'SUDIRO-014', 'FATQUL ROHMAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(18, 'KANCIL-025', 'ACHMAD FRIADI', 'Pekerja Harian', 'MANDOR', 'FELISA ESTATE', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(19, 'KANCIL-017', 'AGUS SULIYANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(20, 'KANCIL-008', 'SUMARSONO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(21, 'KANCIL-013', 'MUSTOFA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(22, 'KANCIL-024', 'NUR HASAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(23, 'KANCIL-014', 'DIDIK ANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(24, 'KANCIL-004', 'PANUT MULYONO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(25, 'KANCIL-003', 'BAHRUDIN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(26, 'KANCIL-018', 'SEGER', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(27, 'KANCIL-012', 'EDI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(28, 'KANCIL-010', 'SAPOAN', 'Pekerja Harian', 'SEMI TUKANG', 'FELISA ESTATE', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(29, 'KANCIL-016', 'SURYO SETYAWAN', 'Pekerja Harian', 'SEMI TUKANG', 'FELISA ESTATE', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(30, 'KANCIL-009', 'EKO BUDI IRIAWAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(31, 'KANCIL-007', 'YOGI YUNISTIRA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(32, 'KANCIL-001', 'TARI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(33, 'KANCIL-022', 'AGUNG WIJAYA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(34, 'KANCIL-021', 'SUKANI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(35, 'KANCIL-011', 'MAULANA ABI SAPUTRA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(36, 'KANCIL-002', 'ARI KURNIAWAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(37, 'KANCIL-005', 'VERI SETIAWAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(38, 'KANCIL-006', 'NICHOLAS ARIEL PRASETYO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(39, 'KANCIL-015', 'ALDI CAHYO PRASETYO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(40, 'KANCIL-026', 'ZAINAL ABIDIN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(41, 'KANCIL-027', 'JOKO SUMARTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(42, 'KANCIL-028', 'ENDRO NURSIYO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(43, 'KANCIL-029', 'SUMARI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(44, 'KANCIL-030', 'SISWANTO-KANCIL', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(45, 'KANCIL-031', 'SUJIANTO', 'Pekerja Harian', 'SEMI TUKANG', 'FELISA ESTATE', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(46, 'KANCIL-019', 'SISWANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(47, 'KANCIL-020', 'RIQO YANUWAR SAPUTRA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(48, 'KANCIL-023', 'HENRI UTAMAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(49, 'KANCIL-032', 'BOY SETIYAWAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(50, 'KANCIL-033', 'SUMITO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(51, 'KANCIL-034', 'MUJIONO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(52, 'KANCIL-035', 'SUGENG TKG', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(53, 'KANCIL-036', 'ALDO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(54, 'KANCIL-037', 'CHOIRUL', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(55, 'KANCIL-038', 'NORWANA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(56, 'KANCIL-039', 'GUNAWAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(57, 'KANCIL-040', 'SUNARI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(58, 'KANCIL-041', 'KUDORI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(59, 'KANCIL-042', 'SUGIANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(60, 'KANCIL-043', 'ANDRIK SUSANTO', 'Pekerja Harian', 'SEMI TUKANG', 'FELISA ESTATE', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(61, 'KANCIL-044', 'TARJIANTO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(62, 'KANCIL-045', 'DAMOKO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(63, 'KANCIL-046', 'SUYONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(64, 'KANCIL-047', 'SUMARI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(65, 'TOPA-001', 'IMAM MUSTOFA', 'Pekerja Harian', 'MANDOR', 'RUKO PAK DEDI', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(66, 'TOPA-002', 'MARKANI', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(67, 'TOPA-007', 'DIDIK RIFAI', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(68, 'TOPA-012', 'SUDARSONO', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(69, 'TOPA-016', 'GUNAJI', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(70, 'TOPA-008', 'DIMAS DANU TIRTO', 'Pekerja Harian', 'SEMI TUKANG', 'RUKO PAK DEDI', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(71, 'TOPA-013', 'SUGIYONO', 'Pekerja Harian', 'SEMI TUKANG', 'RUKO PAK DEDI', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(72, 'TOPA-003', 'RAMADHANI PITRI PRATIKNO', 'Pekerja Harian', 'SEMI TUKANG', 'RUKO PAK DEDI', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(73, 'TOPA-004', 'YUDHA EKA RAMADHANI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(74, 'TOPA-005', 'LUKI ANDRIAN ARISANDI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(75, 'TOPA-006', 'KOSIM', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(76, 'TOPA-009', 'KHOIRUL ROZIQIN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(77, 'TOPA-010', 'YOYOK SUSANTO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(78, 'TOPA-011', 'DIDIK AGUNG BAKTIAR', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(79, 'TOPA-017', 'VIXI ANDRIAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(80, 'TOPA-018', 'AHMAD MUKHLISON', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(81, 'TOPA-019', 'AGUS SUNARKO', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(82, 'TOPA-020', 'FIRSGIAN IBNU NAFIS', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(83, 'TOPA-015', 'MIRUN', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(84, 'TOPA-014', 'OMAR HADI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(85, 'TOPA-021', 'SUDARSONO/DARSO', 'Pekerja Harian', 'TUKANG', 'RUKO PAK DEDI', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(86, 'TOPA-022', 'DODIK AGUNG BAKTIAR', 'Pekerja Harian', 'PEMBANTU TUKANG', 'RUKO PAK DEDI', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(87, 'GDG-001', 'BAGUS SETIAWAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(88, 'GDG-002', 'MARTIN', 'Pekerja Harian', 'RKS', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(89, 'GDG-003', 'MEBA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(90, 'GDG-004', 'HADI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(91, 'GDG-005', 'ABDUL SUKUR', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(92, 'GDG-006', 'KALIS', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(93, 'GDG-007', 'JATMIKO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(94, 'GDG-008', 'SONDONG', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(95, 'GDG-009', 'WAHID', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(96, 'ALI-001', 'ALI MUHAMMAD', 'Pekerja Harian', 'MANDOR', 'GUDANG SENTRAL', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(97, 'ALI-011', 'MUHARDI WILONOTO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(98, 'ALI-002', 'JUREMI', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(99, 'ALI-005', 'TRIWOKO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(100, 'ALI-017', 'DINO MARGO SAPUTRO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(101, 'ALI-019', 'M. ZAENURI', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(102, 'ALI-007', 'ANDI PAMILU IRAWAN', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(103, 'ALI-003', 'JOKO DWI PURNOMO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(104, 'ALI-013', 'RENDI MAULANA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(105, 'ALI-014', 'DENI ADE PUTRA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(106, 'ALI-018', 'M. RIFKI HIDAYAT', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(107, 'ALI-006', 'WAHYU AGUNG SETIAWAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(108, 'ALI-021', 'MUSTOFA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(109, 'ALI-022', 'EDI NUGROHO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(110, 'ALI-023', 'AGUS PRASTIAWAN', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(111, 'ALI-024', 'AHMAD ZAINURI', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(112, 'ALI-025', 'ARIS WIBOWO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(113, 'ALI-026', 'DWI SANTOSO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(114, 'ALI-027', 'MARULI HENY DIATMIKO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(115, 'ALI-028', 'PUNGKY ARI W', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(116, 'ALI-029', 'SLAMET B', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(117, 'ALI-030', 'SUMANI', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(118, 'ALI-031', 'YANTO RIADI', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(119, 'ALI-032', 'SUYITNO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(120, 'ALI-004', 'EDI MUSTONO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(121, 'ALI-009', 'ONIK SETIAWAN', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(122, 'ALI-010', 'PAERAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(123, 'ALI-012', 'YUDA KRIS SANDINI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(124, 'ALI-015', 'SUYITNO', 'Pekerja Harian', 'TUKANG', 'GUDANG SENTRAL', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(125, 'ALI-016', 'IRFAN ANDREAN SAPUTRA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(126, 'ALI-020', 'JANI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(127, 'ALI-008', 'RIDHO BAGUS SUMANTRI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'GUDANG SENTRAL', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(128, 'KEBUN-001', 'JAFAR ARBA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(129, 'KEBUN-002', 'ALBERTUS J MUDA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(130, 'KEBUN-003', 'AHMAD MISBAQUL MUNIR', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(131, 'KEBUN-004', 'DOMINIKUS D MUDA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(132, 'KEBUN-005', 'ONIX', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(133, 'KEBUN-006', 'FABIANUS KOPO MUDA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(134, 'ASROFI-021', 'ASROFI', 'Pekerja Harian', 'MANDOR', 'PERUM INDAH', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(135, 'ASROFI-001', 'MASUDI/HADI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(136, 'ASROFI-002', 'SUPRI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(137, 'ASROFI-022', 'RUDIANTO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(138, 'ASROFI-019', 'PRAYOKO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(139, 'ASROFI-007', 'ROKIM', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(140, 'ASROFI-014', 'BASRI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(141, 'ASROFI-015', 'UJANG SUKIRMAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(142, 'ASROFI-016', 'AHMAD SUKUR', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(143, 'ASROFI-017', 'SULANI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(144, 'ASROFI-018', 'MAT RODLI', 'Pekerja Harian', 'SEMI TUKANG', 'PERUM INDAH', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(145, 'ASROFI-020', 'MISNI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(146, 'ASROFI-006', 'MASNGUT', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(147, 'ASROFI-008', 'RIO YUMAS OKTAVIANO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(148, 'ASROFI-009', 'SUGIANTA', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(149, 'ASROFI-010', 'IMAM SOPINGI', 'Pekerja Harian', 'SEMI TUKANG', 'PERUM INDAH', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(150, 'ASROFI-011', 'DADANG RANU TANTOWI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(151, 'ASROFI-012', 'NUR EFFENDI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(152, 'ASROFI-013', 'KHOIRI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(153, 'ASROFI-031', 'DWI NURWANTO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(154, 'ASROFI-032', 'SAFARI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(155, 'ASROFI-033', 'ILHAM', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(156, 'ASROFI-034', 'SRIANTO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(157, 'ASROFI-035', 'RIAS', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(158, 'ASROFI-036', 'NANDA AJI PANGESTU', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(159, 'ASROFI-037', 'NURHUDA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(160, 'ASROFI-023', 'ANGGA PRADANA', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(161, 'ASROFI-024', 'AGUS JARWANTO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(162, 'ASROFI-025', 'ALI MUSTOFA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(163, 'ASROFI-026', 'HARIYANTO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(164, 'ASROFI-027', 'SUGENG', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(165, 'ASROFI-028', 'MISYADI', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(166, 'ASROFI-029', 'JOKO SUWITO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(167, 'ASROFI-030', 'IMAM NAHROWI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(168, 'ASROFI-038', 'HENDRO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(169, 'ASROFI-039', 'ADI SONDONG', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(170, 'asrofi-040', 'AHMAD BG', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(171, 'ASROFI-041', 'AHMAD SHAIFUL BASHOR', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(172, 'ASROFI-042', 'JATMIKO WAHYUDIONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(173, 'ASROFI-003', 'AGUS SUPRAPTO', 'Pekerja Harian', 'TUKANG', 'PERUM INDAH', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(174, 'ASROFI-004', 'EKA WAHYU PUTRA', 'Pekerja Harian', 'SEMI TUKANG', 'PERUM INDAH', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(175, 'ASROFI-005', 'JOHAN P', 'Pekerja Harian', 'SEMI TUKANG', 'PERUM INDAH', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(176, 'ASROFI-046', 'FAJAR', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PERUM INDAH', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(177, 'KASUN-001', 'KASUN', 'Pekerja Harian', 'MANDOR', 'FELISA ESTATE', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(178, 'KASUN-005', 'MIFTAHUL HUDA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(179, 'KASUN-004', 'NANANG ATHO ILLAHI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(180, 'KASUN-003', 'M. HARUN', 'Pekerja Harian', 'SEMI TUKANG', 'FELISA ESTATE', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(181, 'KASUN-002', 'MUNAWIR', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(182, 'GIPSUM-001', 'AGUS JALI', 'Pekerja Harian', 'CAT', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(183, 'GIPSUM-002', 'SUGENG WALUYO', 'Pekerja Harian', 'CAT', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(184, 'GIPSUM-003', 'RICO YANUAR SAPUTRO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(185, 'GIPSUM-004', 'HENRI UTAMAN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(186, 'GIPSUM-005', 'EDI PURWANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(187, 'GIPSUM-006', 'ANDRIANUS LEBA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(188, 'MEP-001', 'AHMAD TAOFIK', 'Pekerja Harian', 'MEP', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(189, 'MEP-002', 'HENDI', 'Pekerja Harian', 'MEP', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(190, 'MEP-003', 'OBY NURJAMAN', 'Pekerja Harian', 'MEP', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(191, 'MEP-004', 'SAEFUL ANWAR', 'Pekerja Harian', 'MEP', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(192, 'LAS-001', 'EKO ANDRIANTO', 'Pekerja Harian', 'MANDOR', 'FELISA ESTATE', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(193, 'LAS-002', 'ASEP SUNJAYA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(194, 'LAS-003', 'DEDI IRAWAN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(195, 'LAS-004', 'RAJIDIN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(196, 'LAS-005', 'RUSDIANSYAH', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(197, 'NUR-001', 'NURSAID', 'Pekerja Harian', 'MANDOR', 'FELISA ESTATE', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(198, 'NUR-002', 'MASIRIN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(199, 'NUR-003', 'JUARI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(200, 'NUR-004', 'AHMAD SOLEH', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(201, 'NUR-005', 'YOGA ABDI PAMBUDI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(202, 'NUR-006', 'MARDA ADITYA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(203, 'NUR-007', 'SAIFUL ANAM', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(204, 'NUR-008', 'DENI ARI SANDIA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(205, 'NUR-009', 'TEDO EMBUN SAPUTRA', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(206, 'NUR-010', 'DJUBAIDI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(207, 'NUR-011', 'SUTAJI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(208, 'NUR-012', 'SRINANTO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(209, 'NUR-013', 'SOIMIN', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(210, 'NUR-014', 'SUTOYO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(211, 'NUR-015', 'JAYADI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(212, 'NUR-016', 'JOKO HOGI PUTRA WIANGGA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'FELISA ESTATE', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(213, 'MEBEL-001', 'AHMAD TAMSIR', 'Pekerja Harian', 'MANDOR INTERIOR', 'FELISA ESTATE', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(214, 'MEBEL-002', 'SAPAWI', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(215, 'MEBEL-003', 'ANDIKA FANI RISTANTO', 'Pekerja Harian', 'TUKANG', 'FELISA ESTATE', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(216, 'NARDI-001', 'ADITIA RUDIANTO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(217, 'NARDI-002', 'DARSONO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(218, 'NARDI-003', 'PURWAJI', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(219, 'NARDI-004', 'NURHAMID', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(220, 'NARDI-005', 'WAHYUDI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(221, 'NARDI-006', 'NAUFAL YUFRON TRI A', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(222, 'NARDI-007', 'REGITA PRAMUJI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(223, 'NARDI-008', 'NARDI', 'Pekerja Harian', 'MANDOR', 'PAGAR RING ROAD', NULL, 200000, 200000, 25000, '-', 'Samarinda', 'Aktif'),
(224, 'NARDI-009', 'WARDI', 'Pekerja Harian', 'WAKIL MANDOR', 'PAGAR RING ROAD', NULL, 150000, 150000, 18750, '-', 'Samarinda', 'Aktif'),
(225, 'NARDI-010', 'MARTONO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(226, 'NARDI-011', 'NYAMIN', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(227, 'NARDI-012', 'SETO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(228, 'NARDI-013', 'SUWARNO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(229, 'NARDI-014', 'WARSONO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(230, 'NARDI-015', 'TEGUH', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(231, 'NARDI-016', 'NUR ALI', 'Pekerja Harian', 'SEMI TUKANG', 'PAGAR RING ROAD', NULL, 130000, 130000, 16250, '-', 'Samarinda', 'Aktif'),
(232, 'NARDI-017', 'HERMANTO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(233, 'NARDI-018', 'BEJO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(234, 'NARDI-019', 'DENI', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(235, 'NARDI-020', 'SOLIKIN', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(236, 'NARDI-021', 'GIMO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(237, 'NARDI-022', 'ABDUL HALIM', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(238, 'NARDI-023', 'MUH. YUSUF', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(239, 'NARDI-024', 'MOCH ABDUL MA''ALI', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(240, 'NARDI-025', 'KONI ARI WIBISONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(241, 'NARDI-026', 'GINANJAR ARDI SAPUTRA', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(242, 'NARDI-027', 'USUF ROHANI', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(243, 'NARDI-028', 'SURYONO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(244, 'NARDI-029', 'NURUDIN', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(245, 'NARDI-030', 'ANTOK MURDIONO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(246, 'NARDI-031', 'SUPRIYANTO MBAH', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(247, 'NARDI-032', 'SUPRIYANTO 2', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(248, 'NARDI-033', 'ANTON DWI CAHYONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(249, 'NARDI-034', 'SUPOMO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(250, 'NARDI-035', 'MOH YUSUF', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(251, 'NARDI-036', 'ACHMAD HUDA', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(252, 'NARDI-037', 'SLAMET BUDIYONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(253, 'NARDI-038', 'SUKARSONO', 'Pekerja Harian', 'PEMBANTU TUKANG', 'PAGAR RING ROAD', NULL, 120000, 120000, 15000, '-', 'Samarinda', 'Aktif'),
(254, 'NARDI-039', 'SUJAK', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif'),
(255, 'NARDI-040', 'PUTJIANTO', 'Pekerja Harian', 'TUKANG', 'PAGAR RING ROAD', NULL, 140000, 140000, 17500, '-', 'Samarinda', 'Aktif');

-- Set sequence karyawan_id
SELECT setval(pg_get_serial_sequence('karyawan', 'id'), 255);

-- 4. Sample Transaksi Absensi
INSERT INTO absensi (karyawan_id, uid_rfid, device_id, tanggal, jam_masuk, jam_pulang, status_masuk, menit_keterlambatan, jam_lembur, status_lembur, foto_path) VALUES
(1, '53492607', 1, CURRENT_DATE, '07:45:00', '17:35:00', 'Tepat Waktu', 0, 0, 'Normal (0 Jam)', 'storage/absensi/sample1.jpg'),
(2, '9491F306', 1, CURRENT_DATE, '08:12:00', NULL, 'Tepat Waktu', 0, 0, 'Normal (0 Jam)', 'storage/absensi/sample2.jpg'),
(4, '83A192B4', 2, CURRENT_DATE, '07:10:00', '19:40:00', 'Tepat Waktu', 0, 2, 'Lembur', 'storage/absensi/sample3.jpg');

-- 5. Transaksi Upah Multi-Projek
INSERT INTO transaksi_upah (id, periode_mulai, periode_selesai, kode_pekerja, nama, posisi, upah_per_hari, kasbon, total_hari, total_lembur, total_kotor, total_bersih, rincian_projek) VALUES
(1, CURRENT_DATE - 6, CURRENT_DATE, 'KANCIL-013', 'MUSTOFA', 'TUKANG', 140000, 100000, 8, 6, 1265000, 1165000, '[{"projek":"FELISA ESTATE","hari":6,"lembur":6,"makan":30000,"insentif":0},{"projek":"RUKO PAK DEDI","hari":2,"lembur":0,"makan":10000,"insentif":0}]'::jsonb),
(2, CURRENT_DATE - 6, CURRENT_DATE, 'SUDIRO-001', 'IMAM MUHAMMAD SUDIRO', 'TUKANG', 140000, 0, 6, 4, 940000, 940000, '[{"projek":"FELISA ESTATE","hari":6,"lembur":4,"makan":30000,"insentif":0}]'::jsonb),
(3, CURRENT_DATE - 6, CURRENT_DATE, 'NARDI-036', 'ACHMAD HUDA', 'PEMBANTU TUKANG', 120000, 50000, 6, 2, 775000, 725000, '[{"projek":"PAGAR RING ROAD","hari":6,"lembur":2,"makan":25000,"insentif":0}]'::jsonb);

SELECT setval(pg_get_serial_sequence('transaksi_upah', 'id'), 3);

-- 6. Audit Trail Inisialisasi
INSERT INTO audit_logs (user_username, action, target_entity, target_id, payload_lama, payload_baru, ip_address, user_agent) VALUES
('system', 'DATABASE_INITIALIZATION', 'System', 1, NULL, '{"status": "SUCCESS", "db": "PostgreSQL", "vendor": "Jaya Kedhaton Enterprise", "total_karyawan": 255}', '127.0.0.1', 'MigrationScript/PostgreSQL');
