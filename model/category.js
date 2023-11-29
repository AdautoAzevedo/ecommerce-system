const {DataTypes} = require('sequelize');
const sequelize = require('../dbConnector');
const Product = require('./product');

const Category = sequelize.define('categories', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type:DataTypes.STRING
    },
},{
    timestamps: false,
    createdAt: false
});

module.exports = Category;