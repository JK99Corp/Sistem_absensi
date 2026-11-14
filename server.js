/**
 * PT. Jaya Kedhaton Enterprise System
 * Main Server Entry Point
 * 
 * Clean, lightweight, enterprise-ready HTTP Bootstrap.
 */

const http = require('http');
const { PORT } = require('./src/config/constants');
const { handleRequest } = require('./src/routes/router');

const server = http.createServer(handleRequest);

let currentPort = PORT;

function startListen(p) {
    server.listen(p, () => {
        console.log(`\n======================================================`);
        console.log(`✨ Prototype Sistem Absensi Jaya Kedhaton Berjalan!`);
        console.log(`🌐 Buka di browser: http://localhost:${p}`);
        console.log(`======================================================\n`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${currentPort} sedang digunakan proses lain. Beralih ke port ${currentPort + 1}...`);
        currentPort++;
        setTimeout(() => startListen(currentPort), 200);
    } else {
        console.error(`\n❌ [ERROR SERVER]`, err.message);
    }
});

// Jalankan listener port hanya jika BUKAN di lingkungan Vercel Serverless
if (!process.env.VERCEL) {
    startListen(currentPort);
}

module.exports = server;
