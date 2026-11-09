<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel Audit Trail Keuangan & Data Karyawan (Kebutuhan Mutlak Perusahaan / Corporate Compliance)
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_username', 50)->comment('Admin / User pelaksana aksi');
            $table->string('action', 50)->comment('TAMBAH_KARYAWAN, ARSIP_KARYAWAN, RESTORE_KARYAWAN, UBAH_TARIF_LEMBUR, dsb');
            $table->string('target_entity', 50)->comment('Karyawan, Absensi, atau Upah');
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('payload_lama')->nullable()->comment('Nilai sebelum diubah');
            $table->json('payload_baru')->nullable()->comment('Nilai setelah diubah');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['created_at', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};

