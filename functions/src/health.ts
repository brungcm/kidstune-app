import { Request, Response } from "express";

export function healthHandler(_req: Request, res: Response): void {
  res.json({
    ok: true,
    version: "0.1.0",
  });
}
