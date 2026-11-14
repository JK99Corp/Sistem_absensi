/**
 * Device Controller (IoT Dual-ESP32 RFID + Cam)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { renderLayout } = require('../views/layout');

function renderDevice(currentUser = null) {
    const rows = dummyData.devices.map((d, i) => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-base text-slate-500">${i + 1}</td>
            <td class="px-6 py-4 text-base font-bold text-slate-800">
                <span class="bg-slate-100 px-3 py-1 rounded font-mono">${d.kode}</span>
            </td>
            <td class="px-6 py-4 text-base text-slate-700">${d.lokasi}</td>
            <td class="px-6 py-4 text-base text-slate-600">
                <span class="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                    <i class="fas fa-camera mr-1.5 text-xs"></i> ${d.tipe}
                </span>
            </td>
            <td class="px-6 py-4 text-sm font-mono text-slate-600">${d.ip}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${d.aktif}</td>
            <td class="px-6 py-4 text-center">
                ${d.status === 'Online'
            ? '<span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700"><span class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Online</span>'
            : '<span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600"><span class="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> Offline</span>'}
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="alert('Live Stream Kamera ESP32-S3 (OV5640) aktif di IP: ${d.ip}:81/stream')"
                            class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-3 rounded text-sm transition-colors inline-flex items-center cursor-pointer">
                        <i class="fas fa-video mr-1"></i> Live Cam
                    </button>
                    <button onclick="alert('Pengaturan parameter ESP32 Master & UART')"
                            class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded text-sm transition-colors cursor-pointer">
                        <i class="fas fa-cog mr-1"></i> Setting
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Device Absensi</h2>
                <p class="text-base text-slate-500 mt-1">Kelola perangkat keras alat absensi Dual-ESP32 (RFID + Kamera)</p>
            </div>
            <button onclick="alert('Tambah device baru')" class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg text-base shadow inline-flex items-center cursor-pointer">
                <i class="fas fa-plus mr-2"></i> Tambah Device
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500">
                <p class="text-sm font-medium text-slate-500 uppercase">Total Device</p>
                <p class="text-3xl font-bold text-slate-800 mt-1">2 Unit</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <p class="text-sm font-medium text-slate-500 uppercase">Device Online</p>
                <p class="text-3xl font-bold text-green-700 mt-1">1 Unit</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-slate-400">
                <p class="text-sm font-medium text-slate-500 uppercase">Device Offline</p>
                <p class="text-3xl font-bold text-slate-600 mt-1">1 Unit</p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase">
                            <th class="px-6 py-4 text-left">No</th>
                            <th class="px-6 py-4 text-left">Kode Device</th>
                            <th class="px-6 py-4 text-left">Lokasi</th>
                            <th class="px-6 py-4 text-left">Tipe Hardware</th>
                            <th class="px-6 py-4 text-left">IP Address</th>
                            <th class="px-6 py-4 text-left">Terakhir Aktif</th>
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

    return renderLayout('Device Absensi', 'device', content, currentUser);
}

module.exports = {
    renderDevice
};
