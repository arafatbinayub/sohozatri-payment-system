// ==========================================
// SOHOZATRI ADMIN DASHBOARD
// File: admin-dashboard.js
// ==========================================

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentAdmin = null;

let selectedMember = null;

let selectedPayment = null;

let allMembers = [];

let allPayments = [];


// ==========================================
// ELEMENTS
// ==========================================

const sidebar =
    document.getElementById(
        "sidebar"
    );

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const loadingOverlay =
    document.getElementById(
        "loadingOverlay"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const logoutModal =
    document.getElementById(
        "logoutModal"
    );

const cancelLogoutBtn =
    document.getElementById(
        "cancelLogoutBtn"
    );

const confirmLogoutBtn =
    document.getElementById(
        "confirmLogoutBtn"
    );


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    if (loadingOverlay) {

        loadingOverlay.classList.remove(
            "hidden"
        );

    }

}


function hideLoading() {

    if (loadingOverlay) {

        loadingOverlay.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    title,
    message,
    icon = "✓"
) {

    const modal =
        document.getElementById(
            "messageModal"
        );

    const titleElement =
        document.getElementById(
            "generalMessageTitle"
        );

    const messageElement =
        document.getElementById(
            "generalMessageText"
        );

    const iconElement =
        document.getElementById(
            "generalMessageIcon"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    if (iconElement) {

        iconElement.textContent =
            icon;

    }


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// CLOSE MESSAGE
// ==========================================

const closeMessageBtn =
    document.getElementById(
        "closeMessageBtn"
    );


if (closeMessageBtn) {

    closeMessageBtn.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "messageModal"
                )
                ?.classList.add(
                    "hidden"
                );

        }
    );

}


// ==========================================
// SIDEBAR
// ==========================================

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar?.classList.toggle(
                "open"
            );

        }
    );

}


// ==========================================
// PAGE NAVIGATION
// ==========================================

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

const pageSections =
    document.querySelectorAll(
        ".page-section"
    );


function openSection(
    sectionId,
    title
) {

    pageSections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
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


    if (pageTitle) {

        pageTitle.textContent =
            title;

    }


    if (
        window.innerWidth <= 768
    ) {

        sidebar?.classList.remove(
            "open"
        );

    }


    if (
        sectionId ===
        "membersSection"
    ) {

        loadMembers();

    }


    if (
        sectionId ===
        "historySection"
    ) {

        loadAllHistory();

    }


    if (
        sectionId ===
        "noteSection"
    ) {

        loadAdminNote();

    }

}


// ==========================================
// NAV CLICK
// ==========================================

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;


                const titles = {

                    dashboardSection:
                        "Dashboard",

                    membersSection:
                        "Members",

                    addMemberSection:
                        "Add Member",

                    balanceSection:
                        "Add / Remove Balance",

                    removeMemberSection:
                        "Remove Member",

                    historySection:
                        "History",

                    noteSection:
                        "Member Note"

                };


                openSection(
                    section,
                    titles[section] ||
                    "Dashboard"
                );

            }
        );

    }
);


// ==========================================
// QUICK ACTIONS
// ==========================================

document
    .querySelectorAll(
        ".quick-action, .stat-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const section =
                        card.dataset.section;


                    if (!section) {
                        return;
                    }


                    const titles = {

                        dashboardSection:
                            "Dashboard",

                        membersSection:
                            "Members",

                        addMemberSection:
                            "Add Member",

                        balanceSection:
                            "Add / Remove Balance",

                        removeMemberSection:
                            "Remove Member",

                        historySection:
                            "History",

                        noteSection:
                            "Member Note"

                    };


                    openSection(
                        section,
                        titles[section] ||
                        "Dashboard"
                    );

                }
            );

        }
    );


// ==========================================
// ADMIN AUTH CHECK
// ==========================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }


        try {

            showLoading();


            currentAdmin =
                user;


            await checkAdmin(
                user
            );


            await loadAdminProfile(
                user
            );


            await loadDashboardData();


            await loadMembers();


            await loadAllHistory();


            await loadAdminNote();


            hideLoading();


        } catch (error) {

            console.error(
                "Admin Error:",
                error
            );


            hideLoading();


            showMessage(
                "Access Denied",
                "You are not authorized to access Admin Dashboard.",
                "!"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                2000
            );

        }

    }
);


// ==========================================
// CHECK ADMIN
// ==========================================

