/**
 * Dashboard Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { renderDashboardView } = require('../views/dashboard.view');

function renderDashboard(initKategori = '', initDevice = '', currentUser = null) {
    return renderDashboardView(
        dummyData.absensiHariIni || [],
        (dummyData.karyawanAktif || []).length,
        dummyData.deviceAktif || 1,
        initKategori,
        initDevice,
        currentUser
    );
}

module.exports = {
    renderDashboard
};
