import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const scan = db.prepare("SELECT * FROM scans WHERE id = ?").get(id);

  if (!scan) {
    return Response.json({ error: "Scan not found" }, { status: 404 });
  }

  return Response.json(scan);
}