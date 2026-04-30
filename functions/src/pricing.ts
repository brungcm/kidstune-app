/**
 * KidsTune Pricing Configuration
 *
 * This is the SINGLE source of truth for pricing.
 * When migrating to real Stripe, update STRIPE_MODE=real and
 * configure STRIPE_SECRET_KEY — this file stays the same.
 */

export const PRICING = {
  starter: { name: 'Starter', priceUSD: 4.99, credits: 5 },
  popular: { name: 'Popular', priceUSD: 12.99, credits: 15 },
  family:  { name: 'Family',  priceUSD: 34.99, credits: 50 },
} as const;

export type PackKey = keyof typeof PRICING;

export function isValidPack(key: string): key is PackKey {
  return key in PRICING;
}
