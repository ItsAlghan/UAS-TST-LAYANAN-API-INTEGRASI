const pool = require('../config/database');

// ... import pool di atas ...

exports.getStockAnalysis = async (req, res) => {
  try {
    const { code } = req.params;

    // --- SETUP AUTH ---
    // Pastikan Key ini benar (yang tadi sudah berhasil masuk tapi ditolak body-nya)
    const FRIEND_API_KEY = '1be9d6c60c33cbac84f282c270efeebaee8127fefc461ff9292b362ba7680f58'; 
    const FRIEND_HEADER_NAME = 'x-api-key'; // Cek swagger, kalau Bearer ganti 'Authorization'

    // 1. AMBIL DATA LOKAL
    const [rows] = await pool.query('SELECT * FROM stocks WHERE code = ?', [code]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Saham tidak ditemukan' });
    }
    const stock = rows[0];

    // 2. SIAPKAN PROMPT
    const promptText = `Tolong analisa saham ${stock.code} (${stock.name}). Sektor: ${stock.sector}, Harga: ${stock.last_price}, Market Cap: ${stock.market_cap}. Berikan rekomendasi singkat (Buy/Hold/Sell).`;

    console.log(`>> [DEBUG] Mengirim Prompt Analisa ke AI (via Start Session)...`);

    // --- LANGKAH 1: START SESSION + KIRIM PESAN LANGSUNG ---
    // Karena server minta "Initial message", kita kirim prompt-nya di sini!
    const startResponse = await fetch('https://ai.ibayderikfariqalghanzaka.my.id/api/chat/start', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          [FRIEND_HEADER_NAME]: FRIEND_API_KEY 
      },
      // UPDATE PENTING: Kita isi body-nya sekarang!
      body: JSON.stringify({ 
          message: promptText, // Kunci yang diminta server
          prompt: promptText   // Jaga-jaga kalau dia pakai nama lain
      })
    });

    if (!startResponse.ok) {
        const errText = await startResponse.text();
        throw new Error(`Gagal Start Session (${startResponse.status}): ${errText}`);
    }

    const aiResult = await startResponse.json();
    console.log('>> [DEBUG] Balasan Server:', JSON.stringify(aiResult).substring(0, 100) + '...');

    // --- 5. URAI JAWABAN (PARSING) ---
    let aiAnalysis = null;
    
    // Cek berbagai kemungkinan format jawaban teman
    if (aiResult.message && aiResult.message.content) {
        aiAnalysis = aiResult.message.content; // Format standar
    } else if (aiResult.data && aiResult.data.reply) {
        aiAnalysis = aiResult.data.reply;
    } else if (aiResult.reply) {
        aiAnalysis = aiResult.reply;
    }

    if (!aiAnalysis) aiAnalysis = "AI merespon sukses, tapi format teks tidak ditemukan.";
    
    // 4. HASIL AKHIR
    res.json({
      status: 'success',
      service: 'Smart Stock Insight',
      data: {
        stock_data: stock,
        ai_recommendation: aiAnalysis
      }
    });

  } catch (error) {
    console.error('>> [ERROR]', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal Integrasi', error: error.message });
  }
};

// --- FUNGSI LOCAL LAINNYA
exports.getAllStocks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const [rows] = await pool.query('SELECT * FROM stocks LIMIT ? OFFSET ?', [limit, offset]);
        res.json({ status: 'success', data: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.searchStocks = async (req, res) => {
    try {
        const keyword = `%${req.query.q}%`;
        const [rows] = await pool.query('SELECT * FROM stocks WHERE code LIKE ? OR name LIKE ?', [keyword, keyword]);
        res.json({ status: 'success', data: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getSectorStats = async (req, res) => { res.json({ status: 'success', data: [] }); }; 
exports.getTopBigCap = async (req, res) => { res.json({ status: 'success', data: [] }); };
exports.sortStocks = async (req, res) => { res.json({ status: 'success', data: [] }); };
exports.filterBySector = async (req, res) => { res.json({ status: 'success', data: [] }); };
exports.getStockByCode = async (req, res) => { 
    const [rows] = await pool.query('SELECT * FROM stocks WHERE code = ?', [req.params.code]);
    if(rows.length>0) res.json({status:'success', data:rows[0]}); else res.status(404).json({error:'Not found'});
};