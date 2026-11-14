/**
 * Rekap Kehadiran Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderRekap(currentUser = null) {
    const rows = dummyData.rekap.map(r => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-base font-bold text-slate-800">${escapeHtml(r.nama)}</td>
            <td class="px-6 py-4 text-base text-slate-600">
                ${r.kategori === 'Pekerja Harian'
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.senin === 'Hadir'
            ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>'
            : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.selasa === 'Hadir' ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>' : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.rabu === 'Hadir' ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>' : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.kamis === 'Hadir' ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>' : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.jumat === 'Hadir' ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>' : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.sabtu === 'Hadir' ? '<span class="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm">Hadir</span>' : '<span class="text-slate-400 font-bold">-</span>'}
            </td>
            <td class="px-5 py-4 text-center bg-teal-50">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-base shadow-sm">
                    ${r.total}
                </span>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-800">Rekap Mingguan</h2>
            <p class="text-base text-slate-500 mt-1">Laporan rekap kehadiran 2 kategori karyawan per minggu (Sesuai format Excel)</p>
        </div>

        <div class="bg-teal-50 border border-teal-200 rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
            <p class="text-base text-teal-900 font-medium">
                <i class="fas fa-calendar-alt mr-2 text-teal-600"></i>
                Periode: <span class="font-bold text-teal-950">${dummyData.periode}</span>
            </p>
            <button onclick="alert('File Excel rekap-mingguan-20260803.xlsx siap didownload!')"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors shadow inline-flex items-center gap-2 cursor-pointer">
                <i class="fas fa-file-excel"></i> Download Excel
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase">
                            <th class="px-6 py-4 text-left">Nama</th>
                            <th class="px-6 py-4 text-left">Kategori</th>
                            <th class="px-4 py-4 text-center">Senin</th>
                            <th class="px-4 py-4 text-center">Selasa</th>
                            <th class="px-4 py-4 text-center">Rabu</th>
                            <th class="px-4 py-4 text-center">Kamis</th>
                            <th class="px-4 py-4 text-center">Jumat</th>
                            <th class="px-4 py-4 text-center">Sabtu</th>
                            <th class="px-5 py-4 text-center bg-slate-800">Total Hadir</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return renderLayout('Rekap Mingguan', 'rekap', content, currentUser);
}

module.exports = {
    renderRekap
};
