<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel Transaksi Absensi Harian (Terkoneksi langsung dengan mesin IoT & Finansial)
     */
    public function up(): void
    {
        Schema::create('absensi', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke Karyawan (Data historis tetap aman meski karyawan diarsipkan)
            $table->foreignId('karyawan_id')->constrained('karyawan')->onDelete('restrict');
            $table->string('uid_rfid', 32)->index()->comment('UID RFID saat tap fisik');
            
            // Relasi ke Device
            $table->foreignId('device_id')->nullable()->constrained('devices')->onDelete('set null');
            
            $table->date('tanggal')->index();
            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();
            
            // Status Keterlambatan sesuai kategori (Pekerja Harian > 07:30, Staff Kantor > 08:30)
            $table->enum('status_masuk', ['Tepat Waktu', 'Terlambat'])->default('Tepat Waktu');
            $table->unsignedSmallInteger('menit_keterlambatan')->default(0);
            
            // Perhitungan Lembur Otomatis (Tap Pulang > 17:30)
            $table->unsignedTinyInteger('jam_lembur')->default(0);
            $table->enum('status_lembur', ['Normal (0 Jam)', 'Lembur'])->default('Normal (0 Jam)');
            
            // Foto Bukti Kehadiran dari Kamera OV5640 ESP32-CAM
            $table->string('foto_path')->nullable();
            
            $table->timestamps();
            $table->softDeletes(); // Menjamin audit trail tidak dapat dihapus permanen secara sengaja

            // Composite Index untuk performa query rekap bulanan & query harian berkecepatan tinggi
            $table->index(['tanggal', 'karyawan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi');
    }
};

