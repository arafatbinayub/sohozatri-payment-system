// ==========================================
// SOHOZATRI MEMBER DASHBOARD
// File: member-dashboard.js
// ==========================================

import {
    auth,
    db,
    storage
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentUser = null;
let currentMember = null;
let currentMemberDocId = null;


// ==========================================
// ELEMENTS
// ==========================================

// Sidebar
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");


// Navigation
const navItems =
    document.querySelectorAll(".nav-item");

const actionCards =
    document.querySelectorAll(".action-card");

const pageTitle =
    document.getElementById("pageTitle");


// Logout
const logoutBtn =
    document.getElementById("logoutBtn");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogoutBtn =
    document.getElementById("cancelLogoutBtn");

const confirmLogoutBtn =
    document.getElementById("confirmLogoutBtn");


// Loading
const loadingOverlay =
    document.getElementById("loadingOverlay");


// Message Modal
const messageModal =
    document.getElementById("messageModal");

const generalMessageIcon =
    document.getElementById("generalMessageIcon");

const generalMessageTitle =
    document.getElementById("generalMessageTitle");

const generalMessageText =
    document.getElementById("generalMessageText");

const closeMessageBtn =
    document.getElementById("closeMessageBtn");


// ==========================================
// DASHBOARD ELEMENTS
// ==========================================

const topProfilePhoto =
    document.getElementById("topProfilePhoto");

const topProfileInitial =
    document.getElementById("topProfileInitial");

const topMemberName =
    document.getElementById("topMemberName");

const topMemberId =
    document.getElementById("topMemberId");


const welcomeName =
    document.getElementById("welcomeName");


const dashboardProfilePhoto =
    document.getElementById(
        "dashboardProfilePhoto"
    );

const dashboardProfileInitial =
    document.getElementById(
        "dashboardProfileInitial"
    );


const memberBalance =
    document.getElementById(
        "memberBalance"
    );

const balanceMemberId =
    document.getElementById(
        "balanceMemberId"
    );


const accountStatus =
    document.getElementById(
        "accountStatus"
    );


// ==========================================
// PROFILE ELEMENTS
// ==========================================

const profilePhoto =
    document.getElementById(
        "profilePhoto"
    );

const profileInitial =
    document.getElementById(
        "profileInitial"
    );

const profilePhotoImage =
    document.getElementById(
        "profilePhotoImage"
    );

const profilePhotoInput =
    document.getElementById(
        "profilePhotoInput"
    );


const profileName =
    document.getElementById(
        "profileName"
    );

const profileMemberId =
    document.getElementById(
        "profileMemberId"
    );


const profileFullName =
    document.getElementById(
        "profileFullName"
    );

const profilePhone =
    document.getElementById(
        "profilePhone"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profileDateOfBirth =
    document.getElementById(
        "profileDateOfBirth"
    );

const profileWhatsapp =
    document.getElementById(
        "profileWhatsapp"
    );


const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );


// Password
const newPassword =
    document.getElementById(
        "newPassword"
    );

const confirmNewPassword =
    document.getElementById(
        "confirmNewPassword"
    );

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


// ==========================================
// PAYMENT ELEMENTS
// ==========================================

const paymentMemberId =
    document.getElementById(
        "paymentMemberId"
    );

const paymentName =
    document.getElementById(
        "paymentName"
    );

const paymentPhone =
    document.getElementById(
        "paymentPhone"
    );

const paymentEmail =
    document.getElementById(
        "paymentEmail"
    );


const paymentMonth =
    document.getElementById(
        "paymentMonth"
    );

const paymentYear =
    document.getElementById(
        "paymentYear"
    );

const paymentAmount =
    document.getElementById(
        "paymentAmount"
    );

const paymentMethod =
    document.getElementById(
        "paymentMethod"
    );


// Conditional fields
const bkashTrxGroup =
    document.getElementById(
        "bkashTrxGroup"
    );

const bkashTrxId =
    document.getElementById(
        "bkashTrxId"
    );


const bkashBankTrxGroup =
    document.getElementById(
        "bkashBankTrxGroup"
    );

const bkashBankTrxId =
    document.getElementById(
        "bkashBankTrxId"
    );


const bankNameGroup =
    document.getElementById(
        "bankNameGroup"
    );

const bankName =
    document.getElementById(
        "bankName"
    );


const cashGivenGroup =
    document.getElementById(
        "cashGivenGroup"
    );

const cashGivenTo =
    document.getElementById(
        "cashGivenTo"
    );


const paymentRemark =
    document.getElementById(
        "paymentRemark"
    );


const submitPaymentBtn =
    document.getElementById(
        "submitPaymentBtn"
    );


// ==========================================
// PAYMENT CONFIRM MODAL
// ==========================================

const paymentConfirmModal =
    document.getElementById(
        "paymentConfirmModal"
    );

const closePaymentModal =
    document.getElementById(
        "closePaymentModal"
    );

const cancelPaymentBtn =
    document.getElementById(
        "cancelPaymentBtn"
    );

const confirmPaymentBtn =
    document.getElementById(
        "confirmPaymentBtn"
    );


const confirmMemberId =
    document.getElementById(
        "confirmMemberId"
    );

const confirmName =
    document.getElementById(
        "confirmName"
    );

const confirmMonth =
    document.getElementById(
        "confirmMonth"
    );

const confirmYear =
    document.getElementById(
        "confirmYear"
    );

const confirmAmount =
    document.getElementById(
        "confirmAmount"
    );

const confirmMethod =
    document.getElementById(
        "confirmMethod"
    );

const confirmTrxRow =
    document.getElementById(
        "confirmTrxRow"
    );

const confirmTrxId =
    document.getElementById(
        "confirmTrxId"
    );

const confirmBankRow =
    document.getElementById(
        "confirmBankRow"
    );

const confirmBank =
    document.getElementById(
        "confirmBank"
    );

const confirmCashRow =
    document.getElementById(
        "confirmCashRow"
    );

const confirmCashGiven =
    document.getElementById(
        "confirmCashGiven"
    );

const confirmRemark =
    document.getElementById(
        "confirmRemark"
    );


// ==========================================
// HISTORY ELEMENTS
// ==========================================

const totalPayments =
    document.getElementById(
        "totalPayments"
    );

const approvedPayments =
    document.getElementById(
        "approvedPayments"
    );

const pendingPayments =
    document.getElementById(
        "pendingPayments"
    );

const historyList =
    document.getElementById(
        "historyList"
    );

const emptyHistory =
    document.getElementById(
        "emptyHistory"
    );


// ==========================================
// NOTICE ELEMENTS
// ==========================================

const noticeModal =
    document.getElementById(
        "noticeModal"
    );

const noticeContent =
    document.getElementById(
        "noticeContent"
    );

const noticeDate =
    document.getElementById(
        "noticeDate"
    );

const closeNoticeBtn =
    document.getElementById(
        "closeNoticeBtn"
    );


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loadingOverlay.classList.remove(
        "hidden"
    );

}


