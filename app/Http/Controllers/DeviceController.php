<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DeviceController extends Controller
{
    /**
     * Tampilkan halaman daftar device.
     */
    public function index()
    {
        // Data dummy device
        $devices = [
            [
                'id' => 1,
                'nama_device' => 'KANTORJK_01',
                'lokasi' => 'Pintu Masuk Utama',
                'tipe' => 'RFID + Camera',
                'ip_address' => '192.168.1.100',
                'terakhir_aktif' => '2026-08-03 09:43:42',
                'status' => 'online',
            ],
            [
                'id' => 2,
                'nama_device' => 'KANTORJK_02',
                'lokasi' => 'Pintu Belakang',
                'tipe' => 'RFID Only',
                'ip_address' => '192.168.1.101',
                'terakhir_aktif' => '2026-07-30 17:00:00',
                'status' => 'offline',
            ],
        ];

        return view('device', compact('devices'));
    }
}
