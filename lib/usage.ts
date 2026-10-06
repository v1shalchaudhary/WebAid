import db from "./db";

type CountRow = { count: number };

// Counts how many scans this user has made since the 1st of the current month.
export function getMonthlyScanCount(userId: string): number {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const row = db
    .prepare(
      `SELECT COUNT(*) as count FROM scans WHERE userId = ? AND createdAt >= ?`
    )
    .get(userId, startOfMonth.toISOString()) as CountRow;

  return row.count;
}

export const FREE_SCANS_PER_MONTH = 3;
