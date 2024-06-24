const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConnection = require("../user/database/database.js").getConnection();
const sendEmail = require("../util/send_email.js");

const secretKey = "your_secret_key";

async function forgetUserController(req, res) {
  if (req.method === "POST") {
    await controllerForget(req, res);
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
  }
}

async function controllerForget(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    try {
      const user = JSON.parse(body);
      const [rows] = await dbConnection
        .promise()
        .query("SELECT password FROM users WHERE email = ?", [user.email]);
      if (rows.length > 0) {
        const token = jwt.sign({ email: user.email }, secretKey, {
          expiresIn: "1h",
        });
        const resetUrl = `http://127.0.0.1:3000/reset-password/${token}`;
        sendEmail(
          user.email,
          "Password Reset",
          `You requested a password reset. Click here to reset your password: ${resetUrl}`
        );

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Password reset link has been sent to your email.");
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("This email does not exist! Please register!");
      }
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  });
}

async function controllerResetPassword(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const data = JSON.parse(body);
    const { token, password } = data;

    try {
      const decoded = jwt.verify(token, secretKey);
      const email = decoded.email;

      const [rows] = await dbConnection
        .promise()
        .query("SELECT id FROM users WHERE email = ?", [email]);
      if (rows.length === 0) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid token");
        return;
      }

      const userId = rows[0].id;
      const hashedPassword = await bcrypt.hash(password, 10);

      await dbConnection
        .promise()
        .query("UPDATE users SET password = ? WHERE id = ?", [
          hashedPassword,
          userId,
        ]);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Password has been reset successfully");
    } catch (error) {
      console.error(error);
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid or expired token");
    }
  });
}

module.exports = { forgetUserController, controllerResetPassword };
