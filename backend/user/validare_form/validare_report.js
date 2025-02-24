/***************************************************
RAPORT
***************************************************/

function validatePetStatus() {
  const status = document.querySelector('input[name="status"]:checked');
  const error = document.getElementById("petStatusError");
  if (!status) {
    error.textContent = "Please select a pet status.";
    error.style.visibility = "visible";
    return false;
  }
  error.style.visibility = "hidden";
  return true;
}

function validatePetGender() {
  const gender = document.querySelector('input[name="gender"]:checked');
  const error = document.getElementById("petGenderError");
  if (!gender) {
    error.textContent = "Please select a pet gender.";
    error.style.visibility = "visible";
    return false;
  }

  error.style.visibility = "hidden";
  return true;
}

function validateFile() {
  const fileInput = document.querySelector('input[name="file"]');
  const error = document.getElementById("fileError");
  if (!fileInput.files || !fileInput.files[0]) {
    error.textContent = "Please upload a file.";
    error.style.visibility = "visible";
    return false;
  }
  const file = fileInput.files[0];
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    error.textContent = "Only images are allowed (jpeg, png, gif).";
    error.style.visibility = "visible";
    return false;
  }
  error.style.visibility = "hidden";
  return true;
}
function validateDate() {
  const circumstance = document.querySelector('input[name="dateLastSeen"]');
  const error = document.getElementById("dateLastSeenError");
  if (circumstance.value.length === 0) {
    error.textContent = "Please enter the date.";
    error.style.visibility = "visible";
    return false;
  }
  error.style.visibility = "hidden";
  return true;
}
function validatePhoneNumber() {
  const phone = document.querySelector('input[name="phoneNumber"]');
  const regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/;
  const error = document.getElementById("phoneNumberError");
  if (!regex.test(phone.value)) {
    phone.classList.add("error");
    phone.classList.remove("valid");
    error.textContent = "The phone number is invalid.";
    error.style.visibility = "visible";
    return false;
  }
  phone.classList.remove("error");
  error.style.visibility = "hidden";
  phone.classList.add("valid");
  return true;
}

function validateEmail(ok) {
  const email = document.querySelector('input[name="email"]');
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const error = document.getElementById("emailError");

  if (!regex.test(email.value) || ok === false) {
    email.classList.add("error");
    email.classList.remove("valid");
    if (ok === 1) error.textContent = "It does not have a valid email syntax.";
    else error.textContent = "Please enter a valid email account!";
    error.style.visibility = "visible";
    return false;
  }

  email.classList.remove("error");
  error.style.visibility = "hidden";
  email.classList.add("valid");
  return true;
}

function validateAdress() {
  const address = document.querySelector('input[name="address"]');
  const error = document.getElementById("addressError");
  if (address.value.length === 0) {
    error.textContent = "Please enter the address.";
    error.style.visibility = "visible";
    return false;
  }
  error.style.visibility = "hidden";
  return true;
}

function validateInformation() {
  const address = document.querySelector('input[name="information"]');
  const error = document.getElementById("informationError");
  if (address.value.length === 0) {
    error.textContent = "Please enter other information.";
    error.style.visibility = "visible";
    return false;
  }
  error.style.visibility = "hidden";
  return true;
}

let inputFile = document.querySelector("#input-file");
let petPhoto = document.querySelector("#pet-photo");

inputFile.onchange = function () {
  petPhoto.src = URL.createObjectURL(inputFile.files[0]);
};

function validateForm() {
  const isValidPhone = validatePhoneNumber();
  let isValidEmail = validateEmail(1);
  const isValidAdress = validateAdress();
  const isValidStatus = validatePetStatus();
  const isValidGender = validatePetGender();
  const isValidImage = validateFile();
  const isValidDate = validateDate();
  const isValidInformation = validateInformation();

  const formElement = document.getElementById("petForm");
  const formData = new FormData(formElement);

  let petName = formData.get("petName");
  if (petName.trim() === "") {
    formData.set("petName", "unknown");
  }

  formData.append("isValid", "0");
  let address = formData.get("address");

  if (
    isValidPhone &&
    isValidEmail &&
    isValidAdress &&
    isValidStatus &&
    isValidGender &&
    isValidImage &&
    isValidDate &&
    isValidInformation
  ) {
    formData.set("isValid", "1");
    formData.set("violence", document.getElementById("violenceField").value);
    formData.set("rabies", document.getElementById("rabiesField").value);
    formData.set("trained", document.getElementById("trainedField").value);
    formData.set(
      "vaccinated",
      document.getElementById("vaccinatedField").value
    );
    formData.set("injured", document.getElementById("injuredField").value);
    const sessionId = localStorage.getItem("sessionId");

    formData.append("sessionId", sessionId);
    fetch("/index", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          document.getElementById("petForm").reset();
          document.querySelector("#pet-photo").src = "";

          document.getElementById("map").style.display = "none";

          resetTagButtons();
        } else if (response.status === 409) {
          validateEmail(response.ok);
        } else if (response.status === 403) {
          validateEmail(response.ok);
        } else {
          const errorMessage = await response.text();
          console.error(errorMessage);
          alert("Failed to report: " + errorMessage);
        }
      })
      .catch((err) => {
        console.error("Network error:", err);
        alert("Network error, please try again");
      });
  }
}
function toggleTag(button) {
  button.classList.toggle("selected");
  const field = document.getElementById(button.id + "Field");
  field.value = button.classList.contains("selected") ? "yes" : "no";
}
const submitButton = document.querySelector(".submit");
submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  validateForm();
});

function resetTagButtons() {
  const tagsButtons = document.querySelectorAll(
    '.tags-btn input[type="button"]'
  );
  tagsButtons.forEach((button) => {
    button.classList.remove("selected");
    const field = document.getElementById(button.id + "Field");
    field.value = "no";
  });
}
/***************************************************
CARDURI
***************************************************/

document.addEventListener("DOMContentLoaded", loadReports);

function loadReports() {
  fetch("/api/reports")
    .then((response) => response.json())
    .then((data) => {
      const gridWrapper = document.querySelector(".grid-wrapper");
      gridWrapper.innerHTML = "";
      data.forEach((report) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `

            <div class="card--image" onclick="location.href='/animal-details.html?id=${report.id}';">
            <img alt="pet-image" src="./backend/controllers/uploads/${report.image}">
            </div>
            <div class="card--body">
              <h3>${report.name}</h3>
              <p>${report.addressLastSeen}</p>
            </div>
         
          `;
        gridWrapper.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function extractFileName(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");
  return segments[segments.length - 1];
}

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
