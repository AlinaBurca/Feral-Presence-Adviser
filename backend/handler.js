const registerUserController = require("./controllers/controllerRegister");
const homeUserController = require("./controllers/controllerHome");
const cardsController = require("./controllers/controllerCards");
const animalDetailsController = require("./controllers/controllerAnimalDetails");
const filterAnimalsController = require("./controllers/controllerFilterAnimals");
const loginUserController = require("./controllers/controllerLogin");
const forgetUserController =
  require("./controllers/controllerForget").forgetUserController;
const resetPasswordController =
  require("./controllers/controllerForget").controllerResetPassword;
const editUserController = require("./controllers/controllerEdit");
const userReportsController = require("./controllers/controllerUserReports");

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

function loginPage(req, res) {
  if (req.method === "POST") {
    loginUserController(req, res);
  }
}

function forgetPage(req, res) {
  if (req.method === "POST") {
    forgetUserController(req, res);
  }
}

function resetPage(req, res) {
  if (req.method === "POST") {
    resetPasswordController(req, res);
  }
}
function editPage(req, res) {
  editUserController(req, res);
}
function userReports(req, res) {
  if (req.method == "POST") console.log("am ajuns in reports handler");
  userReportsController(req, res);
}

module.exports = {
  registerPage,
  loginPage,
  forgetPage,
  resetPage,
  editPage,
  homePage,
  cardPage,
  filterAnimals,
  userReports,
};
