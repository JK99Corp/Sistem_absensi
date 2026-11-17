/**
 * Utility & Helper Functions
 * PT. Jaya Kedhaton Enterprise System
 */

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatRupiahNum(n) {
    const num = Number(n);
    return 'Rp ' + (isNaN(num) ? 0 : num).toLocaleString('id-ID');
}

function cleanIp(ip) {
    return (ip || '127.0.0.1').replace('::ffff:', '');
}

/**
 * Enterprise Safe Request Body Reader
 * Guards against Denial-of-Service (DoS) memory exhaustion by enforcing maxBytes (default 2MB)
 */
function readRequestBody(req, maxBytes = 2 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        let body = '';
        let length = 0;
        let aborted = false;

        req.on('data', chunk => {
            if (aborted) return;
            length += chunk.length;
            if (length > maxBytes) {
                aborted = true;
                const err = new Error('Payload Too Large');
                err.statusCode = 413;
                reject(err);
                if (typeof req.destroy === 'function') req.destroy();
                return;
            }
            body += chunk;
        });

        req.on('end', () => {
            if (!aborted) resolve(body);
        });

        req.on('error', err => {
            if (!aborted) reject(err);
        });
    });
}

module.exports = {
    escapeHtml,
    formatRupiahNum,
    cleanIp,
    readRequestBody
};
