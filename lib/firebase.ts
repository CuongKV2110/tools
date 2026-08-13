import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Client-side Firebase. All values are public (NEXT_PUBLIC_*) and safe to ship
 * to the browser — security is enforced by Firestore/Storage rules, not secrecy.
 *
 * Fallbacks keep `getAuth()` from throwing `auth/invalid-api-key` during the
 * build/prerender step when env vars are not yet configured. At runtime the real
 * NEXT_PUBLIC_* values (inlined at build time) are used. Configure them in
 * `.env.local` before deploying — see `.env.example`.
 */
// The Firebase client config is PUBLIC by design — it ships to every browser
// and security is enforced by Firestore/Storage rules, not by hiding these
// values. We keep the real project values as defaults so client auth works
// even when the NEXT_PUBLIC_* build-time env vars are missing (e.g. when they
// are marked "Sensitive" on the host and therefore not inlined into the bundle).
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDYaOPAqQe154trbJTNNzqqAvJVmOVGoKk",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "tools-27e02.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tools-27e02",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "tools-27e02.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "490212175249",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:490212175249:web:1c7065f0390465a5e1be30",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
