
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Client = sequelize.define('Client', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        client_type: {
            type: DataTypes.ENUM('Distribuidor', 'Integrador'),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return Client;
};
