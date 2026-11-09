<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RekapController extends Controller
{
    /**
     * Tampilkan halaman rekap mingguan.
     */
    public function index(Request $request)
    {
        // Periode rekap sesuai dokumen/excel slide
        $periode = '03/08/2026 - 08/08/2026';
        $periode_mulai = '03/08/2026';
        $periode_selesai = '08/08/2026';

        $dari_tanggal = $request->get('dari_tanggal', '2026-08-03');
        $sampai_tanggal = $request->get('sampai_tanggal', '2026-08-08');

        // Header hari
        $hari_header = [
            'Senin' => '03/08',
            'Selasa' => '04/08',
            'Rabu' => '05/08',
            'Kamis' => '06/08',
            'Jumat' => '07/08',
            'Sabtu' => '08/08',
        ];

        // Data rekap mingguan persis seperti tabel Excel di PPT
        $rekap = [
            [
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'senin' => 'Hadir',
                'selasa' => '-',
                'rabu' => '-',
                'kamis' => '-',
                'jumat' => '-',
                'sabtu' => '-',
                'total_hadir' => 1,
            ],
            [
                'nama' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'senin' => '-',
                'selasa' => '-',
                'rabu' => '-',
                'kamis' => '-',
                'jumat' => '-',
                'sabtu' => '-',
                'total_hadir' => 0,
            ],
            [
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'senin' => 'Hadir',
                'selasa' => '-',
                'rabu' => '-',
                'kamis' => '-',
                'jumat' => '-',
                'sabtu' => '-',
                'total_hadir' => 1,
            ],
        ];

        return view('rekap', compact(
            'periode',
            'periode_mulai',
            'periode_selesai',
            'dari_tanggal',
            'sampai_tanggal',
            'hari_header',
            'rekap'
        ));
    }
}
