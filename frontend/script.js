function showSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}
window.addEventListener('scroll', function () {
    var navbar = document.querySelector('#navigation');
    if (window.scrollY > 0) {
        navbar.classList.add('navbar-scroll');
    } else {
        navbar.classList.remove('navbar-scroll');
    }
});

// // Obține linkul și secțiunea corespunzătoare
// const mapLink = document.getElementById("mapLink");
// const mapSection = document.getElementById("mapSection");
// const section1 = document.querySelector('.section1');
// const section2 = document.querySelector('.section2');
// const mainSection = document.querySelector('.main--section')
// var display = 1;
// // Adaugă un ascultător de eveniment pentru clic pe link
// mapLink.addEventListener("click", function (event) {
//     // Previne comportamentul implicit al linkului (navigarea către altă pagină)
//     event.preventDefault();


//     if (!mapSection.classList.contains('section3')) {
//         section1.style.display = 'none';
//         section2.style.display = 'none';
//         mapSection.classList.add('section3');
//         mainSection.classList.remove('main--section');
//         mainSection.classList.add('main--change');

//     }
//     else {

//         mapSection.classList.remove('section3');
//         mainSection.classList.remove('main--change');
//         mainSection.classList.add('main--section');
//         section2.style.display = 'flex';

//     }


// });

// const filterLink = document.getElementById("filterLink");
// const form = document.querySelector('.filter--form');
// var display1 = 1;

// filterLink.addEventListener("click", function (event) {
//     // Previne comportamentul implicit al linkului (navigarea către altă pagină)
//     event.preventDefault();


//     if (display1 === 1) {
//         section2.style.display = 'none';
//         mapSection.style.display = 'none';
//         mainSection.classList.remove('main--section');
//         mainSection.classList.toggle('main--change--filter');
//         section1.classList.add('show--filter');
//         form.classList.add('change--filter');

//         display1 = 0;
//     }
//     else {

//         section1.classList.remove('show--filter');
//         mainSection.classList.remove('main--change--filter');
//         mainSection.classList.add('main--section');
//         section2.style.display = 'flex';
//         display1 = 1;
//     }


// });

// Obține linkurile meniului
const mapLink = document.getElementById("mapLink");
const filterLink = document.getElementById("filterLink");
const listLink = document.getElementById("listLink");

// Obține secțiunile
const section1 = document.querySelector(".section1");
const section2 = document.querySelector(".section2");
const section3 = document.querySelector(".section3");

// Ascunde toate secțiunile la început
const sections = [section1, section2, section3];
sections.forEach(section => {
    section.classList.remove("active");
});

// Afișează secțiunea 2 (începutul)
section2.classList.add("active");

// Adaugă eveniment pentru linkul de hartă
mapLink.addEventListener("click", function (event) {
    event.preventDefault();
    section1.classList.remove("active");
    section2.classList.remove("active");
    section3.classList.add("active");

});

// Adaugă eveniment pentru linkul de filtrare
filterLink.addEventListener("click", function (event) {
    event.preventDefault();
    section1.classList.add("active");
    section2.classList.remove("active");
    section3.classList.remove("active");


});

listLink.addEventListener("click", function (event) {
    event.preventDefault();
    section1.classList.remove("active");
    section2.classList.add("active");
    section3.classList.remove("active");


});