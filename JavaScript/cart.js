let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");

loadCart();
getData();
checkCart();

async function getData() {
    try {
        let response = await fetch('json/products.json');
        if (!response.ok) {
            throw new Error("Failed to fetch product data.");
        }
        products = await response.json();
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (error) {
            console.error("Error parsing cart data from localStorage:", error);
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, inputQuantity = 1) {
    let product = products.find(p => p.id == productId);
    if (product) {
        let existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += inputQuantity;
        } else {
            let productWithQuantity = { ...product, quantity: inputQuantity };
            cart.push(productWithQuantity);
        }
        saveCart();
        checkCart();
    } else {
        console.warn("Product not found with ID:", productId);
    }
}

function parsePrice(priceString) {
    return parseFloat(priceString.replace(/Rp|[.,]/g, '').trim()) || 0;
}

function formatPrice(price) {
    return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function addCartToHTML() {
    let content = ``;
    cart.forEach((product, index) => {
        let price = parsePrice(product.price);
        let totalPrice = price * product.quantity;
        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src=${product.images[0]} alt="${product.name}">
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">${product.price}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus" onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" inputmode="numeric" name="productCount" min="1" step="1" max="999"
                            class="product_count" value=${product.quantity}>
                        <button class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">${formatPrice(totalPrice)}</span>
                </div>
            </div>
        </div>`;
    });
    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    checkCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        checkCart();
    } else {
        removeFromCart(index);
    }
}

function updateTotalPrice() {
    let total = cart.reduce((sum, product) => {
        let price = parsePrice(product.price);
        return sum + (price * product.quantity);
    }, 0);
    if (totalPrice) {
        totalPrice.innerHTML = formatPrice(total);
    }
    return total;
}

function checkCart() {
    if (cart.length === 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Keranjang belanja kosong.";
        });
        if (cartCounter) cartCounter.innerHTML = 0;
        if (btnControl) btnControl.style.display = "none";
        if (cartTotal) cartTotal.style.display = "none";
        checkCartPage(0, 0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        });
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        if (cartCounter) cartCounter.innerHTML = totalQuantity;
        if (btnControl) btnControl.style.display = "flex";
        if (cartTotal) cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total, totalQuantity);
    }
}

function checkCartPage(total, totalQuantity) {
    if (window.location.pathname.includes("cartPage.html")) {
        let subTotal = document.getElementById("Subtotal");
        let totalOrder = document.getElementById("total_order");
        if (cartItemsCount) {
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
        }
        if (subTotal && totalOrder) {
            subTotal.innerHTML = formatPrice(total);
            totalOrder.innerHTML = formatPrice(total + 20000); // Add shipping cost
        }
    }
}

function checkOut() {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    if (cart.length !== 0) {
        let total = updateTotalPrice();
        localStorage.setItem('total_price', total);
        if (email && password) {
            window.location.href = "checkout.html";
        } else {
            window.location.href = "login.html";
        }
    }
}
