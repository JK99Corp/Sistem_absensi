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

// Initial load
loadFromDisk();

module.exports = {
    dummyData,
    saveToDisk,
    loadFromDisk,
    generateNextId,
    DB_FILE
};
