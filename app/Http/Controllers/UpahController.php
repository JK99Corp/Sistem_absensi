<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UpahController extends Controller
{
    /**
     * Tampilkan halaman perhitungan upah & lembur untuk seluruh karyawan (Staff Kantor & Pekerja Harian).
     * Ketentuan: 
     * - Pekerja Harian: Masuk maks. 07:30 WIB
     * - Staff Kantor: Masuk maks. 08:30 WIB
     * - Pulang Normal: 17:00 - 17:30 WIB
     * - Lembur: Tap pulang > 17:30 WIB (dibulatkan per jam)
     */
    public function index(Request $request)
    {
        $periode = $request->get('periode', '03/08/2026 - 08/08/2026');
        $filterKategori = $request->get('kategori', '');

        $karyawan_upah = [
            // Staff Kantor
            [
                'id' => 1,
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'tipe_gaji' => 'bulanan',
                'uid' => '53492607',
                'hari_kerja' => 6,
                'total_lembur_jam' => 4,
                'gaji_pokok' => 3500000,
                'tarif_lembur_default' => 30000,
                'batas_masuk' => '08:30 WIB'
            ],
            [
                'id' => 2,
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'tipe_gaji' => 'bulanan',
                'uid' => '9491F306',
                'hari_kerja' => 5,
                'total_lembur_jam' => 3,
                'gaji_pokok' => 3200000,
                'tarif_lembur_default' => 30000,
                'batas_masuk' => '08:30 WIB'
            ],
            [
                'id' => 3,
                'nama' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'tipe_gaji' => 'bulanan',
                'uid' => 'A3B7C901',
                'hari_kerja' => 5,
                'total_lembur_jam' => 2,
                'gaji_pokok' => 3000000,
                'tarif_lembur_default' => 30000,
                'batas_masuk' => '08:30 WIB'
            ],
            // Pekerja Harian
            [
                'id' => 4,
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'tipe_gaji' => 'harian',
                'uid' => '83A192B4',
                'hari_kerja' => 6,
                'total_lembur_jam' => 8,
                'gaji_pokok' => 120000,
                'tarif_lembur_default' => 25000,
                'batas_masuk' => '07:30 WIB'
            ],
            [
                'id' => 5,
                'nama' => 'Slamet Riyadi',
                'kategori' => 'Pekerja Harian',
                'tipe_gaji' => 'harian',
                'uid' => '47C201F8',
                'hari_kerja' => 5,
                'total_lembur_jam' => 5,
                'gaji_pokok' => 120000,
                'tarif_lembur_default' => 25000,
                'batas_masuk' => '07:30 WIB'
            ],
            [
                'id' => 6,
                'nama' => 'Bambang Triyono',
                'kategori' => 'Pekerja Harian',
                'tipe_gaji' => 'harian',
                'uid' => '19E873A2',
                'hari_kerja' => 6,
                'total_lembur_jam' => 4,
                'gaji_pokok' => 110000,
                'tarif_lembur_default' => 25000,
                'batas_masuk' => '07:30 WIB'
            ]
        ];

        if (!empty($filterKategori)) {
            $karyawan_upah = array_values(array_filter($karyawan_upah, function($item) use ($filterKategori) {
                return $item['kategori'] === $filterKategori;
            }));
        }

        return view('upah', compact('periode', 'karyawan_upah', 'filterKategori'));
    }
}
