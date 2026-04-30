import { Request, Response } from "firebase-functions/v2/https";
import * as crypto from "crypto";
import { PRICING, isValidPack } from "./pricing";

/**
 * POST /api/checkout
 *
 * Mock Stripe checkout — returns a local checkout URL.
 * Does NOT call real Stripe API.
 *
 * Body: { pack: 'starter'|'popular'|'family', uid: string }
 * Response: { checkoutUrl: string }
 */
export async function checkoutHandler(req: Request, res: Response): Promise<void> {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed", userMessage: "Use POST." });
      return;
    }

    const { pack, uid } = req.body as { pack?: string; uid?: string };

    if (!pack || !isValidPack(pack)) {
      res.status(400).json({
        error: "validation_error",
        userMessage: "Invalid pack. Use: starter, popular, or family.",
      });
      return;
    }

    if (!uid || typeof uid !== "string") {
      res.status(400).json({
        error: "validation_error",
        userMessage: "uid is required.",
      });
      return;
    }

    const pricing = PRICING[pack];
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Build mock checkout URL
    const checkoutUrl = `/mock-stripe-checkout?session=${sessionId}&credits=${pricing.credits}&pack=${pack}`;

    console.info("mock_checkout_created", {
      uid,
      pack,
      credits: pricing.credits,
      sessionId,
    });

    res.status(200).json({ checkoutUrl });
  } catch (err) {
    const error = err as Error;
    console.error("checkout_error", { error: error.message });
    res.status(500).json({ error: "internal_error", userMessage: "Checkout failed." });
  }
}
