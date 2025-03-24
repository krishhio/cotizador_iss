
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const QuoteItem = sequelize.define('QuoteItem', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discount_percent: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0
        },
        total_price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        }
    });
    return QuoteItem;
};
