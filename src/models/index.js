
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect,
        logging: console.log  // 👈 Esto activa el log de consultas SQL
    }
);

const Client = require('./client')(sequelize);
const Product = require('./product')(sequelize);
const Quote = require('./quote')(sequelize);
const QuoteItem = require('./quoteItem')(sequelize);

Client.hasMany(Quote, { foreignKey: 'client_id' });
Quote.belongsTo(Client, { foreignKey: 'client_id' });

Quote.hasMany(QuoteItem, { foreignKey: 'quote_id' });
QuoteItem.belongsTo(Quote, { foreignKey: 'quote_id' });

QuoteItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(QuoteItem, { foreignKey: 'product_id' });

sequelize.sync();

module.exports = {
    sequelize,
    Client,
    Product,
    Quote,
    QuoteItem
};
