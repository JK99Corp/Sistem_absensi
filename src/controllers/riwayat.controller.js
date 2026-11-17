/**
 * Riwayat Absensi Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { renderRiwayatView } = require('../views/riwayat.view');

function renderRiwayat(initKategori = '', currentUser = null) {
    return renderRiwayatView(dummyData.riwayat || [], initKategori, currentUser);
}

module.exports = {
    renderRiwayat
};
