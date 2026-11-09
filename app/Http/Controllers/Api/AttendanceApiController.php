<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Karyawan;
use App\Models\Absensi;
use App\Models\Device;

class AttendanceApiController extends Controller
{
    /**
     * Endpoint API untuk Mesin Dual-ESP32 saat Karyawan Melakukan Tap Kartu RFID
     * POST /api/v1/attendance/tap
     */
    public function tap(Request $request)
    {
        // 1. Validasi Keamanan API Key Mesin IoT
        $apiKey = $request->header('X-Device-Key') ?? $request->input('device_key');
        $device = Device::where('api_key', $apiKey)->first();

        if (!$device) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized device. API Key tidak valid.'
            ], 401);
        }

        // Update heartbeat / last ping device
        $device->update([
            'last_ping' => now(),
            'ip_address' => $request->ip(),
            'status' => 'Online'
        ]);

        // 2. Validasi Input Tap RFID
        $uidRfid = strtoupper(trim($request->input('uid_rfid')));
        if (empty($uidRfid)) {
            return response()->json([
                'status' => 'error',
                'message' => 'UID RFID tidak boleh kosong.'
            ], 422);
        }

        // 3. Cari Data Karyawan Aktif
        $karyawan = Karyawan::where('uid_rfid', $uidRfid)->first();
        if (!$karyawan) {
            return response()->json([
                'status' => 'unregistered',
                'message' => "Kartu RFID UID [{$uidRfid}] belum terdaftar di sistem Jaya Kedhaton."
            ], 404);
        }

        $today = now()->toDateString();
        $currentTime = now()->toTimeString();

        return DB::transaction(function () use ($karyawan, $device, $today, $currentTime, $request) {
            // Cari apakah sudah tap masuk hari ini
            $absensi = Absensi::where('karyawan_id', $karyawan->id)
                ->where('tanggal', $today)
                ->first();

            // A. KASUS 1: TAP MASUK (Pertama kali tap hari ini)
            if (!$absensi) {
                $statusKeterlambatan = Absensi::hitungKeterlambatan($karyawan->kategori, $currentTime);

                // Simpan foto dari ESP32-CAM jika ada
                $fotoPath = null;
                if ($request->hasFile('foto')) {
                    $fotoPath = $request->file('foto')->store('absensi/' . $today, 'public');
                }

                $absensi = Absensi::create([
                    'karyawan_id' => $karyawan->id,
                    'uid_rfid' => $karyawan->uid_rfid,
                    'device_id' => $device->id,
                    'tanggal' => $today,
                    'jam_masuk' => $currentTime,
                    'status_masuk' => $statusKeterlambatan['status_masuk'],
                    'menit_keterlambatan' => $statusKeterlambatan['menit'],
                    'foto_path' => $fotoPath,
                ]);

                return response()->json([
                    'status' => 'success',
                    'tipe' => 'MASUK',
                    'nama' => $karyawan->nama,
                    'kategori' => $karyawan->kategori,
                    'jam' => $currentTime,
                    'keterangan' => $statusKeterlambatan['keterangan'],
                    'audio_beep' => 'beep_success'
                ], 200);
            }

            // B. KASUS 2: TAP PULANG
            $hitungLembur = Absensi::hitungLembur($currentTime);

            $absensi->update([
                'jam_pulang' => $currentTime,
                'jam_lembur' => $hitungLembur['jam_lembur'],
                'status_lembur' => $hitungLembur['status_lembur']
            ]);

            return response()->json([
                'status' => 'success',
                'tipe' => 'PULANG',
                'nama' => $karyawan->nama,
                'kategori' => $karyawan->kategori,
                'jam' => $currentTime,
                'lembur' => $hitungLembur['status_lembur'],
                'audio_beep' => 'beep_goodbye'
            ], 200);
        });
    }
}

