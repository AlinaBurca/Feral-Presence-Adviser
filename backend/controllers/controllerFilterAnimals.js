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

    console.log("FITER", fields);

    try {
      const { status, petName, city, petType, gender, timeRange } = fields;
      console.log("Pet type:", petType);

      let query = "SELECT * FROM reports WHERE 1=1";
      const queryParams = [];

      if (status) {
        query += " AND petStatus = ?";
        queryParams.push(status);
      }

      if (petName) {
        query += " AND petName LIKE ?";
        queryParams.push(`%${petName}%`);
      }

      if (city) {
        query += " AND city LIKE ?";
        queryParams.push(`%${city}%`);
      }

      if (petType) {
        query += " AND petType = ?";
        queryParams.push(petType);
      }

      if (gender) {
        query += " AND petGender = ?";
        queryParams.push(gender);
      }

      if (timeRange) {
        const timeRanges = {
          "1 Month": "1 MONTH",
          "3 Months": "3 MONTHS",
          "6 Months": "6 MONTHS",
          "1 Year": "1 YEAR",
        };
        query +=
          " AND date >= DATE_SUB(NOW(), INTERVAL " +
          timeRanges[timeRange] +
          ")";
      }

      const [rows] = await dbConnection.promise().query(query, queryParams);

      console.log("REZULTAT: ", rows);

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
