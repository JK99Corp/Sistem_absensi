@extends('layouts.app')

@section('title', 'Rekap Mingguan')
@section('active_menu', 'rekap')

@section('content')

    {{-- Page Header --}}
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800">Rekap Mingguan</h2>
        <p class="text-base text-slate-500 mt-1">Rekap kehadiran karyawan per minggu</p>
    </div>

    {{-- Filter Section --}}
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form method="GET" action="{{ url('/rekap') }}" class="flex flex-wrap items-end gap-4">

            <div class="flex-1 min-w-[180px]">
                <label class="block text-sm font-semibold text-slate-600 mb-1">Dari Tanggal</label>
                <input type="date" name="dari_tanggal" value="{{ $dari_tanggal ?? date('Y-m-d', strtotime('monday this week')) }}"
                       class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700
                              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>

            <div class="flex-1 min-w-[180px]">
                <label class="block text-sm font-semibold text-slate-600 mb-1">Sampai Tanggal</label>
                <input type="date" name="sampai_tanggal" value="{{ $sampai_tanggal ?? date('Y-m-d', strtotime('saturday this week')) }}"
                       class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700
                              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>

            <div class="flex gap-3">
                <button type="submit"
                        class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg
                               text-base transition-colors duration-200 shadow-sm hover:shadow">
                    <i class="fas fa-eye mr-2"></i> Tampilkan
                </button>

                <a href="{{ url('/rekap/download?' . http_build_query(request()->query())) }}"
                   class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg
                          text-base transition-colors duration-200 shadow-sm hover:shadow inline-flex items-center">
                    <i class="fas fa-file-excel mr-2"></i> Download Excel
                </a>
            </div>

        </form>
    </div>

    {{-- Periode Info --}}
    <div class="bg-teal-50 border border-teal-200 rounded-lg px-6 py-4 mb-6">
        <p class="text-base text-teal-800 font-medium">
            <i class="fas fa-calendar-alt mr-2"></i>
            Periode: <span class="font-bold">{{ $periode ?? '-' }}</span>
        </p>
    </div>

    {{-- Rekap Table --}}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-slate-700 text-white">
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Nama</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Kategori</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Senin</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Selasa</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Rabu</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Kamis</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Jumat</th>
                        <th class="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide">Sabtu</th>
                        <th class="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wide bg-slate-800">Total Hadir</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($rekap ?? [] as $row)
                        <tr class="hover:bg-slate-50 transition-colors duration-150">
                            <td class="px-6 py-4 text-base text-slate-800 font-semibold">{{ $row->nama ?? $row['nama'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-base text-slate-600">{{ $row->kategori ?? $row['kategori'] ?? '-' }}</td>

                            @php
                                $days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
                            @endphp

                            @foreach ($days as $day)
                                @php
                                    $val = $row->$day ?? $row[$day] ?? '-';
                                @endphp
                                <td class="px-4 py-4 text-center text-base">
                                    @if ($val === 'Hadir' || $val === '✓' || $val === 1 || $val === true)
                                        <span class="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                                            <i class="fas fa-check"></i>
                                        </span>
                                    @else
                                        <span class="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm">
                                            -
                                        </span>
                                    @endif
                                </td>
                            @endforeach

                            <td class="px-5 py-4 text-center">
                                <span class="inline-flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-lg font-bold text-base">
                                    {{ $row->total_hadir ?? $row['total_hadir'] ?? 0 }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="px-6 py-12 text-center text-slate-400 text-lg">
                                <i class="fas fa-inbox text-4xl mb-3 block"></i>
                                Belum ada data rekap untuk periode ini.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

@endsection
