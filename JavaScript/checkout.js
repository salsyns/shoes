window.addEventListener("load", function() {
    clearCart();
    let totalPrice = document.getElementById("total_price");
    showCheckAnimation();
    addDate();
    let total = localStorage.getItem('total_price'); // Pastikan kunci yang benar
    if (total) {
        total = parseFloat(total);
        totalPrice.innerHTML = formatPrice(total); // Update to use formatPrice function
    } else {
        totalPrice.innerHTML = formatPrice(0); // Update to use formatPrice function
    }
});

function showCheckAnimation() {
    const checkIconContainer = document.getElementById('checkoutIcon');
    checkIconContainer.innerHTML = '';
    const newCheckIcon = document.createElement('div');
    newCheckIcon.style.width = '200px';
    newCheckIcon.style.height = '200px';
    checkIconContainer.appendChild(newCheckIcon);

    lottie.loadAnimation({
        container: newCheckIcon,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'json/AnimationCheckoutPage.json' 
    });
}

function addDate() {
    let date = document.getElementById("order_date");
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = now.getDate(); 
    const month = months[now.getMonth()]; 
    const year = now.getFullYear();
    date.innerHTML  = `${day} ${month} ${year}`; // Menghapus spasi di depan
}

function clearCart() {
    localStorage.removeItem('cart');
}

function backHome() {
    window.location.href = "index.html"; 
}

// Helper function to format prices
function formatPrice(price) {
    // Format the price as "Rp1.200.000"
    return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}