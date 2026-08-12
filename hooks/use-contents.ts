"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { ContentDoc } from "@/types";

const COLLECTION = "contents";

/** Newest first; a just-created doc (pending serverTimestamp) sorts to the top. */
function byCreatedDesc(a: ContentDoc, b: ContentDoc) {
  const am = a.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
  const bm = b.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
  return bm - am;
}

/** Realtime list of the current user's contents (newest first). */
export function useContents() {
  const { user } = useAuth();
  const [contents, setContents] = useState<ContentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setContents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Single-field filter (auto-indexed) + client-side sort → no composite index.
    const q = query(
      collection(db, COLLECTION),
      where("ownerId", "==", user.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as ContentDoc
        );
        items.sort(byCreatedDesc);
        setContents(items);
        setLoading(false);
      },
      (err) => {
        console.error("useContents error", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  return { contents, loading };
}

/** Realtime single content document. */
export function useContent(id: string | undefined) {
  const [content, setContent] = useState<ContentDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, COLLECTION, id),
      (snap) => {
        setContent(
          snap.exists() ? ({ id: snap.id, ...snap.data() } as ContentDoc) : null
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [id]);

  return { content, loading };
}

export type NewContentInput = Omit<
  ContentDoc,
  "id" | "createdAt" | "updatedAt"
>;

export async function createContent(data: NewContentInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContent(
  id: string,
  data: Partial<Omit<ContentDoc, "id" | "ownerId" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteContent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
