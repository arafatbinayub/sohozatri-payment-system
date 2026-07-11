// ======================================
// SOHOZATRI LOGIN SYSTEM
// login.js - Part 1
// ======================================

// Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlvbYw_z6AxWdGNS_yN28DIaymggrQUGbt4OuGqMMP-h65ovoy9O-CI5A-aJZj4Brh/exec";

// Elements
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const togglePassword = document.getElementById("togglePassword");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");

// ==========================
// Remember Me
// ==========================

window.onload = function () {

    if (localStorage.getItem("remember") === "true") {

        username.value = localStorage.getItem("username") || "";

        rememberMe.checked = true;

    }

};

// ==========================
// Show / Hide Password
// ==========================

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ==========================
// Loader Functions
// ==========================

function showLoader() {

    loader.style.display = "flex";

}

function hideLoader() {

    loader.style.display = "none";

}
// ======================================
// LOGIN PROCESS
// login.js - Part 2
// ======================================

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    errorMsg.innerHTML = "";

    showLoader();

    try {

        const response = await fetch(

            SCRIPT_URL +
            "?action=login" +
            "&username=" + encodeURIComponent(username.value.trim()) +
            "&password=" + encodeURIComponent(password.value)

        );

        const result = await response.json();

        if (result.status === "success") {

            // Remember Me

            if (rememberMe.checked) {

                localStorage.setItem("remember", "true");

                localStorage.setItem("username", username.value.trim());

            } else {

                localStorage.removeItem("remember");

                localStorage.removeItem("username");

            }

            // Login Session

            sessionStorage.setItem("loggedIn", "true");
            // ======================================
// SUCCESS ANIMATION & AUTO REDIRECT
// login.js - Part 3
// ======================================

// Change Loader Content
loader.innerHTML = `

<div class="success-loader">

    <div class="success-circle">

        <i class="fa-solid fa-check"></i>

    </div>

    <h2>Login Successful</h2>

    <p>Redirecting to Admin Panel...</p>

</div>

`;

// Auto Redirect

setTimeout(function () {

    window.location.href = "admin.html";

}, 1500);

            // পরের Part-এ Success Animation থাকবে

        } else {

            hideLoader();

            errorMsg.innerHTML = result.message;

        }

    } catch (error) {

        hideLoader();

        errorMsg.innerHTML = "Server Connection Failed.";

        console.log(error);

    }

});
// ======================================
// login.js - Part 4 (Final)
// ======================================

// Login Success হলে Loader Reset হবে
window.addEventListener("pageshow", function () {

    if (loader) {

        loader.style.display = "none";

        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Please wait...</p>
        `;

    }

});

// Enter Key Support
username.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        password.focus();

    }

});

password.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        loginForm.requestSubmit();

    }

});

// Clear Error While Typing
username.addEventListener("input", function () {

    errorMsg.innerHTML = "";

});

password.addEventListener("input", function () {

    errorMsg.innerHTML = "";

});

// Prevent Going Back After Login
history.pushState(null, "", location.href);

window.onpopstate = function () {

    history.pushState(null, "", location.href);

};