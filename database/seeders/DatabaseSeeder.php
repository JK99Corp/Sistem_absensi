<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Karyawan;
use App\Models\Device;
use App\Models\Absensi;
use App\Models\AuditLog;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed initial enterprise database for Jaya Kedhaton
     */
    public function run(): void
    {
        // 1. Seed Akun Pengguna Resmi (Tepat 2 Akun Pimpinan Berhak Akses Audit Log)
        User::firstOrCreate(
            ['username' => 'superadmin'],
            [
                'name' => 'Direktur Utama',
                'email' => 'direksi@jayakedhaton.com',
                'password' => Hash::make('kedhaton2026!'),
                'role' => 'superadmin',
                'status' => 'Aktif',
            ]
        );

        User::firstOrCreate(
            ['username' => 'admin.utama'],
            [
                'name' => 'Admin Utama (Auditor)',
                'email' => 'audit@jayakedhaton.com',
                'password' => Hash::make('adminutama123'),
                'role' => 'superadmin',
                'status' => 'Aktif',
            ]
        );

        // Akun Staf Operasional (Akses Audit Log Terkunci)
        User::firstOrCreate(
            ['username' => 'staf.keuangan'],
            [
                'name' => 'Siti Aminah',
                'email' => 'keuangan@jayakedhaton.com',
                'password' => Hash::make('keuangan123'),
                'role' => 'keuangan',
                'status' => 'Aktif',
            ]
        );

        User::firstOrCreate(
            ['username' => 'staf.hrd'],
            [
                'name' => 'Rendra Bagus',
                'email' => 'hrd@jayakedhaton.com',
                'password' => Hash::make('hrd123'),
                'role' => 'hrd',
                'status' => 'Aktif',
            ]
        );

        // 2. Seed Perangkat IoT Dual-ESP32
        $dev1 = Device::firstOrCreate(
            ['kode_device' => 'KANTORJK_01'],
            [
                'lokasi' => 'Pintu Masuk Utama',
                'tipe' => 'Dual ESP32 (RFID + Cam)',
                'ip_address' => '192.168.1.100',
                'api_key' => 'jk_live_9f83a21b47c0e5d6a89c2f1e4b3d7a90f12c8e3b4a5d6e7f8a9b0c1d2e3f4a5b',
                'status' => 'Online',
                'last_ping' => now(),
            ]
        );

        $dev2 = Device::firstOrCreate(
            ['kode_device' => 'KANTORJK_02'],
            [
                'lokasi' => 'Pintu Area Pekerja Lapangan',
                'tipe' => 'Dual ESP32 (RFID Only)',
                'ip_address' => '192.168.1.101',
                'api_key' => 'jk_live_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
                'status' => 'Online',
                'last_ping' => now(),
            ]
        );

        // 3. Seed Master Data Karyawan (Staff Kantor & Pekerja Harian)
        $karyawanList = [
            // Staff Kantor (Batas 08:30 WIB)
            [
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid_rfid' => '53492607',
                'gaji_pokok' => 3500000,
                'upah_harian' => 0,
                'tarif_lembur' => 30000,
                'no_hp' => '0812-3456-7890',
                'status' => 'Aktif',
            ],
            [
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid_rfid' => '9491F306',
                'gaji_pokok' => 3200000,
                'upah_harian' => 0,
                'tarif_lembur' => 30000,
                'no_hp' => '0812-9876-5432',
                'status' => 'Aktif',
            ],
            [
                'nama' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid_rfid' => 'A3B7C901',
                'gaji_pokok' => 3000000,
                'upah_harian' => 0,
                'tarif_lembur' => 30000,
                'no_hp' => '0813-1122-3344',
                'status' => 'Aktif',
            ],
            // Pekerja Harian (Batas 07:30 WIB)
            [
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek A',
                'uid_rfid' => '83A192B4',
                'gaji_pokok' => 0,
                'upah_harian' => 120000,
                'tarif_lembur' => 25000,
                'no_hp' => '0857-1234-5678',
                'status' => 'Aktif',
            ],
            [
                'nama' => 'Slamet Riyadi',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek B',
                'uid_rfid' => '47C201F8',
                'gaji_pokok' => 0,
                'upah_harian' => 120000,
                'tarif_lembur' => 25000,
                'no_hp' => '0858-8765-4321',
                'status' => 'Aktif',
            ],
            [
                'nama' => 'Bambang Triyono',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek C',
                'uid_rfid' => '19E873A2',
                'gaji_pokok' => 0,
                'upah_harian' => 110000,
                'tarif_lembur' => 25000,
                'no_hp' => '0878-9988-7766',
                'status' => 'Aktif',
            ],
        ];

        foreach ($karyawanList as $kData) {
            Karyawan::firstOrCreate(['uid_rfid' => $kData['uid_rfid']], $kData);
        }

        // 4. Catat Audit Log Inisialisasi Sistem
        AuditLog::create([
            'user_username' => 'system',
            'action' => 'DATABASE_INITIALIZATION',
            'target_entity' => 'System',
            'payload_baru' => ['message' => 'Basis data resmi Jaya Kedhaton berhasil diinisialisasi.'],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'DatabaseSeeder/CLI',
        ]);
    }
}

