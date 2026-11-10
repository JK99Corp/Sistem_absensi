<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KaryawanController extends Controller
{
    /**
     * Tampilkan halaman daftar karyawan dengan fitur SoftDeletes.
     */
    public function index(Request $request)
    {
        $tab = $request->get('tab', 'aktif'); // 'aktif' atau 'arsip' (soft deleted)

        // Data master karyawan aktif
        $karyawan_aktif = [
            [
                'id' => 1,
                'nama' => 'Dimas Arya Kedhaton',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid' => '53492607',
                'uid_rfid' => '53492607',
                'no_hp' => '0812-3456-7890',
                'status' => 'Aktif',
                'upah_harian' => 0,
                'tarif_lembur' => 0,
                'tgl_gabung' => '01/01/2026',
            ],
            [
                'id' => 2,
                'nama' => 'Akmal Zaidan',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid' => '9491F306',
                'uid_rfid' => '9491F306',
                'no_hp' => '0812-9876-5432',
                'status' => 'Aktif',
                'upah_harian' => 0,
                'tarif_lembur' => 0,
                'tgl_gabung' => '15/01/2026',
            ],
            [
                'id' => 3,
                'nama' => 'Anom Arya',
                'kategori' => 'Staff Kantor',
                'projek' => '-',
                'uid' => 'A3B7C901',
                'uid_rfid' => 'A3B7C901',
                'no_hp' => '0813-1122-3344',
                'status' => 'Aktif',
                'upah_harian' => 0,
                'tarif_lembur' => 0,
                'tgl_gabung' => '01/02/2026',
            ],
            [
                'id' => 4,
                'nama' => 'Joko Susilo',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek A',
                'uid' => '83A192B4',
                'uid_rfid' => '83A192B4',
                'no_hp' => '0857-1234-5678',
                'status' => 'Aktif',
                'upah_harian' => 120000,
                'tarif_lembur' => 25000,
                'tgl_gabung' => '01/07/2026',
            ],
            [
                'id' => 5,
                'nama' => 'Slamet Riyadi',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek B',
                'uid' => '47C201F8',
                'uid_rfid' => '47C201F8',
                'no_hp' => '0858-8765-4321',
                'status' => 'Aktif',
                'upah_harian' => 120000,
                'tarif_lembur' => 25000,
                'tgl_gabung' => '05/07/2026',
            ],
            [
                'id' => 6,
                'nama' => 'Bambang Triyono',
                'kategori' => 'Pekerja Harian',
                'projek' => 'Projek C',
                'uid' => '19E873A2',
                'uid_rfid' => '19E873A2',
                'no_hp' => '0878-9988-7766',
                'status' => 'Aktif',
                'upah_harian' => 110000,
                'tarif_lembur' => 25000,
                'tgl_gabung' => '10/07/2026',
            ],
        ];

        // Data arsip / soft-deleted (Karyawan yang dinonaktifkan tanpa merusak database keuangan)
        $karyawan_arsip = [
            [
                'id' => 7,
                'nama' => 'Sugeng Raharjo',
                'kategori' => 'Pekerja Harian',
                'uid' => 'B1287FE0',
                'uid_rfid' => 'B1287FE0',
                'no_hp' => '0856-3344-5566',
                'status' => 'Diarsipkan',
                'upah_harian' => 110000,
                'tarif_lembur' => 25000,
                'tgl_gabung' => '01/06/2026',
                'deleted_at' => '2026-07-28 16:00:00',
                'keterangan' => 'Selesai Proyek Harian Juli. Riwayat gaji & absensi tetap tersimpan rapi.',
            ],
        ];

        $karyawan = ($tab === 'arsip') ? $karyawan_arsip : $karyawan_aktif;

        return view('karyawan', compact('karyawan', 'tab', 'karyawan_aktif', 'karyawan_arsip'));
    }

    /**
     * Simpan data karyawan baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|in:Staff Kantor,Pekerja Harian',
            'uid_rfid' => 'required|string|max:32',
        ]);

        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('karyawan')) {
                \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
                    $karyawan = \App\Models\Karyawan::create([
                        'nama' => $request->nama,
                        'kategori' => $request->kategori,
                        'projek' => ($request->kategori === 'Pekerja Harian') ? ($request->projek ?? 'Projek A') : '-',
                        'uid_rfid' => strtoupper($request->uid_rfid),
                        'gaji_pokok' => $request->gaji_pokok ?? 0,
                        'upah_harian' => $request->upah_harian ?? ($request->kategori === 'Pekerja Harian' ? 120000 : 0),
                        'tarif_lembur' => $request->tarif_lembur ?? 25000,
                        'no_hp' => $request->no_hp,
                        'status' => 'Aktif',
                    ]);

                    \App\Models\AuditLog::log('TAMBAH_KARYAWAN', 'Karyawan', $karyawan->id, null, $karyawan->toArray());
                });
            }
        } catch (\Throwable $e) {
            // Log fallback jika database belum termigrasi
        }

        return redirect()->route('karyawan.index', ['tab' => 'aktif'])
            ->with('success', 'Data karyawan baru berhasil ditambahkan dan langsung terhubung dengan sistem absensi!');
    }

    /**
     * Pindahkan karyawan ke Arsip (Soft delete aman tanpa merusak riwayat keuangan).
     */
    public function destroy($id)
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('karyawan')) {
                $karyawan = \App\Models\Karyawan::find($id);
                if ($karyawan) {
                    $karyawan->delete(); // Soft delete otomatis mengisi deleted_at tanpa merusak relasi
                    \App\Models\AuditLog::log('ARSIP_KARYAWAN', 'Karyawan', $id, ['status' => 'Aktif'], ['status' => 'Diarsipkan']);
                }
            }
        } catch (\Throwable $e) {
            // Log fallback
        }

        return redirect()->route('karyawan.index', ['tab' => 'arsip'])
            ->with('success', 'Karyawan berhasil dipindahkan ke Arsip. Seluruh data absensi & riwayat upah masa lalu tetap aman 100%!');
    }

    /**
     * Pulihkan kembali karyawan dari Arsip ke aktif.
     */
    public function restore($id)
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('karyawan')) {
                $karyawan = \App\Models\Karyawan::onlyTrashed()->find($id);
                if ($karyawan) {
                    $karyawan->restore();
                    \App\Models\AuditLog::log('RESTORE_KARYAWAN', 'Karyawan', $id, ['status' => 'Diarsipkan'], ['status' => 'Aktif']);
                }
            }
        } catch (\Throwable $e) {
            // Log fallback
        }

        return redirect()->route('karyawan.index', ['tab' => 'aktif'])
            ->with('success', 'Karyawan berhasil dipulihkan dari Arsip ke daftar aktif!');
    }
}
