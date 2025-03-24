const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NUEVO
const clientRoutes = require('./routes/client');
const productRoutes = require('./routes/product');
const quoteRoutes = require('./routes/quote');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para log de solicitudes
app.use(morgan('dev'));

// Middleware para manejar JSON
app.use(bodyParser.json());

// Rutas
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log detallado del error en consola
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor corriendo en el puerto ${PORT}`));
