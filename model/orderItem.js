const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnector');

const OrderItem = sequelize.define('orderItems', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
},{
    timestamps: false,
    createdAt: false
});

module.exports = OrderItem;