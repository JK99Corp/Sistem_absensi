<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $table = 'devices';

    protected $fillable = [
        'kode_device',
        'lokasi',
        'tipe',
        'ip_address',
        'api_key',
        'status',
        'last_ping',
    ];

    protected $casts = [
        'last_ping' => 'datetime',
    ];

    public function absensi()
    {
        return $this->hasMany(Absensi::class, 'device_id');
    }
}