async function checkAdmin(
    user
) {

    const adminRef =
        doc(
            db,
            "admins",
            user.uid
        );


    const adminSnap =
        await getDoc(
            adminRef
        );


    if (
        adminSnap.exists()
    ) {

        return true;

    }


    // Optional email based admin check

    const adminQuery =
        query(
            collection(
                db,
                "admins"
            ),
            where(
                "email",
                "==",
                user.email
            )
        );


    const snapshot =
        await getDocs(
            adminQuery
        );


    if (
        snapshot.empty
    ) {

        throw new Error(
            "Not an admin"
        );

    }


    return true;

}


// ==========================================
// LOAD ADMIN PROFILE
// ==========================================

async function loadAdminProfile(
    user
) {

    let name =
        user.displayName ||
        "Admin";


    const adminRef =
        doc(
            db,
            "admins",
            user.uid
        );


    const adminSnap =
        await getDoc(
            adminRef
        );


    if (
        adminSnap.exists()
    ) {

        const data =
            adminSnap.data();


        name =
            data.name ||
            data.fullName ||
            name;

    }


    const adminName =
        document.getElementById(
            "adminName"
        );


    const dashboardName =
        document.getElementById(
            "dashboardAdminName"
        );


    const initial =
        document.getElementById(
            "adminProfileInitial"
        );


    if (adminName) {

        adminName.textContent =
            name;

    }


    if (dashboardName) {

        dashboardName.textContent =
            name;

    }


    if (initial) {

        initial.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


// ==========================================
// DASHBOARD DATA
// ==========================================

async function loadDashboardData() {

    await loadMembers();

    await loadPayments();


    const totalMembersElement =
        document.getElementById(
            "totalMembers"
        );


    if (totalMembersElement) {

        totalMembersElement.textContent =
            allMembers.length;

    }


    let totalBalance = 0;


    allMembers.forEach(
        member => {

            totalBalance +=
                Number(
                    member.balance ||
                    0
                );

        }
    );


    const totalBalanceElement =
        document.getElementById(
            "totalBalance"
        );


    if (totalBalanceElement) {

        totalBalanceElement.textContent =
            totalBalance.toLocaleString(
                "en-BD",
                {
                    minimumFractionDigits: 2
                }
            );

    }


    let pending =
        0;

    let approved =
        0;


    allPayments.forEach(
        payment => {

            if (
                payment.status ===
                "pending"
            ) {

                pending++;

            }


            if (
                payment.status ===
                "approved"
            ) {

                approved++;

            }

        }
    );


    document.getElementById(
        "pendingPayments"
    )?.replaceChildren(
        document.createTextNode(
            pending
        )
    );


    document.getElementById(
        "approvedPayments"
    )?.replaceChildren(
        document.createTextNode(
            approved
        )
    );

}


// ==========================================
// LOAD MEMBERS
// ==========================================

async function loadMembers() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "members"
                )
            );


        allMembers = [];


        snapshot.forEach(
            item => {

                allMembers.push({

                    uid:
                        item.id,

                    ...item.data()

                });

            }
        );


        renderMembers(
            allMembers
        );


        const totalMembers =
            document.getElementById(
                "totalMembers"
            );


        if (totalMembers) {

            totalMembers.textContent =
                allMembers.length;

        }


    } catch (error) {

        console.error(
            "Members Error:",
            error
        );

    }

}


// ==========================================
// RENDER MEMBERS
// ==========================================

