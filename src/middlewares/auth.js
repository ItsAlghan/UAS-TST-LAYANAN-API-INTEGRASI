module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = 'kuncirahasia123'; // Hardcode untuk demo
  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ status: 'error', message: 'API Key Salah/Tidak Ada' });
  }
  next();
};