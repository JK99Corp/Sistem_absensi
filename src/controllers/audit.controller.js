/**
 * Audit & Security Log Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderAccessDenied(currentUser) {
    const content = `
        <div class="max-w-2xl mx-auto my-12 bg-white rounded-2xl shadow-xl border border-rose-200 p-8 md:p-12 text-center">
            <div class="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                <i class="fas fa-shield-halved"></i>
            </div>
            
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 mb-4 uppercase tracking-wider">
                <i class="fas fa-lock mr-1.5"></i> Restriksi Keamanan Pimpinan
            </span>
            
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">Akses Ditolak (403 Forbidden)</h2>
            
            <p class="text-base text-slate-600 leading-relaxed mb-6">
                Halaman <strong>Log Aktivitas & Audit Keamanan</strong> ini bersifat rahasia dan <strong>HANYA DAPAT DIAKSES OLEH 2 AKUN PIMPINAN</strong> (Super Admin & Admin Utama).
            </p>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-6 text-sm text-slate-700 space-y-1.5">
                <p><strong>Akun Anda:</strong> ${currentUser.nama} (<span class="font-mono">@${currentUser.username}</span>)</p>
                <p><strong>Jabatan / Hak Akses:</strong> ${currentUser.roleLabel}</p>
                <p class="text-xs text-rose-600 font-semibold pt-2">
                    <i class="fas fa-exclamation-triangle mr-1"></i> Perhatian: Upaya akses tidak sah ke log pengawasan ini telah otomatis dicatat ke dalam audit keamanan sistem dan dilaporkan kepada pimpinan.
                </p>
            </div>

            <div class="flex items-center justify-center gap-3">
                <a href="/dashboard" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg text-base shadow transition-colors inline-flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Kembali ke Dashboard
                </a>
                <a href="/login" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-lg text-base transition-colors">
                    Ganti Akun
                </a>
            </div>
        </div>
    `;
    return renderLayout('Akses Ditolak', '', content, currentUser);
}

function renderAuditLog(currentUser, filterAksi = '', filterUser = '') {
    let logs = dummyData.auditLogs || [];
    if (filterAksi) {
        logs = logs.filter(l => l.aksi === filterAksi);
    }
    if (filterUser) {
        logs = logs.filter(l => l.username.toLowerCase().includes(filterUser.toLowerCase()) || l.nama.toLowerCase().includes(filterUser.toLowerCase()));
    }

    const rows = logs.map(l => {
        let badgeAksi = '';
        if (l.aksi === 'LOGIN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800"><i class="fas fa-sign-in-alt mr-1 text-[10px]"></i> LOGIN</span>';
        else if (l.aksi === 'LOGOUT') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700"><i class="fas fa-sign-out-alt mr-1 text-[10px]"></i> LOGOUT</span>';
        else if (l.aksi === 'TAMBAH_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><i class="fas fa-user-plus mr-1 text-[10px]"></i> TAMBAH KARYAWAN</span>';
        else if (l.aksi === 'ARSIP_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><i class="fas fa-archive mr-1 text-[10px]"></i> ARSIP KARYAWAN</span>';
        else if (l.aksi === 'PULIHKAN_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800"><i class="fas fa-rotate-left mr-1 text-[10px]"></i> PULIHKAN DATA</span>';
        else if (l.aksi === 'AKSES_DITOLAK') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-pulse"><i class="fas fa-ban mr-1 text-[10px]"></i> AKSES DITOLAK</span>';
        else if (l.aksi === 'LOGIN_GAGAL') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800"><i class="fas fa-times-circle mr-1 text-[10px]"></i> LOGIN GAGAL</span>';
        else badgeAksi = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">${l.aksi}</span>`;

        const isIncident = l.aksi === 'AKSES_DITOLAK' || l.aksi === 'LOGIN_GAGAL';
        const rowBg = isIncident ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50';

        return `
            <tr class="${rowBg} transition-colors">
                <td class="px-5 py-4 text-xs font-mono font-medium text-slate-500 whitespace-nowrap">${escapeHtml(l.waktu)}</td>
                <td class="px-5 py-4">
                    <p class="text-sm font-bold text-slate-900">${escapeHtml(l.nama)}</p>
                    <span class="text-xs font-mono text-slate-400">@${escapeHtml(l.username)}</span>
                </td>
                <td class="px-4 py-4 text-xs text-slate-600 font-semibold">${escapeHtml(l.role)}</td>
                <td class="px-4 py-4">${badgeAksi}</td>
                <td class="px-5 py-4 text-sm text-slate-800 font-medium">${escapeHtml(l.keterangan)}</td>
                <td class="px-4 py-4 text-xs font-mono text-slate-500">${escapeHtml(l.ip)}</td>
            </tr>
        `;
    }).join('');

    const totalAksi = dummyData.auditLogs ? dummyData.auditLogs.length : 0;
    const totalDitolak = dummyData.auditLogs ? dummyData.auditLogs.filter(l => l.aksi === 'AKSES_DITOLAK' || l.aksi === 'LOGIN_GAGAL').length : 0;
    const totalMutasi = dummyData.auditLogs ? dummyData.auditLogs.filter(l => l.aksi.includes('KARYAWAN')).length : 0;

    const content = `
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <h2 class="text-2xl font-bold text-slate-800">Log Aktivitas & Audit Keamanan</h2>
                    <span class="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <i class="fas fa-lock"></i> Hak Akses Pimpinan
                    </span>
                </div>
                <p class="text-base text-slate-500">
                    Rekam jejak seluruh login, modifikasi data, dan aksi staf Jaya Kedhaton (Hanya dapat diakses oleh 2 Akun Admin Utama/Pimpinan)
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg text-sm shadow transition-colors inline-flex items-center gap-2 cursor-pointer">
                    <i class="fas fa-print"></i> Cetak Laporan Audit
                </button>
            </div>
        </div>

        <!-- Kartu Ringkasan Audit -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-teal-500">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Log Tercatat</p>
                <p class="text-3xl font-extrabold text-slate-800 mt-1">${totalAksi}</p>
                <p class="text-xs text-slate-400 mt-1">Audit Trail Real-Time</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Akun Pengawas Resmi</p>
                <p class="text-3xl font-extrabold text-blue-700 mt-1">2 Akun</p>
                <p class="text-xs text-slate-400 mt-1">@superadmin & @admin.utama</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Modifikasi Karyawan</p>
                <p class="text-3xl font-extrabold text-amber-700 mt-1">${totalMutasi}</p>
                <p class="text-xs text-slate-400 mt-1">Tambah, Arsip, & Pulihkan</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-rose-500">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Percobaan Ilegal Diblokir</p>
                <p class="text-3xl font-extrabold text-rose-700 mt-1">${totalDitolak}</p>
                <p class="text-xs text-slate-400 mt-1">Otomatis Ditangkal Sistem</p>
            </div>
        </div>

        <!-- Filter Log Form -->
        <div class="bg-white rounded-xl shadow-sm p-5 mb-6 border border-slate-200">
            <form action="/audit-log" method="GET" class="flex flex-wrap items-end gap-4">
                <div class="flex-1 min-w-[200px]">
                    <label class="block text-xs font-bold text-slate-700 mb-1">Filter Jenis Aksi</label>
                    <select name="aksi" onchange="this.form.submit()" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 bg-white">
                        <option value="" ${!filterAksi ? 'selected' : ''}>Semua Aksi (${totalAksi})</option>
                        <option value="LOGIN" ${filterAksi === 'LOGIN' ? 'selected' : ''}>Login Pengguna</option>
                        <option value="TAMBAH_KARYAWAN" ${filterAksi === 'TAMBAH_KARYAWAN' ? 'selected' : ''}>Tambah Karyawan Baru</option>
                        <option value="ARSIP_KARYAWAN" ${filterAksi === 'ARSIP_KARYAWAN' ? 'selected' : ''}>Pindah ke Arsip</option>
                        <option value="PULIHKAN_KARYAWAN" ${filterAksi === 'PULIHKAN_KARYAWAN' ? 'selected' : ''}>Pemulihan dari Arsip</option>
                        <option value="AKSES_DITOLAK" ${filterAksi === 'AKSES_DITOLAK' ? 'selected' : ''}>Akses Ditolak (Pelanggaran)</option>
                    </select>
                </div>
                <div class="flex-1 min-w-[200px]">
                    <label class="block text-xs font-bold text-slate-700 mb-1">Filter Pengguna / Staf</label>
                    <input type="text" name="user" value="${filterUser || ''}" placeholder="Cari nama atau username..." class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800">
                </div>
                <div class="flex items-center gap-2">
                    <button type="submit" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg text-sm shadow">
                        <i class="fas fa-filter mr-1"></i> Saring Log
                    </button>
                    <a href="/audit-log" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg text-sm">
                        <i class="fas fa-rotate-left"></i>
                    </a>
                </div>
            </form>
        </div>

        <!-- Tabel Log Aktivitas -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
                    <i class="fas fa-list-check text-teal-600"></i> Rekam Jejak Aktivitas Terperinci
                </h3>
                <span class="text-xs text-slate-500 font-mono">Tersimpan Permanen & Terenkripsi</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                            <th class="px-5 py-4 text-left">Waktu Transaksi</th>
                            <th class="px-5 py-4 text-left">Nama Petugas</th>
                            <th class="px-4 py-4 text-left">Jabatan</th>
                            <th class="px-4 py-4 text-left">Aksi</th>
                            <th class="px-5 py-4 text-left">Keterangan / Rincian Aktivitas</th>
                            <th class="px-4 py-4 text-left">Alamat IP</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows || '<tr><td colspan="6" class="px-6 py-12 text-center text-slate-400">Tidak ada log aktivitas untuk kriteria ini.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return renderLayout('Log Aktivitas (Audit)', 'audit-log', content, currentUser);
}

module.exports = {
    renderAccessDenied,
    renderAuditLog
};
