/**
 * Tool Sinkronisasi Database Supabase Cloud <-> Local JSON/SQLite
 * PT Jaya Kedhaton - Sistem Absensi Digital
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const STORAGE_FILE = path.join(__dirname, 'database', 'storage.json');
const ENV_FILE = path.join(__dirname, '.env');

function getSupabaseConfig() {
    let dbHost = 'db.fnjikdfgupzjzzmaplmc.supabase.co';
    let dbPass = 'SamarindaJK@99';
    let dbUser = 'postgres';
    let dbPort = 5432;
    let dbName = 'postgres';

    if (fs.existsSync(ENV_FILE)) {
        const envText = fs.readFileSync(ENV_FILE, 'utf8');
        const getVal = key => {
            const m = envText.match(new RegExp(`^${key}=(.*)$`, 'm'));
            return m ? m[1].trim() : null;
        };
        dbHost = getVal('DB_HOST') || dbHost;
        dbPass = getVal('DB_PASSWORD') || dbPass;
        dbUser = getVal('DB_USERNAME') || dbUser;
        dbPort = parseInt(getVal('DB_PORT')) || dbPort;
        dbName = getVal('DB_DATABASE') || dbName;
    }

    return {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPass,
        database: dbName,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    };
}

async function getClient() {
    const config = getSupabaseConfig();
    const client = new Client(config);
    await client.connect();
    return client;
}

async function checkStatus() {
    console.log('====================================================');
    console.log('🔍 CEK STATUS KONEKSI DATABASE SUPABASE CLOUD');
    console.log('====================================================\n');

    try {
        const client = await getClient();
        console.log('✅ Terhubung ke Supabase PostgreSQL Cloud: ' + getSupabaseConfig().host);

        const uCount = await client.query('SELECT count(*) FROM users');
        const kCount = await client.query('SELECT count(*) FROM karyawan WHERE deleted_at IS NULL');
        const kArsip = await client.query('SELECT count(*) FROM karyawan WHERE deleted_at IS NOT NULL');
        const dCount = await client.query('SELECT count(*) FROM devices');
        const aCount = await client.query('SELECT count(*) FROM absensi');
        const lCount = await client.query('SELECT count(*) FROM audit_logs');

        console.log('\n📊 Data di Supabase Cloud:');
        console.log(`   - Akun Pengguna    : ${uCount.rows[0].count}`);
        console.log(`   - Karyawan Aktif   : ${kCount.rows[0].count}`);
        console.log(`   - Karyawan Arsip   : ${kArsip.rows[0].count}`);
        console.log(`   - Perangkat ESP32  : ${dCount.rows[0].count}`);
        console.log(`   - Log Absensi      : ${aCount.rows[0].count}`);
        console.log(`   - Log Audit        : ${lCount.rows[0].count}`);

        if (fs.existsSync(STORAGE_FILE)) {
            const localData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
            console.log('\n💾 Data di Penyimpanan Lokal (storage.json):');
            console.log(`   - Karyawan Aktif   : ${localData.karyawanAktif?.length || 0}`);
            console.log(`   - Karyawan Arsip   : ${localData.karyawanArsip?.length || 0}`);
            console.log(`   - Kartu RFID       : ${localData.kartu?.length || 0}`);
            console.log(`   - Perangkat ESP32  : ${localData.devices?.length || 0}`);
        }

        await client.end();
        console.log('\n====================================================');
        console.log('✨ Status: DATABASE CLOUD ONLINE & SIAP DIGUNAKAN');
        console.log('====================================================');
    } catch (err) {
        console.error('❌ Gagal terhubung ke Supabase:', err.message);
    }
}

async function pullFromCloud() {
    console.log('====================================================');
    console.log('⬇️  MENARIK DATA DARI SUPABASE CLOUD KE LOKAL');
    console.log('====================================================\n');

    try {
        const client = await getClient();
        console.log('✅ Terhubung ke Supabase Cloud. Mengambil data master...');

        const kRes = await client.query('SELECT * FROM karyawan ORDER BY id');
        const dRes = await client.query('SELECT * FROM devices ORDER BY id');

        const localData = fs.existsSync(STORAGE_FILE) ? JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8')) : {};

        localData.karyawanAktif = kRes.rows.filter(r => !r.deleted_at).map(r => ({
            id: parseInt(r.id),
            nama: r.nama,
            kategori: r.kategori,
            uid: r.uid_rfid,
            noHp: r.no_hp || '-',
            status: r.status,
            upahHarian: r.upah_harian,
            tarifLembur: r.tarif_lembur,
            tglGabung: new Date(r.created_at).toLocaleDateString('id-ID')
        }));

        localData.karyawanArsip = kRes.rows.filter(r => !!r.deleted_at).map(r => ({
            id: parseInt(r.id),
            nama: r.nama,
            kategori: r.kategori,
            uid: r.uid_rfid,
            noHp: r.no_hp || '-',
            status: 'Diarsipkan',
            upahHarian: r.upah_harian,
            tarifLembur: r.tarif_lembur,
            deletedAt: new Date(r.deleted_at).toLocaleString('id-ID'),
            keterangan: 'Diarsipkan dari database cloud.'
        }));

        localData.devices = dRes.rows.map(d => ({
            id: parseInt(d.id),
            kode: d.kode_device,
            lokasi: d.lokasi,
            tipe: d.tipe,
            ip: d.ip_address || '192.168.1.100',
            status: d.status,
            lastPing: 'Online'
        }));

        fs.writeFileSync(STORAGE_FILE, JSON.stringify(localData, null, 2), 'utf8');
        console.log(`✅ Berhasil menyelaraskan ${localData.karyawanAktif.length} karyawan aktif & ${localData.karyawanArsip.length} arsip ke storage.json!`);

        await client.end();
    } catch (err) {
        console.error('❌ Gagal sinkronisasi dari cloud:', err.message);
    }
}

const cmd = process.argv[2] || 'status';

if (cmd === 'status') {
    checkStatus();
} else if (cmd === 'pull') {
    pullFromCloud();
} else {
    console.log('Penggunaan:');
    console.log('  node db-sync.js status   -> Cek koneksi dan jumlah data');
    console.log('  node db-sync.js pull     -> Ambil data terbaru dari cloud ke lokal');
}

