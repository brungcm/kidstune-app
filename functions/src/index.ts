import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { healthHandler } from "./health";
import { generateHandler } from "./generate";
import { freeQuotaHandler } from "./free-quota";
import { checkoutHandler } from "./checkout";
import { stripeWebhookHandler } from "./webhook";

// Initialize Firebase Admin (idempotent)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Health check endpoint
export const api = onRequest(
  { cors: true },
  healthHandler,
);

// POST /api/generate — gera letra de música via Gemini
export const generate = onRequest(
  { cors: true, secrets: ["GEMINI_API_KEY"] },
  generateHandler,
);

// POST /api/free-quota — verifica cota gratuita por IP
export const freeQuota = onRequest(
  { cors: true },
  freeQuotaHandler,
);

// POST /api/checkout — mock Stripe checkout
export const checkout = onRequest(
  { cors: true },
  checkoutHandler,
);

// POST /api/webhook/stripe — mock Stripe webhook
export const stripeWebhook = onRequest(
  { cors: true },
  stripeWebhookHandler,
);