function renderMembers(
    members
) {

    const container =
        document.getElementById(
            "membersList"
        );


    if (!container) {
        return;
    }


    if (
        members.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-users"></i>

                <h3>
                    No Members
                </h3>

                <p>
                    Registered members will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        members
            .map(
                member => {

                    const name =
                        member.fullName ||
                        member.name ||
                        "Member";


                    const id =
                        member.memberId ||
                        "SHZ000";


                    const initial =
                        name
                            .charAt(0)
                            .toUpperCase();


                    return `

                        <div
                            class="member-card"
                            data-uid="${member.uid}"
                        >

                            <div
                                class="member-card-header"
                            >

                                <div
                                    class="member-avatar"
                                >

                                    ${
                                        member.photoURL
                                            ? `
                                                <img
                                                    src="${member.photoURL}"
                                                    style="
                                                        width:100%;
                                                        height:100%;
                                                        object-fit:cover;
                                                        border-radius:50%;
                                                    "
                                                >
                                            `
                                            : initial
                                    }

                                </div>


                                <div>

                                    <div
                                        class="member-card-name"
                                    >
                                        ${escapeHTML(name)}
                                    </div>

                                    <span
                                        class="member-card-id"
                                    >
                                        ${escapeHTML(id)}
                                    </span>

                                </div>

                            </div>


                            <div
                                class="member-card-info"
                            >

                                <p>

                                    <i
                                        class="fa-solid fa-phone"
                                    ></i>

                                    ${escapeHTML(
                                        member.phone ||
                                        "-"
                                    )}

                                </p>


                                <p>

                                    <i
                                        class="fa-solid fa-envelope"
                                    ></i>

                                    ${escapeHTML(
                                        member.email ||
                                        "-"
                                    )}

                                </p>


                                <div
                                    class="member-card-balance"
                                >

                                    Balance:
                                    ৳${Number(
                                        member.balance ||
                                        0
                                    ).toLocaleString()}

                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            ".member-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const uid =
                            card.dataset.uid;


                        const member =
                            allMembers.find(
                                item =>
                                    item.uid ===
                                    uid
                            );


                        if (member) {

                            openMemberProfile(
                                member
                            );

                        }

                    }
                );

            }
        );

}


// ==========================================
// SEARCH MEMBERS
// ==========================================

const memberSearch =
    document.getElementById(
        "memberSearch"
    );


if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        () => {

            const search =
                memberSearch.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allMembers.filter(
                    member => {

                        const name =
                            (
                                member.fullName ||
                                member.name ||
                                ""
                            )
                            .toLowerCase();


                        const id =
                            (
                                member.memberId ||
                                ""
                            )
                            .toLowerCase();


                        const phone =
                            (
                                member.phone ||
                                ""
                            )
                            .toLowerCase();


                        return (

                            name.includes(
                                search
                            ) ||

                            id.includes(
                                search
                            ) ||

                            phone.includes(
                                search
                            )

                        );

                    }
                );


            renderMembers(
                filtered
            );

        }
    );

}


// ==========================================
// MEMBER PROFILE MODAL
// ==========================================

function openMemberProfile(
    member
) {

    selectedMember =
        member;


    const name =
        member.fullName ||
        member.name ||
        "Member";


    document.getElementById(
        "modalMemberName"
    )?.replaceChildren(
        document.createTextNode(
            name
        )
    );


    document.getElementById(
        "modalMemberId"
    )?.replaceChildren(
        document.createTextNode(
            member.memberId ||
            "SHZ000"
        )
    );


    document.getElementById(
        "modalMemberPhone"
    )?.replaceChildren(
        document.createTextNode(
            member.phone ||
            "-"
        )
    );


    document.getElementById(
        "modalMemberEmail"
    )?.replaceChildren(
        document.createTextNode(
            member.email ||
            "-"
        )
    );


    document.getElementById(
        "modalMemberBalance"
    )?.replaceChildren(
        document.createTextNode(
            `৳${Number(
                member.balance ||
                0
            ).toLocaleString()}`
        )
    );


    document.getElementById(
        "modalMemberWhatsapp"
    )?.replaceChildren(
        document.createTextNode(
            member.whatsapp ||
            member.whatsappNumber ||
            "-"
        )
    );


    document.getElementById(
        "modalMemberDob"
    )?.replaceChildren(
        document.createTextNode(
            member.dateOfBirth ||
            "-"
        )
    );


    const initial =
        document.getElementById(
            "modalMemberInitial"
        );


    if (initial) {

        initial.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }


    document
        .getElementById(
            "memberProfileModal"
        )
        ?.classList.remove(
            "hidden"
        );

}


// ==========================================
// CLOSE MEMBER MODAL
// ==========================================

document
    .getElementById(
        "closeMemberProfileBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "memberProfileModal"
                )
                ?.classList.add(
                    "hidden"
                );

        }
    );


// ==========================================
// ADD MEMBER
// ==========================================

const addMemberForm =
    document.getElementById(
        "addMemberForm"
    );


if (addMemberForm) {

    addMemberForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "addMemberName"
                )?.value.trim();


            const phone =
                document.getElementById(
                    "addMemberPhone"
                )?.value.trim();


            const email =
                document.getElementById(
                    "addMemberEmail"
                )?.value.trim();


            const password =
                document.getElementById(
                    "addMemberPassword"
                )?.value;


            const confirmPassword =
                document.getElementById(
                    "addMemberConfirmPassword"
                )?.value;


            const balance =
                Number(
                    document.getElementById(
                        "addMemberBalance"
                    )?.value ||
                    0
                );


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Password Error",
                    "Passwords do not match.",
                    "!"
                );

                return;

            }


            try {

                showLoading();


                /*
                 IMPORTANT:

                 Creating a Firebase Auth user
                 with the same auth instance
                 will log the Admin out.

                 For production, use Firebase
                 Admin SDK / Cloud Function.

                 This section creates the
                 Firestore member document
                 after Auth creation.
                */


                const memberId =
                    await generateMemberId();


                const memberRef =
                    await addDoc(
                        collection(
                            db,
                            "memberRequests"
                        ),
                        {

                            fullName:
                                name,

                            phone:
                                phone,

                            email:
                                email,

                            password:
                                password,

                            memberId:
                                memberId,

                            balance:
                                balance,

                            createdBy:
                                currentAdmin.uid,

                            status:
                                "pending",

                            createdAt:
                                serverTimestamp()

                        }
                    );


                await addDoc(
                    collection(
                        db,
                        "activityHistory"
                    ),
                    {

                        type:
                            "member_add_request",

                        memberId:
                            memberId,

                        name:
                            name,

                        email:
                            email,

                        createdBy:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                addMemberForm.reset();


                showMessage(
                    "Member Request Created",
                    "Member information has been saved. Firebase Authentication account creation should be handled by a secure Admin backend.",
                    "✓"
                );


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Failed",
                    error.message,
                    "!"
                );

            }

        }
    );

}


// ==========================================
// GENERATE MEMBER ID
// ==========================================

async function generateMemberId() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "members"
            )
        );


    let maxNumber =
        0;


    snapshot.forEach(
        item => {

            const id =
                item.data()
                    ?.memberId;


            if (
                id &&
                id.startsWith(
                    "SHZ"
                )
            ) {

                const number =
                    parseInt(
                        id.replace(
                            "SHZ",
                            ""
                        ),
                        10
                    );


                if (
                    number >
                    maxNumber
                ) {

                    maxNumber =
                        number;

                }

            }

        }
    );


    return `SHZ${String(
        maxNumber + 1
    ).padStart(
        3,
        "0"
    )}`;

}


// ==========================================
// FIND BALANCE MEMBER
// ==========================================

const findBalanceMemberBtn =
    document.getElementById(
        "findBalanceMemberBtn"
    );


if (findBalanceMemberBtn) {

    findBalanceMemberBtn.addEventListener(
        "click",
        () => {

            const memberId =
                document.getElementById(
                    "balanceMemberId"
                )?.value
                .trim()
                .toUpperCase();


            const member =
                allMembers.find(
                    item =>
                        (
                            item.memberId ||
                            ""
                        )
                        .toUpperCase() ===
                        memberId
                );


            if (!member) {

                showMessage(
                    "Member Not Found",
                    "No member found with this Member ID.",
                    "!"
                );

                return;

            }


            selectedMember =
                member;


            document
                .getElementById(
                    "balanceMemberInfo"
                )
                ?.classList.remove(
                    "hidden"
                );


            document.getElementById(
                "balanceMemberInitial"
            ).textContent =
                (
                    member.fullName ||
                    member.name ||
                    "M"
                )
                .charAt(0)
                .toUpperCase();


            document.getElementById(
                "balanceMemberName"
            ).textContent =
                member.fullName ||
                member.name ||
                "Member";


            document.getElementById(
                "balanceMemberCurrentBalance"
            ).textContent =
                `Current Balance: ৳${Number(
                    member.balance ||
                    0
                ).toLocaleString()}`;

        }
    );

}


// ==========================================
// BALANCE UPDATE
// ==========================================

const balanceForm =
    document.getElementById(
        "balanceForm"
    );


if (balanceForm) {

    balanceForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!selectedMember) {

                showMessage(
                    "Find Member",
                    "Please find a member first.",
                    "!"
                );

                return;

            }


            const action =
                document.getElementById(
                    "balanceAction"
                )?.value;


            const amount =
                Number(
                    document.getElementById(
                        "balanceAmount"
                    )?.value ||
                    0
                );


            const remark =
                document.getElementById(
                    "balanceRemark"
                )?.value.trim();


            if (
                !action ||
                amount <= 0
            ) {

                showMessage(
                    "Invalid Data",
                    "Please select action and enter valid amount.",
                    "!"
                );

                return;

            }


            try {

                showLoading();


                const oldBalance =
                    Number(
                        selectedMember.balance ||
                        0
                    );


                let newBalance =
                    oldBalance;


                if (
                    action ===
                    "add"
                ) {

                    newBalance +=
                        amount;

                }


                if (
                    action ===
                    "remove"
                ) {

                    newBalance -=
                        amount;

                }


                if (
                    newBalance <
                    0
                ) {

                    hideLoading();


                    showMessage(
                        "Insufficient Balance",
                        "Member balance cannot be negative.",
                        "!"
                    );

                    return;

                }


                await updateDoc(
                    doc(
                        db,
                        "members",
                        selectedMember.uid
                    ),
                    {

                        balance:
                            newBalance,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                await addDoc(
                    collection(
                        db,
                        "balanceHistory"
                    ),
                    {

                        uid:
                            selectedMember.uid,

                        memberId:
                            selectedMember.memberId,

                        memberName:
                            selectedMember.fullName ||
                            selectedMember.name,

                        action:
                            action,

                        amount:
                            amount,

                        oldBalance:
                            oldBalance,

                        newBalance:
                            newBalance,

                        remark:
                            remark,

                        adminUid:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                await addDoc(
                    collection(
                        db,
                        "activityHistory"
                    ),
                    {

                        type:
                            "balance_change",

                        uid:
                            selectedMember.uid,

                        memberId:
                            selectedMember.memberId,

                        amount:
                            amount,

                        action:
                            action,

                        createdAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                balanceForm.reset();


                document
                    .getElementById(
                        "balanceMemberInfo"
                    )
                    ?.classList.add(
                        "hidden"
                    );


                selectedMember =
                    null;


                await loadDashboardData();


                showMessage(
                    "Balance Updated",
                    "Member balance has been updated successfully.",
                    "✓"
                );


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Update Failed",
                    error.message,
                    "!"
                );

            }

        }
    );

}


// ==========================================
// LOAD PAYMENTS
// ==========================================

async function loadPayments() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "payments"
            )
        );


    allPayments = [];


    snapshot.forEach(
        item => {

            allPayments.push({

                id:
                    item.id,

                ...item.data()

            });

        }
    );


    allPayments.sort(
        (a, b) => {

            const aTime =
                a.createdAt
                    ?.toDate?.()
                    ?.getTime?.() ||
                0;


            const bTime =
                b.createdAt
                    ?.toDate?.()
                    ?.getTime?.() ||
                0;


            return bTime -
                aTime;

        }
    );

}


// ==========================================
// RENDER PAYMENT HISTORY
// ==========================================

function renderPayments() {

    const container =
        document.getElementById(
            "paymentsList"
        );


    if (!container) {
        return;
    }


    const payments =
        allPayments;


    if (
        payments.length ===
        0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-receipt"></i>

                <h3>
                    No Payment History
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML =
        payments
            .map(
                payment => {

                    const status =
                        payment.status ||
                        "pending";


                    return `

                        <div
                            class="history-item payment-history-item"
                            data-payment-id="${payment.id}"
                        >

                            <div
                                class="history-item-left"
                            >

                                <div
                                    class="history-icon"
                                >

                                    <i
                                        class="fa-solid fa-money-bill-transfer"
                                    ></i>

                                </div>


                                <div>

                                    <strong>

                                        ${escapeHTML(
                                            payment.name ||
                                            "Member"
                                        )}

                                        <small>
                                            ${escapeHTML(
                                                payment.memberId ||
                                                ""
                                            )}
                                        </small>

                                    </strong>


                                    <small>

                                        ${escapeHTML(
                                            payment.month ||
                                            ""
                                        )}

                                        ${payment.year || ""}

                                        •

                                        ${escapeHTML(
                                            payment.paymentMethod ||
                                            ""
                                        )}

                                    </small>

                                </div>

                            </div>


                            <div>

                                <div
                                    class="history-amount"
                                >

                                    ৳${Number(
                                        payment.amount ||
                                        0
                                    ).toLocaleString()}

                                </div>


                                <span
                                    class="status-badge status-${status}"
                                >

                                    ${status}

                                </span>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            ".payment-history-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        const paymentId =
                            item.dataset.paymentId;


                        const payment =
                            allPayments.find(
                                p =>
                                    p.id ===
                                    paymentId
                            );


                        if (payment) {

                            openPaymentModal(
                                payment
                            );

                        }

                    }
                );

            }
        );

}


