module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        url: req.url,
        originalUrl: req.originalUrl,
        headers: req.headers
    }, null, 2));
};
