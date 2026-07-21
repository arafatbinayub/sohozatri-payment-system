// ==========================================
// SOHOZATRI
// Authentication System
// File: auth.js
// ==========================================


// ==========================================
// FIREBASE IMPORT
// ==========================================

import {
    auth,
    db
} from "./firebase.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    setDoc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================


// Login Panel

const loginPanel =
    document.getElementById("loginPanel");


// Registration Panel

const registerPanel =
    document.getElementById("registerPanel");


// Login Inputs

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");


// Register Inputs

const registerName =
    document.getElementById("registerName");

const countryCode =
    document.getElementById("countryCode");

const registerPhone =
    document.getElementById("registerPhone");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");


// Buttons

const loginBtn =
    document.getElementById("loginBtn");

const registerBtn =
    document.getElementById("registerBtn");

const forgotPasswordBtn =
    document.getElementById(
        "forgotPasswordBtn"
    );

const showRegisterBtn =
    document.getElementById(
        "showRegisterBtn"
    );

const showLoginBtn =
    document.getElementById(
        "showLoginBtn"
    );


// Loading

const loadingOverlay =
    document.getElementById(
        "loadingOverlay"
    );


// Message Popup

const messageOverlay =
    document.getElementById(
        "messageOverlay"
    );

const messageIcon =
    document.getElementById(
        "messageIcon"
    );

const messageTitle =
    document.getElementById(
        "messageTitle"
    );

const messageText =
    document.getElementById(
        "messageText"
    );

const messageCloseBtn =
    document.getElementById(
        "messageCloseBtn"
    );


// ==========================================
// SHOW LOGIN PANEL
// ==========================================

function showLoginPanel() {

    loginPanel.classList.remove(
        "hidden"
    );

    registerPanel.classList.add(
        "hidden"
    );

}


// ==========================================
// SHOW REGISTER PANEL
// ==========================================

function showRegisterPanel() {

    loginPanel.classList.add(
        "hidden"
    );

    registerPanel.classList.remove(
        "hidden"
    );

}


// ==========================================
// SHOW LOADING
// ==========================================

function showLoading() {

    loadingOverlay.classList.remove(
        "hidden"
    );

}


// ==========================================
// HIDE LOADING
// ==========================================

function hideLoading() {

    loadingOverlay.classList.add(
        "hidden"
    );

}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(
    title,
    message,
    icon = "✓"
) {

    messageTitle.textContent =
        title;

    messageText.textContent =
        message;

    messageIcon.textContent =
        icon;

    messageOverlay.classList.remove(
        "hidden"
    );

}


// ==========================================
// HIDE MESSAGE
// ==========================================

function hideMessage() {

    messageOverlay.classList.add(
        "hidden"
    );

}


// ==========================================
// GENERATE NEXT MEMBER ID
// ==========================================
//
// Example:
//
// SHZ001
// SHZ002
// SHZ003
//
// ==========================================

async function generateMemberID() {

    const counterRef =
        doc(
            db,
            "system",
            "counters"
        );


    const newMemberID =
        await runTransaction(
            db,
            async (transaction) => {

                const counterSnapshot =
                    await transaction.get(
                        counterRef
                    );


                let nextNumber = 1;


                if (
                    counterSnapshot.exists()
                ) {

                    const data =
                        counterSnapshot.data();


                    nextNumber =
                        (data.memberCount || 0)
                        + 1;

                }


                transaction.set(
                    counterRef,
                    {
                        memberCount:
                            nextNumber
                    },
                    {
                        merge: true
                    }
                );


                return (
                    "SHZ" +
                    String(
                        nextNumber
                    ).padStart(
                        3,
                        "0"
                    )
                );

            }
        );


    return newMemberID;

}


// ==========================================
// GET USER ROLE
// ==========================================

async function getUserRole(
    uid
) {

    try {

        const memberRef =
            doc(
                db,
                "members",
                uid
            );


        const memberSnapshot =
            await getDoc(
                memberRef
            );


        if (
            memberSnapshot.exists()
        ) {

            return "member";

        }


        const adminRef =
            doc(
                db,
                "admins",
                uid
            );


        const adminSnapshot =
            await getDoc(
                adminRef
            );


        if (
            adminSnapshot.exists()
        ) {

            return "admin";

        }


        return null;

    } catch (error) {

        console.error(
            "Role Check Error:",
            error
        );


        return null;

    }

}


// ==========================================
// REDIRECT USER
// ==========================================

async function redirectUser(
    uid
) {

    const role =
        await getUserRole(
            uid
        );


    if (
        role === "admin"
    ) {

        window.location.href =
            "admin-dashboard.html";

        return;

    }


    if (
        role === "member"
    ) {

        window.location.href =
            "member-dashboard.html";

        return;

    }


    await signOut(
        auth
    );


    showMessage(
        "Account Error",
        "Your account information was not found.",
        "!"
    );

}


// ==========================================
// REGISTER MEMBER
// ==========================================

