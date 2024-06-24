const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const dbConnection = require("../user/database/database.js").getConnection();
const sessions = require("../sessions.js");

async function userReportsController(req, res) {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = JSON.parse(chunk.toString());
    });
    req.on("end", async () => {
      try {
        if (sessions[body.sessionId]) {
          const email = body.email;

          if (!email) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not authenticated" }));
            return;
          }

          const [reports] = await dbConnection
            .promise()
            .query(
              "SELECT * FROM reports WHERE user_email = ?  ORDER BY created_at DESC",
              [email]
            );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(reports));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Session not found" }));
        }
      } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
  }
}

module.exports = userReportsController;
