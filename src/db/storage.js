/**
 * Data Storage & Persistence Layer
 * PT. Jaya Kedhaton Enterprise System
 */

const fs = require('fs');
const path = require('path');
const { defaultTemplateData } = require('../config/constants');

const DB_FILE = path.join(__dirname, '..', '..', 'database', 'storage.json');

let dummyData = JSON.parse(JSON.stringify(defaultTemplateData));

function saveToDisk() {
    const dataStr = JSON.stringify(dummyData, null, 2);
    const tmpFile = DB_FILE + '.tmp';
    try {
        fs.writeFileSync(tmpFile, dataStr, 'utf-8');
        try {
            fs.renameSync(tmpFile, DB_FILE);
            return;
        } catch (renameErr) {
            // Windows file-system locking fallback: direct copy and unlink
            fs.copyFileSync(tmpFile, DB_FILE);
            try { fs.unlinkSync(tmpFile); } catch (_) {}
            return;
        }
    } catch (_) {}

    // Direct write fallback
    try {
        fs.writeFileSync(DB_FILE, dataStr, 'utf-8');
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

// Initial load
loadFromDisk();

module.exports = {
    dummyData,
    saveToDisk,
    loadFromDisk,
    generateNextId,
    DB_FILE
};
