const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnector');

const Cart = sequelize.define("carts", {
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    }
},{
    timestamps: false,
    createdAt: false
});

module.exports = Cart;