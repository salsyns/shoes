window.addEventListener("load", function() {
    clearCart();
    let totalPrice = document.getElementById("total_price");
    showCheckAnimation();
    addDate();
    
    // Cek apakah ID pesanan sudah ada di localStorage
    let orderId = localStorage.getItem('order_id');
    if (!orderId) {
        // Jika tidak ada, buat ID pesanan baru
        orderId = generateOrderId();
        localStorage.setItem('order_id', orderId); // Simpan di localStorage
    }
    document.getElementById("id_order").innerText = orderId;

    let total = localStorage.getItem('total_price'); // Pastikan kunci yang benar
    if (total) {
        total = parseFloat(total);
        totalPrice.innerHTML = formatPrice(total); // Update untuk menggunakan fungsi formatPrice
    } else {
        totalPrice.innerHTML = formatPrice(0); // Update untuk menggunakan fungsi formatPrice
    }

    // Simpan detail pesanan ke localStorage
    saveOrderToLocal(orderId, total);
});

// Update fungsi untuk menginisiasi pembayaran QR di halaman checkout
function initiatePayment() {
    const orderId = localStorage.getItem('order_id');
    const totalPrice = parseFloat(localStorage.getItem('total_price'));

    if (orderId && totalPrice) {
        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, totalPrice }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.qrCodeUrl) {
                // Tampilkan QR code untuk pembayaran
                document.getElementById('qr-code').src = data.qrCodeUrl;
            } else {
                alert('Payment initiation failed');
            }
        })
        .catch(error => {
            console.error('Error initiating payment:', error);
            alert('Error initiating payment');
        });
} else {
    alert('Invalid order or price');
}
}

// Panggil fungsi ini saat pengguna siap melakukan pembayaran
document.getElementById('payment-button').addEventListener('click', initiatePayment);


function generateOrderId() {
    const randomNum = Math.floor(Math.random() * 10000); // Angka acak
    return `ORDERK4SHOES-${randomNum}`; // ID pesanan unik
}

function saveOrderToLocal(orderId, total) {
    const orderData = {
        id: orderId,
        total: total,
        date: new Date().toISOString()
    };

    // Ambil data pesanan yang sudah ada dari localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData); // Tambahkan pesanan baru ke array

    // Simpan kembali ke localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}

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
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
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
    localStorage.removeItem('order_id'); // Hapus ID pesanan
    window.location.href = "index.html"; 
}

// Fungsi pembantu untuk memformat harga
function formatPrice(price) {
    // Format harga sebagai "Rp1.200.000"
    return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}