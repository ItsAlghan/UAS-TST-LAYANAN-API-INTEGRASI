const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// VERCEL TRICK: Gunakan process.cwd() untuk menemukan file database yang di-upload
const dbPath = path.resolve(process.cwd(), 'data', 'stock.db');

// Pastikan folder data ada (untuk lokal)
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)){
    try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) {}
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Gagal membuka SQLite:', err.message);
  else console.log('Terhubung ke SQLite di:', dbPath);
});

// Wrapper Promise
const pool = {
  execute: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err); else resolve([rows, null]);
        });
      } else {
        db.run(sql, params, function (err) {
          if (err) reject(err); else resolve([{ insertId: this.lastID, affectedRows: this.changes }, null]);
        });
      }
    });
  },
  query: (sql, params) => pool.execute(sql, params)
};

module.exports = pool;