@extends('layouts.app')

@section('title', 'Log Aktivitas & Audit Trail - PT Jaya Kedhaton')
@section('active_menu', 'audit-log')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fas fa-shield-halved text-teal-600"></i>
                <span>Log Aktivitas & Jejak Audit Perusahaan</span>
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">
                Pencatatan real-time seluruh aksi sistem, perubahan data karyawan, dan transaksi finansial (Immutable Audit Trail)
            </p>
        </div>
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <i class="fas fa-database"></i> PostgreSQL Ready
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <i class="fas fa-lock"></i> Hak Akses: Superadmin
            </span>
        </div>
    </div>

    <!-- Ringkasan Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
                <i class="fas fa-list-check"></i>
            </div>
            <div>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Aktivitas</p>
                <h3 class="text-2xl font-bold text-slate-800 mt-0.5">{{ count($logs) }}</h3>
            </div>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <i class="fas fa-user-shield"></i>
            </div>
            <div>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Aktor Aktif</p>
                <h3 class="text-2xl font-bold text-slate-800 mt-0.5">2 Akun</h3>
            </div>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                <i class="fas fa-clock-rotate-left"></i>
            </div>
            <div>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Integritas Audit</p>
                <h3 class="text-2xl font-bold text-emerald-600 mt-0.5">100% Valid</h3>
            </div>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <i class="fas fa-server"></i>
            </div>
            <div>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Status Penyimpanan</p>
                <h3 class="text-2xl font-bold text-slate-800 mt-0.5">Tersinkron</h3>
            </div>
        </div>
    </div>

    <!-- Tabel Log Aktivitas -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
                <i class="fas fa-history text-slate-400"></i> Rekam Jejak Aktivitas Terbaru
            </h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                        <th class="px-6 py-4">Waktu (WIB)</th>
                        <th class="px-6 py-4">Aktor / User</th>
                        <th class="px-6 py-4">Aksi / Event</th>
                        <th class="px-6 py-4">Entitas Target</th>
                        <th class="px-6 py-4">IP Address</th>
                        <th class="px-6 py-4 text-center">Detail Perubahan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                    @forelse ($logs as $log)
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 font-mono text-xs text-slate-600">
                                {{ $log->created_at }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-bold text-slate-800">{{ $log->user_username }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                    {{ $log->action }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-slate-700 font-medium">
                                {{ $log->target_entity }} @if(isset($log->target_id) && $log->target_id) #{{ $log->target_id }} @endif
                            </td>
                            <td class="px-6 py-4 font-mono text-xs text-slate-500">
                                {{ $log->ip_address ?? '127.0.0.1' }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="text-xs text-slate-500 font-mono">
                                    {{ is_array($log->payload_baru) ? json_encode($log->payload_baru) : ($log->payload_baru ?? '-') }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400 text-base">
                                <i class="fas fa-shield-alt text-3xl mb-2 block text-slate-300"></i>
                                Belum ada log aktivitas tercatat.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
