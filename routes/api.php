<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AttendanceApiController;

/*
|--------------------------------------------------------------------------
| Corporate IoT API Routes (Dual-ESP32 Hardware)
|--------------------------------------------------------------------------
| Endpoint terenkripsi untuk komunikasi mesin RFID + Kamera OV5640 ke Backend
*/

Route::prefix('v1')->group(function () {
    // Endpoint tap absensi mesin Dual-ESP32 (Diproteksi X-Device-Key)
    Route::post('/attendance/tap', [AttendanceApiController::class, 'tap'])->name('api.attendance.tap');
});

