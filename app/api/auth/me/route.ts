import { getSession } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ user: null });
  }

  const user = db
    .prepare("SELECT id, email, isPaid FROM users WHERE id = ?")
    .get(session.userId);

  return Response.json({ user: user || null });
}