/**
 * Karyawan Controller (Thin HTTP Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { getKaryawanList, createKaryawan, archiveKaryawan, restoreKaryawan } = require('../services/karyawan.service');
const { renderKaryawanView } = require('../views/karyawan.view');

function renderKaryawan(tab = 'aktif', notifMsg = '', currentUser = null, notifType = 'success') {
    return renderKaryawanView(
        tab,
        notifMsg,
        currentUser,
        notifType,
        dummyData.karyawanAktif || [],
        dummyData.karyawanArsip || []
    );
}

function handleCreateKaryawan(req, res, currentUser, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const result = createKaryawan(params, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=aktif&msg=${result.code}` });
        res.end();
    });
}

function handleDeleteKaryawan(req, res, currentUser, clientIp, targetId) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const id = targetId || parseInt(params.get('id'));
        const result = archiveKaryawan(id, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=aktif&msg=${result.code}` });
        res.end();
    });
}

function handleRestoreKaryawan(req, res, currentUser, clientIp, targetId) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const id = targetId || parseInt(params.get('id'));
        const result = restoreKaryawan(id, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=arsip&msg=${result.code}` });
        res.end();
    });
}

module.exports = {
    renderKaryawan,
    handleCreateKaryawan,
    handleDeleteKaryawan,
    handleRestoreKaryawan
};
