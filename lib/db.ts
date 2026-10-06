import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "scans.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    isPaid INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    userId TEXT,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    statusCode INTEGER,
    responseTimeMs INTEGER,
    issues TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export default db;