function hideLoading() {

    loadingOverlay.classList.add(
        "hidden"
    );

}


// ==========================================
// MESSAGE MODAL
// ==========================================

function showMessage(
    title,
    message,
    type = "success"
) {

    generalMessageTitle.textContent =
        title;

    generalMessageText.textContent =
        message;


    if (type === "error") {

        generalMessageIcon.textContent =
            "✕";

    } else {

        generalMessageIcon.textContent =
            "✓";

    }


    messageModal.classList.remove(
        "hidden"
    );

}


function closeMessage() {

    messageModal.classList.add(
        "hidden"
    );

}


closeMessageBtn.addEventListener(
    "click",
    closeMessage
);


// ==========================================
// NAVIGATION
// ==========================================

function openSection(
    sectionId
) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const targetSection =
        document.getElementById(
            sectionId
        );


    if (targetSection) {

        targetSection.classList.add(
            "active"
        );

    }


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionId
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    const titles = {

        dashboardSection:
            "Dashboard",

        profileSection:
            "My Profile",

        paymentSection:
            "Make Payment",

        historySection:
            "Payment History"

    };


    pageTitle.textContent =
        titles[sectionId] ||
        "Dashboard";


    sidebar.classList.remove(
        "open"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


// Navigation click

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                openSection(
                    item.dataset.section
                );

            }
        );

    }
);


// Quick Action click

actionCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                openSection(
                    card.dataset.section
                );

            }
        );

    }
);


// ==========================================
// MOBILE SIDEBAR
// ==========================================

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);


// ==========================================
// MEMBER DATA LOAD
// ==========================================

