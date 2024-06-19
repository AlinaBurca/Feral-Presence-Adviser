document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const animalId = urlParams.get("id");

  if (animalId) {
    fetchAnimalDetails(animalId);
  } else {
    alert("animal ID is missing in the URL");
  }
});

function fetchAnimalDetails(animalId) {
  console.log("am trecut prin fetch cu caine!!");
  fetch(`/animal-details.html?id=${animalId}`, {
    method: "GET",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        renderAnimaletails(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching animal details:", error);
    });
}

function renderAnimalDetails(animal) {
  document.querySelector(
    ".title--container h2"
  ).innerText = `${animal.name} - Lost animal in ${animal.location}`;
  document.querySelector(".card--image").src = animal.imagePath;
  document.querySelector(".card--body h3").innerText = `ID: ${animal.id}`;
  document.querySelector(".details-row:nth-child(1) .label-text h4").innerText =
    animal.id;
  document.querySelector(".details-row:nth-child(2) .label-text h4").innerText =
    animal.petName;
  document.querySelector(".details-row:nth-child(3) .label-text h4").innerText =
    animal.status;
  document.querySelector(".details-row:nth-child(4) .label-text h4").innerText =
    animal.prtType;
  //document.querySelector('.details-row:nth-child(5) .label-text h4').innerText = animal.date_last_seen;
  document.querySelector(".details-row:nth-child(6) .label-text h4").innerText =
    animal.address;
  //document.querySelector('.details-row:nth-child(7) .label-text h4').innerText = animal.rabies_risk;
  //document.querySelector('.details-row:nth-child(8) .label-text h4').innerText = animal.violence_risk;
  document.querySelector(".details-row:nth-child(9) .label-text h4").innerText =
    animal.information;
}
