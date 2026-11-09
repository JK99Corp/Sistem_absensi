# Sistem_absensi

## Sistem Absensi Digital Dual-ESP32 PT Jaya Kedhaton

Prototype website monitoring & absensi masuk untuk sistem hardware **Dual-ESP32 (RFID RC522 + Kamera ESP32-S3 OV5640)**.

Sistem dirancang dengan antarmuka yang sangat **bersih, teks besar, kontras tinggi, dan ramah pengguna** untuk memudahkan staf kantor wanita usia 40-an tahun yang awam teknologi.

---

## 🚀 Cara Cepat Membuka untuk Presentasi

Pilih salah satu opsi termudah untuk presentasi langsung di depan audiens:

### Opsi 1: Klik 1x (Paling Cepat & Otomatis)
Cukup **klik ganda (double-click)** file:
👉 **`KLIK-UNTUK-PRESENTASI.bat`**
Website akan otomatis terbuka di browser Anda (Chrome / Edge) pada `http://localhost:8000`.

### Opsi 2: Buka File HTML Langsung (Tanpa Server / Offline)
Masuk ke folder **`preview/`**, lalu klik ganda file:
👉 **`preview/dashboard.html`** atau **`preview/login.html`**

### Opsi 3: Menjalankan via Terminal (Node.js)
```bash
node server.js
```
Buka browser: `http://localhost:8000`

### Opsi 4: Menjalankan via Laravel (PHP & Composer)
Jika di komputer Anda sudah terpasang PHP dan Composer:
```bash
composer install
php artisan serve
```
Buka browser: `http://localhost:8000`

---

## 📑 Halaman Multipage yang Tersedia

1. **Dashboard (`/dashboard`)**
   - 3 Kartu Ringkasan Besar: **Hadir pada filter ini (2)**, **Karyawan aktif (3)**, **Device aktif (1)**.
   - Filter Tanggal, Kategori, dan Device.
   - Tabel absensi real-time (Jam, Nama, Kategori, UID, Device) persis seperti tangkapan layar di slide presentasi.

2. **Riwayat Absensi (`/riwayat`)**
   - Log absensi harian lengkap.
   - Kolom **Foto Bukti** otomatis dari kamera ESP32-S3 OV5640 sebagai validasi anti-titip absen.

3. **Rekap Mingguan (`/rekap`)**
   - Tabel format mingguan (Senin - Sabtu & Total Hadir) persis seperti lampiran file Excel di materi PPT.
   - Tombol **Download Excel** untuk laporan pimpinan.

4. **Data Karyawan (`/karyawan`)**
   - Daftar staf kantor yang terdaftar beserta status aktif/nonaktif dan UID RFID masing-masing.

5. **Kartu RFID (`/kartu-rfid`)**
   - Manajemen kartu RFID fisik yang terdaftar di memori alat absensi.

6. **Device Absensi (`/device`)**
   - Pemantauan status online/offline mesin absensi ESP32 Master & ESP32-S3 Cam.
   - Tombol **Live Cam** untuk simulasi live view kamera jaringan lokal.

7. **Login Page (`/login`)**
   - Halaman login minimalis dan aman untuk admin kantor.

