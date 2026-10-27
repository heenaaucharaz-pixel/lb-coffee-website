

const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");
const formMessage = document.getElementById("form-message");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const confirmPassword = document.getElementById("signup-confirm-password");
const loginEmailMessage = document.getElementById("login-email-message");
const loginPasswordMessage = document.getElementById("login-password-message");
const signupNameMessage = document.getElementById("signup-name-message");
const signupEmailMessage = document.getElementById("signup-email-message");
const signupPasswordMessage = document.getElementById("signup-password-message");
const confirmPasswordMessage = document.getElementById("signup-confirm-password-message");

function clearMessages() {
    document.querySelectorAll(".field-message").forEach(function(message) {
        message.textContent = "";
    });

    formMessage.textContent = "";
}


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

function validateEmail(input, message) {
    const email = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        message.textContent = "Please enter your email address.";
        return false;
    }
    if (!emailPattern.test(email)) {
        message.textContent = "Please enter a valid email address.";
        return false;
    }
    message.textContent = "";
    return true;
}
function validateName() {
    const name = signupName.value.trim();
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    if (name === "") {
        signupNameMessage.textContent = "Please enter your full name.";
        return false;
    }
    if (!namePattern.test(name)) {
        signupNameMessage.textContent = "Please enter a valid full name.";
        return false;
    }
    signupNameMessage.textContent = "";
    return true;
}
function validatePassword(input, message) {
    if (input.value === "") {
        message.textContent = "Please enter your password.";
        return false;
    }
    if (input.value.length < 8) {
        message.textContent = "Password must contain at least 8 characters.";
        return false;
    }
    message.textContent = "";
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
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    formMessage.textContent = "";

    const emailValid = validateEmail(loginEmail, loginEmailMessage);
    const passwordValid = validatePassword(loginPassword, loginPasswordMessage);

    if (emailValid && passwordValid) {
        formMessage.textContent = "Login form validated successfully.";
    } else {
        formMessage.textContent = "Please correct the highlighted fields.";
    }
});
signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    formMessage.textContent = "";

    const nameValid = validateName();
    const emailValid = validateEmail(
        signupEmail,
        signupEmailMessage
    );
    const passwordValid = validatePassword(
        signupPassword,
        signupPasswordMessage
    );
    const confirmValid = validateConfirmPassword();

    // Checking which validations passed
    console.log({
        nameValid,
        emailValid,
        passwordValid,
        confirmValid
    });

    if (nameValid && emailValid && passwordValid && confirmValid) {
        formMessage.textContent =
            "Registration form validated successfully.";
    } else {
        formMessage.textContent =
            "Please correct the highlighted fields.";
    }
});
