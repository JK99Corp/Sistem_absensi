/**
 * PT. Jaya Kedhaton Enterprise System
 * COMPREHENSIVE DEEP AUDIT & FUNCTIONAL TEST SUITE
 * 
 * Tests every single module, calculation, edge-case, and security layer
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

console.log('================================================================');
console.log('🏛️  PT. JAYA KEDHATON ENTERPRISE - DEEP AUDIT & COMPREHENSIVE QA');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`  ✅ [PASS] ${testName}`);
        passCount++;
    } else {
        console.error(`  ❌ [FAIL] ${testName} ${details ? '-> ' + details : ''}`);
        failCount++;
    }
}

// Snapshot storage database for clean teardown
const storagePath = path.join(__dirname, 'database', 'storage.json');
const initialStorageSnapshot = fs.readFileSync(storagePath, 'utf8');

// Load Server without binding real TCP port
let serverInstance;
require('http').Server.prototype.listen = function(port, cb) {
    serverInstance = this;
    if (cb) cb();
    return this;
};
require('./server.js');
const requestListener = serverInstance.listeners('request')[0];

function simulateRequest(method, urlStr, postData = null, cookie = 'auth_user=superadmin') {
    return new Promise((resolve) => {
        const req = new EventEmitter();
        req.method = method;
        req.url = urlStr;
        req.headers = {
            'content-type': typeof postData === 'string' && postData.startsWith('{') ? 'application/json' : 'application/x-www-form-urlencoded',
            'host': 'localhost:8000',
            'cookie': cookie
        };
        req.socket = { remoteAddress: '127.0.0.1' };

        const res = new EventEmitter();
        let statusCode = 200;
        let headers = {};
        let body = '';

        res.writeHead = function(code, h) {
            statusCode = code;
            if (h) {
                for (const [k, v] of Object.entries(h)) {
                    headers[k] = v;
                    headers[k.toLowerCase()] = v;
                }
            }
            return res;
        };

        res.setHeader = function(key, val) {
            headers[key] = val;
            headers[key.toLowerCase()] = val;
            return res;
        };

        res.end = function(data) {
            if (data) body += data.toString();
            resolve({
                statusCode,
                headers,
                body
            });
        };

        requestListener(req, res);

        if (postData) {
            req.emit('data', Buffer.from(postData));
        }
        req.emit('end');
    });
}

async function runComprehensiveAudit() {
    // -------------------------------------------------------------
    // SECTION 1: MASTER DATA INTEGRITY
    // -------------------------------------------------------------
    console.log('📌 [BAGIAN 1] Audit Integritas Data Master (preview/master-data.js):');
    const masterData = require('./preview/master-data.js');
    assert(Array.isArray(masterData.MASTER_PEKERJA), 'MASTER_PEKERJA terdefinisi sebagai Array');
    assert(masterData.MASTER_PEKERJA.length === 255, `MASTER_PEKERJA memuat tepat 255 pekerja resmi (Tercatat: ${masterData.MASTER_PEKERJA.length})`);
    
    const allWorkersValid = masterData.MASTER_PEKERJA.every(p => p.k && p.n && p.p);
    assert(allWorkersValid, 'Setiap pekerja memiliki field wajib: k (kode), n (nama), p (posisi)');

    assert(typeof masterData.MASTER_STANDAR_UPAH === 'object', 'MASTER_STANDAR_UPAH terdefinisi');
    assert(masterData.MASTER_STANDAR_UPAH['STAFF KANTOR'] === 150000, 'Upah standar STAFF KANTOR = Rp 150.000');
    assert(masterData.MASTER_STANDAR_UPAH['TUKANG'] === 140000, 'Upah standar TUKANG = Rp 140.000');
    assert(masterData.MASTER_STANDAR_UPAH['PEMBANTU TUKANG'] === 120000, 'Upah standar PEMBANTU TUKANG = Rp 120.000');

    assert(Array.isArray(masterData.MASTER_PROJEK), 'MASTER_PROJEK terdefinisi sebagai Array');
    assert(masterData.MASTER_PROJEK.length === 30, `MASTER_PROJEK memuat tepat 30 proyek resmi (Tercatat: ${masterData.MASTER_PROJEK.length})`);
    assert(masterData.MASTER_PROJEK.includes('FELISA ESTATE'), 'Proyek FELISA ESTATE terdaftar');
    assert(masterData.MASTER_PROJEK.includes('BORONGAN ASPOL'), 'Proyek BORONGAN ASPOL terdaftar');

    // -------------------------------------------------------------
    // SECTION 2: ENDPOINT ROUTING & WEB VIEWS (GET)
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 2] Audit Semua Endpoint Web View (GET):');
    const routesToTest = [
        { path: '/dashboard', check: '07:30', name: 'Dashboard Monitoring' },
        { path: '/riwayat', check: 'Batas Masuk', name: 'Riwayat Absensi' },
        { path: '/rekap', check: 'Rekap Mingguan', name: 'Rekap Kehadiran Mingguan' },
        { path: '/upah', check: 'Form Transaksi', name: 'Form Transaksi Upah' },
        { path: '/laporan-proyek', check: 'Laporan Pengeluaran Per Proyek', name: 'Laporan Pengeluaran Proyek' },
        { path: '/laporan-proyek?projek=FELISA+ESTATE', check: 'FELISA ESTATE', name: 'Filter Proyek FELISA ESTATE' },
        { path: '/karyawan?tab=aktif', check: 'Karyawan Aktif', name: 'Data Karyawan Aktif' },
        { path: '/karyawan?tab=arsip', check: 'Arsip', name: 'Data Karyawan Arsip' },
        { path: '/kartu-rfid', check: 'Kartu RFID', name: 'Manajemen Kartu RFID' },
        { path: '/device', check: 'Dual ESP32', name: 'Monitoring Device Dual-ESP32' },
        { path: '/audit-log', check: 'Log Aktivitas', name: 'Log Audit Pimpinan' }
    ];

    for (const r of routesToTest) {
        const res = await simulateRequest('GET', r.path, null, 'auth_user=superadmin');
        assert(res.statusCode === 200 && res.body.includes(r.check), `Route [GET] ${r.path} (${r.name}) -> HTTP 200 OK`);
    }

    // -------------------------------------------------------------
    // SECTION 3: REST API TRANSAKSI UPAH & SINKRONISASI
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 3] Audit REST API Transaksi Upah (/api/transaksi):');
    
    // 3.1 GET /api/transaksi
    const getTrxRes = await simulateRequest('GET', '/api/transaksi');
    assert(getTrxRes.statusCode === 200, 'GET /api/transaksi mengembalikan HTTP 200');
    const trxData = JSON.parse(getTrxRes.body);
    assert(trxData.success === true && Array.isArray(trxData.data), 'GET /api/transaksi mengembalikan data array JSON valid');

    // 3.2 POST /api/transaksi (Save single transaksi dengan rincian lengkap)
    const testTrxPayload = {
        id: 99911,
        kode: 'KANCIL-013',
        nama: 'MUSTOFA TEST',
        posisi: 'TUKANG',
        upahPerHari: 140000,
        projekList: [
            { projek: 'FELISA ESTATE', hari: 6, lembur: 4, makan: 30000, transport: 20000, insentif: 15000 },
            { projek: 'RUKO PAK DEDI', hari: 1, lembur: 0, makan: 5000, transport: 5000, insentif: 0 }
        ],
        kasbon: 50000,
        kasbonKet: 'Pinjaman operasional proyek',
        transfer: 1000000,
        cash: 185000
    };
    const postTrxRes = await simulateRequest('POST', '/api/transaksi', JSON.stringify(testTrxPayload), 'auth_user=superadmin');
    assert(postTrxRes.statusCode === 200, 'POST /api/transaksi (Simpan transaksi baru) mengembalikan HTTP 200');
    
    // Verifikasi tersimpan di database
    const verifySaved = await simulateRequest('GET', '/api/transaksi');
    const verifyData = JSON.parse(verifySaved.body);
    const foundTrx = verifyData.data.find(t => t.id === 99911);
    assert(foundTrx !== undefined, 'Transaksi ID 99911 tersimpan persisten di server');
    assert(foundTrx && foundTrx.kasbonKet === 'Pinjaman operasional proyek', 'Keterangan kasbon (kasbonKet) tersimpan sempurna');
    assert(foundTrx && foundTrx.transfer === 1000000 && foundTrx.cash === 185000, 'Rincian nominal Transfer & Cash tersimpan akurat');

    // 3.3 POST /api/transaksi/hapus (Delete transaksi)
    const delTrxRes = await simulateRequest('POST', '/api/transaksi/hapus', JSON.stringify({ id: 99911 }), 'auth_user=superadmin');
    assert(delTrxRes.statusCode === 200, 'POST /api/transaksi/hapus mengembalikan HTTP 200');
    const verifyAfterDel = JSON.parse((await simulateRequest('GET', '/api/transaksi')).body);
    const deletedTrx = verifyAfterDel.data.find(t => t.id === 99911);
    assert(deletedTrx === undefined, 'Transaksi ID 99911 berhasil terhapus dari server');

    // -------------------------------------------------------------
    // SECTION 4: DOMAIN SERVICE AGREGASI BIAYA PROYEK
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 4] Audit Perhitungan Agregasi Pengeluaran Proyek:');
    const projekService = require('./src/services/projek.service.js');
    const agregasi = projekService.getAgregasiProyek();
    assert(Array.isArray(agregasi) && agregasi.length >= 30, 'Agregasi proyek mencakup minimal 30 proyek resmi');
    
    const felisa = agregasi.find(p => p.nama === 'FELISA ESTATE');
    assert(felisa !== undefined, 'Proyek FELISA ESTATE teragregasi');
    assert(felisa && typeof felisa.totalHari === 'number' && typeof felisa.totalPengeluaran === 'number', 'Agregasi FELISA ESTATE memiliki totalHari dan totalPengeluaran terhitung');
    assert(felisa && felisa.totalPengeluaran > 0, `Total pengeluaran FELISA ESTATE terakumulasi: Rp ${felisa.totalPengeluaran.toLocaleString('id-ID')}`);

    // -------------------------------------------------------------
    // SECTION 5: DOMAIN SERVICE KARYAWAN & RFID BINDING
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 5] Audit Modul Karyawan, Validasi, Soft-Delete & Restore:');
    
    // 5.1 Validasi UID Kosong
    const resEmptyUid = await simulateRequest('POST', '/karyawan/create', 'nama=NoUid&kategori=Pekerja+Harian&uid_rfid=&upah_harian=120000', 'auth_user=superadmin');
    assert(resEmptyUid.headers.Location.includes('msg=err_uid_kosong'), 'Pencegahan UID kosong berhasil (Redirect msg=err_uid_kosong)');

    // 5.2 Validasi UID Duplikat (9491F306 sudah digunakan oleh Akmal Zaidan)
    const resDupUid = await simulateRequest('POST', '/karyawan/create', 'nama=DupUser&kategori=Pekerja+Harian&uid_rfid=9491F306&upah_harian=120000', 'auth_user=superadmin');
    assert(resDupUid.headers.Location.includes('msg=err_uid_duplikat'), 'Pencegahan UID duplikat berhasil (Redirect msg=err_uid_duplikat)');

    // 5.3 Tambah Karyawan Valid
    const resAddValid = await simulateRequest('POST', '/karyawan/create', 'nama=Budi+Santoso&kategori=Pekerja+Harian&uid_rfid=AA889900&upah_harian=130000&tarif_lembur=20000', 'auth_user=superadmin');
    assert(resAddValid.headers.Location.includes('msg=sukses_tambah'), 'Penambahan karyawan baru berhasil (Redirect msg=sukses_tambah)');

    // Ambil ID karyawan yang baru ditambahkan
    const storageObj = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const newEmp = storageObj.karyawanAktif.find(k => k.uid === 'AA889900');
    assert(newEmp !== undefined && newEmp.nama === 'Budi Santoso', 'Data Budi Santoso tercatat di database karyawanAktif');
    
    // Cek kartu RFID juga bertambah
    const cardObj = storageObj.kartu.find(c => c.uid === 'AA889900');
    assert(cardObj !== undefined && cardObj.status === 'Aktif', 'Kartu RFID tersinkronisasi otomatis dengan status Aktif');

    // 5.4 Soft-Delete (Arsipkan)
    const resDel = await simulateRequest('POST', '/karyawan/delete', `id=${newEmp.id}`, 'auth_user=superadmin');
    assert(resDel.headers.Location.includes('msg=sukses_hapus'), 'Soft delete berhasil (Redirect msg=sukses_hapus)');
    
    const storageAfterDel = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const empInActive = storageAfterDel.karyawanAktif.find(k => k.id === newEmp.id);
    const empInArsip = storageAfterDel.karyawanArsip.find(k => k.id === newEmp.id);
    assert(empInActive === undefined, 'Karyawan terhapus dari daftar aktif');
    assert(empInArsip !== undefined && empInArsip.status === 'Diarsipkan', 'Karyawan masuk ke daftar arsip dengan status Diarsipkan');

    const cardAfterDel = storageAfterDel.kartu.find(c => c.uid === 'AA889900');
    assert(cardAfterDel && cardAfterDel.status === 'Nonaktif (Arsip)', 'Status kartu RFID otomatis nonaktif (Arsip)');

    // 5.5 Restore (Pulihkan dari arsip)
    const resRestore = await simulateRequest('POST', '/karyawan/restore', `id=${newEmp.id}`, 'auth_user=superadmin');
    assert(resRestore.headers.Location.includes('msg=sukses_restore'), 'Restore berhasil (Redirect msg=sukses_restore)');

    const storageAfterRestore = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const empRestored = storageAfterRestore.karyawanAktif.find(k => k.id === newEmp.id);
    assert(empRestored !== undefined && empRestored.status === 'Aktif', 'Karyawan pulih kembali ke daftar aktif');

    const cardAfterRestore = storageAfterRestore.kartu.find(c => c.uid === 'AA889900');
    assert(cardAfterRestore && cardAfterRestore.status === 'Aktif', 'Status kartu RFID otomatis pulih menjadi Aktif');

    // -------------------------------------------------------------
    // SECTION 6: AUTENTIKASI, LOGOUT & KONTROL AKSES (RBAC)
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 6] Audit Autentikasi, Logout & RBAC Keamanan:');
    
    // 6.1 Logout
    const resLogout = await simulateRequest('GET', '/logout', null, 'auth_user=superadmin');
    assert(resLogout.statusCode === 302 && resLogout.headers.Location === '/login', 'GET /logout me-redirect ke /login');
    assert(resLogout.headers['set-cookie']?.includes('Max-Age=0') || resLogout.headers['set-cookie']?.includes('auth_user=;'), 'GET /logout menghapus cookie sesi auth_user');

    // 6.2 Hak Akses Audit Log
    const resAuditKeuangan = await simulateRequest('GET', '/audit-log', null, 'auth_user=staf.keuangan');
    assert(resAuditKeuangan.statusCode === 403, 'Staf Keuangan diblokir dari Log Audit (HTTP 403 Forbidden)');

    const resAuditHrd = await simulateRequest('GET', '/audit-log', null, 'auth_user=staf.hrd');
    assert(resAuditHrd.statusCode === 403, 'Staf HRD diblokir dari Log Audit (HTTP 403 Forbidden)');

    const resAuditSuper = await simulateRequest('GET', '/audit-log', null, 'auth_user=superadmin');
    assert(resAuditSuper.statusCode === 200, 'Super Admin memiliki akses penuh ke Log Audit (HTTP 200 OK)');

    const resAuditAdmin = await simulateRequest('GET', '/audit-log', null, 'auth_user=admin.utama');
    assert(resAuditAdmin.statusCode === 200, 'Admin Utama memiliki akses penuh ke Log Audit (HTTP 200 OK)');

    // -------------------------------------------------------------
    // SECTION 7: STATIC ASSETS & OFFLINE PRESENTATION
    // -------------------------------------------------------------
    console.log('\n📌 [BAGIAN 7] Audit Asset Statis & Mode Presentasi Offline:');
    const staticAssets = [
        { url: '/transaksi-upah.js', mime: 'javascript' },
        { url: '/master-data.js', mime: 'javascript' },
        { url: '/projek-manager.js', mime: 'javascript' },
        { url: '/pekerja_kode.json', mime: 'json' },
        { url: '/images/logo.png', mime: 'png' },
        { url: '/favicon.ico', mime: 'png' }
    ];
    for (const a of staticAssets) {
        const res = await simulateRequest('GET', a.url, null, '');
        assert(res.statusCode === 200, `Asset statis [GET] ${a.url} disajikan dengan sukses (HTTP 200)`);
    }

    // Teardown: Kembalikan kondisi storage persis seperti awal
    fs.writeFileSync(storagePath, initialStorageSnapshot, 'utf8');
    require('./src/db/storage').loadFromDisk();

    console.log('\n================================================================');
    console.log(`📊 REKAP HASIL AUDIT KOMPREHENSIF:`);
    console.log(`   - Total Pengujian : ${passCount + failCount}`);
    console.log(`   - Berhasil (PASS) : ${passCount}`);
    console.log(`   - Gagal (FAIL)    : ${failCount}`);
    console.log(`   - Tingkat Kualitas: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
    console.log('================================================================');

    if (failCount > 0) {
        process.exit(1);
    }
}

runComprehensiveAudit().catch(err => {
    console.error('CRITICAL AUDIT ERROR:', err);
    process.exit(1);
});
