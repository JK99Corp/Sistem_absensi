<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\UpahController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\KartuRfidController;
use App\Http\Controllers\DeviceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Login Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.process');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (require authentication)
Route::middleware(['simple.auth'])->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Riwayat Absensi
    Route::get('/riwayat', [RiwayatController::class, 'index'])->name('riwayat.index');

    // Rekap Mingguan
    Route::get('/rekap', [RekapController::class, 'index'])->name('rekap.index');

    // Upah & Lembur (Khusus Pekerja Harian)
    Route::get('/upah', [UpahController::class, 'index'])->name('upah.index');

    // Karyawan (CRUD dengan SoftDeletes)
    Route::get('/karyawan', [KaryawanController::class, 'index'])->name('karyawan.index');
    Route::post('/karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
    Route::delete('/karyawan/{id}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');
    Route::post('/karyawan/{id}/restore', [KaryawanController::class, 'restore'])->name('karyawan.restore');

    // Kartu RFID
    Route::get('/kartu-rfid', [KartuRfidController::class, 'index'])->name('kartu-rfid.index');

    // Device
    Route::get('/device', [DeviceController::class, 'index'])->name('device.index');
});
