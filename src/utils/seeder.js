const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/database');
const path = require('path');

const cleanNumber = (str) => {
  if (!str) return 0;
  let cleanStr = str.toString().replace(/[^0-9.,-]/g, '');
  if (cleanStr.indexOf('.') > -1 && cleanStr.split('.')[1].length === 3) {
      cleanStr = cleanStr.replace(/\./g, '');
  }
  return parseFloat(cleanStr) || 0;
};

const seedDatabase = async () => {
  try {
      // Cek apakah tabel sudah ada isinya
      const [rows] = await pool.query("SELECT count(*) as c FROM sqlite_master WHERE type='table' AND name='stocks'");
      

      console.log('>> [DEBUG] Mulai Seeding Ulang...');
      
      // Buat tabel ulang biar bersih
      await pool.query('DROP TABLE IF EXISTS stocks');
      await pool.query(`CREATE TABLE stocks (
          code TEXT PRIMARY KEY, name TEXT, sector TEXT, last_price REAL, market_cap REAL
      )`);

      const results = [];
      const csvPath = path.join(process.cwd(), 'DaftarSaham.csv');
      
      if(!fs.existsSync(csvPath)) {
          console.error(">> [ERROR] File CSV tidak ditemukan di: " + csvPath);
          return;
      }

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('headers', (headers) => {
            console.log('>> [INFO] Kolom CSV yang terbaca:', headers);
        })
        .on('data', (d) => {
           // COBA SEMUA KEMUNGKINAN NAMA KOLOM
           const code = d.Code || d.Kode || d.Symbol;
           const name = d.Name || d.Nama;
           const sector = d.Sector || d.Sektor || 'Misc';
           const priceRaw = d.LastPrice || d.Last || d.Close || d['Last Price'] || '0';
           const capRaw = d.MarketCap || d['Market Cap'] || d.Capitalization || '0';

           if(code) {
               results.push([
                   code, name, sector, 
                   cleanNumber(priceRaw), 
                   cleanNumber(capRaw)
               ]);
           }
        })
        .on('end', async () => {
           console.log(`>> [INFO] Berhasil membaca ${results.length} baris data.`);
           if (results.length > 0) {
               // Cek data pertama untuk memastikan tidak 0
               console.log('>> [CONTOH DATA]', results[0]); 
           }

           for(let row of results) {
              await pool.query('INSERT OR IGNORE INTO stocks VALUES (?,?,?,?,?)', row);
           }
           console.log('>> [SUKSES] Database berhasil di-update.');
        });
  } catch(e) {
      console.error('>> [ERROR SEEDER]', e);
  }
};
module.exports = seedDatabase;