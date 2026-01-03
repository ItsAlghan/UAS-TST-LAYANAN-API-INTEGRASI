const express = require('express');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const stockRoutes = require('./routes/stockRoutes');
const seedDatabase = require('./utils/seeder');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve Frontend

// Routes
app.get('/api-docs.json', (req, res) => res.json(swaggerSpecs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/stocks', stockRoutes);

// Auth Token Helper
app.get('/api/auth/token', (req, res) => {
    res.json({ status: 'success', key: 'kuncirahasia123' });
});

// Root URL ke Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Logic start server (Hanya jalan di local, Vercel ignore ini)
if (require.main === module) {
    const PORT = 3003;
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await seedDatabase(); // Auto seed di local
    });
}

module.exports = app;