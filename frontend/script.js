function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}
function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}
window.addEventListener("scroll", function () {
  var navbar = document.querySelector("#navigation");
  if (window.scrollY > 0) {
    navbar.classList.add("navbar-scroll");
  } else {
    navbar.classList.remove("navbar-scroll");
  }
});

// Obține linkurile meniului

const filterLink = document.getElementById("filterLink");
const listLink = document.getElementById("listLink");

// Obține secțiunile
const section1 = document.querySelector(".section1");
const section2 = document.querySelector(".section2");

// Ascunde toate secțiunile la început
const sections = [section1, section2];
sections.forEach((section) => {
  section.classList.remove("active");
});

// Afișează secțiunea 2 (începutul)
section2.classList.add("active");

// Adaugă eveniment pentru linkul de filtrare
filterLink.addEventListener("click", function (event) {
  event.preventDefault();
  section1.classList.add("active");
  section2.classList.remove("active");
});

listLink.addEventListener("click", function (event) {
  event.preventDefault();
  section1.classList.remove("active");
  section2.classList.add("active");
});
