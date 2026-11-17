/**
 * Transaksi API Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { getTransaksiList, syncTransaksi, saveTransaksi, deleteTransaksi } = require('../services/transaksi.service');
const { readRequestBody } = require('../utils/helpers');

function handleGetTransaksi(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: getTransaksiList() }));
}

function handleSaveTransaksi(req, res, currentUser, clientIp) {
    readRequestBody(req)
        .then(body => {
            const payload = JSON.parse(body);
            if (payload.transaksiSemua && Array.isArray(payload.transaksiSemua)) {
                const result = syncTransaksi(payload.transaksiSemua, currentUser, clientIp);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
                return;
            }

            const result = saveTransaksi(payload, currentUser, clientIp);
            if (!result.success) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            const status = err.statusCode || (err instanceof SyntaxError ? 400 : 500);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
}

function handleHapusTransaksi(req, res, currentUser, clientIp) {
    readRequestBody(req)
        .then(body => {
            const payload = JSON.parse(body);
            const result = deleteTransaksi(payload.id, currentUser, clientIp);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch(err => {
            const status = err.statusCode || (err instanceof SyntaxError ? 400 : 500);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
}

module.exports = {
    handleGetTransaksi,
    handleSaveTransaksi,
    handleHapusTransaksi
};
