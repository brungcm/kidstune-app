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
exports.freeQuotaHandler = freeQuotaHandler;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
// ---------------------------------------------------------------------------
// Free quota configuration
// ---------------------------------------------------------------------------
const MAX_FREE_REQUESTS = 2;
const WINDOW_HOURS = 24;
const COLLECTION = "free_quota";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hashIp(ip) {
    return crypto.createHash("sha256").update(ip).digest("hex");
}
function getWindowExpiry(windowStartedAt) {
    return new Date(windowStartedAt.toMillis() + WINDOW_HOURS * 60 * 60 * 1000);
}
// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
async function freeQuotaHandler(req, res) {
    try {
        // Only POST
        if (req.method !== "POST") {
            res.status(405).json({ error: "method_not_allowed" });
            return;
        }
        // Get IP from body or request
        const { ip } = req.body;
        const clientIp = ip || req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "unknown";
        if (!clientIp || clientIp === "unknown") {
            res.status(400).json({ error: "validation_error", userMessage: "Não foi possível identificar o IP." });
            return;
        }
        const docId = hashIp(clientIp);
        const db = admin.firestore();
        const docRef = db.collection(COLLECTION).doc(docId);
        const now = admin.firestore.Timestamp.now();
        // Use a transaction for atomic read-write
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) {
                // First request — create record
                const record = {
                    count: 1,
                    windowStartedAt: now,
                };
                transaction.set(docRef, record);
                const resetsAt = getWindowExpiry(now).toISOString();
                const response = {
                    remaining: MAX_FREE_REQUESTS - 1,
                    resetsAt,
                };
                res.status(200).json(response);
                return;
            }
            const data = doc.data();
            const windowExpiry = getWindowExpiry(data.windowStartedAt);
            if (now.toMillis() > windowExpiry.getTime()) {
                // Window expired — reset
                const record = {
                    count: 1,
                    windowStartedAt: now,
                };
                transaction.set(docRef, record);
                const response = {
                    remaining: MAX_FREE_REQUESTS - 1,
                    resetsAt: getWindowExpiry(now).toISOString(),
                };
                res.status(200).json(response);
                return;
            }
            // Within window — check count
            if (data.count >= MAX_FREE_REQUESTS) {
                // Exhausted
                res.status(429).json({
                    error: "free_quota_exhausted",
                    resetsAt: windowExpiry.toISOString(),
                });
                return;
            }
            // Increment
            transaction.update(docRef, { count: data.count + 1 });
            const response = {
                remaining: MAX_FREE_REQUESTS - (data.count + 1),
                resetsAt: windowExpiry.toISOString(),
            };
            res.status(200).json(response);
        });
    }
    catch (err) {
        const error = err;
        console.error("free_quota_error", { error: error.message });
        res.status(500).json({ error: "internal_error", userMessage: "Erro interno ao verificar cota." });
    }
}
//# sourceMappingURL=free-quota.js.map