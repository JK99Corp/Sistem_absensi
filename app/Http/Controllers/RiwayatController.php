<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RiwayatController extends Controller
{
    /**
     * Tampilkan halaman riwayat absensi dengan pembedaan jam batas masuk:
     * - Pekerja Harian: Maks. 07:30 WIB
     * - Staff Kantor: Maks. 08:30 WIB
     */
    public function index(Request $request)
    {
        $records = [
            // Pekerja Harian (Maks 07:30)
            [
                'tanggal' => '2026-08-03',
                'jam_masuk' => '07:15:20',
                'jam_pulang' => '19:35:10',
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'batas_masuk' => '07:30',
                'status_masuk' => 'Tepat Waktu',
                'uid' => '83A192B4',
                'device' => 'KANTORJK_01',
                'lembur' => 'Lembur 2 Jam',
                'foto' => 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96',
            ],
            [
                'tanggal' => '2026-08-03',
                'jam_masuk' => '07:22:14',
                'jam_pulang' => '18:32:00',
                'nama' => 'Slamet Riyadi',
                'kategori' => 'Pekerja Harian',
                'batas_masuk' => '07:30',
                'status_masuk' => 'Tepat Waktu',
                'uid' => '47C201F8',
                'device' => 'KANTORJK_01',
                'lembur' => 'Lembur 1 Jam',
                'foto' => 'https://ui-avatars.com/api/?name=Slamet+Riyadi&background=f59e0b&color=fff&size=96',
            ],
            [
                'tanggal' => '2026-08-03',
                'jam_masuk' => '07:45:00',
                'jam_pulang' => '19:30:15',
                'nama' => 'Bambang Triyono',
                'kategori' => 'Pekerja Harian',
                'batas_masuk' => '07:30',
                'status_masuk' => 'Terlambat 15 Mnt',
                'uid' => '19E873A2',
                'device' => 'KANTORJK_01',
                'lembur' => 'Lembur 2 Jam',
                'foto' => 'https://ui-avatars.com/api/?name=Bambang+Triyono&background=f59e0b&color=fff&size=96',
            ],
            // Staff Kantor (Maks 08:30)
            [
                'tanggal' => '2026-08-03',
                'jam_masuk' => '08:22:45',
                'jam_pulang' => '17:15:30',
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'batas_masuk' => '08:30',
                'status_masuk' => 'Tepat Waktu',
                'uid' => '53492607',
                'device' => 'KANTORJK_01',
                'lembur' => 'Normal (0 Jam)',
                'foto' => 'https://ui-avatars.com/api/?name=Dimas+Arya&background=0d9488&color=fff&size=96',
            ],
            [
                'tanggal' => '2026-08-03',
                'jam_masuk' => '08:42:10',
                'jam_pulang' => '17:25:00',
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'batas_masuk' => '08:30',
                'status_masuk' => 'Terlambat 12 Mnt',
                'uid' => '9491F306',
                'device' => 'KANTORJK_01',
                'lembur' => 'Normal (0 Jam)',
                'foto' => 'https://ui-avatars.com/api/?name=Akmal+Zaidan&background=2563eb&color=fff&size=96',
            ],
            [
                'tanggal' => '2026-08-02',
                'jam_masuk' => '07:18:00',
                'jam_pulang' => '19:30:00',
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'batas_masuk' => '07:30',
                'status_masuk' => 'Tepat Waktu',
                'uid' => '83A192B4',
                'device' => 'KANTORJK_01',
                'lembur' => 'Lembur 2 Jam',
                'foto' => 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96',
            ],
            [
                'tanggal' => '2026-08-02',
                'jam_masuk' => '08:28:50',
                'jam_pulang' => '17:10:00',
                'nama' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'batas_masuk' => '08:30',
                'status_masuk' => 'Tepat Waktu',
                'uid' => 'A3B7C901',
                'device' => 'KANTORJK_01',
                'lembur' => 'Normal (0 Jam)',
                'foto' => 'https://ui-avatars.com/api/?name=Anom+Arya&background=64748b&color=fff&size=96',
            ],
        ];

        $riwayat = $records;
        $kategori_list = ['Staff Kantor', 'Pekerja Harian'];
        $dari_tanggal = $request->get('dari_tanggal', '2026-08-01');
        $sampai_tanggal = $request->get('sampai_tanggal', '2026-08-03');
        $kategori = $request->get('kategori', '');

        return view('riwayat', compact(
            'records',
            'riwayat',
            'kategori_list',
            'dari_tanggal',
            'sampai_tanggal',
            'kategori'
        ));
    }
}
