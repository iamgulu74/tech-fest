import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const adminFirebaseConfig = {
    apiKey: import.meta.env.VITE_ADMIN_FIREBASE_API_KEY || "AIzaSyBovZTtG-OgqWCB2vLhBbSX44cE5cWn5X4",
    authDomain: import.meta.env.VITE_ADMIN_FIREBASE_AUTH_DOMAIN || "admin-c0e5f.firebaseapp.com",
    databaseURL: import.meta.env.VITE_ADMIN_FIREBASE_DATABASE_URL || "https://admin-c0e5f-default-rtdb.firebaseio.com",
    projectId: import.meta.env.VITE_ADMIN_FIREBASE_PROJECT_ID || "admin-c0e5f",
    storageBucket: import.meta.env.VITE_ADMIN_FIREBASE_STORAGE_BUCKET || "admin-c0e5f.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_ADMIN_FIREBASE_MESSAGING_SENDER_ID || "627097155004",
    appId: import.meta.env.VITE_ADMIN_FIREBASE_APP_ID || "1:627097155004:web:ed9ea2082bbee48623a7b9",
    measurementId: import.meta.env.VITE_ADMIN_FIREBASE_MEASUREMENT_ID || "G-V9V8LLS9FN"
};

// Initialize Admin Firebase App safely
let adminApp: any = null;
let adminAuth: any = null;
let adminDb: any = null;
let adminRtdb: any = null;

try {
    const existing = getApps().find(a => a.name === "adminApp");
    adminApp = existing || initializeApp(adminFirebaseConfig, "adminApp");
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    if (adminFirebaseConfig.databaseURL) {
        try {
            adminRtdb = getDatabase(adminApp);
        } catch (dbErr) {
            console.warn("RTDB initialization bypassed:", dbErr);
        }
    }
} catch (err) {
    console.error("Firebase adminApp initialization error:", err);
}

export { adminApp, adminAuth, adminDb, adminRtdb };
export default adminApp;
