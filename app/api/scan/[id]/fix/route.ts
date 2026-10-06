import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateFixes } from "@/lib/fixes";
import { getMonthlyScanCount, FREE_SCANS_PER_MONTH } from "@/lib/usage";
import type { Issue } from "@/lib/scanner";

type ScanRow = {
  id: string;
  url: string;
  issues: string;
};

type UserRow = {
  id: string;
  isPaid: number;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Must be logged in — we need to know whose quota to check
  const session = await getSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to see step-by-step fixes." },
      { status: 401 }
    );
  }

  const user = db
    .prepare("SELECT id, isPaid FROM users WHERE id = ?")
    .get(session.userId) as UserRow | undefined;

  if (!user) {
    return Response.json({ error: "Account not found." }, { status: 404 });
  }

  // 2. Paid users always get access. Free users get it until they exceed quota.
  if (!user.isPaid) {
    const usedThisMonth = getMonthlyScanCount(user.id);
    if (usedThisMonth > FREE_SCANS_PER_MONTH) {
      return Response.json(
        {
          error: `You've used your ${FREE_SCANS_PER_MONTH} free scans this month. Upgrade to Pro for unlimited access.`,
          upgradeRequired: true,
          usedThisMonth,
          limit: FREE_SCANS_PER_MONTH,
        },
        { status: 402 }
      );
    }
  }

  // 3. Must be a real scan
  const scan = db.prepare("SELECT * FROM scans WHERE id = ?").get(id) as
    | ScanRow
    | undefined;

  if (!scan) {
    return Response.json({ error: "Scan not found." }, { status: 404 });
  }

  const issues: Issue[] = JSON.parse(scan.issues);
  const fixes = generateFixes(issues);

  return Response.json({ scanId: scan.id, url: scan.url, fixes });
}
