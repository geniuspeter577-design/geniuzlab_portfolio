import jwt from "jsonwebtoken";
import { env } from "./env";

export type AdminTokenPayload = {
  email: string;
};

const TOKEN_TTL = "7d";

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.AUTH_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  const decoded = jwt.verify(token, env.AUTH_SECRET);

  if (typeof decoded === "string" || !("email" in decoded)) {
    throw new Error("Invalid token payload");
  }

  return { email: String((decoded as jwt.JwtPayload).email) };
}
