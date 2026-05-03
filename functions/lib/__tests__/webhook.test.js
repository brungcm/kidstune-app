"use strict";
/**
 * @jest-environment node
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Mock firebase-admin before any imports
const mockRunTransaction = jest.fn();
const mockDocGet = jest.fn();
const mockDocSet = jest.fn();
const mockDocUpdate = jest.fn();
const mockCollection = jest.fn(() => ({
    doc: jest.fn(() => ({
        get: mockDocGet,
        set: mockDocSet,
        update: mockDocUpdate,
    })),
}));
jest.mock("firebase-admin", () => {
    const mockTimestamp = {
        now: () => ({ toMillis: () => Date.now(), seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
        serverTimestamp: () => ({ _methodName: "serverTimestamp" }),
    };
    return {
        initializeApp: jest.fn(),
        firestore: jest.fn(() => ({
            collection: mockCollection,
            runTransaction: mockRunTransaction,
            FieldValue: { serverTimestamp: () => mockTimestamp.serverTimestamp() },
            Timestamp: mockTimestamp,
        })),
        credential: {
            applicationDefault: jest.fn(),
        },
    };
});
const webhook_1 = require("../webhook");
function mockReqRes(body, stripeMode = "mock") {
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    const req = {
        method: "POST",
        body,
        headers: { "x-stripe-signature": "test_sig" },
    };
    const res = {
        status: statusMock,
        json: jsonMock,
    };
    process.env.STRIPE_MODE = stripeMode;
    return { req, res, statusMock, jsonMock };
}
describe("stripeWebhookHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.STRIPE_MODE = "mock";
    });
    it("returns 405 for non-POST requests", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({});
        req.method = "GET";
        await (0, webhook_1.stripeWebhookHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(405);
    });
    it("returns 400 when uid is missing", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ creditsAdded: 5, sessionId: "sess123" });
        await (0, webhook_1.stripeWebhookHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: "validation_error" }));
    });
    it("returns 400 when creditsAdded is missing", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ uid: "user123", sessionId: "sess123" });
        await (0, webhook_1.stripeWebhookHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
    });
    it("returns 400 when sessionId is missing", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ uid: "user123", creditsAdded: 5 });
        await (0, webhook_1.stripeWebhookHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
    });
    it("increments credits and returns newBalance in mock mode", async () => {
        // Mock transaction: simulate user exists with 10 credits, add 5
        mockRunTransaction.mockImplementation(async (cb) => {
            const fakeTx = {
                get: jest.fn(() => ({
                    exists: true,
                    data: () => ({ credits: 10 }),
                })),
                update: mockDocUpdate,
                set: mockDocSet,
            };
            return cb(fakeTx);
        });
        // Mock ensureUserDoc — user exists
        mockDocGet.mockResolvedValue({ exists: true });
        const { req, res, statusMock, jsonMock } = mockReqRes({
            uid: "user123",
            creditsAdded: 5,
            sessionId: "sess_test_001",
        });
        await (0, webhook_1.stripeWebhookHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
});
//# sourceMappingURL=webhook.test.js.map