
const { Quote, QuoteItem, Client, Product } = require('../models');
const { Op, Sequelize } = require('sequelize');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');


// Crear una nueva cotización
exports.createQuote = async (req, res) => {
    try {
        const { clientId, items, generalDiscountPercent } = req.body;

        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: `Cliente con id ${clientId} no encontrado` });
        }

        const quote = await Quote.create({
            client_id: clientId,
            general_discount_percent: generalDiscountPercent,
            total_amount: 0
        });

        let total = 0;

        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Producto con id ${item.productId} no encontrado` });
            }

            const totalPrice = item.quantity * product.msrp_usd * (1 - (item.discountPercent || 0) / 100);

            await QuoteItem.create({
                quote_id: quote.id,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: product.msrp_usd,
                discount_percent: item.discountPercent,
                total_price: totalPrice
            });

            total += totalPrice;
        }

        total = total * (1 - (generalDiscountPercent || 0) / 100);
        await quote.update({ total_amount: total });

        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las cotizaciones de un cliente
exports.getQuotesByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const quotes = await Quote.findAll({
            where: { client_id: clientId },
            include: [{ model: QuoteItem, include: [Product] }]
        });
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar estado de cotización
exports.updateQuoteStatus = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const { status } = req.body;

        const quote = await Quote.findByPk(quoteId);
        if (!quote) {
            return res.status(404).json({ error: "Cotización no encontrada" });
        }

        await quote.update({ status });
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una cotización
exports.deleteQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const quote = await Quote.findByPk(quoteId);
        if (!quote) {
            return res.status(404).json({ error: "Cotización no encontrada" });
        }

        await quote.destroy();
        res.status(200).json({ message: "Cotización eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Aplicar descuento a una cotización
exports.applyDiscountToQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const { discountPercent } = req.body;

        const quote = await Quote.findByPk(quoteId, {
            include: [{ model: QuoteItem, include: [Product] }]
        });

        if (!quote) {
            return res.status(404).json({ error: `Cotización con id ${quoteId} no encontrada` });
        }

        let total = 0;

        for (const item of quote.QuoteItems) {
            const totalPrice = item.quantity * item.unit_price * (1 - (item.discount_percent || 0) / 100);
            total += totalPrice;
        }

        total = total * (1 - discountPercent / 100);
        await quote.update({ general_discount_percent: discountPercent, total_amount: total });

        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Duplicar cotización
exports.duplicateQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const originalQuote = await Quote.findByPk(quoteId, { include: [QuoteItem] });

        if (!originalQuote) {
            return res.status(404).json({ error: "Cotización no encontrada" });
        }

        const newQuote = await Quote.create({
            client_id: originalQuote.client_id,
            general_discount_percent: originalQuote.general_discount_percent,
            total_amount: originalQuote.total_amount
        });

        for (const item of originalQuote.QuoteItems) {
            await QuoteItem.create({
                quote_id: newQuote.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount_percent: item.discount_percent,
                total_price: item.total_price
            });
        }

        res.status(201).json(newQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Filtrar cotizaciones por rango de fechas
exports.getQuotesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Fecha inicial y final son obligatorias" });
        }

        const quotes = await Quote.findAll({
            where: Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('createdAt')),
                {
                    [Op.between]: [startDate, endDate]
                }
            )
        });

        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exportar cotización a PDF
exports.exportQuoteToPDF = async (req, res) => {
    try {
        console.log('🟠 [START] Generando PDF para cotización ID:', req.params.quoteId);
        
        const { quoteId } = req.params;
        const quote = await Quote.findByPk(quoteId, {
            include: [
                { model: QuoteItem, include: [Product] },
                { model: Client }
            ]
        });

        if (!quote) {
            console.log('❌ [ERROR] Cotización no encontrada');
            return res.status(404).json({ error: "Cotización no encontrada" });
        }

        console.log('✅ [INFO] Cotización encontrada:', quote.toJSON());

        // Crear el documento PDF
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // 🔥 Primero se conecta el stream de salida
        res.setHeader('Content-Disposition', `attachment; filename="quote-${quoteId}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // ✅ Encabezado
        doc.fontSize(20).text('Cotización', { align: 'center' });
        doc.moveDown();

        // ✅ Datos generales
        doc.fontSize(12).text(`Fecha: ${new Date(quote.createdAt).toLocaleDateString()}`);
        doc.text(`Cliente: ${quote.Client.name}`);
        doc.text(`Descuento General: ${quote.general_discount_percent}%`);
        doc.moveDown();

        // ✅ Tabla de productos
        const tableTop = 150;
        const itemLeft = 50;
        const itemWidth = 80;
        const descriptionWidth = 230;
        const qtyWidth = 50;
        const unitPriceWidth = 80;
        const totalPriceWidth = 80;

        // Encabezados de tabla
        doc.fontSize(10).text('Modelo', itemLeft, tableTop, { width: itemWidth, align: 'left' });
        doc.text('Descripción', itemLeft + itemWidth, tableTop, { width: descriptionWidth, align: 'left' });
        doc.text('Cantidad', itemLeft + itemWidth + descriptionWidth, tableTop, { width: qtyWidth, align: 'center' });
        doc.text('Unitario', itemLeft + itemWidth + descriptionWidth + qtyWidth, tableTop, { width: unitPriceWidth, align: 'right' });
        doc.text('Total', itemLeft + itemWidth + descriptionWidth + qtyWidth + unitPriceWidth, tableTop, { width: totalPriceWidth, align: 'right' });

        // Línea debajo de encabezado
        doc.moveTo(itemLeft, tableTop + 15)
            .lineTo(itemLeft + itemWidth + descriptionWidth + qtyWidth + unitPriceWidth + totalPriceWidth, tableTop + 15)
            .stroke();

        let position = tableTop + 20;

        // ✅ Agregar cada ítem de la cotización
        for (const item of quote.QuoteItems) {
            console.log(`🟠 [ITEM] ${item.Product.part_number} x${item.quantity}`);

            const unitPrice = parseFloat(item.unit_price) || 0; 
            const totalPrice = parseFloat(item.total_price) || 0;

            doc.fontSize(10).text(item.Product.part_number, itemLeft, position, { width: itemWidth, align: 'left' });
            
            // Descripción controlada para evitar que se desborde
            doc.text(item.Product.description, itemLeft + itemWidth, position, { width: descriptionWidth, align: 'left', lineGap: 4 });
            
            doc.text(item.quantity.toString(), itemLeft + itemWidth + descriptionWidth, position, { width: qtyWidth, align: 'center' });
            doc.text(`$${unitPrice.toFixed(2)}`, itemLeft + itemWidth + descriptionWidth + qtyWidth, position, { width: unitPriceWidth, align: 'right' });
            doc.text(`$${totalPrice.toFixed(2)}`, itemLeft + itemWidth + descriptionWidth + qtyWidth + unitPriceWidth, position, { width: totalPriceWidth, align: 'right' });

            position += 25;  // 🔥 Mayor separación entre filas para mejorar legibilidad
        }

        // ✅ Total
        doc.moveTo(itemLeft, position + 5)
            .lineTo(itemLeft + itemWidth + descriptionWidth + qtyWidth + unitPriceWidth + totalPriceWidth, position + 5)
            .stroke();

        doc.fontSize(14).font('Helvetica-Bold').text(`Total: $${parseFloat(quote.total_amount || 0).toFixed(2)}`, itemLeft + itemWidth + descriptionWidth + qtyWidth + unitPriceWidth, position + 10, { align: 'right' });

        // ✅ Notas adicionales
        doc.moveDown();
        doc.fontSize(10).text('Notas adicionales:');
        doc.fontSize(9).text('1. Validez de cotización: 30 días', { width: 500 });
        doc.fontSize(9).text('2. Forma de pago: Transferencia bancaria', { width: 500 });

        // ✅ Cierre controlado mediante evento 'finish'
        doc.end();
        console.log('✅ [INFO] Documento PDF cerrado');

        doc.on('finish', () => {
            console.log('✅ [FINISH] PDF enviado correctamente');
            res.end();
        });

    } catch (error) {
        console.error('❌ [ERROR] Error al generar PDF:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }

};

// Exportar cotización a Excel
exports.exportQuoteToExcel = async (req, res) => {
    try {
        console.log('🟠 [START] Generando Excel para cotización ID:', req.params.quoteId);

        const { quoteId } = req.params;
        const quote = await Quote.findByPk(quoteId, {
            include: [
                { model: QuoteItem, include: [Product] },
                { model: Client }
            ]
        });

        if (!quote) {
            console.log('❌ [ERROR] Cotización no encontrada');
            return res.status(404).json({ error: "Cotización no encontrada" });
        }

        console.log('✅ [INFO] Cotización encontrada:', quote.toJSON());

        // Crear el workbook y la hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotización');

        // ✅ ENCABEZADO
        worksheet.mergeCells('A1:I1');
        worksheet.getCell('A1').value = 'COTIZACIÓN';
        worksheet.getCell('A1').font = { size: 20, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // ✅ DATOS GENERALES
        worksheet.getCell('A3').value = 'Fecha:';
        worksheet.getCell('B3').value = new Date(quote.createdAt).toLocaleDateString();

        worksheet.getCell('A4').value = 'Cliente:';
        worksheet.getCell('B4').value = quote.Client.name;

        worksheet.getCell('A5').value = 'Descuento General:';
        worksheet.getCell('B5').value = `${quote.general_discount_percent}%`;

        // ✅ TABLA DE PRODUCTOS
        const headerRow = worksheet.addRow(['Sección', 'Modelo', 'Compatible', 'Descripción', 'Cantidad', 'Unitario', 'Total']);

        headerRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDEBF7' } };
        });

        let totalAmount = 0;

        for (const item of quote.QuoteItems) {
            const unitPrice = parseFloat(item.unit_price) || 0;
            const totalPrice = parseFloat(item.total_price) || 0;

            worksheet.addRow([
                'SecurOS®',
                item.Product.part_number,
                item.Product.compatibility,
                item.Product.description,
                item.quantity,
                `$${unitPrice.toFixed(2)}`,
                `$${totalPrice.toFixed(2)}`
            ]);

            totalAmount += totalPrice;
        }

        // ✅ TOTAL GENERAL
        worksheet.addRow([]);
        const totalRow = worksheet.addRow(['', '', '', '', '', 'TOTAL:', `$${totalAmount.toFixed(2)}`]);
        totalRow.getCell(6).font = { bold: true };
        totalRow.getCell(7).font = { bold: true };

        // ✅ NOTAS ADICIONALES
        worksheet.addRow([]);
        worksheet.addRow(['NOTAS ADICIONALES']);
        worksheet.addRow(['1. Validez de cotización: 30 días']);
        worksheet.addRow(['2. Forma de pago: Transferencia bancaria']);

        // Establecer ancho de columnas para mejor visibilidad
        worksheet.columns.forEach(column => {
            column.width = 25;
        });

        // ✅ Enviar el archivo como descarga
        res.setHeader('Content-Disposition', `attachment; filename="quote-${quoteId}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        await workbook.xlsx.write(res);
        res.end();

        console.log('✅ [INFO] Excel generado correctamente');

    } catch (error) {
        console.error('❌ [ERROR] Error al generar Excel:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
};
