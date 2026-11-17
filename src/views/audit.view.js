/**
 * Audit Log View
 * PT. Jaya Kedhaton Enterprise System
 * Presentation template for security audit logs and access restriction page
 */

const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('./layout');

function renderAccessDeniedView(currentUser) {
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
                <p><strong>Akun Anda:</strong> ${escapeHtml(currentUser.nama)} (<span class="font-mono">@${escapeHtml(currentUser.username)}</span>)</p>
                <p><strong>Jabatan / Hak Akses:</strong> ${escapeHtml(currentUser.roleLabel)}</p>
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

function renderAuditLogView(logs = [], currentUser = null, filterAksi = '', filterUser = '') {
    const rows = logs.map(l => {
        let badgeAksi = '';
        if (l.aksi === 'LOGIN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800"><i class="fas fa-sign-in-alt mr-1 text-[10px]"></i> LOGIN</span>';
        else if (l.aksi === 'LOGOUT') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700"><i class="fas fa-sign-out-alt mr-1 text-[10px]"></i> LOGOUT</span>';
        else if (l.aksi === 'TAMBAH_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><i class="fas fa-user-plus mr-1 text-[10px]"></i> TAMBAH KARYAWAN</span>';
        else if (l.aksi === 'ARSIP_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><i class="fas fa-archive mr-1 text-[10px]"></i> ARSIP KARYAWAN</span>';
        else if (l.aksi === 'PULIHKAN_KARYAWAN') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800"><i class="fas fa-rotate-left mr-1 text-[10px]"></i> PULIHKAN DATA</span>';
        else if (l.aksi === 'AKSES_DITOLAK') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-pulse"><i class="fas fa-ban mr-1 text-[10px]"></i> AKSES DITOLAK</span>';
        else if (l.aksi === 'LOGIN_GAGAL') badgeAksi = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800"><i class="fas fa-times-circle mr-1 text-[10px]"></i> LOGIN GAGAL</span>';
        else badgeAksi = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">${escapeHtml(l.aksi)}</span>`;

        const isIncident = l.aksi === 'AKSES_DITOLAK' || l.aksi === 'LOGIN_GAGAL';
        const rowBg = isIncident ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50';

        return `
            <tr class="${rowBg} transition-colors">
                <td class="px-5 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">${escapeHtml(l.waktu)}</td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <p class="text-sm font-bold text-slate-800">${escapeHtml(l.nama)}</p>
                    <span class="text-xs font-mono text-slate-400">@${escapeHtml(l.username)}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">${badgeAksi}</td>
                <td class="px-5 py-4 text-sm text-slate-700">${escapeHtml(l.detail)}</td>
                <td class="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">${escapeHtml(l.ip || '-')}</td>
            </tr>
        `;
    }).join('');

    const content = `
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <h2 class="text-2xl font-bold text-slate-800">Log Aktivitas &amp; Pengawasan Keamanan</h2>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <i class="fas fa-lock mr-1"></i> Khusus Pimpinan
                    </span>
                </div>
                <p class="text-sm text-slate-500 mt-1">Rekam jejak forensik seluruh operasi login, mutasi karyawan, pemulihan arsip, dan percobaan akses</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <i class="fas fa-shield-check mr-1.5 text-emerald-600"></i> Audit Logger Aktif (Anti-Tamper)
                </span>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-200">
            <form method="GET" action="/audit-log" class="flex flex-wrap items-center gap-3">
                <div class="flex-1 min-w-[200px]">
                    <input type="text" name="user" value="${escapeHtml(filterUser)}" placeholder="Cari nama atau username..."
                           class="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500">
                </div>
                <div class="w-48">
                    <select name="aksi" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 bg-white">
                        <option value="">Semua Aksi</option>
                        <option value="LOGIN" ${filterAksi === 'LOGIN' ? 'selected' : ''}>LOGIN</option>
                        <option value="LOGOUT" ${filterAksi === 'LOGOUT' ? 'selected' : ''}>LOGOUT</option>
                        <option value="TAMBAH_KARYAWAN" ${filterAksi === 'TAMBAH_KARYAWAN' ? 'selected' : ''}>TAMBAH KARYAWAN</option>
                        <option value="ARSIP_KARYAWAN" ${filterAksi === 'ARSIP_KARYAWAN' ? 'selected' : ''}>ARSIP KARYAWAN</option>
                        <option value="PULIHKAN_KARYAWAN" ${filterAksi === 'PULIHKAN_KARYAWAN' ? 'selected' : ''}>PULIHKAN DATA</option>
                        <option value="AKSES_DITOLAK" ${filterAksi === 'AKSES_DITOLAK' ? 'selected' : ''}>AKSES DITOLAK</option>
                        <option value="LOGIN_GAGAL" ${filterAksi === 'LOGIN_GAGAL' ? 'selected' : ''}>LOGIN GAGAL</option>
                    </select>
                </div>
                <button type="submit" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors shadow">
                    <i class="fas fa-filter mr-1"></i> Filter
                </button>
                <a href="/audit-log" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                    Reset
                </a>
            </form>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-slate-200">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-800 text-white text-xs uppercase tracking-wider">
                        <tr>
                            <th class="px-5 py-3.5">Waktu (WIB)</th>
                            <th class="px-4 py-3.5">Pengguna</th>
                            <th class="px-4 py-3.5">Aksi</th>
                            <th class="px-5 py-3.5">Rincian Aktivitas</th>
                            <th class="px-4 py-3.5">Alamat IP</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">${rows || '<tr><td colspan="5" class="p-8 text-center text-slate-400">Belum ada riwayat aktivitas.</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;

    return renderLayout('Log Aktivitas (Audit)', 'audit-log', content, currentUser);
}

module.exports = {
    renderAccessDeniedView,
    renderAuditLogView
};
