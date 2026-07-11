// ===============================
// SOHOZATRI Admin Panel
// Part 1
// ===============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9qy7CVmCx-4IfdmXRg33LBE-nfDh_mIEFZiWQj1F3m2Xrpb79KLocDO_0VqUHd4cT/exec";

let allPayments = [];
let filteredPayments = [];

// Elements
const paymentTable = document.getElementById("paymentTable");
const monthFilter = document.getElementById("monthFilter");
const yearFilter = document.getElementById("yearFilter");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");

// ===============================
// Loader
// ===============================

function showLoader(){
    loader.style.display = "flex";
}

function hideLoader(){
    loader.style.display = "none";
}

// ===============================
// Load Year
// ===============================

const currentYear = new Date().getFullYear();

for(let y=currentYear-2; y<=currentYear+5; y++){

    const option=document.createElement("option");

    option.value=y;

    option.textContent=y;

    yearFilter.appendChild(option);

}

// ===============================
// Load Data
// ===============================

window.onload=function(){

    loadPayments();

};

async function loadPayments(){

    showLoader();

    try{

        const response=await fetch(SCRIPT_URL);

        allPayments=await response.json();

        filteredPayments=[...allPayments];

        updateDashboard();

        renderTable(filteredPayments);

    }catch(error){

        console.error(error);

        alert("Unable to load payment data.");

    }

    hideLoader();

}

// ===============================
// Dashboard
// ===============================

function updateDashboard(){

    let totalCollection=0;

    let todayCollection=0;

    let monthCollection=0;

    const today=new Date();

    const todayDate=today.toDateString();

    const currentMonth=today.toLocaleString("en-US",{month:"long"});

    const currentYear=today.getFullYear();

    allPayments.forEach(item=>{

        const amount=Number(item.amount);

        totalCollection+=amount;

        const paymentDate=new Date(item.date);

        if(paymentDate.toDateString()===todayDate){

            todayCollection+=amount;

        }

        if(item.month===currentMonth && Number(item.year)===currentYear){

            monthCollection+=amount;

        }

    });

    document.getElementById("totalCollection").innerHTML="৳"+totalCollection;

    document.getElementById("todayCollection").innerHTML="৳"+todayCollection;

    document.getElementById("monthCollection").innerHTML="৳"+monthCollection;

    document.getElementById("totalPayments").innerHTML=allPayments.length;

}
// ===============================
// Render Payment Table
// ===============================

function renderTable(data){

    paymentTable.innerHTML="";

    if(data.length===0){

        document.getElementById("noData").style.display="block";

        return;

    }

    document.getElementById("noData").style.display="none";

    data.forEach((item,index)=>{

        paymentTable.innerHTML += `

<tr>

<td>${item.name}</td>

<td>${item.mobile}</td>

<td>${item.month}</td>

<td>${item.year}</td>

<td>৳${Number(item.amount).toLocaleString()}</td>

<td>${item.paymentMethod}</td>

<td>${item.trxid}</td>

<td>${item.remarks || ""}</td>

<td>

<button class="action-btn view-btn"
onclick="viewPayment(${index})">

<i class="fa-solid fa-eye"></i>

</button>

</td>

</tr>

`;

    });

}

// ===============================
// Filter Payment
// ===============================

function filterPayments(){

    const search = searchInput.value.toLowerCase().trim();

    const month = monthFilter.value;

    const year = yearFilter.value;

    filteredPayments = allPayments.filter(item=>{

        const matchSearch =

        item.name.toLowerCase().includes(search) ||

        item.mobile.toLowerCase().includes(search) ||

        item.trxid.toLowerCase().includes(search);

        const matchMonth =

        month==="" || item.month===month;

        const matchYear =

        year==="" || String(item.year)===year;

        return matchSearch && matchMonth && matchYear;

    });

    renderTable(filteredPayments);

}

// ===============================
// Search Button
// ===============================

document
.getElementById("searchBtn")
.addEventListener("click",filterPayments);

// ===============================
// Live Search
// ===============================

searchInput.addEventListener("keyup",filterPayments);

monthFilter.addEventListener("change",filterPayments);

yearFilter.addEventListener("change",filterPayments);

// ===============================
// View Payment
// ===============================

function viewPayment(index){

    const p = filteredPayments[index];

    alert(

`Name : ${p.name}

Mobile : ${p.mobile}

Month : ${p.month}

Year : ${p.year}

Amount : ৳${p.amount}

Method : ${p.paymentMethod}

TRX ID : ${p.trxid}

Remarks : ${p.remarks}`

    );

}
// ===============================
// SOHOZATRI Admin Panel
// Part 3 (Final)
// ===============================

// Popup Elements
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupClose = document.getElementById("popupClose");

// ===============================
// Popup
// ===============================

function showPopup(title, message, success = true){

    popup.style.display = "flex";

    popupTitle.innerText = title;

    popupMessage.innerText = message;

    if(success){

        popupIcon.innerHTML = "✓";
        popupIcon.style.background = "#16a34a";

    }else{

        popupIcon.innerHTML = "✕";
        popupIcon.style.background = "#dc2626";

    }

}

popupClose.addEventListener("click", function(){

    popup.style.display = "none";

});

window.addEventListener("click", function(e){

    if(e.target === popup){

        popup.style.display = "none";

    }

});

// ===============================
// Refresh Button (Optional)
// ===============================

function refreshData(){

    loadPayments();

    showPopup(
        "Success",
        "Payment list refreshed successfully.",
        true
    );

}

// ===============================
// Keyboard Shortcut
// Ctrl + R = Refresh Data
// ===============================

document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key.toLowerCase()=="r"){

        e.preventDefault();

        refreshData();

    }

});

// ===============================
// Console
// ===============================

console.log("SOHOZATRI Admin Panel Loaded Successfully");