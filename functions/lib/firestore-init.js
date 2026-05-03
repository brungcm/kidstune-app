"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserDoc = ensureUserDoc;
exports.getUserCredits = getUserCredits;
exports.addCredits = addCredits;
const admin = __importStar(require("firebase-admin"));
/**
 * Initialize Firestore collections on first access.
 * This module provides helpers used by other handlers.
 */
/**
 * Ensure a user document exists in Firestore.
 * Creates `users/{uid}` with default credits if it doesn't exist.
 */
async function ensureUserDoc(db, uid, email, displayName) {
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
async function getUserCredits(db, uid) {
    const snap = await db.collection("users").doc(uid).get();
    if (!snap.exists)
        return 0;
    return snap.data()?.credits ?? 0;
}
/**
 * Increment user credits atomically.
 */
async function addCredits(db, uid, amount) {
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
//# sourceMappingURL=firestore-init.js.map