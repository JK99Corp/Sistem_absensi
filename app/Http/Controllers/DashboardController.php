<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama dengan pembedaan jam masuk 2 kategori:
     * - Pekerja Harian: Maksimal masuk pukul 07:30 WIB
     * - Staff Kantor: Maksimal masuk pukul 08:30 WIB
     * - Jam pulang normal sama: 17:00 - 17:30 WIB (lewat 17:30 dihitung lembur)
     */
    public function index(Request $request)
    {
        $hadir_hari_ini = 5;
        $karyawan_aktif = 6;
        $device_aktif = 1;

        $records = [
            // Pekerja Harian (Maks. 07:30)
            [
                'jam_masuk' => '07:15:20',
                'jam_pulang' => '19:35:10',
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'uid' => '83A192B4',
                'device' => 'KANTORJK_01',
                'status_masuk' => 'Tepat Waktu',
                'lembur' => 'Lembur 2 Jam',
                'jam_maks' => '07:30 WIB',
            ],
            [
                'jam_masuk' => '07:22:14',
                'jam_pulang' => '18:32:00',
                'nama' => 'Slamet Riyadi',
                'kategori' => 'Pekerja Harian',
                'uid' => '47C201F8',
                'device' => 'KANTORJK_01',
                'status_masuk' => 'Tepat Waktu',
                'lembur' => 'Lembur 1 Jam',
                'jam_maks' => '07:30 WIB',
            ],
            [
                'jam_masuk' => '07:45:00',
                'jam_pulang' => '19:30:15',
                'nama' => 'Bambang Triyono',
                'kategori' => 'Pekerja Harian',
                'uid' => '19E873A2',
                'device' => 'KANTORJK_01',
                'status_masuk' => 'Terlambat 15 Mnt',
                'lembur' => 'Lembur 2 Jam',
                'jam_maks' => '07:30 WIB',
            ],
            // Staff Kantor (Maks. 08:30)
            [
                'jam_masuk' => '08:22:45',
                'jam_pulang' => '17:15:30',
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'uid' => '53492607',
                'device' => 'KANTORJK_01',
                'status_masuk' => 'Tepat Waktu',
                'lembur' => 'Normal (0 Jam)',
                'jam_maks' => '08:30 WIB',
            ],
            [
                'jam_masuk' => '08:42:10',
                'jam_pulang' => '17:25:00',
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'uid' => '9491F306',
                'device' => 'KANTORJK_01',
                'status_masuk' => 'Terlambat 12 Mnt',
                'lembur' => 'Normal (0 Jam)',
                'jam_maks' => '08:30 WIB',
            ],
        ];

        $absensi_hari_ini = $records;
        $tanggal_hari_ini = 'Senin, 03 Agustus 2026';
        $tanggal = $request->get('tanggal', '2026-08-03');
        $kategori = $request->get('kategori', '');
        $device = $request->get('device', '');

        $kategori_list = ['Staff Kantor', 'Pekerja Harian'];
        $device_list = ['KANTORJK_01', 'KANTORJK_02'];

        if ($kategori) {
            $records = array_filter($records, function ($item) use ($kategori) {
                return $item['kategori'] === $kategori;
            });
        }

        return view('dashboard', compact(
            'hadir_hari_ini',
            'karyawan_aktif',
            'device_aktif',
            'records',
            'absensi_hari_ini',
            'tanggal_hari_ini',
            'tanggal',
            'kategori',
            'device',
            'kategori_list',
            'device_list'
        ));
    }
}
