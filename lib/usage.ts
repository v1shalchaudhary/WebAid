import db from "./db";

export const FREE_FIXES_PER_MONTH = 3;

export function startOfMonthISO(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// How many different scans this user has unlocked fixes for this month.
export function getMonthlyFixCount(userId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM fix_unlocks WHERE userId = ? AND createdAt >= ?")
    .get(userId, startOfMonthISO()) as { count: number };
  return row.count;
}

export function hasUnlocked(userId: string, scanId: string): boolean {
  return !!db
    .prepare("SELECT 1 FROM fix_unlocks WHERE userId = ? AND scanId = ?")
    .get(userId, scanId);
}

export function recordUnlock(userId: string, scanId: string) {
  db.prepare("INSERT OR IGNORE INTO fix_unlocks (userId, scanId, createdAt) VALUES (?, ?, ?)").run(
    userId,
    scanId,
    new Date().toISOString()
  );
}
