// validation.js
var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var confirmPasswordInput = document.getElementById("confirmPassword");
var submitBtn = document.getElementById("btn-login");

submitBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Mencegah form untuk submit dan reload halaman

    let valid = true;

    if (!validationEmail()) {
        valid = false;
    }
    if (!validPassword()) {
        valid = false;
    }
    if (!validConfirmPassword()) {
        valid = false;
    }

    if (valid) {
        saveData();
        updateUserName();
        reset();
        window.location.href = "index.html"; // Arahkan ke halaman setelah login
    }
});

function validationEmail() {
    var emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailReg.test(emailInput.value)) {
        emailInput.style.border = "2px solid red";
        return false;
    } else {
        emailInput.style.border = "2px solid #3a3a3d";
        return true;
    }
}

function validPassword() {
    if (passwordInput.value.length < 8) {
        passwordInput.style.border = "2px solid red";
        return false;
    } else {
        passwordInput.style.border = "2px solid #3a3a3d";
        return true;
    }
}

function validConfirmPassword() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.border = "2px solid red";
        return false;
    } else {
        confirmPasswordInput.style.border = "2px solid #3a3a3d";
        return true;
    }
}

function saveData() {
    var email = emailInput.value;
    var password = passwordInput.value;
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
}

function updateUserName() {
    var email = emailInput.value;
    var userName = email.split("@")[0]; // Ambil bagian sebelum '@' dari email
    localStorage.setItem("userName", userName); // Simpan nama pengguna di localStorage
    // Mengubah teks pada elemen dengan id "user_name" jika sudah ada di halaman yang lain
    document.getElementById("user_name").textContent = userName;
}

function reset() {
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
}
