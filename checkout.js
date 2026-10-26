
// Selecting the checkout form and order summary elements
const checkoutForm = document.querySelector(".checkout-form form");
const checkoutProducts = document.querySelector(".checkout-products");
const totalRows = document.querySelectorAll(".checkout-total-row");

// Selecting the delivery information fields
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

// Setting the delivery fee
const deliveryFee = 175;


// Creating a general feedback message
const checkoutMessage = document.createElement("p");
checkoutMessage.id = "checkout-message";
checkoutMessage.setAttribute("aria-live", "polite");
checkoutForm.appendChild(checkoutMessage);


// Formatting prices in Mauritian rupees
function formatPrice(amount) {
    return "Rs " + amount;
}


// Retrieving cart items from localStorage
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("lbsCoffeeCart")) || [];
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}


// Displaying validation messages under the relevant fields
function showFieldError(input, message) {
    let error = input.parentElement.querySelector(".checkout-error");

    if (!error) {
        error = document.createElement("small");
        error.className = "checkout-error";
        error.setAttribute("aria-live", "polite");
        input.insertAdjacentElement("afterend", error);
    }

    error.textContent = message;
}


// Validating the customer's full name
function validateName() {
    const namePattern = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;

    if (!namePattern.test(fullName.value.trim())) {
        showFieldError(fullName, "Please enter a valid full name.");
        return false;
    }

    showFieldError(fullName, "");
    return true;
}


// Validating the email address
function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        showFieldError(email, "Please enter a valid email address.");
        return false;
    }

    showFieldError(email, "");
    return true;
}


// Validating the phone number
function validatePhone() {
    const digits = phone.value.replace(/\D/g, "");
    const phonePattern = /^\+?[\d\s()-]+$/;

    if (!phonePattern.test(phone.value.trim()) ||
        digits.length < 7 ||
        digits.length > 15) {

        showFieldError(phone, "Please enter a valid phone number.");
        return false;
    }

    showFieldError(phone, "");
    return true;
}


// Checking that a delivery address has been entered
function validateAddress() {
    if (address.value.trim() === "") {
        showFieldError(address, "Please enter your delivery address.");
        return false;
    }

    showFieldError(address, "");
    return true;
}


// Validating the selected delivery and payment options
function validateOption(optionName, message) {
    const selectedOption = checkoutForm.querySelector(
        'input[name="' + optionName + '"]:checked'
    );

    const section = checkoutForm.querySelector(
        'input[name="' + optionName + '"]'
    ).closest(".checkout-section");

    let error = section.querySelector(".checkout-group-error");

    if (!error) {
        error = document.createElement("small");
        error.className = "checkout-error checkout-group-error";
        error.setAttribute("aria-live", "polite");
        section.appendChild(error);
    }

    if (!selectedOption) {
        error.textContent = message;
        return false;
    }

    error.textContent = "";
    return true;
}


// Displaying cart products in the order summary
function displayOrderSummary() {
    const cart = getCart();

    checkoutProducts.replaceChildren();

    let subtotal = 0;

    if (cart.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your cart is currently empty.";
        checkoutProducts.appendChild(message);
    }

    cart.forEach(function(item) {
        const itemRow = document.createElement("div");
        itemRow.className = "checkout-product-item";

        const name = document.createElement("p");
        name.textContent = item.name + " × " + item.quantity;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price * item.quantity);

        itemRow.appendChild(name);
        itemRow.appendChild(price);

        // Displaying selected sizes, flavours and add-ons
        if (item.options && item.options.length > 0) {
            const options = document.createElement("small");
            options.textContent = item.options.join(", ");
            itemRow.appendChild(options);
        }

        checkoutProducts.appendChild(itemRow);

        subtotal += Number(item.price) * Number(item.quantity);
    });

    // Calculating delivery and estimated total
    const delivery = cart.length > 0 ? deliveryFee : 0;
    const total = subtotal + delivery;

    totalRows[0].children[1].textContent = formatPrice(subtotal);
    totalRows[1].children[1].textContent = formatPrice(delivery);
    totalRows[2].children[1].textContent = formatPrice(total);
}


// Rechecking fields when the customer corrects an invalid entry
[
    [fullName, validateName],
    [email, validateEmail],
    [phone, validatePhone],
    [address, validateAddress]
].forEach(function(field) {

    field[0].addEventListener("input", function() {
        const error = field[0].parentElement.querySelector(".checkout-error");

        if (error && error.textContent) {
            field[1]();
        }
    });

});


// Clearing payment and delivery warnings when an option is selected
checkoutForm.querySelectorAll(
    'input[name="delivery"], input[name="payment"]'
).forEach(function(input) {

    input.addEventListener("change", function() {
        const section = input.closest(".checkout-section");
        const error = section.querySelector(".checkout-group-error");

        if (error) {
            error.textContent = "";
        }
    });

});


// Validating the form when the customer clicks Place Order
checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    checkoutMessage.textContent = "";

    const cart = getCart();

    // Preventing checkout when there are no products
    if (cart.length === 0) {
        checkoutMessage.textContent =
            "Your cart is empty. Please add products before checkout.";
        return;
    }

    // Checking all delivery information
    const nameValid = validateName();
    const emailValid = validateEmail();
    const phoneValid = validatePhone();
    const addressValid = validateAddress();

    // Checking the delivery and payment selections
    const deliveryValid = validateOption(
        "delivery",
        "Please select a delivery option."
    );

    const paymentValid = validateOption(
        "payment",
        "Please select a payment method."
    );

    // Displaying feedback based on the validation results
    if (
        nameValid &&
        emailValid &&
        phoneValid &&
        addressValid &&
        deliveryValid &&
        paymentValid
    ) {
        checkoutMessage.textContent =
            "Your checkout information is valid. Order submission requires PHP backend integration.";
    } else {
        checkoutMessage.textContent =
            "Please correct the highlighted fields.";
    }

});


// Displaying the current cart when checkout loads
displayOrderSummary();
