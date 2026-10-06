import db from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

type UserRow = {
  id: string;
  email: string;
  passwordHash: string;
  isPaid: number;
};

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Rate limit by email — max 5 attempts per 10 minutes, blocks brute-forcing
  // one specific account regardless of which IP the attempts come from.
  const rateLimit = checkRateLimit(`login:${email}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    const retryMinutes = Math.ceil(rateLimit.retryAfterMs / 60000);
    return Response.json(
      { error: `Too many login attempts. Try again in ${retryMinutes} minute(s).` },
      { status: 429 }
    );
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | UserRow
    | undefined;

  if (!user) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, email: user.email });

  return Response.json({ id: user.id, email: user.email, isPaid: !!user.isPaid });
}
