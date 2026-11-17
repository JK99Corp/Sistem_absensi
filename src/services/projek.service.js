/**
 * Projek Service
 * PT. Jaya Kedhaton Enterprise System
 * Financial aggregation logic per construction project
 */

const { dummyData } = require('../db/storage');

function getAgregasiProyek() {
    const proyekMap = {};

    // 1. Inisialisasi seluruh proyek resmi
    (dummyData.daftarProjek || []).forEach(namaP => {
        proyekMap[namaP] = {
            nama: namaP,
            pekerjaList: [],
            totalHari: 0,
            totalLembur: 0,
            totalPokok: 0,
            totalBiayaLembur: 0,
            totalMakan: 0,
            totalTransport: 0,
            totalInsentif: 0,
            totalPengeluaran: 0
        };
    });

    // 2. Akumulasi dari transaksi pekerja (transaksiUpah)
    (dummyData.transaksiUpah || []).forEach(trx => {
        const upahPerHari = Number(trx.upahPerHari) || 0;
        const tarifLembur = upahPerHari / 8;

        (trx.projekList || []).forEach(p => {
            const namaP = (p.projek || 'PROYEK LAIN').trim();
            if (!proyekMap[namaP]) {
                proyekMap[namaP] = {
                    nama: namaP,
                    pekerjaList: [],
                    totalHari: 0,
                    totalLembur: 0,
                    totalPokok: 0,
                    totalBiayaLembur: 0,
                    totalMakan: 0,
                    totalTransport: 0,
                    totalInsentif: 0,
                    totalPengeluaran: 0
                };
            }

            const hari = Number(p.hari) || 0;
            const lembur = Number(p.lembur) || 0;
            const makan = Number(p.makan) || 0;
            const transport = Number(p.transport) || 0;
            const insentif = Number(p.insentif) || 0;
            const subPokok = hari * upahPerHari;
            const subLembur = lembur * tarifLembur;
            const subTotal = subPokok + subLembur + makan + transport + insentif;

            proyekMap[namaP].totalHari += hari;
            proyekMap[namaP].totalLembur += lembur;
            proyekMap[namaP].totalPokok += subPokok;
            proyekMap[namaP].totalBiayaLembur += subLembur;
            proyekMap[namaP].totalMakan += makan;
            proyekMap[namaP].totalTransport += transport;
            proyekMap[namaP].totalInsentif += insentif;
            proyekMap[namaP].totalPengeluaran += subTotal;

            proyekMap[namaP].pekerjaList.push({
                kode: trx.kode || '-',
                nama: trx.nama || 'Pekerja',
                posisi: trx.posisi || '-',
                hari: hari,
                lembur: lembur,
                upahPerHari: upahPerHari,
                subPokok: subPokok,
                subLembur: subLembur,
                makan: makan,
                transport: transport,
                insentif: insentif,
                subTotal: subTotal
            });
        });
    });

    const listProyek = Object.values(proyekMap);

    // Urutkan: proyek yang memiliki beban pengeluaran terlebih dahulu, lalu abjad
    listProyek.sort((a, b) => {
        if (b.totalPengeluaran !== a.totalPengeluaran) {
            return b.totalPengeluaran - a.totalPengeluaran;
        }
        return a.nama.localeCompare(b.nama);
    });

    return listProyek;
}

module.exports = {
    getAgregasiProyek
};
