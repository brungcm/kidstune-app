"use strict";
/**
 * KidsTune Pricing Configuration
 *
 * This is the SINGLE source of truth for pricing.
 * When migrating to real Stripe, update STRIPE_MODE=real and
 * configure STRIPE_SECRET_KEY — this file stays the same.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING = void 0;
exports.isValidPack = isValidPack;
exports.PRICING = {
    starter: { name: 'Starter', priceUSD: 4.99, credits: 5 },
    popular: { name: 'Popular', priceUSD: 12.99, credits: 15 },
    family: { name: 'Family', priceUSD: 34.99, credits: 50 },
};
function isValidPack(key) {
    return key in exports.PRICING;
}
//# sourceMappingURL=pricing.js.map