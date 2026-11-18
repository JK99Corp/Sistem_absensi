/**
 * Transaksi API Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 * Menangani REST API Transaksi Upah dengan Proteksi RBAC Khusus Arsip & Pemulihan
 */

const {
    getTransaksiList,
    getTransaksiArsipList,
    syncTransaksi,
    saveTransaksi,
    archiveTransaksi,
    restoreTransaksi
} = require('../services/transaksi.service');
const { addAuditLog } = require('../middlewares/auth');
const { readRequestBody } = require('../utils/helpers');

function isAdminUser(user) {
    if (!user) return false;
    return user.username === 'superadmin' || user.username === 'admin.utama';
}

function handleGetTransaksi(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: getTransaksiList() }));
}

function handleGetTransaksiArsip(req, res, currentUser, clientIp) {
    if (!isAdminUser(currentUser)) {
        if (currentUser) {
            addAuditLog(currentUser.username, 'AKSES_DITOLAK', 'Mencoba mengakses Arsip Transaksi Upah tanpa wewenang Admin/Superadmin', clientIp);
        }
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: false,
            error: 'Akses ditolak: Hanya Admin Utama dan Super Admin yang memiliki wewenang membuka Arsip Transaksi Upah.'
        }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: getTransaksiArsipList() }));
}

function handleSaveTransaksi(req, res, currentUser, clientIp) {
    readRequestBody(req)
        .then(body => {
            const payload = JSON.parse(body);
            if (payload.transaksiSemua && Array.isArray(payload.transaksiSemua)) {
                const result = syncTransaksi(payload.transaksiSemua, currentUser, clientIp);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
                return;
            }

            const result = saveTransaksi(payload, currentUser, clientIp);
            if (!result.success) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            const status = err.statusCode || (err instanceof SyntaxError ? 400 : 500);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
}

function handleHapusTransaksi(req, res, currentUser, clientIp) {
    readRequestBody(req)
        .then(body => {
            const payload = JSON.parse(body);
            const result = archiveTransaksi(payload.id, currentUser, clientIp);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            const status = err.statusCode || (err instanceof SyntaxError ? 400 : 500);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
}

function handleRestoreTransaksi(req, res, currentUser, clientIp) {
    if (!isAdminUser(currentUser)) {
        if (currentUser) {
            addAuditLog(currentUser.username, 'AKSES_DITOLAK', 'Mencoba memulihkan transaksi dari Arsip tanpa wewenang Admin/Superadmin', clientIp);
        }
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: false,
            error: 'Akses ditolak: Hanya Admin Utama dan Super Admin yang berhak memulihkan transaksi upah.'
        }));
        return;
    }

    readRequestBody(req)
        .then(body => {
            const payload = JSON.parse(body);
            const result = restoreTransaksi(payload.id, currentUser, clientIp);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            const status = err.statusCode || (err instanceof SyntaxError ? 400 : 500);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
}

module.exports = {
    handleGetTransaksi,
    handleGetTransaksiArsip,
    handleSaveTransaksi,
    handleHapusTransaksi,
    handleRestoreTransaksi
};
