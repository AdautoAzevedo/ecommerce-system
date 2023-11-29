const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnector');

const Order = sequelize.define("orders", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true, 
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: { 
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unpaid', 
    },
},{
    timestamps: false,
    createdAt: false
});

module.exports = Order;