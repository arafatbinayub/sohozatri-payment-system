// ===============================
// SOHOZATRI Member Management
// Part 1
// ===============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlvbYw_z6AxWdGNS_yN28DIaymggrQUGbt4OuGqMMP-h65ovoy9O-CI5A-aJZj4Brh/exec";

// Login Check
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// Elements
const memberForm = document.getElementById("memberForm");
const memberTable = document.getElementById("memberTable");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");

let members = [];
let filteredMembers = [];

// Auto Member ID

async function generateMemberId() {

    try {

        const response = await fetch(SCRIPT_URL + "?action=getNextMemberId");

        const result = await response.json();

        document.getElementById("memberId").value = result.memberId;

    } catch (e) {

        document.getElementById("memberId").value = "";

    }

}

generateMemberId();

// Loader

function showLoader(){

    loader.style.display = "flex";

}

function hideLoader(){

    loader.style.display = "none";

}
// ===============================
// Save Member
// Part 2
// ===============================

memberForm.addEventListener("submit", async function(e){

    e.preventDefault();

    showLoader();

    const member = {

        action: "addMember",

        memberId: document.getElementById("memberId").value,

        name: document.getElementById("name").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        address: document.getElementById("address").value.trim(),

        status: document.getElementById("status").value

    };

    try{

        const response = await fetch(SCRIPT_URL,{

            method:"POST",

            body:JSON.stringify(member)

        });

        const result = await response.json();

        hideLoader();

        if(result.status==="success"){

            showPopup(

                "Success",

                "Member Added Successfully!",

                true

            );

            memberForm.reset();

            generateMemberId();

            loadMembers();

        }else{

            showPopup(

                "Error",

                result.message,

                false

            );

        }

    }catch(error){

        hideLoader();

        showPopup(

            "Server Error",

            "Unable to connect to server.",

            false

        );

    }

});
// ===============================
// Load Members
// Part 3
// ===============================

async function loadMembers(){

    showLoader();

    try{

        const response = await fetch(
            SCRIPT_URL + "?action=getMembers"
        );

        members = await response.json();

        filteredMembers = [...members];

        renderMembers();

    }catch(error){

        console.log(error);

    }

    hideLoader();

}

// ===============================
// Render Member List
// ===============================

function renderMembers(){

    memberTable.innerHTML = "";

    if(filteredMembers.length === 0){

        document.getElementById("noData").style.display = "block";

        return;

    }

    document.getElementById("noData").style.display = "none";

    filteredMembers.forEach((m,index)=>{

        memberTable.innerHTML += `

        <tr>

            <td>${m.memberId}</td>

            <td>${m.name}</td>

            <td>${m.mobile}</td>

            <td>${m.address}</td>

            <td>${m.status}</td>

            <td>

                <button class="view-btn"
                onclick="viewMember(${index})">

                <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// Search
// ===============================

searchInput.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    filteredMembers=members.filter(m=>

        m.memberId.toLowerCase().includes(value)||

        m.name.toLowerCase().includes(value)||

        m.mobile.toLowerCase().includes(value)

    );

    renderMembers();

});

// ===============================
// View Member
// ===============================

function viewMember(index){

    const m=filteredMembers[index];

    showPopup(

        "Member Details",

`Member ID : ${m.memberId}

Name : ${m.name}

Mobile : ${m.mobile}

Address : ${m.address}

Status : ${m.status}`,

        true

    );

}

// ===============================
// Logout
// ===============================

document.getElementById("logoutBtn").onclick=function(){

    sessionStorage.removeItem("loggedIn");

    window.location.href="login.html";

};

// ===============================

loadMembers();