/**
 * Main Application Router & Request Dispatcher
 * PT. Jaya Kedhaton Enterprise System
 */

const fs = require('fs');
const path = require('path');
const { getCurrentUser, addAuditLog } = require('../middlewares/auth');
const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

// Controllers
const { handleLoginSubmit, handleLoginView, handleLogout } = require('../controllers/auth.controller');
const { renderDashboard } = require('../controllers/dashboard.controller');
const { renderAuditLog, renderAccessDenied } = require('../controllers/audit.controller');
const { renderRiwayat } = require('../controllers/riwayat.controller');
const { renderRekap } = require('../controllers/rekap.controller');
const { renderUpah } = require('../controllers/upah.controller');
const {
    renderKaryawan,
    handleCreateKaryawan,
    handleDeleteKaryawan,
    handleRestoreKaryawan
} = require('../controllers/karyawan.controller');
const { renderKartuRfid } = require('../controllers/kartu.controller');
const { renderDevice } = require('../controllers/device.controller');
const {
    handleGetTransaksi,
    handleSaveTransaksi,
    handleHapusTransaksi
} = require('../controllers/transaksi.controller');

function handleRequest(req, res) {
    let reqUrl = req.url;
    if (reqUrl.includes('__url=')) {
        try {
            const u = new URL(reqUrl, 'http://localhost:8000');
            const orig = u.searchParams.get('__url');
            if (orig) {
                u.searchParams.delete('__url');
                const rem = u.searchParams.toString();
                const cleanOrig = orig.startsWith('/') ? orig : '/' + orig;
                reqUrl = cleanOrig + (rem ? '?' + rem : '');
            }
        } catch (_) {}
    }
    const parsedUrl = new URL(reqUrl, 'http://localhost:8000');
    let pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';
    if (pathname.endsWith('.html') && pathname.length > 5) {
        pathname = pathname.slice(0, -5);
    }
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    // 1. Static Assets Handler (Logo PNG Transparan)
    if (pathname === '/images/logo.png' || pathname === '/images/logo.jpg' || pathname === '/logo.png' || pathname === '/logo.jpg') {
        const logoPath = path.join(__dirname, '..', '..', 'public', 'images', 'logo.png');
        if (fs.existsSync(logoPath)) {
            res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' });
            res.end(fs.readFileSync(logoPath));
            return;
        }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const currentUser = getCurrentUser(req);
    const clientIp = (req.socket && req.socket.remoteAddress) ? req.socket.remoteAddress : '127.0.0.1';

    // 2. Authentication Routes
    if (req.method === 'POST' && pathname === '/login') {
        return handleLoginSubmit(req, res, clientIp);
    }

    if (pathname === '/login') {
        return handleLoginView(req, res, query);
    }

    if (pathname === '/logout') {
        return handleLogout(req, res, currentUser, clientIp);
    }

    // 3. REST API Routes (Form Transaksi & Integrasi)
    if (pathname === '/api/transaksi') {
        if (req.method === 'GET') {
            return handleGetTransaksi(req, res);
        }
        if (req.method === 'POST') {
            return handleSaveTransaksi(req, res, currentUser, clientIp);
        }
    }

    if (pathname === '/api/transaksi/hapus' && req.method === 'POST') {
        return handleHapusTransaksi(req, res, currentUser, clientIp);
    }

    // 4. AUTH GUARD: Seluruh modul internal wajib login terlebih dahulu
    if (!currentUser) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }

    // 5. Karyawan CRUD POST Handlers
    if (req.method === 'POST' && (pathname === '/karyawan' || pathname === '/karyawan/create')) {
        return handleCreateKaryawan(req, res, currentUser, clientIp);
    }

    if (req.method === 'POST' && (pathname === '/karyawan/delete' || /^\/karyawan\/\d+$/.test(pathname))) {
        let targetId = parseInt(query.id);
        const match = pathname.match(/^\/karyawan\/(\d+)$/);
        if (match) targetId = parseInt(match[1]);
        return handleDeleteKaryawan(req, res, currentUser, clientIp, targetId);
    }

    if (req.method === 'POST' && (pathname === '/karyawan/restore' || /^\/karyawan\/\d+\/restore$/.test(pathname))) {
        let targetId = parseInt(query.id);
        const match = pathname.match(/^\/karyawan\/(\d+)\/restore$/);
        if (match) targetId = parseInt(match[1]);
        return handleRestoreKaryawan(req, res, currentUser, clientIp, targetId);
    }

    // 6. Normal GET Web Pages
    if (pathname === '/' || pathname === '/dashboard') {
        res.writeHead(200);
        res.end(renderDashboard(query.kategori || '', query.device || '', currentUser));
    } else if (pathname === '/audit-log' || pathname === '/log-aktivitas') {
        const isSuperAdmin = (currentUser.username === 'superadmin' || currentUser.username === 'admin.utama');
        if (isSuperAdmin) {
            res.writeHead(200);
            res.end(renderAuditLog(currentUser, query.aksi || '', query.user || ''));
        } else {
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
}

module.exports = {
    handleRequest
};
