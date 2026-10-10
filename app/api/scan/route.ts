import db from "@/lib/db";
import { runChecks } from "@/lib/scanner";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

// Scanning is unlimited and open to everyone. Only step-by-step fixes are metered.
export async function POST(request: Request) {
  const body = await request.json();
  const targetUrl = body.url;

  try {
    const session = await getSession();

    const startTime = Date.now();
    const response = await fetch(targetUrl);
    const responseTimeMs = Date.now() - startTime;
    const statusCode = response.status;
    const html = await response.text();

    const { score, issues } = runChecks(response.url, statusCode, responseTimeMs, html);

    const id = randomUUID();
    db.prepare(
      `INSERT INTO scans (id, userId, url, score, statusCode, responseTimeMs, issues, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, session?.userId ?? null, targetUrl, score, statusCode, responseTimeMs, JSON.stringify(issues), new Date().toISOString());

    return Response.json({ id, url: targetUrl, score, statusCode, responseTimeMs, issues });
  } catch (error) {
    console.error("Scan failed:", error);
    return Response.json(
      { error: "Could not reach that URL. Check that it's correct and try again." },
      { status: 400 }
    );
  }
}

// Scan history — only the signed-in user's own scans.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Sign in to see your scans." }, { status: 401 });
  }

  const scans = db
    .prepare("SELECT id, url, score, createdAt FROM scans WHERE userId = ? ORDER BY createdAt DESC LIMIT 20")
    .all(session.userId);
  return Response.json(scans);
}
