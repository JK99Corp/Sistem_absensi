/**
 * KantorJK Attendance System Prototype - Local Presentation Server
 * 
 * Server lokal ringan tanpa perlu install PHP / Composer / NPM tambahan.
 * Dijalankan langsung dengan: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const DB_FILE = path.join(__dirname, 'database', 'storage.json');

// Data default template (apabila database/storage.json belum ada)
let defaultTemplateData = {
    hadirHariIni: 5,
    karyawanAktif: 6,
    deviceAktif: 1,
    tanggalHariIni: 'Senin, 03 Agustus 2026',
    periode: '03/08/2026 - 08/08/2026',

    // Absensi hari ini dengan 2 Kategori & Status Lembur
    absensiHariIni: [
        { jamMasuk: '07:15:20', jamPulang: '19:35:10', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Lembur 2 Jam' },
        { jamMasuk: '07:22:14', jamPulang: '18:32:00', nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Lembur 1 Jam' },
        { jamMasuk: '08:22:45', jamPulang: '17:15:30', nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Normal (0 Jam)' },
        { jamMasuk: '08:42:10', jamPulang: '17:25:00', nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', device: 'KANTORJK_01', statusMasuk: 'Terlambat 12 Mnt', lembur: 'Normal (0 Jam)' },
        { jamMasuk: '07:45:00', jamPulang: '19:30:15', nama: 'Bambang Triyono', kategori: 'Pekerja Harian', uid: '19E873A2', device: 'KANTORJK_01', statusMasuk: 'Terlambat 15 Mnt', lembur: 'Lembur 2 Jam' }
    ],

    riwayat: [
        { tanggal: '2026-08-03', masuk: '07:15:20', pulang: '19:35:10', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', lembur: 'Lembur 2 Jam', foto: 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '07:22:14', pulang: '18:32:00', nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', device: 'KANTORJK_01', lembur: 'Lembur 1 Jam', foto: 'https://ui-avatars.com/api/?name=Slamet+Riyadi&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '08:22:45', pulang: '17:15:30', nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Dimas+Arya&background=0d9488&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '08:42:10', pulang: '17:25:00', nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Akmal+Zaidan&background=2563eb&color=fff&size=96' },
        { tanggal: '2026-08-02', masuk: '07:20:00', pulang: '19:30:00', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', lembur: 'Lembur 2 Jam', foto: 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-02', masuk: '08:28:50', pulang: '17:10:00', nama: 'Anom Arya', kategori: 'Staff Kantor', uid: 'A3B7C901', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Anom+Arya&background=64748b&color=fff&size=96' }
    ],

    rekap: [
        { nama: 'Akmal Zaidan', kategori: 'Staff Kantor', senin: 'Hadir', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 1 },
        { nama: 'Anom Arya', kategori: 'Staff Kantor', senin: '-', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 0 },
        { nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', senin: 'Hadir', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 1 },
        { nama: 'Joko Susilo', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: 'Hadir', total: 6 },
        { nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: '-', total: 5 },
        { nama: 'Bambang Triyono', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: 'Hadir', total: 6 }
    ],

    // Upah & Lembur untuk seluruh karyawan (Staff Kantor & Pekerja Harian)
    karyawanUpah: [
        { id: 1, nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', tipe: 'bulanan', uid: '53492607', hariKerja: 6, jamLembur: 4, pokok: 3500000, tarifLembur: 30000 },
        { id: 2, nama: 'Akmal Zaidan', kategori: 'Staff Kantor', tipe: 'bulanan', uid: '9491F306', hariKerja: 5, jamLembur: 3, pokok: 3200000, tarifLembur: 30000 },
        { id: 3, nama: 'Anom Arya', kategori: 'Staff Kantor', tipe: 'bulanan', uid: 'A3B7C901', hariKerja: 5, jamLembur: 2, pokok: 3000000, tarifLembur: 30000 },
        { id: 4, nama: 'Joko Susilo', kategori: 'Pekerja Harian', tipe: 'harian', uid: '83A192B4', hariKerja: 6, jamLembur: 8, pokok: 120000, tarifLembur: 25000 },
        { id: 5, nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', tipe: 'harian', uid: '47C201F8', hariKerja: 5, jamLembur: 5, pokok: 120000, tarifLembur: 25000 },
        { id: 6, nama: 'Bambang Triyono', kategori: 'Pekerja Harian', tipe: 'harian', uid: '19E873A2', hariKerja: 6, jamLembur: 4, pokok: 110000, tarifLembur: 25000 }
    ],
    pekerjaHarian: [
        { id: 4, nama: 'Joko Susilo', uid: '83A192B4', hariKerja: 6, jamLembur: 8, upahHarian: 120000, tarifLembur: 25000 },
        { id: 5, nama: 'Slamet Riyadi', uid: '47C201F8', hariKerja: 5, jamLembur: 5, upahHarian: 120000, tarifLembur: 25000 },
        { id: 6, nama: 'Bambang Triyono', uid: '19E873A2', hariKerja: 6, jamLembur: 4, upahHarian: 110000, tarifLembur: 25000 }
    ],

    // Karyawan Aktif
    karyawanAktif: [
        { id: 1, nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', noHp: '0812-3456-7890', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '01/01/2026' },
        { id: 2, nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', noHp: '0812-9876-5432', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '15/01/2026' },
        { id: 3, nama: 'Anom Arya', kategori: 'Staff Kantor', uid: 'A3B7C901', noHp: '0813-1122-3344', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '01/02/2026' },
        { id: 4, nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', noHp: '0857-1234-5678', status: 'Aktif', upahHarian: 120000, tarifLembur: 25000, tglGabung: '01/07/2026' },
        { id: 5, nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', noHp: '0858-8765-4321', status: 'Aktif', upahHarian: 120000, tarifLembur: 25000, tglGabung: '05/07/2026' },
        { id: 6, nama: 'Bambang Triyono', kategori: 'Pekerja Harian', uid: '19E873A2', noHp: '0878-9988-7766', status: 'Aktif', upahHarian: 110000, tarifLembur: 25000, tglGabung: '10/07/2026' }
    ],

    // Karyawan Arsip
    karyawanArsip: [
        { id: 7, nama: 'Sugeng Raharjo', kategori: 'Pekerja Harian', uid: 'B1287FE0', noHp: '0856-3344-5566', status: 'Diarsipkan', upahHarian: 110000, tarifLembur: 25000, tglGabung: '01/06/2026', deletedAt: '2026-07-28 16:00', keterangan: 'Selesai Proyek Harian Juli. Riwayat gaji & absensi tetap tersimpan rapi.' }
    ],

    kartu: [
        { id: 1, uid: '53492607', pemilik: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', tgl: '2026-07-15 10:30', status: 'Aktif' },
        { id: 2, uid: '9491F306', pemilik: 'Akmal Zaidan', kategori: 'Staff Kantor', tgl: '2026-07-15 10:35', status: 'Aktif' },
        { id: 3, uid: 'A3B7C901', pemilik: 'Anom Arya', kategori: 'Staff Kantor', tgl: '2026-07-16 09:00', status: 'Aktif' },
        { id: 4, uid: '83A192B4', pemilik: 'Joko Susilo', kategori: 'Pekerja Harian', tgl: '2026-07-22 08:00', status: 'Aktif' },
        { id: 5, uid: '47C201F8', pemilik: 'Slamet Riyadi', kategori: 'Pekerja Harian', tgl: '2026-07-22 08:15', status: 'Aktif' },
        { id: 6, uid: '19E873A2', pemilik: 'Bambang Triyono', kategori: 'Pekerja Harian', tgl: '2026-07-25 09:00', status: 'Aktif' }
    ],

    devices: [
        { id: 1, kode: 'KANTORJK_01', lokasi: 'Pintu Masuk Utama', tipe: 'Dual ESP32 (RFID + Cam)', ip: '192.168.1.100', aktif: '2026-08-03 19:35:10', status: 'Online' },
        { id: 2, kode: 'KANTORJK_02', lokasi: 'Pintu Belakang', tipe: 'Dual ESP32 (RFID Only)', ip: '192.168.1.101', aktif: '2026-07-30 17:00:00', status: 'Offline' }
    ],

    // Log Aktivitas Audit Keamanan (Hanya bisa dilihat oleh 2 Akun Pimpinan)
    auditLogs: [
        { id: 1001, waktu: '2026-08-03 07:10:00', username: 'superadmin', nama: 'Direktur Utama', role: 'Super Admin (Direksi)', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem melalui Portal Keamanan', ip: '192.168.1.10' },
        { id: 1002, waktu: '2026-08-03 07:15:20', username: 'KANTORJK_01', nama: 'Perangkat Pintu Utama', role: 'Perangkat IoT', aksi: 'TAP_ABSENSI', keterangan: 'Absensi masuk Joko Susilo (07:15:20) - Tepat Waktu', ip: '192.168.1.100' },
        { id: 1003, waktu: '2026-08-03 08:00:45', username: 'staf.keuangan', nama: 'Siti Aminah', role: 'Staf Keuangan', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem', ip: '192.168.1.25' },
        { id: 1004, waktu: '2026-08-03 08:30:10', username: 'staf.keuangan', nama: 'Siti Aminah', role: 'Staf Keuangan', aksi: 'CETAK_REKAP', keterangan: 'Mencetak laporan rekapitulasi upah mingguan', ip: '192.168.1.25' },
        { id: 1005, waktu: '2026-08-03 09:15:00', username: 'staf.hrd', nama: 'Rendra Bagus', role: 'Staf HRD & Personalia', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem', ip: '192.168.1.28' },
        { id: 1006, waktu: '2026-08-03 09:20:30', username: 'staf.hrd', nama: 'Rendra Bagus', role: 'Staf HRD & Personalia', aksi: 'AKSES_DITOLAK', keterangan: 'Percobaan akses tidak sah ke Log Audit Pimpinan (Otomatis ditolak sistem)', ip: '192.168.1.28' }
    ]
};

let dummyData = JSON.parse(JSON.stringify(defaultTemplateData));

function saveToDisk() {
    try {
        const tmpFile = DB_FILE + '.tmp';
        fs.writeFileSync(tmpFile, JSON.stringify(dummyData, null, 2), 'utf-8');
        fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
        console.error('Gagal menulis ke storage.json:', e.message);
    }
}

function generateNextId() {
    let maxId = 0;
    const all = [
        ...(dummyData.karyawanAktif || []),
        ...(dummyData.karyawanArsip || []),
        ...(dummyData.kartu || []),
        ...(dummyData.karyawanUpah || [])
    ];
    for (const item of all) {
        if (typeof item.id === 'number' && item.id > maxId) {
            maxId = item.id;
        }
    }
    return maxId + 1;
}

function loadFromDisk() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf-8');
            dummyData = JSON.parse(raw);
            console.log('💾 [DATABASE PERSISTENCE] Data lokal dimuat dari database/storage.json');
        } else {
            saveToDisk();
            console.log('💾 [DATABASE PERSISTENCE] Database storage.json baru berhasil diinisialisasi.');
        }
    } catch (e) {
        console.error('Gagal membaca storage.json:', e.message);
    }
}

loadFromDisk();


// 4 Akun Resmi: Tepat 2 Akun Pimpinan (Super Admin) yang diizinkan melihat Audit Log, dan 2 Staf Operasional
const REGISTERED_USERS = [
    { username: 'superadmin', nama: 'Direktur Utama', role: 'superadmin', roleLabel: 'Super Admin (Direksi)', pass: 'kedhaton2026!' },
    { username: 'admin.utama', nama: 'Admin Utama', role: 'superadmin', roleLabel: 'Super Admin (Auditor Internal)', pass: 'adminutama123' },
    { username: 'staf.keuangan', nama: 'Siti Aminah', role: 'keuangan', roleLabel: 'Staf Keuangan', pass: 'keuangan123' },
    { username: 'staf.hrd', nama: 'Rendra Bagus', role: 'hrd', roleLabel: 'Staf HRD & Personalia', pass: 'hrd123' }
];

function getCurrentUser(req) {
    try {
        const cookies = req.headers.cookie || '';
        const match = cookies.match(/auth_user=([^;]+)/);
        if (!match) return null;
        const username = decodeURIComponent(match[1]).trim();
        return REGISTERED_USERS.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    } catch (err) {
        return null;
    }
}

function addAuditLog(username, aksi, keterangan, ip = '127.0.0.1') {
    const user = REGISTERED_USERS.find(u => u.username === username) || { nama: username, roleLabel: 'Pengguna' };
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const waktu = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (!dummyData.auditLogs) dummyData.auditLogs = [];
    const newLog = {
        id: Date.now(),
        waktu,
        username,
        nama: user.nama,
        role: user.roleLabel,
        aksi,
        keterangan,
        ip: (ip || '127.0.0.1').replace('::ffff:', '')
    };
    dummyData.auditLogs.unshift(newLog);
    if (dummyData.auditLogs.length > 500) dummyData.auditLogs.pop();
    saveToDisk();
}

function formatRupiahNum(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderLayout(title, activeMenu, content, currentUser = null) {
    const user = currentUser || { username: 'guest', nama: 'Tamu', role: 'guest', roleLabel: 'Tamu' };
    const isSuperAdmin = (user.username === 'superadmin' || user.username === 'admin.utama');

    const menus = [
        { id: 'dashboard', href: '/dashboard', icon: 'fa-chart-bar', label: 'Dashboard' },
        { id: 'riwayat', href: '/riwayat', icon: 'fa-clipboard-list', label: 'Riwayat Absensi' },
        { id: 'rekap', href: '/rekap', icon: 'fa-calendar-week', label: 'Rekap Mingguan' },
        { id: 'upah', href: '/upah', icon: 'fa-money-bill-wave', label: 'Upah & Lembur' },
        { id: 'karyawan', href: '/karyawan', icon: 'fa-users', label: 'Karyawan' },
        { id: 'kartu-rfid', href: '/kartu-rfid', icon: 'fa-id-card-clip', label: 'Kartu RFID' },
        { id: 'device', href: '/device', icon: 'fa-desktop', label: 'Device' }
    ];

    // HANYA 2 AKUN SUPER ADMIN YANG BISA MELIHAT MENU LOG AKTIVITAS (AUDIT)
    if (isSuperAdmin) {
        menus.push({
            id: 'audit-log',
            href: '/audit-log',
            icon: 'fa-shield-halved',
            label: 'Log Aktivitas (Audit)',
            badge: 'Admin'
        });
    }

    const menuHtml = menus.map(m => {
        const isActive = activeMenu === m.id;
        const cls = isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white';
        const badge = m.badge ? `<span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-auto tracking-wider">${m.badge}</span>` : '';
        return `
            <a href="${m.href}" class="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors duration-200 ${cls}">
                <i class="fas ${m.icon} w-6 text-center text-lg"></i>
                <span>${m.label}</span>
                ${badge}
            </a>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - ${title}</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">

    <!-- SIDEBAR -->
    <aside class="fixed top-0 left-0 w-64 h-full bg-slate-800 text-white flex flex-col z-50 shadow-xl">
        <div class="px-5 py-5 border-b border-slate-700 flex items-center gap-3">
            <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" 
                 class="w-12 h-12 object-contain shrink-0">
            <div class="overflow-hidden">
                <h1 class="text-base font-bold tracking-wide text-white leading-tight truncate">Jaya Kedhaton</h1>
                <p class="text-xs text-slate-400 mt-0.5 truncate">Sistem Absensi Digital</p>
            </div>
        </div>

        <nav class="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            ${menuHtml}
        </nav>

        <div class="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
            &copy; 2026 Sistem Absensi Jaya Kedhaton — Dual-ESP32
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="ml-64 min-h-screen flex flex-col">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
            <div class="flex items-center gap-3 text-sm text-slate-600">
                <div class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    ${user.nama.charAt(0)}
                </div>
                <div>
                    <div class="font-bold text-slate-800 leading-tight">${user.nama}</div>
                    <div class="text-xs text-slate-500">${user.roleLabel} &bull; <span class="font-mono text-slate-400">@${user.username}</span></div>
                </div>
                ${isSuperAdmin
            ? '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200"><i class="fas fa-lock-open mr-1"></i> Izin Audit Penuh</span>'
            : '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200"><i class="fas fa-lock mr-1"></i> Staf Operasional</span>'}
            </div>
            <div class="flex items-center gap-3">
                <a href="javascript:location.reload()"
                   class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sync-alt"></i> Refresh
                </a>
                <a href="/logout"
                   class="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-8">
            ${content}
        </main>
    </div>

</body>
</html>`;
}

function renderLogin(errorMsg = '') {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - Login Portal</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }</style>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200">
            <div class="text-center mb-6">
                <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" 
                     class="w-20 h-20 mx-auto object-contain mb-3 drop-shadow-sm">
                <h1 class="text-2xl font-extrabold text-slate-800">PT Jaya Kedhaton</h1>
                <p class="text-slate-500 text-sm mt-0.5">Portal Masuk Sistem Presensi & Penggajian</p>
            </div>

            ${errorMsg ? `
                <div class="bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl p-3.5 mb-5 flex items-center gap-2">
                    <i class="fas fa-circle-exclamation text-rose-600 text-lg"></i>
                    <span>${errorMsg}</span>
                </div>
            ` : ''}

            <form action="/login" method="POST">
                <div class="mb-4">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Username Akun</label>
                    <input type="text" name="username" id="inputUsername" required value="superadmin"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 font-medium focus:outline-none focus:border-teal-500">
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" id="inputPassword" required value="kedhaton2026!"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 font-medium focus:outline-none focus:border-teal-500">
                </div>

                <button type="submit"
                        class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-lg text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer">
                    <i class="fas fa-sign-in-alt"></i> Masuk ke Sistem
                </button>
            </form>

            <!-- Akun Cepat untuk Uji Coba Presentasi -->
            <div class="mt-6 pt-5 border-t border-slate-200">
                <p class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2.5 flex items-center justify-between">
                    <span>Pilihan Akun Uji Coba:</span>
                    <span class="text-[11px] text-teal-700 font-semibold">(Klik untuk Isi Otomatis)</span>
                </p>

                <div class="space-y-2 text-xs">
                    <div class="p-2.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('superadmin', 'kedhaton2026!')">
                        <div>
                            <span class="font-bold text-teal-950">👑 1. Direktur Utama (Super Admin 1)</span>
                            <p class="text-[11px] text-teal-800 mt-0.5">Akses penuh ke seluruh sistem & Log Audit</p>
                        </div>
                        <span class="font-mono text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded text-[10px]">superadmin</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('admin.utama', 'adminutama123')">
                        <div>
                            <span class="font-bold text-blue-950">🛡️ 2. Admin Utama (Super Admin 2 - Auditor)</span>
                            <p class="text-[11px] text-blue-800 mt-0.5">Akses pengawasan penuh & Log Audit</p>
                        </div>
                        <span class="font-mono text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded text-[10px]">admin.utama</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('staf.keuangan', 'keuangan123')">
                        <div>
                            <span class="font-bold text-slate-800">💼 3. Siti Aminah (Staf Keuangan)</span>
                            <p class="text-[11px] text-slate-500 mt-0.5">Operasional upah & absensi (Log Audit Terkunci)</p>
                        </div>
                        <span class="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px]">staf.keuangan</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('staf.hrd', 'hrd123')">
                        <div>
                            <span class="font-bold text-slate-800">📋 4. Rendra Bagus (Staf HRD)</span>
                            <p class="text-[11px] text-slate-500 mt-0.5">Operasional karyawan & kartu (Log Audit Terkunci)</p>
                        </div>
                        <span class="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px]">staf.hrd</span>
                    </div>
                </div>
            </div>
        </div>

        <p class="text-center text-slate-500 text-xs mt-5">
            &copy; 2026 PT Jaya Kedhaton &bull; Hak Cipta Dilindungi
        </p>
    </div>

    <script>
        function pilihAkun(u, p) {
            document.getElementById('inputUsername').value = u;
            document.getElementById('inputPassword').value = p;
        }
    </script>
</body>
</html>`;
}


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

function renderUpah(filterKategori = '', currentUser = null) {
    let list = dummyData.karyawanUpah;
    if (filterKategori) {
        list = list.filter(k => k.kategori === filterKategori);
    }

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
                        <input type="number" step="5000"
                               value="${p.tarifLembur}"
                               class="input-tarif-lembur w-32 pl-9 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none bg-white shadow-sm"
                               oninput="hitungBaris(this)">
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5">Per jam</span>
                </td>

                <td class="px-5 py-4 text-right">
                    <span class="text-sm font-bold text-amber-700 total-lembur-display">
                        ${formatRupiahNum(subLembur)}
                    </span>
                </td>

                <td class="px-5 py-4 text-right bg-slate-50">
                    <span class="text-base font-extrabold text-teal-800 total-gaji-display">
                        ${formatRupiahNum(subTotal)}
                    </span>
                </td>

                <td class="px-4 py-4 text-center">
                    <button type="button"
                            data-nama="${escapeHtml(p.nama)}"
                            data-uid="${escapeHtml(p.uid)}"
                            data-kategori="${escapeHtml(p.kategori)}"
                            onclick="bukaSlip(this)"
                            class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer">
                        <i class="fas fa-file-invoice"></i> Slip
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const totalJamLemburSemua = list.reduce((a, b) => a + b.jamLembur, 0);

    const content = `
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Upah & Lembur Karyawan</h2>
                <p class="text-base text-slate-500 mt-0.5">
                    Perhitungan gaji pokok dan upah lembur otomatis untuk Staff Kantor & Pekerja Harian
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span class="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm">
                    <i class="fas fa-calendar-alt mr-1.5 text-slate-400"></i> Periode: ${dummyData.periode}
                </span>
                <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg text-sm shadow transition-colors inline-flex items-center gap-2 cursor-pointer">
                    <i class="fas fa-print"></i> Cetak Rekap
                </button>
            </div>
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Karyawan</p>
                <p class="text-3xl font-extrabold text-slate-800 mt-1">${list.length} Orang</p>
                <p class="text-xs text-slate-400 mt-1">Staff Kantor & Pekerja Harian</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Jam Lembur Terakumulasi</p>
                <p class="text-3xl font-extrabold text-amber-600 mt-1">
                    ${totalJamLemburSemua} Jam
                </p>
                <p class="text-xs text-slate-400 mt-1">Otomatis dari jam tap pulang > 17:30</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Estimasi Pembayaran</p>
                <p class="text-3xl font-extrabold text-teal-700 mt-1" id="grandTotalDisplay">
                    ${formatRupiahNum(grandTotal)}
                </p>
                <p class="text-xs text-slate-400 mt-1">Gaji/Upah Pokok + Total Lembur</p>
            </div>
        </div>

        <!-- Filter Tab Kategori -->
        <div class="flex items-center gap-2 mb-4">
            <a href="/upah" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!filterKategori ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                Semua (${dummyData.karyawanUpah.length})
            </a>
            <a href="/upah?kategori=Staff+Kantor" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterKategori === 'Staff Kantor' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                <i class="fas fa-briefcase mr-1 text-xs"></i> Staff Kantor
            </a>
            <a href="/upah?kategori=Pekerja+Harian" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterKategori === 'Pekerja Harian' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                <i class="fas fa-hammer mr-1 text-xs"></i> Pekerja Harian
            </a>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 class="text-base font-bold text-slate-800">Daftar Upah Pokok & Lembur</h3>
                    <p class="text-xs text-slate-500">Nominal upah pokok dan tarif lembur dapat disesuaikan langsung oleh staf keuangan</p>
                </div>
                <span class="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full font-medium">
                    <i class="fas fa-calculator text-teal-600 mr-1"></i> Perhitungan Otomatis
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full" id="tabelUpah">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                            <th class="px-5 py-4 text-left">Nama Karyawan</th>
                            <th class="px-4 py-4 text-left">Kategori</th>
                            <th class="px-4 py-4 text-center">Kehadiran</th>
                            <th class="px-4 py-4 text-center">Jam Lembur</th>
                            <th class="px-5 py-4 text-left">Gaji / Upah Pokok</th>
                            <th class="px-5 py-4 text-left">Tarif Lembur / Jam</th>
                            <th class="px-5 py-4 text-right">Total Lembur</th>
                            <th class="px-5 py-4 text-right bg-slate-800">Total Diterima</th>
                            <th class="px-4 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL SLIP GAJI & LEMBUR -->
        <div id="modalSlip" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-800 relative">
                <button onclick="tutupSlip()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">
                    <i class="fas fa-times"></i>
                </button>

                <div class="text-center pb-4 border-b border-dashed border-slate-200">
                    <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" class="w-16 h-16 mx-auto object-contain mb-2">
                    <h4 class="text-xl font-bold text-slate-900 leading-tight">JAYA KEDHATON</h4>
                    <p class="text-xs text-slate-500 uppercase tracking-wide mt-0.5">SLIP PEMBAYARAN GAJI & LEMBUR</p>
                    <p class="text-xs text-slate-400 font-mono mt-1">Periode: ${dummyData.periode}</p>
                </div>

                <div class="py-4 space-y-2 text-sm border-b border-dashed border-slate-200">
                    <div class="flex justify-between">
                        <span class="text-slate-500">Nama Karyawan:</span>
                        <span class="font-bold text-slate-800" id="slipNama">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Kategori:</span>
                        <span class="font-semibold text-slate-700" id="slipKategori">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">UID Kartu:</span>
                        <span class="font-mono text-slate-600" id="slipUid">-</span>
                    </div>
                </div>

                <div class="py-4 space-y-2.5 text-sm border-b border-dashed border-slate-200">
                    <div class="flex justify-between font-semibold">
                        <span class="text-slate-700" id="slipLabelPokok">Gaji / Upah Pokok:</span>
                        <span class="text-slate-900" id="slipSubtotalPokok">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500 pl-2">
                        <span id="slipRincianPokok">-</span>
                    </div>
                    <div class="flex justify-between font-semibold pt-1">
                        <span class="text-slate-700">Upah Lembur:</span>
                        <span class="text-amber-700" id="slipSubtotalLembur">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500 pl-2">
                        <span id="slipRincianLembur">-</span>
                    </div>
                </div>

                <div class="pt-4 pb-4">
                    <div class="flex justify-between items-center bg-teal-50 p-3.5 rounded-xl border border-teal-200">
                        <div>
                            <p class="text-xs text-teal-700 font-bold uppercase tracking-wider">Total Diterima</p>
                            <p class="text-2xl font-extrabold text-teal-900" id="slipTotalGaji">Rp 0</p>
                        </div>
                        <i class="fas fa-hand-holding-dollar text-3xl text-teal-600"></i>
                    </div>
                </div>

                <div class="flex gap-3 pt-2">
                    <button type="button" onclick="window.print()" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow transition-colors cursor-pointer">
                        <i class="fas fa-print mr-1.5"></i> Cetak Slip Ini
                    </button>
                    <button type="button" onclick="tutupSlip()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>

        <script>
            function formatRupiah(angka) {
                return 'Rp ' + Number(angka).toLocaleString('id-ID');
            }

            function hitungBaris(el) {
                const row = el.closest('tr');
                const tipe = row.dataset.tipe;
                const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                const totalLembur = jamLembur * tarifLembur;
                const totalPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                const totalGaji = totalPokok + totalLembur;

                row.querySelector('.total-lembur-display').innerText = formatRupiah(totalLembur);
                row.querySelector('.total-gaji-display').innerText = formatRupiah(totalGaji);

                hitungGrandTotal();
            }

            function hitungGrandTotal() {
                let totalSemua = 0;
                document.querySelectorAll('#tabelUpah .row-pekerja').forEach(row => {
                    const tipe = row.dataset.tipe;
                    const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                    const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                    const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                    const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                    const totalPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                    const totalLembur = jamLembur * tarifLembur;
                    totalSemua += (totalPokok + totalLembur);
                });
                document.getElementById('grandTotalDisplay').innerText = formatRupiah(totalSemua);
            }

            function bukaSlip(btn) {
                const nama = btn.dataset.nama;
                const uid = btn.dataset.uid;
                const kategori = btn.dataset.kategori;
                const row = btn.closest('tr');
                const tipe = row.dataset.tipe;
                const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                const subPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                const subLembur = jamLembur * tarifLembur;
                const totalGaji = subPokok + subLembur;

                document.getElementById('slipNama').innerText = nama;
                document.getElementById('slipKategori').innerText = kategori;
                document.getElementById('slipUid').innerText = uid;

                if (tipe === 'harian') {
                    document.getElementById('slipLabelPokok').innerText = 'Upah Pokok Harian:';
                    document.getElementById('slipRincianPokok').innerText = hariKerja + ' Hari × ' + formatRupiah(pokokInput);
                } else {
                    document.getElementById('slipLabelPokok').innerText = 'Gaji Pokok Bulanan:';
                    document.getElementById('slipRincianPokok').innerText = 'Gaji Pokok Tetap (' + hariKerja + ' Hari Masuk)';
                }

                document.getElementById('slipSubtotalPokok').innerText = formatRupiah(subPokok);
                document.getElementById('slipRincianLembur').innerText = jamLembur + ' Jam × ' + formatRupiah(tarifLembur) + ' / jam';
                document.getElementById('slipSubtotalLembur').innerText = formatRupiah(subLembur);
                document.getElementById('slipTotalGaji').innerText = formatRupiah(totalGaji);

                document.getElementById('modalSlip').classList.remove('hidden');
            }

            function tutupSlip() {
                document.getElementById('modalSlip').classList.add('hidden');
            }
        </script>
    `;

    return renderLayout('Upah & Lembur', 'upah', content, currentUser);
}

function renderKaryawan(tab = 'aktif', notifMsg = '', currentUser = null, notifType = 'success') {
    const isTabArsip = tab === 'arsip';
    const list = isTabArsip ? dummyData.karyawanArsip : dummyData.karyawanAktif;

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

        if (!isTabArsip) {
            const upahKet = isHarian
                ? `<p class="font-bold text-slate-800">Rp ${Number(p.upahHarian || 120000).toLocaleString('id-ID')} / hari</p><span class="text-xs text-amber-700 font-semibold">+ Lembur Rp ${Number(p.tarifLembur || 25000).toLocaleString('id-ID')}/jam</span>`
                : '<span class="text-slate-500 font-medium">Gaji Bulanan Tetap</span>';

            return `
                <tr class="hover:bg-slate-50 transition-colors">
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
                            <form method="POST" action="/karyawan/delete" onsubmit="return confirm('PERINGATAN AMAN:\n\nKaryawan ini akan dipindahkan ke Arsip.\n\nApakah Anda yakin? Seluruh data laporan keuangan dan jam lembur masa lalu TETAP AMAN dan TIDAK AKAN HILANG.')">
                                <input type="hidden" name="id" value="${p.id}">
                                <button type="submit" class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                                    <i class="fas fa-archive"></i> Arsipkan
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr class="hover:bg-slate-50 transition-colors">
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
                    ${dummyData.karyawanAktif.length}
                </span>
            </a>

            <a href="/karyawan?tab=arsip"
               class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-bold transition-colors
                      ${isTabArsip ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
                <i class="fas fa-archive"></i>
                <span>Arsip</span>
                <span class="ml-1 text-xs px-2 py-0.5 rounded-full ${isTabArsip ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'}">
                    ${dummyData.karyawanArsip.length}
                </span>
            </a>
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
                    <tbody class="divide-y divide-slate-100">
                        ${rows || '<tr><td colspan="8" class="px-6 py-12 text-center text-slate-400">Belum ada data.</td></tr>'}
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
                        <p class="text-[11px] text-slate-500 italic">*Nominal ini dapat disesuaikan kembali sewaktu-waktu oleh staf keuangan di menu Upah & Lembur.</p>
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
        </script>
    `;

    return renderLayout('Data Karyawan', 'karyawan', content, currentUser);
}

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

// Router
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost:8000');
    const pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    // Handle Static Images (Logo)
    if (pathname === '/images/logo.png' || pathname === '/images/logo.jpg' || pathname === '/logo.png' || pathname === '/logo.jpg') {
        const logoPath = path.join(__dirname, 'public', 'images', 'logo.png');
        if (fs.existsSync(logoPath)) {
            res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache, no-store, must-revalidate' });
            res.end(fs.readFileSync(logoPath));
            return;
        }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const currentUser = getCurrentUser(req);
    const clientIp = (req.socket && req.socket.remoteAddress) ? req.socket.remoteAddress : '127.0.0.1';

    // Handle Login (POST)
    if (req.method === 'POST' && pathname === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const u = (params.get('username') || '').trim();
            const p = params.get('password') || '';

            const userFound = REGISTERED_USERS.find(usr =>
                usr.username.toLowerCase() === u.toLowerCase() && usr.pass === p
            );
            if (userFound) {
                addAuditLog(userFound.username, 'LOGIN', 'Berhasil login ke sistem melalui Portal Keamanan', clientIp);
                res.writeHead(302, {
                    'Set-Cookie': `auth_user=${encodeURIComponent(userFound.username)}; Path=/; HttpOnly`,
                    'Location': '/dashboard'
                });
                res.end();
            } else {
                addAuditLog(u || 'UNKNOWN', 'LOGIN_GAGAL', 'Percobaan login gagal dengan kata sandi salah', clientIp);
                res.writeHead(302, {
                    'Location': '/login?error=invalid'
                });
                res.end();
            }
        });
        return;
    }

    // Handle Login (GET)
    if (pathname === '/login') {
        let errMsg = '';
        if (query.error === 'invalid') errMsg = 'Username atau kata sandi tidak cocok. Silakan coba lagi.';
        res.writeHead(200);
        res.end(renderLogin(errMsg));
        return;
    }

    // Handle Logout (GET)
    if (pathname === '/logout') {
        if (currentUser) {
            addAuditLog(currentUser.username, 'LOGOUT', 'Keluar dari sistem', clientIp);
        }
        res.writeHead(302, {
            'Set-Cookie': 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax',
            'Location': '/login'
        });
        res.end();
        return;
    }

    // AUTH GUARD: Akses ke seluruh halaman dan API lain WAJIB login terlebih dahulu
    if (!currentUser) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }

    // Handle Form Tambah Karyawan (POST)
    if (req.method === 'POST' && (pathname === '/karyawan' || pathname === '/karyawan/create')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const rawNama = (params.get('nama') || '').trim();
            const nama = rawNama || 'Karyawan Baru';
            const kategori = params.get('kategori') || 'Pekerja Harian';
            const uid = (params.get('uid_rfid') || params.get('rfid_uid') || '').trim().toUpperCase();
            const noHp = (params.get('no_hp') || '-').trim();

            // Validasi UID Wajib Diisi (Tidak Boleh Kosong atau Spasi Saja)
            if (!uid) {
                res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=err_uid_kosong' });
                res.end();
                return;
            }

            // Validasi Tabrakan UID RFID Duplikat
            const uidExists = dummyData.karyawanAktif.some(k => k.uid.toUpperCase() === uid);
            if (uidExists) {
                res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=err_uid_duplikat' });
                res.end();
                return;
            }

            // Validasi Nilai Finansial (Upah & Tarif Lembur Tidak Boleh Negatif)
            const rawUpah = parseInt(params.get('upah_harian'));
            const upahHarian = isNaN(rawUpah) ? 120000 : Math.max(0, rawUpah);
            const rawLembur = parseInt(params.get('tarif_lembur'));
            const tarifLembur = isNaN(rawLembur) ? 25000 : Math.max(0, rawLembur);

            const newId = generateNextId();
            const newKaryawan = {
                id: newId,
                nama,
                kategori,
                uid,
                noHp,
                status: 'Aktif',
                upahHarian,
                tarifLembur,
                tglGabung: new Date().toLocaleDateString('id-ID')
            };

            dummyData.karyawanAktif.push(newKaryawan);

            // Tambahkan juga ke daftar kartu RFID
            dummyData.kartu.push({
                id: newId,
                uid,
                pemilik: nama,
                kategori,
                tgl: new Date().toISOString().slice(0, 10),
                status: 'Aktif'
            });

            // Tambahkan ke daftar upah & lembur
            dummyData.karyawanUpah.push({
                id: newId,
                nama,
                kategori,
                tipe: kategori === 'Pekerja Harian' ? 'harian' : 'bulanan',
                uid,
                hariKerja: 0,
                jamLembur: 0,
                pokok: kategori === 'Pekerja Harian' ? upahHarian : 3200000,
                tarifLembur: tarifLembur
            });

            // Jika Pekerja Harian, tambahkan ke perhitungan upah harian
            if (kategori === 'Pekerja Harian') {
                dummyData.pekerjaHarian.push({
                    id: newId,
                    nama,
                    uid,
                    hariKerja: 0,
                    jamLembur: 0,
                    upahHarian,
                    tarifLembur
                });
            }

            // Simpan ke disk (JSON Storage) untuk persistence 100% aman
            saveToDisk();

            // Catat ke Audit Log Keamanan
            addAuditLog(currentUser.username, 'TAMBAH_KARYAWAN', `Menambahkan karyawan baru: ${nama} (${kategori}, UID: ${uid})`, clientIp);

            res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=sukses_tambah' });
            res.end();
        });
        return;
    }

    // Handle Soft Delete (POST)
    if (req.method === 'POST' && (pathname === '/karyawan/delete' || /^\/karyawan\/\d+$/.test(pathname))) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new URLSearchParams(body);
            let id = parseInt(params.get('id') || query.id);
            if (isNaN(id)) {
                const match = pathname.match(/^\/karyawan\/(\d+)$/);
                if (match) id = parseInt(match[1]);
            }

            if (!id) {
                res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=err_not_found' });
                res.end();
                return;
            }

            const idx = dummyData.karyawanAktif.findIndex(k => k.id === id);
            if (idx === -1) {
                res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=err_not_found' });
                res.end();
                return;
            }

            const removed = dummyData.karyawanAktif.splice(idx, 1)[0];
            dummyData.karyawanArsip.push({
                ...removed,
                status: 'Diarsipkan',
                deletedAt: new Date().toLocaleString('id-ID'),
                keterangan: 'Diarsipkan oleh admin. Data keuangan & riwayat absensi tetap aman 100%.'
            });

            // Sinkronisasi otomatis ke status Kartu RFID
            const card = dummyData.kartu.find(c => c.uid === removed.uid);
            if (card) {
                card.status = 'Nonaktif (Arsip)';
            }

            saveToDisk();

            // Catat ke Audit Log Keamanan
            addAuditLog(currentUser.username, 'ARSIP_KARYAWAN', `Memindahkan karyawan ${removed.nama} (ID: ${id}) ke Arsip`, clientIp);

            res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=sukses_hapus' });
            res.end();
        });
        return;
    }

    // Handle Restore Soft Delete (POST)
    if (req.method === 'POST' && (pathname === '/karyawan/restore' || /^\/karyawan\/\d+\/restore$/.test(pathname))) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new URLSearchParams(body);
            let id = parseInt(params.get('id') || query.id);
            if (isNaN(id)) {
                const match = pathname.match(/^\/karyawan\/(\d+)\/restore$/);
                if (match) id = parseInt(match[1]);
            }

            if (!id) {
                res.writeHead(302, { 'Location': '/karyawan?tab=arsip&msg=err_not_found' });
                res.end();
                return;
            }

            const idx = dummyData.karyawanArsip.findIndex(k => k.id === id);
            if (idx === -1) {
                res.writeHead(302, { 'Location': '/karyawan?tab=arsip&msg=err_not_found' });
                res.end();
                return;
            }

            const target = dummyData.karyawanArsip[idx];

            // Validasi Tabrakan UID saat Restore (Cek apakah UID sudah dipakai oleh karyawan aktif lain)
            const uidConflict = dummyData.karyawanAktif.some(k => k.uid.toUpperCase() === target.uid.toUpperCase());
            if (uidConflict) {
                res.writeHead(302, { 'Location': '/karyawan?tab=arsip&msg=err_restore_conflict' });
                res.end();
                return;
            }

            const restored = dummyData.karyawanArsip.splice(idx, 1)[0];
            dummyData.karyawanAktif.push({
                ...restored,
                status: 'Aktif'
            });

            // Sinkronisasi otomatis aktifkan kembali Kartu RFID
            const card = dummyData.kartu.find(c => c.uid === restored.uid);
            if (card) {
                card.status = 'Aktif';
            }

            saveToDisk();

            // Catat ke Audit Log Keamanan
            addAuditLog(currentUser.username, 'PULIHKAN_KARYAWAN', `Memulihkan karyawan ${restored.nama} (ID: ${id}) dari Arsip ke status Aktif`, clientIp);

            res.writeHead(302, { 'Location': '/karyawan?tab=aktif&msg=sukses_restore' });
            res.end();
        });
        return;
    }

    // Handle Normal GET Routes
    if (pathname === '/' || pathname === '/dashboard') {
        res.writeHead(200);
        res.end(renderDashboard(query.kategori || '', query.device || '', currentUser));
    } else if (pathname === '/audit-log' || pathname === '/log-aktivitas') {
        // HANYA 2 AKUN SUPER ADMIN YANG DIBERI AKSES KE AUDIT LOG
        const isSuperAdmin = (currentUser.username === 'superadmin' || currentUser.username === 'admin.utama');
        if (isSuperAdmin) {
            res.writeHead(200);
            res.end(renderAuditLog(currentUser, query.aksi || '', query.user || ''));
        } else {
            // Catat pelanggaran akses oleh staf biasa
            addAuditLog(currentUser.username, 'AKSES_DITOLAK', 'Mencoba mengakses halaman Log Audit Pimpinan tanpa izin', clientIp);
            res.writeHead(403);
            res.end(renderAccessDenied(currentUser));
        }
    } else if (pathname === '/riwayat') {
        res.writeHead(200);
        res.end(renderRiwayat(query.kategori || '', currentUser));
    } else if (pathname === '/rekap') {
        res.writeHead(200);
        res.end(renderRekap(currentUser));
    } else if (pathname === '/upah') {
        res.writeHead(200);
        res.end(renderUpah(query.kategori || '', currentUser));
    } else if (pathname === '/karyawan') {
        let notif = '';
        let notifType = 'success';
        if (query.msg === 'sukses_tambah') notif = 'Karyawan baru berhasil ditambahkan dan langsung terhubung dengan alat Dual-ESP32!';
        if (query.msg === 'sukses_hapus') notif = 'Karyawan berhasil dipindahkan ke Arsip. Seluruh data laporan keuangan masa lalu tetap aman!';
        if (query.msg === 'sukses_restore') notif = 'Karyawan berhasil dipulihkan dari Arsip ke daftar aktif!';
        if (query.msg === 'err_uid_duplikat') {
            notif = 'Gagal menambahkan karyawan: UID Kartu RFID tersebut sudah digunakan oleh karyawan aktif lain!';
            notifType = 'error';
        }
        if (query.msg === 'err_uid_kosong') {
            notif = 'Gagal menambahkan karyawan: UID Kartu RFID fisik wajib diisi dan tidak boleh kosong!';
            notifType = 'error';
        }
        if (query.msg === 'err_restore_conflict') {
            notif = 'Gagal memulihkan karyawan: UID Kartu RFID dari data arsip ini sudah digunakan oleh karyawan aktif lain!';
            notifType = 'error';
        }
        if (query.msg === 'err_not_found') {
            notif = 'Operasi dibatalkan: Data karyawan tidak ditemukan atau ID tidak valid.';
            notifType = 'warning';
        }

        res.writeHead(200);
        res.end(renderKaryawan(query.tab || 'aktif', notif, currentUser, notifType));
    } else if (pathname === '/kartu-rfid') {
        res.writeHead(200);
        res.end(renderKartuRfid(currentUser));
    } else if (pathname === '/device') {
        res.writeHead(200);
        res.end(renderDevice(currentUser));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderLayout('404 Tidak Ditemukan', '', `
            <div class="text-center py-16 bg-white rounded-xl shadow-sm p-8 max-w-xl mx-auto my-8 border border-slate-200">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-400 text-4xl mb-4">
                    <i class="fas fa-compass"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 mb-2">404 - Halaman Tidak Ditemukan</h2>
                <p class="text-slate-500 mb-6">Halaman atau endpoint yang Anda tuju (${escapeHtml(pathname)}) tidak terdaftar di sistem Sistem Absensi Jaya Kedhaton.</p>
                <a href="/dashboard" class="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow">
                    <i class="fas fa-home"></i> Kembali ke Dashboard
                </a>
            </div>
        `, currentUser));
    }
});

let currentPort = PORT;

function startListen(p) {
    server.listen(p, () => {
        console.log(`\n======================================================`);
        console.log(`✨ Prototype Sistem Absensi Jaya Kedhaton Berjalan!`);
        console.log(`🌐 Buka di browser: http://localhost:${p}`);
        console.log(`======================================================\n`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${currentPort} sedang digunakan proses lain. Beralih ke port ${currentPort + 1}...`);
        currentPort++;
        setTimeout(() => startListen(currentPort), 200);
    } else {
        console.error(`\n❌ [ERROR SERVER]`, err.message);
    }
});

module.exports = server;

// Jalankan listener port hanya jika BUKAN di lingkungan Vercel Serverless
if (!process.env.VERCEL) {
    startListen(currentPort);
}
