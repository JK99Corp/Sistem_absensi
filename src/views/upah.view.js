/**
 * Upah Fallback View
 * PT. Jaya Kedhaton Enterprise System
 * Presentation template for legacy salary calculation table fallback
 */

const { escapeHtml, formatRupiahNum } = require('../utils/helpers');
const { renderLayout } = require('./layout');

function renderUpahFallbackView(list = [], filterKategori = '', currentUser = null) {
    let grandTotal = 0;
    const rows = list.map(p => {
        const isHarian = (p.kategori === 'Pekerja Harian');
        const subPokok = isHarian ? (p.hariKerja * p.pokok) : p.pokok;
        const subLembur = p.jamLembur * p.tarifLembur;
        const subTotal = subPokok + subLembur;
        grandTotal += subTotal;

        const katBadge = isHarian
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>';

        const ketPokok = isHarian ? 'Per hari kerja' : 'Gaji pokok bulanan';

        return `
            <tr class="hover:bg-slate-50 transition-colors row-pekerja" 
                data-id="${p.id}" 
                data-tipe="${p.tipe || (isHarian ? 'harian' : 'bulanan')}"
                data-kategori="${escapeHtml(p.kategori)}">
                <td class="px-5 py-4">
                    <p class="text-base font-bold text-slate-900">${escapeHtml(p.nama)}</p>
                    <span class="text-xs font-mono text-slate-400">UID: ${escapeHtml(p.uid)}</span>
                </td>
                <td class="px-4 py-4">${katBadge}</td>
                <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-sm">
                        <span class="hari-kerja">${p.hariKerja}</span>&nbsp;Hari
                    </span>
                </td>
                <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold text-sm">
                        <span class="jam-lembur">${p.jamLembur}</span>&nbsp;Jam
                    </span>
                </td>
                <td class="px-5 py-4">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-xs">Rp</span>
                        <input type="number" step="5000"
                               value="${p.pokok}"
                               class="input-pokok w-36 pl-9 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none bg-white shadow-sm"
                               oninput="hitungBaris(this)">
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5">${ketPokok}</span>
                </td>
                <td class="px-5 py-4">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-xs">Rp</span>
                        <input type="number" step="1000"
                               value="${p.tarifLembur}"
                               class="input-lembur w-32 pl-9 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none bg-white shadow-sm"
                               oninput="hitungBaris(this)">
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5">Per jam lembur</span>
                </td>
                <td class="px-5 py-4 text-right">
                    <span class="subtotal-cell text-base font-black text-slate-900">${formatRupiahNum(subTotal)}</span>
                </td>
            </tr>
        `;
    }).join('');

    const content = `
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Form Transaksi &amp; Perhitungan Gaji</h2>
            <p class="text-sm text-slate-500 mt-1">Perhitungan otomatis upah harian, lembur, dan slip gaji pekerja PT. Jaya Kedhaton</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-800 text-white text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-5 py-3.5">Pekerja</th>
                            <th class="px-4 py-3.5">Kategori</th>
                            <th class="px-4 py-3.5 text-center">Hari Kerja</th>
                            <th class="px-4 py-3.5 text-center">Jam Lembur</th>
                            <th class="px-5 py-3.5">Tarif Pokok</th>
                            <th class="px-5 py-3.5">Tarif Lembur</th>
                            <th class="px-5 py-3.5 text-right">Subtotal Upah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">${rows}</tbody>
                </table>
            </div>
        </div>
    `;

    return renderLayout('Form Transaksi', 'upah', content, currentUser);
}

module.exports = {
    renderUpahFallbackView
};
