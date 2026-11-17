/**
 * Transaksi Service
 * PT. Jaya Kedhaton Enterprise System
 * Domain logic for saving, syncing, and removing wage transactions
 */

const { dummyData, saveToDisk } = require('../db/storage');
const { addAuditLog } = require('../middlewares/auth');

function getTransaksiList() {
    return dummyData.transaksiUpah || [];
}

function syncTransaksi(transaksiSemua, currentUser = null, clientIp = '127.0.0.1') {
    if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];
    dummyData.transaksiUpah = transaksiSemua;
    saveToDisk();
    if (currentUser) {
        addAuditLog(currentUser.username, 'SYNC_TRANSAKSI', `Sinkronisasi ${dummyData.transaksiUpah.length} transaksi upah`, clientIp);
    }
    return { success: true, count: dummyData.transaksiUpah.length };
}

function saveTransaksi(trx, currentUser = null, clientIp = '127.0.0.1') {
    if (!trx || !trx.nama) {
        return { success: false, error: 'Data transaksi tidak valid' };
    }

    if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];

    const idTrx = trx.id || Date.now();
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

    return { success: true, data: trx };
}

function deleteTransaksi(targetId, currentUser = null, clientIp = '127.0.0.1') {
    if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];
    const prev = dummyData.transaksiUpah.length;
    dummyData.transaksiUpah = dummyData.transaksiUpah.filter(t => t.id != targetId);
    if (dummyData.transaksiUpah.length !== prev) {
        saveToDisk();
        if (currentUser) {
            addAuditLog(currentUser.username, 'HAPUS_TRANSAKSI', `Menghapus transaksi upah ID: ${targetId}`, clientIp);
        }
    }
    return { success: true };
}

module.exports = {
    getTransaksiList,
    syncTransaksi,
    saveTransaksi,
    deleteTransaksi
};
