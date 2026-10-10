import db from "@/lib/db";
import { getSession } from "@/lib/auth";

// Stand-in until Stripe is wired up. It only works in development, so nobody
// can upgrade themselves for free on a live site.
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Payments aren't enabled yet." }, { status: 403 });
  }

  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  db.prepare("UPDATE users SET isPaid = 1 WHERE id = ?").run(session.userId);
  return Response.json({ success: true, isPaid: true });
}
