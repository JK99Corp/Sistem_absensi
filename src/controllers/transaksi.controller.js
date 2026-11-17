/**
 * Transaksi API Controller (Thin Dispatcher)
 * PT. Jaya Kedhaton Enterprise System
 */

const { getTransaksiList, syncTransaksi, saveTransaksi, deleteTransaksi } = require('../services/transaksi.service');

function handleGetTransaksi(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data: getTransaksiList() }));
}

function handleSaveTransaksi(req, res, currentUser, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
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
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

function handleHapusTransaksi(req, res, currentUser, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const payload = JSON.parse(body);
            const result = deleteTransaksi(payload.id, currentUser, clientIp);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

module.exports = {
    handleGetTransaksi,
    handleSaveTransaksi,
    handleHapusTransaksi
};