// ==========================================
// PAYMENT MODAL
// ==========================================

function openPaymentModal(
    payment
) {

    selectedPayment =
        payment;


    const details =
        document.getElementById(
            "paymentApprovalDetails"
        );


    if (!details) {
        return;
    }


    details.innerHTML = `

        <div class="payment-detail-row">

            <span>
                Member ID
            </span>

            <strong>
                ${escapeHTML(
                    payment.memberId ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Name
            </span>

            <strong>
                ${escapeHTML(
                    payment.name ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Phone
            </span>

            <strong>
                ${escapeHTML(
                    payment.phone ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Month
            </span>

            <strong>
                ${escapeHTML(
                    payment.month ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Year
            </span>

            <strong>
                ${payment.year || "-"}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Amount
            </span>

            <strong>
                ৳${Number(
                    payment.amount ||
                    0
                ).toLocaleString()}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Method
            </span>

            <strong>
                ${escapeHTML(
                    payment.paymentMethod ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                TRX ID
            </span>

            <strong>
                ${escapeHTML(
                    payment.trxId ||
                    "-"
                )}
            </strong>

        </div>


        <div class="payment-detail-row">

            <span>
                Status
            </span>

            <strong>
                ${escapeHTML(
                    payment.status ||
                    "pending"
                )}
            </strong>

        </div>

    `;


    document
        .getElementById(
            "paymentApprovalModal"
        )
        ?.classList.remove(
            "hidden"
        );

}


