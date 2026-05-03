"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthHandler = healthHandler;
function healthHandler(_req, res) {
    res.json({
        ok: true,
        version: "0.1.0",
    });
}
//# sourceMappingURL=health.js.map