const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9qy7CVmCx-4IfdmXRg33LBE-nfDh_mIEFZiWQj1F3m2Xrpb79KLocDO_0VqUHd4cT/exec";

const tbody = document.getElementById("paymentTable");
const loader = document.getElementById("loader");

let payments = [];

// Year Dropdown
const yearSelect = document.getElementById("year");

const currentYear = new Date().getFullYear();

for(let y=currentYear-2; y<=currentYear+5; y++){

    let option=document.createElement("option");

    option.value=y;

    option.textContent=y;

    yearSelect.appendChild(option);

}

// Load Data

window.onload=loadData;

async function loadData(){

    loader.style.display="flex";

    try{

        const res=await fetch(SCRIPT_URL);

        payments=await res.json();

        render(payments);

    }catch(e){

        alert("Unable to load data.");

    }

    loader.style.display="none";

}

// Render Table

function render(data){

    tbody.innerHTML="";

    let total=0;

    data.forEach(item=>{

        total+=Number(item.amount);

        tbody.innerHTML+=`

<tr>

<td>${item.name}</td>

<td>${item.mobile}</td>

<td>${item.month}</td>

<td>${item.year}</td>

<td>৳${item.amount}</td>

<td>${item.paymentMethod}</td>

<td>${item.trxid}</td>

<td>${item.remarks}</td>

</tr>

`;

    });

    document.getElementById("totalCollection").innerText="৳"+payments.reduce((a,b)=>a+Number(b.amount),0);

    document.getElementById("monthCollection").innerText="৳"+total;

    document.getElementById("summaryAmount").innerText="৳"+total;

    document.getElementById("summaryCount").innerText=data.length;

    document.getElementById("totalPayments").innerText=payments.length;

    document.getElementById("filteredPayments").innerText=data.length;

    document.getElementById("noData").style.display=data.length?"none":"block";

}

// Filter

document.getElementById("searchBtn").addEventListener("click",()=>{

    const month=document.getElementById("month").value;

    const year=document.getElementById("year").value;

    const filtered=payments.filter(p=>{

        const monthMatch=!month || p.month===month;

        const yearMatch=!year || String(p.year)===year;

        return monthMatch && yearMatch;

    });

    render(filtered);

});