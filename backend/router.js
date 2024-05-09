const registerPage = require('./handler.js');

function router(req, res) {
    if (req.url === '/register.html') {
        registerPage(req, res);
    }
}

module.exports = router;