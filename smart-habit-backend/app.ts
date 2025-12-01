import "dotenv/config";
import express from "express";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { genSaltSync } from "bcrypt-ts";
import { PasswordHasher, VerifyPassword } from "./util/passwordHashing";

const app = express();
const port = 3000;

app.use(express.json());

const salt = genSaltSync(10);

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite DB");
});

db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);

  // Habits Table (tied to user)
  db.run(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        frequency TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`);

  // Habit Logs Table
  db.run(`CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    )`);

  // Reminder Settings Table (per user)
  db.run(`CREATE TABLE IF NOT EXISTS reminder_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        time TEXT NOT NULL,
        enabled INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`);
});

// =========================================================================
//                          USER - CONTROLLER ENDPTS
// =========================================================================

app.post("/api/users/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All Fields Mandatory" });
  }

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  const hashedPassword = PasswordHasher(password);

  db.run(sql, [username, email, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: uuidv4(), username, email });
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT id, username, email, password FROM users WHERE email = ?";

  db.get(sql, [email], (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isValidPassword = VerifyPassword(password, row.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    res.json({
      id: row.id,
      username: row.username,
      email: row.email,
    });
  });
});

// =========================================================================
//                          HABIT ENDPTS (User-specfic) CRUD
// =========================================================================

// Read
app.get('/api/habits/:userId', (req, res) => {
    const {userId} = req.params;

    db.all("SELECT * FROM habits WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
  });
});

// Create
app.post('/api/habits/', (req, res) => {
    const { userId, name, frequency } = req.body;

  if (!userId || !name || !frequency) {
    return res
      .status(400)
      .json({ error: "userId, name, and frequency required" });
  }

  const sql = "INSERT INTO habits (user_id, name, frequency) VALUES (?, ?, ?)";

  db.run(sql, [userId, name, frequency], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ id: this.lastID, userId, name, frequency });
  });
});

// Delete

app.delete("/api/habits/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM habits WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Deleted", changes: this.changes });
  });
});

// Log habit completion
app.post("/api/habits/log", (req, res) => {
  const { habitId, date } = req.body;

  if (!habitId || !date) {
    return res.status(400).json({ error: "habitId and date required" });
  }

  const sql = "INSERT INTO habit_logs (habit_id, date) VALUES (?, ?)";
  db.run(sql, [habitId, date], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, habitId, date });
  });
});

// =========================================================================
//                         REPORT ENDPT (User-specfic) CRUD
// =========================================================================

app.get("/api/reports/weekly/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
        SELECT h.name, COUNT(l.id) as completions
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id
            AND l.date >= date('now', '-7 days')
        WHERE h.user_id = ?
        GROUP BY h.id
    `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ report: "weekly", data: rows });
  });
});

app.get("/api/reports/monthly/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
        SELECT h.name, COUNT(l.id) as completions
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id
            AND l.date >= date('now', '-30 days')
        WHERE h.user_id = ?
        GROUP BY h.id
    `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ report: "monthly", data: rows });
  });
});

// =========================================================================
//                         REMINDER ENDPT ENDPT (User-specfic) CRUD
// =========================================================================

app.get("/api/reminders/:userId", (req, res) => {
  const { userId } = req.params;

  db.get(
    "SELECT * FROM reminder_settings WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: row });
    }
  );
});

app.put("/api/reminders/:userId", (req, res) => {
  const { userId } = req.params;
  const { time, enabled } = req.body;

  const sql = `INSERT OR REPLACE INTO reminder_settings (user_id, time, enabled) 
                 VALUES (?, ?, ?)`;
  db.run(sql, [userId, time, enabled ? 1 : 0], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Updated", userId, time, enabled });
  });
});

// =========================================================================
//                         SEVER STARTING CODE
// =========================================================================

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
