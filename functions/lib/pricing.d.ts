/**
 * KidsTune Pricing Configuration
 *
 * This is the SINGLE source of truth for pricing.
 * When migrating to real Stripe, update STRIPE_MODE=real and
 * configure STRIPE_SECRET_KEY — this file stays the same.
 */
export declare const PRICING: {
    readonly starter: {
        readonly name: "Starter";
        readonly priceUSD: 4.99;
        readonly credits: 5;
    };
    readonly popular: {
        readonly name: "Popular";
        readonly priceUSD: 12.99;
        readonly credits: 15;
    };
    readonly family: {
        readonly name: "Family";
        readonly priceUSD: 34.99;
        readonly credits: 50;
    };
};
export type PackKey = keyof typeof PRICING;
export declare function isValidPack(key: string): key is PackKey;
//# sourceMappingURL=pricing.d.ts.map