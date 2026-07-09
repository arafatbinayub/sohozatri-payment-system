const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwsehHUQEVbLUtRdw3dGkP_2Pt5u_Al5UdWnEr4GrSEnlQ36QtCSaxJ-NF23fSVFjP_Qw/exec";

let totalPayments = 0;
let totalAmount = 0;
let todayPayments = 0;
let thisMonth = 0;

async function loadPayments() {

    totalPayments = 0;
    totalAmount = 0;
    todayPayments = 0;
    thisMonth = 0;

    const res = await fetch(WEB_APP_URL);
    const data = await res.json();

    const table = document.getElementById("paymentTable");
    table.innerHTML = "";

    const now = new Date();

    data.forEach(row => {

        totalPayments++;
        totalAmount += Number(row[5]) || 0;

        const paymentDate = new Date(row[0]);

        if (paymentDate.toDateString() === now.toDateString()) {
            todayPayments++;
        }

        if (
            paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear()
        ) {
            thisMonth++;
        }

        table.innerHTML += `
        <tr>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
            <td>${row[6]}</td>
            <td>${row[7]}</td>
            <td>${row[9]}</td>
        </tr>`;
    });

    document.getElementById("totalPayments").innerText = totalPayments;
    document.getElementById("totalAmount").innerText = "৳" + totalAmount.toLocaleString();
    document.getElementById("todayPayments").innerText = todayPayments;
    document.getElementById("thisMonth").innerText = thisMonth;
}

loadPayments();

function searchTable() {
    const input = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#paymentTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

function logout() {
    window.location.href = "admin.html";
}
