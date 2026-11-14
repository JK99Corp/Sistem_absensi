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
    return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function cleanIp(ip) {
    return (ip || '127.0.0.1').replace('::ffff:', '');
}

module.exports = {
    escapeHtml,
    formatRupiahNum,
    cleanIp
};
