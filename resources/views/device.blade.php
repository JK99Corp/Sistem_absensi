@extends('layouts.app')

@section('title', 'Device Absensi')
@section('active_menu', 'device')

@section('content')

    {{-- Page Header --}}
    <div class="flex items-center justify-between mb-8">
        <div>
            <h2 class="text-2xl font-bold text-slate-800">Device Absensi</h2>
            <p class="text-base text-slate-500 mt-1">Kelola perangkat keras alat absensi Dual-ESP32 (RFID + Kamera)</p>
        </div>
        <button type="button"
           onclick="alert('Fitur tambah device siap dihubungkan dengan perangkat ESP32 baru.')"
           class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg
                  text-base transition-colors duration-200 shadow-sm hover:shadow inline-flex items-center cursor-pointer">
            <i class="fas fa-plus mr-2"></i> Tambah Device
        </button>
    </div>

    {{-- Ringkasan Device Cards --}}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Device</p>
                    <p class="text-3xl font-bold text-slate-800 mt-1">2 Unit</p>
                </div>
                <div class="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-microchip text-teal-600 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Device Online</p>
                    <p class="text-3xl font-bold text-green-700 mt-1">1 Unit</p>
                </div>
                <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-wifi text-green-600 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-slate-400">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Device Offline</p>
                    <p class="text-3xl font-bold text-slate-600 mt-1">1 Unit</p>
                </div>
                <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-power-off text-slate-500 text-xl"></i>
                </div>
            </div>
        </div>
    </div>

    {{-- Device Table --}}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-slate-700 text-white">
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">No</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Kode Device</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Lokasi</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Tipe Hardware</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">IP Address</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Terakhir Aktif</th>
                        <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Status</th>
                        <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($devices ?? [] as $index => $row)
                        <tr class="hover:bg-slate-50 transition-colors duration-150">
                            <td class="px-6 py-4 text-base text-slate-500">{{ $index + 1 }}</td>
                            <td class="px-6 py-4 text-base font-bold text-slate-800">
                                <span class="bg-slate-100 px-3 py-1 rounded font-mono">{{ $row->nama_device ?? $row['nama_device'] ?? '-' }}</span>
                            </td>
                            <td class="px-6 py-4 text-base text-slate-700">{{ $row->lokasi ?? $row['lokasi'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-base text-slate-600">
                                <span class="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                                    <i class="fas fa-camera mr-1.5 text-xs"></i>
                                    {{ $row->tipe ?? $row['tipe'] ?? 'Dual ESP32' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ $row->ip_address ?? $row['ip_address'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-sm text-slate-500">{{ $row->terakhir_aktif ?? $row['terakhir_aktif'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-center">
                                @php
                                    $st = strtolower($row->status ?? $row['status'] ?? 'offline');
                                @endphp
                                @if ($st === 'online')
                                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                        <span class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Online
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600">
                                        <span class="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> Offline
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button type="button"
                                            onclick="alert('Live View Kamera ESP32-S3 OV5640 dihubungkan ke stream lokal (192.168.1.100:81/stream)')"
                                            class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200 inline-flex items-center cursor-pointer">
                                        <i class="fas fa-video mr-1"></i> Live Cam
                                    </button>
                                    <button type="button"
                                            onclick="alert('Pengaturan parameter sinkronisasi RTC & Baudrate UART Dual ESP32')"
                                            class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200 inline-flex items-center cursor-pointer">
                                        <i class="fas fa-cog mr-1"></i> Setting
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="px-6 py-12 text-center text-slate-400 text-lg">
                                <i class="fas fa-desktop text-4xl mb-3 block"></i>
                                Belum ada device terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

@endsection

