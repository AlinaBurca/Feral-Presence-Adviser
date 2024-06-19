const {
  registerPage,
  homePage,
  cardPage,
  filterAnimals,
} = require("./handler.js");
const url = require("url");

function router(req, res) {
  if (req.url === "/register" && req.method === "POST") {
    registerPage(req, res);
    return true;
  } else if (req.url === "/index") {
    console.log("am trecut prin router");
    homePage(req, res);
    return true;
  } else if (req.url === "/api/reports") {
    homePage(req, res);
    return true;
  } else if (req.url.startsWith("/animal-details")) {
    const animalId = new URLSearchParams(
      req.url.slice(req.url.indexOf("?"))
    ).get("id");
    console.log("Animal id: ", animalId);
    cardPage(req, res, animalId);
    return true;
  } else if (req.url == "/filter") {
    filterAnimals(req, res);
    return true;
  }
  return false;
}

module.exports = router;
