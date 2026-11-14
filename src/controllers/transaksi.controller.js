/**
 * Transaksi API Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData, saveToDisk } = require('../db/storage');
const { addAuditLog } = require('../middlewares/auth');

function handleGetTransaksi(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: dummyData.transaksiUpah || [] }));
}

function handleSaveTransaksi(req, res, currentUser, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const payload = JSON.parse(body);
            if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];

            if (payload.transaksiSemua && Array.isArray(payload.transaksiSemua)) {
                dummyData.transaksiUpah = payload.transaksiSemua;
                saveToDisk();
                if (currentUser) {
                    addAuditLog(currentUser.username, 'SYNC_TRANSAKSI', `Sinkronisasi ${dummyData.transaksiUpah.length} transaksi upah`, clientIp);
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, count: dummyData.transaksiUpah.length }));
                return;
            }

            const trx = payload;
            if (!trx || !trx.nama) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Data transaksi tidak valid' }));
                return;
            }

            let idTrx = trx.id || Date.now();
            trx.id = idTrx;

            let idx = dummyData.transaksiUpah.findIndex(t => t.id === idTrx);
            if (idx === -1 && trx.tglMulai && trx.tglSelesai) {
                idx = dummyData.transaksiUpah.findIndex(t =>
                    t.tglMulai === trx.tglMulai &&
                    t.tglSelesai === trx.tglSelesai &&
                    ((t.kode && trx.kode && t.kode === trx.kode) || (t.nama && trx.nama && t.nama.toUpperCase() === trx.nama.toUpperCase()))
                );
            }

            if (idx >= 0) {
                dummyData.transaksiUpah[idx] = { ...dummyData.transaksiUpah[idx], ...trx };
            } else {
                dummyData.transaksiUpah.unshift(trx);
            }

            saveToDisk();
            if (currentUser) {
                addAuditLog(currentUser.username, 'SIMPAN_TRANSAKSI', `Menyimpan transaksi upah: ${trx.nama} (${trx.kode || '-'})`, clientIp);
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, data: trx }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

function handleHapusTransaksi(req, res, currentUser, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const payload = JSON.parse(body);
            const targetId = payload.id;
            if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];
            const prev = dummyData.transaksiUpah.length;
            dummyData.transaksiUpah = dummyData.transaksiUpah.filter(t => t.id != targetId);
            if (dummyData.transaksiUpah.length !== prev) {
                saveToDisk();
                if (currentUser) {
                    addAuditLog(currentUser.username, 'HAPUS_TRANSAKSI', `Menghapus transaksi upah ID: ${targetId}`, clientIp);
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

module.exports = {
    handleGetTransaksi,
    handleSaveTransaksi,
    handleHapusTransaksi
};
