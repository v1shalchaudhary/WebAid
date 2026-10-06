import db from "@/lib/db";
import { runChecks } from "@/lib/scanner";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const body = await request.json();
  const targetUrl = body.url;

  try {
    const session = await getSession(); // null if not logged in — scanning stays open to everyone

    const startTime = Date.now();
    const response = await fetch(targetUrl);
    const endTime = Date.now();

    const statusCode = response.status;
    const responseTimeMs = endTime - startTime;
    const html = await response.text();

    const { score, issues } = runChecks(response.url, statusCode, responseTimeMs, html);

    const id = randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO scans (id, userId, url, score, statusCode, responseTimeMs, issues, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, session?.userId ?? null, targetUrl, score, statusCode, responseTimeMs, JSON.stringify(issues), createdAt);

    return Response.json({ id, url: targetUrl, score, statusCode, responseTimeMs, issues });
 } catch (error) {
  console.error("Scan failed:", error); // temporary - helps us see the real cause
  return Response.json(
    { error: "Could not reach that URL. Check that it's correct and try again." },
    { status: 400 }
  );
}
}

export async function GET() {
  const scans = db.prepare("SELECT * FROM scans ORDER BY createdAt DESC LIMIT 20").all();
  return Response.json(scans);
}
