const mysql = require("mysql2");

let connection = null;
function createconnection() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "parola25072003",
    database: "feral-presence-adviser",
  });
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  return connection;
}
function getConnection() {
  return connection;
}

module.exports = { createconnection, getConnection };
