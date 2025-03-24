
const { Client } = require('../models');

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
    try {
        const { name, clientType, email, phone } = req.body;
        if (!name || !clientType || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        const client = await Client.create({ name, client_type: clientType, email, phone });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los clientes
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar cliente
exports.updateClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { name, email, phone, clientType } = req.body;

        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        await client.update({ name, email, phone, client_type: clientType });
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete de cliente
exports.deleteClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        await client.update({ isActive: false });
        res.status(200).json({ message: "Cliente desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
