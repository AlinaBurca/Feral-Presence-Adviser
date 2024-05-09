const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

http.createServer((req, res) => {
    let baseDirectory;


    if (req.url.startsWith('/backend/')) {
        baseDirectory = path.join(__dirname, '..');
    } else {
        baseDirectory = path.join(__dirname, '..', 'frontend');
    }

    const resolvedBase = path.resolve(baseDirectory);
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    const fileLocation = path.join(resolvedBase, safeSuffix);



    fs.readFile(fileLocation, function (err, data) {
        if (err) {
            console.error('Failed to read the file:', err);
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        const mimeType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif'
        };

        const ext = path.parse(fileLocation).ext;
        res.writeHead(200, { 'Content-Type': mimeType[ext] || 'application/octet-stream' });
        res.end(data);
    });

    router(req, res);


}).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const createconnection = require('./user/database/database.js');
const dbConnection = createconnection.createconnection();
const router = require('./router.js');




