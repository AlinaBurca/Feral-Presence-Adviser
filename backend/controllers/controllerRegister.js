const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require('../user/database/database.js').getConnection();

async function registerUserController(req, res) {
    switch (req.method) {
        case 'POST':
            controllerRegister(req, res);
            break;
        default:
            res.writeHead(405);
            res.end();
    }
}
async function controllerRegister(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const user = JSON.parse(body);
                user.password = await bcrypt.hash(user.password, saltRounds);

                const query = `INSERT INTO users (username, password, email, phone_number, address) VALUES (?, ?, ?, ?, ?)`;
                const values = [user.username, user.password, user.email, user.phone, user.adresa];

                dbConnection.execute(query, values, (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log("User inserted with ID:", results.insertId);
                    if (!res.headersSent) {
                        res.writeHead(201);
                        res.end("User created");
                    }
                });
            } catch (error) {
                console.error(error);
                if (!res.headersSent) {
                    res.writeHead(500);
                    res.end("Internal Server Error");
                }
            }
        });
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            res.writeHead(500);
            res.end("Internal Server Error");
        }
    }
}

/*function controllerRegister(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);

    });
}
*/
module.exports = registerUserController;