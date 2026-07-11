const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9qy7CVmCx-4IfdmXRg33LBE-nfDh_mIEFZiWQj1F3m2Xrpb79KLocDO_0VqUHd4cT/exec";

// ===========================
// Auto Load Year
// ===========================

const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();

for (let y = currentYear - 2; y <= currentYear + 5; y++) {

    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;

    if (y === currentYear) {
        option.selected = true;
    }

    yearSelect.appendChild(option);
}

// ===========================
// Loader
// ===========================

function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// ===========================
// Popup
// ===========================

function showPopup(title, message, success = true) {

    const popup = document.getElementById("popup");
    const icon = document.getElementById("popupIcon");

    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupMessage").innerText = message;

    if (success) {

        icon.innerHTML = "✓";
        icon.style.background =
            "linear-gradient(135deg,#22c55e,#16a34a)";

    } else {

        icon.innerHTML = "✕";
        icon.style.background =
            "linear-gradient(135deg,#ef4444,#dc2626)";

    }

    popup.style.display = "flex";

}

function closePopup() {

    document.getElementById("popup").style.display = "none";

}

// Popup এর বাইরে ক্লিক করলে বন্ধ হবে
window.onclick = function(e){

    const popup=document.getElementById("popup");

    if(e.target===popup){

        closePopup();

    }

}

// ===========================
// Submit Form
// ===========================

const form = document.getElementById("paymentForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    showLoader();

    const btn=document.querySelector(".submit-btn");

    btn.disabled=true;
    btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    const data={

        name:this.name.value.trim(),

        mobile:this.mobile.value.trim(),

        month:this.month.value,

        year:this.year.value,

        amount:this.amount.value,

        paymentMethod:this.paymentMethod.value,

        trxid:this.trxid.value.trim(),

        remarks:this.remarks.value.trim()

    };

    try{

        const response=await fetch(SCRIPT_URL,{

            method:"POST",

            body:JSON.stringify(data)

        });

        const result=await response.json();

        hideLoader();

        if(result.status==="success"){

            showPopup(

                "Payment Successful",

                result.message,

                true

            );

            form.reset();

            yearSelect.value=currentYear;

        }else{

            showPopup(

                "Payment Failed",

                result.message,

                false

            );

        }

    }catch(error){

        hideLoader();

        console.error(error);

        showPopup(

            "Server Error",

            "Unable to connect to server. Please try again.",

            false

        );

    }

    btn.disabled=false;

    btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Payment';

});