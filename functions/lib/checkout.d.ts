import { Request, Response } from "express";
/**
 * POST /api/checkout
 *
 * Mock Stripe checkout — returns a local checkout URL.
 * Does NOT call real Stripe API.
 *
 * Body: { pack: 'starter'|'popular'|'family', uid: string }
 * Response: { checkoutUrl: string }
 */
export declare function checkoutHandler(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=checkout.d.ts.map