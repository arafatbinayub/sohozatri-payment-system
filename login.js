// ==========================================
// SOHOZATRI LOGIN SYSTEM
// login.js
// ==========================================


// ==========================================
// FIREBASE IMPORT
// ==========================================

import {
    auth,
    db
} from "./firebase.js";


import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginBtn =
    document.getElementById("loginBtn");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const registerBtn =
    document.getElementById("registerBtn");


// Loading

const loadingOverlay =
    document.getElementById("loadingOverlay");


// Message

const messageOverlay =
    document.getElementById("messageOverlay");

const messageIcon =
    document.getElementById("messageIcon");

const messageTitle =
    document.getElementById("messageTitle");

const messageText =
    document.getElementById("messageText");

const closeMessageBtn =
    document.getElementById("closeMessageBtn");


// ==========================================
// LOADING FUNCTIONS
// ==========================================

function showLoading() {

    if (loadingOverlay) {
        loadingOverlay.classList.remove("hidden");
    }

    if (loginBtn) {
        loginBtn.disabled = true;
    }

}


function hideLoading() {

    if (loadingOverlay) {
        loadingOverlay.classList.add("hidden");
    }

    if (loginBtn) {
        loginBtn.disabled = false;
    }

}


// ==========================================
// MESSAGE POPUP
// ==========================================

function showMessage(
    title,
    message,
    type = "success"
) {

    if (!messageOverlay) {
        alert(message);
        return;
    }


    messageTitle.textContent = title;

    messageText.textContent = message;


    if (type === "error") {

        messageIcon.textContent = "✕";

        messageIcon.style.background =
            "#fee2e2";

        messageIcon.style.color =
            "#dc2626";

    } else {

        messageIcon.textContent = "✓";

        messageIcon.style.background =
            "#dcfce7";

        messageIcon.style.color =
            "#16a34a";

    }


    messageOverlay.classList.remove(
        "hidden"
    );

}


function closeMessage() {

    if (messageOverlay) {

        messageOverlay.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// CLOSE MESSAGE
// ==========================================

if (closeMessageBtn) {

    closeMessageBtn.addEventListener(
        "click",
        closeMessage
    );

}


// Close popup by clicking outside

if (messageOverlay) {

    messageOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                messageOverlay
            ) {

                closeMessage();

            }

        }
    );

}


// ==========================================
// REGISTER BUTTON
// ==========================================

if (registerBtn) {

    registerBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "register.html";

        }
    );

}


// ==========================================
// FIND USER ROLE
// ==========================================

async function getUserRole(
    user
) {

    try {


        // ==================================
        // CHECK ADMIN COLLECTION
        // ==================================

        const adminQuery = query(
            collection(db, "admins"),
            where(
                "email",
                "==",
                user.email
            )
        );


        const adminSnapshot =
            await getDocs(
                adminQuery
            );


        if (
            !adminSnapshot.empty
        ) {

            return "admin";

        }


        // ==================================
        // CHECK MEMBER COLLECTION
        // ==================================

        const memberQuery = query(
            collection(db, "members"),
            where(
                "uid",
                "==",
                user.uid
            )
        );


        const memberSnapshot =
            await getDocs(
                memberQuery
            );


        if (
            !memberSnapshot.empty
        ) {

            return "member";

        }


        // ==================================
        // CHECK MEMBER BY EMAIL
        // ==================================

        const memberEmailQuery =
            query(
                collection(db, "members"),
                where(
                    "email",
                    "==",
                    user.email
                )
            );


        const memberEmailSnapshot =
            await getDocs(
                memberEmailQuery
            );


        if (
            !memberEmailSnapshot.empty
        ) {

            return "member";

        }


        return null;


    } catch (error) {

        console.error(
            "Role check error:",
            error
        );

        return null;

    }

}


// ==========================================
// LOGIN FORM
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                loginEmail.value
                    .trim()
                    .toLowerCase();


            const password =
                loginPassword.value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!email) {

                showMessage(
                    "Email Required",
                    "Please enter your email address.",
                    "error"
                );

                loginEmail.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Password Required",
                    "Please enter your password.",
                    "error"
                );

                loginPassword.focus();

                return;

            }


            // ==================================
            // START LOGIN
            // ==================================

            showLoading();


            try {


                // ==================================
                // FIREBASE LOGIN
                // ==================================

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Login successful:",
                    user.uid
                );


                // ==================================
                // GET USER ROLE
                // ==================================

                const role =
                    await getUserRole(
                        user
                    );


                hideLoading();


                // ==================================
                // ADMIN
                // ==================================

                if (
                    role === "admin"
                ) {

                    window.location.href =
                        "admin-dashboard.html";

                    return;

                }


                // ==================================
                // MEMBER
                // ==================================

                if (
                    role === "member"
                ) {

                    window.location.href =
                        "member-dashboard.html";

                    return;

                }


                // ==================================
                // ROLE NOT FOUND
                // ==================================

                showMessage(
                    "Account Not Found",
                    "Your Firebase account exists, but your member or admin profile was not found.",
                    "error"
                );


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                hideLoading();


                // ==================================
                // FIREBASE ERROR HANDLING
                // ==================================

                let errorMessage =
                    "Login failed. Please try again.";


                switch (
                    error.code
                ) {


                    case
                        "auth/invalid-credential":

                        errorMessage =
                            "Invalid email or password.";

                        break;


                    case
                        "auth/invalid-email":

                        errorMessage =
                            "Please enter a valid email address.";

                        break;


                    case
                        "auth/user-not-found":

                        errorMessage =
                            "No account found with this email.";

                        break;


                    case
                        "auth/wrong-password":

                        errorMessage =
                            "Incorrect password.";

                        break;


                    case
                        "auth/too-many-requests":

                        errorMessage =
                            "Too many failed login attempts. Please try again later.";

                        break;


                    case
                        "auth/user-disabled":

                        errorMessage =
                            "This account has been disabled.";

                        break;


                    case
                        "auth/network-request-failed":

                        errorMessage =
                            "Network error. Please check your internet connection.";

                        break;


                    default:

                        errorMessage =
                            error.message ||
                            errorMessage;

                        break;

                }


                showMessage(
                    "Login Failed",
                    errorMessage,
                    "error"
                );

            }

        }
    );

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        async function () {


            const email =
                loginEmail.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showMessage(
                    "Enter Email",
                    "Please enter your email address first.",
                    "error"
                );

                loginEmail.focus();

                return;

            }


            showLoading();


            try {


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                hideLoading();


                showMessage(
                    "Reset Email Sent",
                    "A password reset link has been sent to your email address.",
                    "success"
                );


            } catch (error) {


                console.error(
                    "Password Reset Error:",
                    error
                );


                hideLoading();


                let errorMessage =
                    "Could not send password reset email.";


                switch (
                    error.code
                ) {


                    case
                        "auth/invalid-email":

                        errorMessage =
                            "Please enter a valid email address.";

                        break;


                    case
                        "auth/user-not-found":

                        errorMessage =
                            "No account found with this email.";

                        break;


                    case
                        "auth/network-request-failed":

                        errorMessage =
                            "Network error. Please check your internet connection.";

                        break;


                    default:

                        errorMessage =
                            error.message ||
                            errorMessage;

                        break;

                }


                showMessage(
                    "Reset Failed",
                    errorMessage,
                    "error"
                );

            }

        }
    );

}


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

if (loginPassword) {

    loginPassword.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                loginForm.requestSubmit();

            }

        }
    );

}


// ==========================================
// INITIAL LOG
// ==========================================

console.log(
    "SOHOZATRI Login System Loaded"
);