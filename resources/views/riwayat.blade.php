@extends('layouts.app')

@section('title', 'Riwayat Absensi')
@section('active_menu', 'riwayat')

@section('content')

    {{-- Page Header --}}
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800">Riwayat Absensi</h2>
        <p class="text-base text-slate-500 mt-1">Log absensi masuk & pulang dilengkapi bukti foto kamera ESP32-S3 dan status lembur</p>
    </div>

    {{-- Filter Section --}}
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <form method="GET" action="{{ url('/riwayat') }}" class="flex flex-wrap items-end gap-4">

            <div class="flex-1 min-w-[180px]">
                <label class="block text-sm font-semibold text-slate-600 mb-1">Dari Tanggal</label>
                <input type="date" name="dari_tanggal" value="{{ $dari_tanggal ?? '2026-08-01' }}"
                       class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700">
            </div>

            <div class="flex-1 min-w-[180px]">
                <label class="block text-sm font-semibold text-slate-600 mb-1">Sampai Tanggal</label>
                <input type="date" name="sampai_tanggal" value="{{ $sampai_tanggal ?? '2026-08-03' }}"
                       class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700">
            </div>

            <div class="flex-1 min-w-[180px]">
                <label class="block text-sm font-semibold text-slate-600 mb-1">Kategori Karyawan</label>
                <select name="kategori"
                        class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700">
                    <option value="">Semua (2 Kategori)</option>
                    @foreach ($kategori_list ?? ['Staff Kantor', 'Pekerja Harian'] as $kat)
                        <option value="{{ $kat }}" {{ ($kategori ?? '') == $kat ? 'selected' : '' }}>{{ $kat }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <button type="submit"
                        class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg text-base transition-colors shadow">
                    <i class="fas fa-search mr-2"></i> Cari
                </button>
            </div>

        </form>
    </div>

    {{-- Data Table --}}
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                        <th class="px-5 py-4 text-left">No</th>
                        <th class="px-4 py-4 text-left">Tanggal</th>
                        <th class="px-5 py-4 text-left">Nama</th>
                        <th class="px-4 py-4 text-left">Kategori</th>
                        <th class="px-4 py-4 text-left">Batas Masuk</th>
                        <th class="px-4 py-4 text-left">Masuk</th>
                        <th class="px-4 py-4 text-left">Pulang</th>
                        <th class="px-4 py-4 text-left">Lembur (&gt;17:30)</th>
                        <th class="px-4 py-4 text-left">UID</th>
                        <th class="px-4 py-4 text-center">Foto Bukti</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($records ?? $riwayat ?? [] as $index => $r)
                        @php
                            $row = (array)$r;
                            $kat = $row['kategori'] ?? 'Staff Kantor';
                            $lembur = $row['lembur'] ?? 'Normal (0 Jam)';
                            $isHarian = ($kat === 'Pekerja Harian');
                            $batas = $isHarian ? '07:30' : '08:30';
                        @endphp
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-5 py-4 text-base text-slate-500">{{ $index + 1 }}</td>
                            <td class="px-4 py-4 text-base text-slate-700 font-medium">{{ $row['tanggal'] ?? '-' }}</td>
                            <td class="px-5 py-4 text-base text-slate-900 font-bold">{{ $row['nama'] ?? '-' }}</td>
                            <td class="px-4 py-4">
                                @if ($isHarian)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                                        Pekerja Harian
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                                        Staff Kantor
                                    </span>
                                @endif
                            </td>
                            <td class="px-4 py-4 text-xs font-mono font-semibold {{ $isHarian ? 'text-amber-800' : 'text-blue-800' }}">
                                Maks. {{ $batas }}
                            </td>
                            <td class="px-4 py-4 text-base font-semibold text-slate-800">{{ $row['jam_masuk'] ?? $row['jam'] ?? '-' }}</td>
                            <td class="px-4 py-4 text-base font-semibold text-slate-800">{{ $row['jam_pulang'] ?? '17:15:00' }}</td>
                            <td class="px-4 py-4">
                                @if (str_contains($lembur, 'Lembur'))
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                        <i class="fas fa-clock mr-1 text-[10px]"></i> {{ $lembur }}
                                    </span>
                                @else
                                    <span class="text-xs text-slate-400">Normal (0 Jam)</span>
                                @endif
                            </td>
                            <td class="px-4 py-4 text-sm font-mono text-slate-500">{{ $row['uid'] ?? '-' }}</td>
                            <td class="px-4 py-4 text-center">
                                <img src="{{ $row['foto'] ?? 'https://ui-avatars.com/api/?name=User&background=0d9488&color=fff' }}"
                                     alt="Foto" class="w-11 h-11 rounded-lg mx-auto border-2 border-slate-200 shadow-sm object-cover">
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="px-6 py-12 text-center text-slate-400 text-base">
                                Belum ada data riwayat absensi.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

@endsection
