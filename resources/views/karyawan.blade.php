@extends('layouts.app')

@section('title', 'Data Karyawan')
@section('active_menu', 'karyawan')

@section('content')

    {{-- Page Header --}}
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
            <h2 class="text-2xl font-bold text-slate-800">Data Karyawan & Staf</h2>
            <p class="text-base text-slate-500 mt-0.5">
                Kelola data staf kantor dan pekerja harian dengan perlindungan data keuangan
            </p>
        </div>
        <button type="button"
                onclick="bukaModalTambah()"
                class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl
                       text-base transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer">
            <i class="fas fa-user-plus text-lg"></i> Tambah Karyawan Baru
        </button>
    </div>

    {{-- Keterangan Arsip Aman (Simpel & Rapi) --}}
    <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
        <div class="flex items-center gap-3 text-sm text-slate-600">
            <i class="fas fa-shield-alt text-teal-600 text-lg shrink-0"></i>
            <span>Karyawan yang dinonaktifkan akan dipindahkan ke tab <strong>Arsip</strong>. Seluruh riwayat absensi, upah, dan jam lembur masa lalu tetap aman tersimpan rapi untuk pembukuan keuangan.</span>
        </div>
    </div>

    {{-- Success Message --}}
    @if (session('success'))
        <div class="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 mb-6 text-base flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2">
                <i class="fas fa-check-circle text-green-600 text-lg"></i>
                <span class="font-medium">{{ session('success') }}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    @endif

    {{-- Tab Pilihan: Karyawan Aktif vs Arsip --}}
    <div class="flex items-center gap-3 border-b border-slate-200 mb-6 pb-2">
        @php
            $currentTab = $tab ?? 'aktif';
            $countAktif = count($karyawan_aktif ?? []);
            $countArsip = count($karyawan_arsip ?? []);
        @endphp

        <a href="{{ url('/karyawan?tab=aktif') }}"
           class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-bold transition-colors
                  {{ $currentTab === 'aktif'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200' }}">
            <i class="fas fa-users"></i>
            <span>Karyawan Aktif</span>
            <span class="ml-1 text-xs px-2 py-0.5 rounded-full {{ $currentTab === 'aktif' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700' }}">
                {{ $countAktif }}
            </span>
        </a>

        <a href="{{ url('/karyawan?tab=arsip') }}"
           class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-bold transition-colors
                  {{ $currentTab === 'arsip'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200' }}">
            <i class="fas fa-archive"></i>
            <span>Arsip</span>
            <span class="ml-1 text-xs px-2 py-0.5 rounded-full {{ $currentTab === 'arsip' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700' }}">
                {{ $countArsip }}
            </span>
        </a>
    </div>

    {{-- Tabel Daftar Karyawan --}}
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                        <th class="px-5 py-4 text-left">No</th>
                        <th class="px-5 py-4 text-left">Nama Lengkap</th>
                        <th class="px-4 py-4 text-left">Kategori</th>
                        <th class="px-4 py-4 text-left">UID Kartu RFID</th>
                        <th class="px-4 py-4 text-left">Kontak (HP)</th>
                        @if ($currentTab === 'aktif')
                            <th class="px-4 py-4 text-left">Ketentuan Upah</th>
                            <th class="px-4 py-4 text-center">Status</th>
                            <th class="px-4 py-4 text-center">Aksi Aman</th>
                        @else
                            <th class="px-4 py-4 text-left">Waktu Dinonaktifkan</th>
                            <th class="px-5 py-4 text-left">Keterangan Arsip</th>
                            <th class="px-4 py-4 text-center">Aksi Pemulihan</th>
                        @endif
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($karyawan ?? [] as $index => $row)
                        @php
                            $p = (array)$row;
                            $isHarian = ($p['kategori'] ?? '') === 'Pekerja Harian';
                        @endphp
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-5 py-4 text-base text-slate-500">{{ $index + 1 }}</td>
                            
                            <td class="px-5 py-4">
                                <p class="text-base font-bold text-slate-900">{{ $p['nama'] ?? '-' }}</p>
                                <span class="text-xs text-slate-400">Bergabung: {{ $p['tgl_gabung'] ?? '01/01/2026' }}</span>
                            </td>

                            <td class="px-4 py-4">
                                @if ($isHarian)
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                                        <i class="fas fa-hammer mr-1 text-[10px]"></i> Pekerja Harian
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                                        <i class="fas fa-briefcase mr-1 text-[10px]"></i> Staff Kantor
                                    </span>
                                @endif
                            </td>

                            <td class="px-4 py-4 font-mono text-sm font-semibold text-slate-700">
                                {{ $p['uid'] ?? $p['uid_rfid'] ?? '-' }}
                            </td>

                            <td class="px-4 py-4 text-sm text-slate-600">
                                {{ $p['no_hp'] ?? '-' }}
                            </td>

                            @if ($currentTab === 'aktif')
                                <td class="px-4 py-4 text-sm">
                                    @if ($isHarian)
                                        <p class="font-bold text-slate-800">Rp {{ number_format($p['upah_harian'] ?? 120000, 0, ',', '.') }} / hari</p>
                                        <span class="text-xs text-amber-700 font-semibold">+ Lembur Rp {{ number_format($p['tarif_lembur'] ?? 25000, 0, ',', '.') }} / jam</span>
                                    @else
                                        <span class="text-slate-500 font-medium">Gaji Bulanan Tetap</span>
                                    @endif
                                </td>

                                <td class="px-4 py-4 text-center">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <i class="fas fa-circle text-[8px] mr-1.5"></i> Aktif
                                    </span>
                                </td>

                                <td class="px-4 py-4 text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <button type="button"
                                                onclick="alert('Edit data karyawan: {{ $p['nama'] }}')"
                                                class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors">
                                            <i class="fas fa-edit mr-1"></i> Edit
                                        </button>
                                        
                                        {{-- Tombol Pindah ke Arsip --}}
                                        <form method="POST" action="{{ url('/karyawan/' . ($p['id'] ?? 1)) }}"
                                              onsubmit="return confirm('PERINGATAN AMAN:\n\nKaryawan ini akan dipindahkan ke Arsip.\n\nApakah Anda yakin? Seluruh data laporan keuangan dan jam lembur masa lalu TETAP AMAN dan TIDAK AKAN HILANG.')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                    class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                                                <i class="fas fa-archive"></i> Arsipkan
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            @else
                                {{-- Kolom Khusus Tab Arsip --}}
                                <td class="px-4 py-4 text-xs font-mono text-slate-500">
                                    {{ $p['deleted_at'] ?? '2026-07-28 16:00' }}
                                </td>

                                <td class="px-5 py-4 text-sm text-slate-600">
                                    {{ $p['keterangan'] ?? 'Arsip riwayat data keuangan & absensi tetap tersimpan rapi di sistem.' }}
                                </td>

                                <td class="px-4 py-4 text-center">
                                    {{-- Tombol Pulihkan dari Arsip --}}
                                    <form method="POST" action="{{ url('/karyawan/' . ($p['id'] ?? 1) . '/restore') }}"
                                          onsubmit="return confirm('Pulihkan kembali karyawan ini dari arsip ke daftar aktif?')">
                                        @csrf
                                        <button type="submit"
                                                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow flex items-center gap-1.5 mx-auto cursor-pointer">
                                            <i class="fas fa-rotate-left"></i> Pulihkan dari Arsip
                                        </button>
                                    </form>
                                </td>
                            @endif
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="px-6 py-12 text-center text-slate-400 text-base">
                                Tidak ada data pada tab ini.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- MODAL FORM TAMBAH KARYAWAN BARU (SANGAT MUDAH & INTUITIF) --}}
    <div id="modalTambahKaryawan" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-slate-800 relative max-h-[90vh] overflow-y-auto">
            
            <button onclick="tutupModalTambah()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">
                <i class="fas fa-times"></i>
            </button>

            {{-- Judul Modal --}}
            <div class="mb-6 pb-4 border-b border-slate-200">
                <h3 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <i class="fas fa-user-plus text-teal-600"></i> Tambah Karyawan Baru
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                    Data baru langsung disinkronkan ke mesin Dual-ESP32 & sistem penggajian
                </p>
            </div>

            <form method="POST" action="{{ url('/karyawan') }}" id="formTambah">
                @csrf

                {{-- Nama Lengkap --}}
                <div class="mb-5">
                    <label class="block text-base font-bold text-slate-700 mb-1.5">
                        Nama Lengkap <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" name="nama" required
                           placeholder="Contoh: Budi Santoso"
                           class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base text-slate-800 focus:outline-none focus:border-teal-500">
                </div>

                {{-- Pilihan 2 Kategori Karyawan --}}
                <div class="mb-5">
                    <label class="block text-base font-bold text-slate-700 mb-2">
                        Kategori Karyawan <span class="text-rose-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="border-2 border-slate-300 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-teal-500 transition-colors has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50">
                            <input type="radio" name="kategori" value="Staff Kantor" class="w-5 h-5 text-teal-600" onchange="toggleKategoriForm(this.value)">
                            <div>
                                <p class="font-bold text-slate-800 text-sm">Staff Kantor</p>
                                <span class="text-xs text-slate-500">Gaji Tetap Bulanan</span>
                            </div>
                        </label>

                        <label class="border-2 border-slate-300 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-colors has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50">
                            <input type="radio" name="kategori" value="Pekerja Harian" checked class="w-5 h-5 text-amber-600" onchange="toggleKategoriForm(this.value)">
                            <div>
                                <p class="font-bold text-slate-800 text-sm">Pekerja Harian</p>
                                <span class="text-xs text-slate-500">Upah Harian + Lembur</span>
                            </div>
                        </label>
                    </div>
                </div>

                {{-- Bagian Khusus Pekerja Harian (Upah Pokok & Tarif Lembur Default) --}}
                <div id="boxPekerjaHarian" class="p-4 bg-amber-50/70 border border-amber-200 rounded-xl mb-5 space-y-4">
                    <p class="text-xs font-bold text-amber-900 uppercase tracking-wide">
                        <i class="fas fa-coins text-amber-600 mr-1"></i> Ketentuan Upah Default (Pekerja Harian)
                    </p>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Upah Pokok / Hari (Rp)</label>
                            <input type="number" name="upah_harian" value="120000" step="5000"
                                   class="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 bg-white">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Tarif Lembur / Jam (Rp)</label>
                            <input type="number" name="tarif_lembur" value="25000" step="5000"
                                   class="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 bg-white">
                        </div>
                    </div>
                    <p class="text-[11px] text-slate-500 italic">*Nominal ini dapat disesuaikan kembali sewaktu-waktu oleh staf keuangan di menu Upah & Lembur.</p>
                </div>

                {{-- UID Kartu RFID --}}
                <div class="mb-5">
                    <label class="block text-base font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>UID Kartu RFID <span class="text-rose-500">*</span></span>
                        <button type="button" onclick="isiUidOtomatis()" class="text-xs text-teal-700 font-bold hover:underline">
                            <i class="fas fa-wifi mr-1"></i> Simulasi Tap Kartu
                        </button>
                    </label>
                    <input type="text" name="uid_rfid" id="inputUidRfid" required
                           placeholder="Contoh: 83A192B4"
                           class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-mono font-bold text-slate-800 focus:outline-none focus:border-teal-500 uppercase">
                    <span class="text-xs text-slate-400 mt-1 block">Tempelkan kartu RFID baru pada mesin absensi atau ketik kode UID kartu</span>
                </div>

                {{-- Nomor WhatsApp / Telepon --}}
                <div class="mb-6">
                    <label class="block text-base font-bold text-slate-700 mb-1.5">
                        Nomor Kontak / WhatsApp
                    </label>
                    <input type="text" name="no_hp"
                           placeholder="Contoh: 0812-3456-7890"
                           class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base text-slate-800 focus:outline-none focus:border-teal-500">
                </div>

                {{-- Tombol Submit & Batal --}}
                <div class="flex gap-3 pt-2">
                    <button type="submit"
                            class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fas fa-save"></i> Simpan Data Karyawan
                    </button>
                    <button type="button"
                            onclick="tutupModalTambah()"
                            class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-base transition-colors cursor-pointer">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- Script Interaksi Modal & Form --}}
    <script>
        function bukaModalTambah() {
            document.getElementById('modalTambahKaryawan').classList.remove('hidden');
        }

        function tutupModalTambah() {
            document.getElementById('modalTambahKaryawan').classList.add('hidden');
        }

        function toggleKategoriForm(kat) {
            const boxHarian = document.getElementById('boxPekerjaHarian');
            if (kat === 'Pekerja Harian') {
                boxHarian.classList.remove('hidden');
            } else {
                boxHarian.classList.add('hidden');
            }
        }

        function isiUidOtomatis() {
            const hex = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
            document.getElementById('inputUidRfid').value = hex;
        }
    </script>

@endsection
