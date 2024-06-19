const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const createconnection = require("./user/database/database.js");
const dbConnection = createconnection.createconnection();
const router = require("./router.js");
const crypto = require("crypto");
const sessions = require("./sessions.js");
const PORT = 3001;

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}
http
  .createServer((req, res) => {
    if (router(req, res)) {
      return;
    }

    let baseDirectory = req.url.startsWith("/backend/")
      ? path.join(__dirname, "..")
      : path.join(__dirname, "..", "frontend");
    const resolvedBase = path.resolve(baseDirectory);
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, "");
    const fileLocation = path.join(resolvedBase, safeSuffix);

    fs.readFile(fileLocation, function (err, data) {
      if (err) {
        console.error("Failed to read the file:", err);
        res.writeHead(404);
        res.end("File not found");
        return;
      }

      const mimeType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
      };
      const ext = path.parse(fileLocation).ext;

      res.writeHead(200, {
        "Content-Type": mimeType[ext] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
