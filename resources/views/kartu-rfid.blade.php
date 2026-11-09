@extends('layouts.app')

@section('title', 'Kartu RFID')
@section('active_menu', 'kartu-rfid')

@section('content')

    {{-- Page Header --}}
    <div class="flex items-center justify-between mb-8">
        <div>
            <h2 class="text-2xl font-bold text-slate-800">Kartu RFID Terdaftar</h2>
            <p class="text-base text-slate-500 mt-1">Kelola kartu RFID yang terdaftar di sistem</p>
        </div>
        <a href="{{ url('/kartu-rfid/create') }}"
           class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg
                  text-base transition-colors duration-200 shadow-sm hover:shadow inline-flex items-center">
            <i class="fas fa-plus mr-2"></i> Daftarkan Kartu Baru
        </a>
    </div>

    {{-- Success Message --}}
    @if (session('success'))
        <div class="bg-green-50 border border-green-200 text-green-700 rounded-lg px-5 py-4 mb-6 text-base">
            <i class="fas fa-check-circle mr-2"></i>
            {{ session('success') }}
        </div>
    @endif

    {{-- Data Table --}}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-slate-700 text-white">
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">No</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">UID Kartu</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Pemilik</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Kategori</th>
                        <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Tanggal Daftar</th>
                        <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Status</th>
                        <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($kartu ?? [] as $index => $row)
                        <tr class="hover:bg-slate-50 transition-colors duration-150">
                            <td class="px-6 py-4 text-base text-slate-500">{{ $index + 1 }}</td>
                            <td class="px-6 py-4 text-sm text-slate-700 font-mono font-semibold">{{ $row->uid ?? $row['uid'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-base text-slate-800 font-semibold">{{ $row->pemilik ?? $row['pemilik'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-base text-slate-600">{{ $row->kategori ?? $row['kategori'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-base text-slate-600">{{ $row->tanggal_daftar ?? $row['tanggal_daftar'] ?? '-' }}</td>
                            <td class="px-6 py-4 text-center">
                                @php
                                    $status = $row->status ?? $row['status'] ?? 'Aktif';
                                @endphp
                                @if ($status === 'Aktif' || $status === 1 || $status === true)
                                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                        <i class="fas fa-circle text-[8px] mr-1.5"></i> Aktif
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                                        <i class="fas fa-circle text-[8px] mr-1.5"></i> Nonaktif
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <a href="{{ url('/kartu-rfid/' . ($row->id ?? $row['id'] ?? 0) . '/edit') }}"
                                       class="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-2 px-4 rounded-lg
                                              text-sm transition-colors duration-200 inline-flex items-center">
                                        <i class="fas fa-edit mr-1"></i> Edit
                                    </a>
                                    <form method="POST" action="{{ url('/kartu-rfid/' . ($row->id ?? $row['id'] ?? 0)) }}"
                                          onsubmit="return confirm('Yakin ingin menghapus kartu RFID ini?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                                class="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg
                                                       text-sm transition-colors duration-200 inline-flex items-center">
                                            <i class="fas fa-trash mr-1"></i> Hapus
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-12 text-center text-slate-400 text-lg">
                                <i class="fas fa-id-card text-4xl mb-3 block"></i>
                                Belum ada kartu RFID terdaftar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

@endsection
