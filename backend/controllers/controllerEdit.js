const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const dbConnection = require("../user/database/database.js").getConnection();
const sessions = require("../sessions.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function editUserController(req, res) {
  if (req.method === "POST") {
    await handleProfileUpdate(req, res);
  } else if (req.method === "GET") {
    await serveProfilePage(req, res);
  }
}

async function getUserDetails(body, res) {
  if (!sessions[body.sessionId]) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
    return;
  }

  try {
    const user = await getProfileDetails(body.email);
    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "User not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, user: user }));
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Internal Server Error" })
    );
  }
}

async function getProfileDetails(email) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT username, phone_number, address, email FROM users WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
}

async function updateProfileDetails(
  email,
  email_nou,
  fullName,
  contactNumber,
  address
) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "UPDATE users SET username = ?, phone_number = ?, address = ?, email=? WHERE email = ?",
      [fullName, contactNumber, address, email_nou, email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function serveProfilePage(req, res) {
  const filePath = path.join(__dirname, "../frontend", "edit.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("File read error:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

async function handleProfileUpdate(body, res) {
  if (!sessions[JSON.parse(body.sessionId).sessionId]) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
    return;
  }

  const parsedBody = new URLSearchParams(body);
  const fullName = parsedBody.get("name");
  const contactNumber = parsedBody.get("number");
  const email_nou = parsedBody.get("email_nou");
  const address = parsedBody.get("adress");
  try {
    const profile = await updateProfileDetails(
      body.email,
      email_nou,
      fullName,
      contactNumber,
      address
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: true, message: "Profile updated succesfully" })
    );
    return;
  } catch (error) {
    console.error("Update error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}

async function getPassword(email) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT password FROM users WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    );
  });
}
async function updatePassword(email, new_password) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [new_password, email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function handlePasswordUpdate(body, res) {
  if (!sessions[JSON.parse(body.sessionId).sessionId]) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
    return;
  }

  const parsedBody = new URLSearchParams(body);
  const password = parsedBody.get("password");
  const new_password = parsedBody.get("new_password");
  const actual_password = await getPassword(JSON.parse(body.sessionId).email);

  const parola = await bcrypt.hash(password, saltRounds);
  const isMatch = await bcrypt.compare(password, actual_password.password); ////aici compara

  const newHashedPassword = await bcrypt.hash(new_password, saltRounds);

  try {
    if (!isMatch) {
      res.writeHead(300, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: true, message: "Password deosn t match" })
      );
      return;
    } else {
      const profile = await updatePassword(
        JSON.parse(body.sessionId).email,
        newHashedPassword
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Profile updated succesfully",
        })
      );
      return;
    }
  } catch (error) {
    console.error("Update error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}

module.exports = {
  editUserController,
  getUserDetails,
  handleProfileUpdate,
  handlePasswordUpdate,
};
