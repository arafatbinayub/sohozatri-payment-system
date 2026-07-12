// =====================================
// SOHOZATRI ADMIN PANEL
// admin.js - Part 1
// =====================================

// Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlvbYw_z6AxWdGNS_yN28DIaymggrQUGbt4OuGqMMP-h65ovoy9O-CI5A-aJZj4Brh/exec";

// Login Check
if (sessionStorage.getItem("loggedIn") !== "true") {

    window.location.href = "login.html";

}

// Elements
const totalMembers = document.getElementById("totalMembers");
const totalCollection = document.getElementById("totalCollection");
const monthlyCollection = document.getElementById("monthlyCollection");
const todayCollection = document.getElementById("todayCollection");
const recentActivity = document.getElementById("recentActivity");
const loader = document.getElementById("loader");

// Loader
function showLoader() {

    loader.style.display = "flex";

}

function hideLoader() {

    loader.style.display = "none";

}

// Load Dashboard
async function loadDashboard() {

    showLoader();

    try {

        // Payment Data
        const paymentResponse = await fetch(SCRIPT_URL);

        const payments = await paymentResponse.json();

        // Member Data
        const memberResponse = await fetch(
            SCRIPT_URL + "?action=getMembers"
        );

        const members = await memberResponse.json();

        // Total Members
        totalMembers.innerHTML = members.length;

        // Total Collection
        let total = 0;

        payments.forEach(p => {

            total += Number(p.amount);

        });

        totalCollection.innerHTML = "৳" + total.toLocaleString();

        // এখান থেকে Part 2 শুরু হবে...

    } catch (error) {

        console.log(error);

    }

    hideLoader();

}
// =====================================
// admin.js - Part 2 (Final)
// =====================================

// This Month Collection
const now = new Date();
const currentMonth = String(now.getMonth() + 1);
const currentYear = String(now.getFullYear());

let monthTotal = 0;
let todayTotal = 0;

// Today's Date
const today =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");

payments.forEach(p => {

    // Monthly Collection
    if (
        String(p.month) === currentMonth &&
        String(p.year) === currentYear
    ) {

        monthTotal += Number(p.amount);

    }

    // Today's Collection
    const paymentDate = new Date(p.date)
        .toISOString()
        .split("T")[0];

    if (paymentDate === today) {

        todayTotal += Number(p.amount);

    }

});

monthlyCollection.innerHTML = "৳" + monthTotal.toLocaleString();
todayCollection.innerHTML = "৳" + todayTotal.toLocaleString();

// =============================
// Recent Activity
// =============================

recentActivity.innerHTML = "";

if (payments.length === 0) {

    recentActivity.innerHTML =
        "<p class='empty'>No Payment Found</p>";

} else {

    const latest = payments.slice(-5).reverse();

    latest.forEach(item => {

        recentActivity.innerHTML += `

        <div class="activity-item">

            <strong>${item.name}</strong>

            <br>

            <small>
                ${item.month}/${item.year}
                • ৳${item.amount}
            </small>

        </div>

        `;

    });

}

// Hide Loader
hideLoader();

}

// =============================
// Logout
// =============================

document.getElementById("logoutBtn").onclick = logout;
document.getElementById("logoutCard").onclick = logout;

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        sessionStorage.removeItem("loggedIn");

        window.location.href = "login.html";

    }

}

// =============================
// Start Dashboard
// =============================

loadDashboard();