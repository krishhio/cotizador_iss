
const { Product } = require('../models');

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const { category, partNumber, compatibility, description, msrpUsd, isSelected } = req.body;
        if (!category || !partNumber || !description || !msrpUsd) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        const product = await Product.create({
            category,
            part_number: partNumber,
            compatibility,
            description,
            msrp_usd: msrpUsd,
            is_selected: isSelected || false
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { category, partNumber, compatibility, description, msrpUsd } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await product.update({ category, partNumber, compatibility, description, msrp_usd: msrpUsd });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Filtrar productos por categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ error: "Categoría es obligatoria" });
        }

        const products = await Product.findAll({ where: { category } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
