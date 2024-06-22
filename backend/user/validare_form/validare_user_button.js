document.addEventListener('DOMContentLoaded', () => {
    const sessionId = localStorage.getItem("sessionId");
    const usernameButton = document.getElementById('username');
    const loginButton = document.getElementById('loginBtn'); // Butonul de "Sign In"
    const dropdownContent = document.querySelector('.dropdown-content');
    const rssButton = document.getElementById('RSS');

    if (!sessionId) {
        if (usernameButton) {
            usernameButton.style.display = 'none';
        }
        if (loginButton) {
            loginButton.style.display = 'block';
        }
        if (dropdownContent) {
            dropdownContent.style.display = 'none';
        }
        if (rssButton) {
            rssButton.style.display = 'none';
        }
        return;
    }


    if (loginButton) {
        loginButton.style.display = 'none';
    }

    fetch('/get-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: sessionId
    })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                usernameButton.innerText = data.username;
            } else {
                if (usernameButton) {
                    usernameButton.style.display = 'none';
                }
                if (dropdownContent) {
                    dropdownContent.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching username:', error);
            if (usernameButton) {
                usernameButton.style.display = 'none';
            }
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });

    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    rssButton.addEventListener('click', function () {
        redirectToRSSFeed();
    });

    function redirectToRSSFeed() {
        const rssFeedUrl = 'http://localhost:3000/rss';
        window.location.href = rssFeedUrl;
    }
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};

