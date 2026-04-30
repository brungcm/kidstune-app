import * as admin from "firebase-admin";

/**
 * Initialize Firestore collections on first access.
 * This module provides helpers used by other handlers.
 */

/**
 * Ensure a user document exists in Firestore.
 * Creates `users/{uid}` with default credits if it doesn't exist.
 */
export async function ensureUserDoc(
  db: admin.firestore.Firestore,
  uid: string,
  email?: string,
  displayName?: string,
): Promise<void> {
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    await userRef.set({
      credits: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      email: email || "",
      displayName: displayName || "",
    });
    console.info("user_created", { uid, email });
  }
}

/**
 * Get user credits from Firestore.
 */
export async function getUserCredits(
  db: admin.firestore.Firestore,
  uid: string,
): Promise<number> {
  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) return 0;
  return snap.data()?.credits ?? 0;
}

/**
 * Increment user credits atomically.
 */
export async function addCredits(
  db: admin.firestore.Firestore,
  uid: string,
  amount: number,
): Promise<number> {
  const userRef = db.collection("users").doc(uid);

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const current = snap.data()?.credits ?? 0;
    const newBalance = current + amount;
    tx.update(userRef, { credits: newBalance });
    return newBalance;
  });

  return result;
}
