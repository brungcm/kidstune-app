import { Request, Response } from "firebase-functions/v2/https";

export function healthHandler(_req: Request, res: Response): void {
  res.json({
    ok: true,
    version: "0.1.0",
  });
}
