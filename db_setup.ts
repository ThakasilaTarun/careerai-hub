import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

const setup = () => {
  db.serialize(() => {
    // Users (Common for both Admin and Student)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      profile_pic TEXT
    )`);

    // Students
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      roll_no TEXT,
      cgpa REAL,
      branch TEXT,
      skills TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Companies
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      website TEXT,
      logo TEXT
    )`);

    // Jobs/Placements
    db.run(`CREATE TABLE IF NOT EXISTS placements (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      title TEXT,
      package TEXT,
      location TEXT,
      type TEXT,
      eligibility TEXT,
      deadline TEXT,
      posted_on TEXT,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // Interviews
    db.run(`CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      company_id TEXT,
      date TEXT,
      time TEXT,
      status TEXT,
      meeting_link TEXT,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // Notifications
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      message TEXT,
      type TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    console.log('SQL Database tables created successfully.');
  });
};

setup();
db.close();
