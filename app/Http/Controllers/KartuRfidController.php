<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KartuRfidController extends Controller
{
    /**
     * Tampilkan halaman daftar kartu RFID.
     */
    public function index()
    {
        // Data dummy kartu RFID
        $kartu = [
            [
                'id' => 1,
                'uid' => '53492607',
                'pemilik' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'tanggal_daftar' => '2026-07-15 10:30',
                'terdaftar_pada' => '2026-07-15 10:30',
                'status' => 'Aktif',
            ],
            [
                'id' => 2,
                'uid' => '9491F306',
                'pemilik' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'tanggal_daftar' => '2026-07-15 10:35',
                'terdaftar_pada' => '2026-07-15 10:35',
                'status' => 'Aktif',
            ],
            [
                'id' => 3,
                'uid' => 'A3B7C901',
                'pemilik' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'tanggal_daftar' => '2026-07-16 09:00',
                'terdaftar_pada' => '2026-07-16 09:00',
                'status' => 'Aktif',
            ],
            [
                'id' => 4,
                'uid' => 'FF12AB34',
                'pemilik' => '(Kartu Cadangan)',
                'kategori' => 'Belum Terpasang',
                'tanggal_daftar' => '2026-07-20 14:00',
                'terdaftar_pada' => '2026-07-20 14:00',
                'status' => 'Nonaktif',
            ],
        ];

        $kartu_rfid = $kartu;

        return view('kartu-rfid', compact('kartu', 'kartu_rfid'));
    }
}
