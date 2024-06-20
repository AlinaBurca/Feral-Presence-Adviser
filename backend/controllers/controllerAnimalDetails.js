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
        const dateLastSeen = new Date(details.dateLastSeen).toDateString();
        console.log("dateee: ", dateLastSeen);
        let imagePath = "./backend/controllers/uploads/" + details.image;
        console.log(imagePath);

        let updatedContent = content

          .replace(/exampleName/g, details.name)
          .replace(/exampleID/g, details.id)
          .replace(/exampleSpecies/g, details.species)
          .replace(/exampleStatus/g, details.status)
          .replace(/Information/g, details.aditional_info)
          .replace(/exampleLocation/g, details.addressLastSeen)
          .replace(/exampleDate/g, dateLastSeen)
          .replace(/exampleRisk/g, details.rabies)
          .replace(/exampleViolence/g, details.violence)
          .replace(/exampleTrained/g, details.trained)
          .replace(/exampleVaccinated/g, details.vaccinated)
          .replace(/exampleInjured/g, details.injured)
          .replace(/exampleSrc/g, imagePath)

          .replace(/exampleDescription/g, details.aditional_info);

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
