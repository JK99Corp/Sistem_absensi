/**
 * Rekap Mingguan View
 * PT. Jaya Kedhaton Enterprise System
 * Presentation template for weekly attendance summary
 */

const { escapeHtml } = require('../utils/helpers');
const { renderLayout } = require('./layout');

function renderRekapView(rekapList = [], periode = '', currentUser = null) {
    let noPekerja = 1;
    const rows = rekapList.map(r => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-4 text-center font-bold text-slate-400 bg-slate-50/50">${noPekerja++}</td>
            <td class="px-6 py-4 text-base font-bold text-slate-800">${escapeHtml(r.nama)}</td>
            <td class="px-6 py-4 text-sm text-slate-600">
                ${r.kategori === 'Pekerja Harian'
            ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">Pekerja Harian</span>'
            : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Staff Kantor</span>'}
            </td>
            <td class="px-4 py-4 text-sm font-semibold text-slate-700">${escapeHtml(r.projek || '-')}</td>
            <td class="px-4 py-4 text-center">
                ${r.senin === 'Hadir'
            ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>'
            : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.selasa === 'Hadir' ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>' : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.rabu === 'Hadir' ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>' : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.kamis === 'Hadir' ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>' : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.jumat === 'Hadir' ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>' : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-4 py-4 text-center">
                ${r.sabtu === 'Hadir' ? '<span class="inline-flex items-center px-2.5 py-1 rounded bg-green-100 text-green-700 font-bold text-xs">Hadir</span>' : '<span class="text-slate-300 font-bold">-</span>'}
            </td>
            <td class="px-5 py-4 text-center bg-teal-50">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-base shadow-sm">
                    ${r.total}
                </span>
            </td>
        </tr>
    `).join('');

    const content = `
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-800">Rekap Mingguan</h2>
            <p class="text-base text-slate-500 mt-1">Laporan rekap kehadiran 2 kategori karyawan per minggu (Sesuai format Excel)</p>
        </div>

        <div class="bg-teal-50 border border-teal-200 rounded-xl px-6 py-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <p class="text-base text-teal-900 font-medium">
                <i class="fas fa-calendar-alt mr-2 text-teal-600"></i>
                Periode: <span class="font-bold text-teal-950">${escapeHtml(periode)}</span>
            </p>
            <div class="flex items-center gap-2.5">
                <button type="button" onclick="downloadExcelRekap()"
                        class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs md:text-sm transition-colors shadow inline-flex items-center gap-2 cursor-pointer"
                        title="Ekspor rekapitulasi kehadiran ke spreadsheet Microsoft Excel">
                    <i class="fas fa-file-excel"></i> Ekspor Laporan Kehadiran (XLSX)
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left" id="tabelRekapKehadiran">
                    <thead>
                        <tr class="bg-slate-800 text-white text-xs uppercase font-extrabold tracking-wider">
                            <th class="px-5 py-3.5 text-center w-12">No</th>
                            <th class="px-6 py-3.5">Nama Karyawan</th>
                            <th class="px-6 py-3.5">Kategori</th>
                            <th class="px-4 py-3.5">Bagian Projek</th>
                            <th class="px-4 py-3.5 text-center">Senin</th>
                            <th class="px-4 py-3.5 text-center">Selasa</th>
                            <th class="px-4 py-3.5 text-center">Rabu</th>
                            <th class="px-4 py-3.5 text-center">Kamis</th>
                            <th class="px-4 py-3.5 text-center">Jumat</th>
                            <th class="px-4 py-3.5 text-center">Sabtu</th>
                            <th class="px-5 py-3.5 text-center bg-slate-900">Total Hadir</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>

        <script>
            window.REKAP_DATA = ${JSON.stringify(rekapList)};
            window.REKAP_PERIODE = ${JSON.stringify(periode)};

            function downloadExcelRekap() {
                try {
                    const data = window.REKAP_DATA || [];
                    const periode = window.REKAP_PERIODE || '03/08/2026 - 08/08/2026';
                    const tglCetak = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                    
                    let rowsHtml = '';
                    let idx = 1;
                    let totHadirSemua = 0;

                    data.forEach(r => {
                        const total = Number(r.total) || 0;
                        totHadirSemua += total;
                        rowsHtml += \`
                            <tr>
                                <td style="text-align:center; vertical-align:middle;">\${idx++}</td>
                                <td style="font-weight:bold; vertical-align:middle;">\${r.nama || ''}</td>
                                <td style="text-align:center; vertical-align:middle;">\${r.kategori || '-'}</td>
                                <td style="vertical-align:middle;">\${r.projek || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.senin === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.senin || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.selasa === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.selasa || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.rabu === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.rabu || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.kamis === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.kamis || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.jumat === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.jumat || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; \${r.sabtu === 'Hadir' ? 'color:#15803d; font-weight:bold;' : 'color:#94a3b8;'}">\${r.sabtu || '-'}</td>
                                <td style="text-align:center; vertical-align:middle; font-weight:bold; background-color:#ecfdf5; color:#065f46; mso-number-format:'#,##0';">\${total}</td>
                            </tr>
                        \`;
                    });

                    const excelTemplate = \`
                        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                        <head>
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <!--[if gte mso 9]>
                            <xml>
                                <x:ExcelWorkbook>
                                    <x:ExcelWorksheets>
                                        <x:ExcelWorksheet>
                                            <x:Name>Rekap Kehadiran</x:Name>
                                            <x:WorksheetOptions>
                                                <x:DisplayGridlines/>
                                            </x:WorksheetOptions>
                                        </x:ExcelWorksheet>
                                    </x:ExcelWorksheets>
                                </x:ExcelWorkbook>
                            </xml>
                            <![endif]-->
                            <style>
                                table { border-collapse: collapse; width: 100%; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 10pt; }
                                th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #334155; padding: 7px 10px; text-align: center; }
                                td { border: 1px solid #cbd5e1; padding: 5px 8px; }
                                .kop-title { font-size: 13pt; font-weight: bold; color: #0f172a; }
                                .kop-sub { font-size: 10pt; color: #475569; font-weight: bold; }
                                .total-row td { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; }
                            </style>
                        </head>
                        <body>
                            <table>
                                <tr>
                                    <td colspan="11" class="kop-title">PT. JAYA KEDHATON — LAPORAN REKAP KEHADIRAN KARYAWAN</td>
                                </tr>
                                <tr>
                                    <td colspan="11" class="kop-sub">Periode: \${periode} | Tanggal Ekspor: \${tglCetak} | Total: \${data.length} Karyawan</td>
                                </tr>
                                <tr><td colspan="11"></td></tr>
                                <thead>
                                    <tr>
                                        <th>NO</th>
                                        <th>NAMA KARYAWAN</th>
                                        <th>KATEGORI</th>
                                        <th>BAGIAN PROYEK</th>
                                        <th>SENIN</th>
                                        <th>SELASA</th>
                                        <th>RABU</th>
                                        <th>KAMIS</th>
                                        <th>JUMAT</th>
                                        <th>SABTU</th>
                                        <th>TOTAL HADIR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${rowsHtml}
                                </tbody>
                                <tfoot>
                                    <tr class="total-row">
                                        <td colspan="4" style="text-align:right; font-weight:bold;">TOTAL KEHADIRAN SELURUH KARYAWAN:</td>
                                        <td colspan="6"></td>
                                        <td style="text-align:center; font-weight:bold; background-color:#d1fae5; color:#064e3b; mso-number-format:'#,##0';">\${totHadirSemua}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </body>
                        </html>
                    \`;

                    const blob = new Blob(['\\uFEFF' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
                    const safePeriode = (periode || 'Mingguan').replace(/[^a-zA-Z0-9]/g, '_');
                    const filename = \`Rekap_Kehadiran_JayaKedhaton_\${safePeriode}.xls\`;

                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, filename);
                        return;
                    }

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(() => {
                        if (link.parentNode) link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }, 3000);
                } catch (err) {
                    console.error('Gagal mengekspor Excel:', err);
                    alert('Gagal mengekspor file Excel: ' + err.message);
                }
            }
        </script>
    `;

    return renderLayout('Rekap Mingguan', 'rekap', content, currentUser);
}

module.exports = {
    renderRekapView
};