async function registerMember() {

    const name =
        registerName.value.trim();

    const code =
        countryCode.value;

    const phone =
        registerPhone.value.trim();

    const email =
        registerEmail.value.trim();

    const password =
        registerPassword.value;

    const confirm =
        confirmPassword.value;


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !name ||
        !phone ||
        !email ||
        !password ||
        !confirm
    ) {

        showMessage(
            "Missing Information",
            "Please fill in all required fields.",
            "!"
        );

        return;

    }


    if (
        password.length < 6
    ) {

        showMessage(
            "Weak Password",
            "Password must be at least 6 characters.",
            "!"
        );

        return;

    }


    if (
        password !== confirm
    ) {

        showMessage(
            "Password Error",
            "Password and Confirm Password do not match.",
            "!"
        );

        return;

    }


    const fullPhone =
        code + phone;


    try {

        showLoading();


        // ==================================
        // CREATE FIREBASE USER
        // ==================================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        // ==================================
        // GENERATE MEMBER ID
        // ==================================

        const memberID =
            await generateMemberID();


        // ==================================
        // SAVE MEMBER PROFILE
        // ==================================

        await setDoc(
            doc(
                db,
                "members",
                user.uid
            ),
            {

                uid:
                    user.uid,

                memberID:
                    memberID,

                fullName:
                    name,

                countryCode:
                    code,

                phone:
                    phone,

                fullPhone:
                    fullPhone,

                email:
                    email,

                profilePhoto:
                    "",

                dateOfBirth:
                    "",

                whatsappNumber:
                    "",

                balance:
                    0,

                status:
                    "active",

                role:
                    "member",

                createdAt:
                    new Date()

            }
        );


        hideLoading();


        showMessage(
            "Registration Successful",
            "Your SOHOZATRI Member ID is " +
            memberID +
            ". Please login to continue.",
            "✓"
        );


        // Clear Registration Form

        registerName.value =
            "";

        registerPhone.value =
            "";

        registerEmail.value =
            "";

        registerPassword.value =
            "";

        confirmPassword.value =
            "";


        // Show Login Panel

        showLoginPanel();


    } catch (error) {

        hideLoading();


        console.error(
            "Registration Error:",
            error
        );


        let errorMessage =
            "Registration failed. Please try again.";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            errorMessage =
                "This email is already registered.";

        }


        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage =
                "Please enter a valid email address.";

        }


        else if (
            error.code ===
            "auth/weak-password"
        ) {

            errorMessage =
                "Password is too weak.";

        }


        showMessage(
            "Registration Failed",
            errorMessage,
            "!"
        );

    }

}


// ==========================================
// LOGIN USER
// ==========================================

async function loginUser() {

    const email =
        loginEmail.value.trim();

    const password =
        loginPassword.value;


    if (
        !email ||
        !password
    ) {

        showMessage(
            "Missing Information",
            "Please enter your email and password.",
            "!"
        );

        return;

    }


    try {

        showLoading();


        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        await redirectUser(
            user.uid
        );


    } catch (error) {

        hideLoading();


        console.error(
            "Login Error:",
            error
        );


        let errorMessage =
            "Login failed. Please try again.";


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            errorMessage =
                "Incorrect email or password.";

        }


        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            errorMessage =
                "No account found with this email.";

        }


        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            errorMessage =
                "Incorrect password.";

        }


        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            errorMessage =
                "Too many failed attempts. Please try again later.";

        }


        showMessage(
            "Login Failed",
            errorMessage,
            "!"
        );

    }

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

async function resetPassword() {

    const email =
        loginEmail.value.trim();


    if (!email) {

        showMessage(
            "Enter Email",
            "Please enter your email first.",
            "!"
        );

        loginEmail.focus();

        return;

    }


    try {

        showLoading();


        await sendPasswordResetEmail(
            auth,
            email
        );


        hideLoading();


        showMessage(
            "Reset Email Sent",
            "Please check your email and follow the password reset instructions.",
            "✓"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "Password Reset Error:",
            error
        );


        let errorMessage =
            "Unable to send reset email.";


        if (
            error.code ===
            "auth/user-not-found"
        ) {

            errorMessage =
                "No account found with this email.";

        }


        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage =
                "Please enter a valid email address.";

        }


        showMessage(
            "Reset Failed",
            errorMessage,
            "!"
        );

    }

}


// ==========================================
// EVENT LISTENERS
// ==========================================


// Show Register

showRegisterBtn.addEventListener(
    "click",
    showRegisterPanel
);


// Show Login

showLoginBtn.addEventListener(
    "click",
    showLoginPanel
);


// Login

loginBtn.addEventListener(
    "click",
    loginUser
);


// Register

registerBtn.addEventListener(
    "click",
    registerMember
);


// Forgot Password

forgotPasswordBtn.addEventListener(
    "click",
    resetPassword
);


// Close Message

messageCloseBtn.addEventListener(
    "click",
    hideMessage
);


// Close Message When Clicking Outside

messageOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            messageOverlay
        ) {

            hideMessage();

        }

    }
);


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

loginPassword.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            loginUser();

        }

    }
);


confirmPassword.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            registerMember();

        }

    }
);


// ==========================================
// AUTH STATE CHECK
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            console.log(
                "User already logged in:",
                user.email
            );

        }

    }
);


// ==========================================
// INITIAL PANEL
// ==========================================

showLoginPanel();


// ==========================================
// SOHOZATRI AUTH SYSTEM READY
// ==========================================

console.log(
    "SOHOZATRI Authentication System Ready"
);