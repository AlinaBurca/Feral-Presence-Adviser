document.addEventListener("DOMContentLoaded", function () {
  const token = window.location.pathname.split("/").pop();
  document.getElementById("token").value = token;

  document
    .getElementById("reset-password-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector(
        'input[name="confirm_password"]'
      );
      const confirmPasswordError = document.getElementById("passwordError");
      const token = document.getElementById("token").value;

      confirmPasswordError.style.visibility = "hidden";
      passwordInput.classList.remove("error");
      confirmPasswordInput.classList.remove("error");

      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordInput.classList.add("error");
        confirmPasswordInput.classList.add("error");
        confirmPasswordError.style.visibility = "visible";
        return;
      }

      try {
        const response = await fetch("/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password: passwordInput.value }),
        });

        if (response.ok) {
          passwordInput.classList.add("valid");
          confirmPasswordInput.classList.add("valid");
          confirmPasswordError.style.visibility = "hidden";
        } else {
          alert("Failed to reset password");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
});
