<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Karyawan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'karyawan';

    /**
     * Field yang dapat diisi secara mass-assignment.
     */
    protected $fillable = [
        'nama',
        'kategori', // 'Staff Kantor' atau 'Pekerja Harian'
        'projek', // 'Projek A', 'Projek B', 'Projek C', atau '-' untuk staf kantor
        'uid_rfid',
        'gaji_pokok', // Gaji pokok bulanan untuk Staff Kantor
        'upah_harian', // Upah harian untuk Pekerja Harian
        'tarif_lembur', // Tarif lembur per jam (Staff Kantor & Pekerja Harian)
        'no_hp',
        'alamat',
        'status', // 'Aktif' / 'Nonaktif'
    ];

    /**
     * Casting tipe data
     */
    protected $casts = [
        'gaji_pokok' => 'integer',
        'upah_harian' => 'integer',
        'tarif_lembur' => 'integer',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope untuk hanya mengambil karyawan yang aktif (belum dihapus secara soft-delete).
     */
    public function scopeAktif($query)
    {
        return $query->whereNull('deleted_at')->where('status', 'Aktif');
    }

    /**
     * Scope khusus untuk Pekerja Harian (digunakan staf keuangan untuk perhitungan upah).
     */
    public function scopePekerjaHarian($query)
    {
        return $query->where('kategori', 'Pekerja Harian');
    }

    /**
     * Scope khusus untuk Staff Kantor tetap.
     */
    public function scopeStaffKantor($query)
    {
        return $query->where('kategori', 'Staff Kantor');
    }
}

