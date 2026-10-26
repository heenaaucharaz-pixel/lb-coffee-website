
// Selecting HTML elements
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");
const formMessage = document.getElementById("form-message");

// Login inputs
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Registration inputs
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const confirmPassword = document.getElementById("signup-confirm-password");

// Validation messages
const loginEmailMessage = document.getElementById("login-email-message");
const loginPasswordMessage = document.getElementById("login-password-message");
const signupNameMessage = document.getElementById("signup-name-message");
const signupEmailMessage = document.getElementById("signup-email-message");
const signupPasswordMessage = document.getElementById("signup-password-message");
const confirmPasswordMessage = document.getElementById("signup-confirm-password-message");
const passwordStrength = document.getElementById("signup-password-strength");


// Clearing messages when switching forms
function clearMessages() {
    document.querySelectorAll(".field-message").forEach(function(message) {
        message.textContent = "";
    });

    passwordStrength.textContent = "";
    passwordStrength.className = "password-strength";
    formMessage.textContent = "";

    document.querySelectorAll(".login-input input").forEach(function(input) {
        delete input.dataset.touched;
    });
}


// Switching between Login and Create Account
loginTab.addEventListener("click", function() {
    loginForm.hidden = false;
    signupForm.hidden = true;

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    formTitle.textContent = "Welcome Back";
    formDescription.textContent = "Please sign in to your account";

    clearMessages();
});

signupTab.addEventListener("click", function() {
    loginForm.hidden = true;
    signupForm.hidden = false;

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    formTitle.textContent = "Create Account";
    formDescription.textContent = "Enter your details to get started";

    clearMessages();
});


// Validating email using a regular expression
function validateEmail(input, message) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(input.value.trim())) {
        message.textContent = "Please enter a valid email address.";
        return false;
    }

    message.textContent = "";
    return true;
}


// Validating the customer's full name
function validateName() {
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    if (!namePattern.test(signupName.value.trim())) {
        signupNameMessage.textContent = "Please enter a valid full name.";
        return false;
    }

    signupNameMessage.textContent = "";
    return true;
}


// Checking password strength
function updatePasswordStrength() {
    const password = signupPassword.value;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password === "") {
        passwordStrength.textContent = "";
        passwordStrength.className = "password-strength";
    } else if (score <= 2) {
        passwordStrength.textContent = "Weak password";
        passwordStrength.className = "password-strength strength-weak";
    } else if (score <= 4) {
        passwordStrength.textContent = "Fair password";
        passwordStrength.className = "password-strength strength-fair";
    } else {
        passwordStrength.textContent = "Strong password";
        passwordStrength.className = "password-strength strength-strong";
    }
}


// Checking password requirements using a regular expression
function validateSignupPassword() {
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordPattern.test(signupPassword.value)) {
        signupPasswordMessage.textContent =
            "Use 8 or more characters with uppercase, lowercase, a number and a special character.";
        return false;
    }

    signupPasswordMessage.textContent = "";
    return true;
}


// Checking whether both passwords match
function validateConfirmPassword() {
    if (confirmPassword.value === "") {
        confirmPasswordMessage.textContent = "Please confirm your password.";
        return false;
    }

    if (signupPassword.value !== confirmPassword.value) {
        confirmPasswordMessage.textContent = "Passwords do not match.";
        return false;
    }

    confirmPasswordMessage.textContent = "";
    return true;
}


// Reusable function for displaying validation messages
function addValidation(input, validationFunction) {
    input.addEventListener("blur", function() {
        input.dataset.touched = "true";
        validationFunction();
    });

    input.addEventListener("input", function() {
        if (input.dataset.touched === "true") {
            validationFunction();
        }

        formMessage.textContent = "";
    });
}


// Applying validation to the Login form
addValidation(loginEmail, function() {
    validateEmail(loginEmail, loginEmailMessage);
});

addValidation(loginPassword, function() {
    if (loginPassword.value.length < 8) {
        loginPasswordMessage.textContent = "Password must contain at least 8 characters.";
    } else {
        loginPasswordMessage.textContent = "";
    }
});


// Applying validation to the Registration form
addValidation(signupName, validateName);

addValidation(signupEmail, function() {
    validateEmail(signupEmail, signupEmailMessage);
});

addValidation(signupPassword, function() {
    updatePasswordStrength();
    validateSignupPassword();
});

addValidation(confirmPassword, validateConfirmPassword);

// Updating password strength and confirmation while typing
signupPassword.addEventListener("input", function() {
    updatePasswordStrength();

    if (confirmPassword.dataset.touched === "true") {
        validateConfirmPassword();
    }
});


// Validating the Login form when submitted
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    loginEmail.dataset.touched = "true";
    loginPassword.dataset.touched = "true";

    const emailValid = validateEmail(loginEmail, loginEmailMessage);
    const passwordValid = loginPassword.value.length >= 8;

    if (passwordValid) {
        loginPasswordMessage.textContent = "";
    } else {
        loginPasswordMessage.textContent = "Password must contain at least 8 characters.";
    }

    formMessage.textContent = emailValid && passwordValid
        ? "Login form validated successfully."
        : "Please correct the highlighted fields.";
});


// Validating the Registration form when submitted
signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    signupName.dataset.touched = "true";
    signupEmail.dataset.touched = "true";
    signupPassword.dataset.touched = "true";
    confirmPassword.dataset.touched = "true";

    const nameValid = validateName();
    const emailValid = validateEmail(signupEmail, signupEmailMessage);
    const passwordValid = validateSignupPassword();
    const confirmValid = validateConfirmPassword();

    formMessage.textContent =
        nameValid && emailValid && passwordValid && confirmValid
            ? "Registration form validated successfully."
            : "Please correct the highlighted fields.";
});
