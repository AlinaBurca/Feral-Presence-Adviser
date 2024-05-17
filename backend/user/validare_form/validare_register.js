function validateUsername() {
    const username = document.querySelector('input[name="username"]');
    const error = document.getElementById('usernameError');
    if (username.value.length < 3) {
        username.classList.add('error');
        username.classList.remove('valid');
        error.textContent = "Username must be at least 3 characters long.";
        error.style.visibility = 'visible';
        return false;
    }

    username.classList.remove('error');
    username.classList.add('valid');
    error.style.visibility = 'hidden';
    return true;
}


function validatePassword() {
    const password = document.querySelector('input[name="password"]');
    const confirmpassword = document.querySelector('input[name="confirmpassword"]');
    const error = document.getElementById('passwordError');
    const error1 = document.getElementById('confirmPasswordError');
    let ok = 1;
    if (password.value.length < 6) {
        password.classList.add('error');
        password.classList.remove('valid');
        error.textContent = "Password must be at least 6 characters long.";
        error.style.visibility = 'visible';
        ok = 0;
    }
    else {
        password.classList.remove('error');
        password.classList.add('valid');
        error.style.visibility = 'hidden';
    }

    if (password.value !== confirmpassword.value) {
        confirmpassword.classList.add('error');
        confirmpassword.classList.remove('valid');
        error1.textContent = "Passwords do not match.";
        error1.style.visibility = 'visible';

        ok = 0;
    }
    else {
        confirmpassword.classList.remove('error');
        confirmpassword.classList.add('valid');
        error1.style.visibility = 'hidden';
    }
    if (ok == 0)
        return false;
    else
        return true;
}

function validateEmail(ok) {
    const email = document.querySelector('input[name="email"]');
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const error = document.getElementById('emailError');

    if (!regex.test(email.value) || ok === false) {
        email.classList.add('error');
        email.classList.remove('valid');
        if (ok === 1)
            error.textContent = "It does not have a valid email syntax.";
        else
            error.textContent = "The email address is already in use.";
        error.style.visibility = 'visible';
        return false;
    }

    email.classList.remove('error');
    error.style.visibility = 'hidden';
    email.classList.add('valid');
    return true;
}
function validatePhone() {
    const phone = document.querySelector('input[name="telefon"]');
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
    const adresa = document.querySelector('input[name="adresa"]');
    adresa.classList.add('valid');
    return true;
}
function validateForm() {
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="telefon"]').value;
    const adresa = document.querySelector('input[name="adresa"]').value;

    const isValidUsername = validateUsername();
    let isValidEmail = validateEmail(1);
    const isValidPassword = validatePassword();
    const isValidPhone = validatePhone();
    const isValidAdress = validateAdress();
    let userData = {
        username: username,
        password: password,
        email: email,
        phone: phone,
        adresa: adresa,
        isValid: 0,
    };
    if (isValidUsername && isValidEmail && isValidPassword && isValidPhone && isValidAdress) {
        userData.isValid = 1;

    }


    fetch("./register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(async (response) => {


            if (response.ok) {
                console.log(response.status);
                window.location.href = "./login.html";


            } else if (response.status === 409) {
                validateEmail(response.ok);
            } else
                if (response.status === 403) {

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