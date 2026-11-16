/**
 * Supabase / PostgreSQL Enterprise Database Client
 * PT. Jaya Kedhaton Enterprise System
 */

const { Pool } = require('pg');

let pool = null;
let isConnected = false;
let lastCheckTime = 0;
const HEALTH_CHECK_INTERVAL_MS = 60000; // 1 menit

function getPgConfig() {
    return {
        host: process.env.DB_HOST || 'db.fnjikdfgupzjzzmaplmc.supabase.co',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'SamarindaJK@99',
        database: process.env.DB_DATABASE || 'postgres',
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10
    };
}

function getPool() {
    if (!pool) {
        const config = getPgConfig();
        pool = new Pool(config);

        pool.on('error', (err) => {
            console.warn('⚠️ [SUPABASE POOL WARNING]', err.message);
            isConnected = false;
        });
    }
    return pool;
}

/**
 * Cek status koneksi ke Supabase PostgreSQL
 * Mengembalikan true jika online, false jika offline/unreachable
 */
async function checkConnection() {
    const now = Date.now();
    if (now - lastCheckTime < HEALTH_CHECK_INTERVAL_MS && isConnected) {
        return isConnected;
    }
    lastCheckTime = now;

    try {
        const p = getPool();
        const client = await p.connect();
        try {
            await client.query('SELECT 1');
            isConnected = true;
            return true;
        } finally {
            client.release();
        }
    } catch (err) {
        isConnected = false;
        return false;
    }
}

/**
 * Eksekusi query SQL dengan proteksi safe fallback
 */
async function executeQuery(text, params = []) {
    const p = getPool();
    const client = await p.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}

module.exports = {
    getPool,
    checkConnection,
    executeQuery,
    isSupabaseConnected: () => isConnected
};
