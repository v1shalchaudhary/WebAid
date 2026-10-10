import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "scans.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    isPaid INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    userId TEXT,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    statusCode INTEGER,
    responseTimeMs INTEGER,
    issues TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fix_unlocks (
    userId TEXT NOT NULL,
    scanId TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    PRIMARY KEY (userId, scanId)
  );
`);

export default db;