// ==========================================
// CLOSE PAYMENT MODAL
// ==========================================

document
    .getElementById(
        "closePaymentApprovalBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "paymentApprovalModal"
                )
                ?.classList.add(
                    "hidden"
                );

            selectedPayment =
                null;

        }
    );


// ==========================================
// APPROVE PAYMENT
// ==========================================

document
    .getElementById(
        "approvePaymentBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            if (!selectedPayment) {
                return;
            }


            if (
                selectedPayment.status ===
                "approved"
            ) {

                showMessage(
                    "Already Approved",
                    "This payment has already been approved.",
                    "!"
                );

                return;

            }


            try {

                showLoading();


                const paymentRef =
                    doc(
                        db,
                        "payments",
                        selectedPayment.id
                    );


                const paymentSnap =
                    await getDoc(
                        paymentRef
                    );


                if (
                    !paymentSnap.exists()
                ) {

                    throw new Error(
                        "Payment not found"
                    );

                }


                const payment =
                    paymentSnap.data();


                if (
                    payment.status ===
                    "approved"
                ) {

                    hideLoading();


                    showMessage(
                        "Already Approved",
                        "This payment has already been approved.",
                        "!"
                    );

                    return;

                }


                const memberQuery =
                    query(
                        collection(
                            db,
                            "members"
                        ),
                        where(
                            "memberId",
                            "==",
                            payment.memberId
                        )
                    );


                const memberSnapshot =
                    await getDocs(
                        memberQuery
                    );


                if (
                    memberSnapshot.empty
                ) {

                    throw new Error(
                        "Member not found"
                    );

                }


                const memberDoc =
                    memberSnapshot.docs[0];


                const memberData =
                    memberDoc.data();


                const oldBalance =
                    Number(
                        memberData.balance ||
                        0
                    );


                const amount =
                    Number(
                        payment.amount ||
                        0
                    );


                const newBalance =
                    oldBalance +
                    amount;


                // Update Payment

                await updateDoc(
                    paymentRef,
                    {

                        status:
                            "approved",

                        approvedBy:
                            currentAdmin.uid,

                        approvedAt:
                            serverTimestamp()

                    }
                );


                // Add balance

                await updateDoc(
                    doc(
                        db,
                        "members",
                        memberDoc.id
                    ),
                    {

                        balance:
                            newBalance,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                // Balance History

                await addDoc(
                    collection(
                        db,
                        "balanceHistory"
                    ),
                    {

                        uid:
                            memberDoc.id,

                        memberId:
                            payment.memberId,

                        memberName:
                            payment.name,

                        action:
                            "payment_approved",

                        amount:
                            amount,

                        oldBalance:
                            oldBalance,

                        newBalance:
                            newBalance,

                        paymentId:
                            selectedPayment.id,

                        adminUid:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                // Activity History

                await addDoc(
                    collection(
                        db,
                        "activityHistory"
                    ),
                    {

                        type:
                            "payment_approved",

                        paymentId:
                            selectedPayment.id,

                        memberId:
                            payment.memberId,

                        amount:
                            amount,

                        adminUid:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                document
                    .getElementById(
                        "paymentApprovalModal"
                    )
                    ?.classList.add(
                        "hidden"
                    );


                selectedPayment =
                    null;


                await loadDashboardData();


                await loadAllHistory();


                showMessage(
                    "Payment Approved",
                    `৳${amount.toLocaleString()} has been added to member balance.`,
                    "✓"
                );


            } catch (error) {

                console.error(
                    "Approval Error:",
                    error
                );


                hideLoading();


                showMessage(
                    "Approval Failed",
                    error.message,
                    "!"
                );

            }

        }
    );


// ==========================================
// REJECT PAYMENT
// ==========================================

document
    .getElementById(
        "rejectPaymentBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            if (!selectedPayment) {
                return;
            }


            if (
                selectedPayment.status ===
                "approved"
            ) {

                showMessage(
                    "Cannot Reject",
                    "Approved payment cannot be rejected.",
                    "!"
                );

                return;

            }


            try {

                showLoading();


                await updateDoc(
                    doc(
                        db,
                        "payments",
                        selectedPayment.id
                    ),
                    {

                        status:
                            "rejected",

                        rejectedBy:
                            currentAdmin.uid,

                        rejectedAt:
                            serverTimestamp()

                    }
                );


                await addDoc(
                    collection(
                        db,
                        "activityHistory"
                    ),
                    {

                        type:
                            "payment_rejected",

                        paymentId:
                            selectedPayment.id,

                        memberId:
                            selectedPayment.memberId,

                        amount:
                            selectedPayment.amount,

                        adminUid:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                document
                    .getElementById(
                        "paymentApprovalModal"
                    )
                    ?.classList.add(
                        "hidden"
                    );


                selectedPayment =
                    null;


                await loadDashboardData();


                await loadAllHistory();


                showMessage(
                    "Payment Rejected",
                    "Payment has been rejected. Balance was not changed.",
                    "✓"
                );


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Reject Failed",
                    error.message,
                    "!"
                );

            }

        }
    );


// ==========================================
// REMOVE MEMBER
// ==========================================

const removeMemberForm =
    document.getElementById(
        "removeMemberForm"
    );


if (removeMemberForm) {

    removeMemberForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const memberId =
                document.getElementById(
                    "removeMemberId"
                )?.value
                .trim()
                .toUpperCase();


            const member =
                allMembers.find(
                    item =>
                        (
                            item.memberId ||
                            ""
                        )
                        .toUpperCase() ===
                        memberId
                );


            if (!member) {

                showMessage(
                    "Member Not Found",
                    "No member found with this Member ID.",
                    "!"
                );

                return;

            }


            const confirmed =
                confirm(
                    `Are you sure you want to remove ${member.fullName || member.name}?`
                );


            if (!confirmed) {
                return;
            }


            try {

                showLoading();


                await deleteDoc(
                    doc(
                        db,
                        "members",
                        member.uid
                    )
                );


                await addDoc(
                    collection(
                        db,
                        "activityHistory"
                    ),
                    {

                        type:
                            "member_removed",

                        memberId:
                            member.memberId,

                        memberName:
                            member.fullName ||
                            member.name,

                        adminUid:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                removeMemberForm.reset();


                await loadDashboardData();


                showMessage(
                    "Member Removed",
                    "Member has been removed from the member database.",
                    "✓"
                );


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Remove Failed",
                    error.message,
                    "!"
                );

            }

        }
    );

}


// ==========================================
// LOAD ALL HISTORY
// ==========================================

async function loadAllHistory() {

    await loadPayments();


    renderPayments();


    await loadRegistrationHistory();


    await loadBalanceHistory();

}


// ==========================================
// REGISTRATION HISTORY
// ==========================================

async function loadRegistrationHistory() {

    const container =
        document.getElementById(
            "registrationsList"
        );


    if (!container) {
        return;
    }


    try {

        const q =
            query(
                collection(
                    db,
                    "activityHistory"
                ),
                where(
                    "type",
                    "==",
                    "member_registered"
                )
            );


        const snapshot =
            await getDocs(q);


        if (
            snapshot.empty
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-user-plus"></i>

                    <h3>
                        No Registration History
                    </h3>

                </div>

            `;

            return;

        }


        let html = "";


        snapshot.forEach(
            item => {

                const data =
                    item.data();


                html += `

                    <div class="history-item">

                        <div
                            class="history-item-left"
                        >

                            <div
                                class="history-icon"
                            >

                                <i
                                    class="fa-solid fa-user-plus"
                                ></i>

                            </div>


                            <div>

                                <strong>
                                    ${escapeHTML(
                                        data.memberName ||
                                        data.name ||
                                        "Member"
                                    )}
                                </strong>

                                <small>
                                    Member ID:
                                    ${escapeHTML(
                                        data.memberId ||
                                        "-"
                                    )}
                                </small>

                            </div>

                        </div>


                        <span
                            class="status-badge status-approved"
                        >

                            Registered

                        </span>

                    </div>

                `;

            }
        );


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            error
        );

    }

}


// ==========================================
// BALANCE HISTORY
// ==========================================

async function loadBalanceHistory() {

    const container =
        document.getElementById(
            "balanceHistoryList"
        );


    if (!container) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "balanceHistory"
                )
            );


        if (
            snapshot.empty
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-wallet"></i>

                    <h3>
                        No Balance History
                    </h3>

                </div>

            `;

            return;

        }


        let html = "";


        snapshot.forEach(
            item => {

                const data =
                    item.data();


                const action =
                    data.action ||
                    "";


                const isAdd =
                    action ===
                    "add" ||
                    action ===
                    "payment_approved";


                html += `

                    <div class="history-item">

                        <div
                            class="history-item-left"
                        >

                            <div
                                class="history-icon"
                            >

                                <i
                                    class="fa-solid fa-wallet"
                                ></i>

                            </div>


                            <div>

                                <strong>

                                    ${escapeHTML(
                                        data.memberName ||
                                        "Member"
                                    )}

                                </strong>


                                <small>

                                    ${escapeHTML(
                                        data.memberId ||
                                        ""
                                    )}

                                    •

                                    ${escapeHTML(
                                        action
                                    )}

                                </small>

                            </div>

                        </div>


                        <div
                            class="history-amount"
                        >

                            ${isAdd ? "+" : "-"}
                            ৳${Number(
                                data.amount ||
                                0
                            ).toLocaleString()}

                        </div>

                    </div>

                `;

            }
        );


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            error
        );

    }

}


// ==========================================
// HISTORY TABS
// ==========================================

document
    .querySelectorAll(
        ".history-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".history-tab"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    document
                        .querySelectorAll(
                            ".history-content"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    tab.classList.add(
                        "active"
                    );


                    const historyType =
                        tab.dataset.history;


                    if (
                        historyType ===
                        "payments"
                    ) {

                        document
                            .getElementById(
                                "paymentsHistory"
                            )
                            ?.classList.add(
                                "active"
                            );

                    }


                    if (
                        historyType ===
                        "registrations"
                    ) {

                        document
                            .getElementById(
                                "registrationsHistory"
                            )
                            ?.classList.add(
                                "active"
                            );

                    }


                    if (
                        historyType ===
                        "balance"
                    ) {

                        document
                            .getElementById(
                                "balanceHistory"
                            )
                            ?.classList.add(
                                "active"
                            );

                    }

                }
            );

        }
    );


