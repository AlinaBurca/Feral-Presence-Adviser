const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const dbConnection = require('../user/database/database.js').getConnection();
const sessions = require("../sessions.js");

async function loginUserController(req, res) {
    if (req.method === 'POST') {
        await controllerLogin(req, res);
    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
}

async function controllerLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        try {
            const user = JSON.parse(body);
            const [rows] = await dbConnection.promise().query('SELECT password FROM users WHERE email = ?', [user.email]);
            if (rows.length > 0) {
                const storedPassword = rows[0].password;
                const passwordIsValid = await bcrypt.compare(user.password, storedPassword);

                if (passwordIsValid) {
                    const sessionId = generateSessionId();
                    sessions[sessionId] = { email: user.email };

                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({ success: true, message: "Authentication successful", sessionId: sessionId }));
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({ success: false, message: "Invalid email or password" }));
                }
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, message: "User not found" }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
        }
    });
}

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = loginUserController;
