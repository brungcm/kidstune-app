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
exports.stripeWebhookHandler = stripeWebhookHandler;
const admin = __importStar(require("firebase-admin"));
const firestore_init_1 = require("./firestore-init");
/**
 * POST /api/webhook/stripe
 *
 * Mock Stripe webhook handler.
 * In mock mode, the X-Stripe-Signature header is BYPASSED.
 *
 * Body: { uid: string, creditsAdded: number, sessionId: string }
 * Response: { ok: true, newBalance: number }
 */
async function stripeWebhookHandler(req, res) {
    try {
        if (req.method !== "POST") {
            res.status(405).json({ error: "method_not_allowed" });
            return;
        }
        const stripeMode = process.env.STRIPE_MODE || "mock";
        // In mock mode, bypass signature verification
        if (stripeMode === "mock") {
            console.info("stripe_webhook_mock_mode", { signature: req.headers["x-stripe-signature"] || "none" });
        }
        else {
            // Real mode — would verify signature here
            // For now, this path is disabled
            throw new Error("Real Stripe disabled this run");
        }
        const { uid, creditsAdded, sessionId } = req.body;
        if (!uid || typeof uid !== "string") {
            res.status(400).json({ error: "validation_error", userMessage: "uid is required." });
            return;
        }
        if (!creditsAdded || typeof creditsAdded !== "number" || creditsAdded <= 0) {
            res.status(400).json({ error: "validation_error", userMessage: "creditsAdded must be a positive number." });
            return;
        }
        if (!sessionId || typeof sessionId !== "string") {
            res.status(400).json({ error: "validation_error", userMessage: "sessionId is required." });
            return;
        }
        const db = admin.firestore();
        // Ensure user doc exists
        await (0, firestore_init_1.ensureUserDoc)(db, uid);
        // Increment credits atomically
        const newBalance = await (0, firestore_init_1.addCredits)(db, uid, creditsAdded);
        // Record payment
        await db.collection("payments").doc(sessionId).set({
            uid,
            creditsAdded,
            sessionId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.info("credits_added", {
            uid,
            creditsAdded,
            newBalance,
            sessionId,
        });
        res.status(200).json({ ok: true, newBalance });
    }
    catch (err) {
        const error = err;
        console.error("stripe_webhook_error", { error: error.message });
        res.status(500).json({ error: "internal_error", userMessage: "Webhook processing failed." });
    }
}
//# sourceMappingURL=webhook.js.map