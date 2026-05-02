import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Free quota configuration
// ---------------------------------------------------------------------------

const MAX_FREE_REQUESTS = 2;
const WINDOW_HOURS = 24;
const COLLECTION = "free_quota";

interface QuotaRecord {
  count: number;
  windowStartedAt: admin.firestore.Timestamp;
}

interface FreeQuotaResponse {
  remaining: number;
  resetsAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function getWindowExpiry(windowStartedAt: admin.firestore.Timestamp): Date {
  return new Date(windowStartedAt.toMillis() + WINDOW_HOURS * 60 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function freeQuotaHandler(req: Request, res: Response): Promise<void> {
  try {
    // Only POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    // Get IP from body or request
    const { ip } = req.body as { ip?: string };
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
        const record: QuotaRecord = {
          count: 1,
          windowStartedAt: now,
        };
        transaction.set(docRef, record);

        const resetsAt = getWindowExpiry(now).toISOString();
        const response: FreeQuotaResponse = {
          remaining: MAX_FREE_REQUESTS - 1,
          resetsAt,
        };
        res.status(200).json(response);
        return;
      }

      const data = doc.data() as QuotaRecord;
      const windowExpiry = getWindowExpiry(data.windowStartedAt);

      if (now.toMillis() > windowExpiry.getTime()) {
        // Window expired — reset
        const record: QuotaRecord = {
          count: 1,
          windowStartedAt: now,
        };
        transaction.set(docRef, record);

        const response: FreeQuotaResponse = {
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

      const response: FreeQuotaResponse = {
        remaining: MAX_FREE_REQUESTS - (data.count + 1),
        resetsAt: windowExpiry.toISOString(),
      };
      res.status(200).json(response);
    });
  } catch (err) {
    const error = err as Error;
    console.error("free_quota_error", { error: error.message });
    res.status(500).json({ error: "internal_error", userMessage: "Erro interno ao verificar cota." });
  }
}
