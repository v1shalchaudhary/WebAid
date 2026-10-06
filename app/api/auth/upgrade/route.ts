import db from "@/lib/db";
import { getSession } from "@/lib/auth";

// NOTE: In a real production version, this route would NOT exist like this.
// Instead, Stripe would call a webhook endpoint after a real successful
// payment, and THAT webhook (verified with Stripe's signature) would be
// what sets isPaid = 1. This version exists so you can test and demo the
// paywall without wiring up real billing yet.

export async function POST() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  db.prepare("UPDATE users SET isPaid = 1 WHERE id = ?").run(session.userId);

  return Response.json({ success: true, isPaid: true });
}
