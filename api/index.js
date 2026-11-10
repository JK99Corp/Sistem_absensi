const server = require('../server.js');

module.exports = (req, res) => {
    if (req.url && req.url.includes('debug_test')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            url: req.url,
            headers: req.headers
        }, null, 2));
        return;
    }
    server.emit('request', req, res);
};
