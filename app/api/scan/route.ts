import db from "@/lib/db";
import { runChecks } from "@/lib/scanner";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/ip";
import { normalizeUrl, safeFetch, ScanUrlError } from "@/lib/safeFetch";
import { randomUUID } from "crypto";

// Scanning is unlimited per month, but rate-limited per 10 minutes so nobody
// can hammer the server. Signed-in users get a higher allowance.
export async function POST(request: Request) {
  const session = await getSession();

  const key = session ? `scan:user:${session.userId}` : `scan:ip:${getClientIp(request)}`;
  const limit = session ? 30 : 10;
  const rate = checkRateLimit(key, limit, 10 * 60 * 1000);
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterMs / 60000);
    return Response.json(
      { error: `Too many scans. Try again in ${minutes} minute(s).` },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const input = body?.url;
  if (typeof input !== "string" || input.length === 0 || input.length > 2048) {
    return Response.json({ error: "Please enter a valid URL." }, { status: 400 });
  }

  try {
    const startUrl = normalizeUrl(input);
    const { finalUrl, statusCode, responseTimeMs, html } = await safeFetch(startUrl);
    const { score, issues } = runChecks(finalUrl, statusCode, responseTimeMs, html);

    const id = randomUUID();
    const url = startUrl.toString();

    db.prepare(
      `INSERT INTO scans (id, userId, url, score, statusCode, responseTimeMs, issues, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, session?.userId ?? null, url, score, statusCode, responseTimeMs, JSON.stringify(issues), new Date().toISOString());

    return Response.json({ id, url, score, statusCode, responseTimeMs, issues });
  } catch (error) {
    if (error instanceof ScanUrlError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Scan failed:", error);
    return Response.json(
      { error: "Could not reach that URL. Check that it's correct and try again." },
      { status: 400 }
    );
  }
}

// Scan history: only the signed-in user's own scans.
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
