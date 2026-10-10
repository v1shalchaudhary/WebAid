import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { generateFixes } from "@/lib/fixes";
import {
  FREE_FIXES_PER_MONTH,
  getMonthlyFixCount,
  hasUnlocked,
  recordUnlock,
} from "@/lib/usage";
import type { Issue } from "@/lib/scanner";

type ScanRow = { id: string; userId: string | null; url: string; issues: string };
type UserRow = { id: string; email: string; isPaid: number };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Please sign in to see step-by-step fixes." }, { status: 401 });
  }

  const user = db
    .prepare("SELECT id, email, isPaid FROM users WHERE id = ?")
    .get(session.userId) as UserRow | undefined;
  if (!user) {
    return Response.json({ error: "Your session is no longer valid. Please sign in again." }, { status: 401 });
  }

  const scan = db.prepare("SELECT * FROM scans WHERE id = ?").get(id) as ScanRow | undefined;
  if (!scan) {
    return Response.json({ error: "Scan not found." }, { status: 404 });
  }

  const isAdmin = isAdminEmail(user.email);

  // A scan made while signed in belongs to that account.
  if (!isAdmin && scan.userId && scan.userId !== user.id) {
    return Response.json({ error: "This scan belongs to another account." }, { status: 403 });
  }

  const unlimited = isAdmin || !!user.isPaid;
  let used = getMonthlyFixCount(user.id);

  // Free users: re-opening a scan they already unlocked costs nothing.
  if (!unlimited && !hasUnlocked(user.id, scan.id)) {
    if (used >= FREE_FIXES_PER_MONTH) {
      return Response.json(
        {
          error: `You've used all ${FREE_FIXES_PER_MONTH} free step-by-step fixes this month. Upgrade to Pro for unlimited fixes.`,
          upgradeRequired: true,
          usage: { used, limit: FREE_FIXES_PER_MONTH },
        },
        { status: 402 }
      );
    }
    recordUnlock(user.id, scan.id);
    used += 1;
  }

  const fixes = generateFixes(JSON.parse(scan.issues) as Issue[]);
  return Response.json({
    scanId: scan.id,
    url: scan.url,
    fixes,
    usage: { used, limit: FREE_FIXES_PER_MONTH, unlimited },
  });
}
