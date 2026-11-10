const server = require('../server.js');

module.exports = (req, res) => {
    try {
        const parsed = new URL(req.url, 'http://localhost');
        const originalUrl = parsed.searchParams.get('__url');
        if (originalUrl) {
            parsed.searchParams.delete('__url');
            const remaining = parsed.searchParams.toString();
            // Normalisasi agar tidak double slash '//'
            const cleanPath = originalUrl.startsWith('/') ? originalUrl : '/' + originalUrl;
            req.url = cleanPath + (remaining ? '?' + remaining : '');
        }
    } catch (_) {}
    server.emit('request', req, res);
};
