
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Quote = sequelize.define('Quote', {
        status: {
            type: DataTypes.ENUM('Pendiente', 'Aceptada', 'Rechazada'),
            defaultValue: 'Pendiente'
        },
        total_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        general_discount_percent: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0
        }
    });
    return Quote;
};
