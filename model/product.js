const {DataTypes} = require('sequelize');
const sequelize = require('../dbConnector');
const Category = require('./category');

const Product = sequelize.define('products', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type:DataTypes.STRING
    },
    product_price: {
        type: DataTypes.DECIMAL
    }
},{
    timestamps: false,
    createdAt: false
});


module.exports = Product;
