
// Selecting the contact form and its input fields
const contactForm = document.querySelector(".message-card form");

const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");


// Creating a message area for form feedback
const formMessage = document.createElement("p");
formMessage.id = "contact-form-message";
formMessage.setAttribute("aria-live", "polite");

contactForm.appendChild(formMessage);


// Displaying a validation message beneath an input field
function showError(input, text) {

    let error = input.parentElement.querySelector(".contact-error");

    if (!error) {
        error = document.createElement("small");
        error.className = "contact-error";
        error.setAttribute("aria-live", "polite");
        input.insertAdjacentElement("afterend", error);
    }

    error.textContent = text;
}


// Validating the customer's full name
function validateName() {

    const namePattern = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;

    if (!namePattern.test(fullName.value.trim())) {
        showError(fullName, "Please enter a valid full name.");
        return false;
    }

    showError(fullName, "");
    return true;
}


// Validating the email address using a regular expression
function validateEmail() {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        return false;
    }

    showError(email, "");
    return true;
}


// Checking that the subject is not empty
function validateSubject() {

    if (subject.value.trim() === "") {
        showError(subject, "Please enter a subject.");
        return false;
    }

    showError(subject, "");
    return true;
}


// Checking that the customer has entered a message
function validateMessage() {

    if (message.value.trim() === "") {
        showError(message, "Please enter your message.");
        return false;
    }

    showError(message, "");
    return true;
}


// Validating a field when the customer leaves it
function addValidation(input, validationFunction) {

    input.addEventListener("blur", function() {
        input.dataset.touched = "true";
        validationFunction();
    });

    input.addEventListener("input", function() {

        formMessage.textContent = "";

        if (input.dataset.touched === "true") {
            validationFunction();
        }
    });
}


// Applying validation to each contact form field
addValidation(fullName, validateName);
addValidation(email, validateEmail);
addValidation(subject, validateSubject);
addValidation(message, validateMessage);


// Validating the form when Send Message is clicked
contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const subjectValid = validateSubject();
    const messageValid = validateMessage();

    if (
        nameValid &&
        emailValid &&
        subjectValid &&
        messageValid
    ) {
        formMessage.textContent =
            "Your message has passed validation. It is ready for submission.";

    } else {
        formMessage.textContent =
            "Please correct the highlighted fields.";
    }
});
