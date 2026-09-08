import type { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../lib/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { email: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
