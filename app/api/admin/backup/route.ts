import db from "@/lib/db";
import { getAdminSession } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Admin-only snapshot of the whole database, for manual backups.
export async function GET() {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Not authorized." }, { status: 403 });
  }

  const snapshot = db.serialize();
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(snapshot), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="webaid-backup-${stamp}.db"`,
      "Cache-Control": "no-store",
    },
  });
}