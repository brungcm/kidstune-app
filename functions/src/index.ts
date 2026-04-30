import { onRequest } from "firebase-functions/v2/https";
import { healthHandler } from "./health";

export const api = onRequest(
  { cors: true },
  healthHandler,
);