async function loadMemberData(
    user
) {

    try {

        const membersRef =
            collection(
                db,
                "members"
            );


        const memberQuery =
            query(
                membersRef,
                where(
                    "uid",
                    "==",
                    user.uid
                )
            );


        const snapshot =
            await getDocs(
                memberQuery
            );


        if (
            snapshot.empty
        ) {

            throw new Error(
                "Member profile not found."
            );

        }


        const memberDoc =
            snapshot.docs[0];


        currentMemberDocId =
            memberDoc.id;


        currentMember =
            memberDoc.data();


        updateDashboardUI();


        await loadPaymentHistory();


        await loadAdminNotice();


    } catch (error) {

        console.error(
            "Member Load Error:",
            error
        );


        showMessage(
            "Error",
            "Unable to load your member profile.",
            "error"
        );

    }

}


// ==========================================
// UPDATE DASHBOARD UI
// ==========================================

function updateDashboardUI() {

    if (
        !currentMember
    ) {

        return;

    }


    const name =
        currentMember.fullName ||
        "Member";


    const memberId =
        currentMember.memberId ||
        "SHZ000";


    const balance =
        Number(
            currentMember.balance || 0
        );


    const phone =
        currentMember.phone ||
        "";


    const email =
        currentMember.email ||
        currentUser?.email ||
        "";


    const photo =
        currentMember.profilePhoto ||
        "";


    // Initial

    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "S";


    // Topbar

    topMemberName.textContent =
        name;

    topMemberId.textContent =
        memberId;


    // Dashboard

    welcomeName.textContent =
        name;


    memberBalance.textContent =
        balance.toFixed(2);


    balanceMemberId.textContent =
        memberId;


    accountStatus.textContent =
        currentMember.status ||
        "Active";


    // Dashboard Photo

    setProfileVisual(
        dashboardProfilePhoto,
        dashboardProfileInitial,
        photo,
        initial
    );


    // Top Photo

    setProfileVisual(
        topProfilePhoto,
        topProfileInitial,
        photo,
        initial
    );


    // Profile

    profileName.textContent =
        name;

    profileMemberId.textContent =
        memberId;


    profileFullName.value =
        name;

    profilePhone.value =
        phone;

    profileEmail.value =
        email;

    profileDateOfBirth.value =
        currentMember.dateOfBirth ||
        "";

    profileWhatsapp.value =
        currentMember.whatsappNumber ||
        "";


    setProfileImage(
        photo
    );


    // Payment

    paymentMemberId.value =
        memberId;

    paymentName.value =
        name;

    paymentPhone.value =
        phone;

    paymentEmail.value =
        email;

}


// ==========================================
// PROFILE VISUAL
// ==========================================

function setProfileVisual(
    container,
    initialElement,
    photo,
    initial
) {

    if (
        photo
    ) {

        container.style.backgroundImage =
            `url("${photo}")`;

        container.style.backgroundSize =
            "cover";

        container.style.backgroundPosition =
            "center";


        initialElement.style.display =
            "none";

    } else {

        container.style.backgroundImage =
            "";

        initialElement.textContent =
            initial;

        initialElement.style.display =
            "block";

    }

}


// ==========================================
// PROFILE IMAGE
// ==========================================

function setProfileImage(
    photo
) {

    if (
        photo
    ) {

        profilePhotoImage.src =
            photo;

        profilePhotoImage.classList.remove(
            "hidden"
        );

        profileInitial.style.display =
            "none";

    } else {

        profilePhotoImage.src =
            "";

        profilePhotoImage.classList.add(
            "hidden"
        );

        profileInitial.style.display =
            "block";

    }

}


// ==========================================
// PROFILE PHOTO UPLOAD
// ==========================================

profilePhotoInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (
            !file
        ) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                "Invalid File",
                "Please select an image file.",
                "error"
            );

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                "File Too Large",
                "Profile photo must be smaller than 5MB.",
                "error"
            );

            return;

        }


        if (
            !currentUser ||
            !currentMemberDocId
        ) {

            return;

        }


        try {

            showLoading();


            const storageRef =
                ref(
                    storage,
                    `profilePhotos/${currentUser.uid}/profile.jpg`
                );


            await uploadBytes(
                storageRef,
                file
            );


            const photoURL =
                await getDownloadURL(
                    storageRef
                );


            const memberRef =
                doc(
                    db,
                    "members",
                    currentMemberDocId
                );


            await updateDoc(
                memberRef,
                {

                    profilePhoto:
                        photoURL,

                    updatedAt:
                        serverTimestamp()

                }
            );


            currentMember.profilePhoto =
                photoURL;


            updateDashboardUI();


            showMessage(
                "Success",
                "Profile photo updated successfully."
            );


        } catch (error) {

            console.error(
                "Photo Upload Error:",
                error
            );


            showMessage(
                "Upload Failed",
                "Unable to upload profile photo.",
                "error"
            );


        } finally {

            hideLoading();

            profilePhotoInput.value =
                "";

        }

    }
);


// ==========================================
// SAVE PROFILE
// ==========================================

saveProfileBtn.addEventListener(
    "click",
    async () => {

        if (
            !currentUser ||
            !currentMemberDocId
        ) {

            return;

        }


        const name =
            profileFullName.value.trim();

        const phone =
            profilePhone.value.trim();

        const dateOfBirth =
            profileDateOfBirth.value;

        const whatsapp =
            profileWhatsapp.value.trim();


        if (
            name.length < 2
        ) {

            showMessage(
                "Invalid Name",
                "Please enter a valid full name.",
                "error"
            );

            return;

        }


        if (
            !phone
        ) {

            showMessage(
                "Invalid Phone",
                "Please enter your phone number.",
                "error"
            );

            return;

        }


        try {

            showLoading();


            const memberRef =
                doc(
                    db,
                    "members",
                    currentMemberDocId
                );


            await updateDoc(
                memberRef,
                {

                    fullName:
                        name,

                    phone:
                        phone,

                    dateOfBirth:
                        dateOfBirth,

                    whatsappNumber:
                        whatsapp,

                    updatedAt:
                        serverTimestamp()

                }
            );


            currentMember.fullName =
                name;

            currentMember.phone =
                phone;

            currentMember.dateOfBirth =
                dateOfBirth;

            currentMember.whatsappNumber =
                whatsapp;


            updateDashboardUI();


            showMessage(
                "Success",
                "Your profile has been updated successfully."
            );


        } catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );


            showMessage(
                "Update Failed",
                "Unable to update your profile.",
                "error"
            );


        } finally {

            hideLoading();

        }

    }
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

changePasswordBtn.addEventListener(
    "click",
    async () => {

        const password =
            newPassword.value;

        const confirmPassword =
            confirmNewPassword.value;


        if (
            password.length < 6
        ) {

            showMessage(
                "Invalid Password",
                "Password must contain at least 6 characters.",
                "error"
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "Password Mismatch",
                "New password and confirm password do not match.",
                "error"
            );

            return;

        }


        if (
            !currentUser
        ) {

            return;

        }


        try {

            showLoading();


            await updatePassword(
                currentUser,
                password
            );


            newPassword.value =
                "";

            confirmNewPassword.value =
                "";


            showMessage(
                "Success",
                "Your password has been changed successfully."
            );


        } catch (error) {

            console.error(
                "Password Error:",
                error
            );


            if (
                error.code ===
                "auth/requires-recent-login"
            ) {

                showMessage(
                    "Login Required",
                    "Please logout and login again before changing your password.",
                    "error"
                );

            } else {

                showMessage(
                    "Password Change Failed",
                    "Unable to change your password.",
                    "error"
                );

            }


        } finally {

            hideLoading();

        }

    }
);


// ==========================================
// PAYMENT METHOD CHANGE
// ==========================================

paymentMethod.addEventListener(
    "change",
    () => {

        const method =
            paymentMethod.value;


        // Hide all

        bkashTrxGroup.classList.add(
            "hidden"
        );

        bkashBankTrxGroup.classList.add(
            "hidden"
        );

        bankNameGroup.classList.add(
            "hidden"
        );

        cashGivenGroup.classList.add(
            "hidden"
        );


        // bKash

        if (
            method ===
            "bkash"
        ) {

            bkashTrxGroup.classList.remove(
                "hidden"
            );

        }


        // bKash to Bank

        else if (
            method ===
            "bkash-to-bank"
        ) {

            bkashBankTrxGroup.classList.remove(
                "hidden"
            );

        }


        // Bank

        else if (
            method ===
            "bank-transfer"
        ) {

            bankNameGroup.classList.remove(
                "hidden"
            );

        }


        // Cash

        else if (
            method ===
            "cash"
        ) {

            cashGivenGroup.classList.remove(
                "hidden"
            );

        }

    }
);


