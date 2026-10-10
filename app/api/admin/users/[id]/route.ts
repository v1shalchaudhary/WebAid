import db from "@/lib/db";
import { getAdminSession } from "@/lib/admin";

// Admin grants or revokes Pro for a user.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const { isPaid } = await request.json();

  const result = db.prepare("UPDATE users SET isPaid = ? WHERE id = ?").run(isPaid ? 1 : 0, id);
  if (result.changes === 0) {
    return Response.json({ error: "User not found." }, { status: 404 });
  }

  return Response.json({ id, isPaid: !!isPaid });
}
