/**
 * Karyawan Service
 * PT. Jaya Kedhaton Enterprise System
 * Domain logic for employee management, financial rules, soft-deletion, and RFID binding
 */

const { dummyData, saveToDisk, generateNextId } = require('../db/storage');
const { addAuditLog } = require('../middlewares/auth');

function getKaryawanList(tab = 'aktif') {
    return tab === 'arsip' ? (dummyData.karyawanArsip || []) : (dummyData.karyawanAktif || []);
}

function createKaryawan(params, currentUser = null, clientIp = '127.0.0.1') {
    const rawNama = (params.get('nama') || '').trim();
    const nama = rawNama || 'Karyawan Baru';
    const kategori = params.get('kategori') || 'Pekerja Harian';
    const uid = (params.get('uid_rfid') || params.get('rfid_uid') || '').trim().toUpperCase();
    const noHp = (params.get('no_hp') || '-').trim();

    // 1. Validasi UID Wajib Diisi
    if (!uid) {
        return { success: false, code: 'err_uid_kosong' };
    }

    // 2. Validasi Tabrakan UID RFID Duplikat
    const uidExists = dummyData.karyawanAktif.some(k => k.uid && k.uid.toUpperCase() === uid);
    if (uidExists) {
        return { success: false, code: 'err_uid_duplikat' };
    }

    // 3. Validasi Nilai Finansial (Upah & Tarif Lembur Tidak Boleh Negatif)
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
    if (!dummyData.kartu) dummyData.kartu = [];
    dummyData.kartu.push({
        id: newId,
        uid,
        pemilik: nama,
        kategori,
        tgl: new Date().toISOString().slice(0, 10),
        status: 'Aktif'
    });

    // Tambahkan ke daftar upah & lembur
    if (!dummyData.karyawanUpah) dummyData.karyawanUpah = [];
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
        if (!dummyData.pekerjaHarian) dummyData.pekerjaHarian = [];
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

    saveToDisk();

    if (currentUser) {
        addAuditLog(currentUser.username, 'TAMBAH_KARYAWAN', `Menambahkan karyawan baru: ${nama} (${kategori}, UID: ${uid})`, clientIp);
    }

    return { success: true, code: 'sukses_tambah', data: newKaryawan };
}

function archiveKaryawan(id, currentUser = null, clientIp = '127.0.0.1') {
    const targetId = parseInt(id);
    if (!targetId) {
        return { success: false, code: 'err_not_found' };
    }

    const idx = dummyData.karyawanAktif.findIndex(k => k.id === targetId);
    if (idx === -1) {
        return { success: false, code: 'err_not_found' };
    }

    if (!dummyData.karyawanArsip) dummyData.karyawanArsip = [];

    const removed = dummyData.karyawanAktif.splice(idx, 1)[0];
    dummyData.karyawanArsip.push({
        ...removed,
        status: 'Diarsipkan',
        deletedAt: new Date().toLocaleString('id-ID'),
        keterangan: 'Diarsipkan oleh admin. Data keuangan & riwayat absensi tetap aman 100%.'
    });

    // Sinkronisasi otomatis ke status Kartu RFID
    if (dummyData.kartu) {
        const card = dummyData.kartu.find(c => c.uid === removed.uid);
        if (card) {
            card.status = 'Nonaktif (Arsip)';
        }
    }

    saveToDisk();

    if (currentUser) {
        addAuditLog(currentUser.username, 'ARSIP_KARYAWAN', `Memindahkan karyawan ${removed.nama} (ID: ${targetId}) ke Arsip`, clientIp);
    }

    return { success: true, code: 'sukses_hapus', data: removed };
}

function restoreKaryawan(id, currentUser = null, clientIp = '127.0.0.1') {
    const targetId = parseInt(id);
    if (!targetId) {
        return { success: false, code: 'err_not_found' };
    }

    if (!dummyData.karyawanArsip) dummyData.karyawanArsip = [];
    const idx = dummyData.karyawanArsip.findIndex(k => k.id === targetId);
    if (idx === -1) {
        return { success: false, code: 'err_not_found' };
    }

    const target = dummyData.karyawanArsip[idx];

    // Validasi Tabrakan UID saat Restore
    const uidConflict = target.uid ? dummyData.karyawanAktif.some(k => k.uid && k.uid.toUpperCase() === target.uid.toUpperCase()) : false;
    if (uidConflict) {
        return { success: false, code: 'err_restore_conflict' };
    }

    const restored = dummyData.karyawanArsip.splice(idx, 1)[0];
    delete restored.deletedAt;
    delete restored.keterangan;
    dummyData.karyawanAktif.push({
        ...restored,
        status: 'Aktif'
    });

    // Sinkronisasi otomatis aktifkan kembali Kartu RFID
    if (dummyData.kartu) {
        const card = dummyData.kartu.find(c => c.uid === restored.uid);
        if (card) {
            card.status = 'Aktif';
        }
    }

    saveToDisk();

    if (currentUser) {
        addAuditLog(currentUser.username, 'PULIHKAN_KARYAWAN', `Memulihkan karyawan ${restored.nama} (ID: ${targetId}) dari Arsip ke status Aktif`, clientIp);
    }

    return { success: true, code: 'sukses_restore', data: restored };
}

module.exports = {
    getKaryawanList,
    createKaryawan,
    archiveKaryawan,
    restoreKaryawan
};
