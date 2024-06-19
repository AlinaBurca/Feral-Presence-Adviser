const mysql = require("mysql2");
const dbConnection = require("../user/database/database.js").getConnection();
const fs = require("fs");
const path = require("path");

async function getAnimalDetails(animalId) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT * FROM reports WHERE id = ?",
      [animalId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return reject(new Error("Animal not found"));
        }
        resolve(results[0]);
      }
    );
  });
}

function animalDetailsController(req, res, animalId) {
  console.log("animal id", animalId);

  getAnimalDetails(animalId)
    .then((details) => {
      const filePath = "../frontend/animal-details.html";

      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          console.error("Failed to read file:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        let imagePath = "./backend/controllers/uploads/" + details.imagePath;
        console.log(imagePath);

        let updatedContent = content

          .replace(/exampleName/g, details.petName)
          .replace(/exampleID/g, details.id)
          .replace(/exampleSpecies/g, details.petType)
          .replace(/exampleStatus/g, details.petStatus)
          .replace(/Information/g, details.description)
          .replace(/exampleLocation/g, details.address)
          .replace(/exampleDate/g, details.date)
          .replace(/exampleRisk/g, details.rabies)
          .replace(/exampleViolence/g, details.violence)
          .replace(/exampleSrc/g, imagePath)

          .replace(/exampleDescription/g, details.information);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(updatedContent, "utf-8");
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });
}

module.exports = animalDetailsController;
