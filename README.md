# SMART STOCK INSIGHT

**Smart Stock Insight** adalah platform analisis saham cerdas yang menggabungkan **Layanan Microservice Data Saham** dengan **Layanan AI Chatbot**.

Proyek ini dibuat untuk memenuhi **UAS TST** - Tahap Integrasi Layanan.

## Arsitektur Integrasi

Layanan ini bekerja dengan model **Orkestrasi Data**:
1.  **User** meminta analisa saham (contoh: `BBCA`).
2.  **Backend** mencari data fundamental (Harga, Market Cap, Sektor) dari **Database Lokal (SQLite)**.
3.  **Backend** mengirim prompt otomatis berisi data tersebut ke **API AI Chatbot (Partner Service)**.
4.  **Backend** menggabungkan data teknis dan narasi AI, lalu menampilkannya kembali ke User.

## Fitur Utama

1.  **Dashboard UI Modern**: Antarmuka web yang bersih untuk mencari dan menganalisa saham.
2.  **Hybrid Data Source**: Menggabungkan data kuantitatif (Database) dan kualitatif (AI).
3.  **Session-Based AI Interaction**: Sistem otomatis membuka sesi chat (`/start`) dan mengirim prompt (`/message`) ke layanan AI teman.
4.  **Auto-Seeding Database**: Database otomatis ter-generate dari file CSV saat server pertama kali dijalankan.
5.  **Secure Access**: Dilindungi dengan API Key (`kuncirahasia123`).

## Cara Menjalankan di Lokal (Laptop)

Ikuti langkah ini untuk menjalankan server di komputer Anda:

### 1. Prasyarat
-   Node.js (Versi 18 atau terbaru).
-   Git.

### 2. Instalasi
Clone repository ini atau download folder source code.
```bash
# Masuk ke folder proyek
cd TST_INTEGRASI_LAYANAN

# Install dependency
npm install

### 3. Jalankan Server
Perintah ini akan menyalakan server sekaligus membuat database stock.db dari file CSV.
node src/app.js

Jika berhasil, akan muncul pesan:
Server running on port 3003 [SUKSES] Database Siap.

### 4. Akses Aplikasi
Buka browser dan kunjungi:
Dashboard Web: http://localhost:3003

📚 Dokumentasi API
Berikut adalah endpoint utama yang tersedia:

1. Analisa Saham (Integrasi AI)
Mengambil data saham + rekomendasi AI.
Method: GET
URL: /api/stocks/{code}/analysis
Header: x-api-key: kuncirahasia123
Contoh: /api/stocks/BBCA/analysis

2. Cari Saham
Mencari saham berdasarkan kode atau nama.
Method: GET
URL: /api/stocks/search?q={keyword}

3. Cek Token
Mendapatkan API Key untuk demo.
Method: GET
URL: /api/auth/token

Konfigurasi Kunci
API Key Internal: Default adalah kuncirahasia123 (Bisa diubah di src/middlewares/auth.js).
API Key Partner (AI): Hardcoded di src/controllers/stockController.js. Jika layanan AI teman mengganti kunci, update variabel FRIEND_API_KEY di file tersebut.

Pembuat
Nama: Alghan Pridanusuta NIM: 18223058
