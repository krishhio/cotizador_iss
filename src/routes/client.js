
const express = require('express');
const router = express.Router();
const { 
    createClient,
    getClients,
    updateClient,
    deleteClient 
} = require('../controllers/clientController');

// Crear cliente
router.post('/', createClient);

// Obtener todos los clientes
router.get('/', getClients);

// Actualizar cliente
router.put('/:clientId', updateClient);

// Eliminar cliente (soft delete)
router.delete('/:clientId', deleteClient);

module.exports = router;
