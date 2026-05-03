"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_1 = require("../checkout");
function mockReqRes(body) {
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    const req = {
        method: "POST",
        body,
    };
    const res = {
        status: statusMock,
        json: jsonMock,
    };
    return { req, res, statusMock, jsonMock };
}
describe("checkoutHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("returns 405 for non-POST requests", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({});
        req.method = "GET";
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(405);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: "method_not_allowed" }));
    });
    it("returns 400 for invalid pack", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ pack: "invalid", uid: "user123" });
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: "validation_error" }));
    });
    it("returns 400 when uid is missing", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ pack: "starter" });
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: "validation_error" }));
    });
    it("returns mock checkoutUrl for starter pack", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ pack: "starter", uid: "user123" });
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            checkoutUrl: expect.stringContaining("/mock-stripe-checkout?session="),
        }));
        const { checkoutUrl } = jsonMock.mock.calls[0][0];
        expect(checkoutUrl).toContain("credits=5");
        expect(checkoutUrl).toContain("pack=starter");
    });
    it("returns mock checkoutUrl for popular pack", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ pack: "popular", uid: "user123" });
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(200);
        const { checkoutUrl } = jsonMock.mock.calls[0][0];
        expect(checkoutUrl).toContain("credits=15");
        expect(checkoutUrl).toContain("pack=popular");
    });
    it("returns mock checkoutUrl for family pack", async () => {
        const { req, res, statusMock, jsonMock } = mockReqRes({ pack: "family", uid: "user123" });
        await (0, checkout_1.checkoutHandler)(req, res);
        expect(statusMock).toHaveBeenCalledWith(200);
        const { checkoutUrl } = jsonMock.mock.calls[0][0];
        expect(checkoutUrl).toContain("credits=50");
        expect(checkoutUrl).toContain("pack=family");
    });
});
//# sourceMappingURL=checkout.test.js.map