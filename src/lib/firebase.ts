import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1jdkb86ugo34BGyL-9Y-PtiwAIPFMUyk",
    authDomain: "trithon-e6073.firebaseapp.com",
    projectId: "trithon-e6073",
    storageBucket: "trithon-e6073.firebasestorage.app",
    messagingSenderId: "889783456532",
    appId: "1:889783456532:web:004b8cb6de1d06f7656801",
    measurementId: "G-RG6SQYLV4E"
};

let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
    const existing = getApps().find(a => a.name === "[DEFAULT]");
    app = existing || initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== 'undefined') {
        isSupported().then(yes => {
            if (yes) {
                analytics = getAnalytics(app);
            }
        }).catch(() => {});
    }
} catch (err) {
    console.error("Firebase app initialization error:", err);
}

export { auth, db, analytics };
export default app;
