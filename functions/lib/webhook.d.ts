import { Request, Response } from "express";
/**
 * POST /api/webhook/stripe
 *
 * Mock Stripe webhook handler.
 * In mock mode, the X-Stripe-Signature header is BYPASSED.
 *
 * Body: { uid: string, creditsAdded: number, sessionId: string }
 * Response: { ok: true, newBalance: number }
 */
export declare function stripeWebhookHandler(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=webhook.d.ts.map