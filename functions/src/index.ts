import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { healthHandler } from "./health";
import { generateHandler } from "./generate";
import { freeQuotaHandler } from "./free-quota";

// Initialize Firebase Admin SDK (used by free-quota and other features)
admin.initializeApp();

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
