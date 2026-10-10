import db from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { validatePassword } from "@/lib/password";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/ip";

export async function POST(request: Request) {
    const rate = checkRateLimit(`signup:${getClientIp(request)}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: "Too many sign-ups from this network. Try again later." },
      { status: 429 }
    );
  }
  const { email, password } = await request.json();

  if (!email) {
    return Response.json({ error: "Email is required." }, { status: 400 });
  }

  const passwordCheck = validatePassword(password || "");
  if (!passwordCheck.valid) {
    return Response.json(
      { error: "Password does not meet requirements.", requirements: passwordCheck.errors },
      { status: 400 }
    );
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO users (id, email, passwordHash, isPaid, createdAt) VALUES (?, ?, ?, 0, ?)`
  ).run(id, email, passwordHash, createdAt);

  await setSessionCookie({ userId: id, email });

  return Response.json({ id, email, isPaid: false });
}
