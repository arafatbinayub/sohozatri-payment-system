content://com.android.externalstorage.documents/tree/primary%3ASOHOZATRI::primary:SOHOZATRI/firebase.js// ==========================================
// SOHOZATRI
// Firebase Configuration
// File: firebase.js
// ==========================================


// ==========================================
// FIREBASE APP
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";


// ==========================================
// FIREBASE AUTHENTICATION
// ==========================================

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


// ==========================================
// FIREBASE FIRESTORE DATABASE
// ==========================================

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ==========================================
// FIREBASE STORAGE
// ==========================================

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyCx48-TRuH1ppfAnpbzY725e8uvQG2gtvw",

    authDomain:
        "sohozatri-shz2025.firebaseapp.com",

    projectId:
        "sohozatri-shz2025",

    storageBucket:
        "sohozatri-shz2025.firebasestorage.app",

    messagingSenderId:
        "349213869929",

    appId:
        "1:349213869929:web:c3a6340ef86bef69b5dff8",

    measurementId:
        "G-T3XRXM5F9B"

};


// ==========================================
// INITIALIZE FIREBASE APP
// ==========================================

const app =
    initializeApp(firebaseConfig);


// ==========================================
// INITIALIZE FIREBASE AUTH
// ==========================================

const auth =
    getAuth(app);


// ==========================================
// INITIALIZE FIRESTORE
// ==========================================

const db =
    getFirestore(app);


// ==========================================
// INITIALIZE FIREBASE STORAGE
// ==========================================

const storage =
    getStorage(app);


// ==========================================
// EXPORT FIREBASE SERVICES
// ==========================================

export {

    app,

    auth,

    db,

    storage

};