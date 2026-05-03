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
exports.stripeWebhook = exports.checkout = exports.freeQuota = exports.generate = exports.api = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const health_1 = require("./health");
const generate_1 = require("./generate");
const free_quota_1 = require("./free-quota");
const checkout_1 = require("./checkout");
const webhook_1 = require("./webhook");
// Initialize Firebase Admin (idempotent)
if (!admin.apps.length) {
    admin.initializeApp();
}
// Initialize Firebase Admin SDK (used by free-quota and other features)
admin.initializeApp();
// Health check endpoint
exports.api = (0, https_1.onRequest)({ cors: true }, health_1.healthHandler);
// POST /api/generate — gera letra de música via Gemini
exports.generate = (0, https_1.onRequest)({ cors: true, secrets: ["GEMINI_API_KEY"] }, generate_1.generateHandler);
// POST /api/free-quota — verifica cota gratuita por IP
exports.freeQuota = (0, https_1.onRequest)({ cors: true }, free_quota_1.freeQuotaHandler);
// POST /api/checkout — mock Stripe checkout
exports.checkout = (0, https_1.onRequest)({ cors: true }, checkout_1.checkoutHandler);
// POST /api/webhook/stripe — mock Stripe webhook
exports.stripeWebhook = (0, https_1.onRequest)({ cors: true }, webhook_1.stripeWebhookHandler);
//# sourceMappingURL=index.js.map