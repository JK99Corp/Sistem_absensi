/**
 * Upah & Form Transaksi Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const fs = require('fs');
const path = require('path');
const { dummyData } = require('../db/storage');
const { escapeHtml, formatRupiahNum } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

function renderUpah(filterKategori = '', currentUser = null) {
    const upahHtmlPath = path.join(__dirname, '..', '..', 'preview', 'upah.html');
    if (fs.existsSync(upahHtmlPath)) {
        let html = fs.readFileSync(upahHtmlPath, 'utf8');
        if (currentUser) {
            html = html.replace(/<p class="text-sm font-bold text-slate-800 leading-tight truncate">.*?<\/p>/,
                `<p class="text-sm font-bold text-slate-800 leading-tight truncate">${escapeHtml(currentUser.nama || currentUser.username)}</p>`);
            html = html.replace(/<p class="text-\[11px\] font-semibold text-slate-500 capitalize">.*?<\/p>/,
                `<p class="text-[11px] font-semibold text-slate-500 capitalize">${escapeHtml(currentUser.roleLabel || currentUser.role)}</p>`);
        }
        // Sinkronisasi data proyek, pekerja, dan transaksi terkini dari database
        if (dummyData && dummyData.daftarProjek && dummyData.daftarProjek.length > 0) {
            html = html.replace(/const DAFTAR_PROJEK = \[.*?\];/s, `const DAFTAR_PROJEK = ${JSON.stringify(dummyData.daftarProjek)};`);
        }
        if (dummyData && dummyData.transaksiUpah && dummyData.transaksiUpah.length > 0) {
            html = html.replace(/let transaksiList = \[.*?\];/s, `let transaksiList = ${JSON.stringify(dummyData.transaksiUpah)};`);
        }
        if (dummyData && dummyData.karyawanAktif && dummyData.karyawanAktif.length > 0) {
            const listPekerjaDb = dummyData.karyawanAktif.map(k => ({
                k: k.kode || k.uid || `JK-${k.id}`,
                n: k.nama,
                p: (k.posisi || (k.kategori === 'Staff Kantor' ? 'STAFF KANTOR' : 'TUKANG')).toUpperCase()
            }));
            html = html.replace(/const DAFTAR_PEKERJA = \[.*?\];/s, `const DAFTAR_PEKERJA = ${JSON.stringify(listPekerjaDb)};`);
            html = html.replace(/<span id="badgeTotalMasterPekerja">.*?<\/span>/, `<span id="badgeTotalMasterPekerja">${listPekerjaDb.length} Pekerja Terdaftar</span>`);
        }
        return html;
    }

    let list = dummyData.karyawanUpah;
    if (filterKategori) {
        list = list.filter(k => k.kategori === filterKategori);
    }

    let grandTotal = 0;
    const rows = list.map(p => {
        const isHarian = (p.kategori === 'Pekerja Harian');
        const subPokok = isHarian ? (p.hariKerja * p.pokok) : p.pokok;
        const subLembur = p.jamLembur * p.tarifLembur;
        const subTotal = subPokok + subLembur;
        grandTotal += subTotal;

        const katBadge = isHarian
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>';

        const ketPokok = isHarian ? 'Per hari kerja' : 'Gaji pokok bulanan';

        return `
            <tr class="hover:bg-slate-50 transition-colors row-pekerja" 
                data-id="${p.id}" 
                data-tipe="${p.tipe || (isHarian ? 'harian' : 'bulanan')}"
                data-kategori="${escapeHtml(p.kategori)}">
                <td class="px-5 py-4">
                    <p class="text-base font-bold text-slate-900">${escapeHtml(p.nama)}</p>
                    <span class="text-xs font-mono text-slate-400">UID: ${escapeHtml(p.uid)}</span>
                </td>

                <td class="px-4 py-4">${katBadge}</td>

                <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-sm">
                        <span class="hari-kerja">${p.hariKerja}</span>&nbsp;Hari
                    </span>
                </td>

                <td class="px-4 py-4 text-center">
                    <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold text-sm">
                        <span class="jam-lembur">${p.jamLembur}</span>&nbsp;Jam
                    </span>
                </td>

                <td class="px-5 py-4">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-xs">Rp</span>
                        <input type="number" step="5000"
                               value="${p.pokok}"
                               class="input-pokok w-36 pl-9 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none bg-white shadow-sm"
                               oninput="hitungBaris(this)">
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5">${ketPokok}</span>
                </td>

                <td class="px-5 py-4">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-xs">Rp</span>
                        <input type="number" step="5000"
                               value="${p.tarifLembur}"
                               class="input-tarif-lembur w-32 pl-9 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none bg-white shadow-sm"
                               oninput="hitungBaris(this)">
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5">Per jam</span>
                </td>

                <td class="px-5 py-4 text-right">
                    <span class="text-sm font-bold text-amber-700 total-lembur-display">
                        ${formatRupiahNum(subLembur)}
                    </span>
                </td>

                <td class="px-5 py-4 text-right bg-slate-50">
                    <span class="text-base font-extrabold text-teal-800 total-gaji-display">
                        ${formatRupiahNum(subTotal)}
                    </span>
                </td>

                <td class="px-4 py-4 text-center">
                    <button type="button"
                            data-nama="${escapeHtml(p.nama)}"
                            data-uid="${escapeHtml(p.uid)}"
                            data-kategori="${escapeHtml(p.kategori)}"
                            onclick="bukaSlip(this)"
                            class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer">
                        <i class="fas fa-file-invoice"></i> Slip
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const totalJamLemburSemua = list.reduce((a, b) => a + b.jamLembur, 0);

    const content = `
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Form Transaksi Karyawan</h2>
                <p class="text-base text-slate-500 mt-0.5">
                    Perhitungan gaji pokok dan upah lembur otomatis untuk Staff Kantor & Pekerja Harian
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span class="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm">
                    <i class="fas fa-calendar-alt mr-1.5 text-slate-400"></i> Periode: ${dummyData.periode}
                </span>
                <button onclick="window.print()" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg text-sm shadow transition-colors inline-flex items-center gap-2 cursor-pointer">
                    <i class="fas fa-print"></i> Cetak Rekap
                </button>
            </div>
        </div>

        <!-- Ketentuan Jam Kerja (Rapi & Simpel) -->
        <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span class="text-slate-600">Pekerja Harian: <strong class="text-slate-800">Masuk maks. 07:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span class="text-slate-600">Staff Kantor: <strong class="text-slate-800">Masuk maks. 08:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span class="text-slate-600">Pulang Normal: <strong class="text-slate-800">17:00 – 17:30</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span class="text-slate-600">Lembur: <strong class="text-slate-800">Tap pulang > 17:30</strong> (Staff & Harian)</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Karyawan</p>
                <p class="text-3xl font-extrabold text-slate-800 mt-1">${list.length} Orang</p>
                <p class="text-xs text-slate-400 mt-1">Staff Kantor & Pekerja Harian</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Jam Lembur Terakumulasi</p>
                <p class="text-3xl font-extrabold text-amber-600 mt-1">
                    ${totalJamLemburSemua} Jam
                </p>
                <p class="text-xs text-slate-400 mt-1">Otomatis dari jam tap pulang > 17:30</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <p class="text-sm font-medium text-slate-500">Total Estimasi Pembayaran</p>
                <p class="text-3xl font-extrabold text-teal-700 mt-1" id="grandTotalDisplay">
                    ${formatRupiahNum(grandTotal)}
                </p>
                <p class="text-xs text-slate-400 mt-1">Gaji/Upah Pokok + Total Lembur</p>
            </div>
        </div>

        <!-- Filter Tab Kategori -->
        <div class="flex items-center gap-2 mb-4">
            <a href="/upah" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!filterKategori ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                Semua (${dummyData.karyawanUpah.length})
            </a>
            <a href="/upah?kategori=Staff+Kantor" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterKategori === 'Staff Kantor' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                <i class="fas fa-briefcase mr-1 text-xs"></i> Staff Kantor
            </a>
            <a href="/upah?kategori=Pekerja+Harian" 
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterKategori === 'Pekerja Harian' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                <i class="fas fa-hammer mr-1 text-xs"></i> Pekerja Harian
            </a>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 class="text-base font-bold text-slate-800">Daftar Upah Pokok & Lembur</h3>
                    <p class="text-xs text-slate-500">Nominal upah pokok dan tarif lembur dapat disesuaikan langsung oleh staf keuangan</p>
                </div>
                <span class="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full font-medium">
                    <i class="fas fa-calculator text-teal-600 mr-1"></i> Perhitungan Otomatis
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full" id="tabelUpah">
                    <thead>
                        <tr class="bg-slate-700 text-white text-xs uppercase tracking-wider">
                            <th class="px-5 py-4 text-left">Nama Karyawan</th>
                            <th class="px-4 py-4 text-left">Kategori</th>
                            <th class="px-4 py-4 text-center">Kehadiran</th>
                            <th class="px-4 py-4 text-center">Jam Lembur</th>
                            <th class="px-5 py-4 text-left">Gaji / Upah Pokok</th>
                            <th class="px-5 py-4 text-left">Tarif Lembur / Jam</th>
                            <th class="px-5 py-4 text-right">Total Lembur</th>
                            <th class="px-5 py-4 text-right bg-slate-800">Total Diterima</th>
                            <th class="px-4 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL SLIP GAJI & LEMBUR -->
        <div id="modalSlip" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-800 relative">
                <button onclick="tutupSlip()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">
                    <i class="fas fa-times"></i>
                </button>

                <div class="text-center pb-4 border-b border-dashed border-slate-200">
                    <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" class="w-16 h-16 mx-auto object-contain mb-2">
                    <h4 class="text-xl font-bold text-slate-900 leading-tight">JAYA KEDHATON</h4>
                    <p class="text-xs text-slate-500 uppercase tracking-wide mt-0.5">SLIP PEMBAYARAN GAJI & LEMBUR</p>
                    <p class="text-xs text-slate-400 font-mono mt-1">Periode: ${dummyData.periode}</p>
                </div>

                <div class="py-4 space-y-2 text-sm border-b border-dashed border-slate-200">
                    <div class="flex justify-between">
                        <span class="text-slate-500">Nama Karyawan:</span>
                        <span class="font-bold text-slate-800" id="slipNama">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Kategori:</span>
                        <span class="font-semibold text-slate-700" id="slipKategori">-</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">UID Kartu:</span>
                        <span class="font-mono text-slate-600" id="slipUid">-</span>
                    </div>
                </div>

                <div class="py-4 space-y-2.5 text-sm border-b border-dashed border-slate-200">
                    <div class="flex justify-between font-semibold">
                        <span class="text-slate-700" id="slipLabelPokok">Gaji / Upah Pokok:</span>
                        <span class="text-slate-900" id="slipSubtotalPokok">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500 pl-2">
                        <span id="slipRincianPokok">-</span>
                    </div>
                    <div class="flex justify-between font-semibold pt-1">
                        <span class="text-slate-700">Upah Lembur:</span>
                        <span class="text-amber-700" id="slipSubtotalLembur">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-500 pl-2">
                        <span id="slipRincianLembur">-</span>
                    </div>
                </div>

                <div class="pt-4 pb-4">
                    <div class="flex justify-between items-center bg-teal-50 p-3.5 rounded-xl border border-teal-200">
                        <div>
                            <p class="text-xs text-teal-700 font-bold uppercase tracking-wider">Total Diterima</p>
                            <p class="text-2xl font-extrabold text-teal-900" id="slipTotalGaji">Rp 0</p>
                        </div>
                        <i class="fas fa-hand-holding-dollar text-3xl text-teal-600"></i>
                    </div>
                </div>

                <div class="flex gap-3 pt-2">
                    <button type="button" onclick="window.print()" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow transition-colors cursor-pointer">
                        <i class="fas fa-print mr-1.5"></i> Cetak Slip Ini
                    </button>
                    <button type="button" onclick="tutupSlip()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer">
                        Tutup
                    </button>
                </div>
            </div>
        </div>

        <script>
            function formatRupiah(angka) {
                return 'Rp ' + Number(angka).toLocaleString('id-ID');
            }

            function hitungBaris(el) {
                const row = el.closest('tr');
                const tipe = row.dataset.tipe;
                const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                const totalLembur = jamLembur * tarifLembur;
                const totalPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                const totalGaji = totalPokok + totalLembur;

                row.querySelector('.total-lembur-display').innerText = formatRupiah(totalLembur);
                row.querySelector('.total-gaji-display').innerText = formatRupiah(totalGaji);

                hitungGrandTotal();
            }

            function hitungGrandTotal() {
                let totalSemua = 0;
                document.querySelectorAll('#tabelUpah .row-pekerja').forEach(row => {
                    const tipe = row.dataset.tipe;
                    const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                    const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                    const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                    const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                    const totalPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                    const totalLembur = jamLembur * tarifLembur;
                    totalSemua += (totalPokok + totalLembur);
                });
                document.getElementById('grandTotalDisplay').innerText = formatRupiah(totalSemua);
            }

            function bukaSlip(btn) {
                const nama = btn.dataset.nama;
                const uid = btn.dataset.uid;
                const kategori = btn.dataset.kategori;
                const row = btn.closest('tr');
                const tipe = row.dataset.tipe;
                const hariKerja = parseInt(row.querySelector('.hari-kerja').innerText.trim()) || 0;
                const jamLembur = parseInt(row.querySelector('.jam-lembur').innerText.trim()) || 0;
                const pokokInput = parseFloat(row.querySelector('.input-pokok').value) || 0;
                const tarifLembur = parseFloat(row.querySelector('.input-tarif-lembur').value) || 0;

                const subPokok = (tipe === 'harian') ? (hariKerja * pokokInput) : pokokInput;
                const subLembur = jamLembur * tarifLembur;
                const totalGaji = subPokok + subLembur;

                document.getElementById('slipNama').innerText = nama;
                document.getElementById('slipKategori').innerText = kategori;
                document.getElementById('slipUid').innerText = uid;

                if (tipe === 'harian') {
                    document.getElementById('slipLabelPokok').innerText = 'Upah Pokok Harian:';
                    document.getElementById('slipRincianPokok').innerText = hariKerja + ' Hari × ' + formatRupiah(pokokInput);
                } else {
                    document.getElementById('slipLabelPokok').innerText = 'Gaji Pokok Bulanan:';
                    document.getElementById('slipRincianPokok').innerText = 'Gaji Pokok Tetap (' + hariKerja + ' Hari Masuk)';
                }

                document.getElementById('slipSubtotalPokok').innerText = formatRupiah(subPokok);
                document.getElementById('slipRincianLembur').innerText = jamLembur + ' Jam × ' + formatRupiah(tarifLembur) + ' / jam';
                document.getElementById('slipSubtotalLembur').innerText = formatRupiah(subLembur);
                document.getElementById('slipTotalGaji').innerText = formatRupiah(totalGaji);

                document.getElementById('modalSlip').classList.remove('hidden');
            }

            function tutupSlip() {
                document.getElementById('modalSlip').classList.add('hidden');
            }
        </script>
    `;

    return renderLayout('Form Transaksi', 'upah', content, currentUser);
}

module.exports = {
    renderUpah
};
