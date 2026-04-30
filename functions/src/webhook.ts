import { Request, Response } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { addCredits, ensureUserDoc } from "./firestore-init";

/**
 * POST /api/webhook/stripe
 *
 * Mock Stripe webhook handler.
 * In mock mode, the X-Stripe-Signature header is BYPASSED.
 *
 * Body: { uid: string, creditsAdded: number, sessionId: string }
 * Response: { ok: true, newBalance: number }
 */
export async function stripeWebhookHandler(req: Request, res: Response): Promise<void> {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    const stripeMode = process.env.STRIPE_MODE || "mock";

    // In mock mode, bypass signature verification
    if (stripeMode === "mock") {
      console.info("stripe_webhook_mock_mode", { signature: req.headers["x-stripe-signature"] || "none" });
    } else {
      // Real mode — would verify signature here
      // For now, this path is disabled
      throw new Error("Real Stripe disabled this run");
    }

    const { uid, creditsAdded, sessionId } = req.body as {
      uid?: string;
      creditsAdded?: number;
      sessionId?: string;
    };

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
    await ensureUserDoc(db, uid);

    // Increment credits atomically
    const newBalance = await addCredits(db, uid, creditsAdded);

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
  } catch (err) {
    const error = err as Error;
    console.error("stripe_webhook_error", { error: error.message });
    res.status(500).json({ error: "internal_error", userMessage: "Webhook processing failed." });
  }
}
