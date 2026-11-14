/**
 * Dashboard Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderDashboard(initKategori = '', initDevice = '', currentUser = null) {
    const tableRows = dummyData.absensiHariIni.map(row => {
        const isHarian = row.kategori === 'Pekerja Harian';
        const katBadge = isHarian
            ? '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800"><i class="fas fa-hammer mr-1 text-[10px]"></i> Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800"><i class="fas fa-briefcase mr-1 text-[10px]"></i> Staff Kantor</span>';

        const batasBadge = isHarian
            ? '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">Maks. 07:30</span>'
            : '<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">Maks. 08:30</span>';

        const isTerlambat = row.statusMasuk.includes('Terlambat');
        const statusBadge = isTerlambat
            ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700"><i class="fas fa-exclamation-triangle mr-1 text-[10px]"></i> ${row.statusMasuk}</span>`
            : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><i class="fas fa-check-circle mr-1 text-[10px]"></i> ${row.statusMasuk}</span>`;

        const isLembur = row.lembur.includes('Lembur');
        const lemburBadge = isLembur
            ? `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 shadow-sm"><i class="fas fa-clock mr-1 text-[10px]"></i> ${row.lembur}</span>`
            : '<span class="text-xs text-slate-400 font-medium">Normal (0 Jam)</span>';

        return `
            <tr class="row-absensi hover:bg-slate-50 transition-colors" data-kategori="${escapeHtml(row.kategori)}" data-device="${escapeHtml(row.device)}">
                <td class="px-5 py-4 font-bold text-slate-900 text-base">${escapeHtml(row.nama)}</td>
                <td class="px-4 py-4">${katBadge}</td>
                <td class="px-4 py-4">${batasBadge}</td>
                <td class="px-4 py-4 text-base font-semibold text-slate-800">${escapeHtml(row.jamMasuk)}</td>
                <td class="px-4 py-4 text-base font-semibold text-slate-800">${escapeHtml(row.jamPulang)}</td>
                <td class="px-4 py-4">${statusBadge}</td>
                <td class="px-4 py-4">${lemburBadge}</td>
                <td class="px-4 py-4 text-sm font-mono text-slate-500">${escapeHtml(row.uid)}</td>
                <td class="px-4 py-4 text-sm text-slate-600">${escapeHtml(row.device)}</td>
            </tr>
        `;
    }).join('');

    const content = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p class="text-base text-slate-500 mt-0.5">Ringkasan absensi masuk & pulang karyawan Jaya Kedhaton</p>
        </div>

        <!-- Ketentuan Jam Kerja (Rapi & Simpel) -->
        <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span class="text-slate-600">Pekerja Harian: <strong class="text-slate-800">Masuk maks. 07:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span class="text-slate-600">Staff Kantor: <strong class="text-slate-800">Masuk maks. 08:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span class="text-slate-600">Pulang Normal: <strong class="text-slate-800">17:00 – 17:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span class="text-slate-600">Lembur: <strong class="text-slate-800">Tap pulang > 17:30</strong> (Staff & Harian)</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500">
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Hadir pada filter ini</p>
                <p class="text-5xl font-extrabold text-slate-800 mt-2" id="countHadirDisplay">${dummyData.absensiHariIni.length}</p>
                <p class="text-xs text-slate-400 mt-2" id="countHadirSubtext">2 Staff Kantor + 3 Pekerja Harian</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Karyawan aktif</p>
                <p class="text-5xl font-extrabold text-slate-800 mt-2">${dummyData.karyawanAktif.length}</p>
                <p class="text-xs text-slate-400 mt-2">Terbagi dalam 2 Kategori Kerja</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">Device aktif</p>
                <p class="text-5xl font-extrabold text-slate-800 mt-2">${dummyData.deviceAktif}</p>
                <p class="text-xs text-slate-400 mt-2">KANTORJK_01 (Online Standalone)</p>
            </div>
        </div>

        <!-- Form Filter Kategori & Device Aktif Berfungsi Penuh -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <form id="formFilterDashboard" class="flex flex-wrap items-end gap-4" onsubmit="event.preventDefault(); jalankanFilterDashboard();">
                <div class="flex-1 min-w-[200px]">
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Tanggal</label>
                    <input type="text" value="03 - Aug - 2026" readonly
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-700 bg-slate-50 font-medium">
                </div>

                <div class="flex-1 min-w-[200px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Kategori Karyawan</label>
                    <select id="filterKategori" onchange="jalankanFilterDashboard()"
                            class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 bg-white font-medium focus:border-teal-600 focus:outline-none cursor-pointer hover:border-teal-400 transition-colors">
                        <option value="" ${!initKategori ? 'selected' : ''}>Semua (2 Kategori)</option>
                        <option value="Staff Kantor" ${initKategori === 'Staff Kantor' ? 'selected' : ''}>Staff Kantor</option>
                        <option value="Pekerja Harian" ${initKategori === 'Pekerja Harian' ? 'selected' : ''}>Pekerja Harian</option>
                    </select>
                </div>

                <div class="flex-1 min-w-[200px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Device Absensi</label>
                    <select id="filterDevice" onchange="jalankanFilterDashboard()"
                            class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 bg-white font-medium focus:border-teal-600 focus:outline-none cursor-pointer hover:border-teal-400 transition-colors">
                        <option value="" ${!initDevice ? 'selected' : ''}>Semua Device</option>
                        <option value="KANTORJK_01" ${initDevice === 'KANTORJK_01' ? 'selected' : ''}>KANTORJK_01</option>
                        <option value="KANTORJK_02" ${initDevice === 'KANTORJK_02' ? 'selected' : ''}>KANTORJK_02</option>
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" onclick="jalankanFilterDashboard()"
                            class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-base transition-colors shadow flex items-center gap-2 cursor-pointer">
                        <i class="fas fa-filter"></i> Filter
                    </button>
                    <button type="button" onclick="resetFilterDashboard()"
                            class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-lg text-base transition-colors cursor-pointer" title="Reset Filter">
                        <i class="fas fa-rotate-left"></i>
                    </button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <h3 class="text-base font-bold text-slate-800">Data Absensi Masuk & Pulang Hari Ini</h3>
                <span class="text-xs text-slate-500">Pekerja Harian maks. <strong>07:30</strong> | Staff Kantor maks. <strong>08:30</strong> | Lembur: tap pulang &gt; 17:30</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                            <th class="px-5 py-4 text-left">NAMA KARYAWAN</th>
                            <th class="px-4 py-4 text-left">KATEGORI</th>
                            <th class="px-4 py-4 text-left">BATAS MASUK</th>
                            <th class="px-4 py-4 text-left">JAM MASUK</th>
                            <th class="px-4 py-4 text-left">JAM PULANG</th>
                            <th class="px-4 py-4 text-left">STATUS MASUK</th>
                            <th class="px-4 py-4 text-left">STATUS LEMBUR</th>
                            <th class="px-4 py-4 text-left">UID</th>
                            <th class="px-4 py-4 text-left">DEVICE</th>
                        </tr>
                    </thead>
                    <tbody id="tableAbsensiBody" class="divide-y divide-slate-100">
                        ${tableRows}
                        <tr id="emptyAbsensiRow" style="display: none;">
                            <td colspan="9" class="px-6 py-12 text-center text-slate-400 text-base">
                                <i class="fas fa-search text-3xl mb-2 block text-slate-300"></i>
                                Tidak ada data absensi untuk filter ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <script>
            function jalankanFilterDashboard() {
                const selectKat = document.getElementById('filterKategori');
                const selectDev = document.getElementById('filterDevice');
                if (!selectKat) return;

                const kat = selectKat.value;
                const dev = selectDev ? selectDev.value : '';
                const rows = document.querySelectorAll('#tableAbsensiBody tr.row-absensi');
                let visibleCount = 0;
                let harianCount = 0;
                let staffCount = 0;

                rows.forEach(tr => {
                    const rowKat = tr.getAttribute('data-kategori');
                    const rowDev = tr.getAttribute('data-device');
                    
                    const matchKat = (!kat || kat === 'Semua (2 Kategori)') ? true : (rowKat === kat);
                    const matchDev = (!dev || dev === 'Semua Device') ? true : (rowDev === dev);

                    if (matchKat && matchDev) {
                        tr.style.display = '';
                        visibleCount++;
                        if (rowKat === 'Pekerja Harian') harianCount++;
                        if (rowKat === 'Staff Kantor') staffCount++;
                    } else {
                        tr.style.display = 'none';
                    }
                });

                const displayEl = document.getElementById('countHadirDisplay');
                if (displayEl) displayEl.textContent = visibleCount;

                const subtextEl = document.getElementById('countHadirSubtext');
                if (subtextEl) {
                    if (!kat || kat === 'Semua (2 Kategori)') {
                        subtextEl.textContent = staffCount + ' Staff Kantor + ' + harianCount + ' Pekerja Harian';
                    } else if (kat === 'Pekerja Harian') {
                        subtextEl.textContent = harianCount + ' Pekerja Harian';
                    } else {
                        subtextEl.textContent = staffCount + ' Staff Kantor';
                    }
                }

                const emptyRow = document.getElementById('emptyAbsensiRow');
                if (emptyRow) emptyRow.style.display = (visibleCount === 0) ? '' : 'none';
            }

            function resetFilterDashboard() {
                const selectKat = document.getElementById('filterKategori');
                const selectDev = document.getElementById('filterDevice');
                if (selectKat) selectKat.value = '';
                if (selectDev) selectDev.value = '';
                jalankanFilterDashboard();
            }

            // Jalankan filter saat render
            jalankanFilterDashboard();
        </script>
    `;

    return renderLayout('Dashboard', 'dashboard', content, currentUser);
}

module.exports = {
    renderDashboard
};
