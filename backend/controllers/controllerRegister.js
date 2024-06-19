const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require("../user/database/database.js").getConnection();
const sendEmail = require("../util/send_email.js");

async function registerUserController(req, res) {
  if (req.method === "POST") {
    await controllerRegister(req, res);
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
  }
}

async function controllerRegister(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const user = JSON.parse(body);
      console.log("user: ");
      console.log(user);
      console.log(user.email);
      const [rows] = await dbConnection
        .promise()
        .query("SELECT email FROM users WHERE email = ?", [user.email]);
      console.log(rows.length);
      if (rows.length > 0) {
        if (!res.headersSent) {
          res.writeHead(409);
          res.end("Email already exists");
          return;
        }
      } else if (user.isValid) {
        user.password = await bcrypt.hash(user.password, saltRounds);
        await dbConnection
          .promise()
          .execute(
            "INSERT INTO users (username, password, email, phone_number, address) VALUES (?, ?, ?, ?, ?)",
            [user.username, user.password, user.email, user.phone, user.adresa]
          );
        sendEmail(
          user.email,
          "FePA",
          "Hi! There, You have recently visited  our website and entered your email. Please follow the given link to verify your email Thanks"
        );
        if (!res.headersSent) {
          res.writeHead(201);
          res.end("User created");
          return;
        }
      } else {
        if (!res.headersSent) {
          res.writeHead(403);
          res.end("Is not a valid form");
          return;
        }
      }
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
    }
  });
}

module.exports = registerUserController;
