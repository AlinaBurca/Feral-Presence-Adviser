const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const mysql = require("mysql2");
const dbConnection = require("../user/database/database.js").getConnection();

async function homeUserController(req, res) {
  if (req.method === "POST") {
    console.log("am ajuns în controller");
    await controllerHome(req, res);
  } else {
    res.writeHead(405);
    res.end("Method Not Allowed");
  }
}

async function controllerHome(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "uploads"); // Setează directorul de upload
  form.keepExtensions = true; // Păstrează extensia fișierului

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    console.log(fields);
    try {
      const imageName =
        files.file[0].newFilename +
        path.extname(files.file[0].originalFilename);
      fs.renameSync(
        files.file[0].filepath,
        files.file[0].filepath + path.extname(files.file[0].originalFilename)
      );

      const petStatus = fields.status ? fields.status[0] : null;
      const petGender = fields.gender ? fields.gender[0] : null;
      const petName = fields.petName ? fields.petName[0] : null;
      const petType = fields.petType ? fields.petType[0] : null;
      const danger_level = fields.danger_level ? fields.danger_level[0] : null;
      const dateLastSeen = fields.dateLastSeen ? fields.dateLastSeen[0] : null;
      const addressLastSeen = fields.address ? fields.address[0] : null;
      const city = fields.city ? fields.city[0] : null;
      const phoneNumber = fields.phoneNumber ? fields.phoneNumber[0] : null;
      const email = fields.email ? fields.email[0] : null;
      const violence = fields.violence ? fields.violence[0] : null;
      const rabies = fields.rabies ? fields.rabies[0] : null;
      const trained = fields.trained ? fields.trained[0] : null;
      const vaccinated = fields.vaccinated ? fields.vaccinated[0] : null;
      const injured = fields.injured ? fields.injured[0] : null;
      const information = fields.information ? fields.information[0] : null;
      const imagePath = imageName;
      const isValid = fields.isValid ? fields.isValid[0] : null;
      console.log("vaccinated", vaccinated);
      console.log("rabies: ", rabies);
      console.log("trained: ", trained);
      console.log("violence: ", violence);
      console.log("injured: ", injured);

      const [rows] = await dbConnection
        .promise()
        .query("SELECT id, email FROM users WHERE email = ?", [email]);
      if (rows.length === 0) {
        if (!res.headersSent) {
          res.writeHead(409);
          res.end("Email does not exist");
          return;
        }
      } else {
        const user_id = rows[0].id;
        if (isValid === "1") {
          await dbConnection.promise().execute(
            `INSERT INTO reports (user_id, status, gender, name, species, danger_level, dateLastSeen, addressLastSeen, city, phone_number, user_email, violence, rabies, trained, vaccinated, injured, additional_info, image)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              petStatus,
              petGender,
              petName,
              petType,
              danger_level,
              dateLastSeen,
              addressLastSeen,
              city,
              phoneNumber,
              email,
              violence,
              rabies,
              trained,
              vaccinated,
              injured,
              information,
              imagePath,
            ]
          );

          if (!res.headersSent) {
            res.writeHead(201);
            res.end("Report created");
            return;
          }
        } else {
          if (!res.headersSent) {
            console.log("isValid: ");
            console.log(fields.isValid);
            res.writeHead(403);
            res.end("Is not a valid form");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
    }
  });
}

function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = homeUserController;
