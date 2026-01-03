const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Stock Insight (Integration)',
      version: '2.0.0',
      description: 'Layanan Integrasi Saham + AI Chatbot.\n\nKey: **kuncirahasia123**'
    },
    servers: [
      { url: 'https://stb-integrasi.vercel.app', description: 'Vercel Server' }, // Ganti URL nanti
      { url: 'http://localhost:3003', description: 'Localhost' }
    ],
    components: {
        securitySchemes: { ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' } }
    },
    security: [{ ApiKeyAuth: [] }]
  },
  apis: ['./src/routes/*.js'], // Auto-scan routes
};
module.exports = swaggerJsdoc(options);