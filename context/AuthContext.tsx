"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import type { AppUser, AuthProviderId } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Fresh Firebase ID token to authorize API calls. */
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Create the Firestore `users/{uid}` doc on first sign-in (merge-safe). */
async function ensureUserDoc(user: User): Promise<AppUser> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const provider: AuthProviderId = user.providerData.some(
    (p) => p.providerId === "google.com"
  )
    ? "google"
    : "password";

  if (!snap.exists()) {
    const profile = {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? user.email?.split("@")[0] ?? "Người dùng",
      photoURL: user.photoURL ?? null,
      provider,
      plan: "free" as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return profile as unknown as AppUser;
  }

  // Keep basic fields in sync on each login.
  await setDoc(
    ref,
    {
      email: user.email ?? "",
      displayName: user.displayName ?? snap.data().displayName,
      photoURL: user.photoURL ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return snap.data() as AppUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Complete a redirect-based Google sign-in when the user lands back on the app.
  useEffect(() => {
    getRedirectResult(auth).catch((err) =>
      console.error("Google redirect sign-in failed", err)
    );
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          setProfile(await ensureUserDoc(fbUser));
        } catch (err) {
          console.error("Failed to load user profile", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await ensureUserDoc(cred.user);
    },
    []
  );

  const signInGoogle = useCallback(async () => {
    // Prefer popup for a smoother UX, but fall back to a full-page redirect
    // whenever the popup can't complete — it may be blocked, or Chrome's
    // Cross-Origin-Opener-Policy can prevent the popup result from ever
    // reaching the opener, leaving the promise pending forever.
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      const popupFailed =
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/operation-not-supported-in-this-environment";
      if (popupFailed) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const getToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signOut,
      getToken,
    }),
    [
      user,
      profile,
      loading,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signOut,
      getToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
