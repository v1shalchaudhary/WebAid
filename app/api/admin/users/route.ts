import db from "@/lib/db";
import { getAdminSession } from "@/lib/admin";
import { startOfMonthISO } from "@/lib/usage";

export async function GET() {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Not authorized." }, { status: 403 });
  }

  const users = db
    .prepare(
      `SELECT u.id, u.email, u.isPaid, u.createdAt,
        (SELECT COUNT(*) FROM scans s WHERE s.userId = u.id) AS scanCount,
        (SELECT COUNT(*) FROM fix_unlocks f WHERE f.userId = u.id AND f.createdAt >= ?) AS fixesThisMonth
       FROM users u ORDER BY u.createdAt DESC`
    )
    .all(startOfMonthISO());

  return Response.json(users);
}
