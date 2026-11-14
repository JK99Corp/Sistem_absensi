/**
 * Kartu RFID Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderKartuRfid(currentUser = null) {
    const rows = dummyData.kartu.map((k, i) => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-base text-slate-500">${i + 1}</td>
            <td class="px-6 py-4 text-base font-mono font-bold text-slate-800">${escapeHtml(k.uid)}</td>
            <td class="px-6 py-4 text-base font-semibold text-slate-800">${escapeHtml(k.pemilik)}</td>
            <td class="px-6 py-4 text-base text-slate-600">
                ${k.kategori === 'Pekerja Harian'
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>'}
            </td>
            <td class="px-6 py-4 text-base text-slate-600">${escapeHtml(k.tgl)}</td>
            <td class="px-6 py-4 text-center">
                ${k.status === 'Aktif'
            ? '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700"><i class="fas fa-circle text-[8px] mr-1.5"></i> Aktif</span>'
            : '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-600">Nonaktif</span>'}
            </td>
            <td class="px-6 py-4 text-center">
                <button class="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-1.5 px-3 rounded text-sm transition-colors cursor-pointer">
                    <i class="fas fa-edit mr-1"></i> Edit
                </button>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Kartu RFID Terdaftar</h2>
                <p class="text-base text-slate-500 mt-1">Daftar kartu RFID fisik staf kantor & pekerja harian</p>
            </div>
            <button onclick="alert('Tap kartu baru di alat ESP32 untuk mendaftarkan UID')" class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg text-base shadow inline-flex items-center cursor-pointer">
                <i class="fas fa-plus mr-2"></i> Daftarkan Kartu Baru
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase">
                            <th class="px-6 py-4 text-left">No</th>
                            <th class="px-6 py-4 text-left">UID Kartu</th>
                            <th class="px-6 py-4 text-left">Pemilik</th>
                            <th class="px-6 py-4 text-left">Kategori</th>
                            <th class="px-6 py-4 text-left">Tanggal Daftar</th>
                            <th class="px-6 py-4 text-center">Status</th>
                            <th class="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return renderLayout('Kartu RFID', 'kartu-rfid', content, currentUser);
}

module.exports = {
    renderKartuRfid
};