// ==========================================
// ADMIN NOTE
// ==========================================

async function loadAdminNote() {

    try {

        const noteRef =
            doc(
                db,
                "settings",
                "notice"
            );


        const noteSnap =
            await getDoc(
                noteRef
            );


        if (
            !noteSnap.exists()
        ) {

            return;

        }


        const data =
            noteSnap.data();


        document.getElementById(
            "noteTitle"
        ).value =
            data.title ||
            "";


        document.getElementById(
            "noteMessage"
        ).value =
            data.message ||
            "";


        document.getElementById(
            "noteActive"
        ).checked =
            data.active !==
            false;


    } catch (error) {

        console.error(
            "Note Load Error:",
            error
        );

    }

}


// ==========================================
// SAVE NOTE
// ==========================================

const noteForm =
    document.getElementById(
        "noteForm"
    );


if (noteForm) {

    noteForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const title =
                document.getElementById(
                    "noteTitle"
                )?.value.trim();


            const message =
                document.getElementById(
                    "noteMessage"
                )?.value.trim();


            const active =
                document.getElementById(
                    "noteActive"
                )?.checked;


            if (!message) {

                showMessage(
                    "Note Required",
                    "Please write a note message.",
                    "!"
                );

                return;

            }


            try {

                showLoading();


                await setDoc(
                    doc(
                        db,
                        "settings",
                        "notice"
                    ),
                    {

                        title:
                            title ||
                            "Important Notice",

                        message:
                            message,

                        active:
                            active,

                        updatedBy:
                            currentAdmin.uid,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                hideLoading();


                showMessage(
                    "Note Saved",
                    "Members will see this note when they login.",
                    "✓"
                );


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Save Failed",
                    error.message,
                    "!"
                );

            }

        }
    );

}


