
function validateEmail(ok) {
    const email = document.querySelector('input[name="email"]');
    const error = document.getElementById('emailError');
    if (ok === 0) {
        email.classList.add('error');
        email.classList.remove('valid');
        error.style.visibility = 'visible';
    }
    else {
        email.classList.remove('error');
        error.style.visibility = 'hidden';
        email.classList.add('valid');
    }
}
function validateForm() {
    const email = document.querySelector('input[name="email"]').value;
    let userData = {
        email: email,
    }
    fetch("./forget", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(async (response) => {
            if (response.ok) {
                console.log("aici");
                validateEmail(1);
                window.location.href = "./login.html";

            } else
                if (response.status === 404) {
                    validateEmail(0);
                    console.log("User not found, please login first");
                }
                else {
                    const errorMessage = await response.text();
                    console.error(errorMessage);
                    alert('Failed to register: ' + errorMessage);
                }
        })
        .catch((err) => {
            console.error('Network error:', err);
            alert('Network error, please try again');
        });
}
const submitButton = document.querySelector('.submit');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    validateForm();
});

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