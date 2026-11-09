<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel Device IoT (Dual-ESP32 RFID + Kamera OV5640)
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('kode_device', 32)->unique()->comment('Contoh: KANTORJK_01');
            $table->string('lokasi', 100)->comment('Lokasi fisik pemasangan');
            $table->string('tipe', 50)->default('Dual ESP32 (RFID + Cam)');
            $table->string('ip_address', 45)->nullable();
            $table->string('api_key', 64)->unique()->comment('Token autentikasi mesin ke backend');
            $table->enum('status', ['Online', 'Offline'])->default('Online');
            $table->timestamp('last_ping')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};

