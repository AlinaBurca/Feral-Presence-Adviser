const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const dbConnection = require("../user/database/database.js").getConnection();

async function filterAnimalsController(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Form parse error:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    try {
      const { status, petName, city, petType, gender, time } = fields;

      let query = "SELECT * FROM reports WHERE 1=1";
      const queryParams = [];

      if (status) {
        query += " AND status = ?";
        queryParams.push(status);
      }

      if (petName) {
        query += " AND name LIKE ?";
        queryParams.push(`%${petName}%`);
      }

      if (city) {
        query += " AND city LIKE ?";
        queryParams.push(`%${city}%`);
      }

      if (petType) {
        query += " AND species = ?";
        queryParams.push(petType);
      }

      if (gender) {
        query += " AND gender = ?";
        queryParams.push(gender);
      }

      if (time) {
        const timeRanges = {
          "1 Month": "1 MONTH",
          "3 Months": "3 MONTH",
          "6 Months": "6 MONTH",
          "1 Year": "1 YEAR",
        };
        query +=
          " AND created_at >= DATE_SUB(NOW(), INTERVAL " +
          timeRanges[time] +
          " ORDER BY created_at)";
      }

      const [rows] = await dbConnection.promise().query(query, queryParams);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (error) {
      console.error("Error:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  });
}

module.exports = filterAnimalsController;
