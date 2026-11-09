const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('📄 Membuat Laporan Simpel & Manusiawi untuk PM...');

function getBase64Image(filePath) {
    if (!fs.existsSync(filePath)) return '';
    const ext = path.extname(filePath).replace('.', '').toLowerCase();
    const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/png';
    const b64 = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${b64}`;
}

const logoBase64 = getBase64Image(path.join(__dirname, 'public', 'images', 'logo.png'));
const ssDashboard = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164754.png'));
const ssRiwayat = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164813.png'));
const ssRekap = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164847.png'));
const ssUpah = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164859.png'));
const ssKaryawan = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164909.png'));
const ssModalTambah = getBase64Image(path.join(__dirname, 'report_assets', 'Screenshot 2026-11-04 164935.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Sistem Absensi Jaya Kedhaton</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
        }

        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            font-size: 11pt;
        }

        .page {
            page-break-after: always;
            height: 265mm;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .page:last-child {
            page-break-after: avoid;
        }

        /* HEADER & FOOTER */
        .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0d9488;
            padding-bottom: 8px;
            margin-bottom: 16px;
        }

        .page-header .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .page-header img {
            width: 38px;
            height: 38px;
            object-fit: contain;
        }

        .page-header .text h3 {
            margin: 0;
            font-size: 12pt;
            font-weight: 700;
            color: #0f172a;
        }

        .page-header .text p {
            margin: 0;
            font-size: 8.5pt;
            color: #64748b;
        }

        .page-header .page-num {
            font-size: 9pt;
            font-weight: 600;
            color: #0d9488;
        }

        /* COVER */
        .cover-page {
            text-align: center;
            padding-top: 35mm;
        }

        .cover-logo {
            width: 130px;
            height: 130px;
            margin: 0 auto 20px auto;
            object-fit: contain;
        }

        .cover-title {
            font-size: 24pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 10px 0;
            line-height: 1.25;
        }

        .cover-subtitle {
            font-size: 13pt;
            color: #0d9488;
            font-weight: 600;
            margin-bottom: 25px;
        }

        .cover-desc {
            font-size: 11pt;
            color: #475569;
            max-width: 520px;
            margin: 0 auto 40px auto;
            line-height: 1.6;
        }

        .cover-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            max-width: 460px;
            margin: 0 auto;
            text-align: left;
        }

        .cover-box table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
        }

        .cover-box td {
            padding: 6px 0;
        }

        .cover-box td.label {
            color: #64748b;
            width: 40%;
        }

        .cover-box td.val {
            font-weight: 700;
            color: #0f172a;
        }

        /* SECTION STYLES */
        .feature-title {
            font-size: 15pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
        }

        .feature-sub {
            font-size: 10pt;
            color: #64748b;
            margin: 0 0 14px 0;
        }

        /* IMAGE CONTAINER */
        .img-container {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 6px;
            margin-bottom: 14px;
            text-align: center;
        }

        .img-container img {
            width: 100%;
            height: auto;
            max-height: 125mm;
            object-fit: contain;
            border-radius: 6px;
            display: block;
        }

        /* EXPLANATION BOX */
        .explanation-card {
            background: #f8fafc;
            border-left: 4px solid #0d9488;
            border-radius: 0 8px 8px 0;
            padding: 12px 16px;
            margin-bottom: 12px;
        }

        .explanation-card h4 {
            margin: 0 0 6px 0;
            font-size: 11pt;
            color: #0f172a;
            font-weight: 700;
        }

        .explanation-card p {
            margin: 0 0 8px 0;
            font-size: 10pt;
            color: #334155;
            line-height: 1.5;
        }

        .explanation-card ul {
            margin: 0;
            padding-left: 20px;
            font-size: 10pt;
            color: #334155;
        }

        .explanation-card li {
            margin-bottom: 4px;
        }

        .highlight {
            font-weight: 700;
            color: #0d9488;
        }

        .badge-pill {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 8.5pt;
            font-weight: 700;
        }

        /* SUMMARY FOOTER */
        .summary-box {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            padding: 14px 18px;
            margin-top: 15px;
        }

        .summary-box h4 {
            margin: 0 0 6px 0;
            color: #065f46;
            font-size: 11pt;
        }

        .summary-box p {
            margin: 0;
            color: #047857;
            font-size: 9.5pt;
            line-height: 1.5;
        }
    </style>
</head>
<body>

    <!-- ================= HALAMAN 1: COVER ================= -->
    <div class="page cover-page">
        <img src="${logoBase64}" alt="Logo Jaya Kedhaton" class="cover-logo">
        <h1 class="cover-title">Laporan Sistem Absensi Digital</h1>
        <div class="cover-subtitle">Jaya Kedhaton (Kedhaton Group)</div>
        
        <p class="cover-desc">
            Dokumen rangkuman tampilan aplikasi dan penjelasan fitur utama untuk bahan review bersama Project Manager (PM) dan tim manajemen.
        </p>

        <div class="cover-box">
            <table>
                <tr>
                    <td class="label">Nama Proyek:</td>
                    <td class="val">Sistem Absensi Jaya Kedhaton</td>
                </tr>
                <tr>
                    <td class="label">Hardware:</td>
                    <td class="val">Dual-ESP32 (RFID + Kamera)</td>
                </tr>
                <tr>
                    <td class="label">Ditujukan ke:</td>
                    <td class="val">Project Manager (PM)</td>
                </tr>
                <tr>
                    <td class="label">Status:</td>
                    <td class="val" style="color: #0d9488;">Siap Dipresentasikan (100%)</td>
                </tr>
                <tr>
                    <td class="label">Tanggal:</td>
                    <td class="val">November 2026</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- ================= HALAMAN 2: DASHBOARD ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 2 / 7</div>
        </div>

        <h2 class="feature-title">1. Tampilan Dashboard Utama</h2>
        <p class="feature-sub">Halaman pertama yang dilihat staf saat membuka sistem absensi</p>

        <div class="img-container">
            <img src="${ssDashboard}" alt="Dashboard">
        </div>

        <div class="explanation-card">
            <h4>Penjelasan Singkat & Cara Menjelaskannya ke PM:</h4>
            <ul>
                <li><strong>Banner Jam Kerja di Atas:</strong> Langsung menampilkan aturan jam masuk biar jelas untuk semua orang:
                    <br>&bull; <span class="highlight">Pekerja Harian:</span> Masuk paling lambat jam <strong>07:30 WIB</strong>.
                    <br>&bull; <span class="highlight">Staff Kantor:</span> Masuk paling lambat jam <strong>08:30 WIB</strong>.
                    <br>&bull; Jam pulang normal 17:00 – 17:30 WIB. Lewat dari 17:30 dihitung <strong>lembur</strong>.
                </li>
                <li><strong>3 Kotak Informasi Angka:</strong> Menunjukkan jumlah yang hadir hari ini (5 orang), total karyawan aktif (6 orang), dan status alat absensi yang sedang online.</li>
                <li><strong>Dropdown Filter Kategori (Sudah Berfungsi):</strong> Begitu staf memilih <em>Staff Kantor</em> atau <em>Pekerja Harian</em> di dropdown, daftar tabel dan angka hadir di kartu langsung berubah otomatis tanpa perlu refresh halaman.</li>
            </ul>
        </div>
    </div>

    <!-- ================= HALAMAN 3: RIWAYAT ABSENSI ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 3 / 7</div>
        </div>

        <h2 class="feature-title">2. Tampilan Riwayat Absensi & Foto Kamera</h2>
        <p class="feature-sub">Melihat bukti jam tap dan jepretan foto dari mesin Dual-ESP32</p>

        <div class="img-container">
            <img src="${ssRiwayat}" alt="Riwayat Absensi">
        </div>

        <div class="explanation-card">
            <h4>Penjelasan Singkat & Cara Menjelaskannya ke PM:</h4>
            <ul>
                <li><strong>Batas Masuk Tertulis Rapi:</strong> Di samping jam kedatangan, ada penanda batas masuk (07:30 untuk harian dan 08:30 untuk staf) jadi admin langsung tahu apakah orang tersebut telat atau tepat waktu.</li>
                <li><strong>Kolom Foto Bukti:</strong> Terkoneksi langsung dengan kamera ESP32-CAM. Setiap kali kartu ditempelkan, kamera langsung mengambil foto wajah sehingga tidak bisa ada yang titip absen.</li>
                <li><strong>Pencarian Tanggal:</strong> Admin bisa memilih tanggal tertentu jika ingin mengecek absensi beberapa hari yang lalu.</li>
            </ul>
        </div>
    </div>

    <!-- ================= HALAMAN 4: REKAP MINGGUAN ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 4 / 7</div>
        </div>

        <h2 class="feature-title">3. Tampilan Rekap Kehadiran Mingguan</h2>
        <p class="feature-sub">Laporan absensi Senin sampai Sabtu yang siap diunduh ke format Excel</p>

        <div class="img-container">
            <img src="${ssRekap}" alt="Rekap Mingguan">
        </div>

        <div class="explanation-card">
            <h4>Penjelasan Singkat & Cara Menjelaskannya ke PM:</h4>
            <ul>
                <li><strong>Tampilan Bersih Seperti Excel:</strong> Disusun rapi per nama karyawan, kategori kerja, dan kolom hari dari Senin sampai Sabtu.</li>
                <li><strong>Total Hari Hadir Otomatis:</strong> Di kolom paling kanan, sistem langsung menghitung total hari kerja karyawan pada periode tersebut.</li>
                <li><strong>Tombol Hijau "Download Excel":</strong> Sekali klik untuk mengunduh rekap mingguan menjadi file spreadsheet agar staf keuangan mudah membuat arsip fisik atau lampiran laporan bulanan.</li>
            </ul>
        </div>
    </div>

    <!-- ================= HALAMAN 5: UPAH & LEMBUR ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 5 / 7</div>
        </div>

        <h2 class="feature-title">4. Tampilan Upah & Perhitungan Lembur Otomatis</h2>
        <p class="feature-sub">Fitur favorit bagian keuangan untuk menghitung gaji dan upah harian</p>

        <div class="img-container">
            <img src="${ssUpah}" alt="Upah dan Lembur">
        </div>

        <div class="explanation-card">
            <h4>Penjelasan Singkat & Cara Menjelaskannya ke PM:</h4>
            <ul>
                <li><strong>Perhitungan Lembur Otomatis:</strong> Siapapun yang tap pulang di atas jam 17:30 WIB, jam lemburnya langsung dihitung oleh sistem tanpa perlu hitung manual dengan kalkulator.</li>
                <li><strong>Mendukung 2 Jenis Pembayaran:</strong>
                    <br>&bull; <span class="highlight">Staff Kantor:</span> Gaji pokok bulanan tetap + uang lembur.
                    <br>&bull; <span class="highlight">Pekerja Harian:</span> (Hari hadir &times; upah per hari) + uang lembur.
                </li>
                <li><strong>Bisa Diedit Fleksibel:</strong> Jika ada penyesuaian tarif, staf keuangan bisa langsung mengetik angka baru di kolom dan total uang yang diterima langsung terhitung seketika.</li>
                <li><strong>Tombol Cetak Slip:</strong> Setiap karyawan ada tombol cetak slip kecil lengkap dengan logo Jaya Kedhaton untuk tanda terima uang.</li>
            </ul>
        </div>
    </div>

    <!-- ================= HALAMAN 6: DATA KARYAWAN & ARSIP ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 6 / 7</div>
        </div>

        <h2 class="feature-title">5. Data Karyawan & Bagian Arsip (Soft Delete)</h2>
        <p class="feature-sub">Perlindungan data agar riwayat keuangan masa lalu tidak hilang atau berantakan</p>

        <div class="img-container">
            <img src="${ssKaryawan}" alt="Data Karyawan">
        </div>

        <div class="explanation-card">
            <h4>Penjelasan Singkat & Cara Menjelaskannya ke PM:</h4>
            <ul>
                <li><strong>Tab Karyawan Aktif vs Tab Arsip:</strong> Namanya dibuat simpel sesuai permintaan yaitu <strong>Arsip</strong>. Karyawan yang sudah selesai bekerja tidak dihapus permanen, tapi dipindahkan ke Arsip.</li>
                <li><strong>Sangat Penting untuk Bagian Keuangan:</strong> Karena memakai <em>soft delete</em>, riwayat lembur dan gaji yang pernah dibayarkan ke orang tersebut di bulan-bulan lalu <strong>tetap utuh 100%</strong> dan pembukuan kantor tidak akan selisih/berantakan.</li>
                <li><strong>Bisa Dipulihkan Kapan Saja:</strong> Jika pekerja harian yang diarsipkan dipanggil kembali untuk proyek baru, admin cukup klik tombol <em>Pulihkan dari Arsip</em> dan orang tersebut langsung aktif kembali.</li>
            </ul>
        </div>
    </div>

    <!-- ================= HALAMAN 7: TAMBAH KARYAWAN & CARA JALANKAN ================= -->
    <div class="page">
        <div class="page-header">
            <div class="brand">
                <img src="${logoBase64}" alt="Logo">
                <div class="text">
                    <h3>Sistem Absensi Jaya Kedhaton</h3>
                    <p>Laporan Fitur & Tampilan Layar</p>
                </div>
            </div>
            <div class="page-num">Halaman 7 / 7</div>
        </div>

        <h2 class="feature-title">6. Form Tambah Karyawan & Cara Menjalankannya</h2>
        <p class="feature-sub">Pendaftaran karyawan baru dan panduan singkat presentasi</p>

        <div class="img-container" style="max-height: 100mm;">
            <img src="${ssModalTambah}" alt="Form Tambah Karyawan" style="max-height: 95mm;">
        </div>

        <div class="explanation-card">
            <h4>Poin Form Tambah Karyawan:</h4>
            <ul>
                <li><strong>Simpel & Cepat:</strong> Cukup isi nama, pilih kategori (Staff Kantor atau Pekerja Harian), dan isi kode kartu RFID-nya.</li>
                <li><strong>Nilai Default Otomatis:</strong> Begitu memilih <em>Pekerja Harian</em>, upah default Rp 120.000/hari dan lembur Rp 25.000/jam langsung terisi otomatis.</li>
            </ul>
        </div>

        <div class="summary-box">
            <h4>Cara Menjalankan Saat Demo / Presentasi ke PM:</h4>
            <p>
                1. Buka folder proyek di komputer, lalu <strong>klik ganda file <code>KLIK-UNTUK-PRESENTASI.bat</code></strong>.
                <br>2. Halaman absensi akan otomatis terbuka di browser Chrome/Edge pada alamat: <strong><code>http://localhost:8000/dashboard</code></strong>.
                <br>3. Sistem sudah dites 100% lancar, tidak perlu koneksi internet luar, dan siap didemokan kapan saja.
            </p>
        </div>
    </div>

</body>
</html>`;

const htmlFilePath = path.join(__dirname, 'laporan-simpel-pm.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('✅ File HTML Laporan Simpel berhasil dibuat:', htmlFilePath);

const outputPdfPath = path.join(__dirname, 'LAPORAN_PROYEK_SISTEM_ABSENSI_JAYA_KEDHATON.pdf');
console.log('⏳ Menghasilkan PDF format A4...');

const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--print-to-pdf=${outputPdfPath}`,
    htmlFilePath
];

try {
    spawnSync(chromeExe, args, { stdio: 'inherit' });
    if (fs.existsSync(outputPdfPath)) {
        const stats = fs.statSync(outputPdfPath);
        console.log(`\n🎉 PDF BERHASIL DIBUAT:`);
        console.log(`📁 Lokasi: ${outputPdfPath}`);
        console.log(`📊 Ukuran File: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.error('❌ Gagal membuat PDF.');
    }
} catch (err) {
    console.error('❌ Error saat konversi PDF:', err.message);
}

