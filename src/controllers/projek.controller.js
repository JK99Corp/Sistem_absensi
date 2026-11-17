/**
 * Laporan Pengeluaran Proyek Controller
 * PT. Jaya Kedhaton Enterprise System
 * Agregasi seluruh pengeluaran pekerja (Upah Pokok, Lembur, Makan, Transport, Insentif) per Proyek
 */

const { dummyData } = require('../db/storage');
const { escapeHtml, formatRupiahNum } = require('../utils/helpers');
const { renderLayout } = require('../views/layout');

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

    // Urutkan: proyek yang memiliki pengeluaran terlebih dahulu (descending), lalu abjad
    listProyek.sort((a, b) => {
        if (b.totalPengeluaran !== a.totalPengeluaran) {
            return b.totalPengeluaran - a.totalPengeluaran;
        }
        return a.nama.localeCompare(b.nama);
    });

    return listProyek;
}

function renderLaporanProyek(filterProjek = '', currentUser = null) {
    const listProyek = getAgregasiProyek();

    let grandPengeluaran = 0;
    let grandHari = 0;
    let grandLembur = 0;
    let grandPokok = 0;
    let grandBiayaLembur = 0;
    let grandMakan = 0;
    let grandTransport = 0;
    let grandInsentif = 0;
    let proyekTerbesar = { nama: '-', total: 0 };
    let totalProyekAktif = 0;

    listProyek.forEach(p => {
        grandPengeluaran += p.totalPengeluaran;
        grandHari += p.totalHari;
        grandLembur += p.totalLembur;
        grandPokok += p.totalPokok;
        grandBiayaLembur += p.totalBiayaLembur;
        grandMakan += p.totalMakan;
        grandTransport += p.totalTransport;
        grandInsentif += p.totalInsentif;
        if (p.totalPengeluaran > 0) {
            totalProyekAktif++;
            if (p.totalPengeluaran > proyekTerbesar.total) {
                proyekTerbesar = { nama: p.nama, total: p.totalPengeluaran };
            }
        }
    });

    // Filter jika ada parameter query
    let filteredList = listProyek;
    if (filterProjek) {
        filteredList = listProyek.filter(p => p.nama.toUpperCase().includes(filterProjek.toUpperCase()));
    }

    // Bangun baris tabel
    let nomor = 1;
    const rowsHtml = filteredList.map(p => {
        const isAktif = p.totalPengeluaran > 0;
        const statusBadge = isAktif
            ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Aktif (${p.pekerjaList.length} Pekerja)</span>
               </span>`
            : `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                Belum Ada Alokasi
               </span>`;

        const tombolRincian = isAktif
            ? `<button type="button" onclick="bukaModalRincianProyek('${escapeHtml(p.nama)}')"
                       class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer">
                    <i class="fas fa-users-viewfinder"></i> Rincian Pekerja
               </button>`
            : `<span class="text-xs text-slate-400 font-semibold italic">-</span>`;

        return `
            <tr class="hover:bg-slate-50 transition-colors border-b border-slate-200 row-proyek-item" data-nama="${escapeHtml(p.nama.toUpperCase())}">
                <td class="p-3.5 text-center font-bold text-slate-400 bg-slate-50/50">${nomor++}</td>
                <td class="p-3.5">
                    <div class="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2">
                        <i class="fas fa-building text-teal-600 text-xs"></i>
                        <span>${escapeHtml(p.nama)}</span>
                    </div>
                    <div class="mt-1">${statusBadge}</div>
                </td>
                <td class="p-3.5 text-center font-semibold text-slate-800">
                    <span class="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs font-bold">${p.totalHari} hr</span>
                </td>
                <td class="p-3.5 text-center font-semibold text-slate-800">
                    <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-mono text-xs font-bold">${p.totalLembur} jam</span>
                </td>
                <td class="p-3.5 text-right font-semibold text-slate-700 text-xs">
                    ${formatRupiahNum(p.totalPokok)}
                </td>
                <td class="p-3.5 text-right font-semibold text-slate-700 text-xs">
                    ${formatRupiahNum(p.totalBiayaLembur)}
                </td>
                <td class="p-3.5 text-right font-semibold text-slate-700 text-xs">
                    ${p.totalMakan > 0 ? formatRupiahNum(p.totalMakan) : '-'}
                </td>
                <td class="p-3.5 text-right font-semibold text-teal-700 text-xs bg-teal-50/30">
                    ${p.totalTransport > 0 ? formatRupiahNum(p.totalTransport) : '-'}
                </td>
                <td class="p-3.5 text-right font-semibold text-indigo-700 text-xs bg-indigo-50/30">
                    ${p.totalInsentif > 0 ? formatRupiahNum(p.totalInsentif) : '-'}
                </td>
                <td class="p-3.5 text-right font-black text-slate-950 bg-emerald-50 text-sm md:text-base">
                    ${formatRupiahNum(p.totalPengeluaran)}
                </td>
                <td class="p-3.5 text-center no-print">
                    ${tombolRincian}
                </td>
            </tr>
        `;
    }).join('');

    const optionsDropdownProjek = listProyek.map(p => {
        const sel = (filterProjek && filterProjek.toUpperCase() === p.nama.toUpperCase()) ? 'selected' : '';
        return `<option value="${escapeHtml(p.nama)}" ${sel}>${escapeHtml(p.nama)} (${p.pekerjaList.length} pekerja)</option>`;
    }).join('');

    const content = `
    <div class="space-y-6">

        <!-- HEADER HALAMAN -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        <i class="fas fa-city"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight">Laporan Pengeluaran Per Proyek</h2>
                        <p class="text-xs text-slate-500 font-medium">Rekapitulasi beban biaya pekerja (Upah Pokok, Lembur, Makan, Transport &amp; Insentif) per lokasi proyek</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2.5 no-print">
                <button type="button" onclick="eksporLaporanProyekCsv()" 
                        class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs md:text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors">
                    <i class="fas fa-file-excel"></i> Ekspor CSV / Excel
                </button>
                <button type="button" onclick="window.print()" 
                        class="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-xl text-xs md:text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors">
                    <i class="fas fa-print"></i> Cetak Laporan
                </button>
            </div>
        </div>

        <!-- 4 KPI CARDS UTAMA -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Biaya Pengeluaran -->
            <div class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-md">
                <div class="flex items-center justify-between opacity-80 mb-2">
                    <span class="text-xs uppercase font-extrabold tracking-wider">Total Biaya Pekerja</span>
                    <i class="fas fa-money-bill-wave text-lg"></i>
                </div>
                <div class="text-2xl lg:text-3xl font-black tracking-tight">${formatRupiahNum(grandPengeluaran)}</div>
                <span class="text-[11px] text-emerald-100 font-semibold mt-1 block">${totalProyekAktif} Proyek Berjalan Periode Ini</span>
            </div>

            <!-- Proyek Pengeluaran Tertinggi -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between text-slate-400 mb-2">
                    <span class="text-xs uppercase font-bold tracking-wider">Beban Tertinggi</span>
                    <i class="fas fa-trophy text-amber-500 text-lg"></i>
                </div>
                <div class="text-lg font-black text-slate-900 truncate" title="${escapeHtml(proyekTerbesar.nama)}">${escapeHtml(proyekTerbesar.nama)}</div>
                <span class="text-xs text-rose-600 font-extrabold mt-1 block">${formatRupiahNum(proyekTerbesar.total)}</span>
            </div>

            <!-- Total Hari Kerja (Mandays) -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between text-slate-400 mb-2">
                    <span class="text-xs uppercase font-bold tracking-wider">Total Hari Kerja</span>
                    <i class="fas fa-calendar-check text-teal-600 text-lg"></i>
                </div>
                <div class="text-2xl font-black text-slate-900">${grandHari} <span class="text-sm font-bold text-slate-500">Hari (Mandays)</span></div>
                <span class="text-[11px] text-slate-500 font-medium mt-1 block">Akumulasi seluruh tim lapangan</span>
            </div>

            <!-- Total Jam Lembur -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between text-slate-400 mb-2">
                    <span class="text-xs uppercase font-bold tracking-wider">Total Jam Lembur</span>
                    <i class="fas fa-clock text-amber-600 text-lg"></i>
                </div>
                <div class="text-2xl font-black text-slate-900">${grandLembur} <span class="text-sm font-bold text-slate-500">Jam</span></div>
                <span class="text-[11px] text-amber-700 font-semibold mt-1 block">Biaya lembur: ${formatRupiahNum(grandBiayaLembur)}</span>
            </div>
        </div>

        <!-- FILTER & PENCARIAN -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-3 text-slate-400 text-xs"></i>
                    <input type="text" id="inputCariProyek" oninput="filterTabelProyek()"
                           placeholder="Cari nama proyek..."
                           class="pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-600 w-64 shadow-2xs">
                </div>

                <div class="flex items-center gap-2">
                    <label for="selectFilterProjek" class="text-xs font-bold text-slate-600 uppercase">Pilih Proyek:</label>
                    <select id="selectFilterProjek" onchange="onSelectFilterProjek(this.value)"
                            class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-600 cursor-pointer">
                        <option value="">-- SEMUA PROYEK JAYA KEDHATON --</option>
                        ${optionsDropdownProjek}
                    </select>
                </div>
            </div>

            <div class="text-xs font-bold text-slate-500">
                Menampilkan <span id="labelJumlahTampilProyek" class="text-teal-700 font-extrabold">${filteredList.length}</span> Proyek
            </div>
        </div>

        <!-- TABEL RINCIAN PENGELUARAN PER PROYEK -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse" style="min-width: 1100px;">
                    <thead>
                        <tr class="bg-slate-800 text-white text-xs uppercase tracking-wider font-extrabold">
                            <th class="p-3.5 text-center w-12">No</th>
                            <th class="p-3.5">Nama Proyek</th>
                            <th class="p-3.5 text-center">Hari Kerja</th>
                            <th class="p-3.5 text-center">Lembur</th>
                            <th class="p-3.5 text-right">Upah Pokok</th>
                            <th class="p-3.5 text-right">Biaya Lembur</th>
                            <th class="p-3.5 text-right">Uang Makan</th>
                            <th class="p-3.5 text-right text-teal-300 bg-slate-900">Transport</th>
                            <th class="p-3.5 text-right text-indigo-300 bg-slate-900">Insentif</th>
                            <th class="p-3.5 text-right text-emerald-300 bg-emerald-950">Total Beban</th>
                            <th class="p-3.5 text-center w-36 no-print">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyProyekPengeluaran" class="text-sm divide-y divide-slate-100">
                        ${rowsHtml}
                    </tbody>
                    <tfoot>
                        <tr class="bg-slate-200 font-black text-slate-900 text-sm md:text-base border-t-2 border-slate-400">
                            <td colspan="2" class="p-4 uppercase bg-slate-300 tracking-wider text-right">
                                Grand Total Pengeluaran Seluruh Proyek:
                            </td>
                            <td class="p-4 text-center font-mono font-black">${grandHari} hr</td>
                            <td class="p-4 text-center font-mono font-black">${grandLembur} j</td>
                            <td class="p-4 text-right text-xs font-bold">${formatRupiahNum(grandPokok)}</td>
                            <td class="p-4 text-right text-xs font-bold">${formatRupiahNum(grandBiayaLembur)}</td>
                            <td class="p-4 text-right text-xs font-bold">${formatRupiahNum(grandMakan)}</td>
                            <td class="p-4 text-right text-xs font-bold text-teal-800 bg-teal-100/60">${formatRupiahNum(grandTransport)}</td>
                            <td class="p-4 text-right text-xs font-bold text-indigo-800 bg-indigo-100/60">${formatRupiahNum(grandInsentif)}</td>
                            <td class="p-4 text-right text-emerald-950 bg-emerald-200 text-base md:text-lg font-black">${formatRupiahNum(grandPengeluaran)}</td>
                            <td class="p-4 bg-slate-300 no-print"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <!-- MODAL RINCIAN PEKERJA PER PROYEK -->
        <div id="modalRincianProyek" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden overflow-y-auto p-3 sm:p-4 md:p-6 flex justify-center items-start sm:items-center">
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-5 sm:p-6 text-slate-800 relative my-auto border-2 border-slate-300">
                <button onclick="tutupModalRincianProyek()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer no-print w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                    &times;
                </button>

                <div class="flex items-center gap-3 pb-3 border-b-2 border-slate-800 mb-4">
                    <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        <i class="fas fa-building"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-slate-900" id="modalProyekJudul">Rincian Pengeluaran Proyek</h3>
                        <p class="text-xs text-slate-500 font-semibold" id="modalProyekSubjudul">Daftar alokasi upah pekerja</p>
                    </div>
                </div>

                <div class="overflow-x-auto max-h-96 overflow-y-auto border border-slate-200 rounded-xl mb-4">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead class="bg-slate-800 text-white font-extrabold uppercase sticky top-0">
                            <tr>
                                <th class="p-2.5 text-center w-10">No</th>
                                <th class="p-2.5">Pekerja</th>
                                <th class="p-2.5">Posisi</th>
                                <th class="p-2.5 text-center">Hari</th>
                                <th class="p-2.5 text-center">Lembur</th>
                                <th class="p-2.5 text-right">Makan</th>
                                <th class="p-2.5 text-right">Transport</th>
                                <th class="p-2.5 text-right">Insentif</th>
                                <th class="p-2.5 text-right">Subtotal Upah</th>
                            </tr>
                        </thead>
                        <tbody id="modalTbodyPekerja" class="divide-y divide-slate-100 text-slate-800">
                            <!-- Diisi JS -->
                        </tbody>
                    </table>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span class="text-xs font-bold text-slate-600">Total Pengeluaran Proyek Ini:</span>
                    <span class="text-lg font-black text-emerald-800" id="modalProyekTotal">-</span>
                </div>

                <div class="mt-4 flex justify-end gap-3 no-print">
                    <button type="button" onclick="tutupModalRincianProyek()" 
                            class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>

    </div>

    <!-- SCRIPT CLIENT DATA AGREGASI & INTERAKSI -->
    <script>
        const DATA_PROYEK_AGREGASI = ${JSON.stringify(listProyek)};

        function formatRp(val) {
            return 'Rp ' + Math.round(Number(val) || 0).toLocaleString('id-ID');
        }

        function filterTabelProyek() {
            const q = (document.getElementById('inputCariProyek').value || '').trim().toUpperCase();
            const rows = document.querySelectorAll('.row-proyek-item');
            let visibleCount = 0;
            rows.forEach(r => {
                const nama = r.getAttribute('data-nama') || '';
                if (!q || nama.includes(q)) {
                    r.style.display = '';
                    visibleCount++;
                } else {
                    r.style.display = 'none';
                }
            });
            const badge = document.getElementById('labelJumlahTampilProyek');
            if (badge) badge.innerText = visibleCount;
        }

        function onSelectFilterProjek(val) {
            const input = document.getElementById('inputCariProyek');
            if (input) {
                input.value = val;
                filterTabelProyek();
            }
        }

        function bukaModalRincianProyek(namaProjek) {
            const p = DATA_PROYEK_AGREGASI.find(item => item.nama.toUpperCase() === namaProjek.toUpperCase());
            if (!p) return;

            document.getElementById('modalProyekJudul').innerText = p.nama;
            document.getElementById('modalProyekSubjudul').innerText = \`Total \${p.pekerjaList.length} Pekerja Dialokasikan ke Proyek Ini\`;
            document.getElementById('modalProyekTotal').innerText = formatRp(p.totalPengeluaran);

            const tbody = document.getElementById('modalTbodyPekerja');
            tbody.innerHTML = '';

            p.pekerjaList.forEach((w, idx) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50';
                tr.innerHTML = \`
                    <td class="p-2.5 text-center font-bold text-slate-400 bg-slate-50/50">\${idx + 1}</td>
                    <td class="p-2.5">
                        <span class="font-extrabold text-slate-900">\${w.nama}</span>
                        \${w.kode && w.kode !== '-' ? \`<span class="ml-1 text-[10px] font-mono bg-slate-800 text-white px-1.5 py-0.5 rounded font-bold">\${w.kode}</span>\` : ''}
                    </td>
                    <td class="p-2.5 uppercase font-semibold text-slate-600">\${w.posisi}</td>
                    <td class="p-2.5 text-center font-bold">\${w.hari} hr</td>
                    <td class="p-2.5 text-center font-bold">\${w.lembur} j</td>
                    <td class="p-2.5 text-right font-medium">\${w.makan > 0 ? formatRp(w.makan) : '-'}</td>
                    <td class="p-2.5 text-right font-medium text-teal-800">\${w.transport > 0 ? formatRp(w.transport) : '-'}</td>
                    <td class="p-2.5 text-right font-medium text-indigo-800">\${w.insentif > 0 ? formatRp(w.insentif) : '-'}</td>
                    <td class="p-2.5 text-right font-black text-emerald-800">\${formatRp(w.subTotal)}</td>
                \`;
                tbody.appendChild(tr);
            });

            document.getElementById('modalRincianProyek').classList.remove('hidden');
        }

        function tutupModalRincianProyek() {
            document.getElementById('modalRincianProyek').classList.add('hidden');
        }

        function eksporLaporanProyekCsv() {
            if (!DATA_PROYEK_AGREGASI || DATA_PROYEK_AGREGASI.length === 0) {
                alert('Tidak ada data pengeluaran proyek untuk diekspor!');
                return;
            }

            const baris = [];
            baris.push(['NO', 'NAMA PROYEK', 'STATUS', 'JUMLAH PEKERJA', 'TOTAL HARI (MANDAYS)', 'TOTAL LEMBUR (JAM)', 'BIAYA POKOK (RP)', 'BIAYA LEMBUR (RP)', 'UANG MAKAN (RP)', 'TRANSPORT (RP)', 'INSENTIF (RP)', 'TOTAL PENGELUARAN (RP)']);

            let no = 1;
            DATA_PROYEK_AGREGASI.forEach(p => {
                baris.push([
                    no++,
                    \`"\${(p.nama || '').replace(/"/g, '""')}"\`,
                    p.totalPengeluaran > 0 ? 'AKTIF' : 'BELUM ADA ALOKASI',
                    p.pekerjaList.length,
                    p.totalHari,
                    p.totalLembur,
                    p.totalPokok,
                    p.totalBiayaLembur,
                    p.totalMakan,
                    p.totalTransport,
                    p.totalInsentif,
                    p.totalPengeluaran
                ]);
            });

            const csvContent = '\\uFEFF' + baris.map(r => r.join(';')).join('\\r\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`Laporan_Pengeluaran_Proyek_JayaKedhaton_\${new Date().toISOString().slice(0, 10)}.csv\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
    `;

    return renderLayout('Pengeluaran Proyek', 'laporan-proyek', content, currentUser);
}

module.exports = {
    renderLaporanProyek,
    getAgregasiProyek
};
