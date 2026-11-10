const server = require('../server.js');

module.exports = (req, res) => {
    // Di Vercel serverless functions, rewrite membuat req.url menjadi target rewrite ('/api/index.js')
    // Header 'x-matched-path' atau 'x-invoke-path' menyimpan URL asli yang diminta browser
    const matchedPath = req.headers['x-matched-path'] || req.headers['x-invoke-path'];
    if (matchedPath) {
        const qIndex = req.url.indexOf('?');
        const search = qIndex !== -1 ? req.url.slice(qIndex) : '';
        req.url = matchedPath + search;
    }
    server.emit('request', req, res);
};
