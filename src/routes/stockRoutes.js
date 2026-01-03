const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const auth = require('../middlewares/auth');

// Endpoint Integrasi
router.get('/:code/analysis', auth, stockController.getStockAnalysis);

// Endpoint Biasa
router.get('/search', auth, stockController.searchStocks);
router.get('/', auth, stockController.getAllStocks);

module.exports = router;