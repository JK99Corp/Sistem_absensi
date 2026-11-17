/**
 * Upah & Form Transaksi Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const fs = require('fs');
const path = require('path');
const { dummyData } = require('../db/storage');
const { escapeHtml } = require('../utils/helpers');
const { renderUpahFallbackView } = require('../views/upah.view');

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

        const listPekerjaDb = (dummyData && dummyData.karyawanAktif && dummyData.karyawanAktif.length > 0)
            ? dummyData.karyawanAktif.map(k => ({
                k: k.kode || k.uid || `JK-${k.id}`,
                n: k.nama,
                p: (k.posisi || (k.kategori === 'Staff Kantor' ? 'STAFF KANTOR' : 'TUKANG')).toUpperCase()
            }))
            : [];

        const serverDataScript = `
    <script>
        window.SERVER_DATA = {
            daftarProjek: ${JSON.stringify(dummyData.daftarProjek || [])},
            transaksiList: ${JSON.stringify(dummyData.transaksiUpah || [])},
            daftarPekerja: ${JSON.stringify(listPekerjaDb)}
        };
    </script>
`;
        const cacheBuster = `transaksi-upah.js?v=${Date.now()}`;
        html = html.replace(/<script src="transaksi-upah\.js.*?"><\/script>/, `${serverDataScript}    <script src="${cacheBuster}"></script>`);
        if (listPekerjaDb.length > 0) {
            html = html.replace(/<span id="badgeTotalMasterPekerja">.*?<\/span>/, `<span id="badgeTotalMasterPekerja">${listPekerjaDb.length} Pekerja Terdaftar</span>`);
        }
        return html;
    }

    let list = dummyData.karyawanUpah || [];
    if (filterKategori) {
        list = list.filter(k => k.kategori === filterKategori);
    }
    return renderUpahFallbackView(list, filterKategori, currentUser);
}

module.exports = {
    renderUpah
};
