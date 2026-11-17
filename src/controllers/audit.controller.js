/**
 * Audit & Security Log Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { renderAccessDeniedView, renderAuditLogView } = require('../views/audit.view');

function renderAccessDenied(currentUser) {
    return renderAccessDeniedView(currentUser);
}

function renderAuditLog(currentUser, filterAksi = '', filterUser = '') {
    let logs = dummyData.auditLogs || [];
    if (filterAksi) {
        logs = logs.filter(l => l.aksi === filterAksi);
    }
    if (filterUser) {
        logs = logs.filter(l => l.username.toLowerCase().includes(filterUser.toLowerCase()) || l.nama.toLowerCase().includes(filterUser.toLowerCase()));
    }
    return renderAuditLogView(logs, currentUser, filterAksi, filterUser);
}

module.exports = {
    renderAuditLog,
    renderAccessDenied
};
