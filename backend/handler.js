const registerUserController = require("./controllers/controllerRegister");
const homeUserController = require("./controllers/controllerHome");
const cardsController = require("./controllers/controllerCards");
const animalDetailsController = require("./controllers/controllerAnimalDetails");
const filterAnimalsController = require("./controllers/controllerFilterAnimals");

function registerPage(req, res) {
  if (req.method === "POST") {
    registerUserController(req, res);
  }
}

function homePage(req, res) {
  if (req.method === "POST") {
    homeUserController(req, res);
  } else if (req.method === "GET") {
    cardsController(req, res);
  }
}

function cardPage(req, res, animalId) {
  if (req.method === "GET") {
    animalDetailsController(req, res, animalId);
  }
}

function filterAnimals(req, res) {
  if (req.method == "POST") {
    console.log("am trecut prin handler");
    filterAnimalsController(req, res);
  }
}

module.exports = { registerPage, homePage, cardPage, filterAnimals };
