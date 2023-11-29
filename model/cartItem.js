const {DataTypes} = require('sequelize');
const sequelize = require('../dbConnector');

const CartItem = sequelize.define('cartItems', {
    cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
},{
    timestamps: false,
    createdAt: false
});

module.exports = CartItem;