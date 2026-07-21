// ==========================================
// SOHOZATRI MEMBER REGISTRATION
// File: register.js
// ==========================================

import {
    auth,
    db
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const registerForm = document.getElementById("registerForm");

const fullNameInput = document.getElementById("fullName");
const countryCodeInput = document.getElementById("countryCode");
const phoneNumberInput = document.getElementById("phoneNumber");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");
const confirmPasswordInput =
    document.getElementById("confirmPassword");

const agreeTermsInput =
    document.getElementById("agreeTerms");

const registerBtn =
    document.getElementById("registerBtn");

const registerBtnText =
    document.getElementById("registerBtnText");

const registerLoader =
    document.getElementById("registerLoader");

const registerError =
    document.getElementById("registerError");

const registerErrorText =
    document.getElementById("registerErrorText");

const registerSuccess =
    document.getElementById("registerSuccess");

const registerSuccessText =
    document.getElementById("registerSuccessText");


// ==========================================
// SUCCESS MODAL
// ==========================================

const successModal =
    document.getElementById("successModal");

const generatedMemberId =
    document.getElementById("generatedMemberId");

const goDashboardBtn =
    document.getElementById("goDashboardBtn");


// ==========================================
// TERMS MODAL
// ==========================================

const termsModal =
    document.getElementById("termsModal");

const termsLink =
    document.getElementById("termsLink");

const closeTermsBtn =
    document.getElementById("closeTermsBtn");

const acceptTermsBtn =
    document.getElementById("acceptTermsBtn");


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePasswordButtons =
    document.querySelectorAll(".toggle-password");


togglePasswordButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.target;

        const targetInput =
            document.getElementById(targetId);

        const icon =
            button.querySelector("i");


        if (targetInput.type === "password") {

            targetInput.type = "text";

            icon.classList.remove(
                "fa-eye"
            );

            icon.classList.add(
                "fa-eye-slash"
            );

        } else {

            targetInput.type = "password";

            icon.classList.remove(
                "fa-eye-slash"
            );

            icon.classList.add(
                "fa-eye"
            );

        }

    });

});


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    registerErrorText.textContent =
        message;

    registerError.classList.remove(
        "hidden"
    );

    registerSuccess.classList.add(
        "hidden"
    );

}


// ==========================================
// SHOW SUCCESS MESSAGE
// ==========================================

function showSuccess(message) {

    registerSuccessText.textContent =
        message;

    registerSuccess.classList.remove(
        "hidden"
    );

    registerError.classList.add(
        "hidden"
    );

}


// ==========================================
// CLEAR MESSAGES
// ==========================================

function clearMessages() {

    registerError.classList.add(
        "hidden"
    );

    registerSuccess.classList.add(
        "hidden"
    );

}


// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {

    registerBtn.disabled =
        isLoading;


    if (isLoading) {

        registerBtnText.classList.add(
            "hidden"
        );

        registerLoader.classList.remove(
            "hidden"
        );

    } else {

        registerBtnText.classList.remove(
            "hidden"
        );

        registerLoader.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// CLEAN PHONE NUMBER
// ==========================================

function cleanPhoneNumber(phone) {

    return phone
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");

}


// ==========================================
// CREATE FULL PHONE NUMBER
// ==========================================

function createFullPhoneNumber() {

    const countryCode =
        countryCodeInput.value.trim();

    let phone =
        cleanPhoneNumber(
            phoneNumberInput.value.trim()
        );


    // Remove leading + if entered
    phone = phone.replace(
        /^\+/,
        ""
    );


    // Bangladesh number
    // User can enter 017XXXXXXXX
    // or 17XXXXXXXX

    if (countryCode === "+880") {

        if (phone.startsWith("0")) {

            phone =
                phone.substring(1);

        }

    }


    return countryCode + phone;

}


// ==========================================
// VALIDATE PHONE
// ==========================================

function validatePhone(phone) {

    // Minimum 7 digits
    // Maximum 15 digits

    const digitsOnly =
        phone.replace(
            /\D/g,
            ""
        );


    return (
        digitsOnly.length >= 7 &&
        digitsOnly.length <= 15
    );

}


// ==========================================
// CHECK PHONE DUPLICATE
// ==========================================

async function checkPhoneExists(phone) {

    const membersRef =
        collection(
            db,
            "members"
        );


    const phoneQuery =
        query(
            membersRef,
            where(
                "phone",
                "==",
                phone
            )
        );


    const snapshot =
        await getDocs(
            phoneQuery
        );


    return !snapshot.empty;

}


// ==========================================
// GENERATE NEXT MEMBER ID
// SHZ001
// SHZ002
// SHZ003
// ==========================================

async function generateNextMemberId() {

    const counterRef =
        doc(
            db,
            "settings",
            "memberCounter"
        );


    const result =
        await runTransaction(
            db,
            async transaction => {

                const counterSnap =
                    await transaction.get(
                        counterRef
                    );


                let nextNumber = 1;


                if (
                    counterSnap.exists()
                ) {

                    const data =
                        counterSnap.data();


                    nextNumber =
                        Number(
                            data.lastNumber || 0
                        ) + 1;

                }


                transaction.set(
                    counterRef,
                    {
                        lastNumber:
                            nextNumber,

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge: true
                    }
                );


                const memberNumber =
                    String(
                        nextNumber
                    ).padStart(
                        3,
                        "0"
                    );


                return (
                    "SHZ" +
                    memberNumber
                );

            }
        );


    return result;

}


// ==========================================
// CREATE MEMBER PROFILE
// ==========================================

async function createMemberProfile(
    user,
    memberId,
    fullName,
    phone,
    email
) {

    const memberRef =
        doc(
            db,
            "members",
            memberId
        );


    await setDoc(
        memberRef,
        {

            memberId:
                memberId,

            uid:
                user.uid,

            fullName:
                fullName,

            phone:
                phone,

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
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        }
    );

}


// ==========================================
// REGISTRATION
// ==========================================

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        clearMessages();


        // ==================================
        // GET VALUES
        // ==================================

        const fullName =
            fullNameInput.value.trim();

        const email =
            emailInput.value.trim()
            .toLowerCase();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;

        const phone =
            createFullPhoneNumber();


        // ==================================
        // VALIDATION
        // ==================================

        if (!fullName) {

            showError(
                "Please enter your full name."
            );

            fullNameInput.focus();

            return;

        }


        if (fullName.length < 2) {

            showError(
                "Full name must contain at least 2 characters."
            );

            fullNameInput.focus();

            return;

        }


        if (
            !phoneNumberInput.value.trim()
        ) {

            showError(
                "Please enter your phone number."
            );

            phoneNumberInput.focus();

            return;

        }


        if (!validatePhone(phone)) {

            showError(
                "Please enter a valid phone number."
            );

            phoneNumberInput.focus();

            return;

        }


        if (!email) {

            showError(
                "Please enter your email address."
            );

            emailInput.focus();

            return;

        }


        if (password.length < 6) {

            showError(
                "Password must contain at least 6 characters."
            );

            passwordInput.focus();

            return;

        }


        if (
            password !== confirmPassword
        ) {

            showError(
                "Password and Confirm Password do not match."
            );

            confirmPasswordInput.focus();

            return;

        }


        if (
            !agreeTermsInput.checked
        ) {

            showError(
                "Please agree to the Terms & Conditions."
            );

            return;

        }


        // ==================================
        // START LOADING
        // ==================================

        setLoading(true);


        try {


            // ==================================
            // CHECK DUPLICATE PHONE
            // ==================================

            const phoneExists =
                await checkPhoneExists(
                    phone
                );


            if (phoneExists) {

                throw new Error(
                    "This phone number is already registered."
                );

            }


            // ==================================
            // CREATE FIREBASE AUTH ACCOUNT
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
            // UPDATE AUTH PROFILE
            // ==================================

            await updateProfile(
                user,
                {
                    displayName:
                        fullName
                }
            );


            // ==================================
            // GENERATE MEMBER ID
            // ==================================

            const memberId =
                await generateNextMemberId();


            // ==================================
            // CREATE FIRESTORE PROFILE
            // ==================================

            await createMemberProfile(
                user,
                memberId,
                fullName,
                phone,
                email
            );


            // ==================================
            // SHOW SUCCESS
            // ==================================

            generatedMemberId.textContent =
                memberId;


            showSuccess(
                "Your account has been created successfully."
            );


            successModal.classList.remove(
                "hidden"
            );


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            let message =
                "Registration failed. Please try again.";


            // Firebase Auth Errors

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "This email address is already registered.";

            }


            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email address.";

            }


            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password is too weak. Please use a stronger password.";

            }


            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                message =
                    "Network error. Please check your internet connection.";

            }


            else if (
                error.message
            ) {

                message =
                    error.message;

            }


            showError(
                message
            );


        } finally {

            setLoading(false);

        }

    }
);


// ==========================================
// TERMS MODAL OPEN
// ==========================================

termsLink.addEventListener(
    "click",
    event => {

        event.preventDefault();

        termsModal.classList.remove(
            "hidden"
        );

    }
);


// ==========================================
// TERMS MODAL CLOSE
// ==========================================

closeTermsBtn.addEventListener(
    "click",
    () => {

        termsModal.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// ACCEPT TERMS
// ==========================================

acceptTermsBtn.addEventListener(
    "click",
    () => {

        agreeTermsInput.checked =
            true;

        termsModal.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// CLOSE MODAL ON OUTSIDE CLICK
// ==========================================

termsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            termsModal
        ) {

            termsModal.classList.add(
                "hidden"
            );

        }

    }
);


// ==========================================
// GO TO DASHBOARD
// ==========================================

goDashboardBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "member-dashboard.html";

    }
);


// ==========================================
// PREVENT DOUBLE SUBMIT
// ==========================================

window.addEventListener(
    "beforeunload",
    event => {

        if (
            registerBtn.disabled
        ) {

            event.preventDefault();

        }

    }
);