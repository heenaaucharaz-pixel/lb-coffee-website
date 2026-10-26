
// Selecting the category buttons and product cards
const categoryButtons = document.querySelectorAll(".category-button");
const productCards = document.querySelectorAll(".product-card");


// Identifying each product's category from its name
function getProductCategory(card) {

    const name = card.querySelector("h3").textContent.toLowerCase();

    if (name.includes("burger")) {
        return "burgers";
    }

    if (
        name.includes("tagliatelle") ||
        name.includes("penne") ||
        name.includes("spaghetti")
    ) {
        return "pasta";
    }

    if (
        name.includes("iced tea") ||
        name.includes("latte") ||
        name.includes("americano")
    ) {
        return "drinks";
    }

    return "desserts";
}


// Filtering products when a category is selected
function filterProducts(category) {

    let visibleProducts = 0;

    productCards.forEach(function(card) {

        const productCategory = getProductCategory(card);

        if (category === "all" || productCategory === category) {
            card.style.display = "";
            visibleProducts++;
        } else {
            card.style.display = "none";
        }

    });

    // Displaying a message when no products match the category
    let message = document.getElementById("no-products-message");

    if (!message) {
        message = document.createElement("p");
        message.id = "no-products-message";
        message.textContent = "No products found in this category.";
        document.querySelector(".product-grid").after(message);
    }

    message.hidden = visibleProducts !== 0;
}


// Handling category button clicks
categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.textContent.trim().toLowerCase();

        filterProducts(category);

    });

});


// Displaying a message below the Add to Cart button
function showMessage(card, text, isError) {

    let message = card.querySelector(".product-message");

    if (!message) {
        message = document.createElement("p");
        message.className = "product-message";

        card.querySelector(".add-cart")
            .insertAdjacentElement("afterend", message);
    }

    message.textContent = text;
    message.className = isError
        ? "product-message error"
        : "product-message";
}


// Retrieving product details and selected options
function getProductDetails(card) {

    const name = card.querySelector("h3").textContent.trim();
    const image = card.querySelector("img").getAttribute("src");
    const category = getProductCategory(card);

    const priceElement = card.querySelector(".product-price");

    let price = priceElement
        ? Number(priceElement.textContent.replace(/[^\d.]/g, ""))
        : 0;

    const options = [];

    // Checking required radio-button selections
    const radioInputs = Array.from(
        card.querySelectorAll('input[type="radio"]')
    );

    const radioNames = [...new Set(
        radioInputs.map(function(input) {
            return input.name;
        })
    )];

    for (const radioName of radioNames) {

        const selected = radioInputs.find(function(input) {
            return input.name === radioName && input.checked;
        });

        if (!selected) {

            const group = radioInputs.find(function(input) {
                return input.name === radioName;
            }).closest(".product-addons");

            const heading = group.querySelector("h4").textContent.trim();

            return {
                error: "Please select an option: " + heading + "."
            };
        }

        const group = selected.closest(".product-addons");
        const heading = group.querySelector("h4").textContent.trim();
        const label = selected.closest("label");

        options.push(heading + ": " + selected.value);

        // Getting the price from the selected drink size
        if (heading.toLowerCase().includes("size")) {

            const priceMatch = label.textContent.match(/Rs\s*(\d+)/i);

            if (priceMatch) {
                price = Number(priceMatch[1]);
            }
        }
    }

    // Adding the prices of selected extras
    const checkedAddons = card.querySelectorAll(
        '.product-addons input[type="checkbox"]:checked'
    );

    checkedAddons.forEach(function(input) {

        const label = input.closest("label");
        const addonName = label.textContent
            .replace(/\+\s*Rs\s*\d+/gi, "")
            .trim()
            .replace(/\s+/g, " ");

        const group = input.closest(".product-addons");
        const heading = group.querySelector("h4").textContent.trim();

        options.push(heading + ": " + addonName);
        price += Number(input.value) || 0;

    });

    return {
        name: name,
        image: image,
        category: category,
        price: price,
        options: options
    };
}


// Adding a product to the shopping cart
function addToCart(card) {

    const product = getProductDetails(card);

    if (product.error) {
        showMessage(card, product.error, true);
        return;
    }

    // Retrieving the existing cart
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("lbsCoffeeCart")) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        cart = [];
    }

    // Identifying products by name and selected options
    const optionKey = product.options.slice().sort().join("|");
    const productKey = product.name + "::" + optionKey;

    const existingProduct = cart.find(function(item) {
        return item.key === productKey;
    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            key: productKey,
            name: product.name,
            image: product.image,
            category: product.category,
            price: product.price,
            quantity: 1,
            options: product.options
        });

    }

    // Saving the updated cart in browser storage
    try {
        localStorage.setItem("lbsCoffeeCart", JSON.stringify(cart));
        showMessage(card, "Added to Cart!", false);
    } catch (error) {
        showMessage(card, "Unable to save your cart. Please try again.", true);
    }
}


// Handling Add to Cart button clicks
document.querySelectorAll(".add-cart").forEach(function(button) {

    button.addEventListener("click", function() {

        const card = button.closest(".product-card");

        addToCart(card);

    });

});
