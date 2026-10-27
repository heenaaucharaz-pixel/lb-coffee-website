const categoryButtons = document.querySelectorAll(".category-button");
const productGrid = document.querySelector(".product-grid");

const originalProductCards = Array.from(
    document.querySelectorAll(".product-card")
);

function getProductCategory(card) {

    if (card.dataset.category) {
        return card.dataset.category;
    }

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


// ============================================
// AJAX – RETRIEVING PRODUCTS FROM PHP
// ============================================

async function filterProducts(category) {

    try {

        const response = await fetch(
            "get-products.php?category=" + encodeURIComponent(category)
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve products.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
            throw new Error("Invalid product response.");
        }

        displayProducts(data.products);

    }

    catch (error) {

        console.error("AJAX Error:", error);

        displayLocalProducts(category);

    }

}

function displayProducts(products) {

    productGrid.innerHTML = "";

    const oldMessage = document.getElementById("no-products-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    products.forEach(function(product) {

        const productCard = createProductCard(product);

        productGrid.appendChild(productCard);

    });

    if (products.length === 0) {

        const message = document.createElement("p");

        message.id = "no-products-message";
        message.textContent = "No products found in this category.";

        productGrid.after(message);

    }

}


function createProductCard(product) {

    const template = originalProductCards.find(function(card) {

        const name = card.querySelector("h3").textContent.trim();

        return name.toLowerCase() ===
            product.product_name.trim().toLowerCase();

    });

    if (template) {

        const card = template.cloneNode(true);

        card.dataset.category = product.category.toLowerCase();

        card.querySelector("h3").textContent = product.product_name;

        const image = card.querySelector("img");

        if (image && product.image) {
            image.src = product.image;
        }

        const price = card.querySelector(".product-price");

        if (price && product.price !== undefined) {
            price.textContent = "Rs " + product.price;
        }

        return card;

    }

    const card = document.createElement("div");

    card.className = "product-card";
    card.dataset.category = product.category.toLowerCase();

    card.innerHTML = `
        <img src="${product.image}" alt="${product.product_name}">

        <div class="product-info">
            <h3>${product.product_name}</h3>

            <p>${product.description || ""}</p>

            <p class="product-price">Rs ${product.price}</p>

            <button class="add-cart">Add to Cart</button>
        </div>
    `;

    return card;

}

function displayLocalProducts(category) {

    productGrid.innerHTML = "";

    const oldMessage = document.getElementById("no-products-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    let visibleProducts = 0;

    originalProductCards.forEach(function(card) {

        const productCategory = getProductCategory(card);

        if (category === "all" || productCategory === category) {

            productGrid.appendChild(card);
            visibleProducts++;

        }

    });

    if (visibleProducts === 0) {

        const message = document.createElement("p");

        message.id = "no-products-message";
        message.textContent = "No products found in this category.";

        productGrid.after(message);

    }

}

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


AJAX – LOADING PRODUCTS WHEN THE PAGE OPENS
filterProducts("all");
