import db from "@/lib/db";

export const dynamic = "force-dynamic";

// Used by uptime checks. Reports only ok or error, never internal details.
export async function GET() {
  try {
    db.prepare("SELECT 1").get();
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "error" }, { status: 503 });
  }
}
