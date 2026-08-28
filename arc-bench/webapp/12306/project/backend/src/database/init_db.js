const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DEFAULT_DB_FILENAME = 'database.db';

let db = null;
let initPromise = null;
let currentDbPath = resolveDbPath(
  process.env.ARC_DB_FILE || process.env.DATABASE_FILE || DEFAULT_DB_FILENAME,
);

function resolveDbPath(inputPath = DEFAULT_DB_FILENAME) {
  const candidate = String(inputPath || DEFAULT_DB_FILENAME).trim() || DEFAULT_DB_FILENAME;
  return path.resolve(process.cwd(), candidate);
}

function ensureDbDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function getDbPath() {
  return currentDbPath;
}

async function setDbPath(nextPath) {
  const resolvedPath = resolveDbPath(nextPath);
  if (resolvedPath === currentDbPath) {
    return currentDbPath;
  }

  await closeDb();
  currentDbPath = resolvedPath;
  return currentDbPath;
}

function getDb() {
  if (!db) {
    ensureDbDirectory(currentDbPath);
    db = new sqlite3.Database(currentDbPath);
  }
  return db;
}

function runStatement(database, sql) {
  return new Promise((resolve, reject) => {
    database.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function execSchema(database, sql) {
  return new Promise((resolve, reject) => database.exec(sql, (err) => (err ? reject(err) : resolve())));
}

async function initializeDatabase(options = {}) {
  if (options.dbPath) {
    await setDbPath(options.dbPath);
  }
  if (options.reset) {
    await resetDatabaseFile();
  }
  if (initPromise) {
    await initPromise;
    return getDb();
  }

  const database = getDb();
  initPromise = (async () => {
    await runStatement(database, 'PRAGMA foreign_keys = ON;');
    await execSchema(database, `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL, mobile TEXT, password TEXT NOT NULL,
        name TEXT NOT NULL, passport_number TEXT UNIQUE NOT NULL,
        nationality TEXT NOT NULL DEFAULT 'China', passport_expiration_date TEXT,
        birth_date TEXT, gender TEXT DEFAULT 'Male', passenger_type TEXT DEFAULT 'Adult',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS passengers (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
        name TEXT NOT NULL, passport_number TEXT UNIQUE NOT NULL, nationality TEXT NOT NULL,
        passport_expiration_date TEXT, birth_date TEXT, gender TEXT, email TEXT, mobile TEXT,
        passenger_type TEXT DEFAULT 'Adult', is_owner INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT NOT NULL, station_name TEXT NOT NULL,
        UNIQUE(city, station_name)
      );
      CREATE TABLE IF NOT EXISTS guide_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, question TEXT NOT NULL,
        detail TEXT NOT NULL, UNIQUE(category, question)
      );
      CREATE TABLE IF NOT EXISTS trains (
        id INTEGER PRIMARY KEY AUTOINCREMENT, train_no TEXT NOT NULL, from_city TEXT NOT NULL,
        to_city TEXT NOT NULL, from_station TEXT NOT NULL, to_station TEXT NOT NULL,
        travel_date TEXT NOT NULL, departure_time TEXT NOT NULL, arrival_time TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL, train_type TEXT NOT NULL,
        business_price REAL, business_seats INTEGER, first_price REAL, first_seats INTEGER,
        second_price REAL, second_seats INTEGER, standing_price REAL, standing_seats INTEGER,
        UNIQUE(train_no, travel_date)
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL, train_id INTEGER NOT NULL, status TEXT NOT NULL,
        total_price REAL NOT NULL, passenger_json TEXT NOT NULL, refund_deadline TEXT,
        booked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, cancelled_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(train_id) REFERENCES trains(id)
      );
    `);
    await ensureColumn(database, 'orders', 'refund_deadline', 'TEXT');
  })();

  try {
    await initPromise;
  } catch (error) {
    initPromise = null;
    throw error;
  }

  return database;
}

function ensureColumn(database, table, column, definition) {
  return new Promise((resolve, reject) => {
    database.all(`PRAGMA table_info(${table})`, (err, columns) => {
      if (err) return reject(err);
      if (columns.some((item) => item.name === column)) return resolve();
      database.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (alterError) => {
        if (alterError) return reject(alterError);
        resolve();
      });
    });
  });
}

function closeDb() {
  if (!db) {
    initPromise = null;
    return Promise.resolve();
  }

  const currentDb = db;
  db = null;
  initPromise = null;
  return new Promise((resolve, reject) => {
    currentDb.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function removeDatabaseFile(targetPath = currentDbPath) {
  const resolvedPath = resolveDbPath(targetPath);
  if (resolvedPath === currentDbPath) {
    await closeDb();
  }
  if (fs.existsSync(resolvedPath)) {
    fs.rmSync(resolvedPath, { force: true });
  }
}

async function resetDatabaseFile(targetPath = currentDbPath) {
  await removeDatabaseFile(targetPath);
}

module.exports = {
  DEFAULT_DB_FILENAME,
  resolveDbPath,
  getDbPath,
  setDbPath,
  getDb,
  initializeDatabase,
  closeDb,
  removeDatabaseFile,
  resetDatabaseFile,
};
