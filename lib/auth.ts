import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET must be set to a long random value in production.");
    }
    return secret;
  }
  return secret || "dev-secret-change-this-later";
}
const COOKIE_NAME = "sitevitals_session";

export type SessionPayload = {
  userId: string;
  email: string;
};

export function createToken(payload: SessionPayload) {
    return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = createToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
    const secret = getSecret();

  try {
        return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
