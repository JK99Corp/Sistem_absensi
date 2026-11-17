/**
 * Rekap Kehadiran Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { renderRekapView } = require('../views/rekap.view');

function renderRekap(currentUser = null) {
    return renderRekapView(dummyData.rekap || [], dummyData.periode || '', currentUser);
}

module.exports = {
    renderRekap
};
