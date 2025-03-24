
const express = require('express');
const router = express.Router();
const { 
    createProduct,
    getProducts,
    updateProduct,
    getProductsByCategory 
} = require('../controllers/productController');

// Crear producto
router.post('/', createProduct);

// Obtener todos los productos
router.get('/', getProducts);

// Actualizar producto
router.put('/:productId', updateProduct);

// Filtrar productos por categoría
router.get('/category', getProductsByCategory);

module.exports = router;
