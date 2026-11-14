/**
 * Authentication & Audit Middleware
 * PT. Jaya Kedhaton Enterprise System
 */

const { REGISTERED_USERS } = require('../config/users');
const { dummyData, saveToDisk } = require('../db/storage');

function getCurrentUser(req) {
    try {
        const cookies = req.headers.cookie || '';
        const match = cookies.match(/auth_user=([^;]+)/);
        if (!match) return null;
        const username = decodeURIComponent(match[1]).trim();
        return REGISTERED_USERS.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    } catch (err) {
        return null;
    }
}

function addAuditLog(username, aksi, keterangan, ip = '127.0.0.1') {
    const user = REGISTERED_USERS.find(u => u.username === username) || { nama: username, roleLabel: 'Pengguna' };
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const waktu = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (!dummyData.auditLogs) dummyData.auditLogs = [];
    const newLog = {
        id: Date.now(),
        waktu,
        username,
        nama: user.nama,
        role: user.roleLabel,
        aksi,
        keterangan,
        ip: (ip || '127.0.0.1').replace('::ffff:', '')
    };
    dummyData.auditLogs.unshift(newLog);
    if (dummyData.auditLogs.length > 500) dummyData.auditLogs.pop();
    saveToDisk();
}

module.exports = {
    getCurrentUser,
    addAuditLog
};
