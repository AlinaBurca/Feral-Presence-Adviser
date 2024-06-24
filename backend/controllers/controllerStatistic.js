const dbConnection = require("../user/database/database.js").getConnection();

function getWeeklyReports(res) {
  const query = `
        SELECT DATE_FORMAT(created_at, '%M %Y') AS month, COUNT(*) AS count
        FROM reports
        WHERE YEAR(created_at) = YEAR(CURDATE())
        GROUP BY month
        ORDER BY MIN(created_at);
    `;
  dbConnection.query(query, (err, results) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

function getReportsByCity(res) {
  const query = `
        SELECT city, COUNT(*) AS count
        FROM reports
        GROUP BY city
        ORDER BY count DESC;
    `;
  dbConnection.query(query, (err, results) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

function getReportsBySpecies(res) {
  const query = `
        SELECT species, COUNT(*) AS count
        FROM reports
        GROUP BY species
        ORDER BY count DESC;
    `;
  dbConnection.query(query, (err, results) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

function getReportsByDangerAndBehavior(res) {
  const query = `
        SELECT 
            danger_level,
            SUM(CASE WHEN violence = 'yes' THEN 1 ELSE 0 END) AS violent,
            SUM(CASE WHEN rabies = 'yes' THEN 1 ELSE 0 END) AS rabies,
            SUM(CASE WHEN trained = 'yes' THEN 1 ELSE 0 END) AS trained,
            SUM(CASE WHEN vaccinated = 'yes' THEN 1 ELSE 0 END) AS vaccinated,
            SUM(CASE WHEN injured = 'yes' THEN 1 ELSE 0 END) AS injured
        FROM reports
        GROUP BY danger_level;
    `;
  dbConnection.query(query, (err, results) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

module.exports = {
  getWeeklyReports,
  getReportsByCity,
  getReportsBySpecies,
  getReportsByDangerAndBehavior,
};
