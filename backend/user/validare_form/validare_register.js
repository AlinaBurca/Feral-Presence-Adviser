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

function validateEmail() {
    const email = document.querySelector('input[name="email"]');
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const error = document.getElementById('emailError');

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
    const isValidUsername = validateUsername();
    const isValidEmail = validateEmail();
    const isValidPassword = validatePassword();
    const isValidPhone = validatePhone();
    const isValidAdress = validateAdress();

    if (isValidUsername && isValidEmail && isValidPassword && isValidPhone && isValidAdress) {
        console.log("Form is valid.");
        const username = document.querySelector('input[name="username"]');
        const password = document.querySelector('input[name="password"]');
        const email = document.querySelector('input[name="email"]');
        const phone = document.querySelector('input[name="telefon"]');
        const adresa = document.querySelector('input[name="adresa"]');



        const userData = {
            username: username.value,
            password: password.value,
            email: email.value,
            phone: phone.value,
            adresa: adresa.value,
        };



        fetch("register.html", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)

        })
            .then(async (response) => {
                if (response.ok) {
                    window.location.href = "./login.html";
                } else {
                    const errorMessage = await response.text();
                    console.error(errorMessage);
                    alert('Failed to register');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

const submitButton = document.querySelector('.submit');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    validateForm();
});