// ==========================================
// SET RUNNING MONTH & YEAR
// ==========================================

function setCurrentMonthYear() {

    const now =
        new Date();


    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    paymentMonth.value =
        monthNames[
            now.getMonth()
        ];


    const year =
        now.getFullYear();


    if (
        paymentYear.querySelector(
            `option[value="${year}"]`
        )
    ) {

        paymentYear.value =
            String(year);

    }

}


setCurrentMonthYear();


// ==========================================
// PAYMENT FORM VALIDATION
// ==========================================

function validatePayment() {

    const amount =
        Number(
            paymentAmount.value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        showMessage(
            "Invalid Amount",
            "Please enter a valid payment amount.",
            "error"
        );

        return false;

    }


    if (
        !paymentMethod.value
    ) {

        showMessage(
            "Payment Method Required",
            "Please select a payment method.",
            "error"
        );

        return false;

    }


    if (
        paymentMethod.value ===
        "bkash" &&
        !bkashTrxId.value.trim()
    ) {

        showMessage(
            "TRX ID Required",
            "Please enter your bKash TRX ID.",
            "error"
        );

        return false;

    }


    if (
        paymentMethod.value ===
        "bkash-to-bank" &&
        !bkashBankTrxId.value.trim()
    ) {

        showMessage(
            "TRX ID Required",
            "Please enter your TRX ID.",
            "error"
        );

        return false;

    }


    if (
        paymentMethod.value ===
        "bank-transfer" &&
        !bankName.value
    ) {

        showMessage(
            "Bank Required",
            "Please select your bank.",
            "error"
        );

        return false;

    }


    if (
        paymentMethod.value ===
        "cash" &&
        !cashGivenTo.value.trim()
    ) {

        showMessage(
            "Name Required",
            "Please enter who received the cash.",
            "error"
        );

        return false;

    }


    return true;

}


// ==========================================
// OPEN PAYMENT CONFIRMATION
// ==========================================

submitPaymentBtn.addEventListener(
    "click",
    () => {

        if (
            !validatePayment()
        ) {

            return;

        }


        const method =
            paymentMethod.value;


        confirmMemberId.textContent =
            paymentMemberId.value;

        confirmName.textContent =
            paymentName.value;

        confirmMonth.textContent =
            paymentMonth.value;

        confirmYear.textContent =
            paymentYear.value;

        confirmAmount.textContent =
            `৳${Number(
                paymentAmount.value
            ).toFixed(2)}`;


        const methodNames = {

            "bkash":
                "bKash",

            "bkash-to-bank":
                "bKash to Bank",

            "bank-transfer":
                "Bank Transfer",

            "cash":
                "Cash"

        };


        confirmMethod.textContent =
            methodNames[method] ||
            method;


        confirmRemark.textContent =
            paymentRemark.value.trim() ||
            "No remark";


        // Reset optional rows

        confirmTrxRow.classList.add(
            "hidden"
        );

        confirmBankRow.classList.add(
            "hidden"
        );

        confirmCashRow.classList.add(
            "hidden"
        );


        // bKash

        if (
            method ===
            "bkash"
        ) {

            confirmTrxId.textContent =
                bkashTrxId.value.trim();

            confirmTrxRow.classList.remove(
                "hidden"
            );

        }


        // bKash to Bank

        if (
            method ===
            "bkash-to-bank"
        ) {

            confirmTrxId.textContent =
                bkashBankTrxId.value.trim();

            confirmTrxRow.classList.remove(
                "hidden"
            );

        }


        // Bank

        if (
            method ===
            "bank-transfer"
        ) {

            confirmBank.textContent =
                bankName.value;

            confirmBankRow.classList.remove(
                "hidden"
            );

        }


        // Cash

        if (
            method ===
            "cash"
        ) {

            confirmCashGiven.textContent =
                cashGivenTo.value.trim();

            confirmCashRow.classList.remove(
                "hidden"
            );

        }


        paymentConfirmModal.classList.remove(
            "hidden"
        );

    }
);


// ==========================================
// CLOSE PAYMENT MODAL
// ==========================================

