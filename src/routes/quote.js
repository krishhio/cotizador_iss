
const express = require('express');
const router = express.Router();
const { 
    createQuote,
    getQuotesByClient,
    updateQuoteStatus,
    deleteQuote,
    applyDiscountToQuote,
    duplicateQuote,
    getQuotesByDateRange,
    exportQuoteToPDF,
    exportQuoteToExcel
} = require('../controllers/quoteController');

// Crear cotización
router.post('/', createQuote);

// Obtener cotizaciones de un cliente
router.get('/:clientId', getQuotesByClient);

// Actualizar estado de cotización
router.put('/:quoteId', updateQuoteStatus);

// Eliminar cotización
router.delete('/:quoteId', deleteQuote);

// Aplicar descuento a cotización
router.put('/:quoteId/discount', applyDiscountToQuote);

// Duplicar cotización
router.post('/:quoteId/duplicate', duplicateQuote); 

// Filtrar cotizaciones por rango de fechas
router.get('/filter/date', getQuotesByDateRange);

// Exportar cotización a PDF
router.get('/:quoteId/pdf', exportQuoteToPDF);

// Exportar cotización a Excel
router.get('/:quoteId/excel', exportQuoteToExcel);



module.exports = router;
