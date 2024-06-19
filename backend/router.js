const { registerPage, loginPage, forgetPage, resetPage, editPage } = require('./handler.js');
const fs = require('fs');
const path = require('path');
//const { getUserDetails } = require('./controllers/controllerEdit');
const sessions = require("./sessions.js")
const { editUserController, getUserDetails, handleProfileUpdate, handlePasswordUpdate } = require("./controllers/controllerEdit.js")

function router(req, res) {
    if (req.url === '/register' && req.method === 'POST') {
        registerPage(req, res);
        return true;
    }
    if (req.url === '/login' && req.method === 'POST') {
        loginPage(req, res);
        return true;
    }
    if (req.url === '/forget' && req.method === 'POST') {
        forgetPage(req, res);
        return true;
    }
    if (req.url === '/reset-password' && req.method === 'POST') {
        resetPage(req, res);
        return true;
    }
    if (req.url.startsWith('/reset-password/') && req.method === 'GET') {
        const token = req.url.split('/').pop();
        const filePath = path.join(__dirname, '..', 'frontend', 'password_reseter.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Failed to read the file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const updatedData = data.replace('{{TOKEN}}', token);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedData);
        });
        return true;
    }
    if (req.url === '/edit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body = JSON.parse(chunk.toString());
            console.log(JSON.parse(chunk.toString()));
        });
        console.log(sessions);
        req.on('end', () => {
            console.log("---inainte")
            console.log(JSON.parse(body.sessionId).sessionId);
            if (sessions[JSON.parse(body.sessionId).sessionId]) {
                console.log("---dupa");
                handleProfileUpdate(body, res);
            } else {
                res.writeHead(401);
                res.end("Unauthorized");
            }
        });
        return true;
    }
    if (req.url === '/edit_password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body = JSON.parse(chunk.toString());
        });
        req.on('end', () => {
            if (sessions[JSON.parse(body.sessionId).sessionId]) {
                handlePasswordUpdate(body, res);
            } else {
                res.writeHead(401);
                res.end("Unauthorized");
            }
        });
        return true;
    }
    if (req.url === '/api/get-user-details' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body = JSON.parse(chunk.toString());

        });
        req.on('end', () => {

            if (sessions[body.sessionId]) {
                console.log("salut");
                getUserDetails(body, res);
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
            }
        });
        return true;

    }

    return false;
}

module.exports = router;
