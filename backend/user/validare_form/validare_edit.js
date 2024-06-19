function validateUsername() {
    const username = document.querySelector('input[name="name"]');
    const error = document.getElementById('usernameError');
    if (username.value.length < 3) {
        username.classList.add('error');
        username.classList.remove('valid');
        console.log(username);
        error.textContent = "Username must be at least 3 characters long.";
        error.style.visibility = 'visible';
        return false;
    }

    username.classList.remove('error');
    username.classList.add('valid');
    error.style.visibility = 'hidden';
    return true;
}


function validatePassword(ok) {
    const new_password = document.querySelector('input[name="new_password"]');
    const password = document.querySelector('input[name="password"]');
    const error = document.getElementById('newPasswordError');
    const error1 = document.getElementById('passwordError');
    let ok_interior = 1;
    if (new_password.value.length < 6) {
        new_password.classList.add('error');
        new_password.classList.remove('valid');
        error.textContent = "Password must be at least 6 characters long.";
        error.style.visibility = 'visible';
        ok_interior = 0;
    }
    else {
        new_password.classList.remove('error');
        new_password.classList.add('valid');
        error.style.visibility = 'hidden';
    }

    if (ok === 0) {
        password.classList.add('error');
        password.classList.remove('valid');
        error1.textContent = "Passwords do not match.";
        error1.style.visibility = 'visible';

        ok_interior = 0;
    }
    else {
        password.classList.remove('error');
        password.classList.add('valid');
        error1.style.visibility = 'hidden';
    }
    if (ok_interior == 0)
        return false;
    else
        return true;
}

function validateEmail() {
    const email = document.querySelector('input[name="email"]');
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const error = document.getElementById('emailError');
    console.log("dad");
    if (!regex.test(email.value)) {
        email.classList.add('error');
        email.classList.remove('valid');
        error.textContent = "It does not have a valid email syntax.";
        error.style.visibility = 'visible';
        return false;
    }

    email.classList.remove('error');
    error.style.visibility = 'hidden';
    email.classList.add('valid');
    return true;
}
function validatePhone() {
    const phone = document.querySelector('input[name="number"]');
    const regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/;
    const error = document.getElementById('phoneError');


    if (!regex.test(phone.value)) {
        phone.classList.add('error');
        phone.classList.remove('valid');
        error.textContent = "The phone number must contain only digits.";
        error.style.visibility = 'visible';
        return false;
    }
    phone.classList.remove('error');
    error.style.visibility = 'hidden';
    phone.classList.add('valid');
    return true;
}
function validateAdress() {
    const adresa = document.querySelector('input[name="adress"]');
    adresa.classList.add('valid');
    return true;
}
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");
    const form_password = document.querySelector("#password-form");

    fetch('/api/get-user-details', {
        method: 'POST',
        body: localStorage.getItem("sessionId")
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('fullName').value = data.user.username || '';
                document.getElementById('email').value = data.user.email || '';
                document.getElementById('contactNumber').value = data.user.phone_number || '';
                document.getElementById('address').value = data.user.address || '';
            } else {
                alert('Failed to load user details: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previne comportamentul implicit al formularului

        const fullName = form.querySelector("input[name='name']").value;
        const email = form.querySelector("input[name='email']").value;
        const contactNumber = form.querySelector("input[name='number']").value;
        const address = form.querySelector("input[name='adress']").value;

        if (!fullName || !email || !contactNumber || !address) {
            alert("All fields are required!");
            return;
        }



        const data = {
            name: fullName,
            email: email,
            number: contactNumber,
            adress: address,
            sessionId: localStorage.getItem("sessionId")
        };

        const sessionId = localStorage.getItem("sessionId"); // Obține sessionId

        if (!sessionId) {
            alert("Session ID not found. Please log in again.");
            return;
        }
        const isValidUsername = validateUsername();
        const isValidEmail = validateEmail();
        const isValidPhone = validatePhone();
        const isValidAdress = validateAdress();
        if (!isValidUsername || !isValidEmail || !isValidPhone || !isValidAdress) {
            return;
        }

        fetch('/edit', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/edit.html";
                } else {
                    alert("Failed to update profile: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while updating the profile.");
            });
    });


    form_password.addEventListener("submit", function (event) {
        event.preventDefault(); // Previne comportamentul implicit al formularului

        const password = form_password.querySelector("input[name='password']").value;
        const new_password = form_password.querySelector("input[name='new_password']").value;


        if (!password || !new_password) {
            alert("All fields are required!");
            return;
        }



        const data_password = {
            password: password,
            new_password: new_password,

            sessionId: localStorage.getItem("sessionId")
        };

        const sessionId = localStorage.getItem("sessionId");

        if (!sessionId) {
            alert("Session ID not found. Please log in again.");
            return;
        }

        fetch('/edit_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_password)
        })
            .then(response => {
                const status = response.status;
                return response.json().then(data_password => ({ status, data_password }));
            })
            .then(({ status, data_password }) => {
                if (status === 200) {
                    if (data_password.success) {
                        window.location.href = "/edit.html";
                    } else {
                        alert("Failed to update profile: " + data_password.message);
                    }
                } else if (status === 300) {
                    validatePassword(0);
                } else {
                    validatePassword(1);
                    alert("An error occurred while updating the profile: " + data_password.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while updating the profile.");
            });

    });
});
