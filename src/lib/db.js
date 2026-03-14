import Database from 'better-sqlite3';
import path from 'path';

// 1. Create or connect to the local SQLite file (it will appear in your project root)
const dbPath = path.resolve(process.cwd(), 'mindguard.db');
const db = new Database(dbPath);

// 2. Write the SQL to create the Users table
// We use IF NOT EXISTS so it only runs once
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    wellness_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;