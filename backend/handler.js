const registerUserController = require('./controllers/controllerRegister');
const loginUserController = require('./controllers/controllerLogin');
const forgetUserController = require('./controllers/controllerForget').forgetUserController;
const resetPasswordController = require('./controllers/controllerForget').controllerResetPassword;
const editUserController = require('./controllers/controllerEdit');


function registerPage(req, res) {
    if (req.method === 'POST') {
        registerUserController(req, res);
    }
}

function loginPage(req, res) {
    if (req.method === 'POST') {
        loginUserController(req, res);
    }
}

function forgetPage(req, res) {
    if (req.method === 'POST') {
        forgetUserController(req, res);
    }
}

function resetPage(req, res) {
    if (req.method === 'POST') {
        resetPasswordController(req, res);
    }
}
function editPage(req, res) {
    editUserController(req, res);

}
module.exports = { registerPage, loginPage, forgetPage, resetPage, editPage };
