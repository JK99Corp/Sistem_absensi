/**
 * System Constants & Initial Data Template
 * PT. Jaya Kedhaton Enterprise System
 */

const PORT = process.env.PORT || 8000;

const defaultTemplateData = {
    hadirHariIni: 5,
    karyawanAktif: 6,
    deviceAktif: 1,
    tanggalHariIni: 'Senin, 03 Agustus 2026',
    periode: '03/08/2026 - 08/08/2026',

    // Absensi hari ini dengan 2 Kategori & Status Lembur
    absensiHariIni: [
        { jamMasuk: '07:15:20', jamPulang: '19:35:10', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Lembur 2 Jam' },
        { jamMasuk: '07:22:14', jamPulang: '18:32:00', nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Lembur 1 Jam' },
        { jamMasuk: '08:22:45', jamPulang: '17:15:30', nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', device: 'KANTORJK_01', statusMasuk: 'Tepat Waktu', lembur: 'Normal (0 Jam)' },
        { jamMasuk: '08:42:10', jamPulang: '17:25:00', nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', device: 'KANTORJK_01', statusMasuk: 'Terlambat 12 Mnt', lembur: 'Normal (0 Jam)' },
        { jamMasuk: '07:45:00', jamPulang: '19:30:15', nama: 'Bambang Triyono', kategori: 'Pekerja Harian', uid: '19E873A2', device: 'KANTORJK_01', statusMasuk: 'Terlambat 15 Mnt', lembur: 'Lembur 2 Jam' }
    ],

    riwayat: [
        { tanggal: '2026-08-03', masuk: '07:15:20', pulang: '19:35:10', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', lembur: 'Lembur 2 Jam', foto: 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '07:22:14', pulang: '18:32:00', nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', device: 'KANTORJK_01', lembur: 'Lembur 1 Jam', foto: 'https://ui-avatars.com/api/?name=Slamet+Riyadi&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '08:22:45', pulang: '17:15:30', nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Dimas+Arya&background=0d9488&color=fff&size=96' },
        { tanggal: '2026-08-03', masuk: '08:42:10', pulang: '17:25:00', nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Akmal+Zaidan&background=2563eb&color=fff&size=96' },
        { tanggal: '2026-08-02', masuk: '07:20:00', pulang: '19:30:00', nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', device: 'KANTORJK_01', lembur: 'Lembur 2 Jam', foto: 'https://ui-avatars.com/api/?name=Joko+Susilo&background=f59e0b&color=fff&size=96' },
        { tanggal: '2026-08-02', masuk: '08:28:50', pulang: '17:10:00', nama: 'Anom Arya', kategori: 'Staff Kantor', uid: 'A3B7C901', device: 'KANTORJK_01', lembur: 'Normal (0 Jam)', foto: 'https://ui-avatars.com/api/?name=Anom+Arya&background=64748b&color=fff&size=96' }
    ],

    rekap: [
        { nama: 'Akmal Zaidan', kategori: 'Staff Kantor', senin: 'Hadir', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 1 },
        { nama: 'Anom Arya', kategori: 'Staff Kantor', senin: '-', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 0 },
        { nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', senin: 'Hadir', selasa: '-', rabu: '-', kamis: '-', jumat: '-', sabtu: '-', total: 1 },
        { nama: 'Joko Susilo', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: 'Hadir', total: 6 },
        { nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: '-', total: 5 },
        { nama: 'Bambang Triyono', kategori: 'Pekerja Harian', senin: 'Hadir', selasa: 'Hadir', rabu: 'Hadir', kamis: 'Hadir', jumat: 'Hadir', sabtu: 'Hadir', total: 6 }
    ],

    // Upah & Lembur untuk seluruh karyawan (Staff Kantor & Pekerja Harian)
    karyawanUpah: [
        { id: 1, nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', tipe: 'bulanan', uid: '53492607', hariKerja: 6, jamLembur: 4, pokok: 3500000, tarifLembur: 30000 },
        { id: 2, nama: 'Akmal Zaidan', kategori: 'Staff Kantor', tipe: 'bulanan', uid: '9491F306', hariKerja: 5, jamLembur: 3, pokok: 3200000, tarifLembur: 30000 },
        { id: 3, nama: 'Anom Arya', kategori: 'Staff Kantor', tipe: 'bulanan', uid: 'A3B7C901', hariKerja: 5, jamLembur: 2, pokok: 3000000, tarifLembur: 30000 },
        { id: 4, nama: 'Joko Susilo', kategori: 'Pekerja Harian', tipe: 'harian', uid: '83A192B4', hariKerja: 6, jamLembur: 8, pokok: 120000, tarifLembur: 25000 },
        { id: 5, nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', tipe: 'harian', uid: '47C201F8', hariKerja: 5, jamLembur: 5, pokok: 120000, tarifLembur: 25000 },
        { id: 6, nama: 'Bambang Triyono', kategori: 'Pekerja Harian', tipe: 'harian', uid: '19E873A2', hariKerja: 6, jamLembur: 4, pokok: 110000, tarifLembur: 25000 }
    ],
    pekerjaHarian: [
        { id: 4, nama: 'Joko Susilo', uid: '83A192B4', hariKerja: 6, jamLembur: 8, upahHarian: 120000, tarifLembur: 25000 },
        { id: 5, nama: 'Slamet Riyadi', uid: '47C201F8', hariKerja: 5, jamLembur: 5, upahHarian: 120000, tarifLembur: 25000 },
        { id: 6, nama: 'Bambang Triyono', uid: '19E873A2', hariKerja: 6, jamLembur: 4, upahHarian: 110000, tarifLembur: 25000 }
    ],

    // Karyawan Aktif
    karyawanAktif: [
        { id: 1, nama: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', uid: '53492607', noHp: '0812-3456-7890', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '01/01/2026' },
        { id: 2, nama: 'Akmal Zaidan', kategori: 'Staff Kantor', uid: '9491F306', noHp: '0812-9876-5432', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '15/01/2026' },
        { id: 3, nama: 'Anom Arya', kategori: 'Staff Kantor', uid: 'A3B7C901', noHp: '0813-1122-3344', status: 'Aktif', upahHarian: 0, tarifLembur: 0, tglGabung: '01/02/2026' },
        { id: 4, nama: 'Joko Susilo', kategori: 'Pekerja Harian', uid: '83A192B4', noHp: '0857-1234-5678', status: 'Aktif', upahHarian: 120000, tarifLembur: 25000, tglGabung: '01/07/2026' },
        { id: 5, nama: 'Slamet Riyadi', kategori: 'Pekerja Harian', uid: '47C201F8', noHp: '0858-8765-4321', status: 'Aktif', upahHarian: 120000, tarifLembur: 25000, tglGabung: '05/07/2026' },
        { id: 6, nama: 'Bambang Triyono', kategori: 'Pekerja Harian', uid: '19E873A2', noHp: '0878-9988-7766', status: 'Aktif', upahHarian: 110000, tarifLembur: 25000, tglGabung: '10/07/2026' }
    ],

    // Karyawan Arsip
    karyawanArsip: [
        { id: 7, nama: 'Sugeng Raharjo', kategori: 'Pekerja Harian', uid: 'B1287FE0', noHp: '0856-3344-5566', status: 'Diarsipkan', upahHarian: 110000, tarifLembur: 25000, tglGabung: '01/06/2026', deletedAt: '2026-07-28 16:00', keterangan: 'Selesai Proyek Harian Juli. Riwayat gaji & absensi tetap tersimpan rapi.' }
    ],

    kartu: [
        { id: 1, uid: '53492607', pemilik: 'Dimas Arya Kedhaton', kategori: 'Staff Kantor', tgl: '2026-07-15 10:30', status: 'Aktif' },
        { id: 2, uid: '9491F306', pemilik: 'Akmal Zaidan', kategori: 'Staff Kantor', tgl: '2026-07-15 10:35', status: 'Aktif' },
        { id: 3, uid: 'A3B7C901', pemilik: 'Anom Arya', kategori: 'Staff Kantor', tgl: '2026-07-16 09:00', status: 'Aktif' },
        { id: 4, uid: '83A192B4', pemilik: 'Joko Susilo', kategori: 'Pekerja Harian', tgl: '2026-07-22 08:00', status: 'Aktif' },
        { id: 5, uid: '47C201F8', pemilik: 'Slamet Riyadi', kategori: 'Pekerja Harian', tgl: '2026-07-22 08:15', status: 'Aktif' },
        { id: 6, uid: '19E873A2', pemilik: 'Bambang Triyono', kategori: 'Pekerja Harian', tgl: '2026-07-25 09:00', status: 'Aktif' }
    ],

    devices: [
        { id: 1, kode: 'KANTORJK_01', lokasi: 'Pintu Masuk Utama', tipe: 'Dual ESP32 (RFID + Cam)', ip: '192.168.1.100', aktif: '2026-08-03 19:35:10', status: 'Online' },
        { id: 2, kode: 'KANTORJK_02', lokasi: 'Pintu Belakang', tipe: 'Dual ESP32 (RFID Only)', ip: '192.168.1.101', aktif: '2026-07-30 17:00:00', status: 'Offline' }
    ],

    // Log Aktivitas Audit Keamanan (Hanya bisa dilihat oleh 2 Akun Pimpinan)
    auditLogs: [
        { id: 1001, waktu: '2026-08-03 07:10:00', username: 'superadmin', nama: 'Direktur Utama', role: 'Super Admin (Direksi)', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem melalui Portal Keamanan', ip: '192.168.1.10' },
        { id: 1002, waktu: '2026-08-03 07:15:20', username: 'KANTORJK_01', nama: 'Perangkat Pintu Utama', role: 'Perangkat IoT', aksi: 'TAP_ABSENSI', keterangan: 'Absensi masuk Joko Susilo (07:15:20) - Tepat Waktu', ip: '192.168.1.100' },
        { id: 1003, waktu: '2026-08-03 08:00:45', username: 'staf.keuangan', nama: 'Siti Aminah', role: 'Staf Keuangan', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem', ip: '192.168.1.25' },
        { id: 1004, waktu: '2026-08-03 08:30:10', username: 'staf.keuangan', nama: 'Siti Aminah', role: 'Staf Keuangan', aksi: 'CETAK_REKAP', keterangan: 'Mencetak laporan rekapitulasi upah mingguan', ip: '192.168.1.25' },
        { id: 1005, waktu: '2026-08-03 09:15:00', username: 'staf.hrd', nama: 'Rendra Bagus', role: 'Staf HRD & Personalia', aksi: 'LOGIN', keterangan: 'Berhasil login ke sistem', ip: '192.168.1.28' },
        { id: 1006, waktu: '2026-08-03 09:20:30', username: 'staf.hrd', nama: 'Rendra Bagus', role: 'Staf HRD & Personalia', aksi: 'AKSES_DITOLAK', keterangan: 'Percobaan akses tidak sah ke Log Audit Pimpinan (Otomatis ditolak sistem)', ip: '192.168.1.28' }
    ],

    transaksiUpah: []
};

module.exports = {
    PORT,
    defaultTemplateData
};
