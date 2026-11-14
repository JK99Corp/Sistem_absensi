/**
 * Riwayat Absensi Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderRiwayat(initKategori = '', currentUser = null) {
    const rows = dummyData.riwayat.map((r, i) => {
        const isHarian = r.kategori === 'Pekerja Harian';
        const katBadge = isHarian
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>';

        const batas = isHarian ? 'Maks. 07:30' : 'Maks. 08:30';
        const batasColor = isHarian ? 'text-amber-800 bg-amber-50 px-2 py-0.5 rounded' : 'text-blue-800 bg-blue-50 px-2 py-0.5 rounded';

        const isLembur = r.lembur.includes('Lembur');
        const lemburBadge = isLembur
            ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><i class="fas fa-clock mr-1 text-[10px]"></i> ${r.lembur}</span>`
            : '<span class="text-xs text-slate-400">Normal (0 Jam)</span>';

        return `
            <tr class="row-riwayat hover:bg-slate-50 transition-colors" data-kategori="${escapeHtml(r.kategori)}" data-tanggal="${escapeHtml(r.tanggal)}">
                <td class="px-5 py-4 text-base text-slate-500">${i + 1}</td>
                <td class="px-4 py-4 text-base text-slate-700 font-medium">${escapeHtml(r.tanggal)}</td>
                <td class="px-5 py-4 text-base text-slate-900 font-bold">${escapeHtml(r.nama)}</td>
                <td class="px-4 py-4">${katBadge}</td>
                <td class="px-4 py-4 text-xs font-mono font-bold ${batasColor}">${batas}</td>
                <td class="px-4 py-4 text-base font-semibold text-slate-800">${escapeHtml(r.masuk)}</td>
                <td class="px-4 py-4 text-base font-semibold text-slate-800">${escapeHtml(r.pulang)}</td>
                <td class="px-4 py-4">${lemburBadge}</td>
                <td class="px-4 py-4 text-sm font-mono text-slate-500">${escapeHtml(r.uid)}</td>
                <td class="px-4 py-4 text-center">
                    <img src="${escapeHtml(r.foto)}" alt="Foto" class="w-11 h-11 rounded-lg mx-auto border-2 border-slate-200 shadow-sm object-cover">
                </td>
            </tr>
        `;
    }).join('');

    const content = `
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-800">Riwayat Absensi</h2>
            <p class="text-base text-slate-500 mt-1">Daftar log absensi masuk dilengkapi bukti foto otomatis ESP32-S3 Cam</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <form id="formFilterRiwayat" class="flex flex-wrap items-end gap-4" onsubmit="event.preventDefault(); jalankanFilterRiwayat();">
                <div class="flex-1 min-w-[180px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Dari Tanggal</label>
                    <input id="filterTglDari" type="date" value="2026-08-01" onchange="jalankanFilterRiwayat()" class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700 font-medium focus:border-teal-600 focus:outline-none">
                </div>
                <div class="flex-1 min-w-[180px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Sampai Tanggal</label>
                    <input id="filterTglSampai" type="date" value="2026-08-03" onchange="jalankanFilterRiwayat()" class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700 font-medium focus:border-teal-600 focus:outline-none">
                </div>
                <div class="flex-1 min-w-[180px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Kategori Karyawan</label>
                    <select id="filterKategoriRiwayat" onchange="jalankanFilterRiwayat()" class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 font-medium bg-white focus:border-teal-600 focus:outline-none cursor-pointer hover:border-teal-400 transition-colors">
                        <option value="" ${!initKategori ? 'selected' : ''}>Semua (2 Kategori)</option>
                        <option value="Staff Kantor" ${initKategori === 'Staff Kantor' ? 'selected' : ''}>Staff Kantor</option>
                        <option value="Pekerja Harian" ${initKategori === 'Pekerja Harian' ? 'selected' : ''}>Pekerja Harian</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="jalankanFilterRiwayat()" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors shadow flex items-center gap-2 cursor-pointer">
                        <i class="fas fa-search"></i> Cari
                    </button>
                    <button type="button" onclick="resetFilterRiwayat()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-lg text-base transition-colors cursor-pointer" title="Reset">
                        <i class="fas fa-rotate-left"></i>
                    </button>
                </div>
            </form>
        </div>

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
                    <tbody id="tableRiwayatBody" class="divide-y divide-slate-100">
                        ${rows}
                        <tr id="emptyRiwayatRow" style="display: none;">
                            <td colspan="10" class="px-6 py-12 text-center text-slate-400 text-base">
                                <i class="fas fa-search text-3xl mb-2 block text-slate-300"></i>
                                Tidak ada data riwayat absensi untuk filter ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <script>
            function jalankanFilterRiwayat() {
                const selectKat = document.getElementById('filterKategoriRiwayat');
                const tglDari = document.getElementById('filterTglDari')?.value;
                const tglSampai = document.getElementById('filterTglSampai')?.value;
                if (!selectKat) return;

                const kat = selectKat.value;
                const rows = document.querySelectorAll('#tableRiwayatBody tr.row-riwayat');
                let visibleCount = 0;

                rows.forEach(tr => {
                    const rowKat = tr.getAttribute('data-kategori');
                    const rowTgl = tr.getAttribute('data-tanggal');
                    
                    const matchKat = (!kat || kat === 'Semua (2 Kategori)') ? true : (rowKat === kat);
                    let matchTgl = true;
                    if (tglDari && rowTgl && rowTgl < tglDari) matchTgl = false;
                    if (tglSampai && rowTgl && rowTgl > tglSampai) matchTgl = false;

                    if (matchKat && matchTgl) {
                        tr.style.display = '';
                        visibleCount++;
                    } else {
                        tr.style.display = 'none';
                    }
                });

                const emptyRow = document.getElementById('emptyRiwayatRow');
                if (emptyRow) emptyRow.style.display = (visibleCount === 0) ? '' : 'none';
            }

            function resetFilterRiwayat() {
                const selectKat = document.getElementById('filterKategoriRiwayat');
                if (selectKat) selectKat.value = '';
                document.getElementById('filterTglDari').value = '2026-08-01';
                document.getElementById('filterTglSampai').value = '2026-08-03';
                jalankanFilterRiwayat();
            }

            jalankanFilterRiwayat();
        </script>
    `;

    return renderLayout('Riwayat Absensi', 'riwayat', content, currentUser);
}

module.exports = {
    renderRiwayat
};
