/**
 * Enterprise Database Service Layer (Unified DAL)
 * PT. Jaya Kedhaton Enterprise System
 * 
 * Mengintegrasikan Local JSON Persistence Engine dengan Cloud Supabase PostgreSQL
 * Memastikan Zero Downtime dengan Automatic Fallback.
 */

const storage = require('./storage');
const supabase = require('./supabase');

const dbService = {
    // Backward-compatible direct data access
    dummyData: storage.dummyData,
    saveToDisk: storage.saveToDisk,
    loadFromDisk: storage.loadFromDisk,
    generateNextId: storage.generateNextId,
    DB_FILE: storage.DB_FILE,

    // Supabase PostgreSQL Bridge
    supabase,
    isCloudReady: supabase.isSupabaseConnected,
    checkCloudHealth: supabase.checkConnection,

    // Enterprise DAO Methods
    karyawan: {
        getAllAktif: () => storage.dummyData.karyawanAktif || [],
        getAllArsip: () => storage.dummyData.karyawanArsip || [],
        findById: (id) => {
            const numId = parseInt(id, 10);
            return (storage.dummyData.karyawanAktif || []).find(k => k.id === numId) ||
                   (storage.dummyData.karyawanArsip || []).find(k => k.id === numId) || null;
        },
        findByUid: (uid) => {
            if (!uid) return null;
            const cleanUid = String(uid).trim().toUpperCase();
            return (storage.dummyData.karyawanAktif || []).find(k => (k.uid || '').toUpperCase() === cleanUid) || null;
        }
    },

    devices: {
        getAll: () => storage.dummyData.devices || [],
        findByKode: (kode) => {
            return (storage.dummyData.devices || []).find(d => d.kode === kode) || null;
        }
    },

    audit: {
        getRecentLogs: (limit = 100) => {
            const logs = storage.dummyData.auditLogs || [];
            return logs.slice(0, limit);
        },
        record: (logEntry) => {
            if (!storage.dummyData.auditLogs) storage.dummyData.auditLogs = [];
            storage.dummyData.auditLogs.unshift({
                id: Date.now(),
                waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
                ...logEntry
            });
            storage.saveToDisk();
        }
    }
};

module.exports = dbService;