function closePaymentConfirmation() {

    paymentConfirmModal.classList.add(
        "hidden"
    );

}


closePaymentModal.addEventListener(
    "click",
    closePaymentConfirmation
);


cancelPaymentBtn.addEventListener(
    "click",
    closePaymentConfirmation
);


// ==========================================
// CHECK DUPLICATE TRX
// ==========================================

async function checkDuplicateTrx(
    trxId
) {

    if (
        !trxId
    ) {

        return false;

    }


    const paymentsRef =
        collection(
            db,
            "payments"
        );


    const trxQuery =
        query(
            paymentsRef,
            where(
                "trxId",
                "==",
                trxId
            )
        );


    const snapshot =
        await getDocs(
            trxQuery
        );


    return !snapshot.empty;

}


// ==========================================
// CONFIRM PAYMENT
// ==========================================

confirmPaymentBtn.addEventListener(
    "click",
    async () => {

        if (
            !currentUser ||
            !currentMember
        ) {

            return;

        }


        const method =
            paymentMethod.value;


        let trxId =
            "";


        if (
            method ===
            "bkash"
        ) {

            trxId =
                bkashTrxId.value.trim();

        }


        if (
            method ===
            "bkash-to-bank"
        ) {

            trxId =
                bkashBankTrxId.value.trim();

        }


        try {

            confirmPaymentBtn.disabled =
                true;


            showLoading();


            // Check duplicate TRX

            if (
                trxId
            ) {

                const exists =
                    await checkDuplicateTrx(
                        trxId
                    );


                if (
                    exists
                ) {

                    throw new Error(
                        "This TRX ID has already been submitted."
                    );

                }

            }


            // Payment Data

            const paymentData = {

                memberId:
                    currentMember.memberId,

                uid:
                    currentUser.uid,

                name:
                    currentMember.fullName,

                phone:
                    currentMember.phone,

                email:
                    currentMember.email,

                month:
                    paymentMonth.value,

                year:
                    Number(
                        paymentYear.value
                    ),

                amount:
                    Number(
                        paymentAmount.value
                    ),

                paymentMethod:
                    method,

                trxId:
                    trxId,

                bankName:
                    method ===
                    "bank-transfer"
                        ? bankName.value
                        : "",

                cashGivenTo:
                    method ===
                    "cash"
                        ? cashGivenTo.value.trim()
                        : "",

                remark:
                    paymentRemark.value.trim(),

                status:
                    "pending",

                createdAt:
                    serverTimestamp(),

                approvedAt:
                    null,

                approvedBy:
                    ""

            };


            await addDoc(
                collection(
                    db,
                    "payments"
                ),
                paymentData
            );


            closePaymentConfirmation();


            clearPaymentForm();


            await loadPaymentHistory();


            showMessage(
                "Payment Submitted",
                "Your payment has been submitted successfully and is now pending admin approval."
            );


        } catch (error) {

            console.error(
                "Payment Error:",
                error
            );


            showMessage(
                "Payment Failed",
                error.message ||
                "Unable to submit payment.",
                "error"
            );


        } finally {

            hideLoading();

            confirmPaymentBtn.disabled =
                false;

        }

    }
);


// ==========================================
// CLEAR PAYMENT FORM
// ==========================================

function clearPaymentForm() {

    paymentAmount.value =
        "";

    paymentMethod.value =
        "";

    bkashTrxId.value =
        "";

    bkashBankTrxId.value =
        "";

    bankName.value =
        "";

    cashGivenTo.value =
        "";

    paymentRemark.value =
        "";


    bkashTrxGroup.classList.add(
        "hidden"
    );

    bkashBankTrxGroup.classList.add(
        "hidden"
    );

    bankNameGroup.classList.add(
        "hidden"
    );

    cashGivenGroup.classList.add(
        "hidden"
    );


    setCurrentMonthYear();

}


// ==========================================
// LOAD PAYMENT HISTORY
// ==========================================

