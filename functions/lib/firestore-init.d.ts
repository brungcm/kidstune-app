import * as admin from "firebase-admin";
/**
 * Initialize Firestore collections on first access.
 * This module provides helpers used by other handlers.
 */
/**
 * Ensure a user document exists in Firestore.
 * Creates `users/{uid}` with default credits if it doesn't exist.
 */
export declare function ensureUserDoc(db: admin.firestore.Firestore, uid: string, email?: string, displayName?: string): Promise<void>;
/**
 * Get user credits from Firestore.
 */
export declare function getUserCredits(db: admin.firestore.Firestore, uid: string): Promise<number>;
/**
 * Increment user credits atomically.
 */
export declare function addCredits(db: admin.firestore.Firestore, uid: string, amount: number): Promise<number>;
//# sourceMappingURL=firestore-init.d.ts.map