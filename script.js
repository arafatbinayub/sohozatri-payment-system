const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwsehHUQEVbLUtRdw3dGkP_2Pt5u_Al5UdWnEr4GrSEnlQ36QtCSaxJ-NF23fSVFjP_Qw/exec";

const form = document.getElementById("paymentForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    message.style.display = "none";

    const data = {
        name: document.getElementById("name").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        month: document.getElementById("month").value,
        year: document.getElementById("year").value,
        amount: document.getElementById("amount").value,
        method: document.getElementById("method").value,
        trxid: document.getElementById("trxid").value.trim(),
        screenshot: "",
        remarks: document.getElementById("remarks").value.trim()
    };

    try {

        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {

            message.className = "success";
            message.style.display = "block";
            message.innerHTML = "✅ Payment submitted successfully.";

            form.reset();

        } else {

            message.className = "error";
            message.style.display = "block";
            message.innerHTML = "❌ Submit failed.";

        }

    } catch (error) {

        console.log(error);

        message.className = "error";
        message.style.display = "block";
        message.innerHTML = "❌ " + error.message;

    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit Payment";
});
