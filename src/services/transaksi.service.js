/**
 * Transaksi Service
 * PT. Jaya Kedhaton Enterprise System
 * Domain logic for saving, syncing, soft-deleting (archiving), and restoring wage transactions
 */

const { dummyData, saveToDisk } = require('../db/storage');
const { addAuditLog } = require('../middlewares/auth');

function getTransaksiList() {
    return dummyData.transaksiUpah || [];
}

function getTransaksiArsipList() {
    return dummyData.transaksiUpahArsip || [];
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

    let idx = dummyData.transaksiUpah.findIndex(t => String(t.id) === String(idTrx));
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

/**
 * Enterprise Soft-Delete untuk Transaksi Upah
 * Memindahkan transaksi ke daftar arsip dengan stempel waktu dan aktor pengarsip
 */
function archiveTransaksi(targetId, currentUser = null, clientIp = '127.0.0.1') {
    if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];
    if (!dummyData.transaksiUpahArsip) dummyData.transaksiUpahArsip = [];

    const idx = dummyData.transaksiUpah.findIndex(t => String(t.id) === String(targetId));
    if (idx === -1) {
        return { success: false, error: 'Data transaksi tidak ditemukan' };
    }

    const removed = dummyData.transaksiUpah.splice(idx, 1)[0];
    const archivedItem = {
        ...removed,
        status: 'Diarsipkan',
        deletedAt: new Date().toLocaleString('id-ID'),
        deletedBy: currentUser ? currentUser.username : 'system'
    };

    dummyData.transaksiUpahArsip.unshift(archivedItem);
    saveToDisk();

    if (currentUser) {
        addAuditLog(currentUser.username, 'ARSIP_TRANSAKSI', `Memindahkan transaksi upah ${removed.nama} (ID: ${targetId}) ke Arsip`, clientIp);
    }

    return { success: true, code: 'sukses_arsip', data: archivedItem };
}

/**
 * Pemulihan Transaksi Upah dari Arsip
 * Hanya dapat dipicu oleh Super Admin dan Admin Utama
 */
function restoreTransaksi(targetId, currentUser = null, clientIp = '127.0.0.1') {
    if (!dummyData.transaksiUpah) dummyData.transaksiUpah = [];
    if (!dummyData.transaksiUpahArsip) dummyData.transaksiUpahArsip = [];

    const idx = dummyData.transaksiUpahArsip.findIndex(t => String(t.id) === String(targetId));
    if (idx === -1) {
        return { success: false, error: 'Data transaksi di arsip tidak ditemukan' };
    }

    const restored = dummyData.transaksiUpahArsip.splice(idx, 1)[0];
    delete restored.deletedAt;
    delete restored.deletedBy;
    restored.status = 'Aktif';

    dummyData.transaksiUpah.unshift(restored);
    saveToDisk();

    if (currentUser) {
        addAuditLog(currentUser.username, 'PULIHKAN_TRANSAKSI', `Memulihkan transaksi upah ${restored.nama} (ID: ${targetId}) dari Arsip ke Aktif`, clientIp);
    }

    return { success: true, code: 'sukses_restore', data: restored };
}

function deleteTransaksi(targetId, currentUser = null, clientIp = '127.0.0.1') {
    return archiveTransaksi(targetId, currentUser, clientIp);
}

module.exports = {
    getTransaksiList,
    getTransaksiArsipList,
    syncTransaksi,
    saveTransaksi,
    archiveTransaksi,
    restoreTransaksi,
    deleteTransaksi
};
