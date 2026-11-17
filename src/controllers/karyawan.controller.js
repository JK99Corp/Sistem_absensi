/**
 * Karyawan Controller (Thin HTTP Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { dummyData } = require('../db/storage');
const { getKaryawanList, createKaryawan, archiveKaryawan, restoreKaryawan } = require('../services/karyawan.service');
const { renderKaryawanView } = require('../views/karyawan.view');
const { readRequestBody } = require('../utils/helpers');

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
    readRequestBody(req).then(body => {
        const params = new URLSearchParams(body);
        const result = createKaryawan(params, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=aktif&msg=${result.code}` });
        res.end();
    }).catch(() => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
    });
}

function handleDeleteKaryawan(req, res, currentUser, clientIp, targetId) {
    readRequestBody(req).then(body => {
        const params = new URLSearchParams(body);
        const id = targetId || parseInt(params.get('id'));
        const result = archiveKaryawan(id, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=aktif&msg=${result.code}` });
        res.end();
    }).catch(() => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
    });
}

function handleRestoreKaryawan(req, res, currentUser, clientIp, targetId) {
    readRequestBody(req).then(body => {
        const params = new URLSearchParams(body);
        const id = targetId || parseInt(params.get('id'));
        const result = restoreKaryawan(id, currentUser, clientIp);
        res.writeHead(302, { 'Location': `/karyawan?tab=arsip&msg=${result.code}` });
        res.end();
    }).catch(() => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
    });
}

module.exports = {
    renderKaryawan,
    handleCreateKaryawan,
    handleDeleteKaryawan,
    handleRestoreKaryawan
};
