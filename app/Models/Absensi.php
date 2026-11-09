<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Absensi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'absensi';

    protected $fillable = [
        'karyawan_id',
        'uid_rfid',
        'device_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status_masuk',
        'menit_keterlambatan',
        'jam_lembur',
        'status_lembur',
        'foto_path',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'menit_keterlambatan' => 'integer',
        'jam_lembur' => 'integer',
    ];

    /**
     * Relasi ke Master Data Karyawan (Termasuk yang diarsipkan / withTrashed)
     */
    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_id')->withTrashed();
    }

    /**
     * Relasi ke Device IoT
     */
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    /**
     * Hitung otomatis status keterlambatan berdasarkan kategori karyawan
     * - Pekerja Harian: Maksimal 07:30 WIB
     * - Staff Kantor: Maksimal 08:30 WIB
     */
    public static function hitungKeterlambatan(string $kategori, string $jamMasuk): array
    {
        $batas = ($kategori === 'Pekerja Harian') ? '07:30:00' : '08:30:00';
        $masukTime = strtotime($jamMasuk);
        $batasTime = strtotime($batas);

        if ($masukTime > $batasTime) {
            $diffMenit = (int) ceil(($masukTime - $batasTime) / 60);
            return [
                'status_masuk' => 'Terlambat',
                'menit' => $diffMenit,
                'keterangan' => "Terlambat {$diffMenit} Menit"
            ];
        }

        return [
            'status_masuk' => 'Tepat Waktu',
            'menit' => 0,
            'keterangan' => 'Tepat Waktu'
        ];
    }

    /**
     * Hitung otomatis jam lembur (Tap Pulang > 17:30 WIB)
     */
    public static function hitungLembur(string $jamPulang): array
    {
        $batasNormal = strtotime('17:30:00');
        $pulangTime = strtotime($jamPulang);

        if ($pulangTime > $batasNormal) {
            $jamLembur = (int) floor(($pulangTime - $batasNormal) / 3600);
            return [
                'jam_lembur' => max(1, $jamLembur),
                'status_lembur' => "Lembur {$jamLembur} Jam"
            ];
        }

        return [
            'jam_lembur' => 0,
            'status_lembur' => 'Normal (0 Jam)'
        ];
    }
}

