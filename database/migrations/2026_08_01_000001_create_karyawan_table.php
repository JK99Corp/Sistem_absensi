<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi tabel karyawan dengan fitur SoftDeletes.
     */
    public function up(): void
    {
        Schema::create('karyawan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('kategori', ['Staff Kantor', 'Pekerja Harian'])->default('Pekerja Harian');
            $table->string('uid_rfid', 32)->unique()->nullable()->comment('UID Kartu RFID fisik');
            $table->unsignedInteger('gaji_pokok')->default(0)->comment('Gaji pokok bulanan jika Staff Kantor');
            $table->unsignedInteger('upah_harian')->default(120000)->comment('Upah pokok harian jika Pekerja Harian');
            $table->unsignedInteger('tarif_lembur')->default(25000)->comment('Tarif lembur per jam');
            $table->string('no_hp', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->timestamps();

            // SOFT DELETES: Menjamin data keuangan & historis absensi tidak hilang saat karyawan dinonaktifkan
            $table->softDeletes();
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('karyawan');
    }
};

