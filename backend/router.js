const registerPage = require('./handler.js');

function router(req, res) {
    if (req.url === '/register' && req.method === 'POST') {
        registerPage(req, res);
        return true;
    }
    return false;
}

module.exports = router;
