window.addEventListener("load", function() {
    displayUserHistory(); // Panggil fungsi dengan nama yang benar
});

function displayUserHistory() { // Ubah nama fungsi di sini
    const userHistoryList = document.getElementById("userHistoryList");
    userHistoryList.innerHTML = ''; // Clear existing content

    // Ambil data pesanan dari localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        userHistoryList.innerHTML = '<li>Tidak ada riwayat pembelian.</li>';
        return;
    }

    orders.forEach(order => {
        const listItem = document.createElement('li');
        listItem.innerText = `ID Pesanan: ${order.id}, Total: ${formatPrice(order.total)}, Tanggal: ${new Date(order.date).toLocaleDateString('id-ID')}`;
        userHistoryList.appendChild(listItem);
    });
}

function backHome() {
    window.location.href = "index.html"; 
}

function formatPrice(price) {
    return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}