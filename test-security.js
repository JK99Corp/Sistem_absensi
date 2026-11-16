/**
 * Comprehensive Security & Penetration Audit Test Suite
 * PT. Jaya Kedhaton Enterprise System
 * 
 * Pengujian Ketahanan Keamanan Siber (OWASP Top 10 & Business Logic Fuzzing)
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// Snapshot database awal untuk isolasi & sanitasi lingkungan uji
const storagePath = path.join(__dirname, 'database', 'storage.json');
const initialStorageSnapshot = fs.readFileSync(storagePath, 'utf8');

// Mock server listener untuk pengujian in-memory non-socket
let serverInstance;
const originalListen = require('http').Server.prototype.listen;
require('http').Server.prototype.listen = function(port, cb) {
    serverInstance = this;
    if (cb) cb();
    return this;
};

// Muat server
require('./server.js');
const requestListener = serverInstance.listeners('request')[0];

function simulateRequest(method, urlStr, postData = null, cookie = '') {
    return new Promise((resolve) => {
        const req = new EventEmitter();
        req.method = method;
        req.url = urlStr;
        req.headers = {
            'content-type': typeof postData === 'object' && postData !== null && !Buffer.isBuffer(postData) && !(typeof postData === 'string') 
                ? 'application/json' 
                : 'application/x-www-form-urlencoded',
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
            resolve({ statusCode, headers, body });
        };

        requestListener(req, res);

        if (postData) {
            const dataStr = typeof postData === 'object' ? JSON.stringify(postData) : postData;
            req.emit('data', Buffer.from(dataStr));
        }
        req.emit('end');
    });
}

async function runSecurityTests() {
    console.log('================================================================');
    console.log('🛡️  PENGUJIAN KETAHANAN KEAMANAN SIBER & PENETRATION AUDIT');
    console.log('    Sistem Absensi Digital - PT Jaya Kedhaton Enterprise');
    console.log('================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    function assertTest(name, condition, detail = '') {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`  ✅ [PASS] ${name}`);
        } else {
            failedTests++;
            console.error(`  ❌ [FAIL] ${name} ${detail ? `-> ${detail}` : ''}`);
        }
    }

    // -------------------------------------------------------------
    // KATEGORI 1: OTENTIKASI & KONTROL AKSES (A01 - Broken Access Control)
    // -------------------------------------------------------------
    console.log('📌 [KATEGORI 1] Pengujian Kontrol Akses & Pembatasan Hak (RBAC):');

    // 1.1 Akses endpoint rahasia tanpa sesi sama sekali
    const resUnauthAudit = await simulateRequest('GET', '/audit-log', null, '');
    assertTest('Tamu tanpa cookie dilarang buka /audit-log (Redirect 302 ke /login)', 
        resUnauthAudit.statusCode === 302 && resUnauthAudit.headers['location'] === '/login');

    const resUnauthDashboard = await simulateRequest('GET', '/dashboard', null, '');
    assertTest('Tamu tanpa cookie dilarang buka /dashboard (Redirect 302 ke /login)', 
        resUnauthDashboard.statusCode === 302 && resUnauthDashboard.headers['location'] === '/login');

    const resUnauthKaryawan = await simulateRequest('GET', '/karyawan', null, '');
    assertTest('Tamu tanpa cookie dilarang buka /karyawan (Redirect 302 ke /login)', 
        resUnauthKaryawan.statusCode === 302 && resUnauthKaryawan.headers['location'] === '/login');

    // 1.2 Cookie Tampering / Spoofing
    const resFakeCookie = await simulateRequest('GET', '/audit-log', null, 'auth_user=direktur_palsu');
    assertTest('Cookie username palsu ditolak mentah-mentah (Redirect 302 ke /login)', 
        resFakeCookie.statusCode === 302 && resFakeCookie.headers['location'] === '/login');

    const resNullByteCookie = await simulateRequest('GET', '/dashboard', null, 'auth_user=superadmin%00inject');
    assertTest('Cookie injeksi null-byte ditolak', 
        resNullByteCookie.statusCode === 302 && resNullByteCookie.headers['location'] === '/login');

    // 1.3 Privilege Escalation: Staf Biasa Mencoba Membuka Log Audit Rahasia
    const resKeuanganAudit = await simulateRequest('GET', '/audit-log', null, 'auth_user=staf.keuangan');
    assertTest('Staf Keuangan diblokir dari Log Audit (HTTP 403 Forbidden)', 
        resKeuanganAudit.statusCode === 403 && resKeuanganAudit.body.includes('Akses Ditolak'));

    const resHrdAudit = await simulateRequest('GET', '/audit-log', null, 'auth_user=staf.hrd');
    assertTest('Staf HRD diblokir dari Log Audit (HTTP 403 Forbidden)', 
        resHrdAudit.statusCode === 403 && resHrdAudit.body.includes('Akses Ditolak'));

    // 1.4 Akses Legal Super Admin & Admin Utama
    const resSuperadminAudit = await simulateRequest('GET', '/audit-log', null, 'auth_user=superadmin');
    assertTest('Super Admin berhasil membuka Log Audit (HTTP 200)', 
        resSuperadminAudit.statusCode === 200 && resSuperadminAudit.body.includes('Log Aktivitas'));

    const resAdminUtamaAudit = await simulateRequest('GET', '/audit-log', null, 'auth_user=admin.utama');
    assertTest('Admin Utama berhasil membuka Log Audit (HTTP 200)', 
        resAdminUtamaAudit.statusCode === 200 && resAdminUtamaAudit.body.includes('Log Aktivitas'));

    // -------------------------------------------------------------
    // KATEGORI 2: INJEKSI KODE & CROSS-SITE SCRIPTING (A03 - Injection & XSS)
    // -------------------------------------------------------------
    console.log('\n📌 [KATEGORI 2] Pengujian Serangan Injeksi (XSS & Fuzzing):');

    const xssPayloads = [
        { name: 'Script Tag', payload: '<script>alert("PWNED")</script>' },
        { name: 'Img Error Event', payload: '<img src=x onerror=alert(1)>' },
        { name: 'SVG Onload Event', payload: '<svg/onload=alert(1)>' },
        { name: 'Iframe Injection', payload: '<iframe src="javascript:alert(1)"></iframe>' },
        { name: 'HTML Quote Breakout', payload: '"><script>alert(document.cookie)</script>' }
    ];

    for (const x of xssPayloads) {
        const uid = 'XSS' + Math.floor(Math.random() * 89999 + 10000);
        await simulateRequest('POST', '/karyawan/create', 
            `nama=${encodeURIComponent(x.payload)}&kategori=Staff+Kantor&uid_rfid=${uid}&upah_harian=0&tarif_lembur=30000`, 
            'auth_user=superadmin');

        const resCheck = await simulateRequest('GET', '/karyawan?tab=aktif', null, 'auth_user=superadmin');
        const isNotExecuting = !resCheck.body.includes(x.payload);
        const isSafelyEscaped = resCheck.body.includes('&lt;') || resCheck.body.includes('&gt;') || resCheck.body.includes('&quot;');
        assertTest(`Payload XSS "${x.name}" berhasil dinetralkan`, isNotExecuting && isSafelyEscaped);
    }

    // -------------------------------------------------------------
    // KATEGORI 3: PATH TRAVERSAL & EXPOSURE FILE SENSITIF (A05 - Security Misconfig)
    // -------------------------------------------------------------
    console.log('\n📌 [KATEGORI 3] Pengujian Directory / Path Traversal:');

    const traversalUrls = [
        '/../package.json',
        '/..%2fpackage.json',
        '/images/../../package.json',
        '/images/../../../.env',
        '/database/storage.json',
        '/__url=/../server.js'
    ];

    for (const tUrl of traversalUrls) {
        const resTraverse = await simulateRequest('GET', tUrl, null, '');
        const isBlocked = resTraverse.statusCode === 403 || resTraverse.statusCode === 404 || resTraverse.statusCode === 302;
        const noSensitiveLeak = !resTraverse.body.includes('"name": "sistem-absensi-jaya-kedhaton"') &&
                                !resTraverse.body.includes('DB_PASSWORD') &&
                                !resTraverse.body.includes('SamarindaJK');
        assertTest(`Percobaan akses path traversal "${tUrl}" ditangkal`, isBlocked && noSensitiveLeak);
    }

    // -------------------------------------------------------------
    // KATEGORI 4: INTEGRITAS DATA & TAMPERING LOGIKA BISNIS (Business Logic Attacks)
    // -------------------------------------------------------------
    console.log('\n📌 [KATEGORI 4] Pengujian Manipulasi Nilai Finansial & Duplikasi UID:');

    // 4.1 Input Nilai Finansial Negatif (Upah & Lembur Minus)
    const minusUid = 'MINUS' + Math.floor(Math.random() * 89999 + 10000);
    await simulateRequest('POST', '/karyawan/create', 
        `nama=TesterMinus&kategori=Pekerja+Harian&uid_rfid=${minusUid}&upah_harian=-150000&tarif_lembur=-50000`, 
        'auth_user=superadmin');

    const currentStorage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const minusRecord = (currentStorage.karyawanAktif || []).find(k => k.uid === minusUid);
    assertTest('Pencegahan nilai gaji/upah negatif (Otomatis diamankan ke >= 0)', 
        minusRecord && minusRecord.upahHarian >= 0 && minusRecord.tarifLembur >= 0);

    // 4.2 Injeksi UID Duplikat yang Sudah Dipakai
    const dupUid = '53492607'; // UID milik Dimas Arya Kedhaton
    const resDup = await simulateRequest('POST', '/karyawan/create', 
        `nama=KloningDimas&kategori=Staff+Kantor&uid_rfid=${dupUid}&upah_harian=0&tarif_lembur=30000`, 
        'auth_user=superadmin');
    assertTest('Pencegahan tabrakan UID RFID duplikat (Ditolak ke err_uid_duplikat)', 
        resDup.statusCode === 302 && resDup.headers['location']?.includes('err_uid_duplikat'));

    // 4.3 Menghapus ID Arbitrer / Non-Existent
    const resDelBogus = await simulateRequest('POST', '/karyawan/delete', 'id=99999999', 'auth_user=superadmin');
    assertTest('Penghapusan ID palsu ditolak (Mengembalikan err_not_found)', 
        resDelBogus.statusCode === 302 && resDelBogus.headers['location']?.includes('err_not_found'));

    // 4.4 SQL / Command Injection Strings dalam Parameter Input
    const sqlPayload = "' UNION SELECT * FROM users --";
    const sqlUid = 'SQL' + Math.floor(Math.random() * 89999 + 10000);
    await simulateRequest('POST', '/karyawan/create', 
        `nama=${encodeURIComponent(sqlPayload)}&kategori=Staff+Kantor&uid_rfid=${sqlUid}&upah_harian=0&tarif_lembur=30000`, 
        'auth_user=superadmin');
    const checkSql = await simulateRequest('GET', '/karyawan?tab=aktif', null, 'auth_user=superadmin');
    assertTest('Parameter SQL Injection dinetralkan tanpa error database', 
        checkSql.statusCode === 200 && checkSql.body.includes('&#39; UNION SELECT'));

    // 4.5 Extreme Buffer Fuzzing (Nama Sangat Panjang 5000 karakter)
    const longString = 'A'.repeat(5000);
    const longUid = 'LONG' + Math.floor(Math.random() * 89999 + 10000);
    const resLong = await simulateRequest('POST', '/karyawan/create', 
        `nama=${encodeURIComponent(longString)}&kategori=Staff+Kantor&uid_rfid=${longUid}&upah_harian=0&tarif_lembur=30000`, 
        'auth_user=superadmin');
    assertTest('Server mampu menangani string raksasa (5.000 karakter) tanpa crash', 
        resLong.statusCode === 302);

    // 4.6 Prototype Pollution Attack pada REST API JSON
    const resProto = await simulateRequest('POST', '/api/transaksi', 
        '{"__proto__": {"isAdmin": true}, "nama": "HackerTrx"}', 
        'auth_user=superadmin');
    const isPolluted = ({}).isAdmin === true;
    assertTest('Kebal terhadap Prototype Pollution Attack pada REST API JSON', 
        !isPolluted && (resProto.statusCode === 200 || resProto.statusCode === 400));

    // 4.7 Malformed JSON Fuzzing
    const resMalformed = await simulateRequest('POST', '/api/transaksi', 
        '{ broken json: 123, invalid!! }', 
        'auth_user=superadmin');
    assertTest('Server menangani Malformed JSON secara elegan (HTTP 500/400 tanpa unhandled exception crash)', 
        resMalformed.statusCode === 500 || resMalformed.statusCode === 400);

    // -------------------------------------------------------------
    // KATEGORI 5: AUDIT TRAIL LOGGING FORENSIK
    // -------------------------------------------------------------
    console.log('\n📌 [KATEGORI 5] Pengujian Forensik & Pencatatan Rekam Jejak Audit:');

    // Coba login hacker dengan password salah
    await simulateRequest('POST', '/login', 'username=attacker&password=wrongpassword', '');
    const updatedStorage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const auditLogs = updatedStorage.auditLogs || [];
    const attackLog = auditLogs.find(l => l.aksi === 'LOGIN_GAGAL' && l.username === 'attacker');
    assertTest('Serangan percobaan login ilegal terekam di Log Audit Keamanan', 
        !!attackLog && attackLog.keterangan.includes('gagal'));

    // Kembalikan database ke snapshot steril
    fs.writeFileSync(storagePath, initialStorageSnapshot, 'utf8');
    require('./src/db/storage').loadFromDisk();

    console.log('\n================================================================');
    console.log(`📊 REKAPITULASI HASIL AUDIT KEAMANAN:`);
    console.log(`   - Total Pengujian Keamanan : ${totalTests}`);
    console.log(`   - Berhasil Ditangkal (PASS) : ${passedTests}`);
    console.log(`   - Kerentanan Ditemukan (FAIL) : ${failedTests}`);
    console.log(`   - Skor Ketahanan Sistem      : ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('================================================================');

    if (failedTests === 0) {
        console.log('🌟 SISTEM TERBUKTI TANGGUH TERHADAP SELURUH SERANGAN PENGUJIAN!');
    }
}

runSecurityTests();
