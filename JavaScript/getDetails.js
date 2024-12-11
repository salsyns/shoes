const params = new URL(location.href).searchParams;
const productId = params.get('productId');
let quantity = document.getElementById("productCount");
getData();

async function getData(){
    try {
        let response = await fetch('json/products.json');
        let json = await response.json();
        let product = json.find(item => item.id == productId); 

        if (product) {
            displayDetails(product);
        } else {
            console.error('Product tidak ditemukan');
        }
    } catch (error) {
        console.error('Error fetching the data', error);
    }
}

function displayDetails(product){
    let productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id", product.id);
    
    document.getElementById("product_image").src = product.images[0];
    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;
    document.querySelector(".product_stok").innerHTML = "Stok: " + product.stok;

    const linkAdd = document.getElementById("btn_add");
    const minusButton = document.getElementById("minus");
    const plusButton = document.getElementById("plus");

    // Disable add to cart button if stock is 0
    if (product.stok === 0) {
        linkAdd.disabled = true;
        
    }

    linkAdd.addEventListener('click', function(event) {
        event.preventDefault();
        addToCart(product.id, parseInt(quantity.value) || 1); 
        showToast();
    });

    // Disable or enable the plus/minus buttons based on stock
    minusButton.addEventListener("click", function() {
        let value = parseInt(quantity.value) || 1;
        if (value > 1) {
            quantity.value = value - 1;
            updateStockDisplay(product, quantity.value); // Update stock display
        }
    });

    plusButton.addEventListener("click", function() {
        let value = parseInt(quantity.value) || 1;
        if (value < product.stok) {
            quantity.value = value + 1;
            updateStockDisplay(product, quantity.value); // Update stock display
        } else {
            // Optional: Notify user if trying to exceed stock
            alert("Stok tidak cukup.");
        }
    });
}

// Function to update the displayed stock dynamically
function updateStockDisplay(product, newQuantity) {
    let remainingStock = product.stok - newQuantity;
    document.querySelector(".product_stok").innerHTML = "Stok: " + remainingStock;
}

function showToast() {
    const toastOverlay = document.getElementById("toast-overlay");
    toastOverlay.classList.add("show");
    showCheckAnimation();
    setTimeout(() => {
        toastOverlay.classList.remove("show");
        showCart();
    }, 1000);
}

function showCart(){
    let body = document.querySelector('body');
    body.classList.add('showCart');
}

function showCheckAnimation(){
    const checkIconContainer = document.getElementById('checkIcon');
    checkIconContainer.innerHTML = '';
    const newCheckIcon = document.createElement('div');
    newCheckIcon.style.width = '100px';
    newCheckIcon.style.height = '100px';
    checkIconContainer.appendChild(newCheckIcon);

    lottie.loadAnimation({
        container: newCheckIcon,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'json/Animation check.json'
    });
}
