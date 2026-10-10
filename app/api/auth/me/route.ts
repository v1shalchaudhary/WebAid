import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { FREE_FIXES_PER_MONTH, getMonthlyFixCount } from "@/lib/usage";

type UserRow = { id: string; email: string; isPaid: number };

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null });

  const row = db
    .prepare("SELECT id, email, isPaid FROM users WHERE id = ?")
    .get(session.userId) as UserRow | undefined;
  if (!row) return Response.json({ user: null });

  const isAdmin = isAdminEmail(row.email);

  return Response.json({
    user: { id: row.id, email: row.email, isPaid: !!row.isPaid, isAdmin },
    usage: {
      fixesUsed: getMonthlyFixCount(row.id),
      fixesLimit: FREE_FIXES_PER_MONTH,
      unlimited: isAdmin || !!row.isPaid,
    },
  });
}
