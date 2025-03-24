const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        part_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        compatibility: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        msrp_usd: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        is_selected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return Product;
};
