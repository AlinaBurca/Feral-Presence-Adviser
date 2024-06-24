const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const mysql = require("mysql2");
const dbConnection = require("../user/database/database.js").getConnection();

async function cardsController(req, res) {
  if (req.method === "GET") {
    await getAnimalCards(req, res);
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
  }
}

async function getAnimalCards(req, res) {
  try {
    const [results] = await dbConnection
      .promise()
      .query(
        "SELECT id, name, addressLastSeen, image FROM reports ORDER BY created_at DESC LIMIT 16"
      );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
module.exports = cardsController;
