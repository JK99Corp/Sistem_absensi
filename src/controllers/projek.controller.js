/**
 * Laporan Pengeluaran Proyek Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { getAgregasiProyek } = require('../services/projek.service');
const { renderLaporanProyekView } = require('../views/projek.view');

function renderLaporanProyek(filterProjek = '', currentUser = null) {
    const listProyek = getAgregasiProyek();
    return renderLaporanProyekView(listProyek, filterProjek, currentUser);
}

module.exports = {
    renderLaporanProyek,
    getAgregasiProyek
};