async function loadPaymentHistory() {

    if (
        !currentUser
    ) {

        return;

    }


    try {

        const paymentsRef =
            collection(
                db,
                "payments"
            );


        const paymentQuery =
            query(
                paymentsRef,
                where(
                    "uid",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                paymentQuery
            );


        const payments =
            snapshot.docs.map(
                paymentDoc => ({

                    id:
                        paymentDoc.id,

                    ...paymentDoc.data()

                })
            );


        // Sort newest first

        payments.sort(
            (a, b) => {

                const dateA =
                    a.createdAt?.toMillis?.() ||
                    0;

                const dateB =
                    b.createdAt?.toMillis?.() ||
                    0;

                return dateB - dateA;

            }
        );


        // Summary

        totalPayments.textContent =
            payments.length;


        approvedPayments.textContent =
            payments.filter(
                payment =>
                    payment.status ===
                    "approved"
            ).length;


        pendingPayments.textContent =
            payments.filter(
                payment =>
                    payment.status ===
                    "pending"
            ).length;


        renderPaymentHistory(
            payments
        );


    } catch (error) {

        console.error(
            "History Error:",
            error
        );

    }

}


// ==========================================
// RENDER PAYMENT HISTORY
// ==========================================

function renderPaymentHistory(
    payments
) {

    // Remove previous records

    const oldItems =
        historyList.querySelectorAll(
            ".history-item"
        );


    oldItems.forEach(
        item => {

            item.remove();

        }
    );


    if (
        payments.length === 0
    ) {

        emptyHistory.classList.remove(
            "hidden"
        );

        return;

    }


    emptyHistory.classList.add(
        "hidden"
    );


    payments.forEach(
        payment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            const status =
                payment.status ||
                "pending";


            const statusText =
                status
                    .charAt(0)
                    .toUpperCase() +
                status.slice(1);


            const createdDate =
                payment.createdAt?.toDate
                    ? payment.createdAt
                        .toDate()
                        .toLocaleDateString(
                            "en-BD"
                        )
                    : "N/A";


            item.innerHTML = `

                <div class="history-item-left">

                    <div class="history-item-icon">
                        💳
                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(
                                payment.month ||
                                ""
                            )}
                            ${payment.year || ""}
                        </h4>

                        <p>
                            ${escapeHTML(
                                payment.paymentMethod ||
                                ""
                            )}
                        </p>

                        <small>
                            ${createdDate}
                        </small>

                    </div>

                </div>


                <div class="history-item-right">

                    <strong>
                        ৳${Number(
                            payment.amount ||
                            0
                        ).toFixed(2)}
                    </strong>

                    <span class="payment-status ${status}">
                        ${statusText}
                    </span>

                </div>

            `;


            historyList.appendChild(
                item
            );

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value || ""
        );


    return div.innerHTML;

}


// ==========================================
// LOAD ADMIN NOTICE
// ==========================================

async function loadAdminNotice() {

    try {

        const noticeRef =
            doc(
                db,
                "settings",
                "notice"
            );


        const noticeSnap =
            await getDoc(
                noticeRef
            );


        if (
            !noticeSnap.exists()
        ) {

            return;

        }


        const notice =
            noticeSnap.data();


        if (
            !notice.message ||
            notice.active === false
        ) {

            return;

        }


        noticeContent.textContent =
            notice.message;


        if (
            notice.createdAt?.toDate
        ) {

            noticeDate.textContent =
                notice.createdAt
                    .toDate()
                    .toLocaleDateString(
                        "en-BD"
                    );

        } else {

            noticeDate.textContent =
                "-";

        }


        // Show every login

        noticeModal.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            "Notice Error:",
            error
        );

    }

}


// ==========================================
// CLOSE NOTICE
// ==========================================

closeNoticeBtn.addEventListener(
    "click",
    () => {

        noticeModal.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    () => {

        logoutModal.classList.remove(
            "hidden"
        );

    }
);


// Cancel logout

cancelLogoutBtn.addEventListener(
    "click",
    () => {

        logoutModal.classList.add(
            "hidden"
        );

    }
);


// Confirm logout

confirmLogoutBtn.addEventListener(
    "click",
    async () => {

        try {

            confirmLogoutBtn.disabled =
                true;


            showLoading();


            await signOut(
                auth
            );


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );


            showMessage(
                "Logout Failed",
                "Unable to logout. Please try again.",
                "error"
            );


        } finally {

            hideLoading();

            confirmLogoutBtn.disabled =
                false;

        }

    }
);


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async user => {

        if (
            user
        ) {

            currentUser =
                user;


            await loadMemberData(
                user
            );


        } else {

            window.location.href =
                "index.html";

        }

    }
);