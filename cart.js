
// Selecting the cart elements
const cartItems = document.querySelector(".cart-items");
const summaryRows = document.querySelectorAll(".cart-summary .summary-row");
const checkoutButton = document.querySelector(".checkout-button");

// Setting the delivery fee
const deliveryFee = 175;


// Formatting prices in Mauritian rupees
function formatPrice(amount) {
    return "Rs " + amount;
}


// Retrieving the cart items from localStorage
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("lbsCoffeeCart")) || [];
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}


// Saving changes to localStorage
function saveCart(cart) {
    localStorage.setItem("lbsCoffeeCart", JSON.stringify(cart));
}


// Displaying the products in the cart
function displayCart() {
    const cart = getCart();

    // Clearing the existing cart display
    cartItems.replaceChildren();

    // Displaying a message when the cart is empty
    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Your cart is currently empty.";

        cartItems.appendChild(emptyMessage);
    }

    // Creating a section for each product
    cart.forEach(function(item) {
        const itemCard = document.createElement("div");
        itemCard.className = "cart-item";
        itemCard.dataset.key = item.key;

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price) + " each";

        details.appendChild(name);
        details.appendChild(price);

        // Displaying selected sizes, flavours and add-ons
        if (item.options && item.options.length > 0) {
            const options = document.createElement("p");
            options.className = "cart-item-options";
            options.textContent = item.options.join(", ");

            details.appendChild(options);
        }

        // Creating quantity controls
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.className = "cart-quantity";
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.dataset.action = "increase";
        increaseButton.setAttribute("aria-label", "Increase quantity");

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantity);
        quantityControls.appendChild(increaseButton);

        // Displaying the product subtotal
        const itemSubtotal = document.createElement("p");
        itemSubtotal.className = "cart-item-subtotal";
        itemSubtotal.textContent = formatPrice(item.price * item.quantity);

        // Creating the Remove button
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-item";
        removeButton.dataset.action = "remove";

        // Adding all elements to the product card
        itemCard.appendChild(image);
        itemCard.appendChild(details);
        itemCard.appendChild(quantityControls);
        itemCard.appendChild(itemSubtotal);
        itemCard.appendChild(removeButton);

        cartItems.appendChild(itemCard);
    });

    // Updating the subtotal and estimated total
    updateSummary(cart);

    // Disabling checkout when the cart is empty
    checkoutButton.style.pointerEvents = cart.length === 0 ? "none" : "";
    checkoutButton.style.opacity = cart.length === 0 ? "0.5" : "";
    checkoutButton.setAttribute("aria-disabled", cart.length === 0);
}


// Calculating the subtotal, delivery fee and total
function updateSummary(cart) {
    let subtotal = 0;

    cart.forEach(function(item) {
        subtotal += item.price * item.quantity;
    });

    const delivery = cart.length > 0 ? deliveryFee : 0;
    const total = subtotal + delivery;

    summaryRows[0].children[1].textContent = formatPrice(subtotal);
    summaryRows[1].children[1].textContent = formatPrice(delivery);
    summaryRows[2].children[1].textContent = formatPrice(total);
}


// Handling quantity changes and product removal
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const itemCard = button.closest(".cart-item");
    const productKey = itemCard.dataset.key;

    let cart = getCart();

    const item = cart.find(function(product) {
        return product.key === productKey;
    });

    if (!item) {
        return;
    }

    // Increasing the product quantity
    if (button.dataset.action === "increase") {
        item.quantity++;
    }

    // Decreasing the quantity without going below one
    else if (button.dataset.action === "decrease") {
        if (item.quantity > 1) {
            item.quantity--;
        }
    }

    // Removing the product from the cart
    else if (button.dataset.action === "remove") {
        cart = cart.filter(function(product) {
            return product.key !== productKey;
        });
    }

    // Saving the updated cart and refreshing the display
    try {
        saveCart(cart);
        displayCart();
    } catch (error) {
        alert("Unable to update your cart. Please try again.");
    }
});


// Displaying the cart when the page loads
displayCart();
