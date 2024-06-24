document.addEventListener("DOMContentLoaded", () => {
  const sessionData = JSON.parse(localStorage.getItem("sessionId"));
  const usernameButton = document.getElementById("username");
  const loginButton = document.getElementById("loginBtn");
  const dropdownContent = document.getElementById("dropdownContent");
  const rssButton = document.getElementById("RSS");

  if (!sessionData) {
    if (usernameButton) {
      usernameButton.style.display = "none";
    }
    if (loginButton) {
      loginButton.style.display = "block";
    }
    if (dropdownContent) {
      dropdownContent.style.display = "none";
    }
    if (rssButton) {
      rssButton.style.display = "none";
    }
    return;
  }
  if (loginButton) {
    loginButton.style.display = "none";
  }

  const isAdmin = sessionData.isAdmin;
  if (sessionData.username) {
    usernameButton.innerText = sessionData.username;
  } else {
    if (usernameButton) {
      usernameButton.style.display = "none";
    }
    if (dropdownContent) {
      dropdownContent.style.display = "none";
    }
  }

  if (isAdmin) {
    dropdownContent.innerHTML = `
          <a href="admin.html">
              <i class="fa-solid fa-user-shield"></i>
              Admin Panel</a>
          <a href="login.html" id="logoutBtn">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Log out</a>
      `;
  } else {
    dropdownContent.innerHTML = `
          <a href="dashboard.html">
              <i class="fa-solid fa-chart-line"></i>
              Dashboard</a>
          <a href="edit.html">
              <i class="fa-regular fa-pen-to-square"></i>
              Edit Profile</a>
          <a href="login.html" id="logoutBtn">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Log out</a>
      `;
  }

  const logoutButton = document.getElementById("logoutBtn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }

  rssButton.addEventListener("click", function () {
    redirectToRSSFeed();
  });

  function redirectToRSSFeed() {
    const rssFeedUrl = "http://localhost:3000/rss";
    window.location.href = rssFeedUrl;
  }
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};
