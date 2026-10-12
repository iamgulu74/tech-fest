import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const adminFirebaseConfig = {
    apiKey: import.meta.env.VITE_ADMIN_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_ADMIN_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_ADMIN_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_ADMIN_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_ADMIN_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_ADMIN_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_ADMIN_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_ADMIN_FIREBASE_MEASUREMENT_ID
};

// Initialize Admin Firebase App
const adminApp = initializeApp(adminFirebaseConfig, "adminApp");

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminRtdb = getDatabase(adminApp);

export default adminApp;
