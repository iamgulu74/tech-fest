import admin from 'firebase-admin';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length && firebaseConfig.projectId && firebaseConfig.clientEmail && firebaseConfig.privateKey && firebaseConfig.privateKey.includes('PRIVATE KEY')) {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
    });
} else if (!admin.apps.length) {
    console.warn('⚠️ [FIREBASE] Admin SDK not initialized: Missing or invalid project credentials in .env.');
}

const firestore = admin.apps.length ? getFirestore() : null as any;
const auth = admin.apps.length ? getAuth() : null as any;

export { admin, firestore, auth, Timestamp, FieldValue };
