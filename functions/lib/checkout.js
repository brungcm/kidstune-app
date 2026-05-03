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
exports.checkoutHandler = checkoutHandler;
const crypto = __importStar(require("crypto"));
const pricing_1 = require("./pricing");
/**
 * POST /api/checkout
 *
 * Mock Stripe checkout — returns a local checkout URL.
 * Does NOT call real Stripe API.
 *
 * Body: { pack: 'starter'|'popular'|'family', uid: string }
 * Response: { checkoutUrl: string }
 */
async function checkoutHandler(req, res) {
    try {
        if (req.method !== "POST") {
            res.status(405).json({ error: "method_not_allowed", userMessage: "Use POST." });
            return;
        }
        const { pack, uid } = req.body;
        if (!pack || !(0, pricing_1.isValidPack)(pack)) {
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
        const pricing = pricing_1.PRICING[pack];
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
    }
    catch (err) {
        const error = err;
        console.error("checkout_error", { error: error.message });
        res.status(500).json({ error: "internal_error", userMessage: "Checkout failed." });
    }
}
//# sourceMappingURL=checkout.js.map