// ==========================================
// REFRESH MEMBERS
// ==========================================

document
    .getElementById(
        "refreshMembersBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            showLoading();

            await loadMembers();

            hideLoading();

        }
    );


// ==========================================
// REFRESH HISTORY
// ==========================================

document
    .getElementById(
        "refreshHistoryBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            showLoading();

            await loadAllHistory();

            hideLoading();

        }
    );


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            logoutModal
                ?.classList.remove(
                    "hidden"
                );

        }
    );

}


cancelLogoutBtn
    ?.addEventListener(
        "click",
        () => {

            logoutModal
                ?.classList.add(
                    "hidden"
                );

        }
    );


confirmLogoutBtn
    ?.addEventListener(
        "click",
        async () => {

            try {

                showLoading();


                await signOut(
                    auth
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    error
                );


                hideLoading();


                showMessage(
                    "Logout Failed",
                    error.message,
                    "!"
                );

            }

        }
    );


// ==========================================
// OUTSIDE MODAL CLICK
// ==========================================

document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        modal.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        }
    );


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
            value ??
            ""
        );


    return div.innerHTML;

}


// ==========================================
// AUTO DASHBOARD REFRESH
// ==========================================

setInterval(
    async () => {

        if (
            currentAdmin
        ) {

            try {

                await loadDashboardData();

            } catch (error) {

                console.error(
                    "Auto Refresh Error:",
                    error
                );

            }

        }

    },
    60000
);