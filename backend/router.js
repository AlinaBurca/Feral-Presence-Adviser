const {
  registerPage,
  loginPage,
  forgetPage,
  resetPage,
  editPage,
  homePage,
  cardPage,
  filterAnimals,
  userReports,
} = require("./handler.js");
const fs = require("fs");
const path = require("path");
const sessions = require("./sessions.js");
const {
  editUserController,
  getUserDetails,
  handleProfileUpdate,
  handlePasswordUpdate,
} = require("./controllers/controllerEdit.js");
const {
  getWeeklyReports,
  getReportsBySpecies,
  getReportsByDangerAndBehavior,
  getReportsByCity,
} = require("./controllers/controllerStatistic.js");
const dbConnection =
  require("../backend/user/database/database.js").getConnection();
const { generateRSSFeed } = require("./rssGenerator.js");
const url = require("url");
const getLastReports = (callback) => {
  const query = "SELECT * FROM reports ORDER BY created_at DESC LIMIT 3";
  dbConnection.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

const getUsernameByEmail = (email, callback) => {
  dbConnection.query(
    "SELECT username FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      if (results.length > 0) {
        return callback(null, results[0].username);
      } else {
        return callback(null, null);
      }
    }
  );
};

function router(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  if (req.url === "/rss" && req.method === "GET") {
    getLastReports((err, reports) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        return;
      }

      const feed = generateRSSFeed(reports);
      res.writeHead(200, { "Content-Type": "application/rss+xml" });
      res.end(feed);
    });
    return true;
  }

  if (pathName.startsWith("/delete-report/") && req.method === "DELETE") {
    const reportId = pathName.split("/").pop();

    dbConnection.query(
      "DELETE FROM reports WHERE id = ?",
      [reportId],
      (err, results) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to delete report" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }
    );
    return true;
  }

  if (pathName === "/api/usersAdmin" && req.method === "GET") {
    dbConnection.query(
      "SELECT * FROM users WHERE email <> 'admin@gmail.com' ",
      (err, results) => {
        if (err) {
          console.error("Error fetching users:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to fetch users" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    );
    return true;
  }

  if (pathName === "/api/reportsAdmin" && req.method === "GET") {
    dbConnection.query("SELECT * FROM reports", (err, results) => {
      if (err) {
        console.error("Error fetching reports:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch reports" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    });
    return true;
  }

  if (pathName.startsWith("/api/usersAdmin") && req.method === "DELETE") {
    const userId = pathName.split("/").pop();

    dbConnection.query(
      "DELETE FROM reports WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to delete reports" }));
          return;
        }

        dbConnection.query(
          "DELETE FROM users WHERE id = ?",
          [userId],
          (err, results) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to delete user" }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          }
        );
      }
    );
    return true;
  }

  if (pathName.startsWith("/api/reportsAdmin") && req.method === "DELETE") {
    const reportId = pathName.split("/").pop();

    dbConnection.query(
      "DELETE FROM reports WHERE id = ?",
      [reportId],
      (err, results) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to delete report" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }
    );
    return true;
  }

  if (req.url === "/index") {
    homePage(req, res);
    return true;
  }
  if (req.url === "/api/reports") {
    homePage(req, res);
    return true;
  }
  if (req.url.startsWith("/animal-details")) {
    const animalId = new URLSearchParams(
      req.url.slice(req.url.indexOf("?"))
    ).get("id");
    cardPage(req, res, animalId);
    return true;
  }
  if (req.url == "/filter") {
    filterAnimals(req, res);
    return true;
  }
  if (req.url == "/user-reports") {
    userReports(req, res);
    return true;
  }

  if (req.url === "/register" && req.method === "POST") {
    registerPage(req, res);
    return true;
  }
  if (req.url === "/login" && req.method === "POST") {
    loginPage(req, res);
    return true;
  }
  if (req.url === "/forget" && req.method === "POST") {
    forgetPage(req, res);
    return true;
  }
  if (req.url === "/reset-password" && req.method === "POST") {
    resetPage(req, res);
    return true;
  }
  if (req.url.startsWith("/reset-password/") && req.method === "GET") {
    const token = req.url.split("/").pop();
    const filePath = path.join(
      __dirname,
      "..",
      "frontend",
      "password_reseter.html"
    );

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to read the file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      const updatedData = data.replace("{{TOKEN}}", token);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(updatedData);
    });
    return true;
  }
  if (req.url === "/edit" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = JSON.parse(chunk.toString());
    });

    req.on("end", () => {
      if (sessions[JSON.parse(body.sessionId).sessionId]) {
        handleProfileUpdate(body, res);
      } else {
        res.writeHead(401);
        res.end("Unauthorized");
      }
    });
    return true;
  }
  if (req.url === "/edit_password" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = JSON.parse(chunk.toString());
    });
    req.on("end", () => {
      if (sessions[JSON.parse(body.sessionId).sessionId]) {
        handlePasswordUpdate(body, res);
      } else {
        res.writeHead(401);
        res.end("Unauthorized");
      }
    });
    return true;
  }
  if (req.url === "/api/get-user-details" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = JSON.parse(chunk.toString());
    });
    req.on("end", () => {
      if (sessions[body.sessionId]) {
        getUserDetails(body, res);
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
      }
    });
    return true;
  }
  if (req.url === "/get-username" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = JSON.parse(chunk.toString());
    });
    req.on("end", () => {
      if (sessions[body.sessionId]) {
        let email = body.email;

        if (!email) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not authenticated" }));
          return;
        }

        getUsernameByEmail(email, (err, username) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ username: username }));
        });
      }
    });
    return true;
  }

  if (req.url === "/rss" && req.method === "GET") {
    getLastReports((err, reports) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        return;
      }

      const feed = generateRSSFeed(reports);
      res.writeHead(200, { "Content-Type": "application/rss+xml" });
      res.end(feed);
    });
    return true;
  }

  if (req.url === "/api/reports/weekly" && req.method === "GET") {
    getWeeklyReports(res);
    return true;
  }

  if (req.url === "/api/reports/by-city" && req.method === "GET") {
    getReportsByCity(res);
    return true;
  }

  if (req.url === "/api/reports/by-species" && req.method === "GET") {
    getReportsBySpecies(res);
    return true;
  }

  if (
    req.url === "/api/reports/by-danger-and-behavior" &&
    req.method === "GET"
  ) {
    getReportsByDangerAndBehavior(res);
    return true;
  }

  return false;
}

module.exports = router;
