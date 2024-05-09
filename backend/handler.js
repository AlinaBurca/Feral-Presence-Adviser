const registerUserController = require('./controllers/controllerRegister');
function registerPage(req, res) {

    if (req.method === 'POST') {
        registerUserController(req, res);
    }

}

module.exports = registerPage;