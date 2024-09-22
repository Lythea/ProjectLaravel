let username = '';
let usertype = '';
let password = '';
let verify_name;
let verify_type;
document.addEventListener("DOMContentLoaded", function() {
    const popupTrigger = document.getElementById("popupTrigger1");
    const popupContainer = document.getElementById("popupContainer1");

    // Show popup on span click
    popupTrigger.addEventListener("click", function() {
        popupContainer.style.display = "flex"; // Show the popup
    });

    // Close popup when clicking outside of the popup content
    window.addEventListener("click", function(event) {
        if (event.target === popupContainer) {
            popupContainer.style.display = "none"; // Hide the popup
        }
    });
});

function validateContact() {
    const contactInput = document.getElementById('contact');
    const contactValidation = document.getElementById('contactValidation');
    const value = contactInput.value;
    username = value;
    if (!contactInput || !contactValidation) {
        console.error("Contact input or validation element not found");
        return;
    }
    // Regular expressions for validation
    const phoneRegex = /^[0-9]{11,13}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (!phoneRegex.test(value) && !emailRegex.test(value)) {
        contactValidation.textContent = 'Invalid format: Must be Gmail or 11-13 digits.';
        contactValidation.style.display = 'block';
        document.getElementById('register').disabled = true; // Disable register button
    } else {
        contactValidation.style.display = 'none';
        if (phoneRegex.test(value)) {
            usertype = 'number';
            verify_type = true;
            enablebutton();
        } else if (emailRegex.test(value)) {
            usertype = 'email';
            verify_type = true;
            enablebutton();
        }
        document.getElementById('register').disabled = false; // Enable register button
        document.getElementById('login').disabled = false; 
    }
    console.log(usertype + phoneRegex.test(value) + ' ' + value + emailRegex.test(value) + ' ' + value);
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordValidation = document.getElementById('passwordValidation');
    const value = passwordInput.value;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength)) {
        passwordValidation.textContent = 'Weak password: Must include an upper, lower, number, symbol, and be at least 8 characters.';
        passwordValidation.style.display = 'block';
        document.getElementById('register').disabled = true; 
        document.getElementById('login').disabled = true; 
    } else {
        passwordValidation.style.display = 'none';
        console.log(value + true);
        verify_name= true;
        password = value;
        enablebutton();
    }
}
function enablebutton(){
    if (verify_name ==true && verify_type==true){
        document.getElementById('register').disabled = false;
        document.getElementById('login').disabled = false;  
    }
}
function registerFunction(event) {
    event.preventDefault();
    fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            usertype: usertype,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.errors.username ? errorData.errors.username[0] : 'An error occurred');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Login Successfully', data);
    })
    .catch((error) => {
        alert('Error: ' + error.message);
    });
}

function loginFunction(event) {
    event.preventDefault();
    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('api_token', data.token);
            console.log('Login successful');
            window.location.href = '/dashboard';
        } else {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
