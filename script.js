const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz_Q51LiBo8pUgNfCuLutO9GyzGp4J7TE0lQtbMSRNXOePiCLINY4Z-y6iQy1u8SYfoWQ/exec";

const form = document.getElementById("paymentForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    message.className = "";
    message.style.display = "none";

    const data = {
        action: "payment",
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
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const result = await response.json();

        if (result.status === "success") {

            message.className = "success";
            message.style.display = "block";
            message.innerHTML = "✅ Payment submitted successfully.";

            form.reset();

        } else {

            message.className = "error";
            message.style.display = "block";
            message.innerHTML = "❌ " + (result.message || "Submit failed.");

        }

    } catch (err) {

        console.error(err);

        message.className = "error";
        message.style.display = "block";
        message.innerHTML = "❌ " + err.message;

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Payment";

    }

});
