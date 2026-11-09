<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_logs';

    protected $fillable = [
        'user_username',
        'action',
        'target_entity',
        'target_id',
        'payload_lama',
        'payload_baru',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'payload_lama' => 'array',
        'payload_baru' => 'array',
    ];

    /**
     * Catat log audit kepatuhan perusahaan
     */
    public static function log(string $action, string $entity, ?int $targetId = null, ?array $lama = null, ?array $baru = null): self
    {
        return self::create([
            'user_username' => session('user', 'admin'),
            'action' => $action,
            'target_entity' => $entity,
            'target_id' => $targetId,
            'payload_lama' => $lama,
            'payload_baru' => $baru,
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => request()->userAgent() ?? 'System',
        ]);
    }
}

