/**
 * Karyawan View
 * PT. Jaya Kedhaton Enterprise System
 * Presentation template for active and archived employees
 */

const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('./layout');

function renderKaryawanView(tab = 'aktif', notifMsg = '', currentUser = null, notifType = 'success', karyawanAktif = [], karyawanArsip = []) {
    const isTabArsip = tab === 'arsip';
    const list = isTabArsip ? karyawanArsip : karyawanAktif;

    let alertColorCls = 'bg-green-50 border-green-200 text-green-800';
    let alertIcon = '<i class="fas fa-check-circle text-green-600 text-lg"></i>';
    if (notifType === 'error') {
        alertColorCls = 'bg-rose-50 border-rose-200 text-rose-800';
        alertIcon = '<i class="fas fa-exclamation-triangle text-rose-600 text-lg"></i>';
    } else if (notifType === 'warning') {
        alertColorCls = 'bg-amber-50 border-amber-200 text-amber-800';
        alertIcon = '<i class="fas fa-exclamation-circle text-amber-600 text-lg"></i>';
    }

    const notifHtml = notifMsg ? `
        <div class="${alertColorCls} border rounded-xl px-5 py-4 mb-6 text-base flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2">
                ${alertIcon}
                <span class="font-medium">${escapeHtml(notifMsg)}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    ` : '';

    const rows = list.map((p, i) => {
        const isHarian = p.kategori === 'Pekerja Harian';
        const katBadge = isHarian
            ? '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800"><i class="fas fa-hammer mr-1 text-[10px]"></i> Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800"><i class="fas fa-briefcase mr-1 text-[10px]"></i> Staff Kantor</span>';

        const searchMeta = escapeHtml(((p.nama || '') + ' ' + (p.uid || '') + ' ' + (p.noHp || '') + ' ' + (p.kategori || '')).toLowerCase());
        if (!isTabArsip) {
            const upahKet = isHarian
                ? `<p class="font-bold text-slate-800">Rp ${Number(p.upahHarian || 120000).toLocaleString('id-ID')} / hari</p><span class="text-xs text-amber-700 font-semibold">+ Lembur Rp ${Number(p.tarifLembur || 25000).toLocaleString('id-ID')}/jam</span>`
                : '<span class="text-slate-500 font-medium">Gaji Bulanan Tetap</span>';

            return `
                <tr class="row-karyawan hover:bg-slate-50 transition-colors" data-search="${searchMeta}">
                    <td class="px-5 py-4 text-base text-slate-500">${i + 1}</td>
                    <td class="px-5 py-4">
                        <p class="text-base font-bold text-slate-900">${escapeHtml(p.nama)}</p>
                        <span class="text-xs text-slate-400">Bergabung: ${escapeHtml(p.tglGabung || '01/01/2026')}</span>
                    </td>
                    <td class="px-4 py-4">${katBadge}</td>
                    <td class="px-4 py-4 font-mono text-sm font-semibold text-slate-700">${escapeHtml(p.uid)}</td>
                    <td class="px-4 py-4 text-sm text-slate-600">${escapeHtml(p.noHp || '-')}</td>
                    <td class="px-4 py-4 text-sm">${upahKet}</td>
                    <td class="px-4 py-4 text-center">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <i class="fas fa-circle text-[8px] mr-1.5"></i> Aktif
                        </span>
                    </td>
                    <td class="px-4 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button data-nama="${escapeHtml(p.nama)}" onclick="alert('Edit data: ' + this.dataset.nama)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <form method="POST" action="/karyawan/delete" onsubmit="return confirm('Apakah Anda yakin ingin menghapus data karyawan ${escapeHtml(p.nama)}?\\n\\nPerhatian: Tindakan ini akan menghapus data dari sistem operasional.')">
                                <input type="hidden" name="id" value="${p.id}">
                                <button type="submit" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                                    <i class="fas fa-trash-alt"></i> Hapus
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr class="row-karyawan hover:bg-slate-50 transition-colors" data-search="${searchMeta}">
                    <td class="px-5 py-4 text-base text-slate-500">${i + 1}</td>
                    <td class="px-5 py-4">
                        <p class="text-base font-bold text-slate-900">${escapeHtml(p.nama)}</p>
                        <span class="text-xs text-slate-400">Bergabung: ${escapeHtml(p.tglGabung || '01/01/2026')}</span>
                    </td>
                    <td class="px-4 py-4">${katBadge}</td>
                    <td class="px-4 py-4 font-mono text-sm font-semibold text-slate-700">${escapeHtml(p.uid)}</td>
                    <td class="px-4 py-4 text-sm text-slate-600">${escapeHtml(p.noHp || '-')}</td>
                    <td class="px-4 py-4 text-xs font-mono text-slate-500">${escapeHtml(p.deletedAt || '2026-07-28 16:00')}</td>
                    <td class="px-5 py-4 text-sm text-slate-600">${escapeHtml(p.keterangan || 'Data arsip keuangan tetap aman.')}</td>
                    <td class="px-4 py-4 text-center">
                        <form method="POST" action="/karyawan/restore" onsubmit="return confirm('Pulihkan kembali karyawan ini dari arsip ke daftar aktif?')">
                            <input type="hidden" name="id" value="${p.id}">
                            <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow flex items-center gap-1.5 mx-auto cursor-pointer">
                                <i class="fas fa-rotate-left"></i> Pulihkan dari Arsip
                            </button>
                        </form>
                    </td>
                </tr>
            `;
        }
    }).join('');

    const content = `
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

        <!-- Keterangan Arsip Aman (Simpel & Rapi) -->
        <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
            <div class="flex items-center gap-3 text-sm text-slate-600">
                <i class="fas fa-shield-alt text-teal-600 text-lg shrink-0"></i>
                <span>Karyawan yang dinonaktifkan akan dipindahkan ke tab <strong>Arsip</strong>. Seluruh riwayat absensi, upah, dan jam lembur masa lalu tetap aman tersimpan rapi untuk pembukuan keuangan.</span>
            </div>
        </div>

        ${notifHtml}

        <!-- Tab Pilihan -->
        <div class="flex items-center gap-3 border-b border-slate-200 mb-6 pb-2">
            <a href="/karyawan?tab=aktif"
               class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-bold transition-colors
                      ${!isTabArsip ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
                <i class="fas fa-users"></i>
                <span>Karyawan Aktif</span>
                <span class="ml-1 text-xs px-2 py-0.5 rounded-full ${!isTabArsip ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}">
                    ${karyawanAktif.length}
                </span>
            </a>

            <a href="/karyawan?tab=arsip"
               class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-bold transition-colors
                      ${isTabArsip ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
                <i class="fas fa-archive"></i>
                <span>Arsip</span>
                <span class="ml-1 text-xs px-2 py-0.5 rounded-full ${isTabArsip ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'}">
                    ${karyawanArsip.length}
                </span>
            </a>
        </div>

        <!-- Search & Filter Bar Cepat -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-200">
            <div class="flex flex-wrap items-center gap-4 justify-between">
                <div class="flex-1 min-w-[260px] relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" id="cariKaryawanInput" oninput="filterTabelKaryawan()"
                           placeholder="Cari nama pekerja, kode (contoh: SUDIRO-001), UID kartu, atau kontak..."
                           class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors">
                </div>
                <div class="flex items-center gap-3">
                    <select id="filterKategoriSelect" onchange="filterTabelKaryawan()"
                            class="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-teal-500 cursor-pointer">
                        <option value="">Semua Kategori</option>
                        <option value="Staff Kantor">Staff Kantor</option>
                        <option value="Pekerja Harian">Pekerja Harian</option>
                    </select>
                    <span id="counterKaryawan" class="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg whitespace-nowrap">
                        Menampilkan ${list.length} karyawan
                    </span>
                </div>
            </div>
        </div>

        <!-- Tabel Daftar Karyawan -->
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
                            ${!isTabArsip ? `
                                <th class="px-4 py-4 text-left">Ketentuan Upah</th>
                                <th class="px-4 py-4 text-center">Status</th>
                                <th class="px-4 py-4 text-center">Aksi Aman</th>
                            ` : `
                                <th class="px-4 py-4 text-left">Waktu Dinonaktifkan</th>
                                <th class="px-5 py-4 text-left">Keterangan Arsip</th>
                                <th class="px-4 py-4 text-center">Aksi Pemulihan</th>
                            `}
                        </tr>
                    </thead>
                    <tbody id="tableKaryawanBody" class="divide-y divide-slate-100">
                        ${rows || ''}
                        <tr id="emptyKaryawanRow" style="display: none;">
                            <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <i class="fas fa-search text-3xl mb-2 block text-slate-300"></i>
                                Tidak ada data karyawan yang cocok dengan pencarian.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL FORM TAMBAH KARYAWAN BARU -->
        <div id="modalTambahKaryawan" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-slate-800 relative max-h-[90vh] overflow-y-auto">
                
                <button onclick="tutupModalTambah()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">
                    <i class="fas fa-times"></i>
                </button>

                <div class="mb-6 pb-4 border-b border-slate-200">
                    <h3 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <i class="fas fa-user-plus text-teal-600"></i> Tambah Karyawan Baru
                    </h3>
                    <p class="text-sm text-slate-500 mt-1">
                        Data baru langsung disinkronkan ke mesin Dual-ESP32 & sistem penggajian
                    </p>
                </div>

                <form method="POST" action="/karyawan/create">
                    <div class="mb-5">
                        <label class="block text-base font-bold text-slate-700 mb-1.5">
                            Nama Lengkap <span class="text-rose-500">*</span>
                        </label>
                        <input type="text" name="nama" required
                                placeholder="Contoh: Budi Santoso"
                                class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base text-slate-800 focus:outline-none focus:border-teal-500">
                    </div>

                    <div class="mb-5">
                        <label class="block text-base font-bold text-slate-700 mb-2">
                            Kategori Karyawan <span class="text-rose-500">*</span>
                        </label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="border-2 border-slate-300 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-teal-500 transition-colors">
                                <input type="radio" name="kategori" value="Staff Kantor" class="w-5 h-5 text-teal-600" onchange="toggleKategoriForm(this.value)">
                                <div>
                                    <p class="font-bold text-slate-800 text-sm">Staff Kantor</p>
                                    <span class="text-xs text-slate-500">Gaji Tetap Bulanan</span>
                                </div>
                            </label>

                            <label class="border-2 border-slate-300 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-colors bg-amber-50/50">
                                <input type="radio" name="kategori" value="Pekerja Harian" checked class="w-5 h-5 text-amber-600" onchange="toggleKategoriForm(this.value)">
                                <div>
                                    <p class="font-bold text-slate-800 text-sm">Pekerja Harian</p>
                                    <span class="text-xs text-slate-500">Upah Harian + Lembur</span>
                                </div>
                            </label>
                        </div>
                    </div>

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
                        <p class="text-[11px] text-slate-500 italic">*Nominal ini dapat disesuaikan kembali sewaktu-waktu oleh staf keuangan di menu Form Transaksi.</p>
                    </div>

                    <div class="mb-5">
                        <label class="block text-base font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>UID Kartu RFID <span class="text-rose-500">*</span></span>
                            <button type="button" onclick="isiUidOtomatis()" class="text-xs text-teal-700 font-bold hover:underline cursor-pointer">
                                <i class="fas fa-wifi mr-1"></i> Simulasi Tap Kartu
                            </button>
                        </label>
                        <input type="text" name="uid_rfid" id="inputUidRfid" required
                                placeholder="Contoh: 83A192B4"
                                class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base font-mono font-bold text-slate-800 focus:outline-none focus:border-teal-500 uppercase">
                        <span class="text-xs text-slate-400 mt-1 block">Tempelkan kartu RFID baru pada mesin absensi atau ketik kode UID kartu</span>
                    </div>

                    <div class="mb-6">
                        <label class="block text-base font-bold text-slate-700 mb-1.5">
                            Nomor Kontak / WhatsApp
                        </label>
                        <input type="text" name="no_hp"
                                placeholder="Contoh: 0812-3456-7890"
                                class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base text-slate-800 focus:outline-none focus:border-teal-500">
                    </div>

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

            function filterTabelKaryawan() {
                const keyword = (document.getElementById('cariKaryawanInput')?.value || '').toLowerCase().trim();
                const kategori = (document.getElementById('filterKategoriSelect')?.value || '').toLowerCase();
                const rows = document.querySelectorAll('#tableKaryawanBody tr.row-karyawan');
                let count = 0;
                rows.forEach(tr => {
                    const searchData = tr.getAttribute('data-search') || '';
                    const matchKey = !keyword || searchData.includes(keyword);
                    const matchKat = !kategori || searchData.includes(kategori);
                    if (matchKey && matchKat) {
                        tr.style.display = '';
                        count++;
                    } else {
                        tr.style.display = 'none';
                    }
                });
                const counter = document.getElementById('counterKaryawan');
                if (counter) counter.textContent = 'Menampilkan ' + count + ' karyawan';
                const emptyRow = document.getElementById('emptyKaryawanRow');
                if (emptyRow) emptyRow.style.display = count === 0 ? '' : 'none';
            }
        </script>
    `;

    return renderLayout('Data Karyawan', 'karyawan', content, currentUser);
}

module.exports = {
    renderKaryawanView
};
