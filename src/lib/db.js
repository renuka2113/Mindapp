import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'mindguard.db');
const db = new Database(dbPath);


db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    college_name TEXT,
    branch TEXT,
    year INTEGER,
    current_streak INTEGER DEFAULT 0,
    wellness_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Raw UI Inputs
    sleep_duration REAL,
    sleep_quality INTEGER,
    study_hours REAL,
    academic_workload INTEGER,
    physical_activity REAL,
    social_interaction INTEGER,
    social_media REAL,
    mood_level INTEGER,
    stress_level INTEGER,
    anxiety_level INTEGER,
    
    -- Curated Scores (Sent to ML)
    sleep_score REAL,
    leisure_score REAL,
    phone_score REAL,
    social_score REAL,
    me_score REAL,
    
    risk_score INTEGER,
    ai_status TEXT,
    ai_code INTEGER,
    ai_trigger TEXT,
    ai_shap_json TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    task_title TEXT NOT NULL,
    task_detail TEXT NOT NULL,
    category TEXT,        
    priority TEXT,
    is_completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